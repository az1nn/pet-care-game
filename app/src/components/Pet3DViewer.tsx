import React, { Suspense, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';

interface PetModelProps {
  modelPath: string | number;
}

function PetModel({ modelPath }: PetModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath as string);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() / 4) * 0.3;
    }
  });

  return <primitive ref={meshRef} object={scene} scale={[1.5, 1.5, 1.5]} />;
}

export default function Pet3DViewer() {
  // In a real scenario, this asset would exist.
  // For now, we use a placeholder or ensure the directory exists.
  // The path follows the manual's example.
  const assetSource = require('../../assets/models/pedro_cat.glb');

  return (
    <View style={{ width: '100%', height: 350, backgroundColor: '#faf8f5' }}>
      <Suspense fallback={<ActivityIndicator size="large" color="#5d67a5" />}>
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <PetModel modelPath={assetSource} />
        </Canvas>
      </Suspense>
    </View>
  );
}
