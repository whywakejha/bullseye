import { EffectComposer, Bloom, Vignette, N8AO, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.1}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <N8AO
        aoRadius={0.8}
        intensity={1.0}
        distanceFalloff={0.5}
        quality="medium"
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette
        offset={0.2}
        darkness={0.5}
      />
    </EffectComposer>
  )
}
