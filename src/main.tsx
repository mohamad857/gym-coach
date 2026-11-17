import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for true 100% offline gym caching
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('تحديث جديد متاح لكوتش الجيم');
  },
  onOfflineReady() {
    console.log('كوتش الجيم جاهز الآن للعمل 100% بدون إنترنت داخل الجيم!');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

