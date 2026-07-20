import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css' // Global tokens imported ONCE
import 'lenis/dist/lenis.css'

// StrictMode intentionally double-runs effects in dev, which made the
// intro sequence play twice on every load — render the app directly.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)