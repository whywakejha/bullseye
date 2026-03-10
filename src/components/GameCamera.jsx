import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useGameState from '../hooks/useGameState'

const DEFAULT_POS = new THREE.Vector3(0, 2.5, 5)
const LOOK_AT = new THREE.Vector3(0, 0.8, -2)

export default function GameCamera() {
  const { camera } = useThree()
  const lastResult = useGameState((s) => s.lastResult)
  const shakeRef = useRef(0)

  useFrame((_, delta) => {
    // Keep camera position fixed — no dolly, no breathing
    camera.position.lerp(DEFAULT_POS, delta * 3)

    const lookTarget = LOOK_AT.clone()

    // Shake on bin hit
    if (lastResult === 'score') {
      shakeRef.current += delta * 20
      const decay = Math.max(0, 1 - shakeRef.current * 0.15)
      lookTarget.x += Math.sin(shakeRef.current) * 0.05 * decay
      lookTarget.y += Math.cos(shakeRef.current * 1.3) * 0.03 * decay
    } else {
      shakeRef.current = 0
    }

    camera.lookAt(lookTarget)
  })

  return null
}
