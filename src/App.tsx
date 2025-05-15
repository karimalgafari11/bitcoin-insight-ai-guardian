
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';

// Import your pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import TradingJournal from './pages/TradingJournal';
import NotFound from './pages/NotFound';
import Analysis from './pages/Analysis';
import NewsSentiment from './pages/NewsSentiment';
import RiskCalculator from './pages/RiskCalculator';
import Education from './pages/Education';
import CandlestickAnalysis from './pages/CandlestickAnalysis';
import TechnicalPatterns from './pages/TechnicalPatterns';

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/trading-journal" element={<TradingJournal />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/news-sentiment" element={<NewsSentiment />} />
        <Route path="/risk-calculator" element={<RiskCalculator />} />
        <Route path="/education" element={<Education />} />
        <Route path="/candlestick-analysis" element={<CandlestickAnalysis />} />
        <Route path="/technical-patterns" element={<TechnicalPatterns />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </SidebarProvider>
  );
}

export default App;
