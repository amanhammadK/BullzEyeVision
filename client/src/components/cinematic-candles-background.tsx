import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP only in the browser
if (typeof window !== 'undefined' && (gsap as any).plugins?.ScrollTrigger !== ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  x: number;
  isGreen: boolean;
}

// Deterministic PRNG so visuals are stable across reloads
function createSeededRandom(seed = 12345) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function CinematicCandlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const candlesRef = useRef<Candle[]>([]);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef(0);
  const disintegrateRef = useRef(0); // 0..1 scroll progress

  // Generate synthetic candles spanning full width
  const generateCandles = (count: number, startX: number, seed: number, spacing: number): Candle[] => {
    const rand = createSeededRandom(seed);
    const candles: Candle[] = [];
    let price = 67500;

    for (let i = 0; i < count; i++) {
      const change = (rand() - 0.5) * 600;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + rand() * 150;
      const low = Math.min(open, close) - rand() * 150;
      candles.push({ open, high, low, close, x: startX + i * spacing, isGreen: close > open });
      price = close;
    }
    return candles;
  };

  // Core draw: candles + optional disintegration fragments
  const drawFrame = (ctx: CanvasRenderingContext2D, candles: Candle[], offset: number, disintegrate: number) => {
    const { width, height } = ctx.canvas;
    const centerY = height * 0.5;
    // Boost vertical scale for much taller, screen-filling candles
    const priceScale = Math.max(0.12, Math.min(0.2, height / 5000));

    ctx.clearRect(0, 0, width, height);

    candles.forEach((candle, idx) => {
      const x = candle.x + offset;
      if (x < -40 || x > width + 40) return;

      const openY = centerY - (candle.open - 67500) * priceScale;
      const closeY = centerY - (candle.close - 67500) * priceScale;
      const highY = centerY - (candle.high - 67500) * priceScale;
      const lowY = centerY - (candle.low - 67500) * priceScale;

      const bodyTop = Math.min(openY, closeY);
      const bodyBottom = Math.max(openY, closeY);
      const bodyHeight = Math.max(bodyBottom - bodyTop, 4);

      // Base colors (higher opacity for visibility)
      const baseColor = candle.isGreen ? '0,255,136' : '255,68,119';
      const bodyColor = `rgba(${baseColor}, ${0.6})`;
      const wickColor = `rgba(${baseColor}, ${0.55})`;
      const outlineColor = `rgba(${baseColor}, ${0.9})`;

      // Draw wick thicker
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Disintegration amount per candle (introduce slight stagger)
      const localD = Math.min(1, Math.max(0, disintegrate - idx * 0.01));

      // Draw intact portion of body (shrinks as it disintegrates)
      const intactRatio = 1 - localD * 0.95; // stronger breakup
      const intactHeight = Math.max(2, bodyHeight * intactRatio);
      const intactTop = bodyTop + (bodyHeight - intactHeight) / 2;

      ctx.fillStyle = bodyColor;
      ctx.fillRect(x - 6, intactTop, 12, intactHeight);

      // Outline for definition
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 6, intactTop, 12, intactHeight);

      // Fragments: small shards flying outward as disintegration grows
      if (localD > 0.05) {
        const shardCount = 20; // more shards for bigger look
        const rand = createSeededRandom(idx + 1000);
        for (let i = 0; i < shardCount; i++) {
          const angle = rand() * Math.PI * 2;
          const radius = localD * (20 + rand() * 40); // expand with progress
          const sx = x + Math.cos(angle) * radius;
          const sy = intactTop + (rand() - 0.5) * (intactHeight + 6) + Math.sin(angle) * (radius * 0.4);
          const w = 2 + rand() * 3;
          const h = 2 + rand() * 3;
          const alpha = Math.max(0, 0.6 - localD * 0.6) * (0.6 + rand() * 0.4);
          ctx.fillStyle = `rgba(${baseColor}, ${alpha})`;
          ctx.fillRect(sx, sy, w, h);
        }
      }
    });

    // Subtle vignette for cinematic depth
    const grad = ctx.createRadialGradient(width/2, height/2, Math.min(width, height)*0.2, width/2, height/2, Math.max(width, height)*0.7);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  };

  // Animation loop
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (time - lastTimeRef.current >= 16.67) {
      offsetRef.current -= 1.0; // move right->left
      // Reset stream
      if (offsetRef.current <= -600) {
        offsetRef.current = 0;
        const spacing = 26; // wider columns
        const candleCount = Math.ceil(window.innerWidth / spacing) + 40;
        candlesRef.current = generateCandles(candleCount, -600, 12345, spacing);
      }
      drawFrame(ctx, candlesRef.current, offsetRef.current, disintegrateRef.current);
      lastTimeRef.current = time;
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  // Mount
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const resize = () => {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spacing = 26;
    const count = Math.ceil(window.innerWidth / spacing) + 40;
    candlesRef.current = generateCandles(count, -600, 12345, spacing);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Scroll disintegration control (pure window scroll for reliability)
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || typeof window === 'undefined') return;

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      // Start disintegration after hero (10%) and finish by 60%
      const t = Math.max(0, Math.min(1, (progress - 0.1) / 0.5));
      disintegrateRef.current = t;
      const blur = progress * 6;
      const opacity = Math.max(0.32 - progress * 0.2, 0.08);
      const scale = 1 + progress * 0.06;
      cv.style.filter = `blur(${blur}px)`;
      cv.style.opacity = String(opacity);
      cv.style.transform = `scale(${scale})`;
      cv.style.transformOrigin = 'center center';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, opacity: 0.28, mixBlendMode: 'normal' }}
    />
  );
}

