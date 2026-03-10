import { useRef, useState, useCallback, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useRapier } from '@react-three/rapier'
import * as THREE from 'three'
import useGameState from '../hooks/useGameState'
import { BALL_START } from './PaperBall'

const MAX_POWER = 12
const MIN_POWER = 2
const TRAJECTORY_STEPS = 40
const TRAJECTORY_DT = 0.04

function computeTrajectory(origin, velocity, steps, dt) {
  const points = []
  const g = new THREE.Vector3(0, -9.81, 0)
  const pos = origin.clone()
  const vel = velocity.clone()

  for (let i = 0; i < steps; i++) {
    points.push(pos.clone())
    vel.add(g.clone().multiplyScalar(dt))
    pos.add(vel.clone().multiplyScalar(dt))
    if (pos.y < 0) break
  }
  return points
}

export default function AimController() {
  const { camera, gl } = useThree()
  const throwBall = useGameState((s) => s.throwBall)
  const isThrowing = useGameState((s) => s.isThrowing)
  const ballKey = useGameState((s) => s.ballKey)

  const dragging = useRef(false)
  const startPos = useRef(new THREE.Vector2())
  const currentPos = useRef(new THREE.Vector2())
  const [trajectory, setTrajectory] = useState([])
  const [power, setPower] = useState(0)
  const launchVelRef = useRef(null)

  const getPointerPos = (e) => {
    const rect = gl.domElement.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return new THREE.Vector2(
      (clientX - rect.left) / rect.width,
      (clientY - rect.top) / rect.height
    )
  }

  const onPointerDown = useCallback((e) => {
    if (isThrowing) return
    dragging.current = true
    const pos = getPointerPos(e)
    startPos.current.copy(pos)
    currentPos.current.copy(pos)
  }, [isThrowing])

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return
    e.preventDefault()
    currentPos.current = getPointerPos(e)
  }, [])

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false

    if (launchVelRef.current && power > 0.05) {
      // Find the paper ball rigid body and launch it
      throwBall()

      // We dispatch a custom event with launch velocity for the ball to pick up
      window.dispatchEvent(new CustomEvent('launch-ball', {
        detail: {
          velocity: launchVelRef.current.toArray(),
        }
      }))
    }

    setTrajectory([])
    setPower(0)
    launchVelRef.current = null
  }, [throwBall, power])

  // Attach events
  useEffect(() => {
    const el = gl.domElement
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove, { passive: false })
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('touchstart', onPointerDown, { passive: true })
    el.addEventListener('touchmove', onPointerMove, { passive: false })
    el.addEventListener('touchend', onPointerUp)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('touchstart', onPointerDown)
      el.removeEventListener('touchmove', onPointerMove)
      el.removeEventListener('touchend', onPointerUp)
    }
  }, [onPointerDown, onPointerMove, onPointerUp])

  // Compute trajectory while dragging
  useFrame(() => {
    if (!dragging.current) return

    const dx = startPos.current.x - currentPos.current.x
    const dy = startPos.current.y - currentPos.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const pwr = Math.min(dist * 3, 1)

    setPower(pwr)

    if (pwr < 0.05) {
      setTrajectory([])
      launchVelRef.current = null
      return
    }

    const strength = MIN_POWER + pwr * (MAX_POWER - MIN_POWER)

    // Direction: drag down = throw forward (into screen), drag left/right = aim
    const aimX = dx * 4
    const aimY = 0.5 + dy * 3 // upward arc
    const aimZ = -strength * 0.7

    const velocity = new THREE.Vector3(aimX * strength * 0.3, aimY * strength * 0.5, aimZ)
    const origin = new THREE.Vector3(...BALL_START)

    launchVelRef.current = velocity
    const pts = computeTrajectory(origin, velocity, TRAJECTORY_STEPS, TRAJECTORY_DT)
    setTrajectory(pts)
  })

  if (trajectory.length < 2) return null

  return (
    <Line
      points={trajectory}
      color="#ffffff"
      lineWidth={2}
      dashed
      dashSize={0.15}
      gapSize={0.1}
      transparent
      opacity={0.5 + power * 0.5}
    />
  )
}
