import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Types
export interface Property {
  id: string
  title: string
  price: number
  pricePerSqft?: number
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    coordinates?: { lat: number; lng: number }
    neighborhood?: string
  }
  details: {
    bedrooms: number
    bathrooms: number
    sqft: number
    type: string
    yearBuilt?: number
    parking?: number
    lotSize?: number
  }
  images: string[]
  features?: string[]
  description: string
  matchScore?: number
  aiRanking?: {
    factors: string[]
  }
  listing?: {
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
}

export interface PropertyState {
  properties: Property[]
  searchResults: Property[]
  currentProperty: Property | null
  isLoading: boolean
  error: string | null
  favorites: string[]
  lastSearchCriteria: any
}

// Initial state
const initialState: PropertyState = {
  properties: [],
  searchResults: [],
  currentProperty: null,
  isLoading: false,
  error: null,
  favorites: [],
  lastSearchCriteria: null,
}

// Action types
type PropertyActionType =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROPERTIES'; payload: Property[] }
  | { type: 'SET_SEARCH_RESULTS'; payload: Property[] }
  | { type: 'SET_CURRENT_PROPERTY'; payload: Property | null }
  | { type: 'ADD_TO_FAVORITES'; payload: string }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'REORDER_SEARCH_RESULTS'; payload: Property[] }
  | { type: 'UPDATE_SEARCH_CRITERIA'; payload: any }

// Reducer
const propertyReducer = (state: PropertyState, action: PropertyActionType): PropertyState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload, isLoading: false }
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, isLoading: false }
    case 'SET_CURRENT_PROPERTY':
      return { ...state, currentProperty: action.payload }
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      }
    case 'REORDER_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload }
    case 'UPDATE_SEARCH_CRITERIA':
      return { ...state, lastSearchCriteria: action.payload }
    default:
      return state
  }
}

// Context
interface PropertyContextType {
  state: PropertyState
  dispatch: React.Dispatch<PropertyActionType>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setProperties: (properties: Property[]) => void
  setSearchResults: (results: Property[]) => void
  setCurrentProperty: (property: Property | null) => void
  toggleFavorite: (propertyId: string) => void
  reorderSearchResults: (results: Property[]) => void
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

// Provider
interface PropertyProviderProps {
  children: ReactNode
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(propertyReducer, initialState)

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const setProperties = (properties: Property[]) => {
    dispatch({ type: 'SET_PROPERTIES', payload: properties })
  }

  const setSearchResults = (results: Property[]) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results })
  }

  const setCurrentProperty = (property: Property | null) => {
    dispatch({ type: 'SET_CURRENT_PROPERTY', payload: property })
  }

  const toggleFavorite = (propertyId: string) => {
    if (state.favorites.includes(propertyId)) {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: propertyId })
    } else {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: propertyId })
    }
  }

  const reorderSearchResults = (results: Property[]) => {
    dispatch({ type: 'REORDER_SEARCH_RESULTS', payload: results })
  }

  const value: PropertyContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setProperties,
    setSearchResults,
    setCurrentProperty,
    toggleFavorite,
    reorderSearchResults,
  }

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>
}

// Hook
export const useProperty = () => {
  const context = useContext(PropertyContext)
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider')
  }
  return context
} 