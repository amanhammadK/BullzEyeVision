import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
  x: number;
  isGreen: boolean;
}

// Generate synthetic candlestick data with consistent seed for reproducible animation
const generateCandles = (count: number, startX: number = 0, seed: number = 12345): CandlestickData[] => {
  const candles: CandlestickData[] = [];
  let price = 67500; // Starting price for BTC-like data

  // Simple seeded random function for consistent results
  let seedValue = seed;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  for (let i = 0; i < count; i++) {
    const change = (seededRandom() - 0.5) * 600; // Realistic price changes
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + seededRandom() * 150;
    const low = Math.min(open, close) - seededRandom() * 150;

    candles.push({
      open,
      high,
      low,
      close,
      x: startX + i * 15, // Spacing between candles
      isGreen: close > open
    });

    price = close;
  }

  return candles;
};

// 3D Candlestick Chart Component
export default function CandlestickChart3D({ scrollProgress }: { scrollProgress: number }) {
  const chartRef = useRef<THREE.Group>(null);
  const candlesRef = useRef<THREE.Mesh[]>([]);
  const dustParticlesRef = useRef<THREE.Points>(null);
  const [candleData, setCandleData] = useState(() => generateCandles(25, -200, 12345));



  // Handle scroll-based fragmentation states
  const isFragmenting = scrollProgress > 0.1 && scrollProgress < 0.6;
  const isDusting = scrollProgress >= 0.6;

  useFrame((state) => {
    if (!state.clock) return;

    const time = state.clock.elapsedTime;

    // Animate chart group
    if (chartRef.current) {
      if (!isFragmenting && !isDusting) {
        // Idle state: subtle floating animation
        chartRef.current.rotation.y = Math.sin(time * 0.05) * 0.08;
        chartRef.current.position.y = Math.sin(time * 0.15) * 0.1;
        chartRef.current.position.z = -8 + Math.sin(time * 0.1) * 0.3;
      } else if (isFragmenting) {
        // Lock in place during fragmentation
        chartRef.current.rotation.y = THREE.MathUtils.lerp(chartRef.current.rotation.y, 0, 0.05);
        chartRef.current.position.y = THREE.MathUtils.lerp(chartRef.current.position.y, 0, 0.05);
        chartRef.current.position.z = THREE.MathUtils.lerp(chartRef.current.position.z, -8, 0.05);
      }
    }

    // Animate individual candles
    candlesRef.current.forEach((candle, index) => {
      if (!candle) return;

      if (!isFragmenting && !isDusting) {
        // Live animation: subtle pulsing and movement
        const scaleVariation = 1 + Math.sin(time * 0.8 + index * 0.3) * 0.02;
        candle.scale.y = scaleVariation;

        // Subtle position wiggle
        if (candleData[index]) {
          candle.position.x = candleData[index].x + Math.sin(time * 0.6 + index) * 0.01;
        }

        const material = candle.material as THREE.MeshStandardMaterial;
        if (material) {
          material.emissiveIntensity = 0.2 + Math.sin(time * 1.2 + index * 0.8) * 0.15;
          material.opacity = 0.6; // Visible opacity for background effect
        }
      } else if (isFragmenting) {
        // Fragmentation animation
        const fragmentProgress = Math.min((scrollProgress - 0.1) / 0.5, 1);
        const staggeredProgress = Math.max(0, fragmentProgress - (index * 0.03));

        // Scale down and scatter
        candle.scale.y = THREE.MathUtils.lerp(1, 0.1, staggeredProgress);

        // Store target position to avoid recalculating
        if (!candle.userData.targetZ) {
          candle.userData.targetZ = (Math.random() - 0.5) * 2;
        }
        candle.position.z = THREE.MathUtils.lerp(0, candle.userData.targetZ, staggeredProgress);

        const material = candle.material as THREE.MeshStandardMaterial;
        if (material) {
          material.opacity = THREE.MathUtils.lerp(0.6, 0.1, staggeredProgress);
        }
      } else if (isDusting) {
        // Fade out completely
        const material = candle.material as THREE.MeshStandardMaterial;
        if (material) {
          material.opacity = THREE.MathUtils.lerp(material.opacity, 0, 0.08);
        }
      }
    });

    // Dust particles animation
    if (dustParticlesRef.current && isDusting) {
      const dustProgress = Math.min((scrollProgress - 0.6) / 0.4, 1);

      dustParticlesRef.current.rotation.y = time * 0.08;
      dustParticlesRef.current.rotation.x = Math.sin(time * 0.03) * 0.15;

      const material = dustParticlesRef.current.material as THREE.PointsMaterial;
      if (material) {
        material.opacity = THREE.MathUtils.lerp(0.6, 0, dustProgress);
        material.size = THREE.MathUtils.lerp(0.03, 0.001, dustProgress);
      }

      // Animate particle positions
      const positions = dustParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const particleIndex = i / 3;
        const phase = particleIndex * 0.1;

        positions[i] += Math.sin(time * 0.5 + phase) * 0.002; // X
        positions[i + 1] += 0.003 + Math.cos(time * 0.3 + phase) * 0.001; // Y - upward drift
        positions[i + 2] += Math.sin(time * 0.4 + phase) * 0.0015; // Z

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

  // Live data updates (only when not fragmenting)
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

  // Dust particle system
  const dustParticleCount = 400;
  const dustPositions = new Float32Array(dustParticleCount * 3);
  for (let i = 0; i < dustParticleCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 18;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }

  return (
    <group ref={chartRef} position={[0, 0, -2]} scale={[1.5, 2.0, 1.0]}>


      {/* Main candlestick chart */}
      {candleData.map((candle, index) => {
        const bodyHeight = Math.abs(candle.close - candle.open) / 1000;
        const bodyY = (candle.open + candle.close) / 2400;
        const wickHeight = (candle.high - candle.low) / 1000;
        const wickY = (candle.high + candle.low) / 2400;

        return (
          <group key={`candle-${index}`} position={[candle.x, 0, 0]}>
            {/* Candle body */}
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

            {/* Candle wick */}
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
          </group>
        );
      })}

      {/* Dust particle system */}
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
