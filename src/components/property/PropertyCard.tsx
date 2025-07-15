import React from 'react'
import { Property } from '../../contexts/PropertyContext'

interface PropertyCardProps {
  property: Property
  variant?: 'default' | 'featured' | 'compact'
  onClick?: () => void
  featured?: boolean
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  variant = 'default',
  onClick,
  featured = false
}) => {
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

  const getStatusBadge = () => {
    if (property.listing?.status === 'sold') {
      return (
        <span className="property-badge-sold">
          Sold
        </span>
      )
    }
    if (featured) {
      return (
        <span className="property-badge-new">
          Featured
        </span>
      )
    }
    return null
  }

  if (variant === 'compact') {
    return (
      <div 
        className="property-card group"
        onClick={onClick}
      >
        <div className="flex">
          <div className="relative w-32 h-24 flex-shrink-0">
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover rounded-l-xl"
            />
            {getStatusBadge() && (
              <div className="absolute top-2 left-2">
                {getStatusBadge()}
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <h3 className="font-semibold text-primary-900 mb-1 line-clamp-1">
              {property.title}
            </h3>
            <p className="location-text text-sm mb-2">
              {property.location.neighborhood}, {property.location.city}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary-900">
                {formatPrice(property.price)}
              </span>
              <span className="property-details">
                {formatArea(property.details.sqft)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="property-card group"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="property-image"
        />
        {getStatusBadge() && (
          <div className="absolute top-4 left-4">
            {getStatusBadge()}
          </div>
        )}
        
        {/* Property Type Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-primary-800 px-3 py-1 rounded-full text-xs font-medium">
            {property.details.type}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-primary-900 mb-2 leading-tight">
            {property.title}
          </h3>
          <p className="location-text">
            {property.location.address}
          </p>
          <p className="text-primary-500 text-sm">
            {property.location.neighborhood}, {property.location.city}
          </p>
        </div>

        <div className="mb-6">
          <div className="property-price mb-2">
            {formatPrice(property.price)}
          </div>
          {property.pricePerSqft && (
            <p className="text-sm text-primary-600">
              {formatPrice(property.pricePerSqft)} per m²
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-primary-500 uppercase tracking-wide font-medium mb-1">
              Plot
            </p>
            <p className="font-semibold text-primary-900">
              {property.details.lotSize ? `${property.details.lotSize} m²` : formatArea(property.details.sqft)}
            </p>
          </div>
          <div>
            <p className="text-xs text-primary-500 uppercase tracking-wide font-medium mb-1">
              Living Space
            </p>
            <p className="font-semibold text-primary-900">
              {formatArea(property.details.sqft)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-primary-600 mb-4">
          <span className="flex items-center space-x-1">
            <span>🛏️</span>
            <span>{property.details.bedrooms} bed</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>🚿</span>
            <span>{property.details.bathrooms} bath</span>
          </span>
          {property.details.parking && property.details.parking > 0 && (
            <span className="flex items-center space-x-1">
              <span>🚗</span>
              <span>{property.details.parking}</span>
            </span>
          )}
        </div>

        {property.features && property.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {property.features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="text-primary-500 text-xs px-2 py-1">
                  +{property.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {property.listing?.agent && (
          <div className="border-t border-primary-100 pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div>
                <p className="text-sm font-medium text-primary-900">
                  {property.listing.agent.name}
                </p>
                <p className="text-xs text-primary-600">
                  {property.listing.agent.company}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyCard 