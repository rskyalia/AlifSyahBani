"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

// Always use hantavirus model for both light and dark mode
const MODEL_PATH = "/models/hantavirus.glb";

// Camera is fixed — never moves
const CAMERA_Z = 4.5;
const CAMERA_FOV = 45;

// How much of the canvas height the model should fill (0–1)
// tan(FOV/2) * CAMERA_Z = half-height in world units = 4.5 * tan(22.5°) ≈ 1.86
// Target radius ≈ 1.65 → model fills ~89% of canvas height
const TARGET_RADIUS = 1.65;

function ScaledMoon({ isDark }: { isDark: boolean }) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!groupRef.current) return;

    // Compute bounding sphere on the raw scene
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);

    // Translate so center sits at world origin
    groupRef.current.position.set(
      -sphere.center.x,
      -sphere.center.y,
      -sphere.center.z
    );

    // Scale so the model's radius == TARGET_RADIUS
    const scaleFactor = sphere.radius > 0 ? TARGET_RADIUS / sphere.radius : 1;
    groupRef.current.scale.setScalar(scaleFactor);

    // Reset for fade-in
    opacityRef.current = 0;
    readyRef.current = true;

    // Set all materials to start fully transparent
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mats = Array.isArray((child as THREE.Mesh).material)
          ? ((child as THREE.Mesh).material as THREE.Material[])
          : [(child as THREE.Mesh).material as THREE.Material];
        mats.forEach((m) => {
          m.transparent = true;
          m.opacity = 0;
          m.needsUpdate = true;
        });
      }
    });
  }, [scene]);

  // Per-frame: fade opacity from 0 → 1 over ~1s
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

  // Lighting is handled outside, but we can tint meshes per theme here if needed
  void isDark; // consumed by parent lights

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
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
      camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV, near: 0.1, far: 100 }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: isDark ? 0.65 : 0.85,
        alpha: true,
      }}
      style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
    >
      {/* Environment lighting */}
      <Environment preset={isDark ? "night" : "dawn"} />

      {/* Key light */}
      <directionalLight
        position={[5, 8, 4]}
        intensity={isDark ? 1.8 : 2.5}
        color={isDark ? "#fff5e0" : "#ffffff"}
      />
      {/* Fill light */}
      <directionalLight
        position={[-4, -3, 2]}
        intensity={isDark ? 0.5 : 0.8}
        color={isDark ? "#b0d4ff" : "#dbeafe"}
      />
      {/* Rim light */}
      <directionalLight
        position={[0, 0, -6]}
        intensity={isDark ? 0.8 : 0.4}
        color="#e0eeff"
      />

      {/* Blue accent glow */}
      <pointLight
        position={[3, 4, 2]}
        intensity={isDark ? 6 : 3}
        color={isDark ? "#60a5fa" : "#93c5fd"}
        distance={20}
        decay={2}
      />
      {/* Counter glow */}
      <pointLight
        position={[-3, -4, 2]}
        intensity={isDark ? 4 : 2}
        color="#93c5fd"
        distance={20}
        decay={2}
      />

      <ambientLight intensity={isDark ? 0.1 : 0.6} />

      <Suspense
        fallback={
          <Html center>
            <span style={{
              color: isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.4)",
              fontSize: 11,
              fontFamily: "sans-serif",
            }}>
              Loading…
            </span>
          </Html>
        }
      >
        <ScaledMoon isDark={isDark} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={true}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.8}
        rotateSpeed={0.6}
        panSpeed={0.5}
      />
    </Canvas>
  );
}
