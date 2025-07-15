import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import { clsx } from 'clsx'

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  const navigationItems = [
    { name: 'Properties', path: '/search-results' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const handleGetStarted = () => {
    if (location.pathname.includes('seller')) {
      navigate('/seller/onboarding')
    } else {
      navigate('/')
    }
  }

  return (
    <header className="bg-white border-b border-primary-100 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary-900 leading-none heading-serif">
                RealEstate
              </span>
              <span className="text-xs text-primary-600 tracking-widest uppercase leading-none">
                Premium Properties
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200 hover:text-primary-900 relative py-2',
                  isActive(item.path)
                    ? 'text-primary-900'
                    : 'text-primary-600'
                )}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-900 rounded-full" />
                )}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/seller/onboarding" className="text-sm text-primary-600 hover:text-primary-900 font-medium transition-colors">
              Sell
            </Link>
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-primary-600 hover:text-primary-900 hover:bg-primary-50 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-primary-100 py-6 space-y-4 animate-slide-down">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  'block text-base font-medium transition-colors duration-200 py-2',
                  isActive(item.path)
                    ? 'text-primary-900'
                    : 'text-primary-600 hover:text-primary-900'
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-primary-100 space-y-3">
              <Link 
                to="/seller/onboarding" 
                className="block text-sm text-primary-600 hover:text-primary-900 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rent or Sell
              </Link>
              <Button variant="ghost" fullWidth>
                Sign In
              </Button>
              <Button 
                variant="primary" 
                fullWidth
                onClick={() => {
                  handleGetStarted()
                  setIsMobileMenuOpen(false)
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 