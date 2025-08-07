import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Activity, BarChart3, ArrowRight, Brain, Target, Zap, Shield } from "lucide-react";
import * as THREE from 'three';

// SCROLL-BASED 3D SCENE
function ScrollScene({ scrollProgress }: { scrollProgress: number }) {
  const sceneRef = useRef<THREE.Group>(null);

  // Calculate which section we're in based on scroll
  const section = Math.floor(scrollProgress * 4); // 4 main sections
  const sectionProgress = (scrollProgress * 4) % 1;

  useFrame((state) => {
    if (sceneRef.current) {
      // Camera moves through different positions based on scroll
      const camera = state.camera;

      if (section === 0) {
        // Hero section - close up on BULLZEYE
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.1);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.1);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5, 0.1);
        camera.lookAt(0, 0, 0);
      } else if (section === 1) {
        // Features section - pull back and rotate
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, 3, 0.1);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2, 0.1);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8, 0.1);
        camera.lookAt(0, 0, 0);
      } else if (section === 2) {
        // Pricing section - side view
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, -5, 0.1);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1, 0.1);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 3, 0.1);
        camera.lookAt(0, 0, 0);
      } else {
        // Final section - overview
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.1);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 5, 0.1);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 10, 0.1);
        camera.lookAt(0, 0, 0);
      }
    }
  });

  return (
    <group ref={sceneRef}>
      {/* Main BULLZEYE Typography */}
      <group position={[0, 0, 0]}>
        <Text
          fontSize={1.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[-1, 0, 0]}
        >
          BULLZ
        </Text>
        <Text
          fontSize={1.5}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
          position={[1.5, 0, 0]}
        >
          EYE
        </Text>
      </group>

      {/* Trading Data Cubes */}
      <group position={[0, -2, -2]}>
        {['AAPL', 'TSLA', 'NVDA', 'BTC'].map((symbol, index) => (
          <Box
            key={symbol}
            args={[0.5, 0.5, 0.5]}
            position={[(index - 1.5) * 1.5, 0, 0]}
          >
            <meshStandardMaterial
              color={index % 2 === 0 ? "#00ff88" : "#ff4444"}
              emissive={index % 2 === 0 ? "#004422" : "#442222"}
              emissiveIntensity={0.3}
            />
          </Box>
        ))}
      </group>

      {/* Grid Floor */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial
          color="#111111"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// MAIN SCROLL-BASED WEBSITE COMPONENT
export default function CinematicHero() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'linear-gradient(180deg, #000000 0%, #111111 100%)' }}
        >
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
          <pointLight position={[-5, 3, 3]} intensity={0.6} color="#00ff88" />
          <pointLight position={[5, -3, -3]} intensity={0.4} color="#ff4444" />

          <ScrollScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center px-6 py-3 mb-8 bg-black/80 border border-green-500/30 backdrop-blur-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-4 animate-pulse"></div>
              <span className="text-green-400 text-sm font-mono tracking-wider">SYSTEM ACTIVE • MARKETS LIVE</span>
            </div>

            <p className="text-xl text-gray-400 mb-8 font-mono">
              PRECISION TRADING INTELLIGENCE
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button className="bg-green-500 hover:bg-green-400 text-black px-12 py-6 text-xl font-mono font-bold transition-all duration-300 hover:scale-105 border-0">
                <ArrowRight className="mr-3 h-6 w-6" />
                INITIATE
              </Button>

              <Button variant="outline" className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 px-12 py-6 text-xl font-mono font-bold transition-all duration-300">
                <BarChart3 className="mr-3 h-6 w-6" />
                ANALYZE
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white font-mono">
                ARSENAL OF PRECISION
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-mono">
                Every tool engineered for market domination
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: TrendingUp, title: "SMART CHARTS", desc: "AI-powered predictions", color: "#ff4444" },
                { icon: Brain, title: "NEURAL ANALYSIS", desc: "Deep learning insights", color: "#00ff88" },
                { icon: Target, title: "PRECISION TARGETING", desc: "Exact entry/exit points", color: "#ffaa00" },
                { icon: Shield, title: "RISK MANAGEMENT", desc: "Advanced protection", color: "#00aaff" }
              ].map((feature, index) => (
                <Card key={index} className="bg-black/60 border border-gray-800 backdrop-blur-sm hover:bg-black/80 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white font-mono">{feature.title}</h3>
                    <p className="text-gray-400 font-mono">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="min-h-screen flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-16 text-white font-mono">
              PERFORMANCE METRICS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { value: "2,847", label: "ACTIVE SIGNALS", color: "#00ff88" },
                { value: "99.9%", label: "UPTIME", color: "#ffffff" },
                { value: "12ms", label: "RESPONSE TIME", color: "#ff4444" }
              ].map((stat, index) => (
                <div key={index} className="p-8 bg-black/60 border border-gray-800 backdrop-blur-sm">
                  <div className="text-6xl font-mono font-black mb-4" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-xl text-gray-400 font-mono">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="min-h-screen flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white font-mono">
              READY TO DOMINATE?
            </h2>

            <p className="text-2xl text-gray-400 mb-12 font-mono">
              Join the elite traders using BullzEye
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Button className="bg-green-500 hover:bg-green-400 text-black px-16 py-8 text-2xl font-mono font-bold transition-all duration-300 hover:scale-105 border-0">
                <Zap className="mr-4 h-8 w-8" />
                START TRADING
              </Button>

              <Button variant="outline" className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 px-16 py-8 text-2xl font-mono font-bold transition-all duration-300">
                <Activity className="mr-4 h-8 w-8" />
                VIEW DEMO
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// BRUTALIST GRID PLANES
function GridPlanes({ scrollProgress }: { scrollProgress: number }) {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // Grid planes move through space like sci-fi doors
      gridRef.current.position.z = scrollProgress * 3;
      gridRef.current.rotation.x = scrollProgress * 0.3;
    }
  });

  return (
    <group ref={gridRef}>
      {/* Main Grid Plane */}
      <mesh position={[0, -2, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial
          color="#111111"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Side Grid Planes */}
      <mesh position={[-8, 0, -3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[15, 10, 15, 10]} />
        <meshStandardMaterial
          color="#222222"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh position={[8, 0, -3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[15, 10, 15, 10]} />
        <meshStandardMaterial
          color="#222222"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

// PARTICLE FIELD
function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.position.z = scrollProgress * 5;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff88"
        size={0.05}
        transparent
        opacity={0.6}
      />
    </points>
  );
}

// DRONE CAMERA SYSTEM
function DroneCamera({ scrollProgress, mousePosition }: {
  scrollProgress: number,
  mousePosition: { x: number, y: number }
}) {
  const { camera } = useThree();

  useFrame((state) => {
    // HENRI HEYMANS STYLE: Camera flies through 3D space like a drone
    const mouseX = (mousePosition.x / window.innerWidth - 0.5) * 2;
    const mouseY = -(mousePosition.y / window.innerHeight - 0.5) * 2;

    // Cinematic camera movement through trading space
    const targetX = Math.sin(scrollProgress * Math.PI) * 3 + mouseX * 0.5;
    const targetY = 1 + Math.cos(scrollProgress * Math.PI) * 2 + mouseY * 0.3;
    const targetZ = 8 - scrollProgress * 6;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    // Look at target moves through space
    const lookAtX = scrollProgress * 2;
    const lookAtY = Math.sin(scrollProgress * Math.PI * 2) * 0.5;
    const lookAtZ = -scrollProgress * 3;

    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  });

  return null;
}

// MAIN BRUTALIST TRADING SCENE
function BrutalistTradingScene({
  scrollProgress,
  mousePosition
}: {
  scrollProgress: number,
  mousePosition: { x: number, y: number }
}) {
  return (
    <>
      {/* Brutalist Lighting - Harsh directional */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={0.8} color="#00ff88" />
      <pointLight position={[0, -5, 2]} intensity={0.6} color="#ff4444" />

      {/* Drone Camera */}
      <DroneCamera scrollProgress={scrollProgress} mousePosition={mousePosition} />

      {/* 3D Elements */}
      <BrutalistTypography scrollProgress={scrollProgress} />
      <TradingFragments scrollProgress={scrollProgress} />
      <GridPlanes scrollProgress={scrollProgress} />
      <ParticleField scrollProgress={scrollProgress} />
    </>
  );
}

// MAIN BRUTALIST HERO COMPONENT
export default function CinematicHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = window.innerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);

      // Phase transitions like Henri Heymans
      if (progress < 0.3) setCurrentPhase(0);
      else if (progress < 0.6) setCurrentPhase(1);
      else setCurrentPhase(2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="relative min-h-[200vh] overflow-hidden bg-black">
      {/* Brutalist 3D Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 1, 8], fov: 75 }}
          style={{ background: 'linear-gradient(180deg, #000000 0%, #111111 100%)' }}
          gl={{ antialias: true, alpha: false }}
        >
          <BrutalistTradingScene
            scrollProgress={scrollProgress}
            mousePosition={mousePosition}
          />
        </Canvas>
      </div>

      {/* Brutalist UI Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center">

        {/* Phase 0: Initial State */}
        <div
          className={`transition-all duration-1000 ${
            currentPhase === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Status Bar */}
            <div className="inline-flex items-center px-6 py-3 mb-8 bg-black/80 border border-green-500/30 backdrop-blur-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-4 animate-pulse"></div>
              <span className="text-green-400 text-sm font-mono tracking-wider">SYSTEM ACTIVE • MARKETS LIVE</span>
            </div>

            <div className="text-center mb-12">
              <p className="text-xl text-gray-400 mb-8 font-mono">
                SCROLL TO ENTER TRADING SPACE
              </p>
            </div>
          </div>
        </div>

        {/* Phase 1: Typography Focus */}
        <div
          className={`transition-all duration-1000 ${
            currentPhase === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-2xl text-gray-300 mb-8 font-mono tracking-wide">
              PRECISION • INTELLIGENCE • EXECUTION
            </p>
          </div>
        </div>

        {/* Phase 2: Action Interface */}
        <div
          className={`transition-all duration-1000 ${
            currentPhase === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Trading Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="p-6 bg-black/60 border border-gray-800 backdrop-blur-sm">
                <div className="text-3xl font-mono text-green-400 mb-2">2,847</div>
                <div className="text-sm text-gray-400 font-mono">ACTIVE SIGNALS</div>
              </div>
              <div className="p-6 bg-black/60 border border-gray-800 backdrop-blur-sm">
                <div className="text-3xl font-mono text-white mb-2">99.9%</div>
                <div className="text-sm text-gray-400 font-mono">UPTIME</div>
              </div>
              <div className="p-6 bg-black/60 border border-gray-800 backdrop-blur-sm">
                <div className="text-3xl font-mono text-red-400 mb-2">12ms</div>
                <div className="text-sm text-gray-400 font-mono">RESPONSE</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button className="bg-green-500 hover:bg-green-400 text-black px-12 py-6 text-xl font-mono font-bold transition-all duration-300 hover:scale-105 border-0">
                <ArrowRight className="mr-3 h-6 w-6" />
                INITIATE
              </Button>

              <Button variant="outline" className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 px-12 py-6 text-xl font-mono font-bold transition-all duration-300">
                <BarChart3 className="mr-3 h-6 w-6" />
                ANALYZE
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Grainy Brutalist Texture Overlay */}
      <div
        className="fixed inset-0 z-5 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
    </section>
  );
}
