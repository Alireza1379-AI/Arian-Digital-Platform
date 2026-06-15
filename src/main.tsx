import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (!isLocal) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Arian Digital ServiceWorker registered successfully with scope: ', registration.scope);
        })
        .catch((error) => {
          console.warn('Arian Digital ServiceWorker registration failed: ', error);
        });
    });
  } else {
    // Register in dev mode too for simulation/inspection
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Arian Digital SW registered in Dev with scope: ', reg.scope))
      .catch((err) => console.warn('Dev SW active bypass: ', err));
  }
}

