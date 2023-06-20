import React from 'react'

import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from './App'
import Admin from './routes/Admin'
import Dashboard from './routes/Dashboard'
import Leaderboard from './routes/Leaderboard'
import './style/index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="admin" element={<Admin />} />
      <Route path="leaderboard" element={<Leaderboard />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
)
