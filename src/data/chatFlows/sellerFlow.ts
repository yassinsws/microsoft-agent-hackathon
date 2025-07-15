// Seller Chat Flow - Conversation patterns for helping sellers create listings

export interface SellerChatFlow {
  intent: string
  patterns: string[]
  responses: string[]
  quickReplies?: string[]
  followUp?: string
  actions?: string[]
  formFields?: string[]
  context?: any
}

export const sellerChatFlow: SellerChatFlow[] = [
  {
    intent: 'welcome',
    patterns: ['hello', 'hi', 'start', 'begin', 'sell'],
    responses: [
      "Welcome! I'm your AI listing assistant. I'll help you create a compelling property listing in just a few minutes. Let's start with the basics - what type of property are you selling?",
      "Hi there! I'm here to make selling your property easy. I'll guide you through creating a professional listing that attracts buyers. What kind of property are you listing?",
      "Hello! Ready to sell your property? I'll help you create an amazing listing that showcases your property's best features. What type of property is it?"
    ],
    quickReplies: [
      "Single-family house",
      "Condo/Apartment", 
      "Townhouse",
      "Commercial property"
    ],
    followUp: 'property_type'
  },

  {
    intent: 'property_type',
    patterns: ['house', 'condo', 'apartment', 'townhouse', 'commercial', 'land'],
    responses: [
      "Perfect! A {propertyType} can be a great investment. Now, where is your property located? Please provide the full address.",
      "Excellent! {propertyType} properties are in demand. What's the address of your property?",
      "Great choice! I'll help you showcase your {propertyType}. What's the complete address?"
    ],
    formFields: ['propertyType'],
    followUp: 'address'
  },

  {
    intent: 'address',
    patterns: ['address', 'location', 'street', 'avenue', 'drive', 'road'],
    responses: [
      "Got it! {address} sounds like a great location. Now tell me about the size - how many bedrooms and bathrooms does it have?",
      "Perfect! I've noted the address as {address}. How many bedrooms and bathrooms are in the property?",
      "Excellent! {address} is recorded. Let's talk about the layout - bedrooms and bathrooms?"
    ],
    quickReplies: [
      "1 bed, 1 bath",
      "2 bed, 2 bath",
      "3 bed, 2 bath", 
      "4+ bedrooms"
    ],
    formFields: ['address', 'city', 'state', 'zipCode'],
    followUp: 'room_details'
  },

  {
    intent: 'room_details',
    patterns: ['bedroom', 'bathroom', 'bed', 'bath', 'room'],
    responses: [
      "Great! {bedrooms} bedrooms and {bathrooms} bathrooms gives good space. What's the total square footage of the property?",
      "Perfect! That's a nice layout with {bedrooms} bedrooms and {bathrooms} bathrooms. How many square feet is the property?",
      "Excellent! {bedrooms} bed, {bathrooms} bath is a popular configuration. What's the square footage?"
    ],
    formFields: ['bedrooms', 'bathrooms'],
    followUp: 'square_footage'
  },

  {
    intent: 'square_footage',
    patterns: ['square feet', 'sqft', 'sq ft', 'footage', 'size'],
    responses: [
      "Perfect! {sqft} square feet is a great size. Now, what's your asking price for the property?",
      "Excellent! {sqft} sq ft offers good value. What price are you looking to list at?",
      "Great size at {sqft} square feet! What's your target selling price?"
    ],
    quickReplies: [
      "Under $500k",
      "$500k - $1M",
      "$1M - $2M",
      "Let me think about pricing"
    ],
    formFields: ['sqft'],
    followUp: 'pricing'
  },

  {
    intent: 'pricing',
    patterns: ['price', 'cost', '$', 'thousand', 'million', 'value'],
    responses: [
      "Excellent! ${price} is noted. Now let's make your listing shine - tell me about the key features and amenities that make your property special.",
      "Perfect price point at ${price}! Now, what are the standout features of your property that buyers will love?",
      "Great! ${price} is recorded. What unique features or recent updates should we highlight?"
    ],
    quickReplies: [
      "Updated kitchen",
      "Hardwood floors",
      "Private garden",
      "Parking included"
    ],
    formFields: ['price'],
    followUp: 'features'
  },

  {
    intent: 'features',
    patterns: ['kitchen', 'bathroom', 'floors', 'garden', 'parking', 'updated', 'renovated', 'new'],
    responses: [
      "Wonderful! {features} really add value. Tell me more about your property - what makes the neighborhood special? Any nearby amenities?",
      "Excellent features! {features} will definitely attract buyers. What about the neighborhood - what makes it special?",
      "Perfect! {features} are great selling points. What neighborhood amenities should buyers know about?"
    ],
    formFields: ['features'],
    followUp: 'neighborhood'
  },

  {
    intent: 'neighborhood',
    patterns: ['neighborhood', 'area', 'nearby', 'close', 'walking', 'schools', 'shopping', 'transit'],
    responses: [
      "Excellent! Those neighborhood features are fantastic. Now I need some photos - do you have high-quality photos of your property ready to upload?",
      "Perfect! {neighborhood} details will help buyers understand the lifestyle. Do you have professional photos of the property?",
      "Great neighborhood highlights! For the best listing, we'll need photos. Do you have quality images ready?"
    ],
    quickReplies: [
      "Yes, I have photos ready",
      "I need to take photos",
      "I want professional photos",
      "Skip photos for now"
    ],
    followUp: 'photos'
  },

  {
    intent: 'photos',
    patterns: ['photos', 'pictures', 'images', 'camera', 'professional'],
    responses: [
      "Perfect! Good photos make a huge difference. Finally, write a brief description of your property highlighting what makes it special for potential buyers.",
      "Excellent! Photos really showcase your property. Now, let's create a compelling description that will attract buyers. What makes your property unique?",
      "Great! Photos are crucial for attracting buyers. For the final touch, tell me what makes your property stand out in a few sentences."
    ],
    formFields: ['images'],
    followUp: 'description'
  },

  {
    intent: 'description',
    patterns: ['description', 'unique', 'special', 'standout', 'highlight'],
    responses: [
      "Fantastic! I have all the information needed. Let me create your professional listing now...",
      "Perfect! That's a compelling description. I'm now generating your complete property listing...",
      "Excellent! With all these details, I'll create an attractive listing that will draw in potential buyers..."
    ],
    actions: ['generate_listing', 'create_form'],
    formFields: ['description'],
    followUp: 'listing_generation'
  },

  {
    intent: 'listing_generation',
    patterns: [],
    responses: [
      "Amazing! I've created your professional listing with all the details. Please review the form on the right and let me know if you'd like to adjust anything.",
      "Perfect! Your listing is ready! I've filled out all the fields based on our conversation. Take a look and let me know if anything needs changing.",
      "Excellent! Your property listing has been generated. Review the details on the right side and we can make any adjustments needed."
    ],
    quickReplies: [
      "Looks perfect!",
      "Change the description",
      "Adjust the price",
      "Add more features"
    ],
    followUp: 'review_and_edit'
  },

  {
    intent: 'review_and_edit',
    patterns: ['change', 'edit', 'adjust', 'modify', 'update'],
    responses: [
      "No problem! I can help you refine any part of the listing. What would you like to change?",
      "Of course! Let's perfect your listing. Which section needs adjustment?",
      "Absolutely! I'm here to help get it exactly right. What needs to be modified?"
    ],
    quickReplies: [
      "The description",
      "Property features",
      "Pricing strategy",
      "Room details"
    ],
    followUp: 'specific_edits'
  },

  {
    intent: 'market_advice',
    patterns: ['market', 'price', 'competitive', 'sell fast', 'value'],
    responses: [
      "Great question! Based on similar properties in {neighborhood}, your pricing looks competitive. The key features that will help you sell quickly are {topFeatures}.",
      "Excellent point! Your property has strong market appeal because of {marketAdvantages}. I'd recommend highlighting {keyFeatures} in showings.",
      "Smart thinking! The current market favors properties with {marketFeatures}. Your listing already emphasizes these strengths."
    ],
    actions: ['provide_market_insights']
  },

  {
    intent: 'documentation',
    patterns: ['documents', 'paperwork', 'legal', 'disclosure', 'permits'],
    responses: [
      "Great question! For a smooth sale, you'll typically need: property deed, recent tax records, HOA documents (if applicable), and any disclosure forms required in your state.",
      "Excellent planning! Key documents include: title information, property tax records, utility bills, any warranties, and local disclosure requirements.",
      "Smart to think ahead! I recommend gathering: ownership documents, recent inspections, utility records, and checking your local disclosure requirements."
    ],
    quickReplies: [
      "I have most documents",
      "Need help with paperwork",
      "What about inspections?",
      "HOA requirements?"
    ]
  },

  {
    intent: 'timeline',
    patterns: ['timeline', 'how long', 'when', 'quickly', 'schedule'],
    responses: [
      "Great question! With a well-prepared listing like yours, you can typically expect: 1-2 weeks for market exposure, then showings and offers based on market conditions.",
      "Excellent planning! Timeline usually includes: immediate listing publication, 1-2 weeks for buyer interest, then negotiation and closing (30-45 days typical).",
      "Smart to plan ahead! Your listing is ready to go live immediately. Market response varies, but well-priced properties often see activity within the first week."
    ],
    quickReplies: [
      "List it immediately",
      "Wait for market timing",
      "Schedule showings first",
      "Get professional staging"
    ]
  }
]

// Seller-specific intent patterns
export const sellerIntentPatterns = {
  welcome: /^(hello|hi|start|begin|sell|list)/i,
  property_type: /(house|condo|apartment|townhouse|commercial|land|property)/i,
  address: /(address|location|street|avenue|drive|road|where)/i,
  room_details: /(bedroom|bathroom|bed|bath|room|br|ba)/i,
  square_footage: /(square feet|sqft|sq ft|footage|size|big)/i,
  pricing: /(price|cost|\$|thousand|million|value|worth)/i,
  features: /(kitchen|bathroom|floors|garden|parking|updated|renovated|new|feature)/i,
  neighborhood: /(neighborhood|area|nearby|close|walking|schools|shopping|transit)/i,
  photos: /(photos|pictures|images|camera|professional)/i,
  description: /(description|unique|special|standout|highlight|tell|about)/i,
  market_advice: /(market|competitive|sell fast|value|advice|tips)/i,
  documentation: /(documents|paperwork|legal|disclosure|permits)/i,
  timeline: /(timeline|how long|when|quickly|schedule)/i,
}

// Form field mapping for dynamic form generation
export const formFieldMapping = {
  propertyType: 'Property Type',
  address: 'Street Address',
  city: 'City',
  state: 'State',
  zipCode: 'ZIP Code',
  bedrooms: 'Bedrooms',
  bathrooms: 'Bathrooms',
  sqft: 'Square Footage',
  price: 'Listing Price',
  features: 'Key Features',
  description: 'Property Description',
  images: 'Property Photos',
  lotSize: 'Lot Size',
  yearBuilt: 'Year Built',
  parking: 'Parking Spaces',
  propertyTax: 'Annual Property Tax',
  hoaFees: 'HOA Fees',
  utilities: 'Included Utilities'
}

// Quick reply options for sellers
export const sellerQuickReplies = {
  propertyTypes: [
    "Single-family house",
    "Condo/Apartment",
    "Townhouse", 
    "Commercial property"
  ],
  roomConfigurations: [
    "1 bed, 1 bath",
    "2 bed, 2 bath",
    "3 bed, 2 bath",
    "4+ bedrooms"
  ],
  priceRanges: [
    "Under $500k",
    "$500k - $1M", 
    "$1M - $2M",
    "Let me think about pricing"
  ],
  commonFeatures: [
    "Updated kitchen",
    "Hardwood floors",
    "Private garden",
    "Parking included"
  ],
  photoStatus: [
    "Yes, I have photos ready",
    "I need to take photos",
    "I want professional photos", 
    "Skip photos for now"
  ],
  listingActions: [
    "Looks perfect!",
    "Change the description",
    "Adjust the price",
    "Add more features"
  ]
}

export default sellerChatFlow 