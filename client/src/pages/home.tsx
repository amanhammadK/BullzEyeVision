import { useState, useEffect, useCallback } from "react";
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
  X,
  ChevronUp
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import InterfaceSlideshow from "@/components/interface-slideshow";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.warn('Error scrolling to section:', error);
    }
    setIsMobileMenuOpen(false);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-background text-foreground font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity cursor-pointer"
              >
                BullzEye
              </button>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-signal-red transition-colors cursor-pointer"
                >
                  Home
                </button>
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

              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <ModeToggle />
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
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="block px-3 py-2 text-base font-medium hover:text-signal-red transition-colors">Home</button>
              <button onClick={() => scrollToSection('features')} className="block px-3 py-2 text-base font-medium hover:text-signal-red transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block px-3 py-2 text-base font-medium hover:text-signal-red transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="block px-3 py-2 text-base font-medium hover:text-signal-red transition-colors">Pricing</button>

              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <ModeToggle />
              </div>
              <div className="flex space-x-2 px-3 py-2">
                <Button variant="outline" size="sm" className="border-signal-red text-signal-red">Login</Button>
                <Button size="sm" className="bg-signal-red text-white hover:bg-red-600">Sign Up</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-3d">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Multiple trading screens displaying financial data" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-space via-deep-space/80 to-transparent"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="floating-shapes">
          <div className="shape-particle" style={{left: '10%', width: '8px', height: '8px', animationDuration: '12s'}}></div>
          <div className="shape-particle" style={{left: '20%', width: '6px', height: '6px', animationDuration: '15s'}}></div>
          <div className="shape-particle" style={{left: '30%', width: '10px', height: '10px', animationDuration: '18s'}}></div>
          <div className="shape-particle" style={{left: '40%', width: '4px', height: '4px', animationDuration: '14s'}}></div>
          <div className="shape-particle" style={{left: '50%', width: '7px', height: '7px', animationDuration: '16s'}}></div>
          <div className="shape-particle" style={{left: '60%', width: '9px', height: '9px', animationDuration: '13s'}}></div>
          <div className="shape-particle" style={{left: '70%', width: '5px', height: '5px', animationDuration: '17s'}}></div>
          <div className="shape-particle" style={{left: '80%', width: '8px', height: '8px', animationDuration: '11s'}}></div>
          <div className="shape-particle" style={{left: '90%', width: '6px', height: '6px', animationDuration: '19s'}}></div>
        </div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 right-20 hidden lg:block">
          <div className="geometric-float"></div>
        </div>
        <div className="absolute top-40 left-16 hidden lg:block">
          <div className="geometric-float"></div>
        </div>
        <div className="absolute bottom-32 right-32 hidden lg:block">
          <div className="geometric-float"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="hero-content animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">Time the Market</span><br />
              <span className="text-signal-red">Like a Sharpshooter</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-foreground max-w-3xl mx-auto">
              BullzEye uses <span className="gradient-keyword-green">real-time analytics</span> to give you the upper hand.
              Transform raw market data into <span className="gradient-keyword-red">precision trading</span> intelligence.
            </p>
            <div className="flex justify-center items-center">
              <Button className="modern-button bg-signal-red text-white px-8 py-4 text-lg font-semibold hover:bg-red-600 neon-glow animate-glow depth-shadow">
                <Rocket className="mr-2 h-5 w-5" />
                Launch App
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-background to-muted dark:from-deep-space dark:to-dark-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="features-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Arsenal of Precision</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every tool engineered for <span className="gradient-keyword-red">market domination</span>. See <span className="gradient-keyword-green">opportunities</span> others miss.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-3d h-full">
              <Card className="card-3d-inner text-center bg-card/60 border-matrix-green/20 hover:bg-card/80 hover:border-signal-red/40 transition-all duration-300 glow-effect depth-shadow dark:bg-dark-navy/30 dark:hover:bg-dark-navy/50 h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="w-16 h-16 bg-signal-red/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-8 w-8 text-signal-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">Smart Charts & Predictive Analytics</h3>
                  <p className="text-foreground flex-grow">Advanced charting with AI-powered predictions that anticipate market movements before they happen.</p>
                </CardContent>
              </Card>
            </div>

            <div className="card-3d h-full">
              <Card className="card-3d-inner text-center bg-card/60 border-matrix-green/20 hover:bg-card/80 hover:border-signal-red/40 transition-all duration-300 glow-effect depth-shadow dark:bg-dark-navy/30 dark:hover:bg-dark-navy/50 h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="w-16 h-16 bg-matrix-green/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Brain className="h-8 w-8 text-matrix-green" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">AI-Powered Trade Signals</h3>
                  <p className="text-foreground flex-grow">Machine learning algorithms analyze thousands of data points to deliver precision entry and exit signals.</p>
                </CardContent>
              </Card>
            </div>

            <div className="card-3d h-full">
              <Card className="card-3d-inner text-center bg-card/60 border-matrix-green/20 hover:bg-card/80 hover:border-signal-red/40 transition-all duration-300 glow-effect depth-shadow dark:bg-dark-navy/30 dark:hover:bg-dark-navy/50 h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="w-16 h-16 bg-signal-red/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Gauge className="h-8 w-8 text-signal-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">Personalized Dashboard</h3>
                  <p className="text-foreground flex-grow">Your command center. Customize every element to match your trading style and preferences.</p>
                </CardContent>
              </Card>
            </div>

            <div className="card-3d h-full">
              <Card className="card-3d-inner text-center bg-card/60 border-matrix-green/20 hover:bg-card/80 hover:border-signal-red/40 transition-all duration-300 glow-effect depth-shadow dark:bg-dark-navy/30 dark:hover:bg-dark-navy/50 h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="w-16 h-16 bg-matrix-green/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-matrix-green" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">Risk-Reward Analyzer</h3>
                  <p className="text-foreground flex-grow">Calculate optimal position sizes and stop-losses with real-time risk assessment technology.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted dark:bg-dark-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="how-it-works-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Mission Protocol</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four steps to <span className="gradient-keyword-red">market superiority</span>. Simple setup, <span className="gradient-keyword-green">devastating effectiveness</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-signal-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">1</div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Connect Brokerage</h3>
              <p className="text-muted-foreground">Securely link your trading account with military-grade encryption.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-matrix-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">2</div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Set Preferences</h3>
              <p className="text-muted-foreground">Configure your trading style, risk tolerance, and target instruments.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-signal-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">3</div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Analyze & Trade</h3>
              <p className="text-muted-foreground">Execute precision trades with AI-powered insights and real-time analysis.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-matrix-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">4</div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Review Performance</h3>
              <p className="text-muted-foreground">Track results, optimize strategies, and dominate the market.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Command Interface Slideshow */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="interface-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Command Interface</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every screen designed for <span className="gradient-keyword-red">speed</span>, <span className="gradient-keyword-green">precision</span>, and clarity under pressure.
            </p>
          </div>

          <InterfaceSlideshow />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="pricing-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Choose Your Arsenal</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From basic reconnaissance to full <span className="gradient-keyword-red">tactical superiority</span>. Every plan <span className="gradient-keyword-green">pays for itself</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Free Tier */}
            <div className="card-3d h-full">
              <Card className="card-3d-inner rounded-2xl bg-gradient-to-br from-dark-navy/80 to-deep-space/90 border-matrix-green/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-signal-red/20 transition-all duration-300 glow-effect depth-shadow h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Reconnaissance</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-black text-matrix-green">Free</span>
                    </div>
                    <p className="text-muted-foreground">Essential market intelligence</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-matrix-green mr-3" />
                      <span className="text-foreground">Basic charting tools</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-matrix-green mr-3" />
                      <span className="text-foreground">5 watchlists</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-matrix-green mr-3" />
                      <span className="text-foreground">Basic alerts</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-matrix-green mr-3" />
                      <span className="text-foreground">Community access</span>
                    </li>
                  </ul>
                  <Button className="modern-button w-full bg-transparent border border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-deep-space transition-all mt-auto">
                    Start Free
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Pro Tier */}
            <div className="card-3d h-full">
              <Card className="card-3d-inner rounded-2xl bg-gradient-to-br from-dark-navy/80 to-deep-space/90 border-signal-red/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-signal-red/20 transition-all duration-300 relative overflow-hidden glow-effect depth-shadow h-full">
                <Badge className="absolute top-4 right-4 bg-signal-red text-white">POPULAR</Badge>
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Strike Force</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-black text-signal-red">$49</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-muted-foreground">Advanced trading capabilities</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-signal-red mr-3" />
                      <span className="text-foreground">Advanced analytics</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-signal-red mr-3" />
                      <span className="text-foreground">AI trade signals</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-signal-red mr-3" />
                      <span className="text-foreground">Unlimited watchlists</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-signal-red mr-3" />
                      <span className="text-foreground">Risk analyzer</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-signal-red mr-3" />
                      <span className="text-foreground">Priority support</span>
                    </li>
                  </ul>
                  <Button className="modern-button w-full bg-signal-red text-white hover:bg-red-600 transition-all neon-glow mt-auto">
                    Go Pro
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Elite Tier */}
            <div className="card-3d h-full">
              <Card className="card-3d-inner rounded-2xl bg-gradient-to-br from-dark-navy/80 to-deep-space/90 border-matrix-green/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-signal-red/20 transition-all duration-300 glow-effect depth-shadow h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Command Center</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-black gradient-text">$199</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-muted-foreground">Ultimate trading dominance</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-matrix-green mr-3" />
                      <span className="text-foreground">Everything in Pro</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-matrix-green mr-3" />
                      <span className="text-foreground">Custom algorithms</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-matrix-green mr-3" />
                      <span className="text-foreground">API access</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-matrix-green mr-3" />
                      <span className="text-foreground">White-label options</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-matrix-green mr-3" />
                      <span className="text-foreground">Dedicated manager</span>
                    </li>
                  </ul>
                  <Button className="modern-button w-full bg-gradient-to-r from-matrix-green to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all mt-auto">
                    Go Elite
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="testimonials-header">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Battle-Tested Results</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Traders who switched to BullzEye don't look back. Here's why.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="feature-card p-8 rounded-xl bg-card border-border hover:bg-accent hover:border-signal-red/40 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Professional male trader" 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h4 className="font-bold text-foreground">Marcus Chen</h4>
                    <p className="text-muted-foreground text-sm">Day Trader</p>
                  </div>
                </div>
                <p className="text-foreground italic mb-4">"BullzEye's AI signals increased my win rate by 40%. The risk analyzer alone has saved me thousands."</p>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card p-8 rounded-xl bg-card border-border hover:bg-accent hover:border-signal-red/40 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Professional female trader" 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h4 className="font-bold text-foreground">Sarah Rodriguez</h4>
                    <p className="text-muted-foreground text-sm">Portfolio Manager</p>
                  </div>
                </div>
                <p className="text-foreground italic mb-4">"The predictive analytics are incredibly accurate. It's like having a crystal ball for the markets."</p>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card p-8 rounded-xl bg-card border-border hover:bg-accent hover:border-signal-red/40 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Young professional trader" 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h4 className="font-bold text-foreground">Alex Thompson</h4>
                    <p className="text-muted-foreground text-sm">Swing Trader</p>
                  </div>
                </div>
                <p className="text-foreground italic mb-4">"Finally, a platform that understands speed matters. BullzEye executes my strategies flawlessly."</p>
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
      <section className="py-20 bg-gradient-to-r from-muted via-background to-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 gradient-text">Ready to Dominate?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of traders who've already upgraded their game. The market waits for no one.
          </p>
          <div className="flex justify-center items-center">
            <Button className="bg-signal-red text-white px-8 py-4 text-lg font-semibold hover:bg-red-600 neon-glow">
              <Rocket className="mr-2 h-5 w-5" />
              Start Free Trial
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
              <p className="text-cool-gray/80 mb-6 max-w-md">
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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-signal-red text-white hover:bg-red-600 shadow-lg neon-glow"
          size="sm"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
