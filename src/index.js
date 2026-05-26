import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ZoomPauseProvider } from './config/zoomPauseContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ZoomPauseProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ZoomPauseProvider>
  </React.StrictMode>
);

reportWebVitals();