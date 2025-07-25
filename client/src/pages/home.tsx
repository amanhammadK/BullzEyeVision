import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Rocket, 
  Play, 
  TrendingUp, 
  Brain, 
  Gauge, 
  Shield,
  Check,
  Star,
  Twitter,
  Linkedin,
  Youtube,
  Menu,
  X
} from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-deep-space text-cool-gray font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-deep-space/90 backdrop-blur-md z-50 border-b border-dark-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold gradient-text">BullzEye</div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="hover:text-signal-red transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-signal-red transition-colors cursor-pointer"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-signal-red transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => scrollToSection('demo')}
                  className="hover:text-signal-red transition-colors cursor-pointer"
                >
                  Demo
                </button>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" className="border-signal-red text-signal-red hover:bg-signal-red hover:text-white">
                Login
              </Button>
              <Button className="bg-signal-red text-white hover:bg-red-600 neon-glow">
                Sign Up
              </Button>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-deep-space/95 backdrop-blur-md border-t border-dark-navy">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => scrollToSection('features')} className="block px-3 py-2 text-base font-medium hover:text-signal-red transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block px-3 py-2 text-base font-medium hover:text-signal-red transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="block px-3 py-2 text-base font-medium hover:text-signal-red transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('demo')} className="block px-3 py-2 text-base font-medium hover:text-signal-red transition-colors">Demo</button>
              <div className="flex space-x-2 px-3 py-2">
                <Button variant="outline" size="sm" className="border-signal-red text-signal-red">Login</Button>
                <Button size="sm" className="bg-signal-red text-white hover:bg-red-600">Sign Up</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Multiple trading screens displaying financial data" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-space via-deep-space/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">See the Market</span><br />
              <span className="text-signal-red">Like a Sharpshooter</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-cool-gray/80 max-w-3xl mx-auto">
              BullzEye uses real-time analytics to give you the upper hand. 
              Transform raw market data into precision trading intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="bg-signal-red text-white px-8 py-4 text-lg font-semibold hover:bg-red-600 neon-glow animate-glow">
                <Rocket className="mr-2 h-5 w-5" />
                Launch App
              </Button>
              <Button variant="outline" className="border-2 border-matrix-green text-matrix-green px-8 py-4 text-lg font-semibold hover:bg-matrix-green hover:text-deep-space">
                <Play className="mr-2 h-5 w-5" />
                See Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-16 h-16 border border-signal-red/30 rounded-full animate-float hidden lg:block"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 border border-matrix-green/30 rotate-45 animate-float-delayed hidden lg:block"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-deep-space to-dark-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="features-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Arsenal of Precision</h2>
            <p className="text-xl text-cool-gray/70 max-w-3xl mx-auto">
              Every tool engineered for market domination. See opportunities others miss.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="feature-card p-8 text-center bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-signal-red/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-signal-red" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Smart Charts & Predictive Analytics</h3>
                <p className="text-cool-gray/70">Advanced charting with AI-powered predictions that anticipate market movements before they happen.</p>
              </CardContent>
            </Card>
            
            <Card className="feature-card p-8 text-center bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-matrix-green/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-matrix-green" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">AI-Powered Trade Signals</h3>
                <p className="text-cool-gray/70">Machine learning algorithms analyze thousands of data points to deliver precision entry and exit signals.</p>
              </CardContent>
            </Card>
            
            <Card className="feature-card p-8 text-center bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-signal-red/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Gauge className="h-8 w-8 text-signal-red" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Personalized Dashboard</h3>
                <p className="text-cool-gray/70">Your command center. Customize every element to match your trading style and preferences.</p>
              </CardContent>
            </Card>
            
            <Card className="feature-card p-8 text-center bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-matrix-green/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-matrix-green" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Risk-Reward Analyzer</h3>
                <p className="text-cool-gray/70">Calculate optimal position sizes and stop-losses with real-time risk assessment technology.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-dark-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="how-it-works-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Mission Protocol</h2>
            <p className="text-xl text-cool-gray/70 max-w-3xl mx-auto">
              Four steps to market superiority. Simple setup, devastating effectiveness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-signal-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">1</div>
              <h3 className="text-xl font-bold mb-4 text-white">Connect Brokerage</h3>
              <p className="text-cool-gray/70">Securely link your trading account with military-grade encryption.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-matrix-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">2</div>
              <h3 className="text-xl font-bold mb-4 text-white">Set Preferences</h3>
              <p className="text-cool-gray/70">Configure your trading style, risk tolerance, and target instruments.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-signal-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">3</div>
              <h3 className="text-xl font-bold mb-4 text-white">Analyze & Trade</h3>
              <p className="text-cool-gray/70">Execute precision trades with AI-powered insights and real-time analysis.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-matrix-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">4</div>
              <h3 className="text-xl font-bold mb-4 text-white">Review Performance</h3>
              <p className="text-cool-gray/70">Track results, optimize strategies, and dominate the market.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-20 bg-deep-space">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="demo-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">See BullzEye in Action</h2>
            <p className="text-xl text-cool-gray/70 max-w-3xl mx-auto">
              Watch how professional traders use BullzEye to identify winning opportunities.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <Card className="relative bg-dark-navy rounded-2xl overflow-hidden hud-border">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675" 
                  alt="Professional trader analyzing financial charts" 
                  className="w-full h-auto" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-space/80 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button className="w-20 h-20 bg-signal-red rounded-full hover:bg-red-600 transition-all animate-pulse">
                    <Play className="h-8 w-8 text-white" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Screenshots Carousel */}
      <section className="py-20 bg-gradient-to-b from-dark-navy to-deep-space">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="screenshots-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Command Interface</h2>
            <p className="text-xl text-cool-gray/70 max-w-3xl mx-auto">
              Every screen designed for speed, precision, and clarity under pressure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="feature-card rounded-xl overflow-hidden bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Financial dashboard with charts and analytics" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Analytics Dashboard</h3>
                  <p className="text-cool-gray/70">Real-time market data visualization</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card rounded-xl overflow-hidden bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Stock trading interface with order book" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Trading Interface</h3>
                  <p className="text-cool-gray/70">Lightning-fast order execution</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card rounded-xl overflow-hidden bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Technical analysis charts with indicators" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">Technical Analysis</h3>
                  <p className="text-cool-gray/70">Advanced charting tools</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-dark-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="pricing-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Choose Your Arsenal</h2>
            <p className="text-xl text-cool-gray/70 max-w-3xl mx-auto">
              From basic reconnaissance to full tactical superiority. Every plan pays for itself.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <Card className="price-card p-8 rounded-2xl bg-gradient-to-br from-dark-navy/80 to-deep-space/90 border-matrix-green/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-signal-red/20 transition-all duration-300">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">Reconnaissance</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-black text-matrix-green">Free</span>
                  </div>
                  <p className="text-cool-gray/70">Essential market intelligence</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-matrix-green mr-3" />
                    Basic charting tools
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-matrix-green mr-3" />
                    5 watchlists
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-matrix-green mr-3" />
                    Basic alerts
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-matrix-green mr-3" />
                    Community access
                  </li>
                </ul>
                <Button className="w-full bg-transparent border border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-deep-space transition-all">
                  Start Free
                </Button>
              </CardContent>
            </Card>
            
            {/* Pro Tier */}
            <Card className="price-card p-8 rounded-2xl bg-gradient-to-br from-dark-navy/80 to-deep-space/90 border-signal-red/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-signal-red/20 transition-all duration-300 relative overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-signal-red text-white">POPULAR</Badge>
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">Strike Force</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-black text-signal-red">$49</span>
                    <span className="text-cool-gray/70">/month</span>
                  </div>
                  <p className="text-cool-gray/70">Advanced trading capabilities</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-signal-red mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-signal-red mr-3" />
                    AI trade signals
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-signal-red mr-3" />
                    Unlimited watchlists
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-signal-red mr-3" />
                    Risk analyzer
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-signal-red mr-3" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full bg-signal-red text-white hover:bg-red-600 transition-all neon-glow">
                  Go Pro
                </Button>
              </CardContent>
            </Card>
            
            {/* Elite Tier */}
            <Card className="price-card p-8 rounded-2xl bg-gradient-to-br from-dark-navy/80 to-deep-space/90 border-matrix-green/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-signal-red/20 transition-all duration-300">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">Command Center</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-black gradient-text">$199</span>
                    <span className="text-cool-gray/70">/month</span>
                  </div>
                  <p className="text-cool-gray/70">Ultimate trading dominance</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-matrix-green mr-3" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-matrix-green mr-3" />
                    Custom algorithms
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-matrix-green mr-3" />
                    API access
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-matrix-green mr-3" />
                    White-label options
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-matrix-green mr-3" />
                    Dedicated manager
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-matrix-green to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all">
                  Go Elite
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-deep-space">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="testimonials-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Battle-Tested Results</h2>
            <p className="text-xl text-cool-gray/70 max-w-3xl mx-auto">
              Traders who switched to BullzEye don't look back. Here's why.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="feature-card p-8 rounded-xl bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Professional male trader" 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h4 className="font-bold text-white">Marcus Chen</h4>
                    <p className="text-cool-gray/70 text-sm">Day Trader</p>
                  </div>
                </div>
                <p className="text-cool-gray/80 italic mb-4">"BullzEye's AI signals increased my win rate by 40%. The risk analyzer alone has saved me thousands."</p>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card p-8 rounded-xl bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Professional female trader" 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h4 className="font-bold text-white">Sarah Rodriguez</h4>
                    <p className="text-cool-gray/70 text-sm">Portfolio Manager</p>
                  </div>
                </div>
                <p className="text-cool-gray/80 italic mb-4">"The predictive analytics are incredibly accurate. It's like having a crystal ball for the markets."</p>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card p-8 rounded-xl bg-dark-navy/30 border-matrix-green/20 hover:bg-dark-navy/50 hover:border-signal-red/40 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Young professional trader" 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h4 className="font-bold text-white">Alex Thompson</h4>
                    <p className="text-cool-gray/70 text-sm">Swing Trader</p>
                  </div>
                </div>
                <p className="text-cool-gray/80 italic mb-4">"Finally, a platform that understands speed matters. BullzEye executes my strategies flawlessly."</p>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dark-navy via-deep-space to-dark-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 gradient-text">Ready to Dominate?</h2>
          <p className="text-xl text-cool-gray/70 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who've already upgraded their game. The market waits for no one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-signal-red text-white px-8 py-4 text-lg font-semibold hover:bg-red-600 neon-glow">
              <Rocket className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-2 border-matrix-green text-matrix-green px-8 py-4 text-lg font-semibold hover:bg-matrix-green hover:text-deep-space">
              <Play className="mr-2 h-5 w-5" />
              Book Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-space border-t border-dark-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-3xl font-bold gradient-text mb-4">BullzEye</div>
              <p className="text-cool-gray/70 mb-6 max-w-md">
                Precision trading intelligence for the modern market warrior. 
                See opportunities others miss.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-cool-gray hover:text-signal-red transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-cool-gray hover:text-signal-red transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-cool-gray hover:text-signal-red transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-cool-gray/70 hover:text-signal-red transition-colors">Features</a></li>
                <li><a href="#" className="text-cool-gray/70 hover:text-signal-red transition-colors">Pricing</a></li>
                <li><a href="#" className="text-cool-gray/70 hover:text-signal-red transition-colors">Demo</a></li>
                <li><a href="#" className="text-cool-gray/70 hover:text-signal-red transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-cool-gray/70 hover:text-signal-red transition-colors">Help Center</a></li>
                <li><a href="#" className="text-cool-gray/70 hover:text-signal-red transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-cool-gray/70 hover:text-signal-red transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-cool-gray/70 hover:text-signal-red transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-12 bg-dark-navy" />
          <div className="text-center">
            <p className="text-cool-gray/50">© 2024 BullzEye. All rights reserved. Trade with precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
