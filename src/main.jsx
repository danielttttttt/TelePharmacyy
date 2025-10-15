import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeModeScript } from "flowbite-react";
import App from './App'
import './index.css'

// Initialize mock service worker in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Initializing mock service worker...')
  const { worker } = await import('./mocks/browser')
  worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true  // Reduce console noise in development
  }).catch((error) => {
    console.error('Failed to start mock service worker:', error)
  })
} else {
  // In production, ensure we don't try to register MSW
  console.log('Production mode - skipping mock service worker initialization')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeScript />
    <App />
  </React.StrictMode>,
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeScript />
    <App />
  </React.StrictMode>,
)