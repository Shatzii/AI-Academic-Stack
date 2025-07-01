import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const level = searchParams.get('level') || 'all'
    const creatorType = searchParams.get('creatorType') || 'all'
    const search = searchParams.get('search') || ''
    const priceRange = searchParams.get('priceRange') || 'all'

    // Comprehensive course catalog for the marketplace
    const allCourses = [
      // Platform Courses - Premium AI-Powered Content
      {
        id: 'neural-adhd-optimization',
        title: 'Neural Learning Optimization for ADHD Students',
        description: 'Revolutionary course using brain-computer interfaces to optimize focus and learning retention for ADHD learners. Features real-time neural feedback, personalized focus training, and breakthrough attention management techniques.',
        price: 299,
        originalPrice: 399,
        creator: 'Universal One School',
        creatorType: 'platform',
        rating: 4.9,
        reviewCount: 847,
        duration: '8 weeks',
        lessons: 32,
        level: 'intermediate',
        category: 'neurodivergent',
        tags: ['ADHD', 'Neural Interface', 'Focus Training', 'Breakthrough Technology'],
        thumbnail: '/api/placeholder/300/200',
        bestseller: true,
        featured: true,
        neurodivergentFriendly: true,
        enrollmentCount: 2340,
        completionRate: 94,
        revenueShare: 0
      },
      {
        id: 'holographic-mathematics',
        title: 'Holographic Mathematics: 3D Problem Solving',
        description: 'Experience mathematics in 3D holographic space. Manipulate equations with your hands, visualize complex geometries, and solve problems in an immersive environment designed for visual learners.',
        price: 199,
        creator: 'Universal One School',
        creatorType: 'platform',
        rating: 4.8,
        reviewCount: 523,
        duration: '6 weeks',
        lessons: 24,
        level: 'beginner',
        category: 'mathematics',
        tags: ['Holographic', '3D Learning', 'Visual Math', 'Immersive Technology'],
        thumbnail: '/api/placeholder/300/200',
        featured: true,
        neurodivergentFriendly: true,
        enrollmentCount: 1456,
        completionRate: 89,
        revenueShare: 0
      },
      {
        id: 'emotional-ai-companion',
        title: 'Emotional AI Companion for Social Skills',
        description: 'Develop social and emotional intelligence with AI-powered scenarios and real-time feedback. Perfect for students on the autism spectrum or those needing social skill development.',
        price: 249,
        creator: 'Universal One School',
        creatorType: 'platform',
        rating: 4.9,
        reviewCount: 691,
        duration: '10 weeks',
        lessons: 40,
        level: 'beginner',
        category: 'social',
        tags: ['Emotional AI', 'Social Skills', 'Autism Support', 'Empathy Training'],
        thumbnail: '/api/placeholder/300/200',
        bestseller: true,
        neurodivergentFriendly: true,
        enrollmentCount: 1923,
        completionRate: 92,
        revenueShare: 0
      },
      {
        id: 'dyslexia-reading-mastery',
        title: 'Dyslexia-Friendly Reading Mastery',
        description: 'Specialized reading program designed specifically for dyslexic learners with proven results. Uses AI-powered text adaptation, audio support, and breakthrough reading techniques.',
        price: 199,
        creator: 'Universal One School',
        creatorType: 'platform',
        rating: 4.9,
        reviewCount: 1247,
        duration: '16 weeks',
        lessons: 64,
        level: 'beginner',
        category: 'literacy',
        tags: ['Dyslexia', 'Reading', 'Specialized Learning', 'Audio Support'],
        thumbnail: '/api/placeholder/300/200',
        bestseller: true,
        featured: true,
        neurodivergentFriendly: true,
        enrollmentCount: 3124,
        completionRate: 96,
        revenueShare: 0
      },
      {
        id: 'time-dimension-science',
        title: 'Time Dimension Science: Physics Through History',
        description: 'Travel through time to witness scientific discoveries firsthand. Experience Newton\'s apple, Einstein\'s theories, and quantum mechanics breakthroughs in their historical context.',
        price: 279,
        creator: 'Universal One School',
        creatorType: 'platform',
        rating: 4.7,
        reviewCount: 456,
        duration: '12 weeks',
        lessons: 48,
        level: 'advanced',
        category: 'science',
        tags: ['Time Travel', 'Physics', 'Historical Context', 'Immersive Learning'],
        thumbnail: '/api/placeholder/300/200',
        featured: true,
        neurodivergentFriendly: false,
        enrollmentCount: 987,
        completionRate: 87,
        revenueShare: 0
      },

      // Teacher-Created Courses
      {
        id: 'advanced-calculus-visual',
        title: 'Advanced Calculus with Visual Learning',
        description: 'Master calculus concepts through innovative visual methods. Created by a professor with 20 years of experience helping students overcome math anxiety.',
        price: 149,
        originalPrice: 199,
        creator: 'Dr. Sarah Chen',
        creatorType: 'teacher',
        rating: 4.8,
        reviewCount: 312,
        duration: '10 weeks',
        lessons: 30,
        level: 'advanced',
        category: 'mathematics',
        tags: ['Calculus', 'Visual Learning', 'Math Anxiety', 'University Prep'],
        thumbnail: '/api/placeholder/300/200',
        neurodivergentFriendly: true,
        enrollmentCount: 567,
        completionRate: 85,
        revenueShare: 0.7
      },
      {
        id: 'quantum-collaboration-projects',
        title: 'Quantum Collaboration: Global Science Projects',
        description: 'Collaborate with students worldwide on real science projects using quantum networking. Led by award-winning science educator Prof. Maria Gonzalez.',
        price: 179,
        creator: 'Prof. Maria Gonzalez',
        creatorType: 'teacher',
        rating: 4.6,
        reviewCount: 234,
        duration: '12 weeks',
        lessons: 48,
        level: 'advanced',
        category: 'science',
        tags: ['Quantum', 'Collaboration', 'Global Learning', 'Research Projects'],
        thumbnail: '/api/placeholder/300/200',
        neurodivergentFriendly: true,
        enrollmentCount: 423,
        completionRate: 78,
        revenueShare: 0.7
      },
      {
        id: 'creative-writing-workshop',
        title: 'Creative Writing Workshop for Young Authors',
        description: 'Unleash your storytelling potential with proven techniques from published author and teacher Ms. Jennifer Walsh. Perfect for aspiring young writers.',
        price: 99,
        creator: 'Ms. Jennifer Walsh',
        creatorType: 'teacher',
        rating: 4.7,
        reviewCount: 189,
        duration: '8 weeks',
        lessons: 24,
        level: 'intermediate',
        category: 'literacy',
        tags: ['Creative Writing', 'Storytelling', 'Author Techniques', 'Young Writers'],
        thumbnail: '/api/placeholder/300/200',
        neurodivergentFriendly: true,
        enrollmentCount: 334,
        completionRate: 92,
        revenueShare: 0.7
      },
      {
        id: 'music-theory-fundamentals',
        title: 'Music Theory Fundamentals Made Easy',
        description: 'Learn music theory through interactive exercises and real-world examples. Created by conservatory-trained musician and educator Dr. Robert Kim.',
        price: 129,
        creator: 'Dr. Robert Kim',
        creatorType: 'teacher',
        rating: 4.9,
        reviewCount: 278,
        duration: '6 weeks',
        lessons: 18,
        level: 'beginner',
        category: 'arts',
        tags: ['Music Theory', 'Interactive Learning', 'Fundamentals', 'Practical Application'],
        thumbnail: '/api/placeholder/300/200',
        neurodivergentFriendly: true,
        enrollmentCount: 445,
        completionRate: 88,
        revenueShare: 0.7
      },

      // Student-Created Courses
      {
        id: 'time-dimension-history',
        title: 'Time Dimension History: Ancient Civilizations',
        description: 'Travel through time to experience ancient civilizations firsthand. Created by honor student Alex Rivera using breakthrough time-dimension technology.',
        price: 149,
        originalPrice: 199,
        creator: 'Alex Rivera (Student)',
        creatorType: 'student',
        rating: 4.7,
        reviewCount: 312,
        duration: '4 weeks',
        lessons: 16,
        level: 'intermediate',
        category: 'history',
        tags: ['Time Travel', 'Ancient History', 'Immersive', 'Student-Created'],
        thumbnail: '/api/placeholder/300/200',
        neurodivergentFriendly: false,
        enrollmentCount: 678,
        completionRate: 91,
        revenueShare: 0.5
      },
      {
        id: 'peer-tutoring-math',
        title: 'Peer Tutoring: Algebra Made Simple',
        description: 'Learn algebra from a fellow student who struggled and succeeded. Emma shares her proven techniques for overcoming math challenges.',
        price: 79,
        creator: 'Emma Thompson (Student)',
        creatorType: 'student',
        rating: 4.5,
        reviewCount: 156,
        duration: '6 weeks',
        lessons: 18,
        level: 'beginner',
        category: 'mathematics',
        tags: ['Peer Learning', 'Algebra', 'Student Perspective', 'Relatable Teaching'],
        thumbnail: '/api/placeholder/300/200',
        neurodivergentFriendly: true,
        enrollmentCount: 289,
        completionRate: 87,
        revenueShare: 0.5
      },
      {
        id: 'coding-for-kids',
        title: 'Coding for Kids: Game Development Basics',
        description: 'Learn programming by creating your own games! Taught by 16-year-old coding prodigy Marcus Chen who\'s already published 3 mobile apps.',
        price: 99,
        creator: 'Marcus Chen (Student)',
        creatorType: 'student',
        rating: 4.6,
        reviewCount: 203,
        duration: '8 weeks',
        lessons: 24,
        level: 'beginner',
        category: 'technology',
        tags: ['Programming', 'Game Development', 'Kids Coding', 'App Creation'],
        thumbnail: '/api/placeholder/300/200',
        neurodivergentFriendly: true,
        enrollmentCount: 512,
        completionRate: 83,
        revenueShare: 0.5
      },
      {
        id: 'social-skills-teens',
        title: 'Social Skills for Teens: Peer Perspective',
        description: 'Navigate teen social situations with confidence. Created by student council president Sofia Martinez, sharing real-world social strategies.',
        price: 69,
        creator: 'Sofia Martinez (Student)',
        creatorType: 'student',
        rating: 4.4,
        reviewCount: 134,
        duration: '4 weeks',
        lessons: 12,
        level: 'beginner',
        category: 'social',
        tags: ['Teen Social Skills', 'Peer Advice', 'Confidence Building', 'Real-World Tips'],
        thumbnail: '/api/placeholder/300/200',
        neurodivergentFriendly: true,
        enrollmentCount: 234,
        completionRate: 89,
        revenueShare: 0.5
      }
    ]

    // Apply filters
    let filteredCourses = allCourses

    if (category !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.category === category)
    }

    if (level !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.level === level)
    }

    if (creatorType !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.creatorType === creatorType)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        course.creator.toLowerCase().includes(searchLower)
      )
    }

    if (priceRange !== 'all') {
      filteredCourses = filteredCourses.filter(course => {
        if (priceRange === 'free') return course.price === 0
        if (priceRange === 'under100') return course.price < 100
        if (priceRange === '100-200') return course.price >= 100 && course.price <= 200
        if (priceRange === 'over200') return course.price > 200
        return true
      })
    }

    // Calculate marketplace statistics
    const stats = {
      totalCourses: allCourses.length,
      totalEnrollments: allCourses.reduce((sum, course) => sum + course.enrollmentCount, 0),
      averageRating: allCourses.reduce((sum, course) => sum + course.rating, 0) / allCourses.length,
      platformRevenue: allCourses
        .filter(c => c.creatorType === 'platform')
        .reduce((sum, course) => sum + (course.price * course.enrollmentCount), 0),
      teacherRevenue: allCourses
        .filter(c => c.creatorType === 'teacher')
        .reduce((sum, course) => sum + (course.price * course.enrollmentCount * course.revenueShare), 0),
      studentRevenue: allCourses
        .filter(c => c.creatorType === 'student')
        .reduce((sum, course) => sum + (course.price * course.enrollmentCount * course.revenueShare), 0)
    }

    return NextResponse.json({
      courses: filteredCourses,
      stats,
      totalCount: filteredCourses.length,
      categories: [
        { id: 'all', name: 'All Categories', count: allCourses.length },
        { id: 'neurodivergent', name: 'Neurodivergent Support', count: allCourses.filter(c => c.category === 'neurodivergent').length },
        { id: 'mathematics', name: 'Mathematics', count: allCourses.filter(c => c.category === 'mathematics').length },
        { id: 'science', name: 'Science', count: allCourses.filter(c => c.category === 'science').length },
        { id: 'history', name: 'History', count: allCourses.filter(c => c.category === 'history').length },
        { id: 'literacy', name: 'Literacy', count: allCourses.filter(c => c.category === 'literacy').length },
        { id: 'social', name: 'Social Skills', count: allCourses.filter(c => c.category === 'social').length },
        { id: 'arts', name: 'Arts', count: allCourses.filter(c => c.category === 'arts').length },
        { id: 'technology', name: 'Technology', count: allCourses.filter(c => c.category === 'technology').length }
      ]
    })
  } catch (error) {
    console.error('Error fetching marketplace courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

// POST endpoint for creating new courses
export async function POST(request: NextRequest) {
  try {
    const courseData = await request.json()
    
    // In a real app, this would save to database and handle file uploads
    const newCourse = {
      id: `course_${Date.now()}`,
      ...courseData,
      rating: 0,
      reviewCount: 0,
      enrollmentCount: 0,
      completionRate: 0,
      createdAt: new Date().toISOString(),
      status: 'pending_review' // Courses need approval before going live
    }

    return NextResponse.json({
      success: true,
      message: 'Course submitted for review',
      course: newCourse
    })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}