import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/FacialExpression.jsx'
import './components/MoodSongs.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)
