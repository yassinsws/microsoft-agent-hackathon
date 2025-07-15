import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Types
export interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: number
  quickReplies?: string[]
  actions?: ChatAction[]
}

export interface ChatAction {
  type: string
  payload?: any
}

export interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  currentIntent: string
  criteria?: SearchCriteria
  preferences?: UserPreferences
  readyForResults: boolean
  formData?: any
}

export interface SearchCriteria {
  location?: string
  budget?: {
    min: number
    max: number
  }
  propertyType?: string
  bedrooms?: number
  bathrooms?: number
  features?: string[]
}

export interface UserPreferences {
  style?: string
  neighborhood?: string
  amenities?: string[]
  priority?: string
}

// Initial state
const initialState: ChatState = {
  messages: [],
  isTyping: false,
  currentIntent: 'greeting',
  readyForResults: false,
}

// Action types
type ChatActionType =
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'UPDATE_CRITERIA'; payload: Partial<SearchCriteria> }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_READY_FOR_RESULTS'; payload: boolean }
  | { type: 'UPDATE_FORM_DATA'; payload: any }
  | { type: 'RESET_CHAT' }

// Reducer
const chatReducer = (state: ChatState, action: ChatActionType): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      }
    case 'UPDATE_CRITERIA':
      return {
        ...state,
        criteria: { ...state.criteria, ...action.payload },
      }
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      }
    case 'SET_READY_FOR_RESULTS':
      return {
        ...state,
        readyForResults: action.payload,
      }
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      }
    case 'RESET_CHAT':
      return initialState
    default:
      return state
  }
}

// Context
interface ChatContextType {
  state: ChatState
  dispatch: React.Dispatch<ChatActionType>
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setTyping: (isTyping: boolean) => void
  updateCriteria: (criteria: Partial<SearchCriteria>) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  resetChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Provider
interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage })
  }

  const setTyping = (isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: isTyping })
  }

  const updateCriteria = (criteria: Partial<SearchCriteria>) => {
    dispatch({ type: 'UPDATE_CRITERIA', payload: criteria })
  }

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
  }

  const resetChat = () => {
    dispatch({ type: 'RESET_CHAT' })
  }

  const value: ChatContextType = {
    state,
    dispatch,
    addMessage,
    setTyping,
    updateCriteria,
    updatePreferences,
    resetChat,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

// Hook
export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
} 