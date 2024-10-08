import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import OnBoarding from './pages/OnBoarding.jsx'
import Dashboard from './pages/Dashboard.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Home />} />
        <Route path = '/onboarding' element = {<OnBoarding />} />
        <Route path = '/dashboard' element = {<Dashboard />} />
      </Routes>
    </BrowserRouter>
   
  </React.StrictMode>,
)
