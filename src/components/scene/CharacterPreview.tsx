"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { Player } from "./Player";

export const CharacterPreview = ({ color }: { color: string }) => {
  return (
    <Canvas shadows camera={{ position: [0, 1, 3], fov: 45 }}>
      <Stage environment="city" intensity={0.5} shadows={false}>
        <Player color={color} position={[0, 0.7, 0]} />
      </Stage>
    </Canvas>
  );
};