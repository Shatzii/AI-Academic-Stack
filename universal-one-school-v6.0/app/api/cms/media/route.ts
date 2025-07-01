import { NextRequest, NextResponse } from 'next/server';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'archive';
  url: string;
  size: number;
  dimensions?: { width: number; height: number };
  duration?: number; // for video/audio
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  alt?: string; // for accessibility
  metadata: {
    educational?: {
      gradeLevel?: string[];
      subject?: string[];
    };
    accessibility?: {
      hasTranscript?: boolean;
      hasClosedCaptions?: boolean;
      isHighContrast?: boolean;
    };
  };
}

// Mock media library
let mediaLibrary: MediaItem[] = [
  {
    id: 'img_001',
    name: 'superhero-math-hero.png',
    type: 'image',
    url: '/media/images/superhero-math-hero.png',
    size: 245760, // 240KB
    dimensions: { width: 800, height: 600 },
    uploadedBy: 'Design Team',
    uploadedAt: '2025-06-28T10:00:00Z',
    tags: ['superhero', 'math', 'education', 'hero'],
    alt: 'Math superhero character with calculator shield',
    metadata: {
      educational: {
        gradeLevel: ['K', '1', '2', '3'],
        subject: ['Math']
      },
      accessibility: {
        isHighContrast: true
      }
    }
  },
  {
    id: 'img_002',
    name: 'stage-prep-theater-masks.jpg',
    type: 'image',
    url: '/media/images/stage-prep-theater-masks.jpg',
    size: 178432, // 174KB
    dimensions: { width: 1200, height: 800 },
    uploadedBy: 'Theater Department',
    uploadedAt: '2025-06-27T14:30:00Z',
    tags: ['theater', 'drama', 'masks', 'stage-prep'],
    alt: 'Classical theater masks representing comedy and tragedy',
    metadata: {
      educational: {
        gradeLevel: ['7', '8', '9', '10', '11', '12'],
        subject: ['Theater Arts', 'Drama']
      }
    }
  },
  {
    id: 'vid_001',
    name: 'ai-tutor-introduction.mp4',
    type: 'video',
    url: '/media/videos/ai-tutor-introduction.mp4',
    size: 15728640, // 15MB
    dimensions: { width: 1920, height: 1080 },
    duration: 120, // 2 minutes
    uploadedBy: 'AI Development Team',
    uploadedAt: '2025-06-26T16:45:00Z',
    tags: ['ai', 'tutor', 'introduction', 'education'],
    alt: 'Video introducing AI tutor features and capabilities',
    metadata: {
      educational: {
        gradeLevel: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        subject: ['All']
      },
      accessibility: {
        hasTranscript: true,
        hasClosedCaptions: true
      }
    }
  },
  {
    id: 'aud_001',
    name: 'neurodivergent-focus-sounds.mp3',
    type: 'audio',
    url: '/media/audio/neurodivergent-focus-sounds.mp3',
    size: 5242880, // 5MB
    duration: 300, // 5 minutes
    uploadedBy: 'Accessibility Team',
    uploadedAt: '2025-06-25T11:20:00Z',
    tags: ['neurodivergent', 'focus', 'adhd', 'calming'],
    alt: 'Calming background sounds for neurodivergent learners',
    metadata: {
      educational: {
        gradeLevel: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        subject: ['Support']
      },
      accessibility: {
        hasTranscript: false
      }
    }
  },
  {
    id: 'doc_001',
    name: 'cybersecurity-parent-guide.pdf',
    type: 'document',
    url: '/media/documents/cybersecurity-parent-guide.pdf',
    size: 2097152, // 2MB
    uploadedBy: 'Cybersecurity Team',
    uploadedAt: '2025-06-24T13:15:00Z',
    tags: ['cybersecurity', 'parents', 'guide', 'safety'],
    alt: 'Comprehensive guide for parents on digital safety',
    metadata: {
      educational: {
        gradeLevel: ['Parent Resource'],
        subject: ['Digital Safety']
      },
      accessibility: {
        hasTranscript: false
      }
    }
  },
  {
    id: 'img_003',
    name: 'universal-one-school-logo.svg',
    type: 'image',
    url: '/media/images/universal-one-school-logo.svg',
    size: 8192, // 8KB
    dimensions: { width: 400, height: 400 },
    uploadedBy: 'Branding Team',
    uploadedAt: '2025-06-28T09:00:00Z',
    tags: ['logo', 'branding', 'universal', 'school'],
    alt: 'Universal One School official logo',
    metadata: {
      educational: {
        gradeLevel: ['All'],
        subject: ['Branding']
      },
      accessibility: {
        isHighContrast: true
      }
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',') || [];
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredMedia = [...mediaLibrary];

    // Apply type filter
    if (type && type !== 'all') {
      filteredMedia = filteredMedia.filter(item => item.type === type);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMedia = filteredMedia.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        item.alt?.toLowerCase().includes(searchLower)
      );
    }

    // Apply tag filter
    if (tags.length > 0) {
      filteredMedia = filteredMedia.filter(item =>
        tags.some(tag => item.tags.includes(tag))
      );
    }

    // Sort by upload date (newest first)
    filteredMedia.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    // Apply pagination
    const paginatedMedia = filteredMedia.slice(offset, offset + limit);

    // Calculate total size and counts by type
    const stats = {
      totalItems: filteredMedia.length,
      totalSize: filteredMedia.reduce((sum, item) => sum + item.size, 0),
      byType: {
        image: filteredMedia.filter(item => item.type === 'image').length,
        video: filteredMedia.filter(item => item.type === 'video').length,
        audio: filteredMedia.filter(item => item.type === 'audio').length,
        document: filteredMedia.filter(item => item.type === 'document').length,
        archive: filteredMedia.filter(item => item.type === 'archive').length
      }
    };

    return NextResponse.json({
      items: paginatedMedia,
      stats,
      allTags: [...new Set(mediaLibrary.flatMap(item => item.tags))],
      pagination: {
        offset,
        limit,
        total: filteredMedia.length,
        hasMore: offset + limit < filteredMedia.length
      }
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newMediaItem: MediaItem = {
      id: `media_${Date.now()}`,
      name: body.name || 'untitled',
      type: body.type || 'image',
      url: body.url || '/media/placeholder.png',
      size: body.size || 0,
      dimensions: body.dimensions,
      duration: body.duration,
      uploadedBy: body.uploadedBy || 'Anonymous',
      uploadedAt: new Date().toISOString(),
      tags: body.tags || [],
      alt: body.alt || '',
      metadata: body.metadata || {}
    };

    mediaLibrary.push(newMediaItem);

    return NextResponse.json(newMediaItem, { status: 201 });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const mediaIndex = mediaLibrary.findIndex(item => item.id === id);
    if (mediaIndex === -1) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const updatedMedia = {
      ...mediaLibrary[mediaIndex],
      ...body
    };

    mediaLibrary[mediaIndex] = updatedMedia;

    return NextResponse.json(updatedMedia);
  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const mediaIndex = mediaLibrary.findIndex(item => item.id === id);
    if (mediaIndex === -1) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    mediaLibrary.splice(mediaIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}