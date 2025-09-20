"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * Represents a simple coffee table in the 3D scene.
 * It's a brown box positioned at a specific location.
 */
const CoffeeTable = ({ position }: { position: [number, number, number] }) => (
  <mesh position={position}>
    <boxGeometry args={[1, 0.8, 1]} /> {/* Width, Height, Depth */}
    <meshStandardMaterial color="#654321" /> {/* Brown color */}
  </mesh>
);

/**
 * The main 3D scene component.
 * This sets up the camera, lighting, and all the objects in our virtual kapihan.
 */
export const Experience = () => {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 60 }} // Set initial camera position
      shadows 
    >
      {/* OrbitControls allows the user to rotate, pan, and zoom the camera 
        with their mouse. This makes the scene interactive.
      */}
      <OrbitControls />

      {/* This is a soft, ambient light that illuminates the entire scene, 
        ensuring no part is completely black.
      */}
      <ambientLight intensity={0.5} />

      {/* This is a directional light */}
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

      {/* This represents the floor of the coffee shop.
        `receiveShadow` means that other objects can cast shadows onto it.
      */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#4a5568" /> {/* A dark gray color */}
      </mesh>

      {/* Here we add a few coffee tables to populate the scene.
        `castShadow` means these objects will cast shadows on the floor.
      */}
      <group castShadow>
        <CoffeeTable position={[-1, 0, 0]} />
        <CoffeeTable position={[0, 0, 2]} />
        <CoffeeTable position={[3, 0, -1]} />
      </group>
    </Canvas>
  );
};
