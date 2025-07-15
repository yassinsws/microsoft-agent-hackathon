import React from 'react'
import { Property } from '../../contexts/PropertyContext'
import PropertyCard from './PropertyCard'

interface PropertyGridProps {
  properties: Property[]
  title?: string
  subtitle?: string
  variant?: 'grid' | 'list'
  columns?: 2 | 3 | 4
  showViewAll?: boolean
  viewAllText?: string
  onViewAll?: () => void
  onPropertyClick?: (property: Property) => void
  maxItems?: number
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  title,
  subtitle,
  variant = 'grid',
  columns = 3,
  showViewAll = false,
  viewAllText = 'View All Properties',
  onViewAll,
  onPropertyClick,
  maxItems
}) => {
  const displayProperties = maxItems ? properties.slice(0, maxItems) : properties

  const getGridColumns = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (displayProperties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏠</span>
        </div>
        <h3 className="text-xl font-semibold text-primary-900 mb-2">
          No Properties Found
        </h3>
        <p className="text-primary-600">
          Try adjusting your search criteria to find more properties.
        </p>
      </div>
    )
  }

  return (
    <div>
      {(title || subtitle) && (
        <div className="text-center mb-16">
          {title && (
            <h2 className="text-4xl font-bold text-primary-900 mb-4 heading-serif">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {variant === 'grid' ? (
        <div className={`grid ${getGridColumns()} gap-8`}>
          {displayProperties.map((property, index) => (
            <div 
              key={property.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PropertyCard
                property={property}
                onClick={() => onPropertyClick?.(property)}
                featured={index < 3} // Mark first 3 as featured
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayProperties.map((property, index) => (
            <div 
              key={property.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <PropertyCard
                property={property}
                variant="compact"
                onClick={() => onPropertyClick?.(property)}
              />
            </div>
          ))}
        </div>
      )}

      {showViewAll && onViewAll && (
        <div className="text-center mt-12">
          <button
            onClick={onViewAll}
            className="btn-outline btn-lg"
          >
            {viewAllText}
          </button>
        </div>
      )}
    </div>
  )
}

export default PropertyGrid 