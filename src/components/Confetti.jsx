import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useGameState from '../hooks/useGameState'
import { BIN_POS } from './Dustbin'

const PARTICLE_COUNT = 50
const COLORS = [
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
  '#FF922B', '#CC5DE8', '#FF85A1', '#45B7D1',
]

// Pre-build shared geometries for shape variety
const GEOMETRIES = [
  // Thin paper rectangles
  new THREE.BoxGeometry(0.08, 0.04, 0.012),
  // Small confetti dots
  new THREE.CircleGeometry(0.025, 8),
  // Slightly larger paper bits
  new THREE.BoxGeometry(0.05, 0.07, 0.01),
  // Tiny square bits
  new THREE.BoxGeometry(0.04, 0.04, 0.015),
]

export default function Confetti() {
  const groupRef = useRef()
  const lastResult = useGameState((s) => s.lastResult)
  const timeRef = useRef(0)

  // Per-particle persistent state
  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)])
      arr.push({
        position: new THREE.Vector3(0, -10, 0),
        velocity: new THREE.Vector3(),
        color,
        // oscillation properties for flutter
        oscAmpX: 0.4 + Math.random() * 1.2,
        oscAmpZ: 0.4 + Math.random() * 1.2,
        oscFreqX: 2 + Math.random() * 4,
        oscFreqZ: 2 + Math.random() * 4,
        oscPhaseX: Math.random() * Math.PI * 2,
        oscPhaseZ: Math.random() * Math.PI * 2,
        // which geometry shape to use
        geoIndex: Math.floor(Math.random() * GEOMETRIES.length),
        // spin speeds
        spinX: (Math.random() - 0.5) * 8,
        spinY: (Math.random() - 0.5) * 6,
        spinZ: (Math.random() - 0.5) * 4,
        // rotation state
        rotX: 0,
        rotY: 0,
        rotZ: 0,
      })
    }
    return arr
  }, [])

  // Per-geometry-type instanced meshes: we need refs for each
  const meshRefs = useRef([])

  const initialized = useRef(false)

  // Group particles by geometry index for instanced rendering
  const groups = useMemo(() => {
    const g = GEOMETRIES.map(() => [])
    particles.forEach((p, i) => g[p.geoIndex].push(i))
    return g
  }, [particles])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    if (!meshRefs.current || meshRefs.current.length === 0) return

    if (lastResult === 'score') {
      if (!initialized.current) {
        initialized.current = true
        timeRef.current = 0
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particles[i]
          p.position.set(BIN_POS[0], BIN_POS[1] + 0.5, BIN_POS[2])
          p.velocity.set(
            (Math.random() - 0.5) * 4,
            Math.random() * 5 + 3,
            (Math.random() - 0.5) * 4,
          )
          p.rotX = Math.random() * Math.PI * 2
          p.rotY = Math.random() * Math.PI * 2
          p.rotZ = Math.random() * Math.PI * 2
        }
      }

      timeRef.current += delta

      // Update particle positions with gravity + flutter drag
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i]

        // Gravity with drag — slower fall for fluttery feel
        p.velocity.y -= 6.5 * delta // softer gravity
        p.velocity.y *= (1 - 0.8 * delta) // air drag on vertical

        // Dampen horizontal velocity slightly
        p.velocity.x *= (1 - 0.5 * delta)
        p.velocity.z *= (1 - 0.5 * delta)

        p.position.add(p.velocity.clone().multiplyScalar(delta))

        // Sine-wave horizontal oscillation for flutter/drift
        p.position.x += Math.sin(timeRef.current * p.oscFreqX + p.oscPhaseX) * p.oscAmpX * delta
        p.position.z += Math.cos(timeRef.current * p.oscFreqZ + p.oscPhaseZ) * p.oscAmpZ * delta

        // Accumulate spin
        p.rotX += p.spinX * delta
        p.rotY += p.spinY * delta
        p.rotZ += p.spinZ * delta
      }

      // Update each instanced mesh group
      for (let g = 0; g < GEOMETRIES.length; g++) {
        const mesh = meshRefs.current[g]
        if (!mesh) continue
        const indices = groups[g]
        for (let j = 0; j < indices.length; j++) {
          const p = particles[indices[j]]
          dummy.position.copy(p.position)
          dummy.rotation.set(p.rotX, p.rotY, p.rotZ)
          const scale = Math.max(0, 1 - timeRef.current * 0.4)
          dummy.scale.setScalar(scale)
          dummy.updateMatrix()
          mesh.setMatrixAt(j, dummy.matrix)
          mesh.setColorAt(j, p.color)
        }
        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      }
    } else {
      initialized.current = false
      // Hide all particles
      for (let g = 0; g < GEOMETRIES.length; g++) {
        const mesh = meshRefs.current[g]
        if (!mesh) continue
        const count = groups[g].length
        for (let j = 0; j < count; j++) {
          dummy.position.set(0, -10, 0)
          dummy.scale.setScalar(0)
          dummy.updateMatrix()
          mesh.setMatrixAt(j, dummy.matrix)
        }
        mesh.instanceMatrix.needsUpdate = true
      }
    }
  })

  return (
    <group ref={groupRef}>
      {GEOMETRIES.map((geo, g) => (
        <instancedMesh
          key={g}
          ref={(el) => { meshRefs.current[g] = el }}
          args={[geo, null, groups[g].length]}
          frustumCulled={false}
        >
          <meshStandardMaterial
            roughness={0.5}
            metalness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.15}
            toneMapped={false}
          />
        </instancedMesh>
      ))}
    </group>
  )
}
