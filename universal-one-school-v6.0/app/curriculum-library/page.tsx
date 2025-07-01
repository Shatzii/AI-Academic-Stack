'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Star, 
  Clock, 
  Users, 
  Target, 
  CheckCircle, 
  Home, 
  Plus,
  Bookmark,
  Share,
  Copy,
  Trash2,
  RotateCcw,
  Settings,
  Tag,
  Calendar,
  FileText,
  Award
} from 'lucide-react'
import Link from 'next/link'

export default function CurriculumLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedCompliance, setSelectedCompliance] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCurriculum, setSelectedCurriculum] = useState(null)

  // Comprehensive curriculum database with Texas standards
  const [curriculumDatabase] = useState([
    {
      id: 'k-phonics-001',
      title: 'Kindergarten Phonics Foundations',
      grade: 'K',
      subject: 'English Language Arts',
      duration: '6 weeks',
      compliance: 'TEC Verified',
      accommodations: ['Dyslexia Support', 'ELL Support'],
      createdDate: '2024-12-20',
      lastModified: '2024-12-22',
      texCode: 'TEC §28.002',
      staarAligned: true,
      rating: 4.8,
      downloads: 245,
      author: 'Texas Education Specialists',
      tags: ['phonics', 'reading', 'foundational', 'systematic'],
      objectives: [
        'Students will identify all 26 letters and their corresponding sounds',
        'Students will blend 2-3 phonemes to form simple words',
        'Students will segment words into individual phonemes',
        'Students will demonstrate phonemic awareness through sound manipulation'
      ],
      activities: [
        'Letter sound identification games with manipulatives',
        'Phoneme blending activities using picture cards',
        'Sound segmentation exercises with counting bears',
        'Interactive alphabet songs and chants',
        'Multisensory letter formation practice'
      ],
      assessments: [
        'Weekly letter-sound correspondence check',
        'Bi-weekly phoneme blending assessment',
        'Monthly phonemic awareness screening',
        'Progress monitoring every 2 weeks'
      ],
      materials: [
        'Letter cards and magnetic letters',
        'Picture cards for blending',
        'Counting bears for segmentation',
        'Interactive whiteboard activities',
        'Assessment recording sheets'
      ],
      differentiation: [
        'Visual supports for ELL students',
        'Kinesthetic activities for ADHD learners',
        'Structured multisensory approach for dyslexia',
        'Extended practice for struggling learners'
      ]
    },
    {
      id: 'grade1-math-001',
      title: 'Grade 1 Number Sense and Place Value',
      grade: '1',
      subject: 'Mathematics',
      duration: '4 weeks',
      compliance: 'TEC Verified',
      accommodations: ['ADHD Support', 'Autism Spectrum'],
      createdDate: '2024-12-18',
      lastModified: '2024-12-21',
      texCode: 'TEC §28.025',
      staarAligned: true,
      rating: 4.6,
      downloads: 189,
      author: 'Elementary Math Collective',
      tags: ['number sense', 'place value', 'counting', 'base ten'],
      objectives: [
        'Students will count, read, and write numbers to 120',
        'Students will understand place value for tens and ones',
        'Students will compare and order numbers within 120',
        'Students will use place value understanding to add and subtract'
      ],
      activities: [
        'Base-ten block explorations and building',
        'Number line games and activities',
        'Counting collections and estimation',
        'Place value mats with manipulatives',
        'Digital number sense games'
      ],
      assessments: [
        'Number recognition and writing assessment',
        'Place value understanding check',
        'Comparing numbers performance task',
        'Weekly formative assessments'
      ],
      materials: [
        'Base-ten blocks and place value mats',
        'Number cards 1-120',
        'Counting collections (buttons, beans, etc.)',
        'Interactive number line',
        'Digital assessment tools'
      ],
      differentiation: [
        'Movement breaks for ADHD students',
        'Visual schedules for autism spectrum learners',
        'Concrete to abstract progression',
        'Peer support partnerships'
      ]
    },
    {
      id: 'grade5-science-001',
      title: 'Grade 5 Earth Systems and Weather Patterns',
      grade: '5',
      subject: 'Science',
      duration: '8 weeks',
      compliance: 'TEC Verified',
      accommodations: ['Gifted and Talented', '504 Plan'],
      createdDate: '2024-12-15',
      lastModified: '2024-12-20',
      texCode: 'TEC §28.025',
      staarAligned: true,
      rating: 4.9,
      downloads: 167,
      author: 'Texas Science Education Network',
      tags: ['earth science', 'weather', 'inquiry', 'data analysis'],
      objectives: [
        'Students will describe and model the water cycle',
        'Students will analyze weather patterns and predict changes',
        'Students will investigate the relationship between Earth systems',
        'Students will design solutions to weather-related problems'
      ],
      activities: [
        'Water cycle terrariums and observations',
        'Weather station data collection and analysis',
        'Climate pattern investigations using technology',
        'Engineering design challenges for weather protection',
        'Scientific modeling and explanation development'
      ],
      assessments: [
        'Water cycle diagram and explanation',
        'Weather prediction project',
        'Earth systems interaction model',
        'Engineering design portfolio'
      ],
      materials: [
        'Weather monitoring equipment',
        'Digital weather databases',
        'Terrarium building materials',
        'Modeling clay and diagram materials',
        'Engineering design supplies'
      ],
      differentiation: [
        'Advanced research projects for gifted students',
        'Assistive technology for 504 accommodations',
        'Collaborative group investigations',
        'Multiple representation options'
      ]
    },
    {
      id: 'grade9-algebra-001',
      title: 'Algebra I: Linear Functions and Relationships',
      grade: '9',
      subject: 'Mathematics',
      duration: '6 weeks',
      compliance: 'TEC Verified',
      accommodations: ['Dyslexia Support', 'ADHD Support'],
      createdDate: '2024-12-10',
      lastModified: '2024-12-19',
      texCode: 'TEC §28.025(a)',
      staarAligned: true,
      rating: 4.7,
      downloads: 298,
      author: 'Secondary Mathematics Alliance',
      tags: ['algebra', 'linear functions', 'graphing', 'problem solving'],
      objectives: [
        'Students will graph linear functions in multiple representations',
        'Students will write linear equations in various forms',
        'Students will solve systems of linear equations',
        'Students will model real-world situations with linear functions'
      ],
      activities: [
        'Graphing calculator explorations',
        'Real-world linear modeling projects',
        'Collaborative problem-solving sessions',
        'Technology-enhanced investigations',
        'Peer tutoring and explanation activities'
      ],
      assessments: [
        'STAAR-aligned unit assessment',
        'Real-world modeling project',
        'Graphing skills demonstration',
        'Problem-solving portfolio'
      ],
      materials: [
        'Graphing calculators or technology',
        'Real-world data sets',
        'Graphing paper and tools',
        'Interactive algebra software',
        'Assessment rubrics'
      ],
      differentiation: [
        'Audio support for dyslexic students',
        'Movement and fidget tools for ADHD',
        'Multiple solution pathways',
        'Flexible pacing options'
      ]
    },
    {
      id: 'grade3-social-001',
      title: 'Grade 3 Texas Communities and Citizenship',
      grade: '3',
      subject: 'Social Studies',
      duration: '5 weeks',
      compliance: 'TEC Verified',
      accommodations: ['ELL Support', 'Autism Spectrum'],
      createdDate: '2024-12-12',
      lastModified: '2024-12-18',
      texCode: 'TEC §28.025',
      staarAligned: false,
      rating: 4.5,
      downloads: 156,
      author: 'Texas Social Studies Coalition',
      tags: ['community', 'citizenship', 'texas history', 'geography'],
      objectives: [
        'Students will identify characteristics of Texas communities',
        'Students will describe rights and responsibilities of citizenship',
        'Students will analyze how geography affects community development',
        'Students will compare past and present community life'
      ],
      activities: [
        'Virtual community tours and comparisons',
        'Citizenship role-playing scenarios',
        'Texas geography mapping activities',
        'Community helper interviews and presentations',
        'Historical timeline creation'
      ],
      assessments: [
        'Community comparison project',
        'Citizenship demonstration',
        'Texas geography quiz',
        'Historical timeline presentation'
      ],
      materials: [
        'Texas maps and globes',
        'Community pictures and resources',
        'Interview recording tools',
        'Timeline creation materials',
        'Citizenship scenario cards'
      ],
      differentiation: [
        'Visual supports and translations for ELL',
        'Structured routines for autism spectrum',
        'Multiple communication options',
        'Cultural connection opportunities'
      ]
    },
    {
      id: 'grade11-english-001',
      title: 'Grade 11 American Literature and Rhetoric',
      grade: '11',
      subject: 'English Language Arts',
      duration: '9 weeks',
      compliance: 'TEC Verified',
      accommodations: ['Gifted and Talented', 'Dyslexia Support'],
      createdDate: '2024-12-08',
      lastModified: '2024-12-17',
      texCode: 'TEC §28.025(a)',
      staarAligned: true,
      rating: 4.8,
      downloads: 203,
      author: 'Advanced English Educators',
      tags: ['american literature', 'rhetoric', 'analysis', 'writing'],
      objectives: [
        'Students will analyze themes in American literature',
        'Students will evaluate rhetorical strategies in speeches and essays',
        'Students will compose argumentative essays with textual evidence',
        'Students will present literary analysis with supporting evidence'
      ],
      activities: [
        'Socratic seminars on literary themes',
        'Rhetorical analysis of historical speeches',
        'Collaborative annotation and discussion',
        'Research-based argumentative writing',
        'Multimedia presentation development'
      ],
      assessments: [
        'STAAR English II preparation assessment',
        'Rhetorical analysis essay',
        'Literary analysis presentation',
        'Research-based argument paper'
      ],
      materials: [
        'American literature anthology',
        'Historical speech recordings',
        'Research databases and resources',
        'Presentation technology',
        'Writing assessment rubrics'
      ],
      differentiation: [
        'Independent research opportunities for gifted',
        'Text-to-speech technology for dyslexia',
        'Choice in literary selections',
        'Flexible assessment formats'
      ]
    }
  ])

  // Filter functions
  const filteredCurricula = curriculumDatabase.filter(curriculum => {
    const matchesSearch = curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curriculum.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesGrade = selectedGrade === 'all' || curriculum.grade === selectedGrade
    const matchesSubject = selectedSubject === 'all' || curriculum.subject === selectedSubject
    const matchesCompliance = selectedCompliance === 'all' || 
                             (selectedCompliance === 'verified' && curriculum.compliance === 'TEC Verified') ||
                             (selectedCompliance === 'staar' && curriculum.staarAligned)
    
    return matchesSearch && matchesGrade && matchesSubject && matchesCompliance
  })

  // Sort function
  const sortedCurricula = [...filteredCurricula].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastModified) - new Date(a.lastModified)
      case 'oldest':
        return new Date(a.lastModified) - new Date(b.lastModified)
      case 'rating':
        return b.rating - a.rating
      case 'downloads':
        return b.downloads - a.downloads
      case 'alphabetical':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const getGradeOptions = () => {
    return ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  }

  const getSubjectOptions = () => {
    return [
      'English Language Arts',
      'Mathematics', 
      'Science',
      'Social Studies',
      'Art',
      'Music',
      'Physical Education',
      'Health',
      'Technology',
      'Career Education'
    ]
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/curriculum-generator">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Plus className="h-4 w-4 mr-2" />
                Create Curriculum
              </Button>
            </Link>
            <Link href="/compliance-center">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <CheckCircle className="h-4 w-4 mr-2" />
                Compliance Center
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Texas K-12 Curriculum Library
          </h1>
          <p className="text-blue-200 text-lg">
            Comprehensive Collection | TEC Compliant | STAAR Aligned | Accessibility Ready
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <Badge className="bg-blue-600/20 text-blue-300 px-4 py-2">
              {curriculumDatabase.length} Curricula
            </Badge>
            <Badge className="bg-green-600/20 text-green-300 px-4 py-2">
              {curriculumDatabase.filter(c => c.compliance === 'TEC Verified').length} TEC Verified
            </Badge>
            <Badge className="bg-orange-600/20 text-orange-300 px-4 py-2">
              {curriculumDatabase.filter(c => c.staarAligned).length} STAAR Aligned
            </Badge>
            <Badge className="bg-purple-600/20 text-purple-300 px-4 py-2">
              K-12 Coverage
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/10 border-white/20 text-white mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search curricula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              {/* Grade Filter */}
              <div>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {getGradeOptions().map(grade => (
                      <SelectItem key={grade} value={grade}>
                        {grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Filter */}
              <div>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getSubjectOptions().map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Compliance Filter */}
              <div>
                <Select value={selectedCompliance} onValueChange={setSelectedCompliance}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Compliance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="verified">TEC Verified</SelectItem>
                    <SelectItem value="staar">STAAR Aligned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-blue-200">
                Showing {sortedCurricula.length} of {curriculumDatabase.length} curricula
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Grid
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curriculum Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCurricula.map(curriculum => (
              <Card key={curriculum.id} className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge className="bg-blue-600/20 text-blue-300 text-xs">
                        {curriculum.grade === 'K' ? 'K' : `G${curriculum.grade}`}
                      </Badge>
                      <Badge className={`${
                        curriculum.compliance === 'TEC Verified' ? 'bg-green-600/20 text-green-300' :
                        'bg-yellow-600/20 text-yellow-300'
                      } text-xs`}>
                        {curriculum.compliance === 'TEC Verified' ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Bookmark className="h-3 w-3" />
                    </Button>
                  </div>
                  <CardTitle className="text-sm leading-tight">{curriculum.title}</CardTitle>
                  <div className="text-xs text-blue-300">{curriculum.subject}</div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {renderStars(curriculum.rating)}
                      <span className="text-xs text-white/70 ml-1">({curriculum.downloads})</span>
                    </div>
                    
                    <div className="text-xs text-white/70">
                      {curriculum.duration} • {curriculum.texCode}
                    </div>
                    
                    {curriculum.staarAligned && (
                      <Badge className="bg-orange-600/20 text-orange-300 text-xs">
                        STAAR Aligned
                      </Badge>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {curriculum.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} className="bg-purple-600/20 text-purple-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {curriculum.tags.length > 3 && (
                        <span className="text-xs text-white/50">+{curriculum.tags.length - 3}</span>
                      )}
                    </div>
                    
                    <div className="flex gap-1 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1 bg-blue-600/20 border-blue-600/30 text-blue-300 hover:bg-blue-600/30">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-white">{curriculum.title}</DialogTitle>
                            <DialogDescription className="text-gray-300">
                              {curriculum.grade === 'K' ? 'Kindergarten' : `Grade ${curriculum.grade}`} • {curriculum.subject} • {curriculum.duration}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6 text-white">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-blue-300 mb-2">Details</h4>
                                <div className="space-y-1 text-sm">
                                  <div>Texas Code: {curriculum.texCode}</div>
                                  <div>Rating: {curriculum.rating}/5 ({curriculum.downloads} downloads)</div>
                                  <div>Author: {curriculum.author}</div>
                                  <div>Created: {curriculum.createdDate}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-green-300 mb-2">Accommodations</h4>
                                <div className="flex flex-wrap gap-1">
                                  {curriculum.accommodations.map(acc => (
                                    <Badge key={acc} className="bg-green-600/20 text-green-300 text-xs">
                                      {acc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-yellow-300 mb-2">Learning Objectives</h4>
                              <ul className="space-y-1 text-sm">
                                {curriculum.objectives.map((obj, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <Target className="h-3 w-3 text-yellow-400 mt-1" />
                                    <span>{obj}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-purple-300 mb-2">Activities</h4>
                              <ul className="space-y-1 text-sm">
                                {curriculum.activities.map((activity, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <Users className="h-3 w-3 text-purple-400 mt-1" />
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-orange-300 mb-2">Assessments</h4>
                              <ul className="space-y-1 text-sm">
                                {curriculum.assessments.map((assessment, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-orange-400 mt-1" />
                                    <span>{assessment}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {sortedCurricula.map(curriculum => (
              <Card key={curriculum.id} className="bg-white/10 border-white/20 text-white">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{curriculum.title}</h3>
                        <div className="flex gap-2">
                          <Badge className="bg-blue-600/20 text-blue-300 text-xs">
                            {curriculum.grade === 'K' ? 'K' : `Grade ${curriculum.grade}`}
                          </Badge>
                          <Badge className={`${
                            curriculum.compliance === 'TEC Verified' ? 'bg-green-600/20 text-green-300' :
                            'bg-yellow-600/20 text-yellow-300'
                          } text-xs`}>
                            {curriculum.compliance}
                          </Badge>
                          {curriculum.staarAligned && (
                            <Badge className="bg-orange-600/20 text-orange-300 text-xs">
                              STAAR
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-blue-300">{curriculum.subject} • {curriculum.duration}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/70">
                        <div className="flex items-center gap-1">
                          {renderStars(curriculum.rating)}
                          <span>({curriculum.downloads})</span>
                        </div>
                        <div>{curriculum.author}</div>
                        <div>{curriculum.lastModified}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Bookmark className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {sortedCurricula.length === 0 && (
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-white/50" />
              <h3 className="text-lg font-semibold mb-2">No curricula found</h3>
              <p className="text-white/70 mb-4">Try adjusting your search or filter criteria</p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedGrade('all')
                  setSelectedSubject('all')
                  setSelectedCompliance('all')
                }}
                className="bg-blue-600/20 border-blue-600/30 text-blue-300 hover:bg-blue-600/30"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}