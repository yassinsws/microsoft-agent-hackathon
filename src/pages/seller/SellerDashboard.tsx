import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { mockPropertyAPI, AIGeneratedProperty } from '../../services/api'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const SellerDashboard: React.FC = () => {
  const [listings, setListings] = useState<AIGeneratedProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    inquiries: 0
  })

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data for demonstration
      const mockListings: AIGeneratedProperty[] = [
        {
          id: 'listing-1',
          title: 'Beautiful Modern Villa with Garden',
          price: 1200000,
          pricePerSqft: 428,
          location: {
            address: 'Musterstraße 123, Munich',
            city: 'Munich',
            state: 'Bavaria',
            zipCode: '80331',
            neighborhood: 'Bogenhausen'
          },
          details: {
            bedrooms: 4,
            bathrooms: 3,
            sqft: 2800,
            type: 'Villa'
          },
          images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'],
          features: ['Garden', 'Garage', 'Modern Kitchen'],
          description: 'Beautiful modern villa...',
          listing: {
            datePosted: new Date().toISOString(),
            daysOnMarket: 5,
            status: 'active',
            agent: {
              name: 'AI Agent',
              company: 'Real Estate AI',
              phone: '+49 89 123456789',
              email: 'agent@realestate-ai.com'
            }
          },
          confidence_score: 0.95,
          ai_suggestions: [],
          pricing_analysis: {
            market_position: 'competitive',
            confidence: 0.88,
            price_difference_percentage: 2.5,
            comparable_properties: {
              avg_price: 1170000,
              min_price: 980000,
              max_price: 1350000,
              sample_size: 12
            },
            recommendations: [
              'Your asking price is competitive for this area',
              'Consider highlighting premium features to justify the price',
              'Market data shows strong demand for similar properties'
            ],
            market_insights: [
              'Similar properties in Bogenhausen sell for €980K-€1.35M',
              'Your property is priced 2.5% above market average',
              'Premium features like modern kitchen justify the price point'
            ]
          }
        }
      ]
      
      setListings(mockListings)
      setStats({
        totalListings: mockListings.length,
        activeListings: mockListings.filter(l => l.listing.status === 'active').length,
        totalViews: 127,
        inquiries: 8
      })
      
      setIsLoading(false)
    }

    loadDashboardData()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('€', '€ ')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your property listings and view performance</p>
          </div>
          <Link to="/seller/onboarding">
            <Button size="lg">
              + Create New Listing
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🏠</div>
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeListings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👀</div>
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalViews}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📧</div>
              <div>
                <p className="text-sm text-gray-600">Inquiries</p>
                <p className="text-2xl font-bold text-purple-600">{stats.inquiries}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Property Listings</h2>
          </div>
          
          {listings.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
              <p className="text-gray-600 mb-6">Create your first property listing to get started</p>
              <Link to="/seller/onboarding">
                <Button>Create Your First Listing</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listed Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days on Market
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={listing.images[0]}
                              alt={listing.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {listing.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {listing.location.neighborhood}, {listing.location.city}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(listing.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={listing.listing.status === 'active' ? 'success' : 'secondary'}
                        >
                          {listing.listing.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(listing.listing.datePosted)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {listing.listing.daysOnMarket} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Link 
                            to={`/property/${listing.id}`}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            View
                          </Link>
                          <button className="text-gray-600 hover:text-gray-800">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Start</h3>
            <p className="text-gray-600 mb-4">Get your property listed in minutes with AI assistance</p>
            <Link to="/seller/onboarding">
              <Button variant="outline" className="w-full">Create Listing</Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Analytics</h3>
            <p className="text-gray-600 mb-4">View detailed performance metrics for your listings</p>
            <Button variant="outline" className="w-full" disabled>
              View Analytics
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💬 Messages</h3>
            <p className="text-gray-600 mb-4">Respond to inquiries from potential buyers</p>
            <Button variant="outline" className="w-full" disabled>
              Check Messages
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard 