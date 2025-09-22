"use client";

import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { type Character } from "../ui/MainMenu";

type PlayerProps = {
  character: Character;
  targetPosition: THREE.Vector3 | null;
};

const MOVE_SPEED = 5;
const _playerDirection = new THREE.Vector3();
const _playerTranslation = new THREE.Vector3();

export const Player = ({ character, targetPosition }: PlayerProps) => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const playerRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!rigidBody.current || !playerRef.current) return;


    if (!targetPosition) {
        rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        return;
    }
    
    _playerTranslation.copy(rigidBody.current.translation() as THREE.Vector3);
    _playerDirection.subVectors(targetPosition, _playerTranslation);

    if (_playerDirection.length() < 0.2) {
      rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    _playerDirection.normalize().multiplyScalar(MOVE_SPEED);
    rigidBody.current.setLinvel({ x: _playerDirection.x, y: 0, z: _playerDirection.z }, true);

    const angle = Math.atan2(_playerDirection.x, _playerDirection.z);
    playerRef.current.rotation.y = angle;
  });

  return (
    <RigidBody ref={rigidBody} colliders={false} lockRotations position={[0, 1.25, 0]}>
      <group ref={playerRef}>
        <mesh castShadow>
          <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
          <meshStandardMaterial color={character.avatar_color} />
        </mesh>
        <mesh position={[-0.15, 0.8, 0.45]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.15, 0.8, 0.45]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  );
};