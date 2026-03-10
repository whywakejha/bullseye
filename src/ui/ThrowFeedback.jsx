import { useEffect, useState } from 'react'
import useGameState from '../hooks/useGameState'

const MESSAGES = {
  score: ['Nice shot!', 'Bullseye!', 'Nothing but net!', 'Swish!', 'Perfect!'],
  miss: ['So close!', 'Almost!', 'Try again!', 'Next time!', 'Keep going!'],
}

export default function ThrowFeedback() {
  const lastResult = useGameState((s) => s.lastResult)
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (lastResult) {
      const msgs = MESSAGES[lastResult]
      setMessage(msgs[Math.floor(Math.random() * msgs.length)])
      setVisible(true)

      const timer = setTimeout(() => setVisible(false), 1800)
      return () => clearTimeout(timer)
    }
  }, [lastResult])

  if (!visible) return null

  const isScore = lastResult === 'score'

  return (
    <div style={{
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      userSelect: 'none',
      animation: 'feedbackPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      <div style={{
        fontSize: 48,
        fontWeight: 800,
        color: isScore ? '#ffd93d' : '#ff6b6b',
        textShadow: `0 0 20px ${isScore ? 'rgba(255,217,61,0.5)' : 'rgba(255,107,107,0.3)'}, 0 4px 8px rgba(0,0,0,0.4)`,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        letterSpacing: '-0.02em',
      }}>
        {message}
      </div>
    </div>
  )
}
