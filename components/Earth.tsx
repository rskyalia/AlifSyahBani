'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'

function AutoFitModel() {
  const { scene } = useGLTF('/models/hantavirus.glb')
  const { camera } = useThree()
  const ref = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!ref.current) return

    const box = new THREE.Box3().setFromObject(ref.current)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    ref.current.position.sub(center)

    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
    const camDistance = (maxDim / 2 / Math.tan(fov / 2)) * 1.4

    camera.position.set(0, 0, camDistance)
    camera.near = camDistance / 100
    camera.far = camDistance * 10
    camera.updateProjectionMatrix()
  }, [scene, camera])

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/circle_ring.glb')

export default function Earth() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      {/* Environment map untuk refleksi realistis */}
      <Environment preset="city" />

      {/* Key light — dari kiri atas, warm white */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={3.5}
        color="#fff5e0"
        castShadow
      />

      {/* Fill light — dari kanan bawah, cool blue */}
      <directionalLight
        position={[-4, -3, 2]}
        intensity={1.2}
        color="#b0d4ff"
      />

      {/* Rim light — dari belakang, memberi outline glow */}
      <directionalLight
        position={[0, 0, -6]}
        intensity={2.0}
        color="#e0eeff"
      />

      {/* Accent point lights — warna biru/putih untuk nuansa space */}
      <pointLight position={[3, 4, 2]}  intensity={15} color="#60a5fa" distance={20} decay={2} />
      <pointLight position={[-3, -4, 2]} intensity={10} color="#93c5fd" distance={20} decay={2} />
      <pointLight position={[0, 0, 5]}  intensity={8}  color="#ffffff" distance={15} decay={2} />

      {/* Ambient sangat minimal — biarkan shadow terasa */}
      <ambientLight intensity={0.3} />

      <Suspense fallback={<Html center><span style={{ color: 'white' }}>Loading…</span></Html>}>
        <AutoFitModel />
      </Suspense>

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
    </Canvas>
  )
}
