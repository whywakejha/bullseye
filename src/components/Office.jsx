import { RigidBody } from '@react-three/rapier'

// Kenney Furniture Kit models (CC0)
import { Desk } from './models/Desk'
import { ChairDesk } from './models/ChairDesk'
import { LampRoundTable } from './models/LampRoundTable'
import { BookcaseOpen } from './models/BookcaseOpen'
import { Books } from './models/Books'
import { RugRectangle } from './models/RugRectangle'
import { PottedPlant } from './models/PottedPlant'
import { Laptop } from './models/Laptop'

// Kenney models are ~0.5 units tall. We use scale 2.5 so desk ~1.0 unit tall.
const S = 2.5

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
        <mesh key={`plank-${i}`} position={[-6 + i * 2, 0.002, 0]} receiveShadow>
          <boxGeometry args={[1.9, 0.005, 14]} />
          <meshToonMaterial color={i % 2 === 0 ? '#b08860' : '#96724a'} />
        </mesh>
      ))}

      {/* ═══════════════════  RUG  ══════════════════════════ */}
      <RugRectangle position={[0, 0.01, 1.5]} scale={[3, 1, 2.5]} />

      {/* ═══════════════════════════ WALLS ═══════════════════════════ */}
      <Wall position={[0, 3.5, -6]} args={[14, 7, 0.3]} color="#e8dcc8" />
      <Wall position={[-7, 3.5, 0]} args={[0.3, 7, 14]} color="#ece2d0" />
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

      {/* ═════════════════════  DESK  ══════════════════════════════ */}
      {/* Kenney desk at scale 2.5: ~1.0 tall, ~1.25 wide, ~0.75 deep */}
      <RigidBody type="fixed" colliders="cuboid">
        <Desk position={[0, 0, 3.0]} scale={[S, S, S]} />
      </RigidBody>

      {/* ═══════════════  DESK LAMP  ═════════════════════════════════ */}
      <group position={[0.5, 0.93, 2.8]}>
        <LampRoundTable scale={[S, S, S]} />
        <pointLight
          position={[0, 0.5, 0]}
          intensity={1.2}
          color="#ffe4b0"
          distance={5}
          decay={2}
          castShadow
        />
      </group>

      {/* ═══════════════  LAPTOP on desk  ═══════════════════════════ */}
      <Laptop position={[-0.3, 0.93, 2.9]} scale={[S, S, S]} rotation={[0, Math.PI, 0]} />

      {/* ═══════════════  CHAIR behind desk  ═══════════════════════ */}
      <ChairDesk position={[0, 0, 4.2]} scale={[S, S, S]} rotation={[0, Math.PI, 0]} />

      {/* ═══════════════════  BOOKCASE  ══════════════════════════════ */}
      <BookcaseOpen position={[-6.2, 0, -3]} scale={[S, S, S]} />
      <Books position={[-6.2, 0.6, -3]} scale={[S * 0.8, S * 0.8, S * 0.8]} />
      <Books position={[-6.2, 1.2, -3]} scale={[S * 0.8, S * 0.8, S * 0.8]} rotation={[0, 0.5, 0]} />

      {/* ═══════════════════  POTTED PLANT  ══════════════════════════ */}
      <PottedPlant position={[5.5, 0, -4.5]} scale={[S * 1.5, S * 1.5, S * 1.5]} />

      {/* ═══════════════════  WINDOW  ═══════════════════════════════ */}
      <group position={[3, 3.5, -5.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 2.7, 0.1]} />
          <meshToonMaterial color="#5c3d1e" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.8, 2.3, 0.05]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[0.06, 2.3, 0.06]} />
          <meshToonMaterial color="#5c3d1e" />
        </mesh>
        <mesh position={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[1.8, 0.06, 0.06]} />
          <meshToonMaterial color="#5c3d1e" />
        </mesh>
        <pointLight position={[0, 0, 1]} intensity={0.5} color="#ffffee" distance={6} />
      </group>

      {/* ═════════════  CEILING LIGHT  ═══════════════════════════════ */}
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
