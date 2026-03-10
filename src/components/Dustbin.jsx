import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'
import useGameState from '../hooks/useGameState'

const BIN_POS = [0, 0, -3]
const BIN_RADIUS_TOP = 0.45
const BIN_RADIUS_BOTTOM = 0.35
const BIN_HEIGHT = 0.8
const BIN_WALL = 0.04

// Band positions at 1/3 and 2/3 height (measured from center)
const BAND_Y_1 = -BIN_HEIGHT / 2 + BIN_HEIGHT / 3   // lower band
const BAND_Y_2 = -BIN_HEIGHT / 2 + (BIN_HEIGHT * 2) / 3 // upper band
// Radius at those heights (linear interpolation between bottom and top)
const BAND_R_1 = BIN_RADIUS_BOTTOM + (BIN_RADIUS_TOP - BIN_RADIUS_BOTTOM) * (1 / 3)
const BAND_R_2 = BIN_RADIUS_BOTTOM + (BIN_RADIUS_TOP - BIN_RADIUS_BOTTOM) * (2 / 3)

export default function Dustbin() {
  const groupRef = useRef()
  const wobbleRef = useRef(0)
  const scored = useGameState((s) => s.lastResult === 'score')

  // Wobble on score
  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (scored) {
      wobbleRef.current += delta * 15
      const decay = Math.max(0, 1 - wobbleRef.current * 0.3)
      groupRef.current.rotation.z = Math.sin(wobbleRef.current) * 0.08 * decay
      if (decay <= 0.01) {
        groupRef.current.rotation.z = 0
      }
    } else {
      wobbleRef.current = 0
      groupRef.current.rotation.z = 0
    }
  })

  return (
    <group ref={groupRef}>
      {/* Physics colliders — static walls of the bin, with visual mesh inside */}
      <RigidBody type="fixed" position={BIN_POS}>
        {/* Visual bin mesh — richer forest green for cartoon pop */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[BIN_RADIUS_TOP, BIN_RADIUS_BOTTOM, BIN_HEIGHT, 24]} />
          <meshStandardMaterial
            color="#3d7a45"
            roughness={0.7}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Rim ring — shinier for Pixar-style specular highlight */}
        <mesh position={[0, BIN_HEIGHT / 2, 0]} castShadow>
          <torusGeometry args={[BIN_RADIUS_TOP, 0.03, 8, 24]} />
          <meshStandardMaterial
            color="#2e6e35"
            roughness={0.25}
            metalness={0.45}
          />
        </mesh>

        {/* Horizontal ridge band — lower (1/3 height) */}
        <mesh position={[0, BAND_Y_1, 0]}>
          <torusGeometry args={[BAND_R_1, 0.012, 6, 24]} />
          <meshStandardMaterial
            color="#347a3c"
            roughness={0.5}
            metalness={0.15}
          />
        </mesh>

        {/* Horizontal ridge band — upper (2/3 height) */}
        <mesh position={[0, BAND_Y_2, 0]}>
          <torusGeometry args={[BAND_R_2, 0.012, 6, 24]} />
          <meshStandardMaterial
            color="#347a3c"
            roughness={0.5}
            metalness={0.15}
          />
        </mesh>

        {/* Bottom */}
        <CuboidCollider args={[BIN_RADIUS_BOTTOM, 0.02, BIN_RADIUS_BOTTOM]} position={[0, -BIN_HEIGHT / 2, 0]} />

        {/* 4 walls approximating a cylinder */}
        <CuboidCollider args={[BIN_RADIUS_TOP, BIN_HEIGHT / 2, BIN_WALL]} position={[0, 0, BIN_RADIUS_TOP]} />
        <CuboidCollider args={[BIN_RADIUS_TOP, BIN_HEIGHT / 2, BIN_WALL]} position={[0, 0, -BIN_RADIUS_TOP]} />
        <CuboidCollider args={[BIN_WALL, BIN_HEIGHT / 2, BIN_RADIUS_TOP]} position={[BIN_RADIUS_TOP, 0, 0]} />
        <CuboidCollider args={[BIN_WALL, BIN_HEIGHT / 2, BIN_RADIUS_TOP]} position={[-BIN_RADIUS_TOP, 0, 0]} />

        {/* 4 diagonal walls for rounder shape */}
        {(() => {
          const offset = BIN_RADIUS_TOP * 0.707
          const wallLen = BIN_RADIUS_TOP * 0.55
          return (
            <>
              <CuboidCollider args={[wallLen, BIN_HEIGHT / 2, BIN_WALL]} position={[offset, 0, offset]} rotation={[0, Math.PI / 4, 0]} />
              <CuboidCollider args={[wallLen, BIN_HEIGHT / 2, BIN_WALL]} position={[-offset, 0, offset]} rotation={[0, -Math.PI / 4, 0]} />
              <CuboidCollider args={[wallLen, BIN_HEIGHT / 2, BIN_WALL]} position={[offset, 0, -offset]} rotation={[0, -Math.PI / 4, 0]} />
              <CuboidCollider args={[wallLen, BIN_HEIGHT / 2, BIN_WALL]} position={[-offset, 0, -offset]} rotation={[0, Math.PI / 4, 0]} />
            </>
          )
        })()}
      </RigidBody>

      {/* Score detection sensor — inside the bin near bottom */}
      <RigidBody type="fixed" position={[BIN_POS[0], BIN_POS[1] - 0.1, BIN_POS[2]]} name="bin-sensor">
        <CuboidCollider args={[BIN_RADIUS_BOTTOM * 0.7, 0.1, BIN_RADIUS_BOTTOM * 0.7]} sensor />
      </RigidBody>
    </group>
  )
}

export { BIN_POS }
