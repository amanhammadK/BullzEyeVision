import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Zap, Target, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

export default function TradingInterface() {
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
            <h1 className="text-4xl md:text-6xl font-black mb-6 gradient-text">Trading Interface</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              <span className="gradient-keyword-red">Lightning-fast</span> order execution with <span className="gradient-keyword-green">precision controls</span> for professional traders.
            </p>
          </div>

          {/* Main Interface Preview */}
          <div className="relative max-w-6xl mx-auto mb-16">
            <Card className="overflow-hidden bg-card border-border shadow-2xl">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" 
                  alt="Trading Interface with Order Book" 
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
                  <Zap className="h-6 w-6 text-signal-red" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Instant Execution</h3>
                <p className="text-muted-foreground text-sm">Sub-millisecond order processing</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center bg-card border-border hover:bg-accent transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-matrix-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-matrix-green" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Smart Orders</h3>
                <p className="text-muted-foreground text-sm">Advanced order types with AI assistance</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center bg-card border-border hover:bg-accent transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-signal-red/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-signal-red" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Risk Controls</h3>
                <p className="text-muted-foreground text-sm">Built-in position and risk management</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center bg-card border-border hover:bg-accent transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-matrix-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-matrix-green" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Order History</h3>
                <p className="text-muted-foreground text-sm">Complete trade history and analytics</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Button className="bg-signal-red text-white px-8 py-4 text-lg font-semibold hover:bg-red-600 neon-glow">
              Try Trading Interface
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
