import * as THREE from 'three'
import { LANES } from './combat.js'

const colors = {
  mint: 0x26f0bf, mintDark: 0x085a60, amber: 0xffb958, amberDark: 0xa94e2e,
  cream: 0xfff4d5, alloy: 0x243e4f, orange: 0xff6d42, ice: 0x91f4ff, pink: 0xfbb7ff,
}

const boxGeo = new THREE.BoxGeometry(1, 1, 1)
const planeGeo = new THREE.PlaneGeometry(1, 1)
const diamondGeo = new THREE.OctahedronGeometry(1)
const temp = new THREE.Object3D()
const tint = new THREE.Color()
const material = (color, settings = {}) => new THREE.MeshBasicMaterial({ color, ...settings })
const surface = (color, emissive = 0) => new THREE.MeshStandardMaterial({
  color, roughness: 0.58, metalness: 0.12, emissive, emissiveIntensity: 0.34,
})
const mint = material(colors.mint)
const amber = material(colors.amber)
const cream = material(colors.cream)
const alloy = surface(colors.alloy)
const tealShell = surface(0x38c9ab, 0x12866d)
const orangeShell = surface(0xffa451, 0x862e17)
const tealGround = material(colors.mintDark, { transparent: true, opacity: 0.27, depthWrite: false })
const amberGround = material(colors.amberDark, { transparent: true, opacity: 0.24, depthWrite: false })
const baseRose = material(0xff572f, { transparent: true, opacity: 0.26, depthWrite: false })
const roseEdge = material(0xff8e4f)

function box(group, mat, x, y, z, sx, sy, sz) {
  const mesh = new THREE.Mesh(boxGeo, mat)
  mesh.position.set(x, y, z)
  mesh.scale.set(sx, sy, sz)
  group.add(mesh)
  return mesh
}

function card(type) {
  const canvas = document.createElement('canvas')
  canvas.width = 384
  canvas.height = 224
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  const mat = new THREE.SpriteMaterial({ map: texture, depthWrite: false, toneMapped: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(2.72, 1.59, 1)
  const isRecruit = type === 'recruit'
  let last = ''
  return {
    sprite,
    dispose() {
      texture.dispose()
      mat.dispose()
    },
    draw(number) {
      const label = isRecruit ? `+${number}` : String(number)
      if (last === label) return
      last = label
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const accent = isRecruit ? '#66f9d5' : '#ffd18b'
      ctx.beginPath()
      ctx.roundRect(13, 12, 358, 199, 27)
      ctx.fillStyle = isRecruit ? '#103c3f' : '#472d32'
      ctx.fill()
      ctx.strokeStyle = accent
      ctx.lineWidth = 7
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '900 109px system-ui, sans-serif'
      ctx.fillText(label, 192, 91)
      ctx.fillStyle = accent
      ctx.font = '800 31px system-ui, Malgun Gothic, sans-serif'
      ctx.fillText(isRecruit ? '동료 합류' : '사격 강화', 192, 173)
      texture.needsUpdate = true
    },
  }
}

export function createGatePair() {
  const root = new THREE.Group()
  const recruit = new THREE.Group()
  const upgrade = new THREE.Group()
  recruit.position.x = LANES.recruit
  upgrade.position.x = LANES.upgrade
  root.add(recruit, upgrade)

  box(recruit, tealGround, 0, 0.04, 0, 3.32, 0.034, 1.65)
  box(recruit, mint, 0, 0.071, 0.69, 3.25, 0.032, 0.06)
  box(recruit, mint, 0, 0.071, -0.69, 3.25, 0.032, 0.06)
  for (const side of [-1, 1]) {
    const x = side * 1.53
    box(recruit, alloy, x, 0.21, 0, 0.48, 0.42, 1.32)
    box(recruit, tealShell, x, 1.06, 0, 0.28, 2, 0.35)
    box(recruit, mint, x + side * -0.12, 1.13, 0.183, 0.07, 1.76, 0.024)
    box(recruit, cream, x, 2.05, 0, 0.43, 0.18, 0.43)
    box(recruit, tealShell, x, 0.27, 0.51, 0.34, 0.1, 0.13)
  }
  box(recruit, alloy, 0, 2.38, 0, 3.34, 0.2, 0.38)
  box(recruit, mint, 0, 2.395, 0.198, 3.03, 0.045, 0.04)

  box(upgrade, amberGround, 0, 0.04, 0, 2.93, 0.034, 1.57)
  box(upgrade, alloy, 0, 0.23, 0, 2.75, 0.46, 1.19)
  box(upgrade, orangeShell, 0, 1.24, -0.06, 2.62, 1.88, 0.37)
  box(upgrade, alloy, 0, 1.3, 0.153, 2.33, 1.6, 0.12)
  box(upgrade, amber, 0, 0.542, 0.23, 2.32, 0.09, 0.044)
  box(upgrade, amber, 0, 1.105, 0.603, 2.72, 0.041, 0.045)
  for (const side of [-1, 1]) {
    box(upgrade, amber, side * 1.28, 1.34, 0.139, 0.09, 1.53, 0.06)
    box(upgrade, alloy, side * 1.18, 1.73, 0.271, 0.32, 0.25, 0.24)
    box(upgrade, cream, side * 1.18, 1.76, 0.401, 0.2, 0.077, 0.025)
  }
  const left = card('recruit')
  left.sprite.position.set(0, 2.74, 0.62)
  recruit.add(left.sprite)
  const right = card('upgrade')
  right.sprite.position.set(0, 1.55, 0.48)
  upgrade.add(right.sprite)
  return {
    root,
    update(pair, time) {
      root.position.z = pair.z
      left.draw(pair.people)
      right.draw(Math.ceil(pair.hp))
      left.sprite.position.y = 2.7 + Math.sin(time * 3.1) * 0.05
      upgrade.position.y = Math.sin(pair.hit * 95) * pair.hit * 0.47
    },
    dispose() {
      left.dispose()
      right.dispose()
    },
  }
}

export function createHazard() {
  const root = new THREE.Group()
  box(root, baseRose, 0, 0.064, -5.4, 1, 0.017, 12.2)
  for (const side of [-1, 1]) {
    box(root, roseEdge, 0.485 * side, 0.083, -5.4, 0.022, 0.014, 12.2)
  }
  for (let i = 0; i < 8; i += 1) {
    box(root, roseEdge, 0, 0.075, -i * 1.4, 0.92, 0.016, 0.038)
  }
  return {
    root,
    update(alarm, time) {
      root.visible = Boolean(alarm)
      if (!alarm) return
      root.scale.x = alarm.width
      root.position.x = alarm.x
      baseRose.opacity = 0.15 + 0.13 * (1 + Math.sin(time * (alarm.ttl < 0.32 ? 38 : 24)))
    },
  }
}

const limit = 360
const shotPalette = [0x0da9be, 0xf99437, 0xc271e8]

function instanced(geo, mat, size) {
  const mesh = new THREE.InstancedMesh(geo, mat, size)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false
  mesh.count = 0
  return mesh
}

export function createEffects(scene) {
  const shots = instanced(boxGeo, material(0xffffff), limit)
  const glints = instanced(boxGeo, material(0xfff9df), limit)
  const sparks = instanced(diamondGeo, material(0xffffff), 320)
  const rings = instanced(new THREE.RingGeometry(0.84, 1, 32), material(0xffffff, {
    side: THREE.DoubleSide, transparent: true, opacity: 0.72, depthWrite: false,
  }), 20)
  const particles = []
  const pulses = []
  scene.add(shots, glints, sparks, rings)

  function burst(x, y, z, color, count, force) {
    for (let i = 0; i < count && particles.length < 320; i += 1) {
      const angle = Math.random() * Math.PI * 2
      const speed = force * (0.3 + Math.random())
      const ttl = 0.16 + Math.random() * 0.33
      particles.push({
        x, y, z, dx: Math.cos(angle) * speed, dy: Math.random() * force, dz: Math.sin(angle) * speed,
        size: 0.06 + Math.random() * 0.095, ttl, color,
      })
    }
  }

  function pulse(x, z, color, max = 2) {
    if (pulses.length < 20) pulses.push({ x, z, color, ttl: 0.53, max })
  }

  return {
    burst, pulse,
    reset() {
      particles.length = 0
      pulses.length = 0
    },
    update(projectiles, dt) {
      const size = Math.min(projectiles.length, limit)
      shots.count = size
      glints.count = size
      for (let i = 0; i < size; i += 1) {
        const shot = projectiles[i]
        const muzzleOffset = 0.21 * Math.max(0, 1 - (shot.startZ - shot.z) / 2.1)
        temp.position.set(shot.x - muzzleOffset, 0.78, shot.z)
        temp.rotation.set(0, -Math.atan(shot.dx), 0)
        temp.scale.set(shot.level === 2 ? 0.155 : 0.126, 0.087, 0.83)
        temp.updateMatrix()
        shots.setMatrixAt(i, temp.matrix)
        shots.setColorAt(i, tint.setHex(shotPalette[shot.level]))
        temp.position.z -= 0.12
        temp.position.y += 0.051
        temp.scale.set(0.056, 0.024, 0.36)
        temp.updateMatrix()
        glints.setMatrixAt(i, temp.matrix)
      }
      shots.instanceMatrix.needsUpdate = true
      if (shots.instanceColor) shots.instanceColor.needsUpdate = true
      glints.instanceMatrix.needsUpdate = true

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]
        p.ttl -= dt
        if (p.ttl <= 0) {
          particles[i] = particles.at(-1)
          particles.pop()
          continue
        }
        p.x += p.dx * dt
        p.y = Math.max(0.1, p.y + p.dy * dt)
        p.z += p.dz * dt
        p.dy -= 13 * dt
      }
      sparks.count = particles.length
      particles.forEach((p, i) => {
        temp.position.set(p.x, p.y, p.z)
        temp.rotation.set(p.dx, p.ttl * 12, p.dz)
        temp.scale.setScalar(p.size * Math.min(1, p.ttl * 7))
        temp.updateMatrix()
        sparks.setMatrixAt(i, temp.matrix)
        sparks.setColorAt(i, tint.setHex(p.color))
      })
      sparks.instanceMatrix.needsUpdate = true
      if (sparks.instanceColor) sparks.instanceColor.needsUpdate = true

      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        const p = pulses[i]
        p.ttl -= dt
        if (p.ttl <= 0) pulses.splice(i, 1)
      }
      rings.count = pulses.length
      pulses.forEach((p, i) => {
        const scale = 0.18 + (1 - p.ttl / 0.53) * p.max
        temp.position.set(p.x, 0.103, p.z)
        temp.rotation.set(-Math.PI / 2, 0, 0)
        temp.scale.setScalar(scale)
        temp.updateMatrix()
        rings.setMatrixAt(i, temp.matrix)
        rings.setColorAt(i, tint.setHex(p.color))
      })
      rings.instanceMatrix.needsUpdate = true
      if (rings.instanceColor) rings.instanceColor.needsUpdate = true
    },
  }
}
