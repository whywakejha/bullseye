import { useState, useEffect } from 'react'

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
      bottom: 40,
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      userSelect: 'none',
      color: 'rgba(255,255,255,0.5)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      fontSize: 15,
      textAlign: 'center',
      animation: 'fadeInUp 1s ease',
    }}>
      Drag to aim & throw
    </div>
  )
}
