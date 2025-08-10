import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronUp
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Soft Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Soft Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-semibold tracking-wide">
                <span className="text-white">BULLZ</span>
                <span className="text-emerald-400">EYE</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-white/80 hover:text-emerald-400 transition-colors font-medium text-sm">Features</a>
              <a href="#how-it-works" className="text-white/80 hover:text-emerald-400 transition-colors font-medium text-sm">How It Works</a>
              <a href="#pricing" className="text-white/80 hover:text-emerald-400 transition-colors font-medium text-sm">Pricing</a>
              <a href="#contact" className="text-white/80 hover:text-emerald-400 transition-colors font-medium text-sm">Contact</a>
              <ModeToggle />
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <ModeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-emerald-400 p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Soft Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-md">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <a href="#features" className="block px-4 py-2 text-white/80 hover:text-emerald-400 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="block px-4 py-2 text-white/80 hover:text-emerald-400 transition-colors font-medium">How It Works</a>
              <a href="#pricing" className="block px-4 py-2 text-white/80 hover:text-emerald-400 transition-colors font-medium">Pricing</a>
              <a href="#contact" className="block px-4 py-2 text-white/80 hover:text-emerald-400 transition-colors font-medium">Contact</a>
              <div className="px-4 py-4">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Simple Hero Section with Candlestick Background */}
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Simple 3D Candlestick Background */}
        <div className="fixed inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 10], fov: 75 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={1.0} />
            <pointLight position={[10, 10, 10]} intensity={1.0} />

            {/* Simple Large Candlesticks */}
            {Array.from({ length: 10 }, (_, i) => (
              <mesh key={i} position={[(i - 4.5) * 3, 0, 0]}>
                <boxGeometry args={[1, Math.random() * 4 + 2, 1]} />
                <meshStandardMaterial
                  color={Math.random() > 0.5 ? '#00ff88' : '#ff4477'}
                  emissive={Math.random() > 0.5 ? '#00ff88' : '#ff4477'}
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            ))}
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center">
          <h1 className="text-8xl font-black text-white mb-4">BULLZEYE</h1>
          <p className="text-2xl text-gray-300 mb-8">PRECISION TRADING INTELLIGENCE</p>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 text-lg font-semibold rounded">
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-6xl font-black text-white mb-6">THE EDGE YOU NEED</h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto">
            Advanced AI technology that gives you the advantage in trading
          </p>
        </div>
      </div>

      {/* Soft Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-all duration-200"
          size="sm"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
