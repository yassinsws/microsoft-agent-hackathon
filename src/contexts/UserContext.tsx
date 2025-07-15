import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences?: UserPreferences
  role: 'customer' | 'seller' | 'agent'
}

export interface UserPreferences {
  theme?: 'light' | 'dark'
  notifications?: boolean
  language?: string
  currency?: string
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Action types
type UserActionType =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'LOGOUT' }

// Reducer
const userReducer = (state: UserState, action: UserActionType): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false 
      }
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload }
        } : null
      }
    case 'LOGOUT':
      return { ...initialState }
    default:
      return state
  }
}

// Context
interface UserContextType {
  state: UserState
  dispatch: React.Dispatch<UserActionType>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider
interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const value: UserContextType = {
    state,
    dispatch,
    setUser,
    setLoading,
    setError,
    updatePreferences,
    logout,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Hook
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 