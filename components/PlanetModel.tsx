"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/black_hole.glb";

function ScaledModel({ isDark }: { isDark: boolean }) {
  const { scene: gltfScene } = useGLTF(MODEL_PATH);
  // Clone scene AND materials so this Canvas owns an independent copy —
  // prevents opacity/material state bleeding with BlackHoleBackground.
  const clonedScene = useRef<THREE.Group | null>(null);
  if (!clonedScene.current) {
    const clone = gltfScene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = (mesh.material as THREE.Material[]).map((m) => m.clone());
        } else {
          mesh.material = (mesh.material as THREE.Material).clone();
        }
      }
    });
    clonedScene.current = clone;
  }

  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!groupRef.current) return;

    // Step 1: Measure the raw bounding box
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    // Step 2: Center the model
    groupRef.current.position.set(-center.x, -center.y, -center.z);

    // Step 3: Scale so the LARGEST dimension = 2.0 world units
    // Camera at z=6, fov=40: half-height ≈ 6 * tan(20°) ≈ 2.18 units
    // maxDim = 2.0 → model fits within ~92% of canvas height
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetDim = 2.0;
    const scaleFactor = maxDim > 0 ? targetDim / maxDim : 1;
    groupRef.current.scale.setScalar(scaleFactor);

    // Step 4: Fade-in setup
    opacityRef.current = 0;
    readyRef.current = true;

    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mats = Array.isArray((child as THREE.Mesh).material)
          ? ((child as THREE.Mesh).material as THREE.Material[])
          : [(child as THREE.Mesh).material as THREE.Material];
        mats.forEach((m) => { m.transparent = true; m.opacity = 0; m.needsUpdate = true; });
      }
    });
  }, []);  // run once after mount — clonedScene is stable

  useFrame((_, delta) => {
    if (!readyRef.current || !groupRef.current) return;
    if (opacityRef.current >= 1) return;
    opacityRef.current = Math.min(1, opacityRef.current + delta * 1.0);
    const op = opacityRef.current;
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mats = Array.isArray((child as THREE.Mesh).material)
          ? ((child as THREE.Mesh).material as THREE.Material[])
          : [(child as THREE.Mesh).material as THREE.Material];
        mats.forEach((m) => { m.opacity = op; });
      }
    });
  });

  void isDark;

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene.current} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

interface PlanetModelProps {
  theme: "light" | "dark";
}

export default function PlanetModel({ theme }: PlanetModelProps) {
  const isDark = theme === "dark";

  return (
    <Canvas
      // Camera at z=6, FOV=40 → half-height ≈ 2.18 world units
      // Model max dim = 2.0 → fills ~92% of canvas — fully contained
      camera={{ position: [0, 0, 6], fov: 40, near: 0.1, far: 200 }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: isDark ? 1.2 : 0.85,
        alpha: true,
      }}
      style={{ width: "100%", height: "100%", pointerEvents: "auto", background: "transparent" }}
    >
      <Environment preset={isDark ? "night" : "dawn"} />

      <directionalLight
        position={[5, 8, 4]}
        intensity={isDark ? 2.5 : 2.5}
        color={isDark ? "#FFB300" : "#ffffff"}
      />

      <pointLight position={[3, 4, 2]} intensity={isDark ? 10 : 3} color={isDark ? "#F59E0B" : "#93c5fd"} distance={20} decay={2} />
      <pointLight position={[-3, -4, 2]} intensity={isDark ? 6 : 2} color={isDark ? "#D97706" : "#93c5fd"} distance={20} decay={2} />
      <ambientLight intensity={isDark ? 0.1 : 0.6} />

      <Suspense fallback={
        <Html center>
          <span style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.4)", fontSize: 11, fontFamily: "sans-serif" }}>
            Loading…
          </span>
        </Html>
      }>
        <ScaledModel isDark={isDark} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.4}
        rotateSpeed={0.6}
      />
    </Canvas>
  );
}
