import { useEffect, useState, useRef } from 'react'
import useGameState from '../hooks/useGameState'

const FONT = "'Fredoka', 'Nunito', 'Segoe UI', system-ui, sans-serif"

const MESSAGES = {
  score: ['Nice shot!', 'Bullseye!', 'Nothing but net!', 'Swish!', 'Perfect!'],
  miss: ['So close!', 'Almost!', 'Try again!', 'Next time!', 'Keep going!'],
}

export default function ThrowFeedback() {
  const lastResult = useGameState((s) => s.lastResult)
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const [message, setMessage] = useState('')
  const timerRef = useRef(null)
  const fadeRef = useRef(null)

  useEffect(() => {
    if (lastResult) {
      const msgs = MESSAGES[lastResult]
      setMessage(msgs[Math.floor(Math.random() * msgs.length)])
      setVisible(true)
      setFading(false)

      clearTimeout(timerRef.current)
      clearTimeout(fadeRef.current)

      // After the pop-in, start the float-away
      fadeRef.current = setTimeout(() => setFading(true), 600)
      // Remove from DOM after float-away completes
      timerRef.current = setTimeout(() => setVisible(false), 2100)

      return () => {
        clearTimeout(timerRef.current)
        clearTimeout(fadeRef.current)
      }
    }
  }, [lastResult])

  if (!visible) return null

  const isScore = lastResult === 'score'

  const scoreColor = '#ffd93d'
  const missColor = '#ff9eb5'

  return (
    <div style={{
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      userSelect: 'none',
      animation: fading
        ? 'feedbackFloatAway 1.5s ease-in forwards'
        : 'feedbackPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    }}>
      <div style={{
        fontSize: 64,
        fontWeight: 700,
        color: isScore ? scoreColor : missColor,
        textShadow: isScore
          ? `0 0 30px rgba(255,217,61,0.55), 0 0 60px rgba(255,200,40,0.25), 0 4px 12px rgba(0,0,0,0.35)`
          : `0 0 24px rgba(255,158,181,0.35), 0 4px 12px rgba(0,0,0,0.3)`,
        fontFamily: FONT,
        letterSpacing: '-0.02em',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        {message}
      </div>
    </div>
  )
}
