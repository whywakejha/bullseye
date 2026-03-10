import { useState, useEffect } from 'react'

const FONT = "'Nunito', 'Fredoka', 'Segoe UI', system-ui, sans-serif"

export default function AimIndicator() {
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const onDown = () => setDragging(true)
    const onUp = () => setDragging(false)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('touchstart', onDown)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('touchstart', onDown)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  if (dragging) return null

  return (
    <div style={{
      position: 'absolute',
      bottom: 44,
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      userSelect: 'none',
      color: 'rgba(255,255,255,0.5)',
      fontFamily: FONT,
      fontSize: 16,
      fontWeight: 600,
      textAlign: 'center',
      animation: 'fadeInUp 1s ease, aimPulse 2.5s ease-in-out 1s infinite',
      letterSpacing: '0.02em',
    }}>
      <span role="img" aria-label="drag hint" style={{ marginRight: 6 }}>
        {"👋"}
      </span>
      Drag to aim & throw
    </div>
  )
}
