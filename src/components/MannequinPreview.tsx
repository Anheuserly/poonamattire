"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import styles from "./MannequinPreview.module.css";

function Mannequin() {
  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.35}>
      <group rotation={[0, -0.35, 0]}>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial color="#f1cdbf" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.58, 0]} scale={[0.72, 1.05, 0.34]}>
          <capsuleGeometry args={[0.58, 0.9, 16, 32]} />
          <meshStandardMaterial color="#8b1e3f" roughness={0.38} metalness={0.08} />
        </mesh>
        <mesh position={[0, -0.18, 0]} scale={[0.9, 0.9, 0.28]}>
          <coneGeometry args={[0.76, 1.25, 64]} />
          <meshStandardMaterial color="#a8244d" roughness={0.42} />
        </mesh>
        <mesh position={[-0.63, 0.48, 0]} rotation={[0, 0, -0.32]}>
          <capsuleGeometry args={[0.09, 1.1, 12, 24]} />
          <meshStandardMaterial color="#f5e6e8" roughness={0.48} />
        </mesh>
        <mesh position={[0.63, 0.48, 0]} rotation={[0, 0, 0.32]}>
          <capsuleGeometry args={[0.09, 1.1, 12, 24]} />
          <meshStandardMaterial color="#f5e6e8" roughness={0.48} />
        </mesh>
        <mesh position={[-0.24, -1.1, 0]}>
          <capsuleGeometry args={[0.11, 1.15, 12, 24]} />
          <meshStandardMaterial color="#6f1733" roughness={0.5} />
        </mesh>
        <mesh position={[0.24, -1.1, 0]}>
          <capsuleGeometry args={[0.11, 1.15, 12, 24]} />
          <meshStandardMaterial color="#6f1733" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.42, 0.18]} rotation={[0, 0, 0.72]}>
          <torusGeometry args={[0.48, 0.012, 8, 80]} />
          <meshStandardMaterial color="#d4af37" metalness={0.75} roughness={0.22} />
        </mesh>
      </group>
    </Float>
  );
}

export function MannequinPreview() {
  return (
    <div className={styles.stage}>
      <Canvas camera={{ position: [0, 1.1, 4.2], fov: 38 }}>
        <ambientLight intensity={0.8} />
        <directionalLight intensity={1.8} position={[3, 5, 3]} />
        <Mannequin />
        <Environment preset="studio" />
        <OrbitControls enablePan={false} minDistance={3.2} maxDistance={5.5} />
      </Canvas>
    </div>
  );
}
