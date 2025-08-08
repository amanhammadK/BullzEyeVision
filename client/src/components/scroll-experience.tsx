import { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3, Activity, Target, Zap } from "lucide-react";
import * as THREE from 'three';

// TRADING CHART COMPONENT - REAL MARKET ANALYSIS
function TradingChart({ symbol, price, change, data }: {
  symbol: string,
  price: string,
  change: string,
  data: number[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 120;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw chart line
    ctx.strokeStyle = change.startsWith('+') ? '#00cc66' : '#ff4444';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const stepX = canvas.width / (data.length - 1);
    const minPrice = Math.min(...data);
    const maxPrice = Math.max(...data);
    const priceRange = maxPrice - minPrice;

    data.forEach((price, index) => {
      const x = index * stepX;
      const y = canvas.height - ((price - minPrice) / priceRange) * canvas.height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = change.startsWith('+') ? '#00cc66' : '#ff4444';
    ctx.shadowBlur = 10;
    ctx.stroke();

  }, [data, change]);

  return (
    <div className="bg-black/80 border border-white/20 p-4 rounded-none backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-mono text-sm font-bold">{symbol}</span>
        <span className={`font-mono text-sm ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <div className="text-white font-mono text-lg mb-2">{price}</div>
      <canvas ref={canvasRef} className="w-full h-16" />
    </div>
  );
}

// REAL TRADING ANALYSIS EXPERIENCE
export default function ScrollExperience() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  // Real market data simulation
  const marketData = {
    btc: { symbol: 'BTC/USD', price: '$67,234.50', change: '+2.4%', data: [65000, 65500, 66200, 67000, 67234] },
    eth: { symbol: 'ETH/USD', price: '$3,456.78', change: '+1.8%', data: [3400, 3420, 3445, 3450, 3456] },
    spy: { symbol: 'SPY', price: '$428.90', change: '-0.3%', data: [430, 429, 428.5, 429.2, 428.9] }
  };

  useEffect(() => {
    // Hide intro after 1.5 seconds - precision cut
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);

      const section = Math.floor(progress * 4);
      setCurrentSection(section);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intro Screen - Fullscreen Black with Sharp Fade
  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <h1
          className="text-6xl md:text-8xl font-black text-white font-mono tracking-tight"
          style={{
            animation: 'sharpFadeIn 300ms ease-out forwards'
          }}
        >
          BULLZEYE
        </h1>
      </div>
    );
  }

  return (
    <div className="relative bg-black overflow-hidden">
      {/* Minimal Background - No Fancy 3D */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black">
          {/* Subtle grid pattern - like trading terminal */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 204, 102, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 204, 102, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </div>

      {/* REAL TRADING ANALYSIS CONTENT */}
      <div className="relative z-10">
        {/* DIMENSIONAL DIVIDER - FORWARD SLIDE */}
        <section className="h-screen flex items-center justify-center">
          <div
            className="max-w-6xl mx-auto px-8"
            style={{
              opacity: currentSection === 0 ? 1 : 0,
              transform: `translateZ(${currentSection === 0 ? 0 : -50}px) scale(${currentSection === 0 ? 1 : 0.95})`,
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {/* Main Dashboard Panel - Floating UI */}
            <div className="bg-black/60 border border-white/30 p-12 backdrop-blur-sm">
              {/* Title heading top-left */}
              <div className="mb-8">
                <h1 className="text-4xl font-black text-white font-mono tracking-tight mb-2">
                  MARKET ANALYSIS
                </h1>
                <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                  REAL-TIME TRADING INTELLIGENCE
                </p>
              </div>

              {/* Live Trading Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <TradingChart {...marketData.btc} />
                <TradingChart {...marketData.eth} />
                <TradingChart {...marketData.spy} />
              </div>

              {/* AI Analysis Card */}
              <div className="bg-black/80 border border-green-500/30 p-6 rounded-none">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-green-400 font-mono text-sm uppercase tracking-wider">AI SIGNAL</span>
                </div>
                <p className="text-white font-mono text-lg leading-relaxed">
                  Strong bullish momentum detected across crypto markets.
                  <span className="text-green-400"> BTC breakout imminent.</span>
                </p>
                <div className="mt-4 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-gray-400 font-mono text-xs">CONFIDENCE: 94%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO PERFORMANCE - REAL DATA */}
        <section className="h-screen flex items-center justify-center">
          <div
            className="max-w-7xl mx-auto px-8"
            style={{
              opacity: currentSection >= 1 ? 1 : 0,
              transform: `translateY(${currentSection >= 1 ? 0 : 40}px)`,
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {/* Performance Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Portfolio Stats */}
              <div className="bg-black/60 border border-white/30 p-8 backdrop-blur-sm">
                <div className="mb-6">
                  <span className="text-gray-400 font-mono text-xs uppercase tracking-wider">PORTFOLIO VALUE</span>
                  <div className="text-5xl font-black text-white font-mono mt-2">$2,847,392</div>
                  <div className="text-green-400 font-mono text-lg mt-1">+$247,392 (+9.5%)</div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono text-sm">24H P&L</span>
                    <span className="text-green-400 font-mono text-sm">+$12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono text-sm">Win Rate</span>
                    <span className="text-white font-mono text-sm">87.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono text-sm">Sharpe Ratio</span>
                    <span className="text-white font-mono text-sm">2.84</span>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="bg-black/60 border border-white/30 p-8 backdrop-blur-sm">
                <div className="mb-6">
                  <span className="text-gray-400 font-mono text-xs uppercase tracking-wider">RISK METRICS</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-mono text-sm">Portfolio Beta</span>
                      <span className="text-white font-mono text-sm">0.73</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded">
                      <div className="bg-green-400 h-2 rounded" style={{ width: '73%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-mono text-sm">Max Drawdown</span>
                      <span className="text-red-400 font-mono text-sm">-4.2%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded">
                      <div className="bg-red-400 h-2 rounded" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRADING SIGNALS - LIVE ANALYSIS */}
        <section className="h-screen flex items-center justify-center">
          <div
            className="max-w-6xl mx-auto px-8"
            style={{
              opacity: currentSection >= 2 ? 1 : 0,
              transform: `translateZ(${currentSection >= 2 ? 0 : -30}px) scale(${currentSection >= 2 ? 1 : 0.95})`,
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {/* Live Trading Signals Panel */}
            <div className="bg-black/60 border border-green-500/30 p-8 backdrop-blur-sm">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Zap className="w-6 h-6 text-green-400 mr-3" />
                  <h2 className="text-3xl font-black text-white font-mono tracking-tight">
                    LIVE SIGNALS
                  </h2>
                </div>
                <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                  AI-POWERED TRADING OPPORTUNITIES
                </p>
              </div>

              {/* Signal Cards */}
              <div className="space-y-4">
                {/* BUY Signal */}
                <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-none">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-green-400 font-mono font-bold">BUY SIGNAL</span>
                    </div>
                    <span className="text-white font-mono text-sm">BTC/USD</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                    <div>
                      <span className="text-gray-400">Entry:</span>
                      <div className="text-white">$67,200</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Target:</span>
                      <div className="text-green-400">$72,500</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Stop:</span>
                      <div className="text-red-400">$65,800</div>
                    </div>
                  </div>
                </div>

                {/* SELL Signal */}
                <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-none">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 text-red-400 mr-3" />
                      <span className="text-red-400 font-mono font-bold">SELL SIGNAL</span>
                    </div>
                    <span className="text-white font-mono text-sm">SPY</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                    <div>
                      <span className="text-gray-400">Entry:</span>
                      <div className="text-white">$429.00</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Target:</span>
                      <div className="text-green-400">$422.50</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Stop:</span>
                      <div className="text-red-400">$432.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA - CLEAN FINISH */}
        <section className="h-screen flex items-center justify-center">
          <div
            className="text-center max-w-4xl mx-auto px-8"
            style={{
              opacity: currentSection >= 3 ? 1 : 0,
              transform: `translateY(${currentSection >= 3 ? 0 : 30}px)`,
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {/* Clean Logo */}
            <div className="mb-12">
              <h1 className="text-8xl md:text-9xl font-black text-white font-mono tracking-tight leading-none">
                BULLZEYE
              </h1>
              <p className="text-gray-400 font-mono text-lg mt-4 uppercase tracking-wider">
                PRECISION TRADING INTELLIGENCE
              </p>
            </div>

            {/* Simple CTA */}
            <div className="space-y-6">
              <Button
                className="bg-green-500 hover:bg-green-400 text-black px-12 py-4 text-lg font-mono font-black uppercase tracking-wider rounded-none border-0 transition-all duration-200"
                style={{
                  backgroundColor: '#00cc66',
                  boxShadow: '0 0 30px rgba(0, 204, 102, 0.3)'
                }}
              >
                <ArrowRight className="mr-3 h-5 w-5" />
                START TRADING
              </Button>

              <div className="text-gray-500 font-mono text-sm">
                Join 10,000+ traders using BullzEye
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* SHARP ANIMATIONS - NO FLUFF */}
      <style>{`
        @keyframes sharpFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
