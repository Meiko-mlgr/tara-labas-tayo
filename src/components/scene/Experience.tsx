"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";

/**
 * A component representing a simple chair, built from basic box shapes.
 */
const Chair = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    {/* Seat */}
    <mesh position={[0, 0.55, 0]} castShadow>
      <boxGeometry args={[0.8, 0.1, 0.8]} />
      <meshStandardMaterial color="#A0522D" />
    </mesh>
    {/* Backrest */}
    <mesh position={[0, 1.2, -0.35]} castShadow>
      <boxGeometry args={[0.8, 1.2, 0.1]} />
      <meshStandardMaterial color="#A0522D" />
    </mesh>
    {/* Legs */}
    <mesh position={[-0.35, 0.25, 0.35]} castShadow><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#654321" /></mesh>
    <mesh position={[0.35, 0.25, 0.35]} castShadow><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#654321" /></mesh>
    <mesh position={[-0.35, 0.25, -0.35]} castShadow><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#654321" /></mesh>
    <mesh position={[0.35, 0.25, -0.35]} castShadow><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#654321" /></mesh>
  </group>
);

/**
 * A component for a round table.
 */
const Table = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Tabletop */}
    <mesh position={[0, 1, 0]} castShadow>
      <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
      <meshStandardMaterial color="#D2B48C" />
    </mesh>
    {/* Table Leg */}
    <mesh position={[0, 0.5, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  </group>
);

/**
 * A simple window component to be placed on a wall.
 */
const Window = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        {/* Glass Pane */}
        <mesh>
            <planeGeometry args={[2.5, 2]} />
            <meshStandardMaterial color="#E0FFFF" transparent opacity={0.3} roughness={0.1} metalness={0.2} />
        </mesh>
        {/* Window Frame */}
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[.1, 2, 0.1]} />
            <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[1.3, .1, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[1.3, .1, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[2.5, .1, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[2.5, .1, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[1.2, 0, 0]}>
            <boxGeometry args={[.1, 2, 0.1]} />
            <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-1.2, 0, 0]}>
            <boxGeometry args={[.1, 2, 0.1]} />
            <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
    </group>
);


/**
 * The main 3D scene for the virtual social space.
 */
export const Experience = () => {
  return (
    <Canvas
      shadows
      orthographic
      camera={{
          position: [15, 15, 15],
          zoom: 50,
          near: 1,
          far: 100
      }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight intensity={0.5} groundColor="black" />

      {/* FIX 1: Floor is now slightly lowered to prevent clipping */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#806C5A" />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 1.9, -10]} receiveShadow>
        <boxGeometry args={[20, 3.9, 0.1]} />
        <meshStandardMaterial color="#D3C5B7" />
      </mesh>
      <mesh position={[0, 4.87, -10]} receiveShadow>
        <boxGeometry args={[7.5, 2.2, 0.1]} />
        <meshStandardMaterial color="#D3C5B7" />
      </mesh>
      <mesh position={[8.12, 4.87, -10]} receiveShadow>
        <boxGeometry args={[3.76, 2.2, 0.1]} />
        <meshStandardMaterial color="#D3C5B7" />
      </mesh>
      <mesh position={[8.12, 4.87, -10]} receiveShadow>
        <boxGeometry args={[3.76, 2.2, 0.1]} />
        <meshStandardMaterial color="#D3C5B7" />
      </mesh>
      <mesh position={[-8.12, 4.87, -10]} receiveShadow>
        <boxGeometry args={[3.76, 2.2, 0.1]} />
        <meshStandardMaterial color="#D3C5B7" />
      </mesh>
      <mesh position={[0, 8, -10]} receiveShadow>
        <boxGeometry args={[20, 4.1, 0.1]} />
        <meshStandardMaterial color="#D3C5B7" />
      </mesh>
      <Window position={[-5, 4.92, -10]} />
      <Window position={[5, 4.92, -10] } />

      {/* Left Wall */}
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 10.1, 0.1]} />
        <meshStandardMaterial color="#D3C5B7" />
      </mesh>
      
      {/* Furniture Arrangements */}
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

      {/* FIX 2: Added horizontal rotation limits to the camera */}
      <OrbitControls
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={0}
          maxAzimuthAngle={Math.PI / 2}
          minZoom={30}
          maxZoom={100}
          // enableDolly={false}
          target={[0, 1, 0]}
      />
    </Canvas>
  );
};