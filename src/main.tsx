import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
) 