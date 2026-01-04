'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, useProgress } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'  
function Loader() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        <p className="text-xs text-white/70">
          Loading {Math.floor(progress)}%
        </p>
      </div>
    </Html>
  )
}
function EarthModel() {
  const { scene } = useGLTF('/models/phoenix.glb')

  return (
    <group>
      {/* Earth */}
      <primitive object={scene} scale={1} />

      {/* Glow / Halo */}
      <mesh scale={1.12}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#4cc9f0"
          emissive="#4cc9f0"
          emissiveIntensity={0.6}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
export default function Earth() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      {/* Lights */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <pointLight position={[-5, -5, -5]} intensity={1} />

      <Suspense fallback={<Loader />}>
        <EarthModel />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.9}
      />
    </Canvas>
  )
}
