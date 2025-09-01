import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const InternationalizationSettings = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()

  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [availableLanguages, setAvailableLanguages] = useState([])
  const [translations, setTranslations] = useState({})
  const [loading, setLoading] = useState(false)
  const [contributeTranslations, setContributeTranslations] = useState(false)

  // Supported languages with their metadata
  const languages = {
    en: {
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false,
      completion: 100
    },
    es: {
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      rtl: false,
      completion: 95
    },
    fr: {
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      rtl: false,
      completion: 90
    },
    de: {
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      rtl: false,
      completion: 88
    },
    it: {
      name: 'Italian',
      nativeName: 'Italiano',
      flag: '🇮🇹',
      rtl: false,
      completion: 85
    },
    pt: {
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      rtl: false,
      completion: 82
    },
    zh: {
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      rtl: false,
      completion: 78
    },
    ja: {
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      rtl: false,
      completion: 75
    },
    ko: {
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
      rtl: false,
      completion: 72
    },
    ar: {
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      rtl: true,
      completion: 70
    },
    hi: {
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      rtl: false,
      completion: 68
    },
    ru: {
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺',
      rtl: false,
      completion: 65
    }
  }

  useEffect(() => {
    loadLanguageSettings()
    loadAvailableLanguages()
  }, [])

  const loadLanguageSettings = async () => {
    // Mock API call - in real app, this would load user's language preferences
    setCurrentLanguage('en')
  }

  const loadAvailableLanguages = async () => {
    // Mock API call - in real app, this would load available languages and their completion status
    const mockLanguages = Object.keys(languages).map(code => ({
      code,
      ...languages[code]
    }))
    setAvailableLanguages(mockLanguages)
  }

  const changeLanguage = async (languageCode) => {
    setLoading(true)
    try {
      // Mock API call - in real app, this would change the user's language
      await new Promise(resolve => setTimeout(resolve, 1000))

      setCurrentLanguage(languageCode)

      // Apply language to the application
      applyLanguage(languageCode)

      toast.success(`Language changed to ${languages[languageCode].nativeName}`)
    } catch (error) {
      toast.error('Failed to change language')
    } finally {
      setLoading(false)
    }
  }

  const applyLanguage = (languageCode) => {
    const lang = languages[languageCode]

    // Apply RTL if needed
    document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr'
    document.documentElement.lang = languageCode

    // Add RTL class for styling
    if (lang.rtl) {
      document.documentElement.classList.add('rtl')
    } else {
      document.documentElement.classList.remove('rtl')
    }

    // In a real app, this would load and apply translations
    // For demo purposes, we'll just show the language change
  }

  const getTranslationProgress = (completion) => {
    if (completion >= 90) return { color: 'success', text: 'Complete' }
    if (completion >= 70) return { color: 'warning', text: 'Good' }
    if (completion >= 50) return { color: 'info', text: 'Partial' }
    return { color: 'secondary', text: 'Limited' }
  }

  const contributeTranslation = async (languageCode, key, translation) => {
    try {
      // Mock API call - in real app, this would submit translation contribution
      toast.success('Translation contribution submitted for review!')
    } catch (error) {
      toast.error('Failed to submit translation')
    }
  }

  const reportTranslationIssue = async (languageCode, key, issue) => {
    try {
      // Mock API call - in real app, this would report translation issue
      toast.success('Translation issue reported!')
    } catch (error) {
      toast.error('Failed to report issue')
    }
  }

  return (
    <div className="i18n-page">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-primary mb-2">
              <i className="fas fa-globe me-2"></i>
              Language Settings
            </h1>
            <p className="text-muted">Choose your preferred language and help improve translations</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Current Language */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-language me-2"></i>
                  Current Language
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <span className="flag-icon me-3" style={{fontSize: '2rem'}}>
                    {languages[currentLanguage]?.flag}
                  </span>
                  <div>
                    <h6 className="mb-1">{languages[currentLanguage]?.nativeName}</h6>
                    <small className="text-muted">{languages[currentLanguage]?.name}</small>
                  </div>
                </div>

                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Note:</strong> Language changes will be applied after refreshing the page.
                  Some content may still appear in English while translations are being completed.
                </div>
              </div>
            </div>

            {/* Available Languages */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-list me-2"></i>
                  Available Languages
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {availableLanguages.map((lang) => {
                    const progress = getTranslationProgress(lang.completion)
                    return (
                      <div key={lang.code} className="col-md-6 mb-3">
                        <div className={`language-card ${currentLanguage === lang.code ? 'active' : ''}`}>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <span className="flag-icon me-3">
                                {lang.flag}
                              </span>
                              <div>
                                <h6 className="mb-1">{lang.nativeName}</h6>
                                <small className="text-muted">{lang.name}</small>
                              </div>
                            </div>
                            <div className="text-end">
                              <div className={`badge bg-${progress.color} mb-1`}>
                                {progress.text}
                              </div>
                              <div className="small text-muted">
                                {lang.completion}%
                              </div>
                            </div>
                          </div>

                          <div className="progress mt-2" style={{height: '4px'}}>
                            <div
                              className={`progress-bar bg-${progress.color}`}
                              style={{width: `${lang.completion}%`}}
                            ></div>
                          </div>

                          <div className="mt-2">
                            {currentLanguage === lang.code ? (
                              <span className="text-success small">
                                <i className="fas fa-check me-1"></i>
                                Currently selected
                              </span>
                            ) : (
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => changeLanguage(lang.code)}
                                disabled={loading}
                              >
                                {loading ? 'Switching...' : 'Select Language'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Translation Contribution */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-hands-helping me-2"></i>
                  Help Improve Translations
                </h5>
              </div>
              <div className="card-body">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="contributeTranslations"
                    checked={contributeTranslations}
                    onChange={(e) => setContributeTranslations(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="contributeTranslations">
                    <strong>I want to help translate OpenEdTex</strong>
                  </label>
                </div>

                {contributeTranslations && (
                  <div className="contribute-section">
                    <div className="alert alert-success">
                      <i className="fas fa-heart me-2"></i>
                      <strong>Thank you for your interest!</strong> Your contributions help make education accessible to everyone worldwide.
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <h6>Translation Guidelines</h6>
                        <ul className="small text-muted">
                          <li>Keep translations natural and conversational</li>
                          <li>Maintain the same tone as the original text</li>
                          <li>Use appropriate technical terminology</li>
                          <li>Consider cultural context and local conventions</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6>How to Contribute</h6>
                        <ul className="small text-muted">
                          <li>Select a language you know well</li>
                          <li>Review existing translations for consistency</li>
                          <li>Submit your translations for community review</li>
                          <li>Help verify and improve existing translations</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button className="btn btn-success me-2">
                        <i className="fas fa-plus me-2"></i>
                        Start Contributing
                      </button>
                      <button className="btn btn-outline-info">
                        <i className="fas fa-question-circle me-2"></i>
                        View Guidelines
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Translation Status
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6>Overall Progress</h6>
                  <div className="progress mb-2">
                    <div className="progress-bar bg-success" style={{width: '85%'}}></div>
                  </div>
                  <small className="text-muted">85% of platform content translated</small>
                </div>

                <div className="mb-3">
                  <h6>Priority Languages</h6>
                  <div className="priority-languages">
                    {['es', 'fr', 'de', 'pt', 'zh'].map(code => (
                      <div key={code} className="d-flex align-items-center mb-2">
                        <span className="me-2">{languages[code].flag}</span>
                        <span className="small">{languages[code].nativeName}</span>
                        <span className={`badge bg-${getTranslationProgress(languages[code].completion).color} ms-auto small`}>
                          {languages[code].completion}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <h6>Community Stats</h6>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-number">1,247</div>
                      <div className="stat-label small">Contributors</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">45,892</div>
                      <div className="stat-label small">Translations</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">12</div>
                      <div className="stat-label small">Languages</div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info">
                  <i className="fas fa-lightbulb me-2"></i>
                  <strong>Did you know?</strong> OpenEdTex supports right-to-left languages like Arabic, ensuring a native experience for all users.
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-question-circle me-2"></i>
                  Need Help?
                </h5>
              </div>
              <div className="card-body">
                <p className="small text-muted mb-2">
                  Having trouble with translations or want to report an issue?
                </p>
                <ul className="small text-muted">
                  <li>Report translation errors</li>
                  <li>Suggest improvements</li>
                  <li>Join translation discussions</li>
                  <li>Contact localization team</li>
                </ul>
                <button className="btn btn-sm btn-outline-primary w-100">
                  <i className="fas fa-envelope me-2"></i>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .language-card {
          padding: 15px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .language-card:hover {
          border-color: #007bff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .language-card.active {
          border-color: #007bff;
          background-color: #f8f9ff;
        }

        .flag-icon {
          font-size: 1.5rem;
        }

        .contribute-section {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
        }

        .priority-languages {
          max-height: 150px;
          overflow-y: auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          text-align: center;
        }

        .stat-item {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 5px;
        }

        .stat-number {
          font-size: 1.2rem;
          font-weight: bold;
          color: #007bff;
        }

        .stat-label {
          color: #6c757d;
        }

        .rtl {
          direction: rtl;
        }

        .rtl .card {
          text-align: right;
        }
      `}</style>
    </div>
  )
}

export default InternationalizationSettings
