"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Float } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/black_hole.glb";

// ── Orbiting Particle Ring Component ─────────────────────────────────────────
function CosmicParticleRing({ isDark }: { isDark: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef2 = useRef<THREE.Points>(null);

  const [particles1, particles2] = useMemo(() => {
    const count1 = 180;
    const count2 = 120;
    const pos1 = new Float32Array(count1 * 3);
    const pos2 = new Float32Array(count2 * 3);

    for (let i = 0; i < count1; i++) {
      const angle = (i / count1) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const radius = 1.35 + Math.random() * 0.45;
      const y = (Math.random() - 0.5) * 0.18;
      pos1[i * 3] = Math.cos(angle) * radius;
      pos1[i * 3 + 1] = y;
      pos1[i * 3 + 2] = Math.sin(angle) * radius;
    }

    for (let i = 0; i < count2; i++) {
      const angle = (i / count2) * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.35;
      const y = (Math.random() - 0.5) * 0.12;
      pos2[i * 3] = Math.cos(angle) * radius;
      pos2[i * 3 + 1] = y;
      pos2[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return [pos1, pos2];
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y -= delta * 0.08;
      ringRef2.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.08 + 0.35;
    }
  });

  const color1 = isDark ? "#F59E0B" : "#38BDF8";
  const color2 = isDark ? "#FDE68A" : "#818CF8";

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles1, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={color1}
          transparent
          opacity={isDark ? 0.85 : 0.7}
          depthWrite={false}
        />
      </points>

      <points ref={ringRef2} rotation={[0.4, 0.2, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles2, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          color={color2}
          transparent
          opacity={isDark ? 0.65 : 0.5}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ── 3D Model with GLB + procedural fallback ──────────────────────────────────
function ScaledModel({ isDark }: { isDark: boolean }) {
  const { scene: gltfScene } = useGLTF(MODEL_PATH);
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

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    groupRef.current.position.set(-center.x, -center.y, -center.z);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetDim = 2.1;
    const scaleFactor = maxDim > 0 ? targetDim / maxDim : 1;
    groupRef.current.scale.setScalar(scaleFactor);

    opacityRef.current = 0;
    readyRef.current = true;

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
  }, []);

  useFrame((_, delta) => {
    if (!readyRef.current || !groupRef.current) return;
    if (opacityRef.current < 1) {
      opacityRef.current = Math.min(1, opacityRef.current + delta * 1.2);
      const op = opacityRef.current;
      groupRef.current.traverse((child) => {
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
      <primitive object={clonedScene.current} />
    </group>
  );
}

// ── Interactive Tilt & Drift Wrapper ─────────────────────────────────────────
function InteractiveRig({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  const rigRef = useRef<THREE.Group>(null);
  const floatGroupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }) => {
    if (rigRef.current) {
      // Smooth lerp to mouse coordinates for 3D parallax
      rigRef.current.rotation.x = THREE.MathUtils.lerp(rigRef.current.rotation.x, -pointer.y * 0.35 + 0.1, 0.05);
      rigRef.current.rotation.y = THREE.MathUtils.lerp(rigRef.current.rotation.y, pointer.x * 0.45, 0.05);
    }
    if (floatGroupRef.current) {
      const t = clock.getElapsedTime();
      floatGroupRef.current.position.y = Math.sin(t * 1.5) * 0.06;
      floatGroupRef.current.rotation.z = Math.sin(t * 0.8) * 0.03;
    }
  });

  return (
    <group ref={rigRef}>
      <group ref={floatGroupRef}>
        {children}
        <CosmicParticleRing isDark={isDark} />
      </group>
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
      camera={{ position: [0, 0, 5.2], fov: 42, near: 0.1, far: 200 }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: isDark ? 1.25 : 0.95,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ width: "100%", height: "100%", pointerEvents: "auto", background: "transparent" }}
    >
      {/* 3D Atmospheric Lighting */}
      <ambientLight intensity={isDark ? 0.3 : 0.7} />
      <directionalLight
        position={[6, 8, 5]}
        intensity={isDark ? 3.0 : 2.5}
        color={isDark ? "#FBBF24" : "#ffffff"}
      />
      <directionalLight
        position={[-6, -4, -3]}
        intensity={isDark ? 1.2 : 0.8}
        color={isDark ? "#D97706" : "#60A5FA"}
      />
      <pointLight
        position={[3, 3, 2]}
        intensity={isDark ? 14 : 5}
        color={isDark ? "#F59E0B" : "#38BDF8"}
        distance={25}
        decay={2}
      />
      <pointLight
        position={[-3, -3, 2]}
        intensity={isDark ? 8 : 3}
        color={isDark ? "#D97706" : "#818CF8"}
        distance={25}
        decay={2}
      />

      <InteractiveRig isDark={isDark}>
        <Suspense
          fallback={
            <Html center>
              <span style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.4)", fontSize: 11, fontFamily: "sans-serif" }}>
                Loading…
              </span>
            </Html>
          }
        >
          <ScaledModel isDark={isDark} />
        </Suspense>
      </InteractiveRig>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2 + 0.4}
        minPolarAngle={Math.PI / 2 - 0.4}
      />
    </Canvas>
  );
}

