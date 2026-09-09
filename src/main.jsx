import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/media.css';
import './styles/global.css';
import App from './App';

const root = document.getElementById('root');
document.documentElement.dataset.js = 'true';
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
