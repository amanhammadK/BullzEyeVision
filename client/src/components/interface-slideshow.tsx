import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface SlideData {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

const slides: SlideData[] = [
  {
    id: "analytics",
    title: "Analytics Dashboard",
    description: "Real-time market data visualization",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Financial dashboard with charts and analytics",
    link: "/analytics-dashboard"
  },
  {
    id: "trading",
    title: "Trading Interface",
    description: "Lightning-fast order execution",
    image: "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Stock trading interface with order book",
    link: "/trading-interface"
  },
  {
    id: "analysis",
    title: "Technical Analysis",
    description: "Advanced charting tools",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Technical analysis charts with indicators",
    link: "/technical-analysis"
  },
  {
    id: "portfolio",
    title: "Portfolio Manager",
    description: "Complete portfolio tracking",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Portfolio management interface",
    link: "/analytics-dashboard"
  },
  {
    id: "alerts",
    title: "Smart Alerts",
    description: "AI-powered notifications",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Alert management system",
    link: "/trading-interface"
  },
  {
    id: "research",
    title: "Market Research",
    description: "Deep market insights",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Market research tools",
    link: "/technical-analysis"
  },
  {
    id: "backtesting",
    title: "Strategy Backtesting",
    description: "Test your trading strategies",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Backtesting interface",
    link: "/analytics-dashboard"
  },
  {
    id: "social",
    title: "Social Trading",
    description: "Follow top traders",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Social trading platform",
    link: "/trading-interface"
  },
  {
    id: "mobile",
    title: "Mobile Trading",
    description: "Trade on the go",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Mobile trading app",
    link: "/technical-analysis"
  }
];

export default function InterfaceSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const cardsPerView = 3;
  const totalSlides = Math.ceil(slides.length / cardsPerView);

  // Auto-advance slides when idle
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteraction;

      // Resume auto-play after 3 seconds of inactivity
      if (timeSinceLastInteraction > 3000) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsAutoPlaying(true);
      } else if (isAutoPlaying && timeSinceLastInteraction > 5000) {
        // Continue auto-play if already playing and idle for 5 seconds
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 4000); // Check every 4 seconds

    return () => clearInterval(interval);
  }, [lastInteraction, isAutoPlaying, totalSlides]);

  // Track user interactions
  const handleUserInteraction = () => {
    setLastInteraction(Date.now());
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    handleUserInteraction();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    handleUserInteraction();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    handleUserInteraction();
  };

  const getCurrentCards = () => {
    const startIndex = currentSlide * cardsPerView;
    return slides.slice(startIndex, startIndex + cardsPerView);
  };

  return (
    <div
      className="relative max-w-7xl mx-auto"
      onMouseEnter={handleUserInteraction}
      onMouseLeave={() => setLastInteraction(Date.now())}
    >
      {/* Cards Grid */}
      <div className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {getCurrentCards().map((slide, index) => (
            <div key={`${currentSlide}-${index}`} className="card-3d">
              <Link href={slide.link}>
                <Card className="card-3d-inner rounded-xl overflow-hidden bg-card border-border hover:bg-accent hover:border-signal-red/40 transition-all duration-300 glow-effect depth-shadow cursor-pointer group">
                  <CardContent className="p-0">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-8">
                      <h3 className="text-xl font-bold mb-3 text-foreground">{slide.title}</h3>
                      <p className="text-muted-foreground text-base">{slide.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border text-foreground rounded-full p-3 shadow-lg"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border text-foreground rounded-full p-3 shadow-lg"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-signal-red scale-125'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-4 text-muted-foreground">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
}
