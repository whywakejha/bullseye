import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Environment } from '@react-three/drei'
import Office from './Office'
import Dustbin from './Dustbin'
import PaperBall from './PaperBall'
import AimController from './AimController'
import Effects from './Effects'
import GameCamera from './GameCamera'

export default function Scene() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, toneMapping: 3 /* ACESFilmic */ }}
      camera={{ position: [0, 2.5, 5], fov: 45 }}
      style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}
    >
      {/* Pixar lighting */}
      <ambientLight intensity={0.3} color="#ffe4c4" />
      <directionalLight
        position={[4, 8, 4]}
        intensity={1.8}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />
      {/* Rim light — warm back fill */}
      <pointLight position={[-3, 5, -3]} intensity={0.6} color="#ffd4a8" />
      {/* Cool fill from the side */}
      <pointLight position={[5, 3, 0]} intensity={0.3} color="#a8d4ff" />

      <Environment preset="apartment" background={false} environmentIntensity={0.2} />

      <Physics gravity={[0, -9.81, 0]} timeStep="vary">
        <Office />
        <Dustbin />
        <PaperBall />
        <AimController />
      </Physics>

      <GameCamera />
      <Effects />
    </Canvas>
  )
}
