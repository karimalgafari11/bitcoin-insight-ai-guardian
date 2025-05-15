
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import TechnicalPatterns from "./pages/TechnicalPatterns";
import CandlestickAnalysis from "./pages/CandlestickAnalysis";
import NewsSentiment from "./pages/NewsSentiment";
import TradingJournal from "./pages/TradingJournal";
import RiskCalculator from "./pages/RiskCalculator";
import Education from "./pages/Education";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Create QueryClient outside of components to avoid recreation on renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// App routes without authentication check
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/analysis" element={<Analysis />} />
    <Route path="/technical-patterns" element={<TechnicalPatterns />} />
    <Route path="/candlestick-analysis" element={<CandlestickAnalysis />} />
    <Route path="/news-sentiment" element={<NewsSentiment />} />
    <Route path="/trading-journal" element={<TradingJournal />} />
    <Route path="/risk-calculator" element={<RiskCalculator />} />
    <Route path="/education" element={<Education />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// Fix: Create QueryClient instance separately from component rendering
const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <SidebarProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </SidebarProvider>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
