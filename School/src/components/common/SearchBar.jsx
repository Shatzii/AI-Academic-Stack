import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const SearchBar = ({ placeholder = "Search for sports training, academic courses, or skills...", className = "" }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()

  const performSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await api.get('/api/search/', {
          params: { q: searchQuery }
        })
        setResults(response.data.results || [])
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    performSearch(query)
  }, [query, performSearch])

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const handleResultClick = (result) => {
    setShowResults(false)
    setQuery('')
    
    if (result.type === 'course') {
      navigate(`/courses/${result.id}`)
    } else if (result.type === 'training') {
      navigate(`/training/${result.id}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
      setShowResults(false)
    }
  }

  return (
    <div className={`search-bar-container position-relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-3 p-3 shadow-lg mb-4">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-0">
              {isLoading ? (
                <div className="spinner-border spinner-border-sm text-muted" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
              ) : (
                <i className="fas fa-search text-muted"></i>
              )}
            </span>
            <input
              type="text"
              className="form-control border-0 ps-0"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onFocus={() => query && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              style={{ boxShadow: 'none' }}
            />
            <button type="submit" className="btn btn-primary rounded-pill px-4">
              <i className="fas fa-arrow-right me-2"></i>
              Search
            </button>
          </div>
          
          <div className="d-flex gap-2 mt-2">
            <span 
              className="badge bg-light text-muted rounded-pill px-3 py-1 cursor-pointer"
              onClick={() => setQuery('FIFA Skills')}
              role="button"
            >
              FIFA Skills
            </span>
            <span 
              className="badge bg-light text-muted rounded-pill px-3 py-1 cursor-pointer"
              onClick={() => setQuery('NCAA Prep')}
              role="button"
            >
              NCAA Prep
            </span>
            <span 
              className="badge bg-light text-muted rounded-pill px-3 py-1 cursor-pointer"
              onClick={() => setQuery('Athlete Performance')}
              role="button"
            >
              Athlete Performance
            </span>
          </div>
        </div>
      </form>

      {showResults && results.length > 0 && (
        <div className="search-results position-absolute w-100 mt-2 bg-white rounded-3 shadow-lg" style={{ zIndex: 1000 }}>
          <div className="list-group list-group-flush">
            {results.slice(0, 5).map((result, index) => (
              <button
                key={index}
                className="list-group-item list-group-item-action d-flex align-items-start"
                onClick={() => handleResultClick(result)}
              >
                <div className="me-3">
                  <i className={`fas ${result.type === 'course' ? 'fa-book' : 'fa-dumbbell'} text-primary`}></i>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold">{result.title}</div>
                  {result.description && (
                    <small className="text-muted d-block text-truncate">
                      {result.description}
                    </small>
                  )}
                  <small className="badge bg-light text-muted">
                    {result.category || result.type}
                  </small>
                </div>
              </button>
            ))}
          </div>
          {results.length > 5 && (
            <div className="p-2 text-center border-top">
              <button 
                className="btn btn-sm btn-link"
                onClick={handleSubmit}
              >
                View all {results.length} results
              </button>
            </div>
          )}
        </div>
      )}

      {showResults && query && results.length === 0 && !isLoading && (
        <div className="search-results position-absolute w-100 mt-2 bg-white rounded-3 shadow-lg p-3" style={{ zIndex: 1000 }}>
          <div className="text-center text-muted">
            <i className="fas fa-search mb-2" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
            <p className="mb-0">No results found for "{query}"</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar