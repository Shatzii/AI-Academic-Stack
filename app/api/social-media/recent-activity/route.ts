import { NextRequest, NextResponse } from 'next/server';
// Mock data for demo purposes
const mockActivity = [
  {
    id: '1',
    accountId: 'instagram_demo',
    platform: 'Instagram',
    activityType: 'post',
    content: 'Had an amazing day at school! 📚✨',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    riskScore: 5,
    riskFactors: [],
    aiAnalysis: 'Positive content about school experience'
  },
  {
    id: '2', 
    accountId: 'tiktok_demo',
    platform: 'TikTok',
    activityType: 'comment',
    content: 'Great video! Thanks for sharing',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    riskScore: 10,
    riskFactors: [],
    aiAnalysis: 'Positive engagement comment'
  },
  {
    id: '3',
    accountId: 'snapchat_demo', 
    platform: 'Snapchat',
    activityType: 'message',
    content: 'Someone I dont know asked for personal info',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    riskScore: 85,
    riskFactors: ['stranger_contact', 'personal_info_request'],
    aiAnalysis: 'High risk: Unknown contact requesting personal information'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const accountId = searchParams.get('accountId');
    
    let activities = mockActivity;
    
    if (accountId) {
      activities = activities.filter(a => a.accountId === accountId);
    }
    
    if (limit) {
      activities = activities.slice(0, parseInt(limit));
    }
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching social media activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}