import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Property } from '../../contexts/PropertyContext'
import { mockProperties } from '../../data/mockProperties'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Find property by ID
    const foundProperty = mockProperties.find(p => p.id === id)
    if (foundProperty) {
      setProperty(foundProperty)
    }
    setIsLoading(false)
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('€', '€ ')
  }

  const formatArea = (sqft: number) => {
    // Convert sqft to m² (1 sqft ≈ 0.092903 m²)
    const sqm = Math.round(sqft * 0.092903)
    return `${sqm} m²`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleContactAgent = () => {
    // In a real app, this would open a contact form or initiate contact
    console.log('Contact agent for property:', property?.id)
  }

  const handleScheduleViewing = () => {
    // In a real app, this would open a scheduling interface
    console.log('Schedule viewing for property:', property?.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/search-results')}>
            Back to Search Results
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Back Button */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <Link to="/search-results" className="text-primary-600 hover:text-primary-800 transition-colors">
              All Properties
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? property.images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === property.images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Property Type Badge */}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {property.details.type}
                </Badge>
              </div>
            </div>

            {/* Property Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 heading-serif">
                    {property.title}
            </h1>
                  <p className="text-gray-600 text-lg">
                    {property.location.address}
                  </p>
                  <p className="text-gray-500">
                    {property.location.neighborhood}, {property.location.city}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-900 mb-1">
                    {formatPrice(property.price)}
                  </div>
                  {property.pricePerSqft && (
            <p className="text-gray-600">
                      {formatPrice(property.pricePerSqft)} per m²
                    </p>
                  )}
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl mb-2">🛏️</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {property.details.bedrooms}
                  </div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🚿</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {property.details.bathrooms}
                  </div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📐</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {formatArea(property.details.sqft)}
                  </div>
                  <div className="text-sm text-gray-600">Living Space</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🚗</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {property.details.parking || 0}
                  </div>
                  <div className="text-sm text-gray-600">Parking</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {property.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-primary-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span className="text-gray-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium">{property.details.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Living Space:</span>
                      <span className="font-medium">{formatArea(property.details.sqft)}</span>
                    </div>
                    {property.details.lotSize && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lot Size:</span>
                        <span className="font-medium">{property.details.lotSize} m²</span>
                      </div>
                    )}
                    {property.details.yearBuilt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year Built:</span>
                        <span className="font-medium">{property.details.yearBuilt}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{property.details.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{property.details.bathrooms}</span>
                    </div>
                    {property.details.parking && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Parking Spaces:</span>
                        <span className="font-medium">{property.details.parking}</span>
                      </div>
                    )}
                    {property.listing?.daysOnMarket && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Days on Market:</span>
                        <span className="font-medium">{property.listing.daysOnMarket} days</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              {property.listing?.agent && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {property.listing.agent.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {property.listing.agent.company}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5a11.001 11.001 0 004.57 4.57l1.133-1.724a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{property.listing.agent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{property.listing.agent.email}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      className="w-full"
                      onClick={handleContactAgent}
                    >
                      Contact Agent
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleScheduleViewing}
                    >
                      Schedule Viewing
                    </Button>
                  </div>
                </div>
              )}

              {/* Listing Information */}
              {property.listing && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listed Date:</span>
                      <span className="font-medium">{formatDate(property.listing.datePosted)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days on Market:</span>
                      <span className="font-medium">{property.listing.daysOnMarket} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={property.listing.status === 'active' ? 'success' : 'secondary'}>
                        {property.listing.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-primary-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested in this property?</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Save to Favorites</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Share Property</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails 