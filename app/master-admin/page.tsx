'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Crown, 
  Globe, 
  School, 
  Users, 
  DollarSign, 
  Settings, 
  BarChart3, 
  Shield,
  Zap,
  Plus,
  Edit,
  Eye,
  AlertCircle
} from 'lucide-react'

interface NetworkStats {
  id: string
  name: string
  schoolCount: number
  studentCount: number
  revenue: number
  status: 'active' | 'inactive' | 'pending'
  domain: string
}

interface GlobalMetrics {
  totalNetworks: number
  totalSchools: number
  totalStudents: number
  totalRevenue: number
  activeModules: number
  systemHealth: number
}

export default function MasterAdminDashboard() {
  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetrics>({
    totalNetworks: 42,
    totalSchools: 327,
    totalStudents: 156789,
    totalRevenue: 25600000,
    activeModules: 18,
    systemHealth: 99.7
  })

  const [networks, setNetworks] = useState<NetworkStats[]>([
    {
      id: '1',
      name: 'Texas Education Consortium',
      schoolCount: 89,
      studentCount: 45000,
      revenue: 8900000,
      status: 'active',
      domain: 'texas-schools.edu'
    },
    {
      id: '2', 
      name: 'European Learning Network',
      schoolCount: 156,
      studentCount: 78500,
      revenue: 12400000,
      status: 'active',
      domain: 'eu-learning.org'
    },
    {
      id: '3',
      name: 'Singapore Smart Schools',
      schoolCount: 67,
      studentCount: 28900,
      revenue: 3800000,
      status: 'active',
      domain: 'sg-smart.edu.sg'
    },
    {
      id: '4',
      name: 'Nordic Education Initiative',
      schoolCount: 15,
      studentCount: 4389,
      revenue: 450000,
      status: 'pending',
      domain: 'nordic-edu.dk'
    }
  ])

  const [selectedTab, setSelectedTab] = useState('overview')

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-yellow-400" />
                <div>
                  <h1 className="text-2xl font-bold">Master Control Center</h1>
                  <p className="text-sm text-slate-400">SpacePharaoh - Supreme Administrator</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <Shield className="h-3 w-3 mr-1" />
                System Health: {globalMetrics.systemHealth}%
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Platform Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Networks</p>
                  <p className="text-2xl font-bold">{globalMetrics.totalNetworks}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Schools</p>
                  <p className="text-2xl font-bold">{globalMetrics.totalSchools}</p>
                </div>
                <School className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Students</p>
                  <p className="text-2xl font-bold">{globalMetrics.totalStudents.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Revenue</p>
                  <p className="text-2xl font-bold">${(globalMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Modules</p>
                  <p className="text-2xl font-bold">{globalMetrics.activeModules}</p>
                </div>
                <Zap className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Health</p>
                  <p className="text-2xl font-bold">{globalMetrics.systemHealth}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700">
            <TabsTrigger value="overview">Global Overview</TabsTrigger>
            <TabsTrigger value="networks">Network Management</TabsTrigger>
            <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
            <TabsTrigger value="modules">Module Control</TabsTrigger>
            <TabsTrigger value="billing">Revenue Center</TabsTrigger>
            <TabsTrigger value="system">System Control</TabsTrigger>
          </TabsList>

          {/* Global Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <span>Global Network Status</span>
                  </CardTitle>
                  <CardDescription>Real-time network performance across all regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {networks.map((network) => (
                      <div key={network.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{network.name}</h4>
                          <p className="text-sm text-slate-400">{network.schoolCount} schools • {network.studentCount.toLocaleString()} students</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={network.status === 'active' ? 'default' : network.status === 'pending' ? 'secondary' : 'destructive'}
                            className={network.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500' : ''}
                          >
                            {network.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <span>System Alerts</span>
                  </CardTitle>
                  <CardDescription>Critical notifications requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Nordic Education Initiative pending approval</p>
                        <p className="text-xs text-slate-400">Network setup requires master admin authorization</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Platform update available</p>
                        <p className="text-xs text-slate-400">Universal One School v4.1 ready for deployment</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Revenue milestone achieved</p>
                        <p className="text-xs text-slate-400">$25M ARR target reached ahead of schedule</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Network Management */}
          <TabsContent value="networks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Network Management</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Network
              </Button>
            </div>

            <div className="grid gap-4">
              {networks.map((network) => (
                <Card key={network.id} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium">{network.name}</h4>
                          <Badge 
                            variant={network.status === 'active' ? 'default' : 'secondary'}
                            className={network.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500' : ''}
                          >
                            {network.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">{network.domain}</p>
                        <div className="flex items-center space-x-6 text-sm">
                          <span><strong>{network.schoolCount}</strong> schools</span>
                          <span><strong>{network.studentCount.toLocaleString()}</strong> students</span>
                          <span><strong>${(network.revenue / 1000000).toFixed(1)}M</strong> revenue</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs content */}
          <TabsContent value="analytics">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Comprehensive performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Advanced analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Module Control Center</CardTitle>
                <CardDescription>Manage platform features and capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Module management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Revenue Center</CardTitle>
                <CardDescription>Financial overview and billing management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Revenue analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>System Control</CardTitle>
                <CardDescription>Platform configuration and system management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">System administration tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}