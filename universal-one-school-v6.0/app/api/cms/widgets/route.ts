import { NextRequest, NextResponse } from 'next/server';

interface Widget {
  id: string;
  name: string;
  category: string;
  description: string;
  component: string;
  props: any;
  preview: string;
  config: {
    customizable: boolean;
    responsive: boolean;
    accessibility: boolean;
    neurotypeFriendly: boolean;
  };
  usage: {
    count: number;
    popularIn: string[];
  };
}

// Available widgets in the system
const widgets: Widget[] = [
  {
    id: 'hero-section',
    name: 'Hero Section',
    category: 'Layout',
    description: 'Full-width hero banner with background image and call-to-action',
    component: 'HeroSection',
    props: {
      title: 'Welcome to Universal One School',
      subtitle: 'Empowering neurodivergent learners',
      backgroundImage: '/hero-bg.jpg',
      ctaText: 'Explore Schools',
      ctaLink: '/schools'
    },
    preview: '/widget-previews/hero-section.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: true
    },
    usage: {
      count: 45,
      popularIn: ['landing-pages', 'school-pages']
    }
  },
  {
    id: 'course-card',
    name: 'Course Card',
    category: 'Educational',
    description: 'Display course information with enrollment button and progress tracking',
    component: 'CourseCard',
    props: {
      title: 'Mathematics Adventures',
      description: 'Superhero-themed math lessons for grades K-6',
      instructor: 'Ms. Johnson',
      duration: '45 minutes',
      difficulty: 'Beginner',
      price: 'Free',
      image: '/course-math.jpg'
    },
    preview: '/widget-previews/course-card.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: true
    },
    usage: {
      count: 78,
      popularIn: ['course-catalog', 'school-pages']
    }
  },
  {
    id: 'student-progress',
    name: 'Student Progress Tracker',
    category: 'Analytics',
    description: 'Visual progress tracking with achievements and learning streaks',
    component: 'StudentProgress',
    props: {
      studentId: 'demo_student',
      showPercentage: true,
      showBadges: true,
      showStreak: true,
      colorScheme: 'superhero'
    },
    preview: '/widget-previews/student-progress.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: true
    },
    usage: {
      count: 92,
      popularIn: ['dashboard', 'student-pages']
    }
  },
  {
    id: 'ai-tutor-chat',
    name: 'AI Tutor Chat',
    category: 'AI Features',
    description: 'Interactive AI conversation widget with neurodivergent adaptations',
    component: 'AITutorChat',
    props: {
      tutorName: 'Dean Wonder',
      initialMessage: 'Hi! I\'m here to help you learn. What would you like to explore today?',
      personality: 'encouraging',
      adaptations: ['dyslexia', 'adhd', 'autism']
    },
    preview: '/widget-previews/ai-tutor-chat.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: true
    },
    usage: {
      count: 67,
      popularIn: ['all-schools', 'learning-pages']
    }
  },
  {
    id: 'social-media-feed',
    name: 'Safe Social Media Feed',
    category: 'Social',
    description: 'Display recent social activity with safety filtering and monitoring',
    component: 'SocialMediaFeed',
    props: {
      userId: 'demo_student',
      showOnlySafe: true,
      platforms: ['instagram', 'tiktok'],
      maxItems: 5
    },
    preview: '/widget-previews/social-feed.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: false
    },
    usage: {
      count: 23,
      popularIn: ['dashboard', 'social-pages']
    }
  },
  {
    id: 'achievement-badge',
    name: 'Achievement Badge Display',
    category: 'Gamification',
    description: 'Show student achievements, badges, and unlocked powers',
    component: 'AchievementBadge',
    props: {
      studentId: 'demo_student',
      badgeType: 'math-hero',
      showProgress: true,
      animateUnlock: true
    },
    preview: '/widget-previews/achievement-badge.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: true
    },
    usage: {
      count: 156,
      popularIn: ['superhero-school', 'student-dashboard']
    }
  },
  {
    id: 'calendar-widget',
    name: 'School Calendar',
    category: 'Organization',
    description: 'Interactive calendar with events, assignments, and deadlines',
    component: 'SchoolCalendar',
    props: {
      view: 'month',
      showEvents: true,
      showAssignments: true,
      colorCode: true,
      neurotypeFriendly: true
    },
    preview: '/widget-previews/calendar.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: true
    },
    usage: {
      count: 34,
      popularIn: ['dashboard', 'organization-pages']
    }
  },
  {
    id: 'neurodivergent-tools',
    name: 'Neurodivergent Support Tools',
    category: 'Accessibility',
    description: 'Specialized tools for ADHD, dyslexia, and autism support',
    component: 'NeurodivergentTools',
    props: {
      tools: ['focus-mode', 'reading-ruler', 'sensory-break'],
      userPreferences: 'auto-detect',
      quickAccess: true
    },
    preview: '/widget-previews/neurodivergent-tools.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: true
    },
    usage: {
      count: 89,
      popularIn: ['all-schools', 'learning-support']
    }
  },
  {
    id: 'virtual-classroom',
    name: 'Virtual Classroom Hub',
    category: 'Education',
    description: 'Live and recorded classroom sessions with AI enhancement',
    component: 'VirtualClassroom',
    props: {
      classroomId: 'demo-class',
      showLive: true,
      showRecorded: true,
      aiEnhanced: true
    },
    preview: '/widget-previews/virtual-classroom.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: true
    },
    usage: {
      count: 41,
      popularIn: ['education-pages', 'remote-learning']
    }
  },
  {
    id: 'parent-dashboard',
    name: 'Parent Monitoring Dashboard',
    category: 'Family',
    description: 'Real-time view of student progress and safety metrics for parents',
    component: 'ParentDashboard',
    props: {
      studentIds: ['demo_student'],
      showProgress: true,
      showSafety: true,
      showSchedule: true,
      alerts: true
    },
    preview: '/widget-previews/parent-dashboard.png',
    config: {
      customizable: true,
      responsive: true,
      accessibility: true,
      neurotypeFriendly: false
    },
    usage: {
      count: 52,
      popularIn: ['parent-portal', 'family-pages']
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let filteredWidgets = [...widgets];

    // Apply category filter
    if (category && category !== 'all') {
      filteredWidgets = filteredWidgets.filter(widget => 
        widget.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredWidgets = filteredWidgets.filter(widget =>
        widget.name.toLowerCase().includes(searchLower) ||
        widget.description.toLowerCase().includes(searchLower) ||
        widget.category.toLowerCase().includes(searchLower)
      );
    }

    // Sort by usage count (most popular first)
    filteredWidgets.sort((a, b) => b.usage.count - a.usage.count);

    return NextResponse.json({
      widgets: filteredWidgets,
      categories: [...new Set(widgets.map(w => w.category))],
      total: filteredWidgets.length
    });
  } catch (error) {
    console.error('Error fetching widgets:', error);
    return NextResponse.json({ error: 'Failed to fetch widgets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      name: body.name || 'New Widget',
      category: body.category || 'Custom',
      description: body.description || 'Custom widget description',
      component: body.component || 'CustomWidget',
      props: body.props || {},
      preview: body.preview || '/widget-previews/default.png',
      config: {
        customizable: true,
        responsive: true,
        accessibility: true,
        neurotypeFriendly: true,
        ...body.config
      },
      usage: {
        count: 0,
        popularIn: []
      }
    };

    widgets.push(newWidget);

    return NextResponse.json(newWidget, { status: 201 });
  } catch (error) {
    console.error('Error creating widget:', error);
    return NextResponse.json({ error: 'Failed to create widget' }, { status: 500 });
  }
}