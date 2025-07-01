-- ShatziiOS Unified Authentication Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),  -- Hashed password
  google_id VARCHAR(255) UNIQUE,  -- For Google OAuth
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  profile_image VARCHAR(255),
  role VARCHAR(50) NOT NULL,  -- 'student', 'parent', 'educator', 'admin'
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,  -- 'primary', 'secondary', 'law', 'language'
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Initial school data
INSERT INTO schools (id, name, code, description) VALUES
  ('7b61c6d0-8e1a-4d95-9a67-c6d3b1fe6944', 'K-6 Primary School', 'primary', 'ShatziiOS Primary School for grades K-6 with superhero theme'),
  ('9c42a8d3-7f2b-4e84-a5c8-d9e1f0b3e2a1', 'Secondary School (7-12)', 'secondary', 'ShatziiOS Secondary School for grades 7-12'),
  ('5a3b7d9e-6f1c-4b2d-9e3a-5f7c8d9b1a2e', 'The Lawyer Makers', 'law', 'ShatziiOS Law School for aspiring legal professionals'),
  ('3e4f5d6c-7b8a-9d0e-1f2d-3a4b5c6d7e8f', 'Language Learning School', 'language', 'ShatziiOS Language School for multilingual education')
ON CONFLICT (code) DO NOTHING;

-- User school access table (many-to-many)
CREATE TABLE IF NOT EXISTS user_school_access (
  user_id VARCHAR(36) NOT NULL,
  school_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, school_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- User learning profiles table
CREATE TABLE IF NOT EXISTS learning_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  profile_data JSONB NOT NULL,  -- Stores learning style, preferences, strengths, challenges
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- School-specific user data table
CREATE TABLE IF NOT EXISTS user_school_data (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  school_id VARCHAR(36) NOT NULL,
  progress_data JSONB,  -- Stores course progress, achievements, etc.
  preferences JSONB,  -- School-specific user preferences
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  UNIQUE (user_id, school_id)
);

-- Sessions table for express-session storage
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR(255) PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_sessions_expire ON sessions(expire);

-- Parents and students relationship table
CREATE TABLE IF NOT EXISTS parent_student_relationships (
  parent_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  relationship_type VARCHAR(50) NOT NULL,  -- 'parent', 'guardian', etc.
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (parent_id, student_id),
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_school_access_user_id ON user_school_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_school_access_school_id ON user_school_access(school_id);
CREATE INDEX IF NOT EXISTS idx_learning_profiles_user_id ON learning_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_school_data_user_id ON user_school_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_school_data_school_id ON user_school_data(school_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_parent_id ON parent_student_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student_id ON parent_student_relationships(student_id);