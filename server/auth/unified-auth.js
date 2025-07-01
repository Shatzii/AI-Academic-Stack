/**
 * ShatziiOS Unified Authentication System
 * 
 * This module provides authentication services across all schools within
 * the ShatziiOS platform, enabling single sign-on, role-based access,
 * and persistent user profiles.
 */

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Database connection
const db = require('../db');

// User roles enum
const UserRoles = {
  STUDENT: 'student',
  PARENT: 'parent',
  EDUCATOR: 'educator',
  ADMIN: 'admin'
};

// Schools enum
const Schools = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  LAW: 'law',
  LANGUAGE: 'language'
};

// Initialize authentication router
const authRouter = express.Router();

/**
 * Configure session management
 * @param {Object} app - Express application
 */
function setupSession(app) {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'shatzii-development-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    name: 'shatzii.sid'
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
}

/**
 * Configure passport authentication strategies
 */
function configurePassport() {
  // Local strategy for username/password authentication
  passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (!user || user.length === 0) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect email or password' });
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user[0];
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Google OAuth strategy for SSO
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
        
        if (!user || user.length === 0) {
          // Create new user
          const newUser = {
            id: uuidv4(),
            google_id: profile.id,
            email: profile.emails[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            profile_image: profile.photos[0].value,
            role: UserRoles.STUDENT, // Default role
            created_at: new Date(),
            updated_at: new Date()
          };
          
          // Insert new user
          user = await db.query(
            'INSERT INTO users (id, google_id, email, first_name, last_name, profile_image, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [newUser.id, newUser.google_id, newUser.email, newUser.first_name, newUser.last_name, newUser.profile_image, newUser.role, newUser.created_at, newUser.updated_at]
          );
        }
        
        return done(null, user[0]);
      } catch (error) {
        return done(error);
      }
    }));
  }

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      if (!user || user.length === 0) {
        return done(null, false);
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user[0];
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });
}

/**
 * Register authentication routes
 */
function registerAuthRoutes() {
  // Local authentication routes
  
  // Register new user
  authRouter.post('/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      
      // Check if user already exists
      const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser && existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const newUser = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        role: role || UserRoles.STUDENT,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Insert new user
      const user = await db.query(
        'INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [newUser.id, newUser.email, newUser.password, newUser.first_name, newUser.last_name, newUser.role, newUser.created_at, newUser.updated_at]
      );
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user[0];
      
      // Log in user
      req.login(userWithoutPassword, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging in' });
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Login user
  authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    })(req, res, next);
  });
  
  // Logout user
  authRouter.post('/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
  
  // Get current user
  authRouter.get('/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json(req.user);
  });
  
  // Google OAuth routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    
    authRouter.get('/google/callback', 
      passport.authenticate('google', { failureRedirect: '/login' }),
      (req, res) => {
        // Successful authentication, redirect to dashboard or requested page
        const redirectTo = req.session.returnTo || '/dashboard';
        delete req.session.returnTo;
        res.redirect(redirectTo);
      }
    );
  }
  
  // Update user profile
  authRouter.put('/user', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      const { firstName, lastName, email } = req.body;
      
      // Update user
      const updatedUser = await db.query(
        'UPDATE users SET first_name = $1, last_name = $2, email = $3, updated_at = $4 WHERE id = $5 RETURNING *',
        [firstName, lastName, email, new Date(), req.user.id]
      );
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser[0];
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Change password
  authRouter.put('/change-password', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Get user with password
      const user = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      
      // Check current password
      const isMatch = await bcrypt.compare(currentPassword, user[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update password
      await db.query(
        'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3',
        [hashedPassword, new Date(), req.user.id]
      );
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // School access management
  authRouter.get('/school-access', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      // Get user's school access
      const schoolAccess = await db.query(
        'SELECT school_id FROM user_school_access WHERE user_id = $1',
        [req.user.id]
      );
      
      res.json(schoolAccess.map(access => access.school_id));
    } catch (error) {
      console.error('School access error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // School-specific data
  authRouter.get('/user-data/:school', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      const { school } = req.params;
      
      // Validate school parameter
      if (!Object.values(Schools).includes(school)) {
        return res.status(400).json({ message: 'Invalid school' });
      }
      
      // Get user's school-specific data
      const userData = await db.query(
        'SELECT * FROM user_school_data WHERE user_id = $1 AND school_id = $2',
        [req.user.id, school]
      );
      
      if (!userData || userData.length === 0) {
        return res.status(404).json({ message: 'No data found' });
      }
      
      res.json(userData[0]);
    } catch (error) {
      console.error('User school data error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  return authRouter;
}

/**
 * Authorization middleware for role-based route protection
 * @param {string[]} roles - Allowed roles
 * @returns {Function} Middleware function
 */
function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    next();
  };
}

/**
 * School access middleware for school-specific route protection
 * @param {string} school - School identifier
 * @returns {Function} Middleware function
 */
function requireSchoolAccess(school) {
  return async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      // Check user's school access
      const schoolAccess = await db.query(
        'SELECT school_id FROM user_school_access WHERE user_id = $1 AND school_id = $2',
        [req.user.id, school]
      );
      
      if (!schoolAccess || schoolAccess.length === 0) {
        return res.status(403).json({ message: 'No access to this school' });
      }
      
      next();
    } catch (error) {
      console.error('School access check error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
}

// Export authentication functions
module.exports = {
  setupSession,
  configurePassport,
  registerAuthRoutes,
  authorize,
  requireSchoolAccess,
  UserRoles,
  Schools
};