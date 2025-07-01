import { Pool, Client } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

interface SchoolData {
  id: string;
  name: string;
  theme: string;
  config: Record<string, any>;
}

export class DatabaseManager {
  private pool: Pool;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async initialize(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      // Create main tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(20) DEFAULT 'student',
          school_access TEXT[] DEFAULT '{}',
          learning_profile JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login_at TIMESTAMP,
          is_active BOOLEAN DEFAULT true
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS schools (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          theme VARCHAR(50) NOT NULL,
          subdomain VARCHAR(50) UNIQUE NOT NULL,
          config JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS curriculum (
          id SERIAL PRIMARY KEY,
          school_id VARCHAR(50) REFERENCES schools(id),
          grade_level VARCHAR(10),
          subject VARCHAR(50),
          title TEXT NOT NULL,
          content JSONB NOT NULL,
          standards TEXT[],
          adaptations JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS user_progress (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          curriculum_id INTEGER REFERENCES curriculum(id),
          completion_percentage DECIMAL(5,2) DEFAULT 0.00,
          last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          performance_data JSONB DEFAULT '{}'
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          session_token TEXT UNIQUE NOT NULL,
          refresh_token TEXT UNIQUE NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT true
        )
      `);

      // Create indexes for performance
      await client.query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_curriculum_school ON curriculum(school_id)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token)`);

      console.log('Database initialization completed successfully');
    } finally {
      client.release();
    }
  }

  async seedDefaultData(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      // Insert default schools
      const schools: SchoolData[] = [
        {
          id: 'primary-school',
          name: 'SuperHero Academy',
          theme: 'superhero',
          config: {
            ageRange: '5-11',
            primaryColor: '#4299E1',
            features: ['interactive-stories', 'visual-learning', 'adaptive-pace']
          }
        },
        {
          id: 'secondary-school',
          name: 'Secondary School',
          theme: 'mature',
          config: {
            ageRange: '12-18',
            primaryColor: '#7C3AED',
            features: ['project-based', 'self-paced', 'career-focused']
          }
        },
        {
          id: 'law-school',
          name: 'Law School',
          theme: 'professional',
          config: {
            ageRange: '18+',
            primaryColor: '#1E40AF',
            features: ['case-studies', 'simulations', 'legal-writing']
          }
        },
        {
          id: 'language-school',
          name: 'Language School',
          theme: 'global',
          config: {
            ageRange: 'all',
            primaryColor: '#059669',
            languages: ['english', 'german', 'spanish'],
            features: ['conversation', 'cultural-context', 'practical-usage']
          }
        }
      ];

      for (const school of schools) {
        await client.query(
          `INSERT INTO schools (id, name, theme, subdomain, config) 
           VALUES ($1, $2, $3, $4, $5) 
           ON CONFLICT (id) DO UPDATE SET 
           name = $2, theme = $3, subdomain = $4, config = $5`,
          [school.id, school.name, school.theme, school.id.replace('-school', ''), school.config]
        );
      }

      // Create default admin user
      const bcrypt = require('bcryptjs');
      const adminPasswordHash = await bcrypt.hash('admin123', 12);
      
      await client.query(
        `INSERT INTO users (username, email, password_hash, role, school_access) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (username) DO NOTHING`,
        ['admin', 'admin@universaloneschool.com', adminPasswordHash, 'admin', ['all']]
      );

      // Create demo student user
      const studentPasswordHash = await bcrypt.hash('student123', 12);
      
      await client.query(
        `INSERT INTO users (username, email, password_hash, role, school_access, learning_profile) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (username) DO NOTHING`,
        [
          'student', 
          'student@universaloneschool.com', 
          studentPasswordHash, 
          'student', 
          ['primary-school', 'secondary-school'],
          { type: 'typical', adaptations: ['visual-supports', 'extended-time'] }
        ]
      );

      console.log('Default data seeded successfully');
    } finally {
      client.release();
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async getUserByUsername(username: string): Promise<any> {
    const result = await this.query(
      'SELECT * FROM users WHERE username = $1 AND is_active = true',
      [username]
    );
    return result.rows[0] || null;
  }

  async createUser(userData: any): Promise<any> {
    const result = await this.query(
      `INSERT INTO users (username, email, password_hash, role, school_access, learning_profile) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        userData.username,
        userData.email,
        userData.passwordHash,
        userData.role || 'student',
        userData.schoolAccess || [],
        userData.learningProfile || null
      ]
    );
    return result.rows[0];
  }

  async updateUserLastLogin(userId: number): Promise<void> {
    await this.query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  }

  async getSchools(): Promise<any[]> {
    const result = await this.query(
      'SELECT * FROM schools WHERE is_active = true ORDER BY name'
    );
    return result.rows;
  }

  async getCurriculumBySchool(schoolId: string, gradeLevel?: string): Promise<any[]> {
    let query = 'SELECT * FROM curriculum WHERE school_id = $1';
    const params = [schoolId];
    
    if (gradeLevel) {
      query += ' AND grade_level = $2';
      params.push(gradeLevel);
    }
    
    query += ' ORDER BY subject, title';
    
    const result = await this.query(query, params);
    return result.rows;
  }

  async getUserProgress(userId: number, schoolId?: string): Promise<any[]> {
    let query = `
      SELECT up.*, c.title, c.subject, c.grade_level, s.name as school_name
      FROM user_progress up
      JOIN curriculum c ON up.curriculum_id = c.id
      JOIN schools s ON c.school_id = s.id
      WHERE up.user_id = $1
    `;
    const params = [userId];
    
    if (schoolId) {
      query += ' AND c.school_id = $2';
      params.push(schoolId);
    }
    
    query += ' ORDER BY up.last_accessed DESC';
    
    const result = await this.query(query, params);
    return result.rows;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Global database instance
export const dbManager = new DatabaseManager({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'universal_one_school',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production'
});