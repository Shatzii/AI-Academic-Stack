'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, ShoppingCart, User, Clock, BookOpen, Filter, Search, TrendingUp, Award } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface CourseItem {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  creator: string
  creatorType: 'platform' | 'teacher' | 'student'
  rating: number
  reviewCount: number
  duration: string
  lessons: number
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  tags: string[]
  thumbnail: string
  bestseller?: boolean
  featured?: boolean
  neurodivergentFriendly: boolean
}

export default function MarketplacePage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  // Mock marketplace data
  const courses: CourseItem[] = [
    {
      id: '1',
      title: 'Neural Learning Optimization for ADHD Students',
      description: 'Revolutionary course using brain-computer interfaces to optimize focus and learning retention for ADHD learners.',
      price: 299,
      originalPrice: 399,
      creator: 'Universal One School',
      creatorType: 'platform',
      rating: 4.9,
      reviewCount: 847,
      duration: '8 weeks',
      lessons: 32,
      level: 'intermediate',
      category: 'neurodivergent',
      tags: ['ADHD', 'Neural Interface', 'Focus Training'],
      thumbnail: '/api/placeholder/300/200',
      bestseller: true,
      featured: true,
      neurodivergentFriendly: true
    },
    {
      id: '2',
      title: 'Holographic Mathematics: 3D Problem Solving',
      description: 'Experience mathematics in 3D space with holographic visualizations. Perfect for visual learners.',
      price: 199,
      creator: 'Dr. Sarah Chen',
      creatorType: 'teacher',
      rating: 4.8,
      reviewCount: 523,
      duration: '6 weeks',
      lessons: 24,
      level: 'beginner',
      category: 'mathematics',
      tags: ['Holographic', '3D Learning', 'Visual Math'],
      thumbnail: '/api/placeholder/300/200',
      featured: true,
      neurodivergentFriendly: true
    },
    {
      id: '3',
      title: 'Time Dimension History: Ancient Civilizations',
      description: 'Travel through time to experience ancient civilizations firsthand. Created by our top student Alex.',
      price: 149,
      originalPrice: 199,
      creator: 'Alex Rivera (Student)',
      creatorType: 'student',
      rating: 4.7,
      reviewCount: 312,
      duration: '4 weeks',
      lessons: 16,
      level: 'intermediate',
      category: 'history',
      tags: ['Time Travel', 'Ancient History', 'Immersive'],
      thumbnail: '/api/placeholder/300/200',
      neurodivergentFriendly: false
    },
    {
      id: '4',
      title: 'Emotional AI Companion for Social Skills',
      description: 'Develop social and emotional intelligence with AI-powered scenarios and feedback.',
      price: 249,
      creator: 'Universal One School',
      creatorType: 'platform',
      rating: 4.9,
      reviewCount: 691,
      duration: '10 weeks',
      lessons: 40,
      level: 'beginner',
      category: 'social',
      tags: ['Emotional AI', 'Social Skills', 'Autism Support'],
      thumbnail: '/api/placeholder/300/200',
      bestseller: true,
      neurodivergentFriendly: true
    },
    {
      id: '5',
      title: 'Quantum Collaboration: Global Science Projects',
      description: 'Collaborate with students worldwide on real science projects using quantum networking.',
      price: 179,
      creator: 'Prof. Maria Gonzalez',
      creatorType: 'teacher',
      rating: 4.6,
      reviewCount: 234,
      duration: '12 weeks',
      lessons: 48,
      level: 'advanced',
      category: 'science',
      tags: ['Quantum', 'Collaboration', 'Global Learning'],
      thumbnail: '/api/placeholder/300/200',
      neurodivergentFriendly: true
    },
    {
      id: '6',
      title: 'Dyslexia-Friendly Reading Mastery',
      description: 'Specialized reading program designed specifically for dyslexic learners with proven results.',
      price: 199,
      creator: 'Universal One School',
      creatorType: 'platform',
      rating: 4.9,
      reviewCount: 1247,
      duration: '16 weeks',
      lessons: 64,
      level: 'beginner',
      category: 'literacy',
      tags: ['Dyslexia', 'Reading', 'Specialized Learning'],
      thumbnail: '/api/placeholder/300/200',
      bestseller: true,
      featured: true,
      neurodivergentFriendly: true
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories', count: courses.length },
    { id: 'neurodivergent', name: 'Neurodivergent Support', count: courses.filter(c => c.category === 'neurodivergent').length },
    { id: 'mathematics', name: 'Mathematics', count: courses.filter(c => c.category === 'mathematics').length },
    { id: 'science', name: 'Science', count: courses.filter(c => c.category === 'science').length },
    { id: 'history', name: 'History', count: courses.filter(c => c.category === 'history').length },
    { id: 'literacy', name: 'Literacy', count: courses.filter(c => c.category === 'literacy').length },
    { id: 'social', name: 'Social Skills', count: courses.filter(c => c.category === 'social').length }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    
    let matchesPrice = true
    if (priceRange === 'free') matchesPrice = course.price === 0
    else if (priceRange === 'under100') matchesPrice = course.price < 100
    else if (priceRange === '100-200') matchesPrice = course.price >= 100 && course.price <= 200
    else if (priceRange === 'over200') matchesPrice = course.price > 200

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice
  })

  const handlePurchase = (courseId: string) => {
    // In a real app, this would integrate with payment processing
    alert(`Purchasing course ${courseId}. Integration with Stripe/PayPal would happen here.`)
  }

  const handleAddToCart = (courseId: string) => {
    // In a real app, this would add to shopping cart
    alert(`Added course ${courseId} to cart`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Course & Lesson Plan Marketplace
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover revolutionary educational content created by our platform, expert teachers, and talented students. 
            Transform learning with cutting-edge neurodivergent-friendly courses.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyan-400">847</div>
              <div className="text-sm text-gray-300">Total Courses</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <User className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">12.5K</div>
              <div className="text-sm text-gray-300">Active Learners</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">94%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-yellow-500/20">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">4.8</div>
              <div className="text-sm text-gray-300">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/30 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses, creators, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
              />
            </div>
            <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="under100">Under $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="over200">Over $200</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    {course.bestseller && (
                      <Badge className="bg-orange-500 hover:bg-orange-600">
                        Bestseller
                      </Badge>
                    )}
                    {course.featured && (
                      <Badge className="bg-purple-500 hover:bg-purple-600">
                        Featured
                      </Badge>
                    )}
                    {course.neurodivergentFriendly && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Neurodivergent Friendly
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-slate-700/80">
                      {course.level}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {course.creatorType === 'platform' ? '🏫' : course.creatorType === 'teacher' ? '👨‍🏫' : '🎓'} {course.creator}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </CardTitle>
                
                <CardDescription className="text-gray-300 mb-3 line-clamp-2">
                  {course.description}
                </CardDescription>

                <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                    <span>({course.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-slate-700/50">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-cyan-400">
                      ${course.price}
                    </span>
                    {course.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(course.id)}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(course.id)}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Creator Section */}
        <div className="mt-16 bg-slate-800/30 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Become a Creator</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Share your expertise and earn revenue by creating courses for our global community of learners.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-700/50 border-slate-600/50">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">👨‍🏫</div>
                <h3 className="text-lg font-semibold mb-2">Teachers</h3>
                <p className="text-gray-300 text-sm mb-4">Share your professional expertise and proven teaching methods</p>
                <div className="text-green-400 font-semibold">Earn 70% revenue share</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-700/50 border-slate-600/50">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-lg font-semibold mb-2">Students</h3>
                <p className="text-gray-300 text-sm mb-4">Create peer-to-peer learning content and tutorials</p>
                <div className="text-green-400 font-semibold">Earn 50% revenue share</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-700/50 border-slate-600/50">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🏫</div>
                <h3 className="text-lg font-semibold mb-2">Platform</h3>
                <p className="text-gray-300 text-sm mb-4">Premium AI-powered courses with breakthrough innovations</p>
                <div className="text-purple-400 font-semibold">Premium pricing</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 px-8 py-3">
              Start Creating Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}