"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  BellOff, 
  Shield, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  Settings,
  User,
  Phone,
  Mail,
  CheckCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { SecurityAlert, ParentalControls } from '@shared/schema';

interface ParentNotificationCenterProps {
  childUserId?: string;
}

interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  alertLevel: 'low' | 'medium' | 'high' | 'immediate';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }>;
}

export function ParentNotificationCenter({ childUserId }: ParentNotificationCenterProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/social-media/parent-alerts', childUserId],
    queryFn: async () => {
      const url = childUserId 
        ? `/api/social-media/parent-alerts?childId=${childUserId}`
        : '/api/social-media/parent-alerts';
      const response = await apiRequest('GET', url);
      return await response.json() as SecurityAlert[];
    }
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/social-media/notification-settings', childUserId],
    queryFn: async () => {
      const url = childUserId
        ? `/api/social-media/notification-settings?childId=${childUserId}`
        : '/api/social-media/notification-settings';
      const response = await apiRequest('GET', url);
      return await response.json() as NotificationSettings;
    }
  });

  const { data: parentalControls } = useQuery({
    queryKey: ['/api/social-media/parental-controls', childUserId],
    queryFn: async () => {
      const url = childUserId
        ? `/api/social-media/parental-controls?childId=${childUserId}`
        : '/api/social-media/parental-controls';
      const response = await apiRequest('GET', url);
      return await response.json() as ParentalControls;
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<NotificationSettings>) => {
      const response = await apiRequest('PATCH', '/api/social-media/notification-settings', newSettings);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-media/notification-settings'] });
      toast({
        title: "Settings Updated",
        description: "Notification preferences have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await apiRequest('PATCH', `/api/social-media/alerts/${alertId}/acknowledge`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-media/parent-alerts'] });
      toast({
        title: "Alert Acknowledged",
        description: "Alert has been marked as reviewed.",
      });
    }
  });

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const criticalAlerts = alerts?.filter(alert => alert.severity === 'critical') || [];
  const recentAlerts = alerts?.slice(0, 10) || [];

  if (alertsLoading || settingsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold">Parent Safety Center</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your child's digital safety and manage notification preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          {settings?.emailAlerts && <Badge variant="outline">Email On</Badge>}
          {settings?.smsAlerts && <Badge variant="outline">SMS On</Badge>}
          {settings?.pushNotifications && <Badge variant="outline">Push On</Badge>}
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Immediate Attention Required:</strong> {criticalAlerts.length} critical safety alert{criticalAlerts.length > 1 ? 's' : ''} need{criticalAlerts.length === 1 ? 's' : ''} your review.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
                <div className="text-xs text-muted-foreground">Critical Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {alerts?.filter(a => a.severity === 'high').length || 0}
                </div>
                <div className="text-xs text-muted-foreground">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {parentalControls?.monitoringEnabled ? 'ON' : 'OFF'}
                </div>
                <div className="text-xs text-muted-foreground">Monitoring</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {alerts?.filter(a => new Date(a.createdAt).getTime() > Date.now() - 24*60*60*1000).length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Today's Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          <TabsTrigger value="controls">Parental Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAlerts.length > 0 ? (
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{alert.title}</h4>
                            <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            {alert.parentNotified && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Notified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-3">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(alert.createdAt)}
                            </span>
                            <span>Risk Score: {alert.riskScore}/100</span>
                            {alert.assignedTo && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Assigned to {alert.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {alert.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acknowledgeAlertMutation.mutate(alert.id)}
                              disabled={acknowledgeAlertMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-1">All Clear!</h3>
                  <p className="text-muted-foreground">No security alerts to review.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Alert Methods */}
              <div>
                <h4 className="font-semibold mb-3">Alert Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Notifications</span>
                    </div>
                    <Switch
                      checked={settings?.emailAlerts || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ emailAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>SMS Alerts</span>
                    </div>
                    <Switch
                      checked={settings?.smsAlerts || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ smsAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Push Notifications</span>
                    </div>
                    <Switch
                      checked={settings?.pushNotifications || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ pushNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Alert Level */}
              <div>
                <h4 className="font-semibold mb-3">Alert Threshold</h4>
                <Select 
                  value={settings?.alertLevel || 'medium'}
                  onValueChange={(value) => 
                    updateSettingsMutation.mutate({ alertLevel: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - All activities</SelectItem>
                    <SelectItem value="medium">Medium - Potential concerns</SelectItem>
                    <SelectItem value="high">High - Significant risks only</SelectItem>
                    <SelectItem value="immediate">Immediate - Critical threats only</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose when you want to receive notifications based on risk level
                </p>
              </div>

              {/* Quiet Hours */}
              <div>
                <h4 className="font-semibold mb-3">Quiet Hours</h4>
                <div className="flex items-center justify-between mb-2">
                  <span>Enable quiet hours</span>
                  <Switch
                    checked={settings?.quietHours?.enabled || false}
                    onCheckedChange={(checked) => 
                      updateSettingsMutation.mutate({ 
                        quietHours: { 
                          ...settings?.quietHours, 
                          enabled: checked 
                        }
                      })
                    }
                  />
                </div>
                {settings?.quietHours?.enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Start Time</label>
                      <input
                        type="time"
                        value={settings?.quietHours?.start || '22:00'}
                        onChange={(e) => 
                          updateSettingsMutation.mutate({
                            quietHours: {
                              ...settings?.quietHours,
                              start: e.target.value
                            }
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">End Time</label>
                      <input
                        type="time"
                        value={settings?.quietHours?.end || '07:00'}
                        onChange={(e) => 
                          updateSettingsMutation.mutate({
                            quietHours: {
                              ...settings?.quietHours,
                              end: e.target.value
                            }
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Parental Control Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Social Media Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable AI-powered monitoring of your child's social media activity
                    </p>
                  </div>
                  <Switch checked={parentalControls?.monitoringEnabled || false} />
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Current Settings Summary</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>Alert Level: <span className="capitalize">{parentalControls?.alertLevel}</span></p>
                    <p>Allowed Platforms: {(parentalControls?.allowedPlatforms as string[])?.length || 0} configured</p>
                    <p>Time Restrictions: {parentalControls?.timeRestrictions ? 'Enabled' : 'Disabled'}</p>
                    <p>Last Review: {parentalControls?.lastReviewDate ? 
                      formatTimeAgo(parentalControls.lastReviewDate) : 'Never'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}