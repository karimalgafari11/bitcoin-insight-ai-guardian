
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a root element and render the app
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

// Render using create root for React 18
root.render(<App />);
