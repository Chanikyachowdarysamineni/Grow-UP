import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Comprehensive ResizeObserver error suppression
// This is a harmless error caused by react-split and Monaco Editor's automatic layout

// Method 1: Suppress console errors
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ResizeObserver') || 
     args[0].includes('ResizeObserver loop completed with undelivered notifications'))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

// Method 2: Catch and suppress window errors
window.addEventListener('error', (event) => {
  if (
    event.message &&
    event.message.includes('ResizeObserver')
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});

// Method 3: Wrap ResizeObserver to debounce
const OriginalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    super((entries, observer) => {
      requestAnimationFrame(() => {
        callback(entries, observer);
      });
    });
  }
} as any;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);