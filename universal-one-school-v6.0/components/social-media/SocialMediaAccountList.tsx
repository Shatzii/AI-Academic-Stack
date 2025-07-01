"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, ShieldAlert, ShieldCheck, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { SocialMediaAccount } from '@shared/schema';

interface SocialMediaAccountListProps {
  userId?: string;
  showParentalControls?: boolean;
}

const PLATFORM_ICONS = {
  instagram: '📷',
  tiktok: '🎵',
  snapchat: '👻',
  discord: '🎮',
  youtube: '📺',
  whatsapp: '💬',
  facebook: '👥',
  twitter: '🐦',
  linkedin: '💼'
};

const RISK_COLORS = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const RISK_ICONS = {
  low: ShieldCheck,
  medium: Shield,
  high: ShieldAlert,
  critical: AlertTriangle
};

export function SocialMediaAccountList({ userId, showParentalControls = false }: SocialMediaAccountListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['/api/social-media/accounts', userId],
    queryFn: async () => {
      const response = await apiRequest('GET', userId ? `/api/social-media/accounts?userId=${userId}` : '/api/social-media/accounts');
      return await response.json() as SocialMediaAccount[];
    }
  });

  const toggleMonitoringMutation = useMutation({
    mutationFn: async ({ accountId, enabled }: { accountId: string; enabled: boolean }) => {
      const response = await apiRequest('PATCH', `/api/social-media/accounts/${accountId}`, {
        isMonitored: enabled
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-media/accounts'] });
      toast({
        title: "Monitoring Updated",
        description: "Social media monitoring settings have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update monitoring settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const removeAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const response = await apiRequest('DELETE', `/api/social-media/accounts/${accountId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-media/accounts'] });
      toast({
        title: "Account Removed",
        description: "Social media account has been removed from monitoring.",
      });
    },
    onError: () => {
      toast({
        title: "Removal Failed",
        description: "Failed to remove account. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getSafetyScore = (account: SocialMediaAccount): number => {
    // Calculate safety score based on risk level and recent activity
    const riskScores = { low: 95, medium: 75, high: 45, critical: 15 };
    return riskScores[account.riskLevel as keyof typeof riskScores] || 50;
  };

  const getLastActivityText = (lastActivity: Date | null): string => {
    if (!lastActivity) return 'No recent activity';
    
    const now = new Date();
    const diff = now.getTime() - new Date(lastActivity).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Less than 1 hour ago';
  };

  const handleToggleMonitoring = (accountId: string, currentlyEnabled: boolean) => {
    if (!currentlyEnabled && showParentalControls) {
      // Show parental consent dialog for enabling monitoring
      // This would typically open a consent modal
      console.log('Parental consent required for enabling monitoring');
    }
    
    toggleMonitoringMutation.mutate({
      accountId,
      enabled: !currentlyEnabled
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading social media accounts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load social media accounts. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Card className="m-4">
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Social Media Accounts</h3>
          <p className="text-muted-foreground mb-4">
            Connect your social media accounts to enable safety monitoring and protection.
          </p>
          <Button>Add First Account</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Social Media Safety Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {accounts.filter(a => a.riskLevel === 'low').length}
              </div>
              <div className="text-sm text-muted-foreground">Safe Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {accounts.filter(a => a.riskLevel === 'medium').length}
              </div>
              <div className="text-sm text-muted-foreground">Medium Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {accounts.filter(a => a.riskLevel === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {accounts.filter(a => a.riskLevel === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account List */}
      <div className="grid gap-4">
        {accounts.map((account) => {
          const RiskIcon = RISK_ICONS[account.riskLevel as keyof typeof RISK_ICONS];
          const safetyScore = getSafetyScore(account);
          
          return (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Platform Icon */}
                    <div className="text-3xl">
                      {PLATFORM_ICONS[account.platform as keyof typeof PLATFORM_ICONS] || '📱'}
                    </div>
                    
                    {/* Account Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{account.displayName || account.username}</h3>
                        <Badge variant="outline" className="capitalize">
                          {account.platform}
                        </Badge>
                        {!account.parentalConsentGiven && showParentalControls && (
                          <Badge variant="destructive">Consent Required</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">@{account.username}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <RiskIcon className="h-4 w-4" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${RISK_COLORS[account.riskLevel as keyof typeof RISK_COLORS]}`}>
                            {account.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                        <div>
                          Safety Score: <span className="font-semibold">{safetyScore}/100</span>
                        </div>
                        <div className="text-muted-foreground">
                          Last active: {getLastActivityText(account.lastActivity)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor={`monitoring-${account.id}`} className="text-sm font-medium">
                        {account.isMonitored ? 'Monitoring On' : 'Monitoring Off'}
                      </label>
                      <Switch
                        id={`monitoring-${account.id}`}
                        checked={account.isMonitored}
                        onCheckedChange={() => handleToggleMonitoring(account.id, account.isMonitored)}
                        disabled={toggleMonitoringMutation.isPending}
                      />
                      {account.isMonitored ? 
                        <Eye className="h-4 w-4 text-green-600" /> : 
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      }
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeAccountMutation.mutate(account.id)}
                      disabled={removeAccountMutation.isPending}
                    >
                      {removeAccountMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Remove'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Risk Alerts */}
                {(account.riskLevel === 'high' || account.riskLevel === 'critical') && (
                  <Alert className="mt-4 border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      {account.riskLevel === 'critical' 
                        ? 'Critical safety concerns detected. Immediate review recommended.'
                        : 'Elevated risk detected. Consider reviewing recent activity.'
                      }
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}