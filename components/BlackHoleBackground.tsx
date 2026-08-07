"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/black_hole.glb";
const TARGET_DIM = 22.0;  // fills the full viewport — accretion disk edge-to-edge
const FADE_SPEED = 0.6;
const ROTATE_SPEED = 0.02;  // very slow dramatic rotation

function BlackHoleSceneModel() {
  const { scene: gltfScene } = useGLTF(MODEL_PATH);
  // Clone scene AND materials so this Canvas is fully independent from
  // PlanetModel which loads the same GLB in a separate Canvas.
  const clonedScene = useRef<THREE.Group | null>(null);
  if (!clonedScene.current) {
    const clone = gltfScene.clone(true);
    // Deep-clone materials to avoid sharing opacity state between canvases
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

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Setup on the first frame when the group has real geometry
    if (!readyRef.current) {
      const scene = clonedScene.current;
      if (!scene) return;

      const box = new THREE.Box3().setFromObject(groupRef.current);
      if (box.isEmpty()) return; // geometry not attached yet, try next frame

      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      groupRef.current.position.set(-center.x, -center.y, -center.z);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) groupRef.current.scale.setScalar(TARGET_DIM / maxDim);

      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mats = Array.isArray(mesh.material)
            ? (mesh.material as THREE.Material[])
            : [mesh.material as THREE.Material];
          mats.forEach((mat) => {
            mat.transparent = true;
            mat.opacity = 0;
            mat.needsUpdate = true;
          });
        }
      });
      readyRef.current = true;
      return; // apply on next frame
    }

    if (opacityRef.current < 1) {
      opacityRef.current = Math.min(1, opacityRef.current + delta * FADE_SPEED);
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mats = Array.isArray(mesh.material)
            ? (mesh.material as THREE.Material[])
            : [mesh.material as THREE.Material];
          mats.forEach((mat) => { mat.opacity = opacityRef.current; });
        }
      });
    }
    groupRef.current.rotation.y += delta * ROTATE_SPEED;
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene.current} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export default function BlackHoleBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        background: "#000000",  // fallback if WebGL fails or is slow to paint
      }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 6, 20], fov: 60, near: 0.1, far: 500 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,  // reduced — prevents white blowout in model center
          alpha: false,          // opaque canvas — black background, no bleed-through
          antialias: true,
        }}
        style={{ width: "100%", height: "100%", background: "#000000" }}
      >
        <ambientLight intensity={0.03} />
        {/* Golden accretion disk lights — no Environment to avoid sky bleed-through */}
        <pointLight position={[0, 2, 8]}    intensity={30}  color="#FFB300" distance={80}  decay={2} />
        <pointLight position={[10, 4, 5]}   intensity={16}  color="#F59E0B" distance={60}  decay={2} />
        <pointLight position={[-10, -4, 5]} intensity={10}  color="#D97706" distance={50}  decay={2} />
        <directionalLight position={[0, 12, 10]} intensity={0.6} color="#FDE68A" />
        <Suspense fallback={null}>
          <BlackHoleSceneModel />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}
