import Scene from './components/Scene'
import ScoreBoard from './ui/ScoreBoard'
import ThrowFeedback from './ui/ThrowFeedback'
import AimIndicator from './ui/AimIndicator'

export default function App() {
  return (
    <>
      <Scene />
      <ScoreBoard />
      <ThrowFeedback />
      <AimIndicator />
    </>
  )
}
