import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const BrandingContext = createContext()

export const useBranding = () => {
  const context = useContext(BrandingContext)
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider')
  }
  return context
}

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBranding()
  }, [])

  const fetchBranding = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/auth/branding/active/')
      setBranding(response.data)
      setError(null)

      // Apply CSS variables to document root
      if (response.data.css_variables) {
        const style = document.createElement('style')
        style.textContent = response.data.css_variables
        document.head.appendChild(style)
      }
    } catch (err) {
      // console.error('Error fetching branding:', err)
      setError(err.message)
      // Use default branding if API fails
      setBranding({
        school_name: 'OpenEdTex University',
        school_tagline: 'Empowering Education Through Technology',
        primary_color: '#007bff',
        secondary_color: '#6c757d',
        accent_color: '#28a745',
        background_color: '#ffffff',
        text_color: '#212529',
        primary_font: "'Inter', sans-serif",
        heading_font: "'Inter', sans-serif",
        support_email: 'support@openedtex.edu',
        website_url: 'https://openedtex.edu',
        footer_text: '© 2025 OpenEdTex University. All rights reserved.',
        logo_url: '/static/images/default-logo.png',
        small_logo_url: '/static/images/default-logo-small.png',
        favicon_url: '/static/favicon.ico'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateBranding = (newBranding) => {
    setBranding(newBranding)

    // Update CSS variables
    if (newBranding.css_variables) {
      const style = document.createElement('style')
      style.textContent = newBranding.css_variables
      document.head.appendChild(style)
    }
  }

  const value = {
    branding,
    loading,
    error,
    updateBranding,
    refreshBranding: fetchBranding
  }

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  )
}
