import React, { useState } from 'react';
import { useNavigate, useLocation } from 'wouter';
import axios from 'axios';

/**
 * Login form component for unified authentication across all schools
 */
const LoginForm = ({ onSuccess, redirectTo = '/' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.status === 200) {
        // Login successful
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Redirect to specified location or dashboard
        setLocation(redirectTo);
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || 'Login failed. Please try again.');
      } else if (err.request) {
        // Request made but no response received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other errors
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-form login-form">
      <h2>Log In to ShatziiOS</h2>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>
      
      <div className="auth-separator">
        <span>or</span>
      </div>
      
      <div className="social-auth">
        <a href="/api/auth/google" className="btn btn-google">
          <i className="google-icon"></i>
          Log in with Google
        </a>
      </div>
      
      <div className="auth-links">
        <a href="#forgot-password" className="auth-link">Forgot your password?</a>
        <span className="auth-link-separator">•</span>
        <a href="#register" className="auth-link">Need an account? Sign up</a>
      </div>
    </div>
  );
};

export default LoginForm;