import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Check if required environment variables are defined
if (!process.env.REACT_APP_API_KEY || !process.env.REACT_APP_API_BASE_URL) {
  throw new Error('Required environment variables are not defined. Please check your .env file');
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<div>Loading...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);
