import { Property } from '../contexts/PropertyContext'

export const mockProperties: Property[] = [
  {
    id: 'prop-001',
    title: 'Modern Downtown Loft with City Views',
    price: 850000,
    pricePerSqft: 680,
    location: {
      address: '123 Main Street, Unit 4B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      neighborhood: 'SOMA'
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1250,
      type: 'Condo',
      yearBuilt: 2018,
      parking: 1,
      lotSize: 0
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ],
    features: [
      'Hardwood Floors',
      'In-unit Laundry',
      'City Views',
      'Modern Kitchen',
      'Balcony',
      'Gym Access',
      'Rooftop Terrace',
      'Pet Friendly'
    ],
    description: 'Stunning modern loft in the heart of downtown with breathtaking city views. Features include hardwood floors throughout, a gourmet kitchen with stainless steel appliances, and a private balcony. Building amenities include a fitness center and rooftop terrace.',
    matchScore: 94,
    aiRanking: {
      factors: [
        'Location matches downtown preference',
        'Modern style as requested',
        'Within budget range',
        'Good size for 2-person household'
      ]
    },
    listing: {
      datePosted: '2024-01-15',
      daysOnMarket: 5,
      status: 'Active',
      agent: {
        name: 'Sarah Johnson',
        company: 'Metro Realty',
        phone: '(555) 123-4567',
        email: 'sarah@metrorealty.com'
      }
    }
  },
  {
    id: 'prop-002',
    title: 'Charming Victorian Family Home',
    price: 1200000,
    pricePerSqft: 520,
    location: {
      address: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94117',
      coordinates: { lat: 37.7699, lng: -122.4479 },
      neighborhood: 'Haight-Ashbury'
    },
    details: {
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2300,
      type: 'House',
      yearBuilt: 1905,
      parking: 2,
      lotSize: 3500
    },
    images: [
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800'
    ],
    features: [
      'Original Details',
      'Renovated Kitchen',
      'Private Garden',
      'Fireplace',
      'High Ceilings',
      'Period Features',
      'Near Schools',
      'Quiet Street'
    ],
    description: 'Beautiful Victorian home with original period features and modern updates. Spacious family living with a large private garden. Located in a quiet residential area near excellent schools.',
    matchScore: 88,
    aiRanking: {
      factors: [
        'Perfect for families',
        'Great neighborhood for children',
        'Plenty of space',
        'Historic charm maintained'
      ]
    },
    listing: {
      datePosted: '2024-01-10',
      daysOnMarket: 10,
      status: 'Active',
      agent: {
        name: 'Michael Chen',
        company: 'Heritage Properties',
        phone: '(555) 234-5678',
        email: 'michael@heritageproperties.com'
      }
    }
  },
  {
    id: 'prop-003',
    title: 'Luxury Waterfront Penthouse',
    price: 2500000,
    pricePerSqft: 1250,
    location: {
      address: '789 Bay Shore Drive, PH',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94158',
      coordinates: { lat: 37.7575, lng: -122.3774 },
      neighborhood: 'Mission Bay'
    },
    details: {
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2000,
      type: 'Condo',
      yearBuilt: 2020,
      parking: 2,
      lotSize: 0
    },
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'
    ],
    features: [
      'Waterfront Views',
      'Floor-to-Ceiling Windows',
      'Private Terrace',
      'Concierge Service',
      'Wine Storage',
      'Smart Home',
      'Spa Access',
      'Valet Parking'
    ],
    description: 'Exceptional penthouse with panoramic water views and luxury finishes throughout. Features include a private terrace, smart home technology, and access to world-class building amenities.',
    matchScore: 92,
    aiRanking: {
      factors: [
        'Luxury features as requested',
        'Stunning water views',
        'Brand new construction',
        'Premium location'
      ]
    },
    listing: {
      datePosted: '2024-01-20',
      daysOnMarket: 1,
      status: 'Active',
      agent: {
        name: 'Emma Rodriguez',
        company: 'Luxury Bay Realty',
        phone: '(555) 345-6789',
        email: 'emma@luxurybayrealty.com'
      }
    }
  },
  {
    id: 'prop-004',
    title: 'Cozy Studio in Arts District',
    price: 425000,
    pricePerSqft: 850,
    location: {
      address: '321 Gallery Street, Unit 2A',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94110',
      coordinates: { lat: 37.7483, lng: -122.4154 },
      neighborhood: 'Mission District'
    },
    details: {
      bedrooms: 1,
      bathrooms: 1,
      sqft: 500,
      type: 'Condo',
      yearBuilt: 2015,
      parking: 0,
      lotSize: 0
    },
    images: [
      'https://images.unsplash.com/photo-1600566752734-42fa46ff2a8c?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      'https://images.unsplash.com/photo-1600566752429-77d0c9cdbf59?w=800'
    ],
    features: [
      'Open Floor Plan',
      'High Ceilings',
      'Exposed Brick',
      'Modern Kitchen',
      'Near Transit',
      'Arts Scene',
      'Restaurants Nearby',
      'Bike Storage'
    ],
    description: 'Charming studio in the vibrant Arts District with exposed brick and high ceilings. Perfect for young professionals or investors. Walking distance to galleries, restaurants, and public transit.',
    matchScore: 78,
    aiRanking: {
      factors: [
        'Affordable starter home',
        'Great neighborhood character',
        'Good investment potential',
        'Close to amenities'
      ]
    },
    listing: {
      datePosted: '2024-01-08',
      daysOnMarket: 13,
      status: 'Active',
      agent: {
        name: 'David Park',
        company: 'Urban Living Realty',
        phone: '(555) 456-7890',
        email: 'david@urbanliving.com'
      }
    }
  },
  {
    id: 'prop-005',
    title: 'Suburban Family Haven',
    price: 950000,
    pricePerSqft: 475,
    location: {
      address: '654 Maple Grove Lane',
      city: 'Palo Alto',
      state: 'CA',
      zipCode: '94301',
      coordinates: { lat: 37.4419, lng: -122.1430 },
      neighborhood: 'Professorville'
    },
    details: {
      bedrooms: 4,
      bathrooms: 2,
      sqft: 2000,
      type: 'House',
      yearBuilt: 1985,
      parking: 2,
      lotSize: 6000
    },
    images: [
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'
    ],
    features: [
      'Large Backyard',
      'Updated Kitchen',
      'Family Room',
      'Two-Car Garage',
      'Near Schools',
      'Quiet Neighborhood',
      'Swimming Pool',
      'Fruit Trees'
    ],
    description: 'Perfect family home in excellent school district with large backyard and swimming pool. Recent kitchen updates and plenty of space for growing families. Quiet cul-de-sac location.',
    matchScore: 85,
    aiRanking: {
      factors: [
        'Excellent for families',
        'Top-rated schools nearby',
        'Large outdoor space',
        'Safe neighborhood'
      ]
    },
    listing: {
      datePosted: '2024-01-12',
      daysOnMarket: 9,
      status: 'Active',
      agent: {
        name: 'Jennifer Liu',
        company: 'Peninsula Family Homes',
        phone: '(555) 567-8901',
        email: 'jennifer@peninsula-homes.com'
      }
    }
  },
  {
    id: 'prop-006',
    title: 'Modern Townhouse with Tech Amenities',
    price: 1350000,
    pricePerSqft: 675,
    location: {
      address: '987 Innovation Way',
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94041',
      coordinates: { lat: 37.3861, lng: -122.0839 },
      neighborhood: 'Whisman School'
    },
    details: {
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2000,
      type: 'Townhouse',
      yearBuilt: 2019,
      parking: 2,
      lotSize: 1500
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ],
    features: [
      'Smart Home Technology',
      'Solar Panels',
      'Electric Car Charging',
      'Open Floor Plan',
      'Modern Appliances',
      'Near Tech Companies',
      'Public Transit Access',
      'Energy Efficient'
    ],
    description: 'Contemporary townhouse with cutting-edge smart home technology and sustainable features. Perfect for tech professionals with easy access to major companies and public transportation.',
    matchScore: 90,
    aiRanking: {
      factors: [
        'Perfect for tech workers',
        'Modern smart features',
        'Sustainable living',
        'Great commute options'
      ]
    },
    listing: {
      datePosted: '2024-01-18',
      daysOnMarket: 3,
      status: 'Active',
      agent: {
        name: 'Alex Kumar',
        company: 'Silicon Valley Properties',
        phone: '(555) 678-9012',
        email: 'alex@svproperties.com'
      }
    }
  }
]

// Function to get properties by criteria
export const getPropertiesByCriteria = (criteria: any): Property[] => {
  let filtered = [...mockProperties]
  
  // Filter by budget
  if (criteria.budget) {
    filtered = filtered.filter(property => 
      property.price >= (criteria.budget.min || 0) && 
      property.price <= (criteria.budget.max || Infinity)
    )
  }
  
  // Filter by bedrooms
  if (criteria.bedrooms) {
    filtered = filtered.filter(property => 
      property.details.bedrooms >= criteria.bedrooms
    )
  }
  
  // Filter by property type
  if (criteria.propertyType) {
    filtered = filtered.filter(property => 
      property.details.type.toLowerCase() === criteria.propertyType.toLowerCase()
    )
  }
  
  // Filter by location
  if (criteria.location) {
    const location = criteria.location.toLowerCase()
    filtered = filtered.filter(property => 
      property.location.city.toLowerCase().includes(location) ||
      property.location.neighborhood?.toLowerCase().includes(location) ||
      property.location.address.toLowerCase().includes(location)
    )
  }
  
  // Sort by match score
  return filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
}

// Function to search properties
export const searchProperties = (query: string): Property[] => {
  const searchTerms = query.toLowerCase().split(' ')
  
  return mockProperties.filter(property => {
    const searchableText = [
      property.title,
      property.description,
      property.location.city,
      property.location.neighborhood,
      property.details.type,
      ...property.features || []
    ].join(' ').toLowerCase()
    
    return searchTerms.some(term => searchableText.includes(term))
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
}

export default mockProperties 