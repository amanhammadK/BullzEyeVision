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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/analytics-dashboard" component={AnalyticsDashboard} />
      <Route path="/trading-interface" component={TradingInterface} />
      <Route path="/technical-analysis" component={TechnicalAnalysis} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
