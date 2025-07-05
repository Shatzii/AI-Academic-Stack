import { Router } from 'express';

const router = Router();

// Enrollment types and pricing
const enrollmentTypes = {
  'on-site': {
    name: 'On-Site Student',
    price: 2500,
    period: 'semester',
    features: ['Full campus access', 'In-person classes', 'All AI features', 'Athletic programs', 'Meal plans']
  },
  'online-premium': {
    name: 'Online Premium',
    price: 1800,
    period: 'semester', 
    features: ['Complete online learning', 'Live teacher interaction', 'Full AI access', 'Virtual labs', '24/7 support']
  },
  'online-free': {
    name: 'Online Free',
    price: 0,
    period: 'semester',
    features: ['Limited AI tools', 'Recorded content', 'Basic support', 'Community access']
  },
  'hybrid': {
    name: 'Hybrid Student',
    price: 2000,
    period: 'semester',
    features: ['Flexible on-site/online', 'Full AI access', 'Athletic programs', 'Live sessions', 'Campus events']
  }
};

// Mock enrollment data
let enrollments = [
  {
    id: '1',
    studentName: 'Alex Johnson',
    email: 'alex@example.com',
    school: 'primary',
    grade: 5,
    enrollmentType: 'on-site',
    status: 'active',
    startDate: '2024-08-15',
    neurotype: 'adhd',
    accommodations: ['extra-time', 'movement-breaks']
  },
  {
    id: '2', 
    studentName: 'Maria Rodriguez',
    email: 'maria@example.com',
    school: 'secondary',
    grade: 10,
    enrollmentType: 'hybrid',
    status: 'active',
    startDate: '2024-08-15',
    neurotype: 'neurotypical',
    accommodations: []
  }
];

// Get enrollment information
router.get('/info', (req, res) => {
  res.json({
    success: true,
    enrollmentTypes,
    totalEnrolled: enrollments.length,
    activeEnrollments: enrollments.filter(e => e.status === 'active').length,
    timestamp: new Date().toISOString()
  });
});

// Create new enrollment
router.post('/apply', (req, res) => {
  const {
    studentName,
    email,
    school,
    grade,
    enrollmentType,
    neurotype = 'neurotypical',
    accommodations = [],
    parentName,
    parentEmail,
    parentPhone
  } = req.body;

  // Validation
  if (!studentName || !email || !school || !enrollmentType) {
    return res.status(400).json({
      success: false,
      error: 'Required fields: studentName, email, school, enrollmentType',
      timestamp: new Date().toISOString()
    });
  }

  if (!enrollmentTypes[enrollmentType as keyof typeof enrollmentTypes]) {
    return res.status(400).json({
      success: false,
      error: 'Invalid enrollment type',
      validTypes: Object.keys(enrollmentTypes),
      timestamp: new Date().toISOString()
    });
  }

  // Create new enrollment
  const newEnrollment = {
    id: (enrollments.length + 1).toString(),
    studentName,
    email,
    school,
    grade: grade || 1,
    enrollmentType,
    status: 'pending',
    startDate: new Date().toISOString().split('T')[0],
    neurotype,
    accommodations,
    parentInfo: parentName ? {
      name: parentName,
      email: parentEmail,
      phone: parentPhone
    } : null,
    applicationDate: new Date().toISOString()
  };

  enrollments.push(newEnrollment);

  const enrollmentInfo = enrollmentTypes[enrollmentType as keyof typeof enrollmentTypes];

  res.status(201).json({
    success: true,
    enrollment: newEnrollment,
    pricing: enrollmentInfo,
    message: 'Enrollment application submitted successfully',
    nextSteps: [
      'Application review (1-2 business days)',
      'Placement assessment scheduling',
      'Enrollment confirmation and payment',
      'Orientation and onboarding'
    ],
    timestamp: new Date().toISOString()
  });
});

// Get all enrollments (admin)
router.get('/list', (req, res) => {
  const { status, school, enrollmentType } = req.query;
  
  let filteredEnrollments = enrollments;
  
  if (status) {
    filteredEnrollments = filteredEnrollments.filter(e => e.status === status);
  }
  
  if (school) {
    filteredEnrollments = filteredEnrollments.filter(e => e.school === school);
  }
  
  if (enrollmentType) {
    filteredEnrollments = filteredEnrollments.filter(e => e.enrollmentType === enrollmentType);
  }

  res.json({
    success: true,
    enrollments: filteredEnrollments,
    total: filteredEnrollments.length,
    filters: { status, school, enrollmentType },
    timestamp: new Date().toISOString()
  });
});

// Get specific enrollment
router.get('/:enrollmentId', (req, res) => {
  const { enrollmentId } = req.params;
  const enrollment = enrollments.find(e => e.id === enrollmentId);
  
  if (!enrollment) {
    return res.status(404).json({
      success: false,
      error: 'Enrollment not found',
      timestamp: new Date().toISOString()
    });
  }

  const enrollmentInfo = enrollmentTypes[enrollment.enrollmentType as keyof typeof enrollmentTypes];

  res.json({
    success: true,
    enrollment,
    pricing: enrollmentInfo,
    timestamp: new Date().toISOString()
  });
});

// Update enrollment status
router.patch('/:enrollmentId/status', (req, res) => {
  const { enrollmentId } = req.params;
  const { status, notes } = req.body;
  
  const enrollmentIndex = enrollments.findIndex(e => e.id === enrollmentId);
  
  if (enrollmentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Enrollment not found',
      timestamp: new Date().toISOString()
    });
  }

  const validStatuses = ['pending', 'approved', 'active', 'inactive', 'withdrawn'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status',
      validStatuses,
      timestamp: new Date().toISOString()
    });
  }

  enrollments[enrollmentIndex] = {
    ...enrollments[enrollmentIndex],
    status,
    notes,
    lastUpdated: new Date().toISOString()
  };

  res.json({
    success: true,
    enrollment: enrollments[enrollmentIndex],
    message: `Enrollment status updated to ${status}`,
    timestamp: new Date().toISOString()
  });
});

export { router as enrollmentRoutes };