
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
import Auth from "./pages/Auth";

// Create QueryClient outside of components to avoid recreation on renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected route wrapper
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) {
    return null; // المكون الرئيسي سيعرض شاشة التحميل
  }
  
  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  // If logged in, render the child routes
  return <Outlet />;
};

// Auth route - redirects to dashboard if already logged in
const AuthRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null; // المكون الرئيسي سيعرض شاشة التحميل
  }
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  return <Auth />;
};

// App component with routing
const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthRoute />} />
    
    {/* Protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/technical-patterns" element={<TechnicalPatterns />} />
      <Route path="/candlestick-analysis" element={<CandlestickAnalysis />} />
      <Route path="/news-sentiment" element={<NewsSentiment />} />
      <Route path="/trading-journal" element={<TradingJournal />} />
      <Route path="/risk-calculator" element={<RiskCalculator />} />
      <Route path="/education" element={<Education />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// Fix: Create QueryClient instance separately from component rendering
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
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
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
