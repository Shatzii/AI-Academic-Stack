import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer-modern">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <h3>OpenEdTex</h3>
              <p>Transforming Education Through AI</p>
            </div>
            <p className="footer-description">
              Experience the future of learning with our AI-powered platform.
              Interactive courses, real-time collaboration, and personalized learning paths.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><Link to="/courses">Browse Courses</Link></li>
              <li><Link to="/ai/chat">AI Study Assistant</Link></li>
              <li><Link to="/classrooms">Live Classrooms</Link></li>
              <li><Link to="/study-groups">Study Groups</Link></li>
              <li><Link to="/analytics">Learning Analytics</Link></li>
              <li><Link to="/mobile">Mobile App</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/tutorials">Tutorials</Link></li>
              <li><Link to="/system-status">System Status</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/gdpr">GDPR</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h4>Stay Updated</h4>
            <p>Get the latest news about new courses, platform updates, and educational insights.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button className="btn-modern btn-primary-modern newsletter-btn">
                Subscribe
                <i className="fas fa-paper-plane ms-2"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 OpenEdTex. All rights reserved.
            </p>
            <div className="footer-badges">
              <span className="badge-modern badge-small">
                <i className="fas fa-shield-alt me-1"></i>
                Secure
              </span>
              <span className="badge-modern badge-small">
                <i className="fas fa-lock me-1"></i>
                GDPR Compliant
              </span>
              <span className="badge-modern badge-small">
                <i className="fas fa-mobile-alt me-1"></i>
                Mobile Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
