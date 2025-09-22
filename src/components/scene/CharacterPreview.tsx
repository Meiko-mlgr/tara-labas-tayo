"use client";

import { Canvas } from "@react-three/fiber";
import { Stage } from "@react-three/drei";
import { Player } from "./Player";
import { type Character } from "../ui/MainMenu";

export const CharacterPreview = ({ color }: { color: string }) => {
  const mockCharacter: Character = {
    id: "preview",
    avatar_color: color,
    slot_number: 1,
  };

  return (
    <Canvas shadows camera={{ position: [0, 1, 3], fov: 45 }}>
      <Stage environment="city" intensity={0.5} shadows={false}>
        <Player 
          character={mockCharacter}
          targetPosition={null} 
        />
      </Stage>
    </Canvas>
  );
};