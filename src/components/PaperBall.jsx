import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import useGameState from '../hooks/useGameState'

const BALL_START = [0, 1.3, 3.5] // on the desk

function makeCrumpledGeometry() {
  const geo = new THREE.IcosahedronGeometry(0.08, 1)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const noise = 0.9 + Math.random() * 0.2
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

  const geometry = useMemo(() => makeCrumpledGeometry(), [ballKey])

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
      restitution={0.25}
      friction={0.6}
      linearDamping={0.5}
      angularDamping={0.3}
      density={0.2}
      ccd
      type={launched ? 'dynamic' : 'kinematicPosition'}
      onIntersectionEnter={handleIntersection}
      onCollisionEnter={handleCollision}
      userData={{ launched }}
    >
      <group ref={meshRef} scale={0.8}>
        <mesh geometry={geometry} castShadow>
          <meshStandardMaterial
            color="#f0ead6"
            roughness={0.85}
            metalness={0.0}
          />
        </mesh>
      </group>
    </RigidBody>
  )
}

export { BALL_START }
