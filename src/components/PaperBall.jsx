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

  const geometry = useMemo(() => makeCrumpledGeometry(), [ballKey])

  // Reset when ballKey changes
  useEffect(() => {
    setLaunched(false)
    hasScored.current = false
    if (landTimer.current) clearTimeout(landTimer.current)
  }, [ballKey])

  // Spin the ball during flight
  useFrame((_, delta) => {
    if (meshRef.current && launched) {
      meshRef.current.rotation.x += delta * 8
      meshRef.current.rotation.z += delta * 5
    }
  })

  const handleCollision = ({ other }) => {
    if (!launched || hasScored.current) return

    // Check if ball hit the sensor inside the bin
    if (other.rigidBodyObject?.name === 'bin-sensor') {
      hasScored.current = true
      scored()

      // Auto-reset after delay
      if (landTimer.current) clearTimeout(landTimer.current)
      landTimer.current = setTimeout(() => resetBall(), 2000)
      return
    }

    // If ball hit the floor, it's a miss — start timer to reset
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
      onIntersectionEnter={handleCollision}
      onCollisionEnter={handleCollision}
      userData={{ launched }}
    >
      <mesh ref={meshRef} geometry={geometry} castShadow>
        <meshToonMaterial color="#f5f0e0" />
      </mesh>
    </RigidBody>
  )
}

export { BALL_START }
