import React, { useEffect, useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AppContextProvider, { AppContext } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import enTranslations from './i18n/en.json'
import amTranslations from './i18n/am.json'
import Home from './pages/Home'
import Search from './pages/Search'
import Pharmacies from './pages/Pharmacies'
import PharmacyDetail from './pages/PharmacyDetail'
import TeleConsult from './pages/TeleConsult'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import PharmacyDashboard from './pages/pharmacy/Dashboard'
import InventoryManager from './pages/pharmacy/InventoryManager'
import ProtectedRoute from './components/ProtectedRoute'
import NetworkStatus from './components/NetworkStatus'
import { createSkipLink } from './utils/a11y'
import TestAPI from './test-api'

// Simple translation function
const useTranslation = () => {
  const { language } = useContext(AppContext)
  
  const t = (key) => {
    const keys = key.split('.')
    let translation = language === 'en' ? enTranslations : amTranslations
    
    for (const k of keys) {
      translation = translation[k]
      if (!translation) return key
    }
    
    return translation
  }
  
  return { t, language }
}

const AppContent = () => {
  const { t } = useTranslation()

  useEffect(() => {
    // Create skip link for accessibility
    createSkipLink()
  }, [])

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:ring-2 focus:ring-primary">
          Skip to main content
        </a>
        <NetworkStatus />
        <Header />
        <main id="main-content" className="flex-grow" tabIndex="-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/pharmacies" element={<Pharmacies />} />
            <Route path="/pharmacy/:id" element={<PharmacyDetail />} />
            <Route path="/tele-consult" element={<TeleConsult />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/track/:id" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pharmacy/dashboard" element={<ProtectedRoute><PharmacyDashboard /></ProtectedRoute>} />
            <Route path="/pharmacy/inventory" element={<ProtectedRoute><InventoryManager /></ProtectedRoute>} />
            <Route path="/test-api" element={<TestAPI />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <AppContextProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppContextProvider>
  )
}

export default App