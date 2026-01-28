import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/mobile/App';
import './src/mobile/mobile-styles.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
