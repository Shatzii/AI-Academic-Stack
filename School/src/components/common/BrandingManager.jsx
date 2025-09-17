import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useBranding } from '../../context/BrandingContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const BrandingManager = () => {
  const { user } = useAuth()
  const { branding, updateBranding } = useBranding()
  const [formData, setFormData] = useState({
    school_name: '',
    school_tagline: '',
    primary_color: '#007bff',
    secondary_color: '#6c757d',
    accent_color: '#28a745',
    background_color: '#ffffff',
    text_color: '#212529',
    primary_font: "'Inter', sans-serif",
    heading_font: "'Inter', sans-serif",
    support_email: '',
    support_phone: '',
    website_url: '',
    footer_text: '',
    custom_css: ''
  })
  const [logoFile, setLogoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [presets, setPresets] = useState([])

  useEffect(() => {
    if (branding) {
      setFormData({
        school_name: branding.school_name || '',
        school_tagline: branding.school_tagline || '',
        primary_color: branding.primary_color || '#007bff',
        secondary_color: branding.secondary_color || '#6c757d',
        accent_color: branding.accent_color || '#28a745',
        background_color: branding.background_color || '#ffffff',
        text_color: branding.text_color || '#212529',
        primary_font: branding.primary_font || "'Inter', sans-serif",
        heading_font: branding.heading_font || "'Inter', sans-serif",
        support_email: branding.support_email || '',
        support_phone: branding.support_phone || '',
        website_url: branding.website_url || '',
        footer_text: branding.footer_text || '',
        custom_css: branding.custom_css || ''
      })
    }
    fetchPresets()
  }, [branding])

  const fetchPresets = async () => {
    try {
      const response = await axios.get('/api/auth/branding-presets/')
      setPresets(response.data)
    } catch (error) {
      console.error('Error fetching presets:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()

      // Add form data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key])
      })

      // Add logo file if selected
      if (logoFile) {
        submitData.append('logo', logoFile)
      }

      const response = await axios.post('/api/auth/branding/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      updateBranding(response.data)
      toast.success('Branding updated successfully!')
    } catch (error) {
      console.error('Error updating branding:', error)
      toast.error('Failed to update branding')
    } finally {
      setLoading(false)
    }
  }

  const applyPreset = async (presetId) => {
    try {
      const response = await axios.post(`/api/auth/branding-presets/${presetId}/apply/`)
      updateBranding(response.data)
      toast.success('Preset applied successfully!')
    } catch (error) {
      console.error('Error applying preset:', error)
      toast.error('Failed to apply preset')
    }
  }

  const previewCSS = () => {
    return `
      :root {
        --brand-primary: ${formData.primary_color};
        --brand-secondary: ${formData.secondary_color};
        --brand-accent: ${formData.accent_color};
        --brand-background: ${formData.background_color};
        --brand-text: ${formData.text_color};
        --brand-primary-font: ${formData.primary_font};
        --brand-heading-font: ${formData.heading_font};
      }
      ${formData.custom_css}
    `
  }

  if (!user || (user.role !== 'admin' && !user.is_staff)) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You don&apos;t have permission to manage branding settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mb-0">
                <i className="fas fa-palette me-2"></i>
                Branding Configuration
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">School Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="school_name"
                      value={formData.school_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">School Tagline</label>
                    <input
                      type="text"
                      className="form-control"
                      name="school_tagline"
                      value={formData.school_tagline}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="mb-4">
                  <label className="form-label">School Logo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  {branding?.logo_url && (
                    <div className="mt-2">
                      <img
                        src={branding.logo_url}
                        alt="Current logo"
                        height="50"
                        className="border rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Color Scheme */}
                <h5 className="mb-3">Color Scheme</h5>
                <div className="row mb-4">
                  <div className="col-md-4">
                    <label className="form-label">Primary Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Secondary Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Accent Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      name="accent_color"
                      value={formData.accent_color}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Background Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      name="background_color"
                      value={formData.background_color}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Text Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      name="text_color"
                      value={formData.text_color}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Typography */}
                <h5 className="mb-3">Typography</h5>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Primary Font</label>
                    <select
                      className="form-control"
                      name="primary_font"
                      value={formData.primary_font}
                      onChange={handleInputChange}
                    >
                      <option value="'Inter', sans-serif">Inter</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Lato', sans-serif">Lato</option>
                      <option value="'Poppins', sans-serif">Poppins</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Heading Font</label>
                    <select
                      className="form-control"
                      name="heading_font"
                      value={formData.heading_font}
                      onChange={handleInputChange}
                    >
                      <option value="'Inter', sans-serif">Inter</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Lato', sans-serif">Lato</option>
                      <option value="'Poppins', sans-serif">Poppins</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <h5 className="mb-3">Contact Information</h5>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Support Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="support_email"
                      value={formData.support_email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Support Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="support_phone"
                      value={formData.support_phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Website URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Footer */}
                <div className="mb-4">
                  <label className="form-label">Footer Text</label>
                  <textarea
                    className="form-control"
                    name="footer_text"
                    value={formData.footer_text}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                {/* Custom CSS */}
                <div className="mb-4">
                  <label className="form-label">Custom CSS</label>
                  <textarea
                    className="form-control"
                    name="custom_css"
                    value={formData.custom_css}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Add custom CSS for additional styling..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Save Branding
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Branding Presets */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Branding Presets</h5>
            </div>
            <div className="card-body">
              {presets.map(preset => (
                <div key={preset.id} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{preset.name}</span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => applyPreset(preset.id)}
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Live Preview</h5>
            </div>
            <div className="card-body">
              <div
                className="border rounded p-3 mb-3"
                style={{
                  backgroundColor: formData.background_color,
                  color: formData.text_color,
                  fontFamily: formData.primary_font
                }}
              >
                <div
                  className="mb-2"
                  style={{
                    color: formData.primary_color,
                    fontFamily: formData.heading_font,
                    fontWeight: 'bold'
                  }}
                >
                  {formData.school_name || 'School Name'}
                </div>
                <div className="mb-2" style={{ fontSize: '0.9em' }}>
                  {formData.school_tagline || 'School Tagline'}
                </div>
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: formData.primary_color,
                    borderColor: formData.primary_color,
                    color: 'white'
                  }}
                >
                  Sample Button
                </button>
              </div>

              <div className="text-muted small">
                <strong>CSS Variables:</strong>
                <pre className="mt-2" style={{ fontSize: '0.7em' }}>
                  {previewCSS()}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandingManager
