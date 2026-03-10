import { useEffect, useRef } from 'react'
import useGameState from '../hooks/useGameState'

const FONT = "'Fredoka', 'Nunito', 'Segoe UI', system-ui, sans-serif"

export default function ScoreBoard() {
  const score = useGameState((s) => s.score)
  const throws = useGameState((s) => s.throws)
  const scoreRef = useRef(null)
  const prevScore = useRef(score)

  useEffect(() => {
    if (score !== prevScore.current) {
      prevScore.current = score
      const el = scoreRef.current
      if (el) {
        el.style.animation = 'none'
        // force reflow so the animation restarts
        void el.offsetWidth
        el.style.animation = 'scoreBounce 0.45s cubic-bezier(0.34,1.56,0.64,1)'
      }
    }
  }, [score])

  return (
    <div style={{
      position: 'absolute',
      top: 24,
      left: 24,
      color: '#fff',
      fontFamily: FONT,
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(30,20,50,0.6), rgba(10,10,30,0.7))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 20,
        padding: '18px 28px',
        minWidth: 130,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          opacity: 0.7,
          marginBottom: 4,
          letterSpacing: '0.06em',
        }}>
          <span role="img" aria-label="paper ball" style={{ marginRight: 5 }}>
            {"🏀"}
          </span>
          SCORE
        </div>
        <div
          ref={scoreRef}
          style={{
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {score}
        </div>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          opacity: 0.55,
          marginTop: 10,
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: 10,
          fontFamily: "'Nunito', 'Segoe UI', system-ui, sans-serif",
        }}>
          {throws} throw{throws !== 1 ? 's' : ''}
          {throws > 0 && (
            <span style={{ marginLeft: 8 }}>
              ({Math.round((score / throws) * 100)}%)
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
