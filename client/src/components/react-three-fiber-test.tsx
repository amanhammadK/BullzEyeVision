import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ANIMATED TEST OBJECTS - Prove React Three Fiber is working
function AnimatedTestObjects() {
  const cubeRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const blueCubeRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    try {
      const time = state.clock.elapsedTime;

      // Animate red cube
      if (cubeRef.current) {
        cubeRef.current.rotation.x = time * 1.0;
        cubeRef.current.rotation.y = time * 0.7;
        cubeRef.current.rotation.z = time * 0.5;
        const scale = 1.5 + Math.sin(time * 2) * 0.5;
        cubeRef.current.scale.setScalar(scale);
        cubeRef.current.position.y = Math.sin(time * 1.5) * 1.0;
      }

      // Animate green sphere
      if (sphereRef.current) {
        sphereRef.current.rotation.x = time * 0.5;
        sphereRef.current.rotation.y = time * 1.2;
        sphereRef.current.position.y = Math.cos(time * 1.8) * 0.8;
      }

      // Animate blue cube
      if (blueCubeRef.current) {
        blueCubeRef.current.rotation.x = time * 0.8;
        blueCubeRef.current.rotation.z = time * 1.1;
        blueCubeRef.current.position.y = Math.sin(time * 2.2) * 0.6;
      }

      // Animate yellow torus
      if (torusRef.current) {
        torusRef.current.rotation.x = time * 0.3;
        torusRef.current.rotation.y = time * 0.9;
        torusRef.current.rotation.z = time * 0.6;
      }
    } catch (error) {
      console.error('AnimatedTestObjects animation error:', error);
    }
  });

  useEffect(() => {
    console.log("🎯 AnimatedTestObjects component mounted - React Three Fiber is working!");
    return () => console.log("AnimatedTestObjects component unmounted");
  }, []);

  return (
    <group>
      {/* SUCCESS MESSAGE */}
      <Text
        position={[0, 3, 0]}
        fontSize={1.5}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        ✅ REACT THREE FIBER WORKING!
      </Text>

      {/* IMPOSSIBLE TO MISS RED CUBE */}
      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[4, 4, 4]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* BRIGHT GREEN SPHERE */}
      <mesh ref={sphereRef} position={[6, 0, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>

      {/* BRIGHT BLUE CUBE */}
      <mesh ref={blueCubeRef} position={[-6, 0, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshBasicMaterial color="#0000ff" />
      </mesh>

      {/* ROTATING WIREFRAME TORUS */}
      <mesh ref={torusRef} position={[0, -4, 0]}>
        <torusGeometry args={[3, 1, 16, 100]} />
        <meshBasicMaterial color="#ffff00" wireframe />
      </mesh>
    </group>
  );
}

// MAIN TEST COMPONENT
export default function ReactThreeFiberTest() {
  return (
    <div className="w-full h-screen bg-black">
      {/* SUCCESS MESSAGE */}
      <div className="absolute top-4 left-4 z-10 text-green-400 text-2xl font-bold">
        ✅ REACT THREE FIBER WORKING!
      </div>
      
      {/* 3D CANVAS WITH YELLOW BORDER */}
      <div 
        className="w-full h-full"
        style={{
          border: '5px solid yellow',
          background: 'rgba(255, 255, 0, 0.1)'
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 15], fov: 75 }}
          style={{
            width: '100%',
            height: '100%',
            background: '#000000'
          }}
          onCreated={({ gl, scene, camera }) => {
            console.log('🎯 MINIMAL CANVAS CREATED!', {
              renderer: gl.domElement.tagName,
              sceneChildren: scene.children.length,
              cameraPosition: camera.position,
              canvasSize: { width: gl.domElement.width, height: gl.domElement.height }
            });
          }}
        >
          {/* SUPER BRIGHT LIGHTING */}
          <ambientLight intensity={2.0} />

          {/* ANIMATED TEST OBJECTS */}
          <AnimatedTestObjects />
        </Canvas>
      </div>
    </div>
  );
}
