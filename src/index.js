import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Electron o apertura directa por archivo HTML (file://)
const isElectron =
  typeof navigator !== 'undefined' &&
  navigator.userAgent.toLowerCase().includes('electron');

const isFileProtocol =
  typeof window !== 'undefined' &&
  window.location.protocol === 'file:';

// Si se abre build/index.html directamente, se DEBE usar HashRouter
const Router = isElectron || isFileProtocol ? HashRouter : BrowserRouter;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

reportWebVitals();