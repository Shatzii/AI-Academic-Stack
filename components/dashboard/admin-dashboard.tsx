'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  School,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react'

interface AdminData {
  overview: {
    totalStudents: number
    totalTeachers: number
    totalParents: number
    activeUsers: number
  }
  schoolBreakdown: Record<string, number>
  neurodiversityStats: Record<string, number>
  enrollmentTypes: Record<string, number>
  recentActivity: {
    newRegistrations: number
    activeToday: number
    lessonsCompleted: number
    assessmentsSubmitted: number
  }
  systemHealth: {
    serverStatus: string
    databaseStatus: string
    aiServiceStatus: string
    lastBackup: string
    uptime: string
  }
}

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [selectedSchool, setSelectedSchool] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin?type=dashboard')
      const data = await response.json()
      setAdminData(data)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!adminData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold">Unable to load admin dashboard</h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    )
  }

  const schoolData = {
    'primary-school': { name: 'SuperHero School (K-6)', color: 'bg-blue-500' },
    'secondary-school': { name: 'Stage Prep School (7-12)', color: 'bg-purple-500' },
    'language-school': { name: 'Global Language Academy', color: 'bg-green-500' },
    'law-school': { name: 'Future Legal Professionals', color: 'bg-amber-500' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">The Universal One School - System Overview</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.overview.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.overview.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              +2 new hires this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parent Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.overview.totalParents}</div>
            <p className="text-xs text-muted-foreground">
              98% engagement rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.overview.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* School Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Students by School</CardTitle>
                <CardDescription>Current enrollment distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(adminData.schoolBreakdown).map(([schoolId, count]) => (
                    <div key={schoolId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${schoolData[schoolId as keyof typeof schoolData]?.color || 'bg-gray-400'}`} />
                        <span className="text-sm font-medium">
                          {schoolData[schoolId as keyof typeof schoolData]?.name || schoolId}
                        </span>
                      </div>
                      <div className="text-sm font-bold">{count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Neurodiversity Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Neurodiversity Distribution</CardTitle>
                <CardDescription>Student neurotype breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(adminData.neurodiversityStats).map(([type, count]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{type}</span>
                        <span className="text-sm font-bold">{count} students</span>
                      </div>
                      <Progress 
                        value={(count / adminData.overview.totalStudents) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Platform activity in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {adminData.recentActivity.newRegistrations}
                  </div>
                  <div className="text-sm text-gray-600">New Registrations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {adminData.recentActivity.activeToday}
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {adminData.recentActivity.lessonsCompleted}
                  </div>
                  <div className="text-sm text-gray-600">Lessons Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {adminData.recentActivity.assessmentsSubmitted}
                  </div>
                  <div className="text-sm text-gray-600">Assessments Submitted</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>School Management</CardTitle>
              <CardDescription>Manage individual school settings and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(schoolData).map(([schoolId, school]) => (
                  <Card key={schoolId} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{school.name}</span>
                        <Badge variant="outline">
                          {adminData.schoolBreakdown[schoolId]} students
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Students:</span>
                          <span className="font-medium">{adminData.schoolBreakdown[schoolId]}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Completion Rate:</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Satisfaction:</span>
                          <span className="font-medium">4.8/5</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline">Settings</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Analytics</CardTitle>
              <CardDescription>Comprehensive student performance and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Enrollment Types</h4>
                  <div className="space-y-2">
                    {Object.entries(adminData.enrollmentTypes).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Completion</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">At-Risk Students</span>
                      <span className="font-medium text-red-600">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Exceptional Progress</span>
                      <span className="font-medium text-green-600">45</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Support Needs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">IEP Students</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">504 Plans</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ESL Support</span>
                      <span className="font-medium">31</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Texas Education Code and regulatory compliance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Texas Education Code</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">TEC 28.002 - Required Curriculum</span>
                      </div>
                      <Badge variant="default">98%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">TEC 28.025 - Graduation Requirements</span>
                      </div>
                      <Badge variant="default">96%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm">TEC 29.081 - Compensatory Education</span>
                      </div>
                      <Badge variant="secondary">94%</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Accessibility & Safety</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">WCAG 2.1 AA Compliance</span>
                      </div>
                      <Badge variant="default">97%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">FERPA Compliance</span>
                      </div>
                      <Badge variant="default">99%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">COPPA Compliance</span>
                      </div>
                      <Badge variant="default">98%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Platform performance and infrastructure monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Service Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Main Server</span>
                      <Badge variant="default" className="bg-green-600">
                        {adminData.systemHealth.serverStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Database</span>
                      <Badge variant="default" className="bg-green-600">
                        {adminData.systemHealth.databaseStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">AI Services</span>
                      <Badge variant="default" className="bg-green-600">
                        {adminData.systemHealth.aiServiceStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Uptime</span>
                      <span className="font-medium">{adminData.systemHealth.uptime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Backup</span>
                      <span className="font-medium">
                        {new Date(adminData.systemHealth.lastBackup).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Response Time</span>
                      <span className="font-medium">45ms avg</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}