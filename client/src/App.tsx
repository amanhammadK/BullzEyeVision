import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import TradingInterface from "@/pages/trading-interface";
import TechnicalAnalysis from "@/pages/technical-analysis";
import CinematicTradingExperience from "@/components/cinematic-trading-experience";
import ReactThreeFiberTest from "@/components/react-three-fiber-test";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/test" component={ReactThreeFiberTest} />
      <Route path="/cinematic" component={CinematicTradingExperience} />
      <Route path="/analytics-dashboard" component={AnalyticsDashboard} />
      <Route path="/trading-interface" component={TradingInterface} />
      <Route path="/technical-analysis" component={TechnicalAnalysis} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  console.log('🚨 APP COMPONENT RENDERING!');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        {/* EMERGENCY APP TEST - SHOULD BE VISIBLE */}
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'purple',
          color: 'white',
          fontSize: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          🚨 APP COMPONENT EMERGENCY TEST - PURPLE SCREEN
        </div>

        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
