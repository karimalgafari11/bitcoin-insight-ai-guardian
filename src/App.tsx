
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
import TradingEntryForm from "./pages/journal/TradingEntryForm";
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
  
  // استخدام معالج أفضل للتحميل لتجنب الوميض
  if (loading) {
    return null; // سيتم التعامل مع حالة التحميل في مكون AuthProvider
  }
  
  // إعادة التوجيه إلى صفحة المصادقة إذا لم يكن المستخدم مسجل الدخول
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // إذا كان المستخدم مسجل الدخول، قم بعرض المسارات الفرعية
  return <Outlet />;
};

// مسار المصادقة - إعادة التوجيه إلى لوحة التحكم إذا كان المستخدم مسجل الدخول بالفعل
const AuthRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null; // سيتم التعامل مع حالة التحميل في مكون AuthProvider
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <Auth />;
};

// مكون المسارات مع التوجيه
const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthRoute />} />
    
    {/* المسارات المحمية */}
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/technical-patterns" element={<TechnicalPatterns />} />
      <Route path="/candlestick-analysis" element={<CandlestickAnalysis />} />
      <Route path="/news-sentiment" element={<NewsSentiment />} />
      <Route path="/trading-journal" element={<TradingJournal />} />
      <Route path="/trading-journal/new" element={<TradingEntryForm />} />
      <Route path="/trading-journal/edit/:id" element={<TradingEntryForm />} />
      <Route path="/risk-calculator" element={<RiskCalculator />} />
      <Route path="/education" element={<Education />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// التطبيق الرئيسي
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
