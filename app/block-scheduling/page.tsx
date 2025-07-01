'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Edit, 
  Save, 
  X, 
  AlertTriangle,
  CheckCircle,
  Home,
  Filter,
  Download,
  Upload,
  Search,
  Settings,
  RotateCcw
} from 'lucide-react'
import Link from 'next/link'

export default function DynamicBlockSchedulingPlanner() {
  const [selectedGrade, setSelectedGrade] = useState('9')
  const [selectedSemester, setSelectedSemester] = useState('fall2024')
  const [selectedStudent, setSelectedStudent] = useState('all')
  const [editingSchedule, setEditingSchedule] = useState(false)
  const [scheduleView, setScheduleView] = useState('grid')
  const [showCourseDialog, setShowCourseDialog] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(null)

  // Course catalog with comprehensive Texas requirements
  const courseCatalog = {
    english: [
      { id: 'eng1', name: 'English I', credits: 1, staar: true, required: true, grade: [9], semester: 'year', prereq: [] },
      { id: 'eng2', name: 'English II', credits: 1, staar: true, required: true, grade: [10], semester: 'year', prereq: ['eng1'] },
      { id: 'eng3', name: 'English III', credits: 1, required: true, grade: [11], semester: 'year', prereq: ['eng2'] },
      { id: 'eng4', name: 'English IV', credits: 1, required: true, grade: [12], semester: 'year', prereq: ['eng3'] },
      { id: 'speech', name: 'Speech & Drama', credits: 0.5, stagePrep: true, grade: [9, 10, 11, 12], semester: 'fall', prereq: [] },
      { id: 'creative_writing', name: 'Creative Writing', credits: 1, stagePrep: true, grade: [10, 11, 12], semester: 'year', prereq: ['eng1'] }
    ],
    mathematics: [
      { id: 'alg1', name: 'Algebra I', credits: 1, staar: true, required: true, grade: [9], semester: 'year', prereq: [] },
      { id: 'geo', name: 'Geometry', credits: 1, required: true, grade: [10], semester: 'year', prereq: ['alg1'] },
      { id: 'alg2', name: 'Algebra II', credits: 1, required: true, grade: [11], semester: 'year', prereq: ['geo'] },
      { id: 'precalc', name: 'Pre-Calculus', credits: 1, grade: [12], semester: 'year', prereq: ['alg2'] },
      { id: 'stats', name: 'Statistics', credits: 1, grade: [11, 12], semester: 'year', prereq: ['alg2'] },
      { id: 'calculus', name: 'AP Calculus', credits: 1, advanced: true, grade: [12], semester: 'year', prereq: ['precalc'] }
    ],
    science: [
      { id: 'bio', name: 'Biology', credits: 1, staar: true, required: true, grade: [9], semester: 'year', prereq: [] },
      { id: 'chem', name: 'Chemistry', credits: 1, required: true, grade: [10], semester: 'year', prereq: ['bio', 'alg1'] },
      { id: 'phys', name: 'Physics', credits: 1, required: true, grade: [11], semester: 'year', prereq: ['chem', 'geo'] },
      { id: 'envsci', name: 'Environmental Science', credits: 0.5, grade: [12], semester: 'fall', prereq: ['bio'] },
      { id: 'anatomy', name: 'Anatomy & Physiology', credits: 1, grade: [11, 12], semester: 'year', prereq: ['bio'] }
    ],
    socialStudies: [
      { id: 'worldgeo', name: 'World Geography', credits: 1, required: true, grade: [9], semester: 'year', prereq: [] },
      { id: 'worldhist', name: 'World History', credits: 1, required: true, grade: [10], semester: 'year', prereq: [] },
      { id: 'ushist', name: 'US History', credits: 1, staar: true, required: true, grade: [11], semester: 'year', prereq: [] },
      { id: 'gov', name: 'Government', credits: 0.5, required: true, grade: [12], semester: 'fall', prereq: [] },
      { id: 'econ', name: 'Economics', credits: 0.5, required: true, grade: [12], semester: 'spring', prereq: [] },
      { id: 'psych', name: 'Psychology', credits: 1, grade: [11, 12], semester: 'year', prereq: [] }
    ],
    stagePrep: [
      { id: 'theater1', name: 'Theater Arts I', credits: 1, stagePrep: true, required: true, grade: [9], semester: 'year', prereq: [] },
      { id: 'theater2', name: 'Advanced Theater Performance', credits: 1, stagePrep: true, grade: [10, 11, 12], semester: 'year', prereq: ['theater1'] },
      { id: 'stagemgmt', name: 'Stage Management', credits: 1, stagePrep: true, grade: [10, 11, 12], semester: 'year', prereq: ['theater1'] },
      { id: 'voice', name: 'Voice & Diction', credits: 0.5, stagePrep: true, grade: [9, 10, 11, 12], semester: 'spring', prereq: [] },
      { id: 'chardev', name: 'Character Development', credits: 0.5, stagePrep: true, grade: [10, 11, 12], semester: 'fall', prereq: ['theater1'] },
      { id: 'portfolio', name: 'Portfolio Development', credits: 1, stagePrep: true, grade: [11, 12], semester: 'year', prereq: ['theater2'] },
      { id: 'capstone', name: 'Theater Capstone Project', credits: 1, stagePrep: true, grade: [12], semester: 'year', prereq: ['portfolio'] },
      { id: 'lighting', name: 'Lighting & Sound Design', credits: 1, stagePrep: true, grade: [11, 12], semester: 'year', prereq: ['theater1'] },
      { id: 'costume', name: 'Costume & Makeup Design', credits: 1, stagePrep: true, grade: [10, 11, 12], semester: 'year', prereq: ['theater1'] }
    ],
    electives: [
      { id: 'spanish1', name: 'Spanish I', credits: 1, required: true, grade: [9, 10], semester: 'year', prereq: [] },
      { id: 'spanish2', name: 'Spanish II', credits: 1, required: true, grade: [10, 11], semester: 'year', prereq: ['spanish1'] },
      { id: 'spanish3', name: 'Spanish III', credits: 1, grade: [11, 12], semester: 'year', prereq: ['spanish2'] },
      { id: 'pe', name: 'PE/Health', credits: 1, required: true, grade: [9], semester: 'year', prereq: [] },
      { id: 'digital', name: 'Digital Media Arts', credits: 1, stagePrep: true, grade: [9, 10, 11, 12], semester: 'year', prereq: [] },
      { id: 'career', name: 'Career Investigation', credits: 1, required: true, grade: [11], semester: 'year', prereq: [] },
      { id: 'journalism', name: 'Journalism', credits: 1, grade: [10, 11, 12], semester: 'year', prereq: [] },
      { id: 'art', name: 'Art Fundamentals', credits: 1, grade: [9, 10, 11, 12], semester: 'year', prereq: [] }
    ]
  }

  // Student database with realistic scheduling data
  const [studentDatabase, setStudentDatabase] = useState({
    'maya_rodriguez': {
      id: 'maya_rodriguez',
      name: 'Maya Rodriguez',
      grade: 11,
      pathway: 'Performance Track',
      gpa: 3.7,
      schedules: {
        fall2024: [
          { period: 1, courseId: 'eng3', courseName: 'English III', room: 'A101', teacher: 'Ms. Johnson', credits: 1 },
          { period: 2, courseId: 'alg2', courseName: 'Algebra II', room: 'B203', teacher: 'Mr. Chen', credits: 1 },
          { period: 3, courseId: 'phys', courseName: 'Physics', room: 'C105', teacher: 'Dr. Williams', credits: 1 },
          { period: 4, courseId: 'ushist', courseName: 'US History', room: 'A205', teacher: 'Mrs. Davis', credits: 1 }
        ],
        spring2025: [
          { period: 1, courseId: 'theater2', courseName: 'Advanced Theater Performance', room: 'Theater', teacher: 'Ms. Barrett', credits: 1 },
          { period: 2, courseId: 'chardev', courseName: 'Character Development', room: 'A102', teacher: 'Ms. Barrett', credits: 0.5 },
          { period: 3, courseId: 'digital', courseName: 'Digital Media Arts', room: 'Lab1', teacher: 'Mr. Tech', credits: 1 },
          { period: 4, courseId: 'career', courseName: 'Career Investigation', room: 'B101', teacher: 'Ms. Smith', credits: 1 }
        ]
      },
      completedCourses: ['eng1', 'eng2', 'alg1', 'geo', 'bio', 'chem', 'worldgeo', 'worldhist', 'theater1', 'spanish1', 'spanish2', 'pe'],
      preferences: {
        morningClasses: true,
        avoidBackToBack: false,
        preferredTeachers: ['Ms. Barrett', 'Ms. Johnson']
      }
    },
    'jordan_kim': {
      id: 'jordan_kim',
      name: 'Jordan Kim',
      grade: 10,
      pathway: 'Technical Theater Track',
      gpa: 3.9,
      schedules: {
        fall2024: [
          { period: 1, courseId: 'eng2', courseName: 'English II', room: 'A101', teacher: 'Ms. Johnson', credits: 1 },
          { period: 2, courseId: 'geo', courseName: 'Geometry', room: 'B203', teacher: 'Mr. Chen', credits: 1 },
          { period: 3, courseId: 'chem', courseName: 'Chemistry', room: 'C105', teacher: 'Dr. Williams', credits: 1 },
          { period: 4, courseId: 'worldhist', courseName: 'World History', room: 'A205', teacher: 'Mrs. Davis', credits: 1 }
        ],
        spring2025: [
          { period: 1, courseId: 'stagemgmt', courseName: 'Stage Management', room: 'Theater', teacher: 'Mr. Tech', credits: 1 },
          { period: 2, courseId: 'spanish2', courseName: 'Spanish II', room: 'A103', teacher: 'Sra. Garcia', credits: 1 },
          { period: 3, courseId: 'digital', courseName: 'Digital Media Arts', room: 'Lab1', teacher: 'Mr. Tech', credits: 1 },
          { period: 4, courseId: 'voice', courseName: 'Voice & Diction', room: 'A102', teacher: 'Ms. Barrett', credits: 0.5 }
        ]
      },
      completedCourses: ['eng1', 'alg1', 'bio', 'worldgeo', 'theater1', 'spanish1', 'pe'],
      preferences: {
        morningClasses: false,
        avoidBackToBack: true,
        preferredTeachers: ['Mr. Tech', 'Dr. Williams']
      }
    },
    'alex_thompson': {
      id: 'alex_thompson',
      name: 'Alex Thompson',
      grade: 12,
      pathway: 'Dramatic Writing Track',
      gpa: 3.8,
      schedules: {
        fall2024: [
          { period: 1, courseId: 'eng4', courseName: 'English IV', room: 'A101', teacher: 'Ms. Johnson', credits: 1 },
          { period: 2, courseId: 'precalc', courseName: 'Pre-Calculus', room: 'B203', teacher: 'Mr. Chen', credits: 1 },
          { period: 3, courseId: 'gov', courseName: 'Government', room: 'A205', teacher: 'Mrs. Davis', credits: 0.5 },
          { period: 4, courseId: 'capstone', courseName: 'Theater Capstone Project', room: 'Theater', teacher: 'Ms. Barrett', credits: 1 }
        ],
        spring2025: [
          { period: 1, courseId: 'creative_writing', courseName: 'Creative Writing', room: 'A102', teacher: 'Ms. Barrett', credits: 1 },
          { period: 2, courseId: 'econ', courseName: 'Economics', room: 'A205', teacher: 'Mrs. Davis', credits: 0.5 },
          { period: 3, courseId: 'envsci', courseName: 'Environmental Science', room: 'C105', teacher: 'Dr. Williams', credits: 0.5 },
          { period: 4, courseId: 'spanish3', courseName: 'Spanish III', room: 'A103', teacher: 'Sra. Garcia', credits: 1 }
        ]
      },
      completedCourses: ['eng1', 'eng2', 'eng3', 'alg1', 'geo', 'alg2', 'bio', 'chem', 'phys', 'worldgeo', 'worldhist', 'ushist', 'theater1', 'theater2', 'portfolio', 'spanish1', 'spanish2', 'pe', 'career'],
      preferences: {
        morningClasses: true,
        avoidBackToBack: false,
        preferredTeachers: ['Ms. Barrett', 'Ms. Johnson']
      }
    }
  })

  // Time slots for 4x4 block schedule
  const timeSlots = [
    { period: 1, time: '8:00 AM - 10:30 AM', duration: '2.5 hours' },
    { period: 2, time: '10:45 AM - 1:15 PM', duration: '2.5 hours' },
    { period: 3, time: '2:00 PM - 4:30 PM', duration: '2.5 hours' },
    { period: 4, time: '4:45 PM - 7:15 PM', duration: '2.5 hours' }
  ]

  // Validation functions
  const validateSchedule = (studentId, semester) => {
    const student = studentDatabase[studentId]
    if (!student) return { conflicts: [], warnings: [], suggestions: [] }
    
    const schedule = student.schedules[semester] || []
    const conflicts = []
    const warnings = []
    const suggestions = []
    
    // Check for time conflicts
    const periods = schedule.map(s => s.period)
    const duplicatePeriods = periods.filter((period, index) => periods.indexOf(period) !== index)
    duplicatePeriods.forEach(period => {
      conflicts.push(`Multiple courses scheduled for Period ${period}`)
    })
    
    // Check prerequisites
    schedule.forEach(scheduledCourse => {
      const course = Object.values(courseCatalog).flat().find(c => c.id === scheduledCourse.courseId)
      if (course && course.prereq) {
        const missingPrereqs = course.prereq.filter(prereq => !student.completedCourses.includes(prereq))
        if (missingPrereqs.length > 0) {
          warnings.push(`${course.name} requires: ${missingPrereqs.join(', ')}`)
        }
      }
    })
    
    // Check credit load
    const totalCredits = schedule.reduce((sum, course) => sum + (course.credits || 1), 0)
    if (totalCredits < 3) {
      warnings.push('Low credit load - consider adding more courses')
    } else if (totalCredits > 4.5) {
      warnings.push('High credit load - may be challenging')
    }
    
    // Check graduation requirements
    const requiredCourses = Object.values(courseCatalog).flat().filter(c => c.required && c.grade.includes(student.grade))
    requiredCourses.forEach(req => {
      if (!student.completedCourses.includes(req.id) && !schedule.some(s => s.courseId === req.id)) {
        suggestions.push(`Consider adding required course: ${req.name}`)
      }
    })
    
    return { conflicts, warnings, suggestions }
  }

  const getAvailableCourses = (studentId, semester) => {
    const student = studentDatabase[studentId]
    if (!student) return []
    
    return Object.values(courseCatalog).flat().filter(course => {
      // Check grade level
      if (!course.grade.includes(student.grade)) return false
      
      // Check if already completed
      if (student.completedCourses.includes(course.id)) return false
      
      // Check if already scheduled
      const currentSchedule = student.schedules[semester] || []
      if (currentSchedule.some(s => s.courseId === course.id)) return false
      
      // Check prerequisites
      if (course.prereq && course.prereq.length > 0) {
        const hasPrereqs = course.prereq.every(prereq => student.completedCourses.includes(prereq))
        if (!hasPrereqs) return false
      }
      
      return true
    })
  }

  const addCourseToSchedule = (studentId, semester, courseId, period) => {
    const course = Object.values(courseCatalog).flat().find(c => c.id === courseId)
    if (!course) return
    
    setStudentDatabase(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        schedules: {
          ...prev[studentId].schedules,
          [semester]: [
            ...(prev[studentId].schedules[semester] || []).filter(s => s.period !== period),
            {
              period,
              courseId: course.id,
              courseName: course.name,
              room: 'TBD',
              teacher: 'TBD',
              credits: course.credits
            }
          ].sort((a, b) => a.period - b.period)
        }
      }
    }))
  }

  const removeCourseFromSchedule = (studentId, semester, period) => {
    setStudentDatabase(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        schedules: {
          ...prev[studentId].schedules,
          [semester]: (prev[studentId].schedules[semester] || []).filter(s => s.period !== period)
        }
      }
    }))
  }

  const getStudentList = () => {
    return Object.values(studentDatabase).filter(student => 
      selectedGrade === 'all' || student.grade.toString() === selectedGrade
    )
  }

  const getCourseColor = (course) => {
    if (!course) return 'bg-gray-500/20'
    
    const courseData = Object.values(courseCatalog).flat().find(c => c.id === course.courseId)
    if (!courseData) return 'bg-gray-500/20'
    
    if (courseData.stagePrep) return 'bg-purple-500/20'
    if (courseData.required) return 'bg-blue-500/20'
    if (courseData.advanced) return 'bg-green-500/20'
    if (courseData.staar) return 'bg-yellow-500/20'
    return 'bg-gray-500/20'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/schools/secondary-school">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Home className="h-4 w-4 mr-2" />
                Back to Secondary School
              </Button>
            </Link>
            <Link href="/texas-graduation">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <GraduationCap className="h-4 w-4 mr-2" />
                Graduation Tracker
              </Button>
            </Link>
            <Link href="/college-readiness">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Users className="h-4 w-4 mr-2" />
                College Readiness
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Dynamic Block Scheduling Planner
          </h1>
          <p className="text-blue-200 text-lg">
            4×4 Block Schedule Management | Stage Prep Academic Planning
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <Badge className="bg-blue-600/20 text-blue-300 px-4 py-2">
              4 Blocks per Semester
            </Badge>
            <Badge className="bg-purple-600/20 text-purple-300 px-4 py-2">
              Year-Long Courses
            </Badge>
            <Badge className="bg-green-600/20 text-green-300 px-4 py-2">
              Texas Compliant
            </Badge>
            <Badge className="bg-orange-600/20 text-orange-300 px-4 py-2">
              Real-Time Validation
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <Label className="text-white mb-2 block">Grade Level</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
                <SelectItem value="12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-white mb-2 block">Semester</Label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fall2024">Fall 2024</SelectItem>
                <SelectItem value="spring2025">Spring 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-white mb-2 block">Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {getStudentList().map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-white mb-2 block">View Mode</Label>
            <Select value={scheduleView} onValueChange={setScheduleView}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end gap-2">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setEditingSchedule(!editingSchedule)}
            >
              {editingSchedule ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="scheduler" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border-white/20">
            <TabsTrigger value="scheduler" className="text-white">Schedule Builder</TabsTrigger>
            <TabsTrigger value="validation" className="text-white">Validation</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
            <TabsTrigger value="templates" className="text-white">Templates</TabsTrigger>
            <TabsTrigger value="reports" className="text-white">Reports</TabsTrigger>
          </TabsList>

          {/* Schedule Builder Tab */}
          <TabsContent value="scheduler" className="space-y-6">
            {selectedStudent === 'all' ? (
              // All students overview
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {getStudentList().map(student => {
                  const schedule = student.schedules[selectedSemester] || []
                  const validation = validateSchedule(student.id, selectedSemester)
                  const totalCredits = schedule.reduce((sum, course) => sum + (course.credits || 1), 0)
                  
                  return (
                    <Card key={student.id} className="bg-white/10 border-white/20 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{student.name}</span>
                          <Badge className="bg-purple-600/20 text-purple-300">
                            Grade {student.grade}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-blue-200">
                          {student.pathway} • {totalCredits} Credits
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {timeSlots.map(slot => {
                            const course = schedule.find(c => c.period === slot.period)
                            return (
                              <div key={slot.period} className={`p-3 rounded-lg border ${getCourseColor(course)} border-white/10`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="text-center">
                                      <div className="text-sm font-bold text-blue-300">Period {slot.period}</div>
                                      <div className="text-xs text-blue-200">{slot.time}</div>
                                    </div>
                                    {course ? (
                                      <div>
                                        <div className="font-medium text-sm">{course.courseName}</div>
                                        <div className="text-xs text-blue-200">{course.credits} credit{course.credits !== 1 ? 's' : ''}</div>
                                      </div>
                                    ) : (
                                      <div className="text-gray-400 italic text-sm">Unassigned</div>
                                    )}
                                  </div>
                                  {editingSchedule && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                      onClick={() => setSelectedStudent(student.id)}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        {/* Validation Summary */}
                        <div className="mt-4 space-y-2">
                          {validation.conflicts.length > 0 && (
                            <Badge className="bg-red-600/20 text-red-300 w-full justify-center">
                              {validation.conflicts.length} Conflict{validation.conflicts.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {validation.warnings.length > 0 && (
                            <Badge className="bg-yellow-600/20 text-yellow-300 w-full justify-center">
                              {validation.warnings.length} Warning{validation.warnings.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {validation.conflicts.length === 0 && validation.warnings.length === 0 && (
                            <Badge className="bg-green-600/20 text-green-300 w-full justify-center">
                              Valid Schedule
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              // Individual student detailed view
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schedule Grid */}
                <div className="lg:col-span-2">
                  <Card className="bg-white/10 border-white/20 text-white">
                    <CardHeader>
                      <CardTitle>
                        {studentDatabase[selectedStudent]?.name} - {selectedSemester === 'fall2024' ? 'Fall 2024' : 'Spring 2025'}
                      </CardTitle>
                      <CardDescription className="text-blue-200">
                        4×4 Block Schedule • {studentDatabase[selectedStudent]?.pathway}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {timeSlots.map(slot => {
                          const schedule = studentDatabase[selectedStudent]?.schedules[selectedSemester] || []
                          const course = schedule.find(c => c.period === slot.period)
                          
                          return (
                            <div key={slot.period} className={`p-4 rounded-lg border ${getCourseColor(course)} border-white/10`}>
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="font-bold text-lg text-blue-300">Period {slot.period}</div>
                                  <div className="text-sm text-blue-200">{slot.time} • {slot.duration}</div>
                                </div>
                                {editingSchedule && (
                                  <div className="flex gap-2">
                                    {course && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-red-600/20 border-red-600/30 text-red-300 hover:bg-red-600/30"
                                        onClick={() => removeCourseFromSchedule(selectedStudent, selectedSemester, slot.period)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    )}
                                    <Dialog open={showCourseDialog && selectedPeriod === slot.period} onOpenChange={(open) => {
                                      setShowCourseDialog(open)
                                      if (!open) setSelectedPeriod(null)
                                    }}>
                                      <DialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="bg-green-600/20 border-green-600/30 text-green-300 hover:bg-green-600/30"
                                          onClick={() => setSelectedPeriod(slot.period)}
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="bg-gray-900 border-gray-700">
                                        <DialogHeader>
                                          <DialogTitle className="text-white">Add Course - Period {slot.period}</DialogTitle>
                                          <DialogDescription className="text-gray-300">
                                            Select a course for {studentDatabase[selectedStudent]?.name}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                                          {getAvailableCourses(selectedStudent, selectedSemester).map(course => (
                                            <Button
                                              key={course.id}
                                              variant="outline"
                                              className="justify-start h-auto p-3 bg-white/5 border-white/10 text-white hover:bg-white/10"
                                              onClick={() => {
                                                addCourseToSchedule(selectedStudent, selectedSemester, course.id, slot.period)
                                                setShowCourseDialog(false)
                                                setSelectedPeriod(null)
                                              }}
                                            >
                                              <div className="text-left">
                                                <div className="font-medium">{course.name}</div>
                                                <div className="text-xs text-gray-400">
                                                  {course.credits} credit{course.credits !== 1 ? 's' : ''} • 
                                                  {course.required && ' Required'} 
                                                  {course.stagePrep && ' Stage Prep'} 
                                                  {course.staar && ' STAAR'}
                                                </div>
                                              </div>
                                            </Button>
                                          ))}
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                )}
                              </div>
                              
                              {course ? (
                                <div className="space-y-2">
                                  <div className="font-medium text-lg">{course.courseName}</div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-blue-300">Credits: </span>
                                      <span className="text-white">{course.credits}</span>
                                    </div>
                                    <div>
                                      <span className="text-blue-300">Room: </span>
                                      <span className="text-white">{course.room}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    {Object.values(courseCatalog).flat().filter(c => c.id === course.courseId).map(catalogCourse => (
                                      <div key={catalogCourse.id} className="flex gap-1">
                                        {catalogCourse.required && (
                                          <Badge className="bg-green-600/20 text-green-300 text-xs">Required</Badge>
                                        )}
                                        {catalogCourse.staar && (
                                          <Badge className="bg-yellow-600/20 text-yellow-300 text-xs">STAAR</Badge>
                                        )}
                                        {catalogCourse.stagePrep && (
                                          <Badge className="bg-purple-600/20 text-purple-300 text-xs">Stage Prep</Badge>
                                        )}
                                        {catalogCourse.advanced && (
                                          <Badge className="bg-blue-600/20 text-blue-300 text-xs">Advanced</Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <div className="text-gray-400 italic mb-2">No course assigned</div>
                                  <div className="text-xs text-gray-500">Click + to add a course</div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Student Info & Available Courses */}
                <div className="space-y-6">
                  {/* Student Information */}
                  <Card className="bg-white/10 border-white/20 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Student Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Grade:</span>
                        <span>{studentDatabase[selectedStudent]?.grade}th</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GPA:</span>
                        <Badge className="bg-green-600/20 text-green-300">
                          {studentDatabase[selectedStudent]?.gpa}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Pathway:</span>
                        <span className="text-purple-300">{studentDatabase[selectedStudent]?.pathway}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Credits:</span>
                        <span className="text-blue-300">
                          {(studentDatabase[selectedStudent]?.schedules[selectedSemester] || [])
                            .reduce((sum, course) => sum + (course.credits || 1), 0)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Available Courses */}
                  <Card className="bg-white/10 border-white/20 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Available Courses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {Object.entries(courseCatalog).map(([category, courses]) => {
                          const availableCourses = courses.filter(course => {
                            const student = studentDatabase[selectedStudent]
                            if (!student) return false
                            return course.grade.includes(student.grade) && 
                                   !student.completedCourses.includes(course.id) &&
                                   !(student.schedules[selectedSemester] || []).some(s => s.courseId === course.id)
                          })
                          
                          if (availableCourses.length === 0) return null
                          
                          return (
                            <div key={category}>
                              <h4 className="font-semibold text-yellow-300 mb-2 capitalize">
                                {category.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <div className="space-y-2">
                                {availableCourses.map(course => (
                                  <div 
                                    key={course.id} 
                                    className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                  >
                                    <div className="font-medium text-sm">{course.name}</div>
                                    <div className="flex gap-1 mt-1">
                                      {course.required && (
                                        <Badge className="bg-green-600/20 text-green-300 text-xs">Required</Badge>
                                      )}
                                      {course.staar && (
                                        <Badge className="bg-yellow-600/20 text-yellow-300 text-xs">STAAR</Badge>
                                      )}
                                      {course.stagePrep && (
                                        <Badge className="bg-purple-600/20 text-purple-300 text-xs">Stage</Badge>
                                      )}
                                      <Badge className="bg-blue-600/20 text-blue-300 text-xs">
                                        {course.credits}cr
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Validation Tab */}
          <TabsContent value="validation" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Schedule Validation & Optimization
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Real-time validation with intelligent recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getStudentList().map(student => {
                    const validation = validateSchedule(student.id, selectedSemester)
                    const hasIssues = validation.conflicts.length > 0 || validation.warnings.length > 0
                    
                    return (
                      <div key={student.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <p className="text-blue-200 text-sm">Grade {student.grade} • {student.pathway}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasIssues ? (
                              <Badge className="bg-red-600/20 text-red-300">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Issues Found
                              </Badge>
                            ) : (
                              <Badge className="bg-green-600/20 text-green-300">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Valid Schedule
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {validation.conflicts.length > 0 && (
                          <div className="mb-4 p-3 bg-red-600/20 rounded-lg border border-red-600/30">
                            <h4 className="font-medium text-red-300 mb-2">Schedule Conflicts:</h4>
                            {validation.conflicts.map((conflict, idx) => (
                              <div key={idx} className="text-sm text-red-200 mb-1">• {conflict}</div>
                            ))}
                          </div>
                        )}
                        
                        {validation.warnings.length > 0 && (
                          <div className="mb-4 p-3 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
                            <h4 className="font-medium text-yellow-300 mb-2">Warnings:</h4>
                            {validation.warnings.map((warning, idx) => (
                              <div key={idx} className="text-sm text-yellow-200 mb-1">• {warning}</div>
                            ))}
                          </div>
                        )}
                        
                        {validation.suggestions.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-600/20 rounded-lg border border-blue-600/30">
                            <h4 className="font-medium text-blue-300 mb-2">Suggestions:</h4>
                            {validation.suggestions.slice(0, 3).map((suggestion, idx) => (
                              <div key={idx} className="text-sm text-blue-200 mb-1">• {suggestion}</div>
                            ))}
                            {validation.suggestions.length > 3 && (
                              <div className="text-sm text-blue-200">... and {validation.suggestions.length - 3} more</div>
                            )}
                          </div>
                        )}
                        
                        {!hasIssues && validation.suggestions.length === 0 && (
                          <div className="p-3 bg-green-600/20 rounded-lg border border-green-600/30">
                            <div className="text-green-300 text-sm">
                              ✓ No scheduling conflicts detected
                              <br />
                              ✓ All prerequisites met
                              <br />
                              ✓ Appropriate credit load
                              <br />
                              ✓ Graduation requirements on track
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getStudentList().length}</div>
                  <p className="text-xs text-blue-200">Across all grades</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Average Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(getStudentList().reduce((sum, student) => {
                      const schedule = student.schedules[selectedSemester] || []
                      return sum + schedule.reduce((credits, course) => credits + (course.credits || 1), 0)
                    }, 0) / Math.max(getStudentList().length, 1)).toFixed(1)}
                  </div>
                  <p className="text-xs text-blue-200">Per semester</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Schedule Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-300">
                    {getStudentList().reduce((sum, student) => {
                      const validation = validateSchedule(student.id, selectedSemester)
                      return sum + validation.conflicts.length + validation.warnings.length
                    }, 0)}
                  </div>
                  <p className="text-xs text-red-200">Conflicts & warnings</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-300">
                    {Math.round((getStudentList().filter(student => {
                      const schedule = student.schedules[selectedSemester] || []
                      return schedule.length === 4
                    }).length / Math.max(getStudentList().length, 1)) * 100)}%
                  </div>
                  <p className="text-xs text-green-200">Full schedules</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle>Schedule Templates</CardTitle>
                <CardDescription className="text-blue-200">
                  Pre-built schedule templates for different pathways
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-purple-600/10 rounded-lg border border-purple-600/30">
                    <h3 className="font-bold text-purple-300 mb-2">Performance Track Template</h3>
                    <p className="text-sm text-purple-200 mb-4">Acting, voice, and stage performance focus</p>
                    <Button className="w-full bg-purple-600/20 border-purple-600/30 text-purple-300 hover:bg-purple-600/30">
                      Apply Template
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-blue-600/10 rounded-lg border border-blue-600/30">
                    <h3 className="font-bold text-blue-300 mb-2">Technical Theater Template</h3>
                    <p className="text-sm text-blue-200 mb-4">Behind-the-scenes production and design</p>
                    <Button className="w-full bg-blue-600/20 border-blue-600/30 text-blue-300 hover:bg-blue-600/30">
                      Apply Template
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-green-600/10 rounded-lg border border-green-600/30">
                    <h3 className="font-bold text-green-300 mb-2">Dramatic Writing Template</h3>
                    <p className="text-sm text-green-200 mb-4">Playwriting and theatrical storytelling</p>
                    <Button className="w-full bg-green-600/20 border-green-600/30 text-green-300 hover:bg-green-600/30">
                      Apply Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle>Schedule Reports</CardTitle>
                <CardDescription className="text-blue-200">
                  Generate comprehensive scheduling reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button className="h-20 bg-blue-600/20 border-blue-600/30 text-blue-300 hover:bg-blue-600/30">
                    <div className="text-center">
                      <Download className="h-6 w-6 mx-auto mb-2" />
                      <div>Student Schedule Report</div>
                    </div>
                  </Button>
                  
                  <Button className="h-20 bg-green-600/20 border-green-600/30 text-green-300 hover:bg-green-600/30">
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto mb-2" />
                      <div>Class Roster Report</div>
                    </div>
                  </Button>
                  
                  <Button className="h-20 bg-purple-600/20 border-purple-600/30 text-purple-300 hover:bg-purple-600/30">
                    <div className="text-center">
                      <Calendar className="h-6 w-6 mx-auto mb-2" />
                      <div>Master Schedule</div>
                    </div>
                  </Button>
                  
                  <Button className="h-20 bg-yellow-600/20 border-yellow-600/30 text-yellow-300 hover:bg-yellow-600/30">
                    <div className="text-center">
                      <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                      <div>Conflict Report</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}