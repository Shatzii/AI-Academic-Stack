/**
 * SpacePharaoh Master Admin Authentication System
 * 
 * Provides master administrative access across all schools and specialized
 * admin logins for each individual school with appropriate permissions
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class SpacePharaohAuthSystem {
  constructor() {
    this.masterAdmins = new Map();
    this.schoolAdmins = new Map();
    this.sessions = new Map();
    this.initializeAdmins();
  }

  async initializeAdmins() {
    // SpacePharaoh Master Admin - Full platform control
    const spacePharaohPassword = await bcrypt.hash('SpacePharaoh_Master_2025!', 12);
    this.masterAdmins.set('spacepharaoh', {
      id: 'spacepharaoh_master',
      username: 'spacepharaoh',
      email: 'spacepharaoh@universaloneschool.com',
      password: spacePharaohPassword,
      role: 'super_admin',
      permissions: [
        'platform_management',
        'all_schools_access',
        'user_management',
        'system_configuration',
        'security_management',
        'financial_oversight',
        'deployment_control',
        'ai_engine_control',
        'global_analytics',
        'emergency_access'
      ],
      schools: ['all'],
      created_at: new Date(),
      last_login: null,
      status: 'active'
    });

    // SuperHero School (K-6) Admin
    const heroAdminPassword = await bcrypt.hash('HeroAdmin_2025!', 12);
    this.schoolAdmins.set('hero_admin', {
      id: 'hero_admin_001',
      username: 'hero_admin',
      email: 'admin@superheroschool.com',
      password: heroAdminPassword,
      role: 'school_admin',
      school: 'superhero_school',
      school_name: 'SuperHero School (K-6)',
      permissions: [
        'student_management',
        'teacher_management',
        'curriculum_oversight',
        'progress_tracking',
        'parent_communication',
        'achievement_system',
        'neurodivergent_support',
        'gamification_control'
      ],
      grade_levels: ['K', '1', '2', '3', '4', '5', '6'],
      created_at: new Date(),
      last_login: null,
      status: 'active'
    });

    // Stage Prep School (7-12) Admin
    const stageAdminPassword = await bcrypt.hash('StageAdmin_2025!', 12);
    this.schoolAdmins.set('stage_admin', {
      id: 'stage_admin_001',
      username: 'stage_admin',
      email: 'admin@stageprepschool.com',
      password: stageAdminPassword,
      role: 'school_admin',
      school: 'stage_prep_school',
      school_name: 'Stage Prep School (7-12)',
      permissions: [
        'student_management',
        'teacher_management',
        'curriculum_oversight',
        'progress_tracking',
        'parent_communication',
        'theater_program_management',
        'graduation_tracking',
        'college_prep_oversight',
        'block_scheduling'
      ],
      grade_levels: ['7', '8', '9', '10', '11', '12'],
      created_at: new Date(),
      last_login: null,
      status: 'active'
    });

    // The Lawyer Makers (Law School) Admin
    const lawAdminPassword = await bcrypt.hash('LawAdmin_2025!', 12);
    this.schoolAdmins.set('law_admin', {
      id: 'law_admin_001',
      username: 'law_admin',
      email: 'admin@thelawyermakers.com',
      password: lawAdminPassword,
      role: 'school_admin',
      school: 'lawyer_makers',
      school_name: 'The Lawyer Makers (Law School)',
      permissions: [
        'student_management',
        'faculty_management',
        'curriculum_oversight',
        'bar_exam_tracking',
        'clinic_management',
        'career_services',
        'moot_court_oversight',
        'law_review_management',
        'internship_coordination'
      ],
      programs: ['JD', 'LLM', 'Certificate Programs'],
      created_at: new Date(),
      last_login: null,
      status: 'active'
    });

    // Global Language Academy Admin
    const languageAdminPassword = await bcrypt.hash('LinguaAdmin_2025!', 12);
    this.schoolAdmins.set('language_admin', {
      id: 'language_admin_001',
      username: 'language_admin',
      email: 'admin@globallanguageacademy.com',
      password: languageAdminPassword,
      role: 'school_admin',
      school: 'global_language_academy',
      school_name: 'Global Language Academy',
      permissions: [
        'student_management',
        'instructor_management',
        'curriculum_oversight',
        'language_assessment',
        'cultural_program_management',
        'exchange_coordination',
        'certification_tracking',
        'immersion_programs'
      ],
      languages: ['English', 'Spanish', 'German', 'French', 'Mandarin'],
      created_at: new Date(),
      last_login: null,
      status: 'active'
    });

    console.log('🔐 SpacePharaoh Admin System Initialized');
    console.log('👑 Master Admin: spacepharaoh');
    console.log('🦸 SuperHero School Admin: hero_admin');
    console.log('🎭 Stage Prep School Admin: stage_admin');
    console.log('⚖️ Law School Admin: law_admin');
    console.log('🌍 Language Academy Admin: language_admin');
  }

  async authenticate(username, password, schoolContext = null) {
    try {
      // Check master admin first
      if (this.masterAdmins.has(username)) {
        const admin = this.masterAdmins.get(username);
        const isValidPassword = await bcrypt.compare(password, admin.password);
        
        if (isValidPassword && admin.status === 'active') {
          const token = this.generateToken(admin);
          admin.last_login = new Date();
          
          return {
            success: true,
            user: {
              id: admin.id,
              username: admin.username,
              email: admin.email,
              role: admin.role,
              permissions: admin.permissions,
              schools: admin.schools,
              isMasterAdmin: true
            },
            token,
            message: 'SpacePharaoh master authentication successful'
          };
        }
      }

      // Check school admins
      if (this.schoolAdmins.has(username)) {
        const admin = this.schoolAdmins.get(username);
        const isValidPassword = await bcrypt.compare(password, admin.password);
        
        if (isValidPassword && admin.status === 'active') {
          const token = this.generateToken(admin);
          admin.last_login = new Date();
          
          return {
            success: true,
            user: {
              id: admin.id,
              username: admin.username,
              email: admin.email,
              role: admin.role,
              school: admin.school,
              school_name: admin.school_name,
              permissions: admin.permissions,
              grade_levels: admin.grade_levels,
              programs: admin.programs,
              languages: admin.languages,
              isMasterAdmin: false
            },
            token,
            message: `${admin.school_name} admin authentication successful`
          };
        }
      }

      return {
        success: false,
        message: 'Invalid credentials or account inactive'
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: 'Authentication system error'
      };
    }
  }

  generateToken(admin) {
    const payload = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      school: admin.school || 'all',
      permissions: admin.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'spacepharaoh_universal_secret_key_2025', {
      algorithm: 'HS256'
    });
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'spacepharaoh_universal_secret_key_2025');
      return {
        valid: true,
        payload: decoded
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  hasPermission(user, permission, context = {}) {
    // Master admin has all permissions
    if (user.role === 'super_admin' && user.permissions.includes('platform_management')) {
      return true;
    }

    // School admin permissions
    if (user.role === 'school_admin') {
      // Check if user has the specific permission
      if (!user.permissions.includes(permission)) {
        return false;
      }

      // Check school context if provided
      if (context.school && user.school !== context.school) {
        return false;
      }

      return true;
    }

    return false;
  }

  getAllAdmins() {
    const admins = [];
    
    // Add master admins
    for (const [username, admin] of this.masterAdmins) {
      admins.push({
        username,
        email: admin.email,
        role: admin.role,
        school: 'All Schools',
        status: admin.status,
        last_login: admin.last_login,
        isMasterAdmin: true
      });
    }

    // Add school admins
    for (const [username, admin] of this.schoolAdmins) {
      admins.push({
        username,
        email: admin.email,
        role: admin.role,
        school: admin.school_name,
        status: admin.status,
        last_login: admin.last_login,
        isMasterAdmin: false
      });
    }

    return admins;
  }

  getSchoolAccess(username) {
    if (this.masterAdmins.has(username)) {
      return {
        schools: ['all'],
        permissions: this.masterAdmins.get(username).permissions
      };
    }

    if (this.schoolAdmins.has(username)) {
      const admin = this.schoolAdmins.get(username);
      return {
        school: admin.school,
        school_name: admin.school_name,
        permissions: admin.permissions
      };
    }

    return null;
  }

  async resetPassword(username, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    if (this.masterAdmins.has(username)) {
      this.masterAdmins.get(username).password = hashedPassword;
      return true;
    }

    if (this.schoolAdmins.has(username)) {
      this.schoolAdmins.get(username).password = hashedPassword;
      return true;
    }

    return false;
  }

  deactivateAdmin(username) {
    if (this.masterAdmins.has(username)) {
      this.masterAdmins.get(username).status = 'inactive';
      return true;
    }

    if (this.schoolAdmins.has(username)) {
      this.schoolAdmins.get(username).status = 'inactive';
      return true;
    }

    return false;
  }

  activateAdmin(username) {
    if (this.masterAdmins.has(username)) {
      this.masterAdmins.get(username).status = 'active';
      return true;
    }

    if (this.schoolAdmins.has(username)) {
      this.schoolAdmins.get(username).status = 'active';
      return true;
    }

    return false;
  }

  getLoginCredentials() {
    return {
      master_admin: {
        username: 'spacepharaoh',
        password: 'SpacePharaoh_Master_2025!',
        access: 'Full platform control'
      },
      school_admins: {
        superhero_school: {
          username: 'hero_admin',
          password: 'HeroAdmin_2025!',
          access: 'SuperHero School (K-6) management'
        },
        stage_prep_school: {
          username: 'stage_admin',
          password: 'StageAdmin_2025!',
          access: 'Stage Prep School (7-12) management'
        },
        lawyer_makers: {
          username: 'law_admin',
          password: 'LawAdmin_2025!',
          access: 'Law School management'
        },
        global_language_academy: {
          username: 'language_admin',
          password: 'LinguaAdmin_2025!',
          access: 'Language Academy management'
        }
      }
    };
  }
}

module.exports = new SpacePharaohAuthSystem();