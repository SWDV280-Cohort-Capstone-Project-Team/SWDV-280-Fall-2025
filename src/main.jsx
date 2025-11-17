import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import './index.css'
import App from './App.jsx'

// Configure Amplify with the generated outputs
// This file is generated when you run: npm run amplify:sandbox
try {
  const outputs = await import('../amplify_outputs.json');
  Amplify.configure(outputs.default || outputs);
} catch (error) {
  console.warn(
    'amplify_outputs.json not found. Please run "npm run amplify:sandbox" to start local development.',
    error
  );
  // You can optionally configure with empty object or skip configuration
  // Amplify.configure({});
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
