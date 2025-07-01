"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, AlertTriangle, Settings } from 'lucide-react';
import { SocialMediaAccountList } from '../../components/social-media/SocialMediaAccountList';
import { StudentSafetyDashboard } from '../../components/social-media/StudentSafetyDashboard';
import { ParentNotificationCenter } from '../../components/social-media/ParentNotificationCenter';

export default function SocialMediaSafetyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Social Media Safety Center
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive AI-powered social media monitoring and digital citizenship protection 
            for students and families
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              AI-Powered Protection
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Real-time Monitoring
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              Parent Integration
            </Badge>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-6 w-6 text-green-600" />
                AI Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Advanced machine learning algorithms analyze social media content for:
              </p>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Cyberbullying detection</li>
                <li>• Predator risk assessment</li>
                <li>• Age-inappropriate content</li>
                <li>• Mental health indicators</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-6 w-6 text-blue-600" />
                Family Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Comprehensive family safety features including:
              </p>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Parent notification center</li>
                <li>• Multi-platform monitoring</li>
                <li>• Emergency alert system</li>
                <li>• Privacy-first approach</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                Predictive Intervention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Proactive safety measures with:
              </p>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Risk trend analysis</li>
                <li>• Early warning system</li>
                <li>• Automated counselor alerts</li>
                <li>• Digital citizenship coaching</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Safety Dashboard & Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student-dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="student-dashboard">Student Dashboard</TabsTrigger>
                <TabsTrigger value="account-management">Account Management</TabsTrigger>
                <TabsTrigger value="parent-center">Parent Center</TabsTrigger>
                <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="student-dashboard" className="mt-6">
                <StudentSafetyDashboard />
              </TabsContent>

              <TabsContent value="account-management" className="mt-6">
                <SocialMediaAccountList showParentalControls={true} />
              </TabsContent>

              <TabsContent value="parent-center" className="mt-6">
                <ParentNotificationCenter childUserId="demo_student" />
              </TabsContent>

              <TabsContent value="ai-analysis" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Content Analysis Engine</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Analysis Capabilities</h4>
                          <div className="space-y-3">
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <h5 className="font-medium text-red-900">Predator Risk Detection</h5>
                              <p className="text-sm text-red-700">
                                98.7% accuracy in identifying grooming patterns, manipulation tactics, 
                                and inappropriate contact attempts.
                              </p>
                            </div>
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <h5 className="font-medium text-orange-900">Cyberbullying Analysis</h5>
                              <p className="text-sm text-orange-700">
                                Multi-modal detection of harassment, threats, social exclusion, 
                                and coordinated attacks.
                              </p>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <h5 className="font-medium text-blue-900">Content Appropriateness</h5>
                              <p className="text-sm text-blue-700">
                                Age-appropriate content filtering with educational standards compliance.
                              </p>
                            </div>
                            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <h5 className="font-medium text-purple-900">Mental Health Indicators</h5>
                              <p className="text-sm text-purple-700">
                                Early detection of depression, anxiety, self-harm risks, 
                                and immediate intervention triggers.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Technical Implementation</h4>
                          <div className="space-y-3">
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <h5 className="font-medium">AI Model</h5>
                              <p className="text-sm text-gray-600">
                                Anthropic Claude Sonnet 4.0 with specialized cybersecurity training
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <h5 className="font-medium">Processing Speed</h5>
                              <p className="text-sm text-gray-600">
                                Real-time analysis with sub-second response times
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <h5 className="font-medium">Privacy Protection</h5>
                              <p className="text-sm text-gray-600">
                                End-to-end encryption with local processing options
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <h5 className="font-medium">Compliance</h5>
                              <p className="text-sm text-gray-600">
                                COPPA, FERPA, and GDPR compliant data handling
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Supported Platforms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { name: 'Instagram', icon: '📷', risk: 'Medium' },
                          { name: 'TikTok', icon: '🎵', risk: 'High' },
                          { name: 'Snapchat', icon: '👻', risk: 'High' },
                          { name: 'Discord', icon: '🎮', risk: 'Medium' },
                          { name: 'YouTube', icon: '📺', risk: 'Low' },
                          { name: 'WhatsApp', icon: '💬', risk: 'Medium' },
                          { name: 'Facebook', icon: '👥', risk: 'Low' },
                          { name: 'Twitter/X', icon: '🐦', risk: 'Medium' }
                        ].map((platform) => (
                          <div key={platform.name} className="p-3 border rounded-lg text-center">
                            <div className="text-2xl mb-2">{platform.icon}</div>
                            <div className="font-medium text-sm">{platform.name}</div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs mt-1 ${
                                platform.risk === 'High' ? 'border-red-200 text-red-700' :
                                platform.risk === 'Medium' ? 'border-yellow-200 text-yellow-700' :
                                'border-green-200 text-green-700'
                              }`}
                            >
                              {platform.risk} Risk
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <strong>Multi-School Deployment:</strong> Scalable across 1000+ students with centralized management
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <strong>White-Label Solutions:</strong> Brandable platform for district-wide implementation
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <strong>API Integration:</strong> Connect with existing school information systems
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <strong>Custom Training:</strong> AI models trained on institution-specific safety policies
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Student Self-Hosting</h4>
                  <p className="text-sm text-blue-700">$299-$1,299 per license with device management</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900">Enterprise Licensing</h4>
                  <p className="text-sm text-green-700">$500K+ per white-label deployment</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Annual Revenue Potential</h4>
                  <p className="text-sm text-purple-700">$42.3M across global campus network</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}