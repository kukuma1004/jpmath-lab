import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const colors = {
  mint: 0x26f0bf, mintDark: 0x085a60, amber: 0xffb958, amberDark: 0xa94e2e,
  cream: 0xfff4d5, alloy: 0x243e4f, orange: 0xff6d42, ice: 0x91f4ff, pink: 0xfbb7ff,
}

const boxGeo = new THREE.BoxGeometry(1, 1, 1)
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
const alloy = surface(0x42332e)
const silver = surface(0x797475)
const tealShell = surface(0x238f79, 0x124b42)
const orangeShell = surface(0xa76a2a, 0x4f2910)
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
    draw(pickup) {
      const label = isRecruit ? `${pickup.multiply ? '×' : '+'}${pickup.amount}` : String(pickup.hp)
      if (last === label) return
      last = label
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const accent = isRecruit ? '#66f9d5' : '#ffd18b'
      ctx.beginPath()
      ctx.roundRect(34, 15, 316, 194, isRecruit ? [62,62,16,16] : 12)
      const face = ctx.createLinearGradient(0, 15, 0, 209)
      face.addColorStop(0, isRecruit ? '#254d45' : '#634326')
      face.addColorStop(0.62, isRecruit ? '#10372f' : '#402917')
      face.addColorStop(1, isRecruit ? '#166652' : '#795024')
      ctx.fillStyle = face
      ctx.fill()
      ctx.strokeStyle = accent
      ctx.lineWidth = 7
      ctx.stroke()
      ctx.fillStyle = isRecruit ? '#b4ffec' : '#fff0c6'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '900 98px system-ui, sans-serif'
      ctx.fillText(label, 192, 91)
      ctx.fillStyle = accent
      ctx.font = '800 31px system-ui, Malgun Gothic, sans-serif'
      ctx.fillText(isRecruit ? (pickup.multiply ? '두 배 증원' : '증원') : '무기 상자', 192, 173)
      texture.needsUpdate = true
    },
  }
}

const pickupModels = new Map()
function buildPickupModel(kind) {
  const model = new THREE.Group()


  if (kind === 'recruit') {
    box(model, tealGround, 0, 0.044, 0, 3.3, 0.042, 1.6)
    box(model, mint, 0, 0.076, 0.57, 3.16, 0.028, 0.075)
    box(model, mint, 0, 0.076, -0.57, 3.16, 0.028, 0.075)
    for (const side of [-1, 1]) {
      const x = side * 1.48
      box(model, silver, x, 0.174, 0, 0.53, 0.33, 0.66)
      box(model, alloy, x, 1.04, 0, 0.31, 1.95, 0.35)
      box(model, tealShell, x, 1.38, 0.24, 0.37, 1.16, 0.15)
      box(model, mint, x, 1.36, 0.33, 0.07, 0.76, 0.031)
      box(model, cream, x, 2.02, 0, 0.39, 0.16, 0.44)
    }
    for (let i = 0; i < 9; i++) {
      const angle = (i + 0.5) * Math.PI / 9
      const slab = box(model, i === 4 ? cream : silver, 1.48 * Math.cos(angle),
        1.98 + 0.89 * Math.sin(angle), 0, 0.53, 0.34, 0.47)
      slab.rotation.z = Math.atan2(0.89 * Math.cos(angle), -1.48 * Math.sin(angle))
    }
    for (const z of [1.02, 1.68]) {
      for (const side of [-1, 1]) {
        const arm = box(model, mint, side * 0.19, 0.063, z, 0.46, 0.023, 0.075)
        arm.rotation.y = -side * 0.44
      }
    }
  } else {
    box(model, amberGround, 0, 0.044, 0, 2.52, 0.039, 1.54)
    box(model, alloy, 0, 0.16, 0, 2.48, 0.27, 1.29)
    box(model, orangeShell, 0, 0.63, 0, 2.2, 0.79, 1.06)
    box(model, orangeShell, 0, 1.07, 0, 2.25, 0.16, 1.12)
    for (const side of [-1, 1]) {
      box(model, silver, side * 0.93, 0.67, 0, 0.17, 0.99, 1.13)
      box(model, amber, side * 0.93, 0.85, 0.57, 0.075, 0.09, 0.03)
    }
    for (const y of [0.34, 0.96]) {
      box(model, alloy, 0, y, 0.549, 2.18, 0.095, 0.08)
      for (const x of [-0.94, -0.71, 0.71, 0.94]) {
        box(model, amber, x, y, 0.602, 0.065, 0.065, 0.032)
      }
    }
    for (const x of [-0.98, 0.98]) {
      box(model, silver, x, 1.1, 0, 0.17, 0.12, 1.19)
    }
    for (const x of [-0.55, 0, 0.55]) {
      box(model, alloy, x, 0.66, 0.54, 0.023, 0.5, 0.032)
    }
    box(model, amber, 0, 0.72, 0.568, 0.25, 0.3, 0.09)
    box(model, alloy, 0, 0.71, 0.62, 0.068, 0.11, 0.02)
  }
  const batches = new Map()
  for (const part of model.children) {
    part.updateMatrix()
    const geometry = part.geometry.clone().applyMatrix4(part.matrix)
    if (!batches.has(part.material)) batches.set(part.material, [])
    batches.get(part.material).push(geometry)
  }
  model.clear()
  for (const [finish, parts] of batches) {
    model.add(new THREE.Mesh(mergeGeometries(parts), finish))
    for (const part of parts) part.dispose()
  }
  return model
}

function createPickup(kind) {
  const root = new THREE.Group()
  if (!pickupModels.has(kind)) pickupModels.set(kind, buildPickupModel(kind))
  const model = pickupModels.get(kind).clone()
  const sign = card(kind)
  sign.sprite.position.set(0, kind === 'recruit' ? 1.83 : 1.88, kind === 'recruit' ? 0.51 : 0.34)
  root.add(model, sign.sprite)
  return {
    root,
    update(pickup, time) {
      root.position.set(pickup.x, 0, pickup.z)
      sign.draw(pickup)
      model.rotation.z = Math.sin(time * 70) * pickup.flash * 0.42
    },
    dispose: sign.dispose,
  }
}

export function createPickups(scene) {
  const views = new Map()
  return {
    update(pickups, time) {
      const visible = new Set()
      for (const pickup of pickups) {
        visible.add(pickup.id)
        let view = views.get(pickup.id)
        if (!view) {
          view = createPickup(pickup.kind)
          views.set(pickup.id, view)
          scene.add(view.root)
        }
        view.update(pickup, time)
      }
      for (const [id, view] of views) {
        if (visible.has(id)) continue
        scene.remove(view.root)
        view.dispose()
        views.delete(id)
      }
    },
  }
}

export function createHazard() {
  const root = new THREE.Group()
  box(root, baseRose, 0, 0.064, -5.4, 1, 0.017, 12.2)
  for (const side of [-1, 1]) {
    box(root, roseEdge, 0.485 * side, 0.083, -5.4, 0.022, 0.014, 12.2)
  }
  const points = []
  for (let i = 0; i < 8; i += 1) {
    const z = -i * 1.4
    for (const side of [-1, 1]) {
      const x = side * .16
      points.push(0,.082,z-.14, x,.082,z+.06, x,.082,z+.16,
                  0,.082,z-.14, x,.082,z+.16, 0,.082,z-.04)
    }
  }
  const chevrons = new THREE.BufferGeometry()
  chevrons.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  root.add(new THREE.Mesh(chevrons, material(0xffab56, { side: THREE.DoubleSide })))
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
const shotPalette = [0x58e3c9, 0xeeee99, 0x95def7, 0xff7941]

function instanced(geo, mat, size) {
  const mesh = new THREE.InstancedMesh(geo, mat, size)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false
  mesh.count = 0
  return mesh
}

export function createEffects(scene) {
  const shots = instanced(diamondGeo, material(0xffffff), limit)
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
        temp.scale.set(shot.level === 2 ? 0.053 : 0.039, 0.036, 0.83)
        temp.updateMatrix()
        shots.setMatrixAt(i, temp.matrix)
        shots.setColorAt(i, tint.setHex(shotPalette[shot.level]))
        temp.position.z -= 0.12
        temp.position.y += 0.051
        temp.scale.set(0.035, 0.027, 0.29)
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
