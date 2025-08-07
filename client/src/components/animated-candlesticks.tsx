import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Text, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

// INTERSTELLAR BLACK HOLE EFFECT
function CosmicBlackHole() {
  const blackHoleRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (blackHoleRef.current) {
      blackHoleRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      ringsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={blackHoleRef} position={[0, 0, -5]}>
      {/* Central Black Hole */}
      <Sphere args={[0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#000000"
          emissive="#001122"
          emissiveIntensity={2}
          metalness={1}
          roughness={0}
        />
      </Sphere>

      {/* Accretion Disk Rings */}
      <group ref={ringsRef}>
        {[1.5, 2.2, 3.0, 4.0].map((radius, i) => (
          <Torus key={i} args={[radius, 0.05, 8, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color={i % 2 === 0 ? "#ff4444" : "#00ff88"}
              emissive={i % 2 === 0 ? "#ff2222" : "#00ff44"}
              emissiveIntensity={1.5}
              transparent
              opacity={0.7 - i * 0.1}
            />
          </Torus>
        ))}
      </group>

      {/* Cosmic Particles */}
      <Sparkles
        count={200}
        scale={8}
        size={3}
        speed={2}
        color="#ffffff"
      />
    </group>
  );
}

// MARVEL-STYLE ENERGY CUBES
function EnergyDataCube({ position, data, index }: { position: [number, number, number], data: any, index: number }) {
  const cubeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const isPositive = data.close > data.open;

  useFrame((state) => {
    if (cubeRef.current) {
      // Floating with complex motion
      cubeRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.5;
      cubeRef.current.rotation.x = state.clock.elapsedTime * 0.5 + index;
      cubeRef.current.rotation.y = state.clock.elapsedTime * 0.3 + index;

      // Pulsing scale based on "market data"
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.3;
      cubeRef.current.scale.setScalar(scale);
    }

    if (glowRef.current) {
      // Outer glow effect
      const glowScale = 1.5 + Math.sin(state.clock.elapsedTime * 4 + index) * 0.5;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group position={position}>
      {/* Outer Glow */}
      <Box ref={glowRef} args={[1, 1, 1]}>
        <meshStandardMaterial
          color={isPositive ? "#00ff88" : "#ff4444"}
          emissive={isPositive ? "#00ff88" : "#ff4444"}
          emissiveIntensity={0.8}
          transparent
          opacity={0.2}
        />
      </Box>

      {/* Inner Core */}
      <Box ref={cubeRef} args={[0.6, 0.6, 0.6]}>
        <meshStandardMaterial
          color={isPositive ? "#00ffaa" : "#ff2244"}
          emissive={isPositive ? "#004422" : "#442222"}
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      {/* Energy Trails */}
      <Sparkles
        count={15}
        scale={2}
        size={4}
        speed={3}
        color={isPositive ? "#00ff88" : "#ff4444"}
      />
    </group>
  );
}

// Floating Price Numbers
function FloatingPrice({ position, price, isPositive }: { position: [number, number, number], price: number, isPositive: boolean }) {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        ref={textRef}
        position={position}
        fontSize={0.3}
        color={isPositive ? "#00ff88" : "#ff4444"}
        anchorX="center"
        anchorY="middle"
      >
        ${price.toFixed(2)}
      </Text>
    </Float>
  );
}

// INTERSTELLAR WORMHOLE TUNNEL
function CosmicWormhole() {
  const wormholeRef = useRef<THREE.Group>(null);
  const tunnelRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (wormholeRef.current) {
      wormholeRef.current.rotation.z = state.clock.elapsedTime * 0.8;
    }
    if (tunnelRef.current) {
      tunnelRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={wormholeRef} position={[8, 0, -8]}>
      {/* Wormhole Tunnel */}
      <mesh ref={tunnelRef}>
        <torusGeometry args={[3, 0.8, 16, 100]} />
        <meshStandardMaterial
          color="#001144"
          emissive="#0033ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Energy Rings */}
      {[1, 2, 3, 4, 5].map((i) => (
        <Torus key={i} args={[2 + i * 0.5, 0.1, 8, 50]} position={[0, 0, i * 0.5]}>
          <meshStandardMaterial
            color="#00aaff"
            emissive="#0066ff"
            emissiveIntensity={2}
            transparent
            opacity={1 - i * 0.15}
          />
        </Torus>
      ))}
    </group>
  );
}

// MARVEL COSMIC ENERGY FIELD
function CosmicEnergyField() {
  const fieldRef = useRef<THREE.Points>(null);

  const particleCount = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Create spiral galaxy pattern
      const radius = Math.random() * 15;
      const angle = Math.random() * Math.PI * 4;
      const height = (Math.random() - 0.5) * 8;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // Color based on distance from center
      const colorIntensity = 1 - (radius / 15);
      colors[i * 3] = Math.random() * colorIntensity; // R
      colors[i * 3 + 1] = Math.random() * colorIntensity + 0.5; // G
      colors[i * 3 + 2] = 1; // B
    }
    return { positions: pos, colors };
  }, []);

  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y = state.clock.elapsedTime * 0.1;

      // Animate particles in spiral motion
      const posArray = fieldRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const time = state.clock.elapsedTime;

        // Add wave motion
        posArray[i3 + 1] += Math.sin(time * 2 + i * 0.1) * 0.02;

        // Spiral motion
        const currentRadius = Math.sqrt(posArray[i3] ** 2 + posArray[i3 + 2] ** 2);
        const currentAngle = Math.atan2(posArray[i3 + 2], posArray[i3]) + 0.01;

        posArray[i3] = Math.cos(currentAngle) * currentRadius;
        posArray[i3 + 2] = Math.sin(currentAngle) * currentRadius;
      }
      fieldRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={fieldRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={positions.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// INTERSTELLAR CINEMATIC SCENE
function InterstellarScene() {
  const sceneRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Generate cosmic market data
  const cosmicData = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      open: 100 + Math.random() * 50,
      close: 100 + Math.random() * 50,
      high: 120 + Math.random() * 30,
      low: 80 + Math.random() * 20,
    }));
  }, []);

  useFrame((state) => {
    if (sceneRef.current) {
      // Cinematic camera movement
      sceneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      sceneRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.5;
    }

    // Dynamic camera positioning for cinematic effect
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2;
    camera.position.y = 2 + Math.sin(state.clock.elapsedTime * 0.15) * 1;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={sceneRef}>
      {/* CINEMATIC LIGHTING SETUP */}
      <ambientLight intensity={0.1} color="#001122" />

      {/* Key Light - Main dramatic lighting */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={2}
        color="#00aaff"
        castShadow
      />

      {/* Fill Light - Softer secondary light */}
      <pointLight position={[-8, 5, 8]} intensity={1.5} color="#ff4400" />

      {/* Rim Light - Edge lighting for drama */}
      <pointLight position={[0, -5, -10]} intensity={1} color="#ffffff" />

      {/* Cosmic accent lights */}
      <pointLight position={[15, 0, 0]} intensity={0.8} color="#ff0088" />
      <pointLight position={[-15, 0, 0]} intensity={0.8} color="#00ff88" />

      {/* MAIN COSMIC ELEMENTS */}
      <CosmicBlackHole />
      <CosmicWormhole />
      <CosmicEnergyField />

      {/* MARVEL-STYLE DATA CUBES */}
      {cosmicData.map((data, index) => (
        <EnergyDataCube
          key={index}
          position={[
            (index - 4) * 3 + Math.sin(index) * 2,
            Math.cos(index) * 2,
            Math.sin(index * 2) * 3
          ]}
          data={data}
          index={index}
        />
      ))}

      {/* FLOATING HOLOGRAPHIC PRICES */}
      {cosmicData.slice(0, 4).map((data, index) => (
        <FloatingPrice
          key={`cosmic-price-${index}`}
          position={[
            (index - 2) * 4,
            4 + Math.sin(index) * 2,
            2 + Math.cos(index) * 2
          ]}
          price={data.close}
          isPositive={data.close > data.open}
        />
      ))}

      {/* SPACE-TIME GRID */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[50, 50, 20, 20]} />
        <meshStandardMaterial
          color="#000033"
          emissive="#001144"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>

      {/* COSMIC BACKGROUND SPHERES */}
      {[...Array(5)].map((_, i) => (
        <Sphere
          key={`bg-sphere-${i}`}
          args={[0.5]}
          position={[
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20,
            -15 + Math.random() * -10
          ]}
        >
          <meshStandardMaterial
            color={i % 2 === 0 ? "#ff4444" : "#00ff88"}
            emissive={i % 2 === 0 ? "#ff2222" : "#00ff44"}
            emissiveIntensity={1}
            transparent
            opacity={0.3}
          />
        </Sphere>
      ))}
    </group>
  );
}

// INTERSTELLAR CINEMATIC COMPONENT
export default function AnimatedCandlesticks() {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{
          position: [0, 3, 12],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Post-processing effects for cinematic look */}
        <fog attach="fog" args={['#000011', 10, 50]} />

        <InterstellarScene />
      </Canvas>
    </div>
  );
}
