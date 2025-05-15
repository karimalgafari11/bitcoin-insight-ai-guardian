
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { WatchlistProvider } from './contexts/WatchlistContext'
import { BrowserRouter as Router } from 'react-router-dom'

// Create a root element and render the app
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

// Render using create root for React 18, ensuring proper provider hierarchy
root.render(
  <LanguageProvider>
    <Router>
      <AuthProvider>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </AuthProvider>
    </Router>
  </LanguageProvider>
);
