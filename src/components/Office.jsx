import { useRef } from 'react'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const cartoonMat = (color) => (
  <meshToonMaterial
    color={color}
    gradientMap={null}
  />
)

function Wall({ position, rotation, args, color = '#e8dcc8' }) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={position} rotation={rotation} receiveShadow>
        <boxGeometry args={args} />
        {cartoonMat(color)}
      </mesh>
    </RigidBody>
  )
}

export default function Office() {
  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[14, 0.1, 14]} />
          <meshToonMaterial color="#b89a7a" />
        </mesh>
      </RigidBody>

      {/* Back wall */}
      <Wall position={[0, 3.5, -6]} args={[14, 7, 0.3]} color="#e8dcc8" />

      {/* Left wall */}
      <Wall position={[-7, 3.5, 0]} rotation={[0, 0, 0]} args={[0.3, 7, 14]} color="#ece2d0" />

      {/* Right wall */}
      <Wall position={[7, 3.5, 0]} args={[0.3, 7, 14]} color="#ece2d0" />

      {/* Desk — large wooden desk the player throws from */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0.9, 3.5]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.12, 1.5]} />
          <meshToonMaterial color="#8B5E3C" />
        </mesh>
        {/* Desk legs */}
        {[[-1.3, 0.42, 3], [1.3, 0.42, 3], [-1.3, 0.42, 4], [1.3, 0.42, 4]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <boxGeometry args={[0.1, 0.84, 0.1]} />
            <meshToonMaterial color="#6B3F22" />
          </mesh>
        ))}
      </RigidBody>

      {/* Bookshelf on left wall */}
      <group position={[-6.5, 0, -2]}>
        {/* Shelf frame */}
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[0.8, 4, 0.6]} />
          <meshToonMaterial color="#7a5c3a" />
        </mesh>
        {/* Shelf layers */}
        {[0.5, 1.5, 2.5, 3.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[0.9, 0.06, 0.7]} />
            <meshToonMaterial color="#5c3d1e" />
          </mesh>
        ))}
        {/* Books */}
        {[
          { pos: [-0.15, 0.8, 0], color: '#e74c3c', args: [0.12, 0.5, 0.4] },
          { pos: [0.05, 0.75, 0], color: '#3498db', args: [0.1, 0.4, 0.4] },
          { pos: [0.2, 0.8, 0], color: '#2ecc71', args: [0.12, 0.5, 0.4] },
          { pos: [-0.1, 1.8, 0], color: '#f39c12', args: [0.14, 0.5, 0.4] },
          { pos: [0.15, 1.75, 0], color: '#9b59b6', args: [0.1, 0.4, 0.4] },
        ].map(({ pos, color, args }, i) => (
          <mesh key={i} position={pos} castShadow>
            <boxGeometry args={args} />
            <meshToonMaterial color={color} />
          </mesh>
        ))}
      </group>

      {/* Window on back wall — decorative */}
      <group position={[3, 3.5, -5.8]}>
        {/* Window frame */}
        <mesh>
          <boxGeometry args={[2.2, 2.7, 0.1]} />
          <meshToonMaterial color="#5c3d1e" />
        </mesh>
        {/* Window glass */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.8, 2.3, 0.05]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} />
        </mesh>
        {/* Window divider — vertical */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.06, 2.3, 0.06]} />
          <meshToonMaterial color="#5c3d1e" />
        </mesh>
        {/* Window divider — horizontal */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[1.8, 0.06, 0.06]} />
          <meshToonMaterial color="#5c3d1e" />
        </mesh>
        {/* Soft window light glow */}
        <pointLight position={[0, 0, 1]} intensity={0.5} color="#ffffee" distance={6} />
      </group>

      {/* Ceiling light / pendant lamp */}
      <group position={[0, 6.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
          <meshToonMaterial color="#333" />
        </mesh>
        <mesh position={[0, -0.5, 0]} castShadow>
          <coneGeometry args={[0.5, 0.4, 16]} />
          <meshToonMaterial color="#f5deb3" />
        </mesh>
        <pointLight position={[0, -0.7, 0]} intensity={0.8} color="#fff5e0" distance={10} decay={2} />
      </group>

      {/* Baseboard trim */}
      <mesh position={[0, 0.1, -5.85]} receiveShadow>
        <boxGeometry args={[14, 0.2, 0.05]} />
        <meshToonMaterial color="#5c3d1e" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 7, 0]} receiveShadow>
        <boxGeometry args={[14, 0.1, 14]} />
        <meshToonMaterial color="#f5f0e8" />
      </mesh>
    </group>
  )
}
