'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import { Suspense } from 'react'

function EarthModel() {
  const { scene } = useGLTF('/models/earthnew.glb')
  return <primitive object={scene} scale={1.5} />
}

useGLTF.preload('/models/earthnew.glb')

export default function Earth() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <Suspense fallback={<Html center>Loading planet…</Html>}>
        <EarthModel />
      </Suspense>

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  )
}
