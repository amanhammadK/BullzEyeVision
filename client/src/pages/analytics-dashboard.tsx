import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";
import { Link } from "wouter";

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="text-2xl font-bold gradient-text">BullzEye</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-b from-background to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 gradient-text">Analytics Dashboard</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real-time market data visualization with <span className="gradient-keyword-green">advanced analytics</span> and <span className="gradient-keyword-red">predictive insights</span>.
            </p>
          </div>

          {/* Main Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto mb-16">
            <Card className="overflow-hidden bg-card border-border shadow-2xl">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" 
                  alt="Analytics Dashboard Interface" 
                  className="w-full h-auto" 
                />
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center bg-card border-border hover:bg-accent transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-signal-red/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-signal-red" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Real-time Charts</h3>
                <p className="text-muted-foreground text-sm">Live market data with millisecond updates</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center bg-card border-border hover:bg-accent transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-matrix-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-matrix-green" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Custom Indicators</h3>
                <p className="text-muted-foreground text-sm">Build and deploy your own trading indicators</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center bg-card border-border hover:bg-accent transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-signal-red/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <PieChart className="h-6 w-6 text-signal-red" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Portfolio Analytics</h3>
                <p className="text-muted-foreground text-sm">Comprehensive portfolio performance tracking</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center bg-card border-border hover:bg-accent transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-matrix-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6 text-matrix-green" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Market Scanner</h3>
                <p className="text-muted-foreground text-sm">AI-powered market opportunity detection</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Button className="bg-signal-red text-white px-8 py-4 text-lg font-semibold hover:bg-red-600 neon-glow">
              Try Analytics Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
