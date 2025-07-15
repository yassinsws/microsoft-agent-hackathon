import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SplitLayout from '../../components/layout/SplitLayout'
import PropertyGrid from '../../components/property/PropertyGrid'
import ChatInterface from '../../components/chat/ChatInterface'
import SearchBar from '../../components/search/SearchBar'
import FilterPanel from '../../components/search/FilterPanel'
import { useProperty } from '../../contexts/PropertyContext'
import { mockProperties } from '../../data/mockProperties'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
}

const SearchResults: React.FC = () => {
  const { state } = useProperty()
  const location = useLocation()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentSearchQuery, setCurrentSearchQuery] = useState('')
  const [filters, setFilters] = useState<any>(null)
  
  // Use mock data for demo, filter based on chat interactions and manual filters
  const [filteredProperties, setFilteredProperties] = useState(mockProperties)
  const properties = state.searchResults.length > 0 ? state.searchResults : filteredProperties

  // Get initial search query from navigation state
  useEffect(() => {
    const searchQuery = location.state?.query
    if (searchQuery) {
      setCurrentSearchQuery(searchQuery)
      // Simulate an initial AI interaction with the search query
      handleMessageSent(searchQuery, true)
    }
  }, [location.state])

  const handlePropertyClick = (property: any) => {
    // Navigate to property details
    console.log('Navigate to property:', property.id)
  }

  const handleNewSearch = (query: string) => {
    setCurrentSearchQuery(query)
    // Clear previous messages and start fresh with new search
    setMessages([])
    setFilteredProperties(mockProperties)
    // Simulate AI interaction with new search
    handleMessageSent(query, true)
  }

  const handleMessageSent = async (message: string, isInitialSearch = false) => {
    // Add user message (only if not initial search to avoid duplicate)
    if (!isInitialSearch) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: message,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
    }
    
    setIsTyping(true)

    // Simulate AI response with property filtering
    setTimeout(() => {
      const aiResponse = generateAIResponse(message)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      }
      
      setMessages(prev => {
        const newMessages = isInitialSearch ? [] : prev
        return [...newMessages, aiMessage]
      })
      setIsTyping(false)

      // Apply filters based on the message
      applyFiltersFromMessage(message)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('villa') || lowerMessage.includes('luxury')) {
      return {
        content: "I've found some beautiful luxury villas for you! These properties feature spacious layouts, premium finishes, and excellent locations. Would you like me to filter by price range or specific neighborhoods?",
        suggestions: [
          "Show villas under €3M",
          "Properties in Pasing area",
          "Villas with large gardens",
          "Modern architectural style"
        ]
      }
    }
    
    if (lowerMessage.includes('apartment') || lowerMessage.includes('bedroom')) {
      return {
        content: "Perfect! I've filtered the results to show apartments that match your criteria. I can help you narrow down by bedrooms, price range, or specific features you're looking for.",
        suggestions: [
          "Show 2-3 bedroom apartments",
          "Under €2M budget",
          "With balcony or terrace",
          "Near public transport"
        ]
      }
    }
    
    if (lowerMessage.includes('garden') || lowerMessage.includes('parking')) {
      return {
        content: "Great choices! I've filtered for properties with gardens and parking. These features are very popular in Munich. Would you like me to show properties with additional amenities?",
        suggestions: [
          "Properties with pools",
          "Elevator access",
          "Garage parking",
          "Private gardens only"
        ]
      }
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('price') || lowerMessage.includes('€') || lowerMessage.includes('million')) {
      return {
        content: "I understand your budget preferences. I've filtered the properties accordingly. Here are the options within your range. Would you like to see financing options or adjust the budget?",
        suggestions: [
          "Show financing options",
          "Properties slightly above budget",
          "Best value properties",
          "Price negotiable listings"
        ]
      }
    }
    
    // Default response
    return {
      content: "I've updated the search results based on your preferences. I can help you find exactly what you're looking for. What specific features or requirements are most important to you?",
      suggestions: [
        "Filter by property type",
        "Set budget range",
        "Specify location preferences",
        "Add feature requirements"
      ]
    }
  }

  const applyFiltersFromMessage = (message: string) => {
    const lowerMessage = message.toLowerCase()
    let filtered = [...mockProperties]
    
    // Apply manual filters first if they exist
    if (filters) {
      filtered = applyManualFilters(filtered, filters)
    }
    
    // Then apply AI filters based on keywords
    if (lowerMessage.includes('villa')) {
      filtered = filtered.filter(p => p.details.type.toLowerCase().includes('house') || p.title.toLowerCase().includes('villa'))
    }
    
    if (lowerMessage.includes('apartment')) {
      filtered = filtered.filter(p => p.details.type.toLowerCase().includes('condo') || p.details.type.toLowerCase().includes('apartment'))
    }
    
    if (lowerMessage.includes('3 bedroom') || lowerMessage.includes('3-bedroom')) {
      filtered = filtered.filter(p => p.details.bedrooms >= 3)
    }
    
    if (lowerMessage.includes('under €2m') || lowerMessage.includes('under 2')) {
      filtered = filtered.filter(p => p.price <= 2000000)
    }
    
    if (lowerMessage.includes('garden') || lowerMessage.includes('parking')) {
      // In a real app, this would filter by features
      filtered = filtered.slice(0, 4) // Show fewer results as if filtered
    }
    
    setFilteredProperties(filtered)
  }

  const applyManualFilters = (properties: any[], filterState: any) => {
    let filtered = [...properties]
    
    // Price range filter
    if (filterState.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= filterState.priceRange.min && 
        p.price <= filterState.priceRange.max
      )
    }
    
    // Bedrooms filter
    if (filterState.bedrooms !== null) {
      filtered = filtered.filter(p => p.details.bedrooms >= filterState.bedrooms)
    }
    
    // Bathrooms filter
    if (filterState.bathrooms !== null) {
      filtered = filtered.filter(p => p.details.bathrooms >= filterState.bathrooms)
    }
    
    // Property type filter
    if (filterState.propertyType) {
      filtered = filtered.filter(p => 
        p.details.type.toLowerCase().includes(filterState.propertyType.toLowerCase())
      )
    }
    
    // Location filter
    if (filterState.location) {
      const location = filterState.location.toLowerCase()
      filtered = filtered.filter(p => 
        p.location.city.toLowerCase().includes(location) ||
        p.location.neighborhood?.toLowerCase().includes(location) ||
        p.location.address.toLowerCase().includes(location)
      )
    }
    
    // Features filter
    if (filterState.features && filterState.features.length > 0) {
      filtered = filtered.filter(p => 
        filterState.features.some((feature: string) => 
          p.features?.some((pFeature: string) => 
            pFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      )
    }
    
    return filtered
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    let filtered = applyManualFilters(mockProperties, newFilters)
    setFilteredProperties(filtered)
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="flex-1 overflow-hidden">
        <SplitLayout ratio="40-60" className="h-full">
          <SplitLayout.Left>
            <div className="h-full bg-primary-50 p-8 flex flex-col">
              <ChatInterface
                title="AI Property Assistant"
                subtitle="Tell me what you're looking for and I'll help filter the perfect properties for you."
                placeholder="I'm looking for a luxury villa with a garden..."
                messages={messages}
                isTyping={isTyping}
                onMessageSent={handleMessageSent}
                className="flex-1 flex flex-col min-h-0"
              />
            </div>
          </SplitLayout.Left>
          
          <SplitLayout.Right>
            <div className="h-full flex flex-col">
              {/* Fixed Header Area */}
              <div className="flex-shrink-0 p-8 pb-0">
                {/* Search Bar */}
                <div className="mb-6">
                  <SearchBar 
                    size="md"
                    placeholder="Refine your search..."
                    onSearch={handleNewSearch}
                    initialValue={currentSearchQuery}
                    className="w-full"
                  />
                </div>

                {/* Filter Panel */}
                <div className="mb-6">
                  <FilterPanel 
                    onFiltersChange={handleFiltersChange}
                    className="w-full"
                  />
                </div>

                {/* Title and Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary-900 mb-2 heading-serif">
                      Premium Properties
                    </h1>
                    <p className="text-primary-600">
                      {properties.length} properties found
                      {messages.length > 0 && (
                        <span className="ml-2 text-primary-500">• Filtered by AI</span>
                      )}
                      {filters && (
                        <span className="ml-2 text-primary-500">• Manual filters applied</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select className="input text-sm w-auto">
                      <option>Sort by Price</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest First</option>
                      <option>Size</option>
                      <option>AI Recommended</option>
                    </select>
                  </div>
                </div>

                {/* AI Filter Status */}
                {messages.length > 0 && (
                  <div className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-900">
                          AI filtering applied based on your conversation
                        </p>
                        <p className="text-xs text-primary-600">
                          Continue chatting to refine your search further
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setMessages([])
                          setFilteredProperties(mockProperties)
                          setCurrentSearchQuery('')
                        }}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        Reset AI filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Scrollable Property Results */}
              <div className="flex-1 overflow-y-auto px-8 pb-8">
                <PropertyGrid
                  properties={properties}
                  columns={2}
                  onPropertyClick={handlePropertyClick}
                />
              </div>
            </div>
          </SplitLayout.Right>
        </SplitLayout>
      </div>
    </div>
  )
}

export default SearchResults 