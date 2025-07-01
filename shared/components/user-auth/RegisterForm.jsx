import React, { useState } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';

/**
 * Registration form component for unified authentication across all schools
 */
const RegisterForm = ({ onSuccess, redirectTo = '/' }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        role: 'student' // Default role
      });
      
      if (response.status === 201) {
        // Registration successful
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Redirect to specified location or dashboard
        setLocation(redirectTo);
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || 'Registration failed. Please try again.');
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
    <div className="auth-form register-form">
      <h2>Create Your ShatziiOS Account</h2>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Enter your first name"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Enter your last name"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="register-email">Email Address</label>
          <input
            type="email"
            id="register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            type="password"
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            disabled={isLoading}
          />
          <small className="form-text">Password must be at least 8 characters long</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
      
      <div className="auth-separator">
        <span>or</span>
      </div>
      
      <div className="social-auth">
        <a href="/api/auth/google" className="btn btn-google">
          <i className="google-icon"></i>
          Sign up with Google
        </a>
      </div>
      
      <div className="auth-links">
        <span>Already have an account?</span>
        <a href="#login" className="auth-link">Log in</a>
      </div>
    </div>
  );
};

export default RegisterForm;