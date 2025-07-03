import { Router } from 'express';

const router = Router();

// School data
const schools = [
  {
    id: 'primary',
    name: 'SuperHero School',
    description: 'K-6 Elementary with superhero-themed learning',
    grades: 'K-6',
    theme: 'superhero',
    features: ['Visual Learning', 'ADHD Support', 'Dyslexia Friendly', 'Gamification'],
    enrollment: 487,
    aiModel: 'claude-educational-primary'
  },
  {
    id: 'secondary',
    name: 'Stage Prep School', 
    description: '7-12 Theater Arts & Academic Preparation',
    grades: '7-12',
    theme: 'theater',
    features: ['Theater Arts', 'College Prep', 'Executive Function', 'Creative Writing'],
    enrollment: 312,
    aiModel: 'claude-educational-secondary'
  },
  {
    id: 'law',
    name: 'The Lawyer Makers',
    description: 'Legal Education with UAE Law Specialization',
    grades: 'Graduate',
    theme: 'legal',
    features: ['UAE Law', 'Bar Exam Prep', 'Case Analysis', 'Legal Writing'],
    enrollment: 156,
    aiModel: 'claude-legal-education'
  },
  {
    id: 'language',
    name: 'Global Language Academy',
    description: 'Multilingual Education & Cultural Immersion',
    grades: 'All Ages',
    theme: 'multicultural',
    features: ['Multilingual', 'Cultural Immersion', 'Conversation Practice', 'Translation'],
    enrollment: 743,
    aiModel: 'claude-language-tutor'
  },
  {
    id: 'sports',
    name: 'Go4it Sports Academy',
    description: 'Athletic Excellence & Academic Achievement',
    grades: 'K-12',
    theme: 'sports',
    features: ['Athletic Training', 'Sports Science', 'Nutrition', 'Performance Analytics'],
    enrollment: 289,
    aiModel: 'claude-educational-primary'
  }
];

// Get all schools
router.get('/', (req, res) => {
  res.json({
    success: true,
    schools,
    totalEnrollment: schools.reduce((sum, school) => sum + school.enrollment, 0),
    timestamp: new Date().toISOString()
  });
});

// Get specific school
router.get('/:schoolId', (req, res) => {
  const { schoolId } = req.params;
  const school = schools.find(s => s.id === schoolId);
  
  if (!school) {
    return res.status(404).json({
      success: false,
      error: 'School not found',
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    school,
    timestamp: new Date().toISOString()
  });
});

// Get school curriculum
router.get('/:schoolId/curriculum', (req, res) => {
  const { schoolId } = req.params;
  const school = schools.find(s => s.id === schoolId);
  
  if (!school) {
    return res.status(404).json({
      success: false,
      error: 'School not found',
      timestamp: new Date().toISOString()
    });
  }

  // Mock curriculum data based on school type
  const curriculumMap: { [key: string]: any } = {
    primary: {
      subjects: ['Math', 'Reading', 'Science', 'Social Studies', 'Art', 'PE'],
      specialPrograms: ['ADHD Support', 'Dyslexia Intervention', 'Gifted & Talented'],
      methodology: 'Superhero-themed gamified learning with visual aids'
    },
    secondary: {
      subjects: ['Theater Arts', 'English', 'Math', 'Science', 'History', 'Foreign Language'],
      specialPrograms: ['College Prep', 'AP Courses', 'Creative Writing', 'Technical Theater'],
      methodology: 'Project-based learning with theatrical integration'
    },
    law: {
      subjects: ['Constitutional Law', 'Contract Law', 'Tort Law', 'UAE Law', 'Legal Writing'],
      specialPrograms: ['Bar Exam Prep', 'Moot Court', 'Legal Clinic', 'Research Methods'],
      methodology: 'Case-based learning with practical application'
    },
    language: {
      subjects: ['English', 'Spanish', 'German', 'Cultural Studies', 'Communication'],
      specialPrograms: ['Immersion Programs', 'Translation Services', 'Cultural Exchange'],
      methodology: 'Immersive cultural and linguistic education'
    },
    sports: {
      subjects: ['Sports Science', 'Nutrition', 'Psychology', 'Academic Core', 'Athletic Training'],
      specialPrograms: ['Elite Training', 'Scholarship Prep', 'Injury Prevention', 'Performance Analytics'],
      methodology: 'Integrated athletic and academic excellence'
    }
  };

  const curriculum = curriculumMap[schoolId] || curriculumMap.primary;

  res.json({
    success: true,
    school: school.name,
    curriculum,
    timestamp: new Date().toISOString()
  });
});

export { router as schoolRoutes };