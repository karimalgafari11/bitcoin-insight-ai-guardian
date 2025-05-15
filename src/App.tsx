
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { WatchlistProvider } from './contexts/WatchlistContext';

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
    <LanguageProvider>
      <AuthProvider>
        <WatchlistProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/journal" element={<TradingJournal />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/news" element={<NewsSentiment />} />
              <Route path="/risk-calculator" element={<RiskCalculator />} />
              <Route path="/education" element={<Education />} />
              <Route path="/candlestick" element={<CandlestickAnalysis />} />
              <Route path="/patterns" element={<TechnicalPatterns />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </WatchlistProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
