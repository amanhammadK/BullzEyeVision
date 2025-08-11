import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Zap, Shield, Target, Brain, Activity, Crosshair, Play } from "lucide-react";
import * as THREE from 'three';
import ProblemSolutionInteractive from './problem-solution-interactive';
import TraderJourney from './trader-journey';

import CandlestickBackground from './candlestick-background';
import HeroCandlestickChart from './hero-candlestick-chart';
import CandlestickChart3D from './candlestick-chart-3d';
import CinematicCandlesBackground from '@/components/cinematic-candles-background';
// GSAP removed - not used in this component
// All animations are handled by Three.js useFrame hooks

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
      const section = Math.floor(progress * 5); // 5 sections

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

// MOUSE POSITION TRACKER
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
}

// 3D CAMERA CONTROLLER WITH MOUSE OFFSET
function CameraController({ cameraZ, velocity, isScrolling }: { cameraZ: number, velocity: number, isScrolling: boolean }) {
  const { camera } = useThree();
  const targetRef = useRef({ z: cameraZ, rotationX: 0, rotationY: 0 });
  const mousePosition = useMousePosition();

  useFrame(() => {
    // Faster camera movement along Z-axis
    targetRef.current.z = cameraZ;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetRef.current.z, 0.15);

    // Mouse-based camera rotation with faster response
    const mouseInfluence = 0.1; // Adjust sensitivity
    targetRef.current.rotationY = mousePosition.x * mouseInfluence;
    targetRef.current.rotationX = mousePosition.y * mouseInfluence * 0.5; // Less vertical movement

    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRef.current.rotationY, 0.08);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRef.current.rotationX, 0.08);

    // Add subtle camera shake based on scroll velocity
    if (isScrolling) {
      const shakeIntensity = Math.abs(velocity) * 0.001;
      camera.position.x = Math.sin(Date.now() * 0.01) * shakeIntensity;
      camera.position.y = Math.cos(Date.now() * 0.01) * shakeIntensity;
    } else {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.15);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.15);
    }
  });

  return null;
}

// SUBTLE 3D BACKGROUND ELEMENTS (NO TEXT OVERLAP)
function BackgroundElements({ progress, isScrolling }: { progress: number, isScrolling: boolean }) {
  const mousePosition = useMousePosition();

  // Fade out 3D elements when scrolling to avoid overlap
  const opacity = isScrolling ? 0.1 : 0.3;

  return (
    <group>
      {/* Floating Background Particles */}
      {[...Array(8)].map((_, index) => (
        <mesh
          key={index}
          position={[
            Math.sin(index * 0.8) * 6 + mousePosition.x * 0.1,
            Math.cos(index * 0.6) * 4 + mousePosition.y * 0.05,
            -5 - (index * 2)
          ]}
          rotation={[
            Math.sin(Date.now() * 0.0005 + index) * 0.1,
            Math.cos(Date.now() * 0.0003 + index) * 0.1,
            0
          ]}
        >
          <boxGeometry args={[0.2, 0.2, 0.02]} />
          <meshStandardMaterial
            color="#00ff66"
            transparent
            opacity={opacity}
            emissive="#003311"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Subtle Grid Lines */}
      {[-4, -2, 0, 2, 4].map((y, index) => (
        <mesh key={index} position={[0, y, -15]}>
          <boxGeometry args={[12, 0.01, 0.01]} />
          <meshStandardMaterial
            color="#333333"
            transparent
            opacity={opacity * 0.5}
          />
        </mesh>
      ))}

      {/* Vertical Grid Lines */}
      {[-6, -3, 0, 3, 6].map((x, index) => (
        <mesh key={index} position={[x, 0, -15]}>
          <boxGeometry args={[0.01, 8, 0.01]} />
          <meshStandardMaterial
            color="#333333"
            transparent
            opacity={opacity * 0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// MAIN Z-AXIS TRADING EXPERIENCE
export default function ZAxisTradingExperience() {
  const { progress, cameraZ, velocity, isScrolling, section } = useZAxisScroll();
  const containerRef = useRef<HTMLDivElement>(null);



  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden min-h-[400vh] text-white"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(5, 150, 105, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(5, 150, 105, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, #000000 0%, #0a0a1a 25%, #000814 50%, #001122 75%, #000000 100%)
        `
      }}
    >
      {/* Enhanced Atmospheric Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary Gradient Overlay */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(ellipse at ${20 + progress * 10}% ${20 + Math.sin(progress * 5) * 10}%, rgba(5, 150, 105, ${0.08 + Math.abs(velocity) * 0.002}) 0%, transparent 60%),
              radial-gradient(ellipse at ${80 - progress * 10}% ${80 - Math.sin(progress * 3) * 10}%, rgba(220, 38, 38, ${0.06 + Math.abs(velocity) * 0.001}) 0%, transparent 60%),
              radial-gradient(ellipse at ${50 + Math.sin(progress * 8) * 5}% ${50 + Math.cos(progress * 6) * 5}% rgba(255, 255, 255, ${0.02 + Math.abs(velocity) * 0.001}) 0%, transparent 70%)
            `,
            transform: `translateY(${progress * -20}px) scale(${1 + Math.abs(velocity) * 0.001})`
          }}
        />

        {/* Secondary Atmospheric Layer */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              linear-gradient(45deg, transparent 0%, rgba(5, 150, 105, 0.04) 25%, transparent 50%, rgba(220, 38, 38, 0.03) 75%, transparent 100%),
              linear-gradient(-45deg, transparent 0%, rgba(220, 38, 38, 0.03) 25%, transparent 50%, rgba(5, 150, 105, 0.02) 75%, transparent 100%)
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

      {/* Cinematic Canvas Candlestick Background - BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CinematicCandlesBackground />
      </div>

      {/* HTML Section Cards Overlay */}
      <div className="relative z-30">
        {/* Hero Section */}
        <div
          className="h-screen flex items-center justify-center relative"
          style={{
            opacity: section === 0 ? 1 : 0,
            transform: `translateY(${section === 0 ? 0 : 30}px) scale(${section === 0 ? 1 : 0.97})`,
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: section === 0 ? 'auto' : 'none'
          }}
        >
          {/* Hero Candlestick Chart Animation - Now integrated into main Canvas above */}

          <div className="text-center max-w-6xl mx-auto px-8 relative z-10">
            <h1
              className="blur-text-effect text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tight leading-none mb-8"
              data-text="BULLZEYE"
              style={{
                textShadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)',
                position: 'relative',
                zIndex: 10
              }}
            >
              BULLZEYE
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 font-mono uppercase tracking-[0.3em] font-light relative z-10 mb-8">
              PRECISION TRADING INTELLIGENCE
            </p>
            <div className="flex items-center justify-center gap-6">
              <Button className="bg-[#398848] hover:bg-[#2e6b38] text-white px-10 py-4 text-lg font-mono font-black uppercase tracking-wider rounded-none">
                <Crosshair className="w-5 h-5 mr-3" />
                Launch App
              </Button>

            </div>
          </div>
        </div>

        {/* Core Technology Section */}
        <div
          className="h-screen flex items-center justify-center"
          style={{
            opacity: section === 1 ? 1 : 0,
            transform: `translateY(${section === 1 ? 0 : 30}px) scale(${section === 1 ? 1 : 0.97})`,
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: section === 1 ? 'auto' : 'none'
          }}
        >
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="text-green-400 font-mono text-sm uppercase tracking-[0.3em] mb-4 opacity-60">
                [ 02 ]
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-mono tracking-tight mb-6">
                THE EDGE YOU NEED
              </h2>
              <p className="text-gray-400 font-mono text-base md:text-lg uppercase tracking-[0.2em] font-light max-w-4xl mx-auto">
                ADVANCED AI TECHNOLOGY THAT GIVES YOU THE ADVANTAGE
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "PREDICTIVE SIGNALS",
                  desc: "Get alerts before the crowd notices. Our AI spots opportunities 15-30 minutes early.",
                  metric: "70% WIN RATE"
                },
                {
                  icon: Brain,
                  title: "SMART ANALYSIS",
                  desc: "No more staring at charts for hours. AI processes millions of data points instantly.",
                  metric: "1M+ DATA POINTS"
                },
                {
                  icon: Zap,
                  title: "LIGHTNING FAST",
                  desc: "While others are still analyzing, you're already in the trade. Speed is everything.",
                  metric: "0.03s RESPONSE"
                },
                {
                  icon: Shield,
                  title: "RISK PROTECTION",
                  desc: "Built-in safety nets protect your capital. Never lose more than you can afford.",
                  metric: "2.3:1 R/R RATIO"
                },
                {
                  icon: Activity,
                  title: "24/7 MONITORING",
                  desc: "Markets never sleep, neither do we. Catch opportunities even while you rest.",
                  metric: "ALWAYS ACTIVE"
                },
                {
                  icon: BarChart3,
                  title: "PROVEN RESULTS",
                  desc: "Track record speaks for itself. Consistent profits, measurable performance.",
                  metric: "8.5% AVG RETURN"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-black/60 border border-white/20 p-6 backdrop-blur-sm hover:border-green-400/30 transition-all duration-300 group">
                  <feature.icon className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-green-400 font-mono text-xs uppercase tracking-wider mb-2 opacity-80">
                    {feature.metric}
                  </div>
                  <h3 className="text-white font-mono font-bold text-lg mb-3 uppercase tracking-wider">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Problem-Solution Interactive Section */}
        <div
          className="h-screen flex items-center justify-center"
          style={{
            opacity: section === 2 ? 1 : 0,
            transform: `translateY(${section === 2 ? 0 : 30}px) scale(${section === 2 ? 1 : 0.97})`,
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: section === 2 ? 'auto' : 'none'
          }}
        >
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="text-green-400 font-mono text-sm uppercase tracking-[0.3em] mb-4 opacity-60">
                [ 03 ]
              </div>
            </div>
            <ProblemSolutionInteractive />
          </div>
        </div>

        {/* Trader Journey Section */}
        <div
          className="h-screen flex items-center justify-center"
          style={{
            opacity: section === 3 ? 1 : 0,
            transform: `translateY(${section === 3 ? 0 : 30}px) scale(${section === 3 ? 1 : 0.97})`,
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: section === 3 ? 'auto' : 'none'
          }}
        >
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="text-green-400 font-mono text-sm uppercase tracking-[0.3em] mb-4 opacity-60">
                [ 04 ]
              </div>
            </div>
            <TraderJourney />
          </div>
        </div>


        {/* CTA Section */}
        <div
          className="h-screen flex items-center justify-center"
          style={{
            opacity: section === 4 ? 1 : 0,
            transform: `translateY(${section === 4 ? 0 : 30}px) scale(${section === 4 ? 1 : 0.97})`,
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: section === 4 ? 'auto' : 'none'
          }}
        >
          <div className="text-center max-w-4xl mx-auto px-8">
            <div className="text-green-400 font-mono text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
              [ 05 ]
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white font-mono tracking-tight leading-none mb-8">
              READY TO<br/>
              <span className="text-green-400">DOMINATE?</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 font-mono mb-12 uppercase tracking-[0.2em] font-light">
              JOIN THE ELITE TRADERS USING BULLZEYE
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button className="bg-[#398848] hover:bg-[#2e6b38] text-white px-12 py-6 text-xl font-mono font-black uppercase tracking-wider rounded-none">
                <Crosshair className="w-6 h-6 mr-4" />
                ACTIVATE BULLZEYE
              </Button>


            </div>
          </div>
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
        /* Simplified Spray Paint Typography Effect */
        .spray-paint-text {
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

        /* Performance-optimized styles */
        .horizontal-scroll-container {
          will-change: transform, filter, opacity;
          backface-visibility: hidden;
          transition: filter 0.1s ease-out, opacity 0.1s ease-out;
        }

        .scroll-section {
          position: relative;
          will-change: transform, opacity, filter;
          transition: transform 0.2s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
