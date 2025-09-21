"use client";

import { Canvas, useFrame, useThree, RootState } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

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
        {/* Glass Pane */}
        <mesh><planeGeometry args={[2.5, 2]} /><meshStandardMaterial color="#E0FFFF" transparent opacity={0.3} roughness={0.1} metalness={0.2} /></mesh>
        {/* Window Frame */}
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
    // character creation 
    <group position={position} rotation={[0,1.5,0]}>
        <mesh castShadow><capsuleGeometry args={[0.50, 1.5, 5, 8]} /><meshStandardMaterial color={avatarColor} /></mesh>
        <mesh position={[-0.15, .8, 0.40]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color="black" /></mesh>
        <mesh position={[0.15, .8, 0.40]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color="black" /></mesh>
    </group>
);


const CameraController = ({ gameState, controlsRef, avatarPosition }: { gameState: string, controlsRef: React.RefObject<OrbitControlsImpl | null>, avatarPosition: THREE.Vector3 }) => {
    const { camera } = useThree();
    
    // Define camera states for each game state
    const cameraStates = useMemo(() => ({
      menu: {
        position: new THREE.Vector3(15, 15, 15),
        target: new THREE.Vector3(0, 1, 0),
        zoom: 50,
      },
      character_creation: {
        position: new THREE.Vector3(avatarPosition.x + 5, avatarPosition.y + 3.5, avatarPosition.z + 5),
        target: new THREE.Vector3(avatarPosition.x, avatarPosition.y + 0.1, avatarPosition.z), 
        zoom: 110,
      },
      in_game: {
        position: new THREE.Vector3(15, 15, 15),
        target: new THREE.Vector3(0, 1, 0),
        zoom: 50,
      }
    }), []);
  
    useFrame((_: RootState, delta: number) => {
        const currentState = cameraStates[gameState as keyof typeof cameraStates] || cameraStates.menu;
        const controls = controlsRef.current;
        
        if (controls?.enabled === false) {
          camera.position.lerp(currentState.position, 2 * delta);
          controls.target.lerp(currentState.target, 2 * delta);
          
          if (camera instanceof THREE.OrthographicCamera) {
            camera.zoom = THREE.MathUtils.lerp(camera.zoom, currentState.zoom, 2 * delta);
            camera.updateProjectionMatrix();
          }
          
          controls.update();

          if (camera.position.distanceTo(currentState.position) < 0.1) {
            controls.enabled = true;
          }
        }
    });
  
    useEffect(() => {
        const controls = controlsRef.current;
        if (controls) {
            controls.enabled = false;
        }
    }, [gameState, controlsRef]);

    return null;
};

export const Experience = ({ gameState, avatarColor }: { gameState: string, avatarColor: string }) => {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    
    const avatarPosition = useMemo(() => new THREE.Vector3(-8, 1.2, 1), []);

    const orbitControlsSettings = useMemo(() => {
        if (gameState === 'character_creation') {
            return {
                enableRotate: true,
                enablePan: false,
                enableZoom: false,
                minAzimuthAngle: Math.PI / 8,
                maxAzimuthAngle: Math.PI / 1.2,
                minPolarAngle: Math.PI / 3,
                maxPolarAngle: Math.PI / 2,
            };
        }
        // Default settings for menu and in-game
        return {
            enableRotate: true,
            enablePan: true,
            enableZoom: true,
            minAzimuthAngle: -Math.PI / 2000,
            maxAzimuthAngle: Math.PI / 2,
            minPolarAngle: Math.PI / 3,
            maxPolarAngle: Math.PI / 2,
        };
    }, [gameState]);

    return (
        <Canvas shadows>
            <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={50} near={1} far={100} />
            <OrbitControls ref={controlsRef} {...orbitControlsSettings} />
            
            <CameraController gameState={gameState} controlsRef={controlsRef} avatarPosition={avatarPosition} />


            <ambientLight intensity={1.2} />
            <directionalLight position={[10, 15, 5]} intensity={2.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
            <hemisphereLight intensity={0.5} groundColor="black" />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#806C5A" />
            </mesh>
            {/* Back Wall with window */}
            <mesh position={[0, 1.9, -10]} receiveShadow><boxGeometry args={[20, 3.9, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
            <mesh position={[0, 4.87, -10]} receiveShadow><boxGeometry args={[7.5, 2.2, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
            <mesh position={[8.12, 4.87, -10]} receiveShadow><boxGeometry args={[3.76, 2.2, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
            <mesh position={[8.12, 4.87, -10]} receiveShadow><boxGeometry args={[3.76, 2.2, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
            <mesh position={[-8.12, 4.87, -10]} receiveShadow><boxGeometry args={[3.76, 2.2, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
            <mesh position={[0, 8, -10]} receiveShadow><boxGeometry args={[20, 4.1, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
            <Window position={[-5, 4.92, -10]} />
            <Window position={[5, 4.92, -10] } />          
            <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><boxGeometry args={[20, 10.1, 0.1]} /><meshStandardMaterial color="#D3C5B7" /></mesh>
            {/* Furniture */}
            <Table position={[0, 0, 0]} />
            <Chair position={[1.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
            <Chair position={[-1, 0, -1]} rotation={[0, Math.PI / 4, 0]} />
            <Chair position={[-1, 0, 1]} rotation={[0, Math.PI / 1.2, 0]} />

            <Table position={[-7, 0, -7]} />
            <Chair position={[-5.2, 0, -7]} rotation={[0, -Math.PI / 2, 0]} />
            <Chair position={[-8.8, 0, -7]} rotation={[0, Math.PI / 2, 0]} />

            <Table position={[-7, 0, 7]} />
            <Chair position={[-5.2, 0, 7]} rotation={[0, -Math.PI / 2, 0]} />
            <Chair position={[-8.8, 0, 7]} rotation={[0, Math.PI / 2, 0]} />

            <Table position={[6, 0, -7]} />
            <Chair position={[7.8, 0, -7]} rotation={[0, -Math.PI / 2, 0]} />
            <Chair position={[4.2, 0, -7]} rotation={[0, Math.PI / 2, 0]} />
    
            <Table position={[6, 0, 7]} />
            <Chair position={[7.8, 0, 7]} rotation={[0, -Math.PI / 2, 0]} />
            <Chair position={[4.2, 0, 7]} rotation={[0, Math.PI / 2, 0]} />
            
            {gameState === 'character_creation' && <Avatar avatarColor={avatarColor} position={avatarPosition} />}
        </Canvas>
    );
};