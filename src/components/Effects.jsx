import { EffectComposer, Bloom, Vignette, N8AO } from '@react-three/postprocessing'

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.15}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <N8AO
        aoRadius={0.5}
        intensity={1.0}
        distanceFalloff={0.5}
        quality="medium"
      />
      <Vignette
        eskil={false}
        offset={0.2}
        darkness={0.4}
      />
    </EffectComposer>
  )
}
