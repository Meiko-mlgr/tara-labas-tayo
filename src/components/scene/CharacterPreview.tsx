"use client";

import { Canvas } from "@react-three/fiber";
import { Stage } from "@react-three/drei";
import { Player } from "./Player";
import { type Character } from "../ui/MainMenu";
import * as THREE from "three";
import { useRef } from "react";

export const CharacterPreview = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const mockCharacter: Character = {
    id: "preview",
    user_id: "preview_user",
    avatar_color: color,
    slot_number: 1,
  };

  return (
    <Canvas shadows camera={{ position: [0, 1, 3], fov: 45 }}>
      <Stage environment="city" intensity={0.5} shadows={false}>
        <Player 
          character={mockCharacter}
          targetPosition={null}
          initialPosition={new THREE.Vector3(0, 0, 0)}
          groupRef={groupRef}
          gameState={"in_game"}
        />
      </Stage>
    </Canvas>
  );
};