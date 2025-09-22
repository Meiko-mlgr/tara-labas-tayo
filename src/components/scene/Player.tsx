"use client";

import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useRef, forwardRef, useEffect } from "react";
import * as THREE from "three";
import { type Character } from "../ui/MainMenu";

type PlayerProps = {
  character: Character;
  targetPosition: THREE.Vector3 | null;
  initialPosition: THREE.Vector3;
};

const MOVE_SPEED = 5;
const _playerDirection = new THREE.Vector3();
const _playerTranslation = new THREE.Vector3();


export const Player = forwardRef<RapierRigidBody, PlayerProps>(({ character, targetPosition, initialPosition }, ref) => {
  const playerRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const rigidBody = (ref as React.RefObject<RapierRigidBody>)?.current;
    if (rigidBody) {
      rigidBody.setTranslation(initialPosition, true);
    }
  }, [initialPosition, ref]);

  useFrame(() => {
    const rigidBody = (ref as React.RefObject<RapierRigidBody>)?.current;
    if (!rigidBody || !playerRef.current) return;

    if (!targetPosition) {
        rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
        return;
    }
    
    _playerTranslation.copy(rigidBody.translation() as THREE.Vector3);
    _playerDirection.subVectors(targetPosition, _playerTranslation);

    if (_playerDirection.length() < 0.2) {
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    _playerDirection.normalize().multiplyScalar(MOVE_SPEED);
    rigidBody.setLinvel({ x: _playerDirection.x, y: 0, z: _playerDirection.z }, true);

    const angle = Math.atan2(_playerDirection.x, _playerDirection.z);
    playerRef.current.rotation.y = angle;
  });

  return (
    <RigidBody ref={ref} colliders={false} lockRotations>
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
});

Player.displayName = "Player";