import useGameState from '../hooks/useGameState'

export default function ScoreBoard() {
  const score = useGameState((s) => s.score)
  const throws = useGameState((s) => s.throws)

  return (
    <div style={{
      position: 'absolute',
      top: 24,
      left: 24,
      color: '#fff',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: 16,
        padding: '16px 24px',
        minWidth: 120,
      }}>
        <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>SCORE</div>
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1 }}>{score}</div>
        <div style={{
          fontSize: 13,
          opacity: 0.6,
          marginTop: 8,
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingTop: 8,
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
