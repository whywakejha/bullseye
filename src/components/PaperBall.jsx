import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import useGameState from '../hooks/useGameState'

const BALL_START = [0, 1.3, 3.5] // on the desk

function makeCrumpledGeometry() {
  const geo = new THREE.IcosahedronGeometry(0.12, 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const noise = 0.7 + Math.random() * 0.6
    pos.setXYZ(
      i,
      pos.getX(i) * noise,
      pos.getY(i) * noise,
      pos.getZ(i) * noise
    )
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

// Build a set of face indices that get the "ink" darker material
function makeInkIndices(geometry) {
  const faceCount = geometry.index
    ? geometry.index.count / 3
    : geometry.attributes.position.count / 3
  const indices = new Set()
  for (let i = 0; i < faceCount; i++) {
    if (Math.random() < 0.3) indices.add(i) // ~30% of faces get ink
  }
  return indices
}

// Split the geometry into two groups: paper faces and ink faces
function splitGeometry(geometry) {
  const index = geometry.index
  const position = geometry.attributes.position
  const normal = geometry.attributes.normal

  const paperPositions = []
  const paperNormals = []
  const inkPositions = []
  const inkNormals = []

  const faceCount = index ? index.count / 3 : position.count / 3
  const inkFaces = makeInkIndices(geometry)

  for (let f = 0; f < faceCount; f++) {
    const target = inkFaces.has(f) ? { p: inkPositions, n: inkNormals } : { p: paperPositions, n: paperNormals }
    for (let v = 0; v < 3; v++) {
      const idx = index ? index.getX(f * 3 + v) : f * 3 + v
      target.p.push(position.getX(idx), position.getY(idx), position.getZ(idx))
      target.n.push(normal.getX(idx), normal.getY(idx), normal.getZ(idx))
    }
  }

  const paperGeo = new THREE.BufferGeometry()
  paperGeo.setAttribute('position', new THREE.Float32BufferAttribute(paperPositions, 3))
  paperGeo.setAttribute('normal', new THREE.Float32BufferAttribute(paperNormals, 3))

  const inkGeo = new THREE.BufferGeometry()
  inkGeo.setAttribute('position', new THREE.Float32BufferAttribute(inkPositions, 3))
  inkGeo.setAttribute('normal', new THREE.Float32BufferAttribute(inkNormals, 3))

  return { paperGeo, inkGeo }
}

export default function PaperBall() {
  const rigidRef = useRef()
  const meshRef = useRef()
  const ballKey = useGameState((s) => s.ballKey)
  const isThrowing = useGameState((s) => s.isThrowing)
  const scored = useGameState((s) => s.scored)
  const missed = useGameState((s) => s.missed)
  const resetBall = useGameState((s) => s.resetBall)
  const [launched, setLaunched] = useState(false)
  const hasScored = useRef(false)
  const landTimer = useRef(null)

  // Squash animation state
  const spawnTime = useRef(0)
  const squashDone = useRef(false)

  const { paperGeo, inkGeo } = useMemo(() => {
    const base = makeCrumpledGeometry()
    return splitGeometry(base)
  }, [ballKey])

  // Reset when ballKey changes
  useEffect(() => {
    setLaunched(false)
    hasScored.current = false
    spawnTime.current = 0
    squashDone.current = false
    if (landTimer.current) clearTimeout(landTimer.current)
  }, [ballKey])

  // Listen for launch-ball event from AimController
  useEffect(() => {
    const handleLaunch = (event) => {
      if (!rigidRef.current) return
      const [x, y, z] = event.detail.velocity

      // Wake and switch from kinematicPosition to dynamic
      rigidRef.current.setBodyType(0, true)
      rigidRef.current.setLinvel({ x, y, z }, true)

      // Add random angular velocity for tumbling spin
      rigidRef.current.setAngvel(
        {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
          z: (Math.random() - 0.5) * 10,
        },
        true
      )

      setLaunched(true)
    }

    window.addEventListener('launch-ball', handleLaunch)
    return () => {
      window.removeEventListener('launch-ball', handleLaunch)
    }
  }, [ballKey])

  // Spin the ball during flight + squash animation on spawn
  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Squash-to-normal animation on spawn (scale 0.8 -> 1.0 over ~300ms)
    if (!squashDone.current) {
      spawnTime.current += delta
      const t = Math.min(spawnTime.current / 0.3, 1) // 300ms duration
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      const s = THREE.MathUtils.lerp(0.8, 1.0, eased)
      meshRef.current.scale.setScalar(s)
      if (t >= 1) squashDone.current = true
    }

    if (launched) {
      meshRef.current.rotation.x += delta * 8
      meshRef.current.rotation.z += delta * 5
    }
  })

  // Sensor intersection handler — detects when ball enters the bin sensor
  const handleIntersection = ({ other }) => {
    if (!launched || hasScored.current) return

    // Check if ball hit the sensor inside the bin
    if (other.rigidBodyObject?.name === 'bin-sensor') {
      hasScored.current = true
      scored()

      // Auto-reset after delay
      if (landTimer.current) clearTimeout(landTimer.current)
      landTimer.current = setTimeout(() => resetBall(), 2000)
    }
  }

  // Physical collision handler — detects when ball hits floor/walls (miss)
  const handleCollision = ({ other }) => {
    if (!launched || hasScored.current) return

    // Ignore collisions with the bin itself (walls/bottom) — only care about floor/walls for miss
    // The bin sensor is handled by handleIntersection
    if (other.rigidBodyObject?.name === 'bin-sensor') return

    // Ball hit something physical (floor, wall, etc.) — start miss timer
    if (landTimer.current) clearTimeout(landTimer.current)
    landTimer.current = setTimeout(() => {
      if (!hasScored.current) {
        missed()
        setTimeout(() => resetBall(), 1000)
      }
    }, 1500)
  }

  return (
    <RigidBody
      key={ballKey}
      ref={rigidRef}
      name="paper-ball"
      position={BALL_START}
      colliders="ball"
      restitution={0.3}
      friction={0.8}
      linearDamping={0.2}
      angularDamping={0.3}
      type={launched ? 'dynamic' : 'kinematicPosition'}
      onIntersectionEnter={handleIntersection}
      onCollisionEnter={handleCollision}
      userData={{ launched }}
    >
      <group ref={meshRef} scale={0.8}>
        {/* Main paper surface — warm off-white with natural roughness */}
        <mesh geometry={paperGeo} castShadow>
          <meshStandardMaterial
            color="#f0e8d0"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
        {/* Ink/writing patches — slightly darker for visual interest */}
        <mesh geometry={inkGeo} castShadow>
          <meshStandardMaterial
            color="#d6cdb5"
            roughness={0.95}
            metalness={0.02}
          />
        </mesh>
      </group>
    </RigidBody>
  )
}

export { BALL_START }
