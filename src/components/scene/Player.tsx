"use client";

import * as THREE from 'three';

type PlayerProps = {
  color: string;
  position?: [number, number, number];
};

export const Player = ({ color, position = [0, 0, 0] }: PlayerProps) => {
  return (
    <group position={position}>
        <mesh castShadow>
            <capsuleGeometry args={[0.4, 1, 4, 8]} />
            <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[-0.15, 0.3, 0.35]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.15, 0.3, 0.35]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="black" />
        </mesh>
    </group>
  );
};