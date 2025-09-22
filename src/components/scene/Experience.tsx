"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { Physics, CuboidCollider, RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useMemo, useState, useRef, Suspense } from "react";
import * as THREE from 'three';
import { Player } from "./Player";
import { type Character } from "../ui/MainMenu";

// Scene Objects (Chair, Table, Window, Avatar) 
const Chair = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[0.8, 0.1, 0.8]} /><meshStandardMaterial color="#A0522D" /></mesh>
      <mesh position={[0, 1.2, -0.35]} castShadow><boxGeometry args={[0.8, 1.2, 0.1]} /><meshStandardMaterial color="#A0522D" /></mesh>
      <mesh position={[-0.35, 0.25, 0.35]} castShadow><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#654321" /></mesh>
      <mesh position={[0.35, 0.25, 0.35]} castShadow><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#654321" /></mesh>
      <mesh position={[-0.35, 0.25, -0.35]} castShadow><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#654321" /></mesh>
      <mesh position={[0.35, 0.25, -0.35]} castShadow><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#654321" /></mesh>
    </group>
);
const Table = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow><cylinderGeometry args={[1.2, 1.2, 0.1, 32]} /><meshStandardMaterial color="#D2B48C" /></mesh>
      <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 1, 16]} /><meshStandardMaterial color="#8B4513" /></mesh>
    </group>
);
const Window = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        <mesh><planeGeometry args={[2.5, 2]} /><meshStandardMaterial color="#E0FFFF" transparent opacity={0.3} roughness={0.1} metalness={0.2} /></mesh>
        <mesh position={[0, 0, 0]}><boxGeometry args={[.1, 2, 0.1]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
        <mesh position={[0.6, 0, 0]}><boxGeometry args={[1.3, .1, 0.1]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
	    <mesh position={[-0.6, 0, 0]}><boxGeometry args={[1.3, .1, 0.1]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
        <mesh position={[0, 1, 0]}><boxGeometry args={[2.5, .1, 0.1]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
        <mesh position={[0, -1, 0]}><boxGeometry args={[2.5, .1, 0.1]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
        <mesh position={[1.2, 0, 0]}><boxGeometry args={[.1, 2, 0.1]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
        <mesh position={[-1.2, 0, 0]}><boxGeometry args={[.1, 2, 0.1]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
    </group>
);
const Avatar = ({ avatarColor, position }: { avatarColor: string, position: THREE.Vector3 }) => (
    <group position={position} rotation={[0,1.5,0]}>
        <mesh castShadow><capsuleGeometry args={[0.50, 1.5, 5, 8]} /><meshStandardMaterial color={avatarColor} /></mesh>
        <mesh position={[-0.15, .8, 0.40]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color="black" /></mesh>
        <mesh position={[0.15, .8, 0.40]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color="black" /></mesh>
    </group>
);

const MenuCamera = () => (
    <>
      <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={50} />
      <OrbitControls target={[0, 1, 0]} minZoom={30} maxZoom={80} />
    </>
);

const CharacterCreatorCamera = ({ target }: { target: THREE.Vector3 }) => (
    <>
      <PerspectiveCamera makeDefault position={[target.x + 4.5, target.y + 3.1, target.z + 5]} fov={50} />
      <OrbitControls target={target} minDistance={3} maxDistance={8} />
    </>
);

const InGameCamera= () => (
    <>
      <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={50} />
      <OrbitControls target={[0, 1, 0]} minZoom={30} maxZoom={80} />
    </>
);

export const Experience = ({ gameState, avatarColor, activeCharacter }: { gameState: string, avatarColor: string, activeCharacter: Character | null }) => {
    const avatarPosition = useMemo(() => new THREE.Vector3(-8, 1.25, 1), []);
    const [movementTarget, setMovementTarget] = useState<THREE.Vector3 | null>(null);
    const playerRigidBodyRef = useRef<RapierRigidBody>(null);

    return (
        <Canvas shadows>
            {gameState === 'menu' && <MenuCamera />}
            {gameState === 'character_creation' && <CharacterCreatorCamera target={avatarPosition} />}
            {gameState === 'in_game' && (
                <>
                    <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={80} />
                    <InGameCamera playerRef={playerRigidBodyRef} />
                </>
            )}

            <ambientLight intensity={1.2} />
            <directionalLight position={[10, 15, 5]} intensity={2.5} castShadow />
            <hemisphereLight intensity={0.5} groundColor="black" />
            
            <Suspense fallback={null}>
                <Physics>
                    {gameState === 'in_game' && activeCharacter && (
                        <Player 
                            ref={playerRigidBodyRef}
                            character={activeCharacter} 
                            targetPosition={movementTarget}
                        />
                    )}
                    <RigidBody type="fixed" name="floor">
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow onClick={(e) => setMovementTarget(e.point)}>
                            <planeGeometry args={[20, 20]} />
                            <meshStandardMaterial color="#806C5A" />
                        </mesh>
                    </RigidBody>
                    
                    <RigidBody type="fixed"><CuboidCollider args={[10, 5, 0.1]} position={[0, 5, -10]} /></RigidBody>
                    <RigidBody type="fixed"><CuboidCollider args={[0.1, 5, 10]} position={[-10, 5, 0]} /></RigidBody>
                    
                    <mesh position={[0, 1.9, -10]} receiveShadow><boxGeometry args={[20, 3.9, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
                    <mesh position={[0, 4.87, -10]} receiveShadow><boxGeometry args={[7.5, 2.2, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
                    <mesh position={[8.12, 4.87, -10]} receiveShadow><boxGeometry args={[3.76, 2.2, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
                    <mesh position={[-8.12, 4.87, -10]} receiveShadow><boxGeometry args={[3.76, 2.2, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
                    <mesh position={[0, 8, -10]} receiveShadow><boxGeometry args={[20, 4.1, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
                    <Window position={[-5, 4.92, -10]} />
                    <Window position={[5, 4.92, -10]} />          
                    <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><boxGeometry args={[20, 10.1, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
                    
                    <RigidBody type="fixed" colliders="cuboid"><Table position={[0, 0, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[1.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[-1, 0, -1]} rotation={[0, Math.PI / 4, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[-1, 0, 1]} rotation={[0, Math.PI / 1.2, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Table position={[-7, 0, -7]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[-5.2, 0, -7]} rotation={[0, -Math.PI / 2, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[-8.8, 0, -7]} rotation={[0, Math.PI / 2, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Table position={[-7, 0, 7]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[-5.2, 0, 7]} rotation={[0, -Math.PI / 2, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[-8.8, 0, 7]} rotation={[0, Math.PI / 2, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Table position={[6, 0, -7]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[7.8, 0, -7]} rotation={[0, -Math.PI / 2, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[4.2, 0, -7]} rotation={[0, Math.PI / 2, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Table position={[6, 0, 7]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[7.8, 0, 7]} rotation={[0, -Math.PI / 2, 0]} /></RigidBody>
                    <RigidBody type="fixed" colliders="cuboid"><Chair position={[4.2, 0, 7]} rotation={[0, Math.PI / 2, 0]} /></RigidBody>
                </Physics>
            </Suspense>
            
            {gameState === 'character_creation' && <Avatar avatarColor={avatarColor} position={avatarPosition} />}
        </Canvas>
    );
};