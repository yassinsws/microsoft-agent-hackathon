// Customer Chat Flow - Conversation patterns and responses for property searching

export interface ChatFlow {
  intent: string
  patterns: string[]
  responses: string[]
  quickReplies?: string[]
  followUp?: string
  actions?: string[]
  context?: any
}

export const customerChatFlow: ChatFlow[] = [
  {
    intent: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'start', 'begin'],
    responses: [
      "Hi! I'm your AI property assistant. I'm here to help you find your perfect home. What type of property are you looking for?",
      "Hello! Welcome to RealEstate AI. I'll help you discover properties that match your needs. What can I help you find today?",
      "Hi there! Ready to find your dream home? Tell me what you're looking for and I'll find the perfect matches."
    ],
    quickReplies: [
      "I'm looking for a house",
      "I need an apartment",
      "I want something downtown",
      "Show me family homes"
    ],
    followUp: 'property_type'
  },
  
  {
    intent: 'property_type',
    patterns: ['house', 'apartment', 'condo', 'townhouse', 'studio', 'loft'],
    responses: [
      "Great choice! {property_type} can be wonderful. Where would you like to live?",
      "Perfect! I have some amazing {property_type} options. What area are you interested in?",
      "Excellent! {property_type} properties are very popular. Which neighborhood or city interests you?"
    ],
    quickReplies: [
      "Downtown area",
      "Suburbs with good schools",
      "Near public transit",
      "Close to tech companies"
    ],
    followUp: 'location'
  },
  
  {
    intent: 'location',
    patterns: ['downtown', 'suburb', 'city', 'neighborhood', 'near', 'close to'],
    responses: [
      "Excellent location choice! What's your budget range for this property?",
      "That's a great area! To find the best options, what's your budget range?",
      "Perfect! I know that area well. What budget are you working with?"
    ],
    quickReplies: [
      "Under $500k",
      "$500k - $1M",
      "$1M - $2M",
      "Above $2M"
    ],
    followUp: 'budget'
  },
  
  {
    intent: 'budget',
    patterns: ['budget', 'price', 'cost', '$', 'thousand', 'million', 'afford'],
    responses: [
      "Got it! With your budget of {budget}, how many bedrooms do you need?",
      "Perfect! For {budget}, I can show you some great options. How many bedrooms are you looking for?",
      "Excellent budget range! How many bedrooms would be ideal for you?"
    ],
    quickReplies: [
      "1 bedroom",
      "2 bedrooms", 
      "3 bedrooms",
      "4+ bedrooms"
    ],
    followUp: 'bedrooms'
  },
  
  {
    intent: 'bedrooms',
    patterns: ['bedroom', 'bed', 'room', 'space'],
    responses: [
      "Perfect! {bedrooms} sounds ideal. Any specific features or amenities you're looking for?",
      "Great! {bedrooms} will give you good space. What features are important to you?",
      "Excellent choice! Any must-have features for your new home?"
    ],
    quickReplies: [
      "Modern kitchen",
      "Parking garage",
      "Garden/yard",
      "Pet-friendly"
    ],
    followUp: 'features'
  },
  
  {
    intent: 'features',
    patterns: ['kitchen', 'parking', 'garden', 'yard', 'gym', 'pool', 'balcony', 'view'],
    responses: [
      "Excellent! I have all the information I need. Let me find the perfect properties for you...",
      "Perfect! Based on your preferences, I'll search for the best matches...",
      "Great! I'm now searching for properties that match all your criteria..."
    ],
    actions: ['search_properties', 'navigate_to_results'],
    followUp: 'search_complete'
  },
  
  {
    intent: 'search_complete',
    patterns: [],
    responses: [
      "I found some amazing properties that match your criteria! The top matches are ranked by how well they fit your needs.",
      "Great news! I've found several properties that are perfect for you. They're ranked by AI matching score.",
      "Excellent! Here are your top property matches, ranked by how well they meet your requirements."
    ],
    quickReplies: [
      "Tell me about #1",
      "Why is this ranked first?",
      "Show me more options",
      "I want something different"
    ],
    followUp: 'property_discussion'
  },
  
  {
    intent: 'property_discussion',
    patterns: ['tell me', 'why', 'more', 'different', 'details', 'explain'],
    responses: [
      "I'd be happy to explain! This property ranked highly because {ranking_factors}. What would you like to know more about?",
      "Great question! This property matches your criteria because {ranking_factors}. Any specific questions?",
      "Sure! This property is a top match due to {ranking_factors}. What interests you most?"
    ],
    quickReplies: [
      "Schedule a viewing",
      "See more photos",
      "Check the neighborhood",
      "Compare with others"
    ],
    followUp: 'property_action'
  },
  
  {
    intent: 'refinement',
    patterns: ['actually', 'change', 'instead', 'different', 'not quite', 'but'],
    responses: [
      "No problem! I can adjust the search. What would you like to change?",
      "Of course! Let me refine the search. What should I adjust?",
      "Absolutely! I'm here to find exactly what you want. What needs to change?"
    ],
    quickReplies: [
      "Different location",
      "Change budget",
      "More/fewer bedrooms",
      "Different property type"
    ],
    followUp: 'criteria_update'
  },
  
  {
    intent: 'style_preference',
    patterns: ['modern', 'traditional', 'contemporary', 'vintage', 'classic', 'minimalist'],
    responses: [
      "I love {style} properties! That really helps narrow down the options. Let me update your search...",
      "Perfect! {style} style adds great character. I'll prioritize properties with that aesthetic...",
      "Excellent choice! {style} homes have such appeal. Updating your matches now..."
    ],
    actions: ['update_preferences', 'reorder_results']
  },
  
  {
    intent: 'amenity_focus',
    patterns: ['gym', 'pool', 'parking', 'elevator', 'doorman', 'roof', 'terrace'],
    responses: [
      "Great point! {amenity} is definitely important for quality of life. I'll prioritize properties with that feature...",
      "Absolutely! {amenity} makes such a difference. Let me find properties that have this...",
      "Perfect! {amenity} is a wonderful amenity. Updating your search to prioritize this..."
    ],
    actions: ['update_preferences', 'reorder_results']
  },
  
  {
    intent: 'commute_concern',
    patterns: ['commute', 'work', 'office', 'transit', 'subway', 'bus', 'drive'],
    responses: [
      "Commute is so important! Where do you need to get to for work? I can prioritize properties with easy access.",
      "Great consideration! Tell me about your commute needs and I'll factor that into the rankings.",
      "Smart thinking! Commute time affects quality of life. What's your destination for work?"
    ],
    quickReplies: [
      "Downtown SF",
      "Silicon Valley",
      "Need public transit",
      "I work from home"
    ],
    followUp: 'commute_details'
  },
  
  {
    intent: 'family_needs',
    patterns: ['family', 'kids', 'children', 'school', 'playground', 'safe'],
    responses: [
      "Family-friendly features are crucial! I'll prioritize properties in great school districts and safe neighborhoods.",
      "Perfect! Family needs are my priority. Looking for properties with good schools and family amenities...",
      "Excellent! I'll focus on family-friendly properties with schools, parks, and safe neighborhoods nearby."
    ],
    actions: ['update_preferences', 'reorder_results']
  }
]

// Intent recognition patterns
export const intentPatterns = {
  greeting: /^(hi|hello|hey|start|begin|good morning|good afternoon)/i,
  property_type: /(house|apartment|condo|townhouse|studio|loft|property)/i,
  location: /(downtown|suburb|city|neighborhood|area|near|close to|location)/i,
  budget: /(budget|price|cost|\$|thousand|million|afford|expensive|cheap)/i,
  bedrooms: /(bedroom|bed|room|space|1br|2br|3br|4br)/i,
  features: /(kitchen|parking|garden|yard|gym|pool|balcony|view|feature|amenity)/i,
  style_preference: /(modern|traditional|contemporary|vintage|classic|minimalist|style)/i,
  amenity_focus: /(gym|pool|parking|elevator|doorman|roof|terrace|amenity)/i,
  commute_concern: /(commute|work|office|transit|subway|bus|drive|transportation)/i,
  family_needs: /(family|kids|children|school|playground|safe|neighborhood)/i,
  refinement: /(actually|change|instead|different|not quite|but|however)/i,
}

// Response templates with variable substitution
export const responseTemplates = {
  property_type: [
    "Great choice! {propertyType} can be wonderful. Where would you like to live?",
    "Perfect! I have some amazing {propertyType} options. What area are you interested in?",
    "Excellent! {propertyType} properties are very popular. Which neighborhood or city interests you?"
  ],
  budget_confirmation: [
    "Got it! With your budget of {budget}, how many bedrooms do you need?",
    "Perfect! For {budget}, I can show you some great options. How many bedrooms are you looking for?",
    "Excellent budget range! How many bedrooms would be ideal for you?"
  ],
  search_results: [
    "I found {count} amazing properties that match your criteria! The top matches are ranked by how well they fit your needs.",
    "Great news! I've found {count} properties that are perfect for you. They're ranked by AI matching score.",
    "Excellent! Here are your top {count} property matches, ranked by how well they meet your requirements."
  ]
}

// Quick reply options for different conversation states
export const quickReplyOptions = {
  initial: [
    "I'm looking for a house",
    "I need an apartment", 
    "I want something downtown",
    "Show me family homes"
  ],
  location: [
    "Downtown area",
    "Suburbs with good schools", 
    "Near public transit",
    "Close to tech companies"
  ],
  budget: [
    "Under $500k",
    "$500k - $1M",
    "$1M - $2M", 
    "Above $2M"
  ],
  bedrooms: [
    "1 bedroom",
    "2 bedrooms",
    "3 bedrooms", 
    "4+ bedrooms"
  ],
  features: [
    "Modern kitchen",
    "Parking garage",
    "Garden/yard",
    "Pet-friendly"
  ],
  property_actions: [
    "Schedule a viewing",
    "See more photos",
    "Check the neighborhood", 
    "Compare with others"
  ]
}

export default customerChatFlow 