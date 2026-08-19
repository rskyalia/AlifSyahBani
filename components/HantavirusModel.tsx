"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/hantavirus.glb";

// ── Auto-fit + fade-in scene ─────────────────────────────────────────────────
function HantavirusScene({ isDark }: { isDark: boolean }) {
  const { scene: gltfScene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  // Start at opacity 0 immediately so there's no flash before useEffect scales+fades in
  const opacityRef = useRef(0);
  const readyRef = useRef(false);
  const clonedRef = useRef<THREE.Group | null>(null);

  // Clone scene once — set materials transparent immediately to avoid initial flash
  if (!clonedRef.current) {
    const clone = gltfScene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = (mesh.material as THREE.Material[]).map((m) => {
            const c = m.clone();
            c.transparent = true;
            c.opacity = 0;
            return c;
          });
        } else {
          const c = (mesh.material as THREE.Material).clone();
          c.transparent = true;
          c.opacity = 0;
          mesh.material = c;
        }
      }
    });
    clonedRef.current = clone;
  }

  // Auto-fit and start fade-in
  useEffect(() => {
    const grp = groupRef.current;
    if (!grp) return;

    const box = new THREE.Box3().setFromObject(grp);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    grp.position.set(-center.x, -center.y, -center.z);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetDim = 2.6;
    const scaleFactor = maxDim > 0 ? targetDim / maxDim : 1;
    grp.scale.setScalar(scaleFactor);

    opacityRef.current = 0;
    readyRef.current = true;

    grp.traverse((child) => {
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
  }, []);

  // Frame: fade in smoothly
  useFrame((_, delta) => {
    const grp = groupRef.current;
    if (!readyRef.current || !grp) return;
    if (opacityRef.current < 1) {
      opacityRef.current = Math.min(1, opacityRef.current + delta * 1.0);
      const op = opacityRef.current;
      grp.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mats = Array.isArray((child as THREE.Mesh).material)
            ? ((child as THREE.Mesh).material as THREE.Material[])
            : [(child as THREE.Mesh).material as THREE.Material];
          mats.forEach((m) => { m.opacity = op; });
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedRef.current!} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

interface HantavirusModelProps {
  theme: "light" | "dark";
}

export default function HantavirusModel({ theme }: HantavirusModelProps) {
  const isDark = theme === "dark";

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 40, near: 0.1, far: 200 }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        // Light mode needs lower exposure so highlights aren't burned; dark mode pops more
        toneMappingExposure: isDark ? 1.2 : 1.6,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      {/* ── Lighting ─────────────────────────────────────────────────────── */}

      {/* Dark mode: warm amber cinematic. Light mode: bright full-spectrum white */}
      <ambientLight intensity={isDark ? 0.5 : 2.5} color={isDark ? "#fff8e0" : "#ffffff"} />

      {/* Key light — top-right */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={isDark ? 3.0 : 4.5}
        color={isDark ? "#FBBF24" : "#ffffff"}
      />

      {/* Fill light — bottom-left */}
      <directionalLight
        position={[-5, -4, -3]}
        intensity={isDark ? 1.2 : 2.5}
        color={isDark ? "#D97706" : "#e0eeff"}
      />

      {/* Rim light — back top */}
      <directionalLight
        position={[0, 6, -6]}
        intensity={isDark ? 0.8 : 2.0}
        color={isDark ? "#FDE68A" : "#ffffff"}
      />

      {/* Point lights for glow */}
      <pointLight
        position={[3, 3, 3]}
        intensity={isDark ? 12 : 8}
        color={isDark ? "#F59E0B" : "#ffffff"}
        distance={30}
        decay={2}
      />
      <pointLight
        position={[-3, -2, 3]}
        intensity={isDark ? 6 : 6}
        color={isDark ? "#FDE68A" : "#c8d8ff"}
        distance={30}
        decay={2}
      />

      <Suspense
        fallback={
          <Html center>
            <span
              style={{
                color: isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.4)",
                fontSize: 11,
                fontFamily: "sans-serif",
              }}
            >
              Loading…
            </span>
          </Html>
        }
      >
        <HantavirusScene isDark={isDark} />
      </Suspense>

      {/* Drag to rotate like a globe — auto-rotates gently */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={1.2}
        rotateSpeed={0.7}
      />
    </Canvas>
  );
}
