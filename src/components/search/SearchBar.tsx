import React, { useState } from 'react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  placeholder?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onSearch?: (query: string) => void
  className?: string
  autoFocus?: boolean
  initialValue?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Tell me what kind of property you're looking for...",
  size = 'lg',
  onSearch,
  className,
  autoFocus = false,
  initialValue = ''
}) => {
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        // Default behavior: navigate to search results
        navigate('/search-results', { 
          state: { query: query.trim() },
          replace: false 
        })
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    if (onSearch) {
      onSearch(suggestion)
    } else {
      navigate('/search-results', { 
        state: { query: suggestion },
        replace: false 
      })
    }
  }

  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-6 text-lg',
    xl: 'py-5 px-8 text-xl'
  }

  const buttonSizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  return (
    <div className={clsx("relative group", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={clsx(
              "w-full border border-primary-200 rounded-xl text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200 bg-white pr-20 shadow-soft",
              sizeClasses[size]
            )}
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className={clsx(
              "absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed",
              buttonSizeClasses[size]
            )}
          >
            <span className="hidden sm:inline">Search</span>
            <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      
      {/* Search suggestions */}
      {query.length === 0 && size !== 'sm' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary-200 rounded-xl shadow-medium z-10 opacity-0 group-focus-within:opacity-100 pointer-events-none group-focus-within:pointer-events-auto transition-opacity duration-200">
          <div className="p-4">
            <p className="text-sm text-primary-600 mb-3">Popular searches:</p>
            <div className="space-y-2">
              {[
                "Luxury villas in Munich with gardens",
                "3-bedroom apartments under €2M",
                "Modern townhouses in Nymphenburg",
                "Properties with parking and balcony"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 inline mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar 