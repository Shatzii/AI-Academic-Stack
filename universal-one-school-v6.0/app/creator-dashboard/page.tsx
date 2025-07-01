'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, BookOpen, Users, TrendingUp, Plus, Edit, Eye, BarChart3, Calendar } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

interface CreatorCourse {
  id: string
  title: string
  description: string
  price: number
  category: string
  level: string
  status: 'draft' | 'pending_review' | 'published' | 'rejected'
  enrollmentCount: number
  rating: number
  totalEarnings: number
  monthlyEarnings: number
  completionRate: number
  createdAt: string
}

export default function CreatorDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [courses, setCourses] = useState<CreatorCourse[]>([])
  const [isCreatingCourse, setIsCreatingCourse] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'mathematics',
    level: 'beginner',
    tags: '',
    duration: '',
    lessons: 0
  })

  // Mock creator data based on user type
  useEffect(() => {
    if (user) {
      // Different course portfolios based on user role
      const mockCourses: CreatorCourse[] = user.role === 'teacher' ? [
        {
          id: 'teacher-course-1',
          title: 'Advanced Calculus with Visual Learning',
          description: 'Master calculus concepts through innovative visual methods.',
          price: 149,
          category: 'mathematics',
          level: 'advanced',
          status: 'published',
          enrollmentCount: 567,
          rating: 4.8,
          totalEarnings: 59203,
          monthlyEarnings: 8456,
          completionRate: 85,
          createdAt: '2024-11-15'
        },
        {
          id: 'teacher-course-2',
          title: 'Music Theory Fundamentals Made Easy',
          description: 'Learn music theory through interactive exercises.',
          price: 129,
          category: 'arts',
          level: 'beginner',
          status: 'published',
          enrollmentCount: 445,
          rating: 4.9,
          totalEarnings: 40170,
          monthlyEarnings: 6234,
          completionRate: 88,
          createdAt: '2024-10-22'
        },
        {
          id: 'teacher-course-3',
          title: 'Physics Problem Solving Strategies',
          description: 'Systematic approach to tackling complex physics problems.',
          price: 179,
          category: 'science',
          level: 'intermediate',
          status: 'pending_review',
          enrollmentCount: 0,
          rating: 0,
          totalEarnings: 0,
          monthlyEarnings: 0,
          completionRate: 0,
          createdAt: '2025-01-18'
        }
      ] : [
        {
          id: 'student-course-1',
          title: 'Peer Tutoring: Algebra Made Simple',
          description: 'Learn algebra from a fellow student perspective.',
          price: 79,
          category: 'mathematics',
          level: 'beginner',
          status: 'published',
          enrollmentCount: 289,
          rating: 4.5,
          totalEarnings: 11420,
          monthlyEarnings: 1876,
          completionRate: 87,
          createdAt: '2024-12-08'
        },
        {
          id: 'student-course-2',
          title: 'Social Skills for Teens: Peer Perspective',
          description: 'Navigate teen social situations with confidence.',
          price: 69,
          category: 'social',
          level: 'beginner',
          status: 'published',
          enrollmentCount: 234,
          rating: 4.4,
          totalEarnings: 8073,
          monthlyEarnings: 1345,
          completionRate: 89,
          createdAt: '2024-11-30'
        },
        {
          id: 'student-course-3',
          title: 'Study Tips That Actually Work',
          description: 'Proven study strategies from a straight-A student.',
          price: 49,
          category: 'study_skills',
          level: 'beginner',
          status: 'draft',
          enrollmentCount: 0,
          rating: 0,
          totalEarnings: 0,
          monthlyEarnings: 0,
          completionRate: 0,
          createdAt: '2025-01-20'
        }
      ]
      setCourses(mockCourses)
    }
  }, [user])

  const revenueShare = user?.role === 'teacher' ? 0.7 : 0.5
  const totalEarnings = courses.reduce((sum, course) => sum + course.totalEarnings, 0)
  const monthlyEarnings = courses.reduce((sum, course) => sum + course.monthlyEarnings, 0)
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollmentCount, 0)
  const publishedCourses = courses.filter(c => c.status === 'published').length

  const handleCreateCourse = async () => {
    try {
      const response = await fetch('/api/marketplace/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newCourse,
          creator: user?.username,
          creatorType: user?.role === 'teacher' ? 'teacher' : 'student',
          tags: newCourse.tags.split(',').map(tag => tag.trim())
        })
      })

      if (response.ok) {
        toast({
          title: "Course Submitted",
          description: "Your course has been submitted for review. We'll notify you once it's approved!"
        })
        setIsCreatingCourse(false)
        setNewCourse({
          title: '',
          description: '',
          price: 0,
          category: 'mathematics',
          level: 'beginner',
          tags: '',
          duration: '',
          lessons: 0
        })
      } else {
        throw new Error('Failed to create course')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit course. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700/50 p-8">
          <CardContent className="text-center">
            <h1 className="text-2xl font-bold mb-4">Creator Dashboard</h1>
            <p className="text-gray-300 mb-4">Please log in to access your creator dashboard</p>
            <Button>Log In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-gray-300">
              Welcome back, {user.firstName}! 
              {user.role === 'teacher' && ' You earn 70% revenue share on all sales.'}
              {user.role === 'student' && ' You earn 50% revenue share on all sales.'}
            </p>
          </div>
          <Button 
            onClick={() => setIsCreatingCourse(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Total Earnings</p>
                  <p className="text-2xl font-bold text-cyan-400">${totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-xs text-gray-400 mt-2">+${monthlyEarnings.toLocaleString()} this month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Published Courses</p>
                  <p className="text-2xl font-bold text-purple-400">{publishedCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-xs text-gray-400 mt-2">{courses.length - publishedCourses} in review</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Total Students</p>
                  <p className="text-2xl font-bold text-green-400">{totalEnrollments.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Across all courses</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Avg. Rating</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {publishedCourses > 0 ? (courses.filter(c => c.status === 'published').reduce((sum, c) => sum + c.rating, 0) / publishedCourses).toFixed(1) : '0.0'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Based on student reviews</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700/50">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <Card key={course.id} className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge 
                        className={
                          course.status === 'published' ? 'bg-green-500' :
                          course.status === 'pending_review' ? 'bg-yellow-500' :
                          course.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                        }
                      >
                        {course.status.replace('_', ' ')}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Price</span>
                        <span className="font-semibold text-cyan-400">${course.price}</span>
                      </div>
                      
                      {course.status === 'published' && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Students</span>
                            <span className="font-semibold">{course.enrollmentCount}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Rating</span>
                            <span className="font-semibold text-yellow-400">{course.rating} ⭐</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Total Earned</span>
                            <span className="font-semibold text-green-400">${course.totalEarnings.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">This Month</span>
                            <span className="font-semibold text-green-400">${course.monthlyEarnings.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      
                      <div className="pt-2 border-t border-slate-700">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                          <span>{course.category}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Course Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.filter(c => c.status === 'published').map(course => (
                      <div key={course.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-gray-400">{course.enrollmentCount} students</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">{course.completionRate}%</div>
                          <div className="text-xs text-gray-400">completion</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Monthly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">${monthlyEarnings.toLocaleString()}</div>
                      <div className="text-gray-300">This Month's Earnings</div>
                      <div className="text-sm text-gray-400 mt-2">
                        {revenueShare * 100}% revenue share • {user.role === 'teacher' ? 'Teacher' : 'Student'} rate
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-700/50 rounded">
                        <div className="text-xl font-bold text-purple-400">{courses.filter(c => c.status === 'published').length}</div>
                        <div className="text-sm text-gray-400">Live Courses</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded">
                        <div className="text-xl font-bold text-yellow-400">{totalEnrollments}</div>
                        <div className="text-sm text-gray-400">Total Students</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
                <CardDescription>
                  Your revenue share: {revenueShare * 100}% • Platform fee: {(1 - revenueShare) * 100}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-6 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">${totalEarnings.toLocaleString()}</div>
                      <div className="text-gray-300">Total Earnings</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">${monthlyEarnings.toLocaleString()}</div>
                      <div className="text-gray-300">This Month</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">${Math.round(monthlyEarnings * 0.85)}</div>
                      <div className="text-gray-300">Next Payout</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Course Revenue</h3>
                    {courses.filter(c => c.status === 'published' && c.totalEarnings > 0).map(course => (
                      <div key={course.id} className="flex justify-between items-center p-4 bg-slate-700/50 rounded">
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-gray-400">
                            ${course.price} × {course.enrollmentCount} students × {revenueShare * 100}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">${course.totalEarnings.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">total earned</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Course Modal */}
        {isCreatingCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New Course</CardTitle>
                <CardDescription>
                  Share your knowledge and earn {revenueShare * 100}% of all sales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Course Title</label>
                  <Input
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    placeholder="Enter an engaging course title"
                    className="bg-slate-700/50 border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    placeholder="Describe what students will learn and why they should take this course"
                    className="bg-slate-700/50 border-slate-600 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <Input
                      type="number"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({...newCourse, price: Number(e.target.value)})}
                      placeholder="0"
                      className="bg-slate-700/50 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Lessons</label>
                    <Input
                      type="number"
                      value={newCourse.lessons}
                      onChange={(e) => setNewCourse({...newCourse, lessons: Number(e.target.value)})}
                      placeholder="0"
                      className="bg-slate-700/50 border-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white"
                    >
                      <option value="mathematics">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="literacy">Literacy</option>
                      <option value="social">Social Skills</option>
                      <option value="arts">Arts</option>
                      <option value="technology">Technology</option>
                      <option value="study_skills">Study Skills</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Level</label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    value={newCourse.tags}
                    onChange={(e) => setNewCourse({...newCourse, tags: e.target.value})}
                    placeholder="e.g. visual learning, problem solving, interactive"
                    className="bg-slate-700/50 border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <Input
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                    placeholder="e.g. 6 weeks, 3 months"
                    className="bg-slate-700/50 border-slate-600"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreatingCourse(false)}
                    className="border-slate-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateCourse}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500"
                  >
                    Submit for Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}