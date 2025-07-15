// API Service for Real Estate Application

const API_BASE_URL = 'http://localhost:8000'

// Types for API requests and responses
export interface PropertyImageUpload {
  images: string[]
  description: string
  user_prompt?: string
}

export interface PropertyUploadResponse {
  property_id: string
  status: string
  message: string
}

export interface PropertyLocation {
  address: string
  city: string
  state: string
  zipCode: string
  neighborhood?: string
  coordinates?: { lat: number; lng: number }
}

export interface PropertyDetails {
  bedrooms: number
  bathrooms: number
  sqft: number
  type: string
  yearBuilt?: number
  parking?: number
  lotSize?: number
}

export interface PropertyListing {
  datePosted: string
  daysOnMarket: number
  status: string
  agent: {
    name: string
    company: string
    phone: string
    email: string
  }
}

export interface PricingAnalysis {
  market_position: 'competitive' | 'below_market' | 'above_market'
  confidence: number
  price_difference_percentage: number
  comparable_properties: {
    avg_price: number
    min_price: number
    max_price: number
    sample_size: number
  }
  recommendations: string[]
  market_insights: string[]
}

export interface AIGeneratedProperty {
  id: string
  title: string
  price: number
  pricePerSqft?: number
  location: PropertyLocation
  details: PropertyDetails
  images: string[]
  features: string[]
  description: string
  listing: PropertyListing
  confidence_score: number
  ai_suggestions: string[]
  pricing_analysis: PricingAnalysis
}

export interface PropertyGenerationResponse {
  property: AIGeneratedProperty
  processing_time: number
  recommendations: string[]
}

export interface PropertyStatus {
  property_id: string
  status: string
  uploaded_at: string
  images_count: number
  description_length: number
  processed: boolean
}

// API Error class
export class APIError extends Error {
  status: number
  detail: string

  constructor(message: string, status: number, detail: string) {
    super(message)
    this.status = status
    this.detail = detail
    this.name = 'APIError'
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new APIError(
      `API Error: ${response.status}`,
      response.status,
      errorData.detail || errorData.message || 'Unknown error'
    )
  }
  return response.json()
}

// Mock data for development when backend is not available
const MOCK_PROPERTIES: AIGeneratedProperty[] = [
  {
    id: 'mock-1',
    title: 'Beautiful Modern Villa with Garden',
    price: 1200000,
    pricePerSqft: 428,
    location: {
      address: 'Musterstraße 123, Munich',
      city: 'Munich',
      state: 'Bavaria',
      zipCode: '80331',
      neighborhood: 'Bogenhausen',
      coordinates: { lat: 48.1351, lng: 11.5820 }
    },
    details: {
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      type: 'Villa',
      yearBuilt: 2020,
      parking: 2,
      lotSize: 800
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
    ],
    features: ['Garden', 'Garage', 'Modern Kitchen', 'Fireplace', 'Terrace', 'High Ceilings'],
    description: 'This stunning modern villa offers luxurious living with an open-plan design, high-end finishes, and a beautiful private garden. Perfect for families seeking comfort and elegance.',
    listing: {
      datePosted: new Date().toISOString(),
      daysOnMarket: 0,
      status: 'active',
      agent: {
        name: 'AI Generated Agent',
        company: 'Real Estate AI',
        phone: '+49 89 123456789',
        email: 'agent@realestate-ai.com'
      }
    },
    confidence_score: 0.95,
    ai_suggestions: [
      'Consider highlighting the modern kitchen features',
      'Add information about nearby schools and transport',
      'Professional photography recommended for better presentation'
    ],
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
        'Similar 4-bedroom villas in Bogenhausen sell for €980K-€1.35M',
        'Your property is priced 2.5% above market average',
        'Premium features like modern kitchen justify the price point',
        'Properties in this neighborhood typically sell within 45 days'
      ]
    }
  }
]

// API Service Class
export class PropertyAPI {
  private baseURL: string
  private useMockData: boolean

  constructor(baseURL: string = API_BASE_URL, useMockData: boolean = false) {
    this.baseURL = baseURL
    this.useMockData = useMockData
  }

  /**
   * Upload property images and description
   */
  async uploadProperty(data: PropertyImageUpload): Promise<PropertyUploadResponse> {
    if (this.useMockData) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        property_id: `mock-${Date.now()}`,
        status: 'uploaded',
        message: 'Images and description uploaded successfully (mock data).'
      }
    }

    try {
      const response = await fetch(`${this.baseURL}/api/property/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      return handleResponse<PropertyUploadResponse>(response)
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      // Fallback to mock data if backend is not available
      console.warn('Backend not available, using mock data:', error)
      return this.uploadProperty(data) // Retry with mock data
    }
  }

  /**
   * Generate AI property listing from uploaded data
   */
  async generatePropertyListing(propertyId: string): Promise<PropertyGenerationResponse> {
    if (this.useMockData || propertyId.startsWith('mock-')) {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockProperty = MOCK_PROPERTIES[0]
      return {
        property: { ...mockProperty, id: propertyId },
        processing_time: 2.1,
        recommendations: [
          'Your property has been successfully analyzed (mock)',
          'Price estimation based on similar properties in the area',
          'Consider adding more exterior photos for better appeal',
          'Ready to publish with current information'
        ]
      }
    }

    try {
      const response = await fetch(`${this.baseURL}/api/property/generate/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      return handleResponse<PropertyGenerationResponse>(response)
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      // Fallback to mock data if backend is not available
      console.warn('Backend not available, using mock data:', error)
      this.useMockData = true
      return this.generatePropertyListing(propertyId)
    }
  }

  /**
   * Get property upload status
   */
  async getPropertyStatus(propertyId: string): Promise<PropertyStatus> {
    if (this.useMockData || propertyId.startsWith('mock-')) {
      return {
        property_id: propertyId,
        status: 'processed',
        uploaded_at: new Date().toISOString(),
        images_count: 3,
        description_length: 150,
        processed: true
      }
    }

    try {
      const response = await fetch(`${this.baseURL}/api/property/status/${propertyId}`)
      return handleResponse<PropertyStatus>(response)
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      // Fallback to mock data if backend is not available
      console.warn('Backend not available, using mock data:', error)
      this.useMockData = true
      return this.getPropertyStatus(propertyId)
    }
  }

  /**
   * List all properties (for development)
   */
  async listAllProperties(): Promise<{ properties: any[]; total: number }> {
    if (this.useMockData) {
      return {
        properties: [
          {
            property_id: 'mock-1',
            status: 'processed',
            uploaded_at: new Date().toISOString()
          }
        ],
        total: 1
      }
    }

    try {
      const response = await fetch(`${this.baseURL}/api/property/list`)
      return handleResponse<{ properties: any[]; total: number }>(response)
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      // Fallback to mock data if backend is not available
      console.warn('Backend not available, using mock data:', error)
      this.useMockData = true
      return this.listAllProperties()
    }
  }

  /**
   * Convert file to base64 for API upload
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  /**
   * Validate image files
   */
  static validateImageFiles(files: FileList): string[] {
    const errors: string[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

    if (files.length === 0) {
      errors.push('At least one image is required')
      return errors
    }

    if (files.length > 10) {
      errors.push('Maximum 10 images allowed')
    }

    Array.from(files).forEach((file, index) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`Image ${index + 1}: Only JPEG, PNG, and WebP images are allowed`)
      }
      if (file.size > maxSize) {
        errors.push(`Image ${index + 1}: File size must be less than 10MB`)
      }
    })

    return errors
  }
}

// Export a default instance
export const propertyAPI = new PropertyAPI()

// Export with mock data enabled for development
export const mockPropertyAPI = new PropertyAPI(API_BASE_URL, true) 