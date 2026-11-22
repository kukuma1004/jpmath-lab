import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { BallState, TableConfig, Vec2 } from '../physics/types';
import { MaterialKit, ballTexture, poolBallTexture } from './MaterialKit';
import { createTable, createCue, createRoom } from './TableFactory';
import { disposeModel } from './Geometry';

type CameraMode = 'top' | 'cue';
const DEFAULT_TABLE: TableConfig = { width: 2.84, height: 1.42, ballRadius: .03075, ballMass: .21 };

/** Pure presentation: this class never changes physics positions or velocities. */
export class SceneManager {
  readonly renderer: THREE.WebGLRenderer;
  readonly camera = new THREE.PerspectiveCamera(39, 1, .025, 35);
  readonly scene = new THREE.Scene();
  private readonly materials = new MaterialKit();
  private readonly balls = new Map<string, THREE.Mesh>();
  private readonly shadows = new Map<string, THREE.Mesh>();
  private ballGeometry: THREE.SphereGeometry;
  private tableRoot: THREE.Group;
  private tableSignature: string;
  private readonly shadowGeometry = new THREE.PlaneGeometry(1, 1);
  private readonly ballMaterials: Record<string, THREE.MeshPhysicalMaterial>;
  private readonly poolOrientation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
  private readonly lastPocketed = new Map<string, boolean>();
  private readonly pocketFalls = new Map<string, { elapsed: number; start: Vec2; target: Vec2 }>();
  private readonly placement = new THREE.Group();
  private readonly placementMaterial = new THREE.MeshBasicMaterial({ color: 0xcce0bd, transparent: true, opacity: .48, depthWrite: false });
  private placementBall: THREE.Mesh;
  private placementRing: THREE.Mesh;
  private readonly calledPocketMarker = new THREE.Group();
  private calledPocketRing: THREE.Mesh;
  private calledPocketId: string | null = null;
  private paused = false;
  private readonly cue: THREE.Group;
  private readonly guide = new THREE.Group();
  private readonly ring: THREE.Mesh;
  private readonly keyLight: THREE.SpotLight;
  private readonly environmentTarget: THREE.WebGLRenderTarget;
  private readonly pointer = new THREE.Vector2();
  private readonly raycaster = new THREE.Raycaster();
  private readonly tablePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly hitPoint = new THREE.Vector3();
  private readonly cameraTarget = new THREE.Vector3();
  private readonly desiredTarget = new THREE.Vector3();
  private readonly desiredPosition = new THREE.Vector3();
  private reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly selectedPosition = new THREE.Vector3(0, .03075, 0);
  private readonly tempQ = new THREE.Quaternion();
  private readonly yawQ = new THREE.Quaternion();
  private readonly pitchQ = new THREE.Quaternion();
  private readonly zAxis = new THREE.Vector3(0, 0, 1);
  private mode: CameraMode = 'top';
  private selectedId = 'white';
  private angle = 0;
  private power = .5;
  private tip = { x: 0, y: 0 };
  private cueVisible = true;
  private stroke: number | null = null;
  private zoomFactor = 1;
  private orbitAzimuth = 0;
  private orbitElevation = 0;
  private width = 1;
  private height = 1;
  private quality: 'low' | 'high' = 'high';
  private transitioning = true;
  private disposed = false;
  private frameCount = 0;
  private frameTimeMs = 0;

  constructor(private readonly canvas: HTMLCanvasElement, private table: TableConfig = DEFAULT_TABLE) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x121b1d, 1);
    this.scene.background = new THREE.Color(0x11191b);
    this.scene.fog = new THREE.Fog(0x11191b, 6, 17);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const environment = new RoomEnvironment();
    this.environmentTarget = pmrem.fromScene(environment, .05);
    this.scene.environment = this.environmentTarget.texture;
    this.scene.environmentIntensity = .68;
    environment.dispose(); pmrem.dispose();

    this.scene.add(createRoom(this.materials));
    this.tableRoot = createTable(table, this.materials); this.scene.add(this.tableRoot);
    this.tableSignature = JSON.stringify(table);
    this.scene.add(new THREE.HemisphereLight(0xd4e8ed, 0x514336, 1.22));
    this.keyLight = new THREE.SpotLight(0xfff2d5, 38, 12, .66, .68, 1.3);
    this.keyLight.position.set(-.7, 3.7, .45);
    this.keyLight.target.position.set(0, 0, 0);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(1024, 1024);
    this.keyLight.shadow.camera.near = .3;
    this.keyLight.shadow.camera.far = 7;
    this.keyLight.shadow.bias = -.00004;
    this.keyLight.shadow.normalBias = .001;
    this.scene.add(this.keyLight, this.keyLight.target);
    const fill = new THREE.DirectionalLight(0xb8d8eb, 1.2);
    fill.position.set(2, 3, -1.5); this.scene.add(fill);

    this.ballGeometry = new THREE.SphereGeometry(table.ballRadius, 40, 28);
    const ballMat = (color: string, dot: string) => new THREE.MeshPhysicalMaterial({
      map: ballTexture(color, dot), color: 0xffffff, metalness: 0, roughness: .11,
      clearcoat: 1, clearcoatRoughness: .055, envMapIntensity: 1.05,
    });
    this.ballMaterials = {
      white: ballMat('#f7efda', '#d44436'),
      yellow: ballMat('#efbb21', '#a53b24'),
      red: ballMat('#b52227', '#f4d6ad'),
      red2: ballMat('#b52227', '#f4d6ad'),
    };
    this.cue = createCue(this.materials); this.scene.add(this.cue);
    this.scene.add(this.guide);
    this.ring = new THREE.Mesh(new THREE.RingGeometry(table.ballRadius * 1.3, table.ballRadius * 1.35, 48),
      new THREE.MeshBasicMaterial({ color: 0xe5d2a0, transparent: true, opacity: .62, depthWrite: false }));
    this.ring.rotation.x = -Math.PI / 2; this.ring.position.y = .0025; this.scene.add(this.ring);
    this.placementBall = new THREE.Mesh(this.ballGeometry, this.placementMaterial);
    this.placementBall.position.y = table.ballRadius; this.placement.add(this.placementBall);
    this.placementRing = new THREE.Mesh(new THREE.RingGeometry(table.ballRadius * 1.15, table.ballRadius * 1.3, 40), this.placementMaterial);
    this.placementRing.rotation.x = -Math.PI / 2; this.placementRing.position.y = .003; this.placement.add(this.placementRing);
    this.placement.visible = false; this.scene.add(this.placement);
    const callMaterial = new THREE.MeshBasicMaterial({ color: 0xe0bc73, transparent: true, opacity: .92, depthWrite: false, side: THREE.DoubleSide });
    this.calledPocketRing = new THREE.Mesh(new THREE.RingGeometry(.084, .09, 48), callMaterial);
    this.calledPocketRing.rotation.x = -Math.PI / 2; this.calledPocketMarker.add(this.calledPocketRing);
    const arrowShape = new THREE.Shape(); arrowShape.moveTo(0, -.023); arrowShape.lineTo(.018, .014); arrowShape.lineTo(-.018, .014); arrowShape.closePath();
    const callArrow = new THREE.Mesh(new THREE.ShapeGeometry(arrowShape), callMaterial);
    callArrow.rotation.x = -Math.PI / 2; callArrow.position.z = .125; this.calledPocketMarker.add(callArrow);
    this.calledPocketMarker.visible = false; this.scene.add(this.calledPocketMarker);
    const bounds = canvas.getBoundingClientRect();
    this.resize(bounds.width || 1000, bounds.height || 600);
    this.computeCamera(); this.camera.position.copy(this.desiredPosition); this.cameraTarget.copy(this.desiredTarget);
    this.camera.lookAt(this.cameraTarget);
  }

  get cameraMode(): CameraMode { return this.mode; }

  setTable(table: TableConfig) {
    const signature = JSON.stringify(table);
    if (signature === this.tableSignature) return;
    this.scene.remove(this.tableRoot); disposeModel(this.tableRoot, this.materials);
    this.table = table; this.tableSignature = signature;
    this.tableRoot = createTable(table, this.materials); this.scene.add(this.tableRoot);
    for (const mesh of this.balls.values()) this.scene.remove(mesh);
    for (const shadow of this.shadows.values()) { this.scene.remove(shadow); (shadow.material as THREE.Material).dispose(); }
    this.balls.clear(); this.shadows.clear(); this.lastPocketed.clear(); this.pocketFalls.clear();
    this.ballGeometry.dispose(); this.ballGeometry = new THREE.SphereGeometry(table.ballRadius, 40, 28);
    this.ring.geometry.dispose(); this.ring.geometry = new THREE.RingGeometry(table.ballRadius * 1.3, table.ballRadius * 1.35, 48);
    this.placementBall.geometry = this.ballGeometry; this.placementBall.position.y = table.ballRadius;
    this.placementRing.geometry.dispose(); this.placementRing.geometry = new THREE.RingGeometry(table.ballRadius * 1.15, table.ballRadius * 1.3, 40);
    this.placement.visible = false; this.setCalledPocket(null); this.setGuide([]);
    this.selectedPosition.y = table.ballRadius; this.transitioning = true;
  }

  setPaused(paused: boolean) { this.paused = paused; }

  setBallPlacement(point: Vec2 | null, valid = true) {
    this.placement.visible = point !== null;
    if (point) this.placement.position.set(point.x, 0, point.z);
    this.placementMaterial.color.setHex(valid ? 0xcce0bd : 0xe57058);
    this.placementBall.material = this.placementMaterial;
  }

  setCalledPocket(id: string | null) {
    if (id === this.calledPocketId) return;
    this.calledPocketId = id;
    const pocket = this.table.pockets?.find(value => value.id === id);
    this.calledPocketMarker.visible = !!pocket;
    if (!pocket) return;
    this.calledPocketRing.geometry.dispose(); this.calledPocketRing.geometry = new THREE.RingGeometry(pocket.radius + .017, pocket.radius + .023, 48);
    this.calledPocketMarker.position.set(pocket.x, .078, pocket.z);
    // An inward-facing arrow gives the selected pocket a shape cue as well as gold.
    this.calledPocketMarker.rotation.y = Math.atan2(pocket.x, pocket.z) + Math.PI;
  }

  sync(states: BallState[]) {
    const active = new Set(states.map(ball => ball.id));
    for (const [id, mesh] of this.balls) if (!active.has(id)) {
      this.scene.remove(mesh); this.balls.delete(id);
      this.lastPocketed.delete(id); this.pocketFalls.delete(id);
      const shadow = this.shadows.get(id);
      if (shadow) { this.scene.remove(shadow); (shadow.material as THREE.Material).dispose(); this.shadows.delete(id); }
    }
    for (const ball of states) {
      let mesh = this.balls.get(ball.id);
      if (!mesh) {
        mesh = new THREE.Mesh(this.ballGeometry, this.materialForBall(ball));
        mesh.name = `ball-${ball.id}`; mesh.castShadow = true; mesh.receiveShadow = true;
        this.balls.set(ball.id, mesh); this.scene.add(mesh);
        const shadow = new THREE.Mesh(this.shadowGeometry,
          new THREE.MeshBasicMaterial({ map: this.materials.shadowMap, transparent: true, depthWrite: false, opacity: .82 }));
        shadow.rotation.x = -Math.PI / 2; shadow.scale.setScalar(this.table.ballRadius * 3.3);
        shadow.position.y = .0014; this.shadows.set(ball.id, shadow); this.scene.add(shadow);
      }
      mesh.material = this.materialForBall(ball);
      mesh.quaternion.set(ball.orientation.x, ball.orientation.y, ball.orientation.z, ball.orientation.w);
      if (ball.color === 'pool') mesh.quaternion.multiply(this.poolOrientation);
      const previousPocketed = this.lastPocketed.get(ball.id);
      if (ball.pocketed) {
        if (previousPocketed === false && !this.reducedMotion) {
          const pocket = this.table.pockets?.find(value => value.id === ball.pocketId);
          this.pocketFalls.set(ball.id, { elapsed: 0, start: { ...ball.position }, target: pocket ? { x: pocket.x, z: pocket.z } : { ...ball.position } });
        }
        const fall = this.pocketFalls.get(ball.id);
        mesh.visible = !!fall && fall.elapsed < .5;
        this.shadows.get(ball.id)!.visible = false;
        if (!fall) mesh.position.set(ball.position.x, -.25, ball.position.z);
      } else {
        this.pocketFalls.delete(ball.id); mesh.visible = true;
        mesh.position.set(ball.position.x, this.table.ballRadius, ball.position.z);
        const shadow = this.shadows.get(ball.id)!; shadow.visible = true;
        shadow.position.set(ball.position.x + .003, .0014, ball.position.z + .002);
        if (ball.id === this.selectedId) this.selectedPosition.copy(mesh.position);
      }
      this.lastPocketed.set(ball.id, !!ball.pocketed);
    }
    this.updateCue();
  }

  setAim(ballId: string, angle: number, power: number, tip: { x: number; y: number }) {
    this.selectedId = ballId; this.angle = angle; this.power = power; this.tip = { ...tip };
    const ball = this.balls.get(ballId); if (ball) this.selectedPosition.copy(ball.position);
    this.updateCue();
  }

  setCamera(mode: CameraMode) {
    if (this.mode === mode) return;
    this.mode = mode; this.orbitAzimuth = 0; this.orbitElevation = 0; this.zoomFactor = 1; this.transitioning = true;
  }

  setCueVisible(visible: boolean) {
    this.cueVisible = visible; this.cue.visible = visible; this.ring.visible = visible;
  }

  setStroke(progress: number | null) { this.stroke = progress; this.updateCue(); }

  setGuide(points: Vec2[], secondary: Vec2[][] = []) {
    for (const child of [...this.guide.children]) {
      this.guide.remove(child);
      const line = child as THREE.Line; line.geometry.dispose(); (line.material as THREE.Material).dispose();
    }
    const line = (path: Vec2[], color: number, opacity: number, dashed: boolean) => {
      if (path.length < 2) return;
      const geometry = new THREE.BufferGeometry().setFromPoints(path.map(point => new THREE.Vector3(point.x, .005, point.z)));
      const material = dashed
        ? new THREE.LineDashedMaterial({ color, dashSize: .025, gapSize: .025, transparent: true, opacity, depthWrite: false })
        : new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
      const mesh = new THREE.Line(geometry, material); mesh.computeLineDistances(); this.guide.add(mesh);
    };
    line(points, 0xe7be61, .68, true);
    secondary.forEach(path => line(path, 0xcbd6d2, .46, true));
  }

  update(dt: number) {
    if (this.disposed) return;
    this.frameCount++;
    this.frameTimeMs = this.frameTimeMs ? this.frameTimeMs * .95 + Math.min(dt, .25) * 1000 * .05 : dt * 1000;
    this.computeCamera();
    const speed = this.reducedMotion ? 1 : 1 - Math.exp(-Math.min(dt, .05) * (this.transitioning ? 5.8 : 9));
    this.camera.position.lerp(this.desiredPosition, speed);
    this.cameraTarget.lerp(this.desiredTarget, speed);
    this.camera.lookAt(this.cameraTarget);
    if (this.camera.position.distanceToSquared(this.desiredPosition) < .0001) this.transitioning = false;
    for (const [id, fall] of this.pocketFalls) {
      if (!this.paused) fall.elapsed += Math.max(0, Math.min(dt, .1));
      const mesh = this.balls.get(id); if (!mesh) continue;
      const t = Math.min(1, fall.elapsed / .5), inward = 1 - Math.exp(-t * 8);
      mesh.position.set(THREE.MathUtils.lerp(fall.start.x, fall.target.x, inward), this.table.ballRadius - .5 * 3.6 * fall.elapsed * fall.elapsed, THREE.MathUtils.lerp(fall.start.z, fall.target.z, inward));
      mesh.visible = t < 1;
    }
    this.updateCue();
  }

  render() { if (!this.disposed) this.renderer.render(this.scene, this.camera); }

  resize(width: number, height: number) {
    this.width = Math.max(1, width); this.height = Math.max(1, height);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, this.quality === 'low' ? 1 : width < 700 ? 1.5 : 2));
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height; this.camera.updateProjectionMatrix(); this.transitioning = true;
  }

  zoom(delta: number) {
    this.zoomFactor = THREE.MathUtils.clamp(this.zoomFactor * Math.exp(delta * .001), .72, 1.55);
  }

  orbit(dx: number, dy: number) {
    this.orbitAzimuth += dx * .004;
    this.orbitElevation = THREE.MathUtils.clamp(this.orbitElevation + dy * .003, -.22, .35);
  }

  resetCamera() {
    this.orbitAzimuth = 0; this.orbitElevation = 0; this.zoomFactor = 1; this.transitioning = true;
  }

  setQuality(quality: 'low' | 'high') {
    this.quality = quality; this.renderer.shadowMap.enabled = quality === 'high';
    this.resize(this.width, this.height);
  }

  setReducedMotion(value: boolean) { this.reducedMotion = value; }

  screenToTable(clientX: number, clientY: number): Vec2 | null {
    const bounds = this.canvas.getBoundingClientRect();
    this.pointer.set((clientX - bounds.left) / bounds.width * 2 - 1, -(clientY - bounds.top) / bounds.height * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    if (!this.raycaster.ray.intersectPlane(this.tablePlane, this.hitPoint)) return null;
    return { x: this.hitPoint.x, z: this.hitPoint.z };
  }

  diagnostics() {
    const { render, memory, programs } = this.renderer.info;
    const gl = this.renderer.getContext();
    const extension = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      renderer: extension ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      calls: render.calls, triangles: render.triangles, points: render.points, lines: render.lines,
      geometries: memory.geometries, textures: memory.textures, programs: programs?.length,
      dpr: this.renderer.getPixelRatio(), shadowCastingLights: this.renderer.shadowMap.enabled ? 1 : 0,
      shadowMapSize: 1024, postPasses: 0, cameraMode: this.mode, quality: this.quality,
      frameTimeMs: Number(this.frameTimeMs.toFixed(2)), fps: this.frameTimeMs ? Math.round(1000 / this.frameTimeMs) : 0,
      ballMeshes: this.balls.size, width: this.width, height: this.height, frames: this.frameCount,
      tableKind: this.table.kind ?? 'carom', visibleBalls: [...this.balls.values()].filter(mesh => mesh.visible).length,
      pockets: this.table.pockets?.length ?? 0, pocketFalls: [...this.pocketFalls.values()].filter(fall => fall.elapsed < .5).length,
      calledPocket: this.calledPocketId, placementVisible: this.placement.visible, zoom: this.zoomFactor,
    };
  }

  dispose() {
    this.disposed = true;
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
    this.scene.traverse(object => {
      if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
      }
    });
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose());
    this.materials.dispose(); this.environmentTarget.dispose(); this.keyLight.shadow.dispose(); this.renderer.dispose();
    for (const material of Object.values(this.ballMaterials)) { material.map?.dispose(); material.dispose(); }
    this.balls.clear(); this.shadows.clear(); this.lastPocketed.clear(); this.pocketFalls.clear();
  }

  private materialForBall(ball: BallState) {
    if (ball.color !== 'pool') return this.ballMaterials[ball.color];
    const number = Math.max(1, Math.min(15, ball.number ?? (Number(ball.id.replace(/\D/g, '')) || 1)));
    const key = `pool-${number}`;
    if (!this.ballMaterials[key]) this.ballMaterials[key] = new THREE.MeshPhysicalMaterial({
      map: poolBallTexture(number), color: 0xffffff, metalness: 0, roughness: .11,
      clearcoat: 1, clearcoatRoughness: .055, envMapIntensity: 1.05,
    });
    return this.ballMaterials[key];
  }

  private updateCue() {
    const r = this.table.ballRadius;
    const dx = Math.cos(this.angle), dz = Math.sin(this.angle);
    const side = this.tip.x * r, vertical = this.tip.y * r;
    const depth = Math.sqrt(Math.max(r * r - side * side - vertical * vertical, r * r * .15));
    let setback = .025 + this.power * .05;
    if (this.stroke !== null) {
      const t = THREE.MathUtils.clamp(this.stroke, 0, 1);
      // Smooth anticipation during the first 60%, brisk forward stroke thereafter.
      setback = t < .6 ? .035 + Math.sin(t / .6 * Math.PI / 2) * (.07 + this.power * .11)
        : (.105 + this.power * .11) * (1 - Math.pow((t - .6) / .4, 2));
    }
    this.cue.position.set(
      this.selectedPosition.x - dx * (depth + setback) - dz * side,
      r + vertical,
      this.selectedPosition.z - dz * (depth + setback) + dx * side,
    );
    this.yawQ.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, -this.angle);
    this.pitchQ.setFromAxisAngle(this.zAxis, -.09);
    this.cue.quaternion.copy(this.tempQ.copy(this.yawQ).multiply(this.pitchQ));
    const selectedPresent = !!this.balls.get(this.selectedId)?.visible && !this.lastPocketed.get(this.selectedId);
    this.cue.visible = this.cueVisible && selectedPresent;
    this.ring.visible = this.cueVisible && selectedPresent;
    this.ring.position.set(this.selectedPosition.x, .0025, this.selectedPosition.z);
  }

  private computeCamera() {
    const aspect = Math.max(.25, this.camera.aspect);
    if (this.mode === 'top') {
      const halfFov = THREE.MathUtils.degToRad(this.camera.fov / 2);
      const elevation = THREE.MathUtils.clamp(1.12 + this.orbitElevation, .73, 1.5);
      // Portrait rotates the table's long axis into screen height instead of shrinking all balls.
      const portrait = aspect < 1.1;
      const halfAcross = (portrait ? this.table.height + .65 : this.table.width + .65) / 2;
      const halfAlong = (portrait ? this.table.width + .65 : this.table.height + .65) / 2;
      // Include the nearer edge's perspective enlargement; fitting only a flat projected
      // rectangle crops the near rail on tall mobile canvases.
      const distance = (halfAlong * Math.cos(elevation)
        + Math.max(halfAlong * Math.sin(elevation), halfAcross / aspect) / Math.tan(halfFov)) * this.zoomFactor;
      const azimuth = this.orbitAzimuth + (portrait ? Math.PI / 2 : 0);
      this.desiredPosition.set(
        Math.sin(azimuth) * Math.cos(elevation) * distance,
        Math.sin(elevation) * distance,
        Math.cos(azimuth) * Math.cos(elevation) * distance,
      );
      this.desiredTarget.set(0, -.025, 0);
    } else {
      const azimuth = this.angle + this.orbitAzimuth;
      const distance = .93 * this.zoomFactor;
      const elevation = THREE.MathUtils.clamp(.40 + this.orbitElevation, .20, .9);
      const horizontal = Math.cos(elevation) * distance;
      this.desiredPosition.set(
        this.selectedPosition.x - Math.cos(azimuth) * horizontal,
        Math.max(.20, this.selectedPosition.y + Math.sin(elevation) * distance),
        this.selectedPosition.z - Math.sin(azimuth) * horizontal,
      );
      // This camera is always above the 7 cm rail cap and 6.15 cm balls.
      this.desiredTarget.set(
        this.selectedPosition.x + Math.cos(this.angle) * .36,
        .02,
        this.selectedPosition.z + Math.sin(this.angle) * .36,
      );
    }
  }
}
