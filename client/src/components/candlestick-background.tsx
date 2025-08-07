'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, Points, PointsMaterial } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Safe GSAP initialization with error handling
try {
  gsap.registerPlugin(ScrollTrigger);
  console.log('CandlestickBackground: GSAP and ScrollTrigger initialized successfully');
} catch (gsapError) {
  console.error('CandlestickBackground: GSAP initialization error:', gsapError);
}

interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  x: number;
}

// Generate fake candlestick data
const generateCandlestickData = (count: number): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let price = 100;
  
  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.5) * 10;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const volume = Math.random() * 100;
    
    data.push({
      open,
      high,
      low,
      close,
      volume,
      x: i * 2 - count
    });
    
    price = close;
  }
  
  return data;
};

const CandlestickChart: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const candlestickRef = useRef<InstancedMesh>(null);
  const wickRef = useRef<InstancedMesh>(null);
  const particlesRef = useRef<Points>(null);
  const [candlestickData] = useState(() => generateCandlestickData(50));
  const [animationTime, setAnimationTime] = useState(0);

  // Create instanced geometries
  const { candlestickGeometry, wickGeometry, particleGeometry, particleMaterial } = useMemo(() => {
    const candlestickGeometry = new THREE.BoxGeometry(1.2, 1, 0.2);
    const wickGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    
    // Particle system
    const particleCount = candlestickData.length * 20; // 20 particles per candlestick
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const candleIndex = Math.floor(i / 20);
      const candle = candlestickData[candleIndex];
      
      // Position particles around the candlestick
      positions[i * 3] = candle.x + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      // Color based on bullish/bearish - using brand colors
      const color = candle.close > candle.open ?
        new THREE.Color(0x00ff66) : new THREE.Color(0xff3366);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float time;
        uniform float opacity;
        
        void main() {
          vColor = color;
          vOpacity = opacity;
          
          vec3 pos = position;
          pos.y += sin(time * 2.0 + position.x * 0.1) * 0.5;
          pos.x += cos(time * 1.5 + position.y * 0.1) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - dist * 2.0) * vOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    return { candlestickGeometry, wickGeometry, particleGeometry, particleMaterial };
  }, [candlestickData]);

  // Animation loop with comprehensive error handling
  useFrame((state) => {
    try {
      if (!state?.clock) {
        console.warn('CandlestickBackground: Clock not available');
        return;
      }

      const time = state.clock.getElapsedTime();
      setAnimationTime(time);

      if (!candlestickRef.current || !wickRef.current) {
        console.warn('CandlestickBackground: Refs not ready');
        return;
      }

      const matrix = new THREE.Matrix4();
      const color = new THREE.Color();

      // Update candlesticks with error handling
      candlestickData.forEach((candle, i) => {
        try {
          const bodyHeight = Math.abs(candle.close - candle.open) * 0.5;
          const bodyY = (candle.open + candle.close) / 2 * 0.15;
          const wickHeight = (candle.high - candle.low) * 0.5;
          const wickY = (candle.high + candle.low) / 2 * 0.15;

          // Live animation - subtle price fluctuations
          const liveOffset = Math.sin(time * 1.5 + i * 0.2) * 0.03;
          const livePulse = Math.sin(time * 3 + i * 0.5) * 0.02;
          const finalBodyY = bodyY + liveOffset;
          const finalWickY = wickY + liveOffset;

          // Enhanced fragmentation effect
          const fragmentProgress = Math.pow(scrollProgress, 1.5);
          const fragmentOffset = fragmentProgress * 8;
          const fragmentRotation = fragmentProgress * Math.PI * 0.8;
          const fragmentScale = Math.max(0.1, 1 - fragmentProgress * 0.9);
          const verticalSpread = fragmentProgress * 3;

          // Staggered fragmentation timing
          const staggerDelay = (i / candlestickData.length) * 0.3;
          const adjustedProgress = Math.max(0, scrollProgress - staggerDelay);
          const easeProgress = adjustedProgress * adjustedProgress * (3 - 2 * adjustedProgress); // smoothstep

          // Candlestick body with enhanced movement
          const bodyOffsetX = Math.sin(fragmentRotation + i * 0.5) * fragmentOffset * easeProgress;
          const bodyOffsetY = Math.cos(fragmentRotation + i * 0.3) * verticalSpread * easeProgress;
          const bodyOffsetZ = Math.sin(fragmentRotation + i * 0.7) * fragmentOffset * 0.3 * easeProgress;

          // Safe matrix operations
          if (matrix && typeof matrix.makeTranslation === 'function') {
            matrix.makeTranslation(
              candle.x + bodyOffsetX,
              finalBodyY + bodyOffsetY + livePulse,
              bodyOffsetZ
            );

            if (typeof matrix.scale === 'function') {
              matrix.scale(new THREE.Vector3(
                fragmentScale + livePulse * 0.1,
                Math.max(0.1, bodyHeight * fragmentScale),
                fragmentScale
              ));
            }

            // Safe rotation with method existence check
            if (typeof matrix.rotateZ === 'function') {
              matrix.rotateZ(fragmentRotation * (i % 2 === 0 ? 1 : -1) * easeProgress);
            }
            if (typeof matrix.rotateX === 'function') {
              matrix.rotateX(fragmentRotation * 0.3 * easeProgress);
            }

            if (candlestickRef.current && typeof candlestickRef.current.setMatrixAt === 'function') {
              candlestickRef.current.setMatrixAt(i, matrix);
            }
          }

          // Enhanced color with opacity variation - using brand colors
          const baseColor = candle.close > candle.open ? 0x00ff66 : 0xff3366;
          if (color && typeof color.setHex === 'function') {
            color.setHex(baseColor);
            // Add more pronounced color variation for live effect
            const colorVariation = Math.sin(time * 2 + i) * 0.3;
            const brightnessBoost = 1.5 + colorVariation;
            if (typeof color.multiplyScalar === 'function') {
              color.multiplyScalar(brightnessBoost);
            }

            if (candlestickRef.current && typeof candlestickRef.current.setColorAt === 'function') {
              candlestickRef.current.setColorAt(i, color);
            }
          }

          // Wick with similar enhanced movement
          const wickOffsetX = Math.sin(fragmentRotation + i * 0.6 + 1) * fragmentOffset * easeProgress;
          const wickOffsetY = Math.cos(fragmentRotation + i * 0.4 + 1) * verticalSpread * easeProgress;
          const wickOffsetZ = Math.sin(fragmentRotation + i * 0.8 + 1) * fragmentOffset * 0.2 * easeProgress;

          if (matrix && typeof matrix.makeTranslation === 'function') {
            matrix.makeTranslation(
              candle.x + wickOffsetX,
              finalWickY + wickOffsetY,
              wickOffsetZ
            );

            if (typeof matrix.scale === 'function') {
              matrix.scale(new THREE.Vector3(
                fragmentScale * 0.5,
                Math.max(0.1, wickHeight * fragmentScale),
                fragmentScale * 0.5
              ));
            }

            if (typeof matrix.rotateZ === 'function') {
              matrix.rotateZ(fragmentRotation * (i % 2 === 0 ? -1 : 1) * easeProgress * 0.5);
            }

            if (wickRef.current && typeof wickRef.current.setMatrixAt === 'function') {
              wickRef.current.setMatrixAt(i, matrix);
            }

            if (wickRef.current && typeof wickRef.current.setColorAt === 'function') {
              wickRef.current.setColorAt(i, color);
            }
          }
        } catch (candleError) {
          console.error(`CandlestickBackground: Error processing candle ${i}:`, candleError);
        }
      });

      // Safe matrix updates
      try {
        if (candlestickRef.current?.instanceMatrix) {
          candlestickRef.current.instanceMatrix.needsUpdate = true;
        }
        if (candlestickRef.current?.instanceColor) {
          candlestickRef.current.instanceColor.needsUpdate = true;
        }
        if (wickRef.current?.instanceMatrix) {
          wickRef.current.instanceMatrix.needsUpdate = true;
        }
        if (wickRef.current?.instanceColor) {
          wickRef.current.instanceColor.needsUpdate = true;
        }
      } catch (updateError) {
        console.error('CandlestickBackground: Matrix update error:', updateError);
      }
    } catch (frameError) {
      console.error('CandlestickBackground: Frame animation error:', frameError);
    }
    
    // Enhanced particle system
    if (particlesRef.current && particleMaterial) {
      particleMaterial.uniforms.time.value = time;

      // Particle opacity with smooth transitions
      const particleThreshold = 0.4;
      const particleOpacity = scrollProgress > particleThreshold ?
        Math.min(0.8, (scrollProgress - particleThreshold) * 4) : 0;
      particleMaterial.uniforms.opacity.value = particleOpacity;

      // Enhanced dust effect with multiple movement patterns
      if (scrollProgress > particleThreshold) {
        const positions = particleGeometry.attributes.position.array as Float32Array;
        const originalPositions = particleGeometry.userData.originalPositions;

        if (!originalPositions) {
          particleGeometry.userData.originalPositions = positions.slice();
        } else {
          const dustProgress = Math.min(1, (scrollProgress - particleThreshold) * 2.5);
          const turbulence = dustProgress * 0.5;

          for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            const candleIndex = Math.floor(particleIndex / 20);

            // Multiple movement patterns for realistic dust
            const swirl = Math.sin(time * 0.5 + particleIndex * 0.1) * turbulence;
            const drift = Math.cos(time * 0.3 + particleIndex * 0.05) * turbulence;
            const rise = dustProgress * (5 + Math.sin(particleIndex) * 3);
            const spread = dustProgress * (3 + Math.cos(particleIndex) * 2);

            // Wind effect
            const windX = Math.sin(time * 0.2 + candleIndex * 0.1) * dustProgress * 2;
            const windZ = Math.cos(time * 0.15 + candleIndex * 0.1) * dustProgress * 1.5;

            positions[i] = originalPositions[i] + swirl * 3 + spread + windX;
            positions[i + 1] = originalPositions[i + 1] + rise + drift;
            positions[i + 2] = originalPositions[i + 2] + swirl * 2 + windZ;
          }
          particleGeometry.attributes.position.needsUpdate = true;
        }
      }
    }
  });

  return (
    <>
      {/* Candlestick bodies */}
      <instancedMesh
        ref={candlestickRef}
        args={[candlestickGeometry, undefined, candlestickData.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          transparent
          opacity={Math.max(0.12, 0.18 - scrollProgress * 0.08)}
          emissive="#003322"
          emissiveIntensity={0.5}
          metalness={0.2}
          roughness={0.6}
        />
      </instancedMesh>

      {/* Candlestick wicks */}
      <instancedMesh
        ref={wickRef}
        args={[wickGeometry, undefined, candlestickData.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          transparent
          opacity={Math.max(0.08, 0.12 - scrollProgress * 0.05)}
          emissive="#002211"
          emissiveIntensity={0.4}
          metalness={0.15}
          roughness={0.7}
        />
      </instancedMesh>
      
      {/* Particle system */}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
    </>
  );
};

const CandlestickBackground: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDOMReady, setIsDOMReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // Ensure DOM is ready before starting animations
  useEffect(() => {
    const checkDOMReady = () => {
      if (document.readyState === 'complete') {
        setIsDOMReady(true);
        console.log('CandlestickBackground: DOM ready, animations can start');
      } else {
        const handleDOMReady = () => {
          setIsDOMReady(true);
          console.log('CandlestickBackground: DOM loaded, animations can start');
        };

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', handleDOMReady);
          return () => document.removeEventListener('DOMContentLoaded', handleDOMReady);
        } else {
          // Document is already interactive or complete
          setTimeout(handleDOMReady, 0);
        }
      }
    };

    checkDOMReady();
  }, []);



  useEffect(() => {
    const updateScrollProgress = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;

        // More precise scroll calculation
        const scrolled = Math.max(0, -rect.top);
        const maxScroll = elementHeight - windowHeight;
        const progress = Math.max(0, Math.min(1, scrolled / Math.max(1, maxScroll)));

        setScrollProgress(progress);
      }
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateScrollProgress);
    };

    // Throttled resize handler
    const handleResize = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ height: '150vh' }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        dpr={Math.min(2, window.devicePixelRatio)}
        performance={{ min: 0.5 }}
      >
        {/* Enhanced lighting for better visibility */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#00ff66" />
        <pointLight position={[-10, -10, 10]} intensity={0.4} color="#0066ff" />
        <directionalLight position={[0, 0, 20]} intensity={0.3} color="#ffffff" />

        <CandlestickChart scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};

export default CandlestickBackground;
