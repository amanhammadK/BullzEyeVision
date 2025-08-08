import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Text, OrbitControls } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Zap, Shield, Target, Brain, Activity, Crosshair, Play } from "lucide-react";
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// CANVAS-BASED CANDLESTICK CHART BACKGROUND
interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
  x: number;
  isGreen: boolean;
}

function CandlestickCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const candlesRef = useRef<CandlestickData[]>([]);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Generate synthetic candlestick data with consistent seed
  const generateCandles = (count: number, startX: number = 0, seed: number = 12345): CandlestickData[] => {
    const candles: CandlestickData[] = [];
    let price = 67500; // Fixed starting price

    // Simple seeded random function for consistent results
    let seedValue = seed;
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };

    for (let i = 0; i < count; i++) {
      const change = (seededRandom() - 0.5) * 600; // Smaller, more realistic changes
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + seededRandom() * 150;
      const low = Math.min(open, close) - seededRandom() * 150;

      candles.push({
        open,
        high,
        low,
        close,
        x: startX + i * 15, // Slightly wider spacing
        isGreen: close > open
      });

      price = close;
    }

    return candles;
  };

  // Initialize candles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const candleCount = Math.ceil(window.innerWidth / 15) + 30; // Extra candles for smooth scrolling
      candlesRef.current = generateCandles(candleCount, -450, 12345); // Start off-screen with consistent seed
    }
  }, []);

  // Canvas drawing function
  const drawCandles = (ctx: CanvasRenderingContext2D, candles: CandlestickData[], offset: number) => {
    const canvas = ctx.canvas;
    const centerY = canvas.height * 0.5; // Center the chart vertically
    const priceScale = 0.015; // Larger scale for more visible movement

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    candles.forEach((candle) => {
      const x = candle.x + offset;

      // Skip candles outside viewport (with buffer)
      if (x < -30 || x > canvas.width + 30) return;

      const openY = centerY - (candle.open - 67500) * priceScale;
      const closeY = centerY - (candle.close - 67500) * priceScale;
      const highY = centerY - (candle.high - 67500) * priceScale;
      const lowY = centerY - (candle.low - 67500) * priceScale;

      const bodyTop = Math.min(openY, closeY);
      const bodyBottom = Math.max(openY, closeY);
      const bodyHeight = Math.max(bodyBottom - bodyTop, 3); // Minimum 3px height for visibility

      // Set colors with appropriate opacity
      const color = candle.isGreen ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 68, 119, 0.3)';
      const wickColor = candle.isGreen ? 'rgba(0, 255, 136, 0.25)' : 'rgba(255, 68, 119, 0.25)';

      // Draw wick
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw body
      ctx.fillStyle = color;
      ctx.fillRect(x - 6, bodyTop, 12, bodyHeight);

      // Draw body outline for better definition
      ctx.strokeStyle = color.replace('0.3', '0.5');
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 6, bodyTop, 12, bodyHeight);
    });
  };

  // Animation loop
  const animate = (currentTime: number) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Control animation speed (60fps target)
    if (currentTime - lastTimeRef.current >= 16.67) {
      // Move candles from right to left
      offsetRef.current -= 1.0; // Slightly faster movement

      // Reset and regenerate when candles move too far left
      if (offsetRef.current <= -450) {
        offsetRef.current = 0;
        const candleCount = Math.ceil(window.innerWidth / 15) + 30;
        candlesRef.current = generateCandles(candleCount, -450, 12345); // Same seed for consistency
      }

      drawCandles(ctx, candlesRef.current, offsetRef.current);
      lastTimeRef.current = currentTime;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Setup scroll effects with GSAP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: canvas,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Apply distortion effects
        const blur = progress * 8;
        const opacity = Math.max(0.25 - progress * 0.25, 0);
        const scale = 1 + progress * 0.1;

        gsap.set(canvas, {
          filter: `blur(${blur}px)`,
          opacity: opacity,
          scale: scale,
          transformOrigin: "center center"
        });
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 1,
        opacity: 0.25,
        mixBlendMode: 'normal'
      }}
    />
  );
}

// 3D MARKET GLOBE - ROTATING HUD ELEMENT
function MarketGlobe() {
  const globeRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    try {
      if (globeRef.current && state.clock) {
        globeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;

        // Depth of field camera movement - using pointer instead of deprecated mouse
        if (state.pointer) {
          const mouseX = (state.pointer.x * 0.5);
          const mouseY = (state.pointer.y * 0.5);
          globeRef.current.position.x = THREE.MathUtils.lerp(globeRef.current.position.x, mouseX, 0.02);
          globeRef.current.position.y = THREE.MathUtils.lerp(globeRef.current.position.y, mouseY, 0.02);
        }
      }

      // Trading data particles
      if (particlesRef.current && state.clock) {
        particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      }
    } catch (error) {
      console.error('MarketGlobe animation error:', error);
    }
  });

  // Create particle system for trading data
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <group ref={globeRef}>
      {/* Main Globe */}
      <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#00cc66" 
          wireframe 
          transparent 
          opacity={0.3}
        />
      </Sphere>
      
      {/* Inner Core */}
      <Sphere args={[0.8, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1}
        />
      </Sphere>
      
      {/* Trading Data Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#00cc66" 
          size={0.02} 
          transparent 
          opacity={0.6}
        />
      </points>
    </group>
  );
}

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

// ADVANCED CANDLESTICK CHART WITH SCROLL-BASED FRAGMENTATION
function AnimatedCandlestickChart({ scrollProgress }: { scrollProgress: number }) {
  const chartRef = useRef<THREE.Group>(null);
  const candlesRef = useRef<THREE.Mesh[]>([]);
  const fragmentGroupsRef = useRef<THREE.Group[]>([]);
  const dustParticlesRef = useRef<THREE.Points>(null);
  const [isFragmenting, setIsFragmenting] = useState(false);
  const [isDusting, setIsDusting] = useState(false);

  // Generate candlestick data with more candles for better visual impact
  const [candleData, setCandleData] = useState(() => {
    const data = [];
    let price = 67000;

    // Increased to 20 candles for better coverage and visual impact
    for (let i = 0; i < 20; i++) {
      const change = (Math.random() - 0.5) * 800;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 150;
      const low = Math.min(open, close) - Math.random() * 150;

      data.push({
        open,
        high,
        low,
        close,
        isGreen: close > open,
        x: (i - 9.5) * 0.8, // Adjusted spacing for more candles
        fragments: [] as { position: THREE.Vector3; velocity: THREE.Vector3 }[]
      });

      price = close;
    }
    return data;
  });

  // Create fragment positions and velocities for each candle
  useEffect(() => {
    setCandleData(prevData =>
      prevData.map(candle => ({
        ...candle,
        fragments: Array.from({ length: 6 }, () => ({
          position: new THREE.Vector3(
            candle.x + (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 0.4
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            Math.random() * 0.01,
            (Math.random() - 0.5) * 0.01
          )
        }))
      }))
    );
  }, []);

  // Handle scroll-based states
  useEffect(() => {
    if (scrollProgress > 0.1 && scrollProgress < 0.5) {
      setIsFragmenting(true);
      setIsDusting(false);
    } else if (scrollProgress >= 0.5) {
      setIsFragmenting(false);
      setIsDusting(true);
    } else {
      setIsFragmenting(false);
      setIsDusting(false);
    }
  }, [scrollProgress]);

  useFrame((state) => {
    try {
      if (chartRef.current && state.clock) {
        if (!isFragmenting && !isDusting) {
          // Enhanced live animation with more subtle movements
          chartRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.08;
          chartRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;

          // Add slight depth movement for parallax effect
          chartRef.current.position.z = -8 + Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
        } else if (isFragmenting) {
          // Lock chart in place during fragmentation
          chartRef.current.rotation.y = THREE.MathUtils.lerp(chartRef.current.rotation.y, 0, 0.05);
          chartRef.current.position.y = THREE.MathUtils.lerp(chartRef.current.position.y, 0, 0.05);
          chartRef.current.position.z = THREE.MathUtils.lerp(chartRef.current.position.z, -8, 0.05);
        }
      }
    } catch (error) {
      console.error('Chart animation error:', error);
    }

    // Animate candles based on state with improved performance
    candlesRef.current.forEach((candle, index) => {
      try {
        if (candle && state.clock) {
          if (!isFragmenting && !isDusting) {
            // Enhanced live animation with subtle pulsing and shadow movement
            const time = state.clock.elapsedTime;
            const scaleVariation = 1 + Math.sin(time * 0.8 + index * 0.3) * 0.02;
            candle.scale.y = scaleVariation;

            // Add subtle position wiggle
            if (candleData[index]) {
              candle.position.x = candleData[index].x + Math.sin(time * 0.6 + index) * 0.01;
            }

            const material = candle.material as THREE.MeshStandardMaterial;
            if (material) {
              // More subtle emissive intensity variation
              material.emissiveIntensity = 0.2 + Math.sin(time * 1.2 + index * 0.8) * 0.15;
              material.opacity = 0.08; // Lower opacity for better background effect
            }
          } else if (isFragmenting) {
            // Simplified fragmentation animation
            const fragmentProgress = Math.min((scrollProgress - 0.1) / 0.4, 1);
            const staggeredProgress = Math.max(0, fragmentProgress - (index * 0.03));

            // Simple scale and position changes only
            candle.scale.y = THREE.MathUtils.lerp(1, 0.1, staggeredProgress);

            // Store target position to avoid recalculating random values
            if (!candle.userData.targetZ) {
              candle.userData.targetZ = (Math.random() - 0.5) * 2;
            }
            candle.position.z = THREE.MathUtils.lerp(0, candle.userData.targetZ, staggeredProgress);

            const material = candle.material as THREE.MeshStandardMaterial;
            if (material) {
              material.opacity = THREE.MathUtils.lerp(0.08, 0.01, staggeredProgress);
            }
          } else if (isDusting) {
            // Fade out completely
            const material = candle.material as THREE.MeshStandardMaterial;
            if (material) {
              material.opacity = THREE.MathUtils.lerp(material.opacity, 0, 0.08);
            }
          }
        }
      } catch (error) {
        console.error(`Candle animation error at index ${index}:`, error);
      }
    });

    // TEMPORARILY DISABLE fragment groups to isolate rotateZ errors
    console.log('Fragment animation disabled to isolate errors');
    // TODO: Re-enable after confirming main candlestick animation works

    // Enhanced dust particles with cinematic swirling motion
    if (dustParticlesRef.current && isDusting) {
      const dustProgress = Math.min((scrollProgress - 0.5) / 0.5, 1);
      const time = state.clock.elapsedTime;

      // More complex rotation for cinematic effect
      dustParticlesRef.current.rotation.y = time * 0.08;
      dustParticlesRef.current.rotation.x = Math.sin(time * 0.03) * 0.15;
      dustParticlesRef.current.rotation.z = Math.cos(time * 0.04) * 0.1;

      const material = dustParticlesRef.current.material as THREE.PointsMaterial;
      if (material) {
        // Enhanced opacity fade with bloom effect
        material.opacity = THREE.MathUtils.lerp(0.6, 0, dustProgress);
        material.size = THREE.MathUtils.lerp(0.03, 0.001, dustProgress);
      }

      // Enhanced particle positions with more complex motion patterns
      const positions = dustParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const particleIndex = i / 3;
        const phase = particleIndex * 0.1;

        // Create spiral upward motion with randomized direction bias
        positions[i] += Math.sin(time * 0.5 + phase) * 0.002; // X - spiral motion
        positions[i + 1] += 0.003 + Math.cos(time * 0.3 + phase) * 0.001; // Y - upward drift
        positions[i + 2] += Math.sin(time * 0.4 + phase) * 0.0015; // Z - depth variation

        // Reset particles that drift too far
        if (positions[i + 1] > 8) {
          positions[i + 1] = -4;
          positions[i] = (Math.random() - 0.5) * 15;
          positions[i + 2] = (Math.random() - 0.5) * 3;
        }
      }
      dustParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Live data updates
  useEffect(() => {
    if (isFragmenting || isDusting) return;

    const interval = setInterval(() => {
      setCandleData(prevData => {
        const newData = [...prevData];
        const lastIndex = newData.length - 1;
        if (lastIndex >= 0) {
          const change = (Math.random() - 0.5) * 300;
          newData[lastIndex] = {
            ...newData[lastIndex],
            close: newData[lastIndex].open + change,
            high: Math.max(newData[lastIndex].open, newData[lastIndex].open + change) + Math.random() * 80,
            low: Math.min(newData[lastIndex].open, newData[lastIndex].open + change) - Math.random() * 80,
            isGreen: change > 0
          };
        }
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isFragmenting, isDusting]);

  // Enhanced dust particle system with more particles for cinematic effect
  const dustParticleCount = 400;
  const dustPositions = new Float32Array(dustParticleCount * 3);
  for (let i = 0; i < dustParticleCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 18;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }

  return (
    <group ref={chartRef} position={[0, 0, -2]} scale={[1.5, 2.0, 1.0]}>
      {/* Main candlestick chart with enhanced coverage */}
      {candleData.map((candle, index) => {
        const bodyHeight = Math.abs(candle.close - candle.open) / 1000; // Increased scale
        const bodyY = (candle.open + candle.close) / 2400; // Adjusted positioning
        const wickHeight = (candle.high - candle.low) / 1000;
        const wickY = (candle.high + candle.low) / 2400;

        return (
          <group key={`candle-${index}`} position={[candle.x, 0, 0]}>
            {/* Enhanced candle body with better materials */}
            <mesh
              ref={el => { if (el) candlesRef.current[index] = el; }}
              position={[0, bodyY, 0]}
            >
              <boxGeometry args={[0.4, Math.max(bodyHeight, 0.2), 0.4]} />
              <meshStandardMaterial
                color={candle.isGreen ? '#00ff88' : '#ff4477'}
                transparent
                opacity={0.8}
                emissive={candle.isGreen ? '#004433' : '#440022'}
                emissiveIntensity={0.5}
                metalness={0.2}
                roughness={0.6}
              />
            </mesh>

            {/* Enhanced candle wick */}
            <mesh position={[0, wickY, 0]}>
              <boxGeometry args={[0.06, wickHeight, 0.06]} />
              <meshStandardMaterial
                color={candle.isGreen ? '#00ff88' : '#ff4477'}
                transparent
                opacity={0.6}
                emissive={candle.isGreen ? '#003322' : '#330022'}
                emissiveIntensity={0.4}
                metalness={0.1}
                roughness={0.7}
              />
            </mesh>

            {/* Fragment system - DISABLED to isolate rotateZ errors */}
            {false && isFragmenting && (
              <group
                key={`fragments-${index}`}
                ref={el => { if (el) fragmentGroupsRef.current[index] = el; }}
              >
                {/* Fragments disabled for debugging */}
              </group>
            )}
          </group>
        );
      })}

      {/* Enhanced dust particle system with cinematic bloom */}
      {isDusting && (
        <points ref={dustParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={dustPositions}
              count={dustParticleCount}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#ffffff"
            size={0.025}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            sizeAttenuation={true}
            alphaTest={0.001}
          />
        </points>
      )}
    </group>
  );
}

// HUD CROSSHAIR OVERLAY
function HUDOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Crosshair className="w-8 h-8 text-green-400 animate-pulse" />
      </div>
      
      {/* Corner HUD Elements */}
      <div className="absolute top-8 left-8">
        <div className="text-green-400 font-mono text-xs uppercase tracking-wider">
          SYSTEM ONLINE
        </div>
        <div className="text-white font-mono text-sm mt-1">
          MARKET SCAN: ACTIVE
        </div>
      </div>
      
      <div className="absolute top-8 right-8">
        <div className="text-green-400 font-mono text-xs uppercase tracking-wider">
          TARGETS: 247
        </div>
        <div className="text-white font-mono text-sm mt-1">
          ACCURACY: 94.7%
        </div>
      </div>
      
      {/* Bottom HUD */}
      <div className="absolute bottom-8 left-8">
        <div className="text-green-400 font-mono text-xs uppercase tracking-wider">
          BULLZEYE v2.1
        </div>
      </div>
    </div>
  );
}

// Z-AXIS CAMERA SCROLL SYSTEM
function useZAxisScroll() {
  const [scrollData, setScrollData] = useState({
    progress: 0,
    cameraZ: 10,
    section: 0,
    velocity: 0,
    isScrolling: false
  });

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollY = 0;
    let velocity = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);

      // Calculate velocity
      velocity = scrollY - lastScrollY;
      lastScrollY = scrollY;

      // Map scroll to Z-axis camera position (moving forward through scenes)
      const cameraZ = 10 - (progress * 40); // Start at Z=10, move to Z=-30
      const section = Math.floor(progress * 4); // 4 sections

      setScrollData({
        progress,
        cameraZ,
        section,
        velocity,
        isScrolling: true
      });

      // Clear scrolling state after scroll stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollData(prev => ({ ...prev, isScrolling: false, velocity: 0 }));
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return scrollData;
}

// 3D CAMERA CONTROLLER FOR Z-AXIS MOVEMENT
function CameraController({ cameraZ, velocity, isScrolling }: { cameraZ: number, velocity: number, isScrolling: boolean }) {
  const { camera } = useThree();
  const targetRef = useRef({ z: cameraZ });

  useFrame(() => {
    try {
      if (camera && camera.position) {
        // Smooth camera movement along Z-axis
        targetRef.current.z = cameraZ;
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetRef.current.z, 0.1);

        // Add subtle camera shake based on scroll velocity
        if (isScrolling) {
          camera.position.x = Math.sin(Date.now() * 0.01) * Math.abs(velocity) * 0.001;
          camera.position.y = Math.cos(Date.now() * 0.01) * Math.abs(velocity) * 0.001;
        } else {
          camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.1);
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.1);
        }
      }
    } catch (error) {
      console.error('Camera controller error:', error);
    }
  });

  return null;
}

// 3D SCENE SECTIONS POSITIONED ALONG Z-AXIS
function SceneSections({ progress }: { progress: number }) {
  // Use progress for future section-based animations
  console.log('Scene progress:', progress); // Prevent unused parameter warning

  return (
    <group>
      {/* Hero Section at Z=0 */}
      <group position={[0, 0, 0]}>
        <Text
          position={[0, 2, 0]}
          fontSize={2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/mono.woff"
        >
          BULLZEYE
        </Text>

        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#00ff66"
          anchorX="center"
          anchorY="middle"
          font="/fonts/mono.woff"
        >
          PRECISION TRADING INTELLIGENCE
        </Text>
      </group>

      {/* Features Section at Z=-10 */}
      <group position={[0, 0, -10]}>
        <Text
          position={[0, 2, 0]}
          fontSize={1.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/mono.woff"
        >
          PRECISION ARSENAL
        </Text>

        {/* Feature Cards */}
        {[-3, -1, 1, 3].map((x, index) => (
          <mesh key={index} position={[x * 2, 0, 0]}>
            <boxGeometry args={[1.5, 2, 0.1]} />
            <meshStandardMaterial color="#003311" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Testimonials Section at Z=-20 */}
      <group position={[0, 0, -20]}>
        <Text
          position={[0, 2, 0]}
          fontSize={1.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/mono.woff"
        >
          ELITE TRADERS
        </Text>

        {/* Testimonial Cards */}
        {[-2, 0, 2].map((x, index) => (
          <mesh key={index} position={[x * 3, 0, 0]}>
            <boxGeometry args={[2, 3, 0.1]} />
            <meshStandardMaterial color="#111111" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* CTA Section at Z=-30 */}
      <group position={[0, 0, -30]}>
        <Text
          position={[0, 2, 0]}
          fontSize={1.8}
          color="#00ff66"
          anchorX="center"
          anchorY="middle"
          font="/fonts/mono.woff"
        >
          READY TO DOMINATE?
        </Text>

        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[4, 1, 0.2]} />
          <meshStandardMaterial color="#00ff66" />
        </mesh>
      </group>
    </group>
  );
}



// MAIN CINEMATIC TRADING EXPERIENCE
export default function CinematicTradingExperience() {
  const { progress, cameraZ, velocity, isScrolling, section } = useZAxisScroll();
  const [showHUD, setShowHUD] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show HUD immediately for motion reel feel
    const timer = setTimeout(() => setShowHUD(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden min-h-[400vh] text-white"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(0, 255, 102, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0, 204, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(255, 0, 102, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #000000 50%, #0f0f0f 75%, #000000 100%)
        `
      }}
    >
      {/* Canvas Candlestick Background */}
      <CandlestickCanvasBackground />

      {/* HUD Overlay */}
      <HUDOverlay visible={showHUD} />

      {/* 3D Background Scene */}
      <div
        className="fixed inset-0 z-0"
        style={{
          width: '100vw',
          height: '100vh',
          border: '5px solid red',
          background: 'rgba(255, 0, 0, 0.1)'
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{
            width: '100%',
            height: '100%',
            background: '#000000',
            border: '3px solid yellow'
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

        {/* Enhanced Atmospheric Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dynamic Parallax Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(ellipse at ${20 + progress * 10}% ${20 + Math.sin(progress * 5) * 10}%, rgba(0, 255, 102, ${0.1 + Math.abs(velocity) * 0.002}) 0%, transparent 60%),
                radial-gradient(ellipse at ${80 - progress * 10}% ${80 - Math.sin(progress * 3) * 10}%, rgba(0, 204, 255, ${0.08 + Math.abs(velocity) * 0.001}) 0%, transparent 60%),
                radial-gradient(ellipse at ${50 + Math.sin(progress * 8) * 5}% ${50 + Math.cos(progress * 6) * 5}%, rgba(255, 255, 255, ${0.02 + Math.abs(velocity) * 0.001}) 0%, transparent 70%)
              `,
              transform: `translateY(${progress * -20}px) scale(${1 + Math.abs(velocity) * 0.001})`
            }}
          />

          {/* Secondary Atmospheric Layer */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                linear-gradient(45deg, transparent 0%, rgba(0, 255, 102, 0.05) 25%, transparent 50%, rgba(0, 204, 255, 0.03) 75%, transparent 100%),
                linear-gradient(-45deg, transparent 0%, rgba(255, 0, 102, 0.04) 25%, transparent 50%, rgba(255, 255, 0, 0.02) 75%, transparent 100%)
              `
            }}
          />

          {/* Simplified Single Grain Layer */}
          <div
            className="absolute inset-0 opacity-8 mix-blend-soft-light"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.6'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px'
            }}
          />

          {/* Vignette Effect */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.4) 100%)`
            }}
          />
        </div>
      </div>

      {/* Z-Axis 3D Scroll Experience */}
      <div className="fixed inset-0 z-10">
        {/* Cinematic Frame Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `
              linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.6) 100%),
              linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.4) 100%)
            `,
            opacity: 0.8
          }}
        />

        {/* Subtle Film Grain */}
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-3"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 4px,
              rgba(255,255,255,0.01) 4px,
              rgba(255,255,255,0.01) 5px
            )`
          }}
        />

        <div
          className="w-full h-full"
          style={{
            opacity: isScrolling ? 0.98 : 1,
            transition: 'opacity 0.1s ease-out'
          }}
        >
        </div>
      </div>

      {/* Scroll Content for Z-axis movement */}
      <div className="relative z-30 pointer-events-none">
        {/* Section markers for scroll progress */}
        <div className="h-screen"></div> {/* Hero section scroll area */}
        <div className="h-screen"></div> {/* Features section scroll area */}
        <div className="h-screen"></div> {/* Testimonials section scroll area */}
        <div className="h-screen"></div> {/* CTA section scroll area */}
      </div>

      {/* HUD Overlay */}
      <div className="fixed top-8 left-8 z-40 pointer-events-none">
        <div className="text-green-400 font-mono text-sm">
          SECTION: {section + 1}/4
        </div>
        <div className="text-white font-mono text-xs mt-2">
          PROGRESS: {Math.round(progress * 100)}%
        </div>
        <div className="text-gray-400 font-mono text-xs">
          Z-DEPTH: {Math.round(cameraZ * 10) / 10}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 pointer-events-none">
        <div className="w-1 h-32 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="w-full bg-green-400 rounded-full transition-all duration-300"
            style={{ height: `${progress * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-30 bg-black/90 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="text-2xl font-bold tracking-wide">
                  <span className="text-white">BULLZ</span>
                  <span className="text-emerald-400">EYE</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                Advanced AI-powered trading intelligence platform designed for professional traders and institutions.
                Precision targeting, neural analysis, and real-time execution.
              </p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-400">94.7%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-400">$2.4M</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Avg Profit</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-400">0.03s</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Execution</div>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Pricing</a></li>
                <li><a href="#api" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">API Access</a></li>
                <li><a href="#documentation" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Documentation</a></li>
                <li><a href="#support" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Support</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#about" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">About</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Careers</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Contact</a></li>
                <li><a href="#press" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Press</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} BullzEye Technologies, Inc. All rights reserved.
              </div>

              {/* Legal Links */}
              <div className="flex space-x-6">
                <a href="#privacy" className="text-gray-500 hover:text-emerald-400 transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-gray-500 hover:text-emerald-400 transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="#cookies" className="text-gray-500 hover:text-emerald-400 transition-colors text-sm">
                  Cookie Policy
                </a>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#twitter" className="text-gray-500 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#linkedin" className="text-gray-500 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#github" className="text-gray-500 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .spray-paint-text {
          transition: filter 0.2s ease-out, transform 0.1s ease-out;
          position: relative;
          color: #ffffff;
          text-shadow:
            /* Simple depth shadow */
            0 0 8px rgba(255, 255, 255, 0.3),
            /* Subtle dispersed effect */
            -1px -1px 0px rgba(255, 255, 255, 0.2),
            1px -1px 0px rgba(255, 255, 255, 0.2),
            -1px 1px 0px rgba(255, 255, 255, 0.2),
            1px 1px 0px rgba(255, 255, 255, 0.2);
        }

        .spray-paint-text.scrolling {
          animation: scrollGlow 0.5s ease-out;
        }

        .spray-paint-accent {
          color: #00ff66;
          text-shadow:
            /* Simple green glow */
            0 0 8px rgba(0, 255, 102, 0.4),
            /* Subtle dispersed effect */
            -1px -1px 0px rgba(0, 255, 102, 0.2),
            1px -1px 0px rgba(0, 255, 102, 0.2),
            -1px 1px 0px rgba(0, 255, 102, 0.2),
            1px 1px 0px rgba(0, 255, 102, 0.2);
        }
      `}</style>
    </div>
  );
}
