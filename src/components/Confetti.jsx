import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useGameState from '../hooks/useGameState'
import { BIN_POS } from './Dustbin'

const PARTICLE_COUNT = 30
const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#cc5de8']

export default function Confetti() {
  const meshRef = useRef()
  const lastResult = useGameState((s) => s.lastResult)
  const timeRef = useRef(0)

  const { positions, velocities, colors, dummy } = useMemo(() => {
    const positions = []
    const velocities = []
    const colors = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(new THREE.Vector3(0, -10, 0)) // hidden
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 5 + 3,
        (Math.random() - 0.5) * 4,
      ))
      colors.push(new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]))
    }
    return { positions, velocities, colors, dummy: new THREE.Object3D() }
  }, [])

  const initialized = useRef(false)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    if (lastResult === 'score') {
      if (!initialized.current) {
        // Reset particles to bin position
        initialized.current = true
        timeRef.current = 0
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          positions[i].set(BIN_POS[0], BIN_POS[1] + 0.5, BIN_POS[2])
          velocities[i].set(
            (Math.random() - 0.5) * 4,
            Math.random() * 5 + 3,
            (Math.random() - 0.5) * 4,
          )
        }
      }

      timeRef.current += delta

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        velocities[i].y -= 9.81 * delta
        positions[i].add(velocities[i].clone().multiplyScalar(delta))

        dummy.position.copy(positions[i])
        dummy.rotation.set(
          timeRef.current * (i % 3 + 1) * 3,
          timeRef.current * (i % 2 + 1) * 2,
          0
        )
        const scale = Math.max(0, 1 - timeRef.current * 0.5)
        dummy.scale.setScalar(scale)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        meshRef.current.setColorAt(i, colors[i])
      }
      meshRef.current.instanceMatrix.needsUpdate = true
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    } else {
      initialized.current = false
      // Hide all particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        dummy.position.set(0, -10, 0)
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]} frustumCulled={false}>
      <boxGeometry args={[0.06, 0.06, 0.02]} />
      <meshToonMaterial />
    </instancedMesh>
  )
}
