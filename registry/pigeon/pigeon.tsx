"use client"

import * as React from "react"
import * as THREE from "three"

import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Pigeon — a cute, friendly little pigeon rendered with three.js. It leans on
// the "baby schema": an oversized round head, big forward-set sparkly eyes, a
// stubby peach beak and rosy blush cheeks, over soft pastel PBR plumage with an
// iridescent green→purple neck and tucked coral feet. It flaps its wings and
// flies a gentle banking figure-8.
//
// Every colour is read at runtime from CSS custom properties (the --pigeon-*
// tokens) so the bird restyles with the theme — nothing is hardcoded here.
// Light/environment colours (neutral, not plumage) are the only literals.
// ---------------------------------------------------------------------------

type PigeonColorToken =
  | "body"
  | "wing"
  | "belly"
  | "head"
  | "neckGreen"
  | "neckPurple"
  | "wingbar"
  | "tailBand"
  | "beak"
  | "cere"
  | "eye"
  | "pupil"
  | "feet"
  | "rump"
  | "cheek"

const TOKEN_VARS: Record<PigeonColorToken, string> = {
  body: "--pigeon-body",
  wing: "--pigeon-wing",
  belly: "--pigeon-belly",
  head: "--pigeon-head",
  neckGreen: "--pigeon-neck-green",
  neckPurple: "--pigeon-neck-purple",
  wingbar: "--pigeon-wingbar",
  tailBand: "--pigeon-tail-band",
  beak: "--pigeon-beak",
  cere: "--pigeon-cere",
  eye: "--pigeon-eye",
  pupil: "--pigeon-pupil",
  feet: "--pigeon-feet",
  rump: "--pigeon-rump",
  cheek: "--pigeon-cheek",
}

// Fallbacks used only if the tokens aren't present (e.g. consumer forgot the
// cssVars). They mirror the light-theme rock-pigeon palette.
const TOKEN_FALLBACKS: Record<PigeonColorToken, string> = {
  body: "#9aa3b5",
  wing: "#8790a1",
  belly: "#c3cad6",
  head: "#7a8494",
  neckGreen: "#57c08a",
  neckPurple: "#b57ac4",
  wingbar: "#3a404c",
  tailBand: "#33383f",
  beak: "#e6a07f",
  cere: "#eef1f5",
  eye: "#2b2226",
  pupil: "#141519",
  feet: "#eda0a6",
  rump: "#c7cdd7",
  cheek: "#f2b6bc",
}

type PigeonColors = Record<PigeonColorToken, THREE.Color>

// Resolve each CSS custom property to a THREE.Color via a hidden probe so that
// `var()` chains and color-mix() are fully computed by the browser.
function resolveColors(host: HTMLElement): PigeonColors {
  const probe = document.createElement("span")
  probe.style.position = "absolute"
  probe.style.width = "0"
  probe.style.height = "0"
  probe.style.visibility = "hidden"
  host.appendChild(probe)

  const out = {} as PigeonColors
  for (const key of Object.keys(TOKEN_VARS) as PigeonColorToken[]) {
    probe.style.color = `var(${TOKEN_VARS[key]}, ${TOKEN_FALLBACKS[key]})`
    const computed = getComputedStyle(probe).color
    // A real browser resolves the var() chain to an rgb()/color string. In
    // environments that don't (e.g. jsdom under test) the raw `var(...)` comes
    // back unresolved — THREE.Color can't parse that, so use the fallback hex.
    const usable =
      computed && !computed.includes("var(") ? computed : TOKEN_FALLBACKS[key]
    out[key] = new THREE.Color().setStyle(usable)
  }

  host.removeChild(probe)
  return out
}

// One flight feather: a slightly asymmetric, tapered vane. Drawn in the X/Y
// plane (length along +Y, width along X) then laid flat so it extends backward
// (+Z, the trailing direction) with its surface facing up.
function makeFeatherGeometry(length: number, width: number): THREE.BufferGeometry {
  const w = width / 2
  const s = new THREE.Shape()
  s.moveTo(-w * 0.25, 0)
  s.bezierCurveTo(-w, length * 0.25, -w * 0.9, length * 0.7, -w * 0.35, length * 0.95)
  s.quadraticCurveTo(0, length * 1.04, w * 0.55, length * 0.92) // rounded outer tip
  s.bezierCurveTo(w * 0.95, length * 0.6, w * 0.8, length * 0.22, w * 0.25, 0)
  s.closePath()

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.015,
    bevelEnabled: false,
    curveSegments: 6,
  })
  geo.rotateX(Math.PI / 2) // shape +Y -> world +Z (trailing), thin along Y
  geo.translate(0, 0, 0)
  geo.computeVertexNormals()
  return geo
}

// The smooth wing membrane silhouette that the feathers layer over — a swept,
// pointed pigeon wing. Span along +X, chord along -Z (leading edge forward).
function makeWingGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape()
  s.moveTo(0, 0.42) // leading edge, root
  s.quadraticCurveTo(1.1, 0.5, 1.9, 0.12) // swept leading edge
  s.quadraticCurveTo(2.35, -0.1, 2.5, -0.5) // pointed tip
  s.quadraticCurveTo(1.7, -0.68, 1.0, -0.78) // trailing edge
  s.quadraticCurveTo(0.5, -0.8, 0, -0.5)
  s.closePath()

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 12,
  })
  geo.rotateX(-Math.PI / 2) // shape-X -> world X (span), shape-Y -> world -Z
  geo.center()
  geo.translate(1.05, 0, 0.12) // root at the shoulder pivot, nudged back
  return geo
}

// The forked tail fan (rectrices), pointing backward (+Z), spread across ±X.
function makeTailGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape()
  s.moveTo(0, 0.16)
  s.quadraticCurveTo(0.9, 0.42, 1.35, 0.5)
  s.quadraticCurveTo(1.45, 0.18, 1.5, 0.0) // rounded end (rock pigeons: square/rounded)
  s.quadraticCurveTo(1.45, -0.18, 1.35, -0.5)
  s.quadraticCurveTo(0.9, -0.42, 0, -0.16)
  s.closePath()

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 1,
    curveSegments: 12,
  })
  geo.rotateX(-Math.PI / 2)
  geo.rotateY(-Math.PI / 2) // length backward (+Z), spread across ±X
  return geo
}

// Iridescent neck material: a grey PBR base with a view-dependent green→purple
// sheen added to the emissive term via a small onBeforeCompile patch (a fresnel
// mix, like the thin-film shimmer on a real pigeon's neck).
function makeNeckMaterial(colors: PigeonColors): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    color: colors.head.clone().multiplyScalar(0.9),
    roughness: 0.45,
    metalness: 0.35,
  })
  mat.onBeforeCompile = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uNeckA = { value: colors.neckGreen.clone() }
    shader.uniforms.uNeckB = { value: colors.neckPurple.clone() }
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform vec3 uNeckA;
         uniform vec3 uNeckB;`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
         {
           vec3 V = normalize(vViewPosition);
           float f = 1.0 - clamp(dot(normalize(normal), V), 0.0, 1.0);
           float shift = clamp(f * 1.3 - 0.15, 0.0, 1.0);
           vec3 sheen = mix(uNeckA, uNeckB, shift);
           totalEmissiveRadiance += sheen * pow(f, 2.0) * 0.9;
         }`
      )
  }
  return mat
}

type Dove = {
  group: THREE.Group
  leftWing: THREE.Group
  rightWing: THREE.Group
  tail: THREE.Group
}

// Build one wing on a shoulder pivot. `side` is +1 for the right wing (+X) and
// -1 for the left; feathers/bars/coverts are mirrored by flipping X so both
// wings shade identically (a plain scale.x = -1 would invert the normals).
function buildWing(
  side: 1 | -1,
  colors: PigeonColors,
  stdMat: (c: THREE.Color, rough?: number) => THREE.MeshStandardMaterial
): THREE.Group {
  const pivot = new THREE.Group()
  pivot.position.set(0.16 * side, 0.42, 0.02)

  const wingMat = stdMat(colors.wing, 0.85)
  wingMat.side = THREE.DoubleSide

  // Smooth membrane, mirrored for the left side (rewinds triangles to keep
  // normals outward).
  let memGeo: THREE.BufferGeometry = makeWingGeometry()
  if (side < 0) memGeo = mirrorGeometryX(memGeo)
  const membrane = new THREE.Mesh(memGeo, wingMat)
  membrane.castShadow = true
  membrane.receiveShadow = true
  pivot.add(membrane)

  // Primary flight feathers protruding beyond the trailing/outer edge, fanned.
  const primGeo = makeFeatherGeometry(1.0, 0.34)
  const primMat = stdMat(colors.wing.clone().multiplyScalar(0.94), 0.8)
  primMat.side = THREE.DoubleSide
  const nPrim = 7
  for (let i = 0; i < nPrim; i++) {
    const u = i / (nPrim - 1) // 0 = inner, 1 = tip
    const f = new THREE.Mesh(primGeo, primMat)
    f.position.set((0.95 + u * 1.35) * side, 0.02, 0.28 + u * 0.18)
    f.rotation.y = side * (-0.15 - u * 0.75) // sweep back toward the tip
    f.scale.setScalar(0.9 + u * 0.5)
    f.castShadow = true
    pivot.add(f)
  }

  // Covert feathers: an instanced layer texturing the top of the wing.
  const covGeo = makeFeatherGeometry(0.34, 0.2)
  const covMat = stdMat(colors.wing.clone().multiplyScalar(1.03), 0.9)
  covMat.side = THREE.DoubleSide
  const rows = [
    { z: -0.28, count: 6, x0: 0.35, xStep: 0.3, y: 0.05 },
    { z: -0.02, count: 6, x0: 0.35, xStep: 0.3, y: 0.07 },
  ]
  const total = rows.reduce((n, r) => n + r.count, 0)
  const coverts = new THREE.InstancedMesh(covGeo, covMat, total)
  coverts.castShadow = true
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const pos = new THREE.Vector3()
  const scl = new THREE.Vector3()
  let idx = 0
  for (const r of rows) {
    for (let i = 0; i < r.count; i++) {
      const x = (r.x0 + i * r.xStep) * side
      e.set(-0.15, side * (-0.1 - i * 0.12), 0)
      q.setFromEuler(e)
      pos.set(x, r.y, r.z)
      scl.setScalar(1)
      m.compose(pos, q, scl)
      coverts.setMatrixAt(idx++, m)
    }
  }
  coverts.instanceMatrix.needsUpdate = true
  pivot.add(coverts)

  // The two dark rock-pigeon wing bars, as thin strips across the secondaries.
  const barMat = stdMat(colors.wingbar, 0.7)
  for (const bz of [-0.16, 0.06]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.03, 0.09), barMat)
    bar.position.set(0.7 * side, 0.12, bz)
    bar.castShadow = true
    pivot.add(bar)
  }

  return pivot
}

// Mirror a geometry across X and rewind triangles so normals stay outward.
function mirrorGeometryX(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = geo.clone()
  g.scale(-1, 1, 1)
  const index = g.getIndex()
  if (index) {
    const a = index.array as Uint16Array | Uint32Array
    for (let i = 0; i < a.length; i += 3) {
      const t = a[i]
      a[i] = a[i + 2]
      a[i + 2] = t
    }
    index.needsUpdate = true
  }
  g.computeVertexNormals()
  return g
}

// Assemble the whole bird. Model faces -Z (beak forward) so lookAt() can aim it
// straight down the flight path; wings span ±X and flap about the Z axis.
function buildDove(colors: PigeonColors): Dove {
  const group = new THREE.Group()

  const std = (c: THREE.Color, rough = 0.85) =>
    new THREE.MeshStandardMaterial({
      color: c,
      roughness: rough,
      metalness: 0.0,
    })

  const bodyMat = std(colors.body)
  const headMat = std(colors.head)

  // Body — a plump, rounded ellipsoid, higher-res for smooth PBR shading.
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.68, 48, 36), bodyMat)
  body.scale.set(0.9, 0.95, 1.22)
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  // Pale breast/belly.
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 24), std(colors.belly, 0.9))
  belly.scale.set(0.66, 0.56, 1.02)
  belly.position.set(0, -0.3, -0.14)
  belly.receiveShadow = true
  group.add(belly)

  // Whitish lower back / rump patch (visible in flight on rock pigeons).
  const rump = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 18), std(colors.rump, 0.9))
  rump.scale.set(0.6, 0.42, 0.5)
  rump.position.set(0, 0.12, 0.7)
  group.add(rump)

  // Head — oversized and round for a friendly, baby-schema look.
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 40, 30), headMat)
  head.position.set(0, 0.42, -0.98)
  head.castShadow = true
  head.receiveShadow = true
  group.add(head)

  // Iridescent neck collar bridging head and breast.
  const neck = new THREE.Mesh(new THREE.SphereGeometry(0.42, 40, 30), makeNeckMaterial(colors))
  neck.scale.set(0.7, 0.62, 0.66)
  neck.position.set(0, 0.14, -0.62)
  neck.castShadow = true
  group.add(neck)

  // Beak — a tiny, stubby little peach beak (short and blunt reads far
  // friendlier than a long pointed one), pointing forward (-Z).
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.2, 16), std(colors.beak, 0.5))
  beak.rotation.x = -Math.PI / 2
  beak.position.set(0, 0.34, -1.44)
  beak.scale.set(1, 1, 0.85)
  beak.castShadow = true
  group.add(beak)

  // The soft cere (fleshy bump at the base of the beak).
  const cere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 14), std(colors.cere, 0.6))
  cere.scale.set(1.1, 0.7, 0.9)
  cere.position.set(0, 0.44, -1.28)
  group.add(cere)

  // Eyes — big, round, glossy dark beads angled to face forward, each with a
  // large catch-light plus a smaller sparkle. Oversized and front-set eyes are
  // the heart of the "cute" baby schema. Parented to the head so they follow it.
  const headR = 0.5
  const irisGeo = new THREE.SphereGeometry(0.135, 24, 20)
  const irisMat = new THREE.MeshStandardMaterial({
    color: colors.eye,
    roughness: 0.18,
    metalness: 0.0,
    emissive: colors.eye.clone().multiplyScalar(0.08),
  })
  const glintGeo = new THREE.SphereGeometry(0.045, 12, 10)
  const glintMat = new THREE.MeshBasicMaterial({ color: colors.cere })
  const sparkGeo = new THREE.SphereGeometry(0.022, 10, 8)
  for (const sx of [-1, 1]) {
    const dir = new THREE.Vector3(0.5 * sx, 0.22, -0.92).normalize()
    const iris = new THREE.Mesh(irisGeo, irisMat)
    iris.position.copy(dir).multiplyScalar(headR * 0.95)
    // Large upper catch-light — the sparkle that makes eyes read as friendly.
    const glint = new THREE.Mesh(glintGeo, glintMat)
    glint.position.copy(dir).multiplyScalar(0.09)
    glint.position.x += 0.03 * sx
    glint.position.y += 0.05
    iris.add(glint)
    // A second, smaller sparkle low on the opposite side for extra life.
    const spark = new THREE.Mesh(sparkGeo, glintMat)
    spark.position.copy(dir).multiplyScalar(0.09)
    spark.position.x -= 0.03 * sx
    spark.position.y -= 0.04
    iris.add(spark)
    head.add(iris)
  }

  // Rosy blush cheeks — soft, slightly glowing patches under the eyes.
  const cheekGeo = new THREE.SphereGeometry(0.12, 20, 16)
  const cheekMat = new THREE.MeshStandardMaterial({
    color: colors.cheek,
    roughness: 0.8,
    metalness: 0.0,
    emissive: colors.cheek.clone().multiplyScalar(0.25),
    transparent: true,
    opacity: 0.85,
  })
  for (const sx of [-1, 1]) {
    const dir = new THREE.Vector3(0.78 * sx, -0.28, -0.72).normalize()
    const cheek = new THREE.Mesh(cheekGeo, cheekMat)
    cheek.position.copy(dir).multiplyScalar(headR * 0.94)
    cheek.scale.set(1, 0.7, 0.55)
    head.add(cheek)
  }

  // Tail — forked fan on a pivot at its base so it can spread and swish.
  const tail = new THREE.Group()
  tail.position.set(0, 0.06, 1.0)
  tail.rotation.x = -0.26
  const tailMesh = new THREE.Mesh(makeTailGeometry(), std(colors.wing, 0.85))
  ;(tailMesh.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide
  tailMesh.castShadow = true
  tail.add(tailMesh)
  // Dark terminal band across the tail tips.
  const band = new THREE.Mesh(
    new THREE.BoxGeometry(0.98, 0.04, 0.14),
    std(colors.tailBand, 0.7)
  )
  band.position.set(0, 0.01, 1.28)
  tail.add(band)
  group.add(tail)

  // Wings.
  const rightWing = buildWing(1, colors, std)
  const leftWing = buildWing(-1, colors, std)
  group.add(rightWing, leftWing)

  // Tucked coral feet, drawn up under the belly in flight.
  const feetMat = std(colors.feet, 0.6)
  for (const sx of [-1, 1]) {
    const leg = new THREE.Group()
    leg.position.set(0.16 * sx, -0.42, 0.34)
    leg.rotation.x = 1.15 // folded back
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.34, 8), feetMat)
    shank.position.y = -0.14
    leg.add(shank)
    for (let toe = -1; toe <= 1; toe++) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.012, 0.16, 6), feetMat)
      t.position.set(0.05 * toe, -0.32, 0.02)
      t.rotation.x = 0.9
      t.rotation.z = 0.35 * toe
      leg.add(t)
    }
    group.add(leg)
  }

  // Slight resting pitch.
  group.rotation.x = -0.05
  return { group, leftWing, rightWing, tail }
}

export interface PigeonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flight speed multiplier. Default 1. */
  speed?: number
  /** Wing-flap speed multiplier. Default 1. */
  flapSpeed?: number
  /** Freeze the animation. Default false. */
  paused?: boolean
}

export function Pigeon({
  className,
  speed = 1,
  flapSpeed = 1,
  paused = false,
  ...props
}: PigeonProps) {
  const hostRef = React.useRef<HTMLDivElement>(null)

  // Keep latest control values without re-running the heavy setup effect; the
  // animation loop reads controls.current, which this syncs after every render.
  const controls = React.useRef({ speed, flapSpeed, paused })
  React.useEffect(() => {
    controls.current = { speed, flapSpeed, paused }
  })

  React.useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    // PCFSoftShadowMap was deprecated in three r175+ and now falls back to
    // PCFShadowMap internally; set it directly to avoid the console warning.
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    host.appendChild(renderer.domElement)
    renderer.domElement.style.display = "block"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 1.6, 8.4)
    camera.lookAt(0, 0, 0)

    // Lighting — a hemisphere light stands in for sky/ground environment
    // lighting, a shadow-casting key gives form and wing self-shadowing, plus a
    // fill and a low rim for edge highlights.
    const hemi = new THREE.HemisphereLight(0xdfe6f2, 0x6b6f78, 0.9)
    scene.add(hemi)
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(3.5, 6, 4)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 0.02
    const cam = key.shadow.camera
    cam.left = -6
    cam.right = 6
    cam.top = 6
    cam.bottom = -6
    cam.near = 0.5
    cam.far = 20
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 0.5)
    fill.position.set(-4, 1.5, 2)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffffff, 0.6)
    rim.position.set(-1, 2, -5)
    scene.add(rim)

    let colors = resolveColors(host)
    let dove = buildDove(colors)
    scene.add(dove.group)
    // Keep the key light's shadow frustum centred on the flying bird.
    key.target = dove.group

    // Flight path: a horizontal figure-8 with a gentle vertical bob.
    const A = 3.3
    const B = 1.5
    const sample = (t: number, out: THREE.Vector3) =>
      out.set(A * Math.cos(t), 0.5 * Math.sin(2 * t), B * Math.sin(2 * t))

    const pos = new THREE.Vector3()
    const next = new THREE.Vector3()
    let t = 0
    let prevHeading = 0
    let elapsed = 0
    let last = performance.now()
    let raf = 0

    const render = (now: number) => {
      raf = requestAnimationFrame(render)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      elapsed += dt
      const { speed: sp, flapSpeed: fl, paused: pz } = controls.current
      if (!pz) t += dt * 0.55 * sp

      // Position + orientation along the path.
      sample(t, pos)
      sample(t + 0.01, next)
      dove.group.position.copy(pos)
      dove.group.lookAt(next)

      // Bank into turns based on how fast the heading is changing.
      const heading = Math.atan2(next.x - pos.x, next.z - pos.z)
      let dHead = heading - prevHeading
      while (dHead > Math.PI) dHead -= Math.PI * 2
      while (dHead < -Math.PI) dHead += Math.PI * 2
      prevHeading = heading
      const roll = THREE.MathUtils.clamp(
        (dHead / Math.max(dt, 1e-3)) * 0.12,
        -0.7,
        0.7
      )
      dove.group.rotateZ(roll)

      // Flap. Reduced-motion users get a slow, shallow idle flap.
      const flapHz = (reduceMotion ? 1.1 : 5.2) * fl
      const amp = reduceMotion ? 0.22 : 0.66
      const phase = pz ? 0 : elapsed * flapHz
      const flap = Math.sin(phase) * amp + 0.14
      // A little wing twist over the stroke for a more natural beat.
      const twist = Math.cos(phase) * 0.16
      dove.rightWing.rotation.z = flap
      dove.leftWing.rotation.z = -flap
      dove.rightWing.rotation.x = twist
      dove.leftWing.rotation.x = twist

      // Tail — fans/pitches a beat behind the wingbeat, swishes into turns.
      const tailPhase = phase - 0.6
      dove.tail.rotation.x = -0.26 + Math.sin(tailPhase) * 0.3
      dove.tail.rotation.y = pz ? 0 : -roll * 0.9
      dove.tail.scale.x = 1 + (Math.sin(tailPhase) * 0.5 + 0.5) * 0.28

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(render)

    // Keep the renderer sized to the container.
    const resize = () => {
      const w = host.clientWidth || 1
      const h = host.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // Re-resolve colours when the theme (light/dark) toggles.
    const themeObserver = new MutationObserver(() => {
      colors = resolveColors(host)
      scene.remove(dove.group)
      disposeDove(dove)
      dove = buildDove(colors)
      scene.add(dove.group)
      key.target = dove.group
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      themeObserver.disconnect()
      disposeDove(dove)
      renderer.dispose()
      if (renderer.domElement.parentNode === host)
        host.removeChild(renderer.domElement)
    }
    // Live controls flow via the ref, so this only runs once on mount.
  }, [])

  return (
    <div
      ref={hostRef}
      className={cn("relative h-90 w-full overflow-hidden", className)}
      {...props}
    />
  )
}

// Free GPU resources for a rebuilt/destroyed bird.
function disposeDove(dove: Dove) {
  dove.group.traverse((o) => {
    if (o instanceof THREE.Mesh || o instanceof THREE.InstancedMesh) {
      o.geometry.dispose()
      const m = o.material
      if (Array.isArray(m)) m.forEach((x) => x.dispose())
      else m.dispose()
    }
  })
}
