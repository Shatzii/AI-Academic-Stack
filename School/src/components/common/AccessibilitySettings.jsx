import { useState, useEffect } from 'react'
// import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const AccessibilitySettings = () => {
  // const { user } = useAuth()
  // const dispatch = useDispatch()

  // Accessibility settings state
  const [settings, setSettings] = useState({
    // Visual
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    colorBlindMode: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia'

    // Audio
    screenReader: false,
    audioDescriptions: false,
    captions: true,

    // Motor
    keyboardNavigation: true,
    stickyKeys: false,
    slowKeys: false,

    // Cognitive
    simplifiedInterface: false,
    autoSave: true,
    focusMode: false,

    // Language
    textToSpeech: false,
    speechToText: false,
    language: 'en'
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAccessibilitySettings()
  }, [])

  const loadAccessibilitySettings = async () => {
    // Mock API call - in real app, this would load user's accessibility preferences
    const mockSettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      colorBlindMode: 'none',
      screenReader: false,
      audioDescriptions: false,
      captions: true,
      keyboardNavigation: true,
      stickyKeys: false,
      slowKeys: false,
      simplifiedInterface: false,
      autoSave: true,
      focusMode: false,
      textToSpeech: false,
      speechToText: false,
      language: 'en'
    }
    setSettings(mockSettings)
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // Mock API call - in real app, this would save settings to backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Apply settings to document
      applyAccessibilitySettings(settings)

      toast.success('Accessibility settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save accessibility settings')
    } finally {
      setLoading(false)
    }
  }

  const applyAccessibilitySettings = (newSettings) => {
    const root = document.documentElement

    // High contrast mode
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Color blind mode
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia')
    if (newSettings.colorBlindMode !== 'none') {
      root.classList.add(newSettings.colorBlindMode)
    }

    // Simplified interface
    if (newSettings.simplifiedInterface) {
      root.classList.add('simplified')
    } else {
      root.classList.remove('simplified')
    }

    // Focus mode
    if (newSettings.focusMode) {
      root.classList.add('focus-mode')
    } else {
      root.classList.remove('focus-mode')
    }
  }

  const resetToDefaults = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      colorBlindMode: 'none',
      screenReader: false,
      audioDescriptions: false,
      captions: true,
      keyboardNavigation: true,
      stickyKeys: false,
      slowKeys: false,
      simplifiedInterface: false,
      autoSave: true,
      focusMode: false,
      textToSpeech: false,
      speechToText: false,
      language: 'en'
    }
    setSettings(defaultSettings)
    applyAccessibilitySettings(defaultSettings)
    toast.success('Settings reset to defaults')
  }

  const testAccessibility = () => {
    // Test screen reader
    if (settings.screenReader) {
      const utterance = new SpeechSynthesisUtterance('Screen reader test: This is how text will be read aloud.')
      window.speechSynthesis.speak(utterance)
    }

    // Test high contrast
    if (settings.highContrast) {
      toast.success('High contrast mode is active')
    }

    // Test keyboard navigation
    if (settings.keyboardNavigation) {
      document.querySelector('.test-keyboard')?.focus()
      toast.success('Keyboard navigation test: Try using Tab key')
    }
  }

  return (
    <div className="accessibility-page">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-primary mb-2">
              <i className="fas fa-universal-access me-2"></i>
              Accessibility Settings
            </h1>
            <p className="text-muted">Customize your learning experience for optimal accessibility</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Visual Accessibility */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-eye me-2"></i>
                  Visual Accessibility
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="highContrast"
                        checked={settings.highContrast}
                        onChange={(e) => updateSetting('highContrast', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="highContrast">
                        <strong>High Contrast Mode</strong>
                        <br />
                        <small className="text-muted">Increase contrast for better visibility</small>
                      </label>
                    </div>

                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="largeText"
                        checked={settings.largeText}
                        onChange={(e) => updateSetting('largeText', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="largeText">
                        <strong>Large Text</strong>
                        <br />
                        <small className="text-muted">Increase font size throughout the application</small>
                      </label>
                    </div>

                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="reducedMotion"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="reducedMotion">
                        <strong>Reduced Motion</strong>
                        <br />
                        <small className="text-muted">Minimize animations and transitions</small>
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="colorBlindMode" className="form-label">
                        <strong>Color Blind Mode</strong>
                      </label>
                      <select
                        className="form-select"
                        id="colorBlindMode"
                        value={settings.colorBlindMode}
                        onChange={(e) => updateSetting('colorBlindMode', e.target.value)}
                      >
                        <option value="none">None</option>
                        <option value="protanopia">Protanopia (Red-Green)</option>
                        <option value="deuteranopia">Deuteranopia (Red-Green)</option>
                        <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
                      </select>
                      <small className="text-muted">Adjust colors for different types of color blindness</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Accessibility */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-volume-up me-2"></i>
                  Audio Accessibility
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="screenReader"
                        checked={settings.screenReader}
                        onChange={(e) => updateSetting('screenReader', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="screenReader">
                        <strong>Screen Reader Support</strong>
                        <br />
                        <small className="text-muted">Enable text-to-speech for screen readers</small>
                      </label>
                    </div>

                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="audioDescriptions"
                        checked={settings.audioDescriptions}
                        onChange={(e) => updateSetting('audioDescriptions', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="audioDescriptions">
                        <strong>Audio Descriptions</strong>
                        <br />
                        <small className="text-muted">Provide audio descriptions for visual content</small>
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="captions"
                        checked={settings.captions}
                        onChange={(e) => updateSetting('captions', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="captions">
                        <strong>Captions</strong>
                        <br />
                        <small className="text-muted">Show captions for video content</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Motor Accessibility */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-hand-paper me-2"></i>
                  Motor Accessibility
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="keyboardNavigation"
                        checked={settings.keyboardNavigation}
                        onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="keyboardNavigation">
                        <strong>Keyboard Navigation</strong>
                        <br />
                        <small className="text-muted">Navigate using keyboard shortcuts</small>
                      </label>
                    </div>

                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="stickyKeys"
                        checked={settings.stickyKeys}
                        onChange={(e) => updateSetting('stickyKeys', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="stickyKeys">
                        <strong>Sticky Keys</strong>
                        <br />
                        <small className="text-muted">Press modifier keys one at a time</small>
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="slowKeys"
                        checked={settings.slowKeys}
                        onChange={(e) => updateSetting('slowKeys', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="slowKeys">
                        <strong>Slow Keys</strong>
                        <br />
                        <small className="text-muted">Require keys to be held longer to register</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cognitive Accessibility */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-brain me-2"></i>
                  Cognitive Accessibility
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="simplifiedInterface"
                        checked={settings.simplifiedInterface}
                        onChange={(e) => updateSetting('simplifiedInterface', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="simplifiedInterface">
                        <strong>Simplified Interface</strong>
                        <br />
                        <small className="text-muted">Reduce visual clutter and complexity</small>
                      </label>
                    </div>

                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="autoSave"
                        checked={settings.autoSave}
                        onChange={(e) => updateSetting('autoSave', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="autoSave">
                        <strong>Auto-save Progress</strong>
                        <br />
                        <small className="text-muted">Automatically save your work</small>
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="focusMode"
                        checked={settings.focusMode}
                        onChange={(e) => updateSetting('focusMode', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="focusMode">
                        <strong>Focus Mode</strong>
                        <br />
                        <small className="text-muted">Minimize distractions while studying</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-language me-2"></i>
                  Language & Communication
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="textToSpeech"
                        checked={settings.textToSpeech}
                        onChange={(e) => updateSetting('textToSpeech', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="textToSpeech">
                        <strong>Text-to-Speech</strong>
                        <br />
                        <small className="text-muted">Read text aloud</small>
                      </label>
                    </div>

                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="speechToText"
                        checked={settings.speechToText}
                        onChange={(e) => updateSetting('speechToText', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="speechToText">
                        <strong>Speech-to-Text</strong>
                        <br />
                        <small className="text-muted">Convert speech to text</small>
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="language" className="form-label">
                        <strong>Interface Language</strong>
                      </label>
                      <select
                        className="form-select"
                        id="language"
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                        <option value="pt">Português</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                      </select>
                      <small className="text-muted">Choose your preferred language</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 mb-4">
              <button
                className="btn btn-primary"
                onClick={saveSettings}
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
                    Save Settings
                  </>
                )}
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={resetToDefaults}
              >
                <i className="fas fa-undo me-2"></i>
                Reset to Defaults
              </button>

              <button
                className="btn btn-outline-info"
                onClick={testAccessibility}
              >
                <i className="fas fa-play me-2"></i>
                Test Settings
              </button>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Accessibility Information
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6>WCAG Compliance</h6>
                  <p className="small text-muted">
                    These settings help ensure our platform meets WCAG 2.1 AA standards for accessibility.
                  </p>
                </div>

                <div className="mb-3">
                  <h6>Keyboard Shortcuts</h6>
                  <ul className="small text-muted">
                    <li><kbd>Tab</kbd> - Navigate between elements</li>
                    <li><kbd>Enter</kbd> - Activate buttons/links</li>
                    <li><kbd>Space</kbd> - Toggle checkboxes</li>
                    <li><kbd>Esc</kbd> - Close modals/dropdowns</li>
                  </ul>
                </div>

                <div className="mb-3">
                  <h6>Screen Reader Support</h6>
                  <p className="small text-muted">
                    Compatible with NVDA, JAWS, VoiceOver, and other popular screen readers.
                  </p>
                </div>

                <div className="alert alert-info">
                  <i className="fas fa-lightbulb me-2"></i>
                  <strong>Tip:</strong> Test your settings with different content types to ensure optimal accessibility.
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
                  If you need assistance with accessibility settings or have specific requirements:
                </p>
                <ul className="small text-muted">
                  <li>Contact our support team</li>
                  <li>Visit our accessibility documentation</li>
                  <li>Join our accessibility community forum</li>
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
    </div>
  )
}

export default AccessibilitySettings
