import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropertyGrid from '../../components/property/PropertyGrid'
import SearchBar from '../../components/search/SearchBar'
import { mockProperties } from '../../data/mockProperties'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  
  // Use first 3 properties for featured showcase
  const featuredProperties = mockProperties.slice(0, 3)

  const handlePropertyClick = (property: any) => {
    // Navigate to property details
    navigate(`/property/${property.id}`)
  }

  const handleViewAllProperties = () => {
    // Navigate to search results
    navigate('/search-results')
  }

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
    // This will be handled by the SearchBar component's default navigation
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title mb-8 animate-fade-in-up heading-serif">
              Find Your Perfect Home with Expert Guidance
            </h1>
            <p className="hero-subtitle mb-12 animate-fade-in-up max-w-3xl mx-auto">
              Experience personalized property search with our AI-powered assistant. 
              From luxury villas to contemporary apartments, discover properties 
              that match your lifestyle and investment goals.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 animate-fade-in-up group">
              <SearchBar 
                size="xl"
                placeholder="Tell me what kind of property you're looking for..."
                onSearch={handleSearch}
              />
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-primary-300"></div>
                <span className="text-primary-500 text-sm">or</span>
                <div className="h-px w-12 bg-primary-300"></div>
              </div>
              <Link to="/seller/onboarding" className="btn-outline btn-lg">
                Rent or Sell
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Property Showcase Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <PropertyGrid
            properties={featuredProperties}
            title="Featured Properties"
            subtitle="Discover exceptional properties in prime locations"
            columns={3}
            showViewAll={true}
            viewAllText="View All Properties"
            onViewAll={handleViewAllProperties}
            onPropertyClick={handlePropertyClick}
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4 heading-serif">
              Why Choose Our Service
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Professional guidance and cutting-edge technology for your real estate journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.id} 
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-refined">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Agent */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="agent-card">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  Expert Real Estate Guidance
                </h3>
                <p className="text-primary-600 mb-1">Licensed Real Estate Professional</p>
                <p className="text-primary-600 text-sm mb-4">
                  Real Estate Economist | Market Specialist
                </p>
                <p className="text-refined mb-4">
                  Get professional advice tailored to your needs. Whether you're buying your first home 
                  or investing in premium properties, our expertise ensures you make informed decisions.
                </p>
                <div className="flex items-center space-x-4">
                  <button className="btn-primary btn-sm">
                    Get Consultation
                  </button>
                  <a href="mailto:expert@realestate-ai.com" className="text-primary-600 hover:text-primary-800 text-sm">
                    expert@realestate-ai.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary-900 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 heading-serif">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl text-primary-200 mb-8">
              Start your personalized property search today with our intelligent matching system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search-results" className="btn-gold btn-lg">
                Start Your Search
              </Link>
              <Link to="/seller/onboarding" className="btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-900">
                Rent or Sell
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Features data
const features = [
  {
    id: 1,
    icon: "🤖",
    title: "AI-Powered Matching",
    description: "Our intelligent system learns your preferences and finds properties that perfectly match your criteria and lifestyle needs."
  },
  {
    id: 2,
    icon: "📊",
    title: "Market Expertise",
    description: "Access comprehensive market analysis, pricing trends, and investment insights to make informed real estate decisions."
  },
  {
    id: 3,
    icon: "🏆",
    title: "Premium Service",
    description: "Experience white-glove service with dedicated support throughout your buying or selling journey."
  }
]

export default LandingPage 