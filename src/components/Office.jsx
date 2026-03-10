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

/* ── Desk Lamp ────────────────────────────────────────────────────── */
function DeskLamp({ position = [0, 0, 0] }) {
  // Arm angles give a nice "reaching over" desk-lamp pose
  return (
    <group position={position}>
      {/* Base — heavy little disc */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.12, 16]} />
        <meshToonMaterial color="#3a3a3a" />
      </mesh>

      {/* Lower arm */}
      <group position={[0, 0.12, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
          <meshToonMaterial color="#555" />
        </mesh>

        {/* Upper arm — pivots at top of lower arm */}
        <group position={[0, 0.6, 0]} rotation={[0, 0, -0.6]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
            <meshToonMaterial color="#555" />
          </mesh>

          {/* Cone shade at the tip */}
          <group position={[0, 0.52, 0]} rotation={[0, 0, 0.15]}>
            <mesh castShadow>
              <coneGeometry args={[0.2, 0.22, 16, 1, true]} />
              <meshToonMaterial color="#e8c44a" side={THREE.DoubleSide} />
            </mesh>
            {/* Warm spotlight coming out the bottom of the shade */}
            <spotLight
              position={[0, -0.05, 0]}
              angle={0.7}
              penumbra={0.6}
              intensity={1.6}
              color="#ffe4b0"
              distance={5}
              decay={2}
              castShadow
              target-position={[0, -2, 0]}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

/* ── Coffee Mug ───────────────────────────────────────────────────── */
function CoffeeMug({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Mug body — slightly tapered cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.14, 16]} />
        <meshToonMaterial color="#e74c3c" />
      </mesh>
      {/* Coffee inside */}
      <mesh position={[0, 0.055, 0]}>
        <cylinderGeometry args={[0.062, 0.062, 0.02, 16]} />
        <meshToonMaterial color="#3e1f0d" />
      </mesh>
      {/* Handle — torus on the side */}
      <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.045, 0.015, 8, 16]} />
        <meshToonMaterial color="#e74c3c" />
      </mesh>
    </group>
  )
}

/* ── Picture Frame on Wall ────────────────────────────────────────── */
function PictureFrame({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Frame border */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 1.0, 0.08]} />
        <meshToonMaterial color="#5c3d1e" />
      </mesh>
      {/* Inner mat / mount */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.2, 0.8, 0.04]} />
        <meshToonMaterial color="#f5f0e8" />
      </mesh>
      {/* "Picture" — a warm-toned landscape rectangle */}
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[1.0, 0.65, 0.01]} />
        <meshToonMaterial color="#6ab04c" />
      </mesh>
      {/* Sky portion of the picture */}
      <mesh position={[0, 0.18, 0.05]}>
        <boxGeometry args={[1.0, 0.3, 0.01]} />
        <meshToonMaterial color="#74b9ff" />
      </mesh>
      {/* Sun blob */}
      <mesh position={[0.3, 0.24, 0.055]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshToonMaterial color="#fdcb6e" />
      </mesh>
    </group>
  )
}

export default function Office() {
  return (
    <group>
      {/* ═══════════════════════════  FLOOR  ═══════════════════════════ */}
      {/* Warm wood-tone floor — base layer */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[14, 0.1, 14]} />
          <meshToonMaterial color="#a07850" />
        </mesh>
      </RigidBody>

      {/* Plank overlay strips for subtle wood grain variation */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh
          key={`plank-${i}`}
          position={[-6 + i * 2, 0.002, 0]}
          receiveShadow
        >
          <boxGeometry args={[1.9, 0.005, 14]} />
          <meshToonMaterial color={i % 2 === 0 ? '#b08860' : '#96724a'} />
        </mesh>
      ))}

      {/* ═══════════════════  RUG / CARPET  ══════════════════════════ */}
      <mesh position={[0, 0.02, 2.0]} receiveShadow>
        <boxGeometry args={[4, 0.04, 3]} />
        <meshToonMaterial color="#c0392b" />
      </mesh>
      {/* Rug border accent stripe */}
      <mesh position={[0, 0.025, 2.0]}>
        <boxGeometry args={[3.6, 0.005, 2.6]} />
        <meshToonMaterial color="#e67e22" />
      </mesh>
      {/* Rug inner rectangle */}
      <mesh position={[0, 0.028, 2.0]}>
        <boxGeometry args={[3.0, 0.005, 2.0]} />
        <meshToonMaterial color="#c0392b" />
      </mesh>

      {/* ═══════════════════════════ WALLS ═══════════════════════════ */}
      {/* Back wall */}
      <Wall position={[0, 3.5, -6]} args={[14, 7, 0.3]} color="#e8dcc8" />
      {/* Left wall */}
      <Wall position={[-7, 3.5, 0]} rotation={[0, 0, 0]} args={[0.3, 7, 14]} color="#ece2d0" />
      {/* Right wall */}
      <Wall position={[7, 3.5, 0]} args={[0.3, 7, 14]} color="#ece2d0" />

      {/* ═══════════════════  BASEBOARD MOLDING  ═════════════════════ */}
      {/* Back wall baseboard */}
      <mesh position={[0, 0.1, -5.85]} receiveShadow>
        <boxGeometry args={[14, 0.2, 0.05]} />
        <meshToonMaterial color="#5c3d1e" />
      </mesh>
      {/* Left wall baseboard */}
      <mesh position={[-6.85, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.05, 0.2, 14]} />
        <meshToonMaterial color="#5c3d1e" />
      </mesh>
      {/* Right wall baseboard */}
      <mesh position={[6.85, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.05, 0.2, 14]} />
        <meshToonMaterial color="#5c3d1e" />
      </mesh>

      {/* ═════════════════════  DESK  ════════════════════════════════ */}
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

      {/* ═══════════════  DESK LAMP  ════════════════════════════════ */}
      <DeskLamp position={[1.1, 0.96, 3.2]} />

      {/* ═══════════════  COFFEE MUG  ═══════════════════════════════ */}
      <RigidBody type="fixed" colliders="cuboid">
        <CoffeeMug position={[-0.8, 1.03, 3.6]} />
      </RigidBody>

      {/* ═══════════════  PICTURE FRAME on back wall  ═══════════════ */}
      <PictureFrame position={[-2.8, 4.2, -5.78]} />

      {/* ═══════════════════  BOOKSHELF  ════════════════════════════ */}
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

      {/* ═══════════════════  WINDOW  ═══════════════════════════════ */}
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

      {/* ═════════════  CEILING LIGHT / PENDANT LAMP  ═══════════════ */}
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

      {/* ═══════════════════  CEILING  ══════════════════════════════ */}
      <mesh position={[0, 7, 0]} receiveShadow>
        <boxGeometry args={[14, 0.1, 14]} />
        <meshToonMaterial color="#f5f0e8" />
      </mesh>
    </group>
  )
}
