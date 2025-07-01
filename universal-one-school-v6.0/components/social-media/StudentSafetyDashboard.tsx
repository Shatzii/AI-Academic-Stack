"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Users,
  MessageSquare,
  BarChart3,
  Clock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import type { SecurityAlert, SocialMediaAccount, SocialMediaActivity } from '@shared/schema';

interface SafetyMetrics {
  overallSafetyScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recentAlerts: SecurityAlert[];
  accountSummary: {
    total: number;
    monitored: number;
    safe: number;
    atRisk: number;
  };
  activitySummary: {
    weeklyActivity: number;
    flaggedContent: number;
    positiveInteractions: number;
  };
  trends: {
    safetyScoreTrend: number; // positive = improving, negative = declining
    riskTrend: number;
  };
}

export function StudentSafetyDashboard() {
  const { user } = useAuth();

  const { data: safetyMetrics, isLoading } = useQuery({
    queryKey: ['/api/social-media/safety-metrics', user?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/social-media/safety-metrics');
      return await response.json() as SafetyMetrics;
    },
    enabled: !!user
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['/api/social-media/recent-activity', user?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/social-media/recent-activity?limit=10');
      return await response.json() as SocialMediaActivity[];
    },
    enabled: !!user
  });

  const getSafetyScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSafetyScoreBackground = (score: number): string => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    if (score >= 50) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getRiskLevelBadge = (level: string) => {
    const variants = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[level as keyof typeof variants] || variants.medium}>
        {level.toUpperCase()} RISK
      </Badge>
    );
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (isLoading || !safetyMetrics) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Digital Safety Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your online safety and digital citizenship progress
          </p>
        </div>
        {getRiskLevelBadge(safetyMetrics.riskLevel)}
      </div>

      {/* Critical Alerts */}
      {safetyMetrics.recentAlerts.some(alert => alert.severity === 'critical') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Immediate Attention Required:</strong> Critical safety concerns detected. 
            Please review your recent activity and contact a counselor if needed.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Safety Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5" />
              Safety Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold mb-2 ${getSafetyScoreColor(safetyMetrics.overallSafetyScore)}`}>
              {safetyMetrics.overallSafetyScore}
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {safetyMetrics.trends.safetyScoreTrend > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+{safetyMetrics.trends.safetyScoreTrend} this week</span>
                </>
              ) : safetyMetrics.trends.safetyScoreTrend < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">{safetyMetrics.trends.safetyScoreTrend} this week</span>
                </>
              ) : (
                <span className="text-muted-foreground">No change this week</span>
              )}
            </div>
            <Progress 
              value={safetyMetrics.overallSafetyScore} 
              className="mt-3"
            />
          </CardContent>
        </Card>

        {/* Account Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5" />
              Connected Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Accounts</span>
                <span className="font-semibold">{safetyMetrics.accountSummary.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monitored</span>
                <span className="font-semibold text-blue-600">{safetyMetrics.accountSummary.monitored}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Safe</span>
                <span className="font-semibold text-green-600">{safetyMetrics.accountSummary.safe}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">At Risk</span>
                <span className="font-semibold text-red-600">{safetyMetrics.accountSummary.atRisk}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Interactions</span>
                <span className="font-semibold">{safetyMetrics.activitySummary.weeklyActivity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Flagged Content</span>
                <span className="font-semibold text-orange-600">{safetyMetrics.activitySummary.flaggedContent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Positive Interactions</span>
                <span className="font-semibold text-green-600">{safetyMetrics.activitySummary.positiveInteractions}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Positive interaction rate: {Math.round((safetyMetrics.activitySummary.positiveInteractions / safetyMetrics.activitySummary.weeklyActivity) * 100)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Views */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="tips">Safety Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Security Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {safetyMetrics.recentAlerts.length > 0 ? (
                <div className="space-y-3">
                  {safetyMetrics.recentAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'high' ? 'text-orange-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(alert.createdAt)}
                          </span>
                          <span>Risk Score: {alert.riskScore}/100</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-1">All Clear!</h3>
                  <p className="text-muted-foreground">No security alerts to review.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Social Media Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.riskScore >= 70 ? 'bg-red-500' :
                        activity.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm capitalize">{activity.activityType}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {activity.activityType}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Risk Score: {activity.riskScore}/100 • {formatTimeAgo(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-1">No Recent Activity</h3>
                  <p className="text-muted-foreground">Your social media activity will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Digital Citizenship Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Think Before You Post</h4>
                  <p className="text-blue-800 text-sm">
                    Consider how your posts might be perceived by others and whether they represent your best self.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Protect Your Privacy</h4>
                  <p className="text-green-800 text-sm">
                    Review your privacy settings regularly and be cautious about sharing personal information.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Be Kind Online</h4>
                  <p className="text-purple-800 text-sm">
                    Treat others with respect and kindness. If you witness cyberbullying, report it and support the victim.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Question What You See</h4>
                  <p className="text-orange-800 text-sm">
                    Not everything online is true. Verify information from reliable sources before sharing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}