import React, { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ChatInterfaceProps {
  title?: string
  subtitle?: string
  placeholder?: string
  onMessageSent?: (message: string) => void
  onSuggestionClick?: (suggestion: string) => void
  messages?: Message[]
  isTyping?: boolean
  showSuggestions?: boolean
  compact?: boolean
  className?: string
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  title = "AI Property Assistant",
  subtitle = "Tell me what you're looking for and I'll help you find the perfect property.",
  placeholder = "Describe your ideal property...",
  onMessageSent,
  onSuggestionClick,
  messages = [],
  isTyping = false,
  showSuggestions = true,
  compact = false,
  className
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isExpanded, setIsExpanded] = useState(!compact)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && onMessageSent) {
      onMessageSent(inputValue.trim())
      setInputValue('')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion)
    } else if (onMessageSent) {
      onMessageSent(suggestion)
    }
  }

  const defaultSuggestions = [
    "Show me luxury villas in Munich",
    "I need a 3-bedroom apartment under €2M", 
    "Properties with gardens and parking",
    "Modern townhouses in Nymphenburg"
  ]

  if (compact && !isExpanded) {
    return (
      <div className={clsx("bg-white rounded-xl border border-primary-200 p-4", className)}>
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-primary-900">{title}</h3>
              <p className="text-sm text-primary-600">Click to start searching...</p>
            </div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className={clsx("bg-white rounded-xl border border-primary-200 flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-primary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-900">{title}</h3>
              <p className="text-sm text-primary-600">{subtitle}</p>
            </div>
          </div>
          {compact && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-primary-400 hover:text-primary-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide min-h-0">
        {messages.length === 0 && showSuggestions && (
          <div className="space-y-3">
            <p className="text-sm text-primary-600 mb-4">Here are some ways I can help you:</p>
            {defaultSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-3 bg-primary-50 hover:bg-primary-100 rounded-lg text-sm text-primary-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={clsx("flex", message.type === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={clsx(
              "max-w-xs lg:max-w-sm px-4 py-3 rounded-lg",
              message.type === 'user' 
                ? "bg-primary-900 text-white" 
                : "bg-primary-50 text-primary-900"
            )}>
              <p className="text-sm">{message.content}</p>
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-xs px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-primary-50 text-primary-900 px-4 py-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-6 border-t border-primary-100">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 input text-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="btn-primary btn-sm px-6 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface 