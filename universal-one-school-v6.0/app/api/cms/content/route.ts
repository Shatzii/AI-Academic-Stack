import { NextRequest, NextResponse } from 'next/server';

// Mock CMS data structure
interface CMSContent {
  id: string;
  type: 'page' | 'course' | 'lesson' | 'template' | 'widget' | 'component';
  title: string;
  slug: string;
  content: any;
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    educational?: {
      gradeLevel?: string[];
      subject?: string[];
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
    };
    accessibility?: {
      dyslexiaFriendly?: boolean;
      adhdSupport?: boolean;
      autismSupport?: boolean;
    };
  };
}

// In-memory storage for demo
let cmsContent: CMSContent[] = [
  {
    id: '1',
    type: 'page',
    title: 'SuperHero School Landing Page',
    slug: 'superhero-school',
    content: {
      elements: [
        {
          type: 'hero',
          content: { title: 'Become a Learning SuperHero!', subtitle: 'Discover your powers through education' },
          styles: { backgroundColor: '#1e40af', textColor: '#ffffff', padding: '4rem 2rem' }
        }
      ]
    },
    status: 'published',
    author: 'Admin',
    createdAt: '2025-06-28T10:00:00Z',
    updatedAt: '2025-06-28T12:00:00Z',
    metadata: {
      seo: {
        title: 'SuperHero School - Empowering Young Minds',
        description: 'Gamified education for neurodivergent learners with superhero themes',
        keywords: ['education', 'superhero', 'neurodivergent', 'primary school']
      },
      educational: {
        gradeLevel: ['K', '1', '2', '3', '4', '5', '6'],
        subject: ['Math', 'Science', 'Reading', 'Social Studies'],
        difficulty: 'beginner'
      },
      accessibility: {
        dyslexiaFriendly: true,
        adhdSupport: true,
        autismSupport: true
      }
    }
  },
  {
    id: '2',
    type: 'course',
    title: 'Mathematics Adventures - Grade 3',
    slug: 'math-adventures-grade-3',
    content: {
      lessons: [
        { id: 'l1', title: 'Addition Heroes', duration: 30 },
        { id: 'l2', title: 'Subtraction Scouts', duration: 25 },
        { id: 'l3', title: 'Multiplication Masters', duration: 35 }
      ],
      objectives: ['Master basic arithmetic', 'Problem solving skills', 'Mathematical reasoning']
    },
    status: 'published',
    author: 'Ms. Johnson',
    createdAt: '2025-06-27T09:00:00Z',
    updatedAt: '2025-06-28T11:30:00Z',
    metadata: {
      educational: {
        gradeLevel: ['3'],
        subject: ['Math'],
        difficulty: 'intermediate'
      },
      accessibility: {
        dyslexiaFriendly: true,
        adhdSupport: true
      }
    }
  },
  {
    id: '3',
    type: 'template',
    title: 'School Event Announcement',
    slug: 'event-announcement-template',
    content: {
      elements: [
        {
          type: 'hero',
          content: { title: 'Event Title', subtitle: 'Event Description' },
          styles: { backgroundColor: '#10b981', textColor: '#ffffff' }
        },
        {
          type: 'card',
          content: { title: 'Event Details', description: 'Date, time, and location information' }
        }
      ]
    },
    status: 'draft',
    author: 'Design Team',
    createdAt: '2025-06-26T14:00:00Z',
    updatedAt: '2025-06-27T16:20:00Z',
    metadata: {
      seo: {
        title: 'Event Announcement Template',
        description: 'Customizable template for school events'
      }
    }
  },
  {
    id: '4',
    type: 'widget',
    title: 'Student Progress Tracker',
    slug: 'student-progress-widget',
    content: {
      type: 'progress-tracker',
      config: {
        showPercentage: true,
        showBadges: true,
        colorScheme: 'superhero'
      }
    },
    status: 'published',
    author: 'Development Team',
    createdAt: '2025-06-25T11:00:00Z',
    updatedAt: '2025-06-26T09:15:00Z',
    metadata: {
      educational: {
        gradeLevel: ['K', '1', '2', '3', '4', '5', '6'],
        subject: ['All']
      }
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredContent = [...cmsContent];

    // Apply filters
    if (type && type !== 'all') {
      filteredContent = filteredContent.filter(item => item.type === type);
    }

    if (status && status !== 'all') {
      filteredContent = filteredContent.filter(item => item.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredContent = filteredContent.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.slug.toLowerCase().includes(searchLower) ||
        item.author.toLowerCase().includes(searchLower)
      );
    }

    // Sort by updatedAt desc
    filteredContent.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Apply pagination
    const paginatedContent = filteredContent.slice(offset, offset + limit);

    return NextResponse.json({
      items: paginatedContent,
      total: filteredContent.length,
      hasMore: offset + limit < filteredContent.length,
      pagination: {
        offset,
        limit,
        total: filteredContent.length
      }
    });
  } catch (error) {
    console.error('Error fetching CMS content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newContent: CMSContent = {
      id: `content_${Date.now()}`,
      type: body.type || 'page',
      title: body.title || 'Untitled',
      slug: body.slug || generateSlug(body.title || 'untitled'),
      content: body.content || {},
      status: body.status || 'draft',
      author: body.author || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: body.metadata || {}
    };

    cmsContent.push(newContent);

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error('Error creating CMS content:', error);
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }

    const contentIndex = cmsContent.findIndex(item => item.id === id);
    if (contentIndex === -1) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const updatedContent = {
      ...cmsContent[contentIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    cmsContent[contentIndex] = updatedContent;

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating CMS content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }

    const contentIndex = cmsContent.findIndex(item => item.id === id);
    if (contentIndex === -1) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    cmsContent.splice(contentIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting CMS content:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}