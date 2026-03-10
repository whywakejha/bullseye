/*
Kenney Furniture Kit — books.glb
Manually created component for the books model.
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Books(props) {
  const { nodes, materials } = useGLTF('/bullseye/models/books.glb')
  return (
    <group {...props} dispose={null}>
      {/* Render all mesh children from the GLB scene */}
      {Object.entries(nodes).map(([name, node]) => {
        if (node.isMesh) {
          return (
            <mesh
              key={name}
              geometry={node.geometry}
              material={node.material}
              position={node.position ? [node.position.x, node.position.y, node.position.z] : undefined}
              rotation={node.rotation ? [node.rotation.x, node.rotation.y, node.rotation.z] : undefined}
              scale={node.scale ? [node.scale.x, node.scale.y, node.scale.z] : undefined}
              castShadow
              receiveShadow
            />
          )
        }
        return null
      })}
    </group>
  )
}

useGLTF.preload('/bullseye/models/books.glb')
