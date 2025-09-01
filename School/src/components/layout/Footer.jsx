import React from 'react'
import { useBranding } from '../../context/BrandingContext.jsx'

const Footer = () => {
  const { branding } = useBranding()

  return (
    <footer className="footer bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5 className="mb-3">
              {branding?.small_logo_url && (
                <img
                  src={branding.small_logo_url}
                  alt={branding.school_name}
                  height="24"
                  className="me-2"
                />
              )}
              <i className="fas fa-graduation-cap me-2"></i>
              {branding?.school_name || 'OpenEdTex'}
            </h5>
            <p className="mb-3">
              {branding?.school_tagline || 'AI-powered educational platform for the future of learning. Transform your educational experience with intelligent tools and real-time collaboration.'}
            </p>
            <div className="social-links">
              {branding?.facebook_url && (
                <a href={branding.facebook_url} className="text-light me-3" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook fa-lg"></i>
                </a>
              )}
              {branding?.twitter_url && (
                <a href={branding.twitter_url} className="text-light me-3" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter fa-lg"></i>
                </a>
              )}
              {branding?.linkedin_url && (
                <a href={branding.linkedin_url} className="text-light me-3" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin fa-lg"></i>
                </a>
              )}
              {branding?.instagram_url && (
                <a href={branding.instagram_url} className="text-light me-3" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram fa-lg"></i>
                </a>
              )}
            </div>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="mb-3">Platform</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Courses</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Classrooms</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">AI Assistant</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Analytics</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Documentation</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">API Reference</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Help Center</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Community</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="mb-3">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">About Us</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Careers</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Contact</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">FAQ</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Tutorials</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Status</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Feedback</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">
              {branding?.footer_text || `&copy; ${new Date().getFullYear()} OpenEdTex. All rights reserved.`}
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">
              Powered by AI • Built with ❤️ for Education
            </small>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
