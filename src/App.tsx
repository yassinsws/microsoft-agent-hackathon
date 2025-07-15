import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ChatProvider } from './contexts/ChatContext'
import { PropertyProvider } from './contexts/PropertyContext'
import { UserProvider } from './contexts/UserContext'

// Pages
import LandingPage from './pages/customer/LandingPage'
import SearchResults from './pages/customer/SearchResults'
import PropertyDetails from './pages/customer/PropertyDetails'
import SellerOnboarding from './pages/seller/SellerOnboarding'
import ListingCreation from './pages/seller/ListingCreation'
import SellerDashboard from './pages/seller/SellerDashboard'
import NotFound from './pages/shared/NotFound'

// Layout
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

function App() {
  return (
    <UserProvider>
      <ChatProvider>
        <PropertyProvider>
          <div className="App min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/search-results" element={<SearchResults />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                
                {/* Seller Routes */}
                <Route path="/seller/onboarding" element={<SellerOnboarding />} />
                <Route path="/seller/create-listing" element={<ListingCreation />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                
                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </PropertyProvider>
      </ChatProvider>
    </UserProvider>
  )
}

export default App 