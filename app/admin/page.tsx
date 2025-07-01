'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, GraduationCap, DollarSign, BarChart3, Settings, School, Brain, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Students', value: '1,247', change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: 'Active Courses', value: '89', change: '+5%', icon: BookOpen, color: 'text-green-600' },
    { title: 'Graduation Rate', value: '94%', change: '+2%', icon: GraduationCap, color: 'text-purple-600' },
    { title: 'Revenue (Monthly)', value: '$2.1M', change: '+18%', icon: DollarSign, color: 'text-emerald-600' }
  ];

  const schoolStats = [
    { name: 'SuperHero School (K-6)', students: 387, capacity: 450, utilization: 86 },
    { name: 'Stage Prep School (7-12)', students: 425, capacity: 500, utilization: 85 },
    { name: 'Future Legal Professionals', students: 234, capacity: 300, utilization: 78 },
    { name: 'Global Language Academy', students: 201, capacity: 250, utilization: 80 }
  ];

  const aiMetrics = [
    { feature: 'AI Personal Tutor', usage: 89, satisfaction: 94 },
    { feature: 'Content Creator', usage: 76, satisfaction: 91 },
    { feature: 'Learning Analytics', usage: 82, satisfaction: 88 },
    { feature: 'Virtual Classroom', usage: 68, satisfaction: 92 }
  ];

  const recentActivities = [
    { action: 'New student enrollment', details: 'Alice Johnson - Stage Prep School', time: '2 minutes ago', type: 'enrollment' },
    { action: 'Course completion', details: 'Advanced Theater Arts - 24 students', time: '15 minutes ago', type: 'completion' },
    { action: 'AI tutor session', details: 'Mathematics help - 156 sessions today', time: '1 hour ago', type: 'ai' },
    { action: 'Parent portal access', details: '89 new parent accounts created', time: '2 hours ago', type: 'parent' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Universal One School - AI Education Platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="ai-features">AI Features</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* School Utilization */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    School Utilization
                  </CardTitle>
                  <CardDescription>Current enrollment vs capacity across all schools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {schoolStats.map((school, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{school.name}</span>
                        <span className="text-sm text-gray-600">{school.students}/{school.capacity} students</span>
                      </div>
                      <Progress value={school.utilization} className="h-2" />
                      <div className="text-xs text-gray-500">{school.utilization}% capacity</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schoolStats.map((school, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{school.name}</CardTitle>
                    <CardDescription>{school.students} active students</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Enrollment</span>
                      <Badge variant={school.utilization > 85 ? "default" : "secondary"}>
                        {school.utilization}% capacity
                      </Badge>
                    </div>
                    <Progress value={school.utilization} />
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm">Manage</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Feature Performance
                </CardTitle>
                <CardDescription>Usage statistics and satisfaction ratings for AI-powered features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiMetrics.map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{metric.feature}</h4>
                        <Badge variant="outline">{metric.usage}% usage</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Usage Rate</span>
                          <span>{metric.usage}%</span>
                        </div>
                        <Progress value={metric.usage} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Satisfaction</span>
                          <span>{metric.satisfaction}%</span>
                        </div>
                        <Progress value={metric.satisfaction} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Platform Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Analytics dashboard coming soon</p>
                      <p className="text-sm">Comprehensive metrics and insights</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Server Load High</p>
                        <p className="text-xs text-gray-600">Consider scaling resources</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Backup Completed</p>
                        <p className="text-xs text-gray-600">All data safely backed up</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Student Management</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage enrollments, records, and progress</p>
                  <Button className="w-full">Access</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Course Management</h3>
                  <p className="text-sm text-gray-600 mb-4">Create and manage curriculum content</p>
                  <Button className="w-full">Access</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-4 text-emerald-600" />
                  <h3 className="font-semibold mb-2">Financial Management</h3>
                  <p className="text-sm text-gray-600 mb-4">Handle billing, payments, and finances</p>
                  <Button className="w-full">Access</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}