"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { Html } from "@react-three/drei";

type PlayerState = {
    userId: string;
    position: { x: number; y: number; z: number };
    rotationY: number;
    avatar_color: string;
    characterId: string;
    username?: string;
};

type RemotePlayerProps = {
    state: PlayerState;
    gameState: string;
};

export const RemotePlayer = ({ state, gameState }: RemotePlayerProps) => {
    const rigidBodyRef = useRef<RapierRigidBody>(null);
    const smoothedPosition = useRef(new THREE.Vector3(state.position.x, state.position.y, state.position.z)).current;
    const smoothedQuaternion = useRef(new THREE.Quaternion()).current;

    useFrame((_, delta) => {
        if (!rigidBodyRef.current) return;

        smoothedPosition.lerp(new THREE.Vector3(state.position.x, state.position.y, state.position.z), 15 * delta);

        const targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, state.rotationY, 0));
        smoothedQuaternion.slerp(targetQuaternion, 15 * delta);

        rigidBodyRef.current.setNextKinematicTranslation(smoothedPosition);
        rigidBodyRef.current.setNextKinematicRotation(smoothedQuaternion);
    });

    return (
        <RigidBody ref={rigidBodyRef} type="kinematicPosition" colliders={false}>
            <group>
                {gameState === 'in_game' && (
                    <Html position={[0, 2.0, 0]} wrapperClass="username" center>
                        <div>{state.username || "Player"}</div>
                    </Html>
                )}
                <mesh castShadow>
                    <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
                    <meshStandardMaterial color={state.avatar_color} />
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