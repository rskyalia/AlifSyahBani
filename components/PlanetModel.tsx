"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

const MODEL_PATHS = {
  dark: "/models/moon_planet.glb",
  light: "/models/hantavirus.glb",
} as const;

function AutoFitModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const { camera } = useThree();
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!ref.current) return;

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    ref.current.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const camDistance = (maxDim / 2 / Math.tan(fov / 2)) * 1.4;

    camera.position.set(0, 0, camDistance);
    camera.near = camDistance / 100;
    camera.far = camDistance * 10;
    camera.updateProjectionMatrix();
  }, [scene, camera, modelPath]);

  return (
    <group ref={ref} key={modelPath}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/moon_planet.glb");
useGLTF.preload("/models/hantavirus.glb");

interface PlanetModelProps {
  theme: "light" | "dark";
}

export default function PlanetModel({ theme }: PlanetModelProps) {
  const modelPath = MODEL_PATHS[theme];
  const isDark = theme === "dark";

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: isDark ? 0.75 : 0.85,
      }}
      style={{ pointerEvents: "none" }}
    >
      <Environment preset={isDark ? "night" : "city"} />

      <directionalLight
        position={[4, 6, 3]}
        intensity={isDark ? 2.0 : 1.4}
        color={isDark ? "#fff5e0" : "#ffffff"}
      />
      <directionalLight
        position={[-4, -3, 2]}
        intensity={0.7}
        color={isDark ? "#b0d4ff" : "#dbeafe"}
      />
      <directionalLight position={[0, 0, -6]} intensity={1.2} color="#e0eeff" />

      <pointLight
        position={[3, 4, 2]}
        intensity={isDark ? 8 : 4}
        color={isDark ? "#60a5fa" : "#93c5fd"}
        distance={20}
        decay={2}
      />
      <pointLight
        position={[-3, -4, 2]}
        intensity={isDark ? 5 : 2.5}
        color="#93c5fd"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[0, 0, 5]}
        intensity={isDark ? 4 : 3}
        color="#ffffff"
        distance={15}
        decay={2}
      />

      <ambientLight intensity={isDark ? 0.15 : 0.5} />

      <Suspense
        fallback={
          <Html center>
            <span style={{ color: isDark ? "white" : "#1e293b" }}>
              Loading…
            </span>
          </Html>
        }
      >
        <AutoFitModel modelPath={modelPath} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={1.2}
      />
    </Canvas>
  );
}
