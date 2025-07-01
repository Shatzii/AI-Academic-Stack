import { NextRequest, NextResponse } from 'next/server';
// Mock data for demo purposes
const mockAccounts = [
  { id: 'instagram_demo', platform: 'Instagram', username: 'demo_student', isMonitored: true, riskLevel: 'low' },
  { id: 'tiktok_demo', platform: 'TikTok', username: 'demo_student', isMonitored: true, riskLevel: 'medium' },
  { id: 'snapchat_demo', platform: 'Snapchat', username: 'demo_student', isMonitored: true, riskLevel: 'high' }
];

const mockAlerts = [
  {
    id: '1',
    userId: 'demo_student',
    alertType: 'stranger_contact',
    severity: 'high',
    message: 'Unknown contact requesting personal information',
    platform: 'Snapchat',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isResolved: false
  },
  {
    id: '2', 
    userId: 'demo_student',
    alertType: 'inappropriate_content',
    severity: 'medium',
    message: 'Potentially inappropriate content shared',
    platform: 'TikTok',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isResolved: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const userId = 'demo_student'; // Default user for demo
    
    // Get accounts and calculate metrics  
    const accounts = mockAccounts;
    const alerts = mockAlerts;
    const activities = [];
    
    const accountSummary = {
      total: accounts.length,
      monitored: accounts.filter(a => a.isMonitored).length,
      safe: accounts.filter(a => a.riskLevel === 'low').length,
      atRisk: accounts.filter(a => ['high', 'critical'].includes(a.riskLevel)).length
    };

    const weeklyActivities = activities.filter(a => 
      new Date(a.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const activitySummary = {
      weeklyActivity: weeklyActivities.length,
      flaggedContent: weeklyActivities.filter(a => a.riskScore > 50).length,
      positiveInteractions: weeklyActivities.filter(a => a.riskScore < 20).length
    };

    const overallSafetyScore = Math.max(20, 
      100 - (alerts.filter(a => a.severity === 'critical').length * 30) - 
      (alerts.filter(a => a.severity === 'high').length * 15) -
      (alerts.filter(a => a.severity === 'medium').length * 5)
    );

    const riskLevel = overallSafetyScore >= 80 ? 'low' : 
                     overallSafetyScore >= 60 ? 'medium' :
                     overallSafetyScore >= 40 ? 'high' : 'critical';

    const safetyMetrics = {
      overallSafetyScore,
      riskLevel,
      recentAlerts: alerts.slice(0, 5),
      accountSummary,
      activitySummary,
      trends: {
        safetyScoreTrend: Math.floor(Math.random() * 10) - 5, // Mock trend data
        riskTrend: Math.floor(Math.random() * 6) - 3
      }
    };

    return NextResponse.json(safetyMetrics);
  } catch (error) {
    console.error('Error fetching safety metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch safety metrics' }, { status: 500 });
  }
}