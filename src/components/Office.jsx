import { RigidBody } from '@react-three/rapier'

// Kenney Furniture Kit models
import { Desk } from './models/Desk'
import { ChairDesk } from './models/ChairDesk'
import { LampRoundTable } from './models/LampRoundTable'
import { BookcaseOpen } from './models/BookcaseOpen'
import { Books } from './models/Books'
import { RugRectangle } from './models/RugRectangle'
import { PottedPlant } from './models/PottedPlant'
import { Laptop } from './models/Laptop'
import { ComputerScreen } from './models/ComputerScreen'

function Wall({ position, rotation, args, color = '#e8dcc8' }) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={position} rotation={rotation} receiveShadow>
        <boxGeometry args={args} />
        <meshToonMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

export default function Office() {
  return (
    <group>
      {/* ═══════════════════════════  FLOOR  ═══════════════════════════ */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[14, 0.1, 14]} />
          <meshToonMaterial color="#a07850" />
        </mesh>
      </RigidBody>

      {/* Plank overlay strips for wood grain variation */}
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

      {/* ═══════════════════  RUG  ══════════════════════════ */}
      <RugRectangle position={[0, 0.01, 2.0]} scale={[5, 5, 4]} />

      {/* ═══════════════════════════ WALLS ═══════════════════════════ */}
      {/* Back wall */}
      <Wall position={[0, 3.5, -6]} args={[14, 7, 0.3]} color="#e8dcc8" />
      {/* Left wall */}
      <Wall position={[-7, 3.5, 0]} args={[0.3, 7, 14]} color="#ece2d0" />
      {/* Right wall */}
      <Wall position={[7, 3.5, 0]} args={[0.3, 7, 14]} color="#ece2d0" />

      {/* ═══════════════════  BASEBOARD MOLDING  ═════════════════════ */}
      <mesh position={[0, 0.1, -5.85]} receiveShadow>
        <boxGeometry args={[14, 0.2, 0.05]} />
        <meshToonMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[-6.85, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.05, 0.2, 14]} />
        <meshToonMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[6.85, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.05, 0.2, 14]} />
        <meshToonMaterial color="#5c3d1e" />
      </mesh>

      {/* ═════════════════════  DESK (Kenney model)  ══════════════════ */}
      {/* Kenney desk is ~0.5 units wide, scale up ~5x to fill the room */}
      <RigidBody type="fixed" colliders="cuboid">
        <Desk position={[0, 0, 3.5]} scale={[5, 5, 5]} />
        {/* Invisible collider matching the desk top surface */}
        {/* Desk model top is roughly at y=0.37 * 5 = 1.85, width ~0.5*5=2.5, depth ~0.3*5=1.5 */}
      </RigidBody>

      {/* ═══════════════  DESK LAMP (Kenney LampRoundTable)  ═════════ */}
      <group position={[1.0, 1.85, 3.2]}>
        <LampRoundTable scale={[4, 4, 4]} />
        {/* Warm point light at the lamp position */}
        <pointLight
          position={[0, 0.8, 0]}
          intensity={1.2}
          color="#ffe4b0"
          distance={6}
          decay={2}
          castShadow
        />
      </group>

      {/* ═══════════════  LAPTOP on desk  ═════════════════════════════ */}
      <Laptop position={[-0.3, 1.85, 3.5]} scale={[5, 5, 5]} rotation={[0, Math.PI, 0]} />

      {/* ═══════════════  COMPUTER SCREEN on desk  ═══════════════════ */}
      <ComputerScreen position={[0.4, 1.85, 3.2]} scale={[4, 4, 4]} rotation={[0, Math.PI, 0]} />

      {/* ═══════════════  CHAIR behind desk  ═════════════════════════ */}
      <ChairDesk position={[0, 0, 5.0]} scale={[5, 5, 5]} rotation={[0, Math.PI, 0]} />

      {/* ═══════════════════  BOOKCASE (Kenney model)  ════════════════ */}
      {/* Against the left wall */}
      <BookcaseOpen position={[-6.2, 0, -2]} scale={[5, 5, 5]} />

      {/* Books on the bookcase shelves */}
      {/* Lower shelf */}
      <Books position={[-6.2, 1.3, -2]} scale={[4, 4, 4]} />
      {/* Upper shelf */}
      <Books position={[-6.2, 2.7, -2]} scale={[4, 4, 4]} rotation={[0, 0.5, 0]} />

      {/* ═══════════════════  POTTED PLANT in corner  ════════════════ */}
      <PottedPlant position={[5.5, 0, -4.5]} scale={[3, 3, 3]} />

      {/* ═══════════════════  WINDOW  ═══════════════════════════════ */}
      <group position={[3, 3.5, -5.8]}>
        {/* Window frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 2.7, 0.1]} />
          <meshToonMaterial color="#5c3d1e" />
        </mesh>
        {/* Window glass */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.8, 2.3, 0.05]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} />
        </mesh>
        {/* Window divider — vertical */}
        <mesh position={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[0.06, 2.3, 0.06]} />
          <meshToonMaterial color="#5c3d1e" />
        </mesh>
        {/* Window divider — horizontal */}
        <mesh position={[0, 0, 0.08]} castShadow>
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
