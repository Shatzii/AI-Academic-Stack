'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Theater, 
  Mic, 
  Camera, 
  Music, 
  Palette, 
  Calendar, 
  GraduationCap,
  Target,
  BookOpen,
  Award,
  Search,
  Drama,
  ChevronRight,
  Plus,
  Save,
  Eye,
  Star,
  Trophy,
  Users
} from 'lucide-react'

type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'master'
type Grade = '9th' | '10th' | '11th' | '12th'
type Semester = 'Fall' | 'Spring'

interface Achievement {
  id: string
  title: string
  description: string
  tier: AchievementTier
  points: number
  icon: React.ReactNode
  unlocked: boolean
  progress: number
  maxProgress: number
  category: 'performance' | 'technical' | 'academic' | 'leadership' | 'creative'
}

interface ScheduleSlot {
  period: number
  subject: string
  teacher: string
  room: string
  credits: number
  isElective: boolean
  isAdvanced: boolean
  trackSpecific: boolean
}

interface GraduationRequirement {
  subject: string
  required: number
  earned: number
  inProgress: number
  trackFocus: boolean
}

export default function StagePrepAchievements() {
  const [selectedGrade, setSelectedGrade] = useState<Grade>('9th')
  const [selectedSemester, setSelectedSemester] = useState<Semester>('Fall')
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([])
  const [viewMode, setViewMode] = useState<'achievements' | 'schedule' | 'graduation' | 'career'>('achievements')

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Leading Role Mastery',
      description: 'Successfully perform a leading role in a major production',
      tier: 'gold',
      points: 500,
      icon: <Search className="h-6 w-6" />,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      category: 'performance'
    },
    {
      id: '2',
      title: 'Stage Manager Pro',
      description: 'Complete stage management for 3 productions',
      tier: 'silver',
      points: 300,
      icon: <Users className="h-6 w-6" />,
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      category: 'leadership'
    },
    {
      id: '3',
      title: 'Tech Theater Expert',
      description: 'Master lighting, sound, and set design fundamentals',
      tier: 'platinum',
      points: 750,
      icon: <Camera className="h-6 w-6" />,
      unlocked: false,
      progress: 2,
      maxProgress: 3,
      category: 'technical'
    },
    {
      id: '4',
      title: 'Original Script Writer',
      description: 'Write and produce an original theatrical work',
      tier: 'master',
      points: 1000,
      icon: <BookOpen className="h-6 w-6" />,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: 'creative'
    },
    {
      id: '5',
      title: 'Voice & Movement Master',
      description: 'Complete advanced voice and movement training',
      tier: 'gold',
      points: 600,
      icon: <Mic className="h-6 w-6" />,
      unlocked: false,
      progress: 3,
      maxProgress: 4,
      category: 'performance'
    },
    {
      id: '6',
      title: 'Costume & Makeup Artist',
      description: 'Design costumes and makeup for 2 productions',
      tier: 'silver',
      points: 400,
      icon: <Palette className="h-6 w-6" />,
      unlocked: false,
      progress: 1,
      maxProgress: 2,
      category: 'creative'
    }
  ]

  const graduationRequirements: GraduationRequirement[] = [
    { subject: 'English/Language Arts', required: 4, earned: 2, inProgress: 1, trackFocus: false },
    { subject: 'Mathematics', required: 4, earned: 2, inProgress: 1, trackFocus: false },
    { subject: 'Science', required: 4, earned: 1, inProgress: 1, trackFocus: false },
    { subject: 'Social Studies', required: 3, earned: 1, inProgress: 1, trackFocus: false },
    { subject: 'Theater Performance', required: 4, earned: 2, inProgress: 1, trackFocus: true },
    { subject: 'Technical Theater', required: 3, earned: 1, inProgress: 1, trackFocus: true },
    { subject: 'Script Writing & Analysis', required: 2, earned: 0, inProgress: 1, trackFocus: true },
    { subject: 'Fine Arts (Additional)', required: 1, earned: 1, inProgress: 0, trackFocus: false },
    { subject: 'Health/PE', required: 2, earned: 1, inProgress: 0, trackFocus: false },
    { subject: 'World Languages', required: 2, earned: 0, inProgress: 1, trackFocus: false },
    { subject: 'Career/Technology', required: 1, earned: 0, inProgress: 0, trackFocus: false }
  ]

  const stagePreparatoryElectives = [
    'Advanced Theater Performance',
    'Musical Theater Workshop',
    'Shakespeare Studies',
    'Contemporary Drama',
    'Stage Management',
    'Lighting Design & Technology',
    'Sound Design & Engineering',
    'Set Design & Construction',
    'Costume Design',
    'Makeup & Special Effects',
    'Theater History & Criticism',
    'Playwriting & Dramaturgy',
    'Voice & Diction',
    'Movement & Stage Combat',
    'Audition Technique',
    'Theater Business & Management',
    'Film & Television Acting',
    'Improvisation & Comedy',
    'Dance for Theater',
    'Digital Media for Theater'
  ]

  const careerPaths = [
    {
      name: 'Professional Stage Actor',
      description: 'Perform in regional, national, and Broadway productions',
      requirements: ['Leading Role Experience', 'Voice Training', 'Movement Training', 'Classical Training'],
      colleges: ['Juilliard', 'Yale School of Drama', 'Carnegie Mellon', 'Northwestern', 'RADA'],
      progress: 78,
      skills: ['Stage Presence', 'Voice Control', 'Character Development', 'Memorization']
    },
    {
      name: 'Theater Director',
      description: 'Direct and conceptualize complete theatrical productions',
      requirements: ['Leadership Experience', 'Script Analysis', 'Production Management', 'Vision Development'],
      colleges: ['NYU Tisch', 'UCLA', 'Columbia', 'Yale', 'Northwestern'],
      progress: 65,
      skills: ['Leadership', 'Creative Vision', 'Communication', 'Project Management']
    },
    {
      name: 'Technical Director',
      description: 'Oversee all technical aspects of theater productions',
      requirements: ['Technical Theater Mastery', 'Engineering Skills', 'Safety Certification', 'Team Management'],
      colleges: ['Carnegie Mellon', 'Yale', 'UNCSA', 'CalArts', 'Virginia Tech'],
      progress: 55,
      skills: ['Technical Design', 'Problem Solving', 'Safety Management', 'Budget Management']
    },
    {
      name: 'Playwright/Dramaturg',
      description: 'Write original works and provide script development support',
      requirements: ['Original Writing Portfolio', 'Literature Knowledge', 'Script Analysis', 'Research Skills'],
      colleges: ['Yale', 'Brown', 'NYU', 'Columbia', 'Northwestern'],
      progress: 45,
      skills: ['Creative Writing', 'Research', 'Literary Analysis', 'Collaboration']
    }
  ]

  const getTierColor = (tier: AchievementTier) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'master': return 'bg-red-100 text-red-800 border-red-300'
    }
  }

  const addToSchedule = (subject: string, isElective: boolean = false, trackSpecific: boolean = false) => {
    const newSlot: ScheduleSlot = {
      period: schedule.length + 1,
      subject,
      teacher: 'TBA',
      room: 'Theater Complex',
      credits: 1,
      isElective,
      isAdvanced: false,
      trackSpecific
    }
    setSchedule([...schedule, newSlot])
  }

  const totalCredits = schedule.reduce((sum, slot) => sum + slot.credits, 0)
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const trackCredits = graduationRequirements.filter(req => req.trackFocus).reduce((sum, req) => sum + req.required, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎭 Stage Preparatory Track
          </h1>
          <p className="text-gray-300 text-lg">
            Professional Theater Training Program • {totalPoints.toLocaleString()} Achievement Points • {trackCredits} Track Credits Required
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {[
              { id: 'achievements', label: 'Theater Achievements', icon: Trophy },
              { id: 'schedule', label: 'Block Schedule', icon: Calendar },
              { id: 'graduation', label: 'Track Requirements', icon: GraduationCap },
              { id: 'career', label: 'Theater Careers', icon: Target }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                  viewMode === id 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements View */}
        {viewMode === 'achievements' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {['performance', 'technical', 'academic', 'leadership', 'creative'].map(category => {
                const categoryAchievements = achievements.filter(a => a.category === category)
                const unlockedCount = categoryAchievements.filter(a => a.unlocked).length
                return (
                  <Card key={category} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white capitalize flex items-center gap-2 text-sm">
                        {category === 'performance' && <Star className="h-4 w-4" />}
                        {category === 'technical' && <Camera className="h-4 w-4" />}
                        {category === 'academic' && <BookOpen className="h-4 w-4" />}
                        {category === 'leadership' && <Users className="h-4 w-4" />}
                        {category === 'creative' && <Palette className="h-4 w-4" />}
                        {category}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-xs">
                        {unlockedCount} of {categoryAchievements.length}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={(unlockedCount / categoryAchievements.length) * 100} className="h-2" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {achievements.map(achievement => (
                <Card key={achievement.id} className={`bg-gray-800 border-gray-700 ${achievement.unlocked ? 'ring-2 ring-purple-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-purple-600' : 'bg-gray-700'}`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white">{achievement.title}</CardTitle>
                          <CardDescription className="text-gray-400">{achievement.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getTierColor(achievement.tier)}>
                        {achievement.tier.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                      <div className="flex justify-between items-center">
                        <span className="text-purple-400 font-semibold">{achievement.points} points</span>
                        {achievement.unlocked && (
                          <Badge className="bg-green-600 text-white">EARNED</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Builder View */}
        {viewMode === 'schedule' && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Stage Prep 4×4 Block Schedule Builder
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Design your semester schedule with 4 year-long courses per semester (8 total annually)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-white">Grade Level</Label>
                    <Select value={selectedGrade} onValueChange={(value) => setSelectedGrade(value as Grade)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9th">9th Grade (Foundation Year)</SelectItem>
                        <SelectItem value="10th">10th Grade (Development Year)</SelectItem>
                        <SelectItem value="11th">11th Grade (Specialization Year)</SelectItem>
                        <SelectItem value="12th">12th Grade (Mastery Year)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Semester</Label>
                    <Select value={selectedSemester} onValueChange={(value) => setSelectedSemester(value as Semester)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fall">Fall Semester</SelectItem>
                        <SelectItem value="Spring">Spring Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Current Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {selectedGrade} Grade - {selectedSemester} Schedule ({totalCredits}/4 Blocks)
                    </h3>
                    <div className="space-y-2">
                      {schedule.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No courses scheduled yet</p>
                      ) : (
                        schedule.map((slot, index) => (
                          <div key={index} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                            <div>
                              <div className="text-white font-medium">Block {slot.period}: {slot.subject}</div>
                              <div className="text-gray-400 text-sm">
                                {slot.credits} credit • {slot.room}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {slot.trackSpecific && <Badge className="bg-purple-600">Track Focus</Badge>}
                              {slot.isElective && <Badge className="bg-blue-600">Elective</Badge>}
                              {slot.isAdvanced && <Badge className="bg-orange-600">Advanced</Badge>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Available Theater Courses */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Stage Preparatory Courses</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {stagePreparatoryElectives.map((course, index) => (
                        <div key={index} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                          <span className="text-white text-sm">{course}</span>
                          <Button 
                            size="sm" 
                            onClick={() => addToSchedule(course, true, true)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Graduation Requirements View */}
        {viewMode === 'graduation' && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Stage Preparatory Track Requirements
                </CardTitle>
                <CardDescription className="text-gray-400">
                  26-credit Foundation Program with Arts & Humanities Endorsement focused on Theater Arts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {graduationRequirements.map((req, index) => {
                    const totalEarned = req.earned + req.inProgress
                    const progressPercent = (totalEarned / req.required) * 100
                    const isComplete = req.earned >= req.required
                    
                    return (
                      <div key={index} className={`p-4 rounded-lg ${req.trackFocus ? 'bg-purple-900 border border-purple-600' : 'bg-gray-700'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-medium flex items-center gap-2">
                            {req.subject}
                            {req.trackFocus && <Badge className="bg-purple-600 text-xs">Track Focus</Badge>}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">{req.earned + req.inProgress} / {req.required}</span>
                            {isComplete && <Badge className="bg-green-600">Complete</Badge>}
                          </div>
                        </div>
                        <Progress value={Math.min(progressPercent, 100)} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Earned: {req.earned} • In Progress: {req.inProgress}</span>
                          <span>Remaining: {Math.max(0, req.required - totalEarned)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Career Paths View */}
        {viewMode === 'career' && (
          <div className="space-y-6">
            <div className="grid gap-6">
              {careerPaths.map((career, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{career.name}</span>
                      <Badge className="bg-purple-600">{career.progress}% Ready</Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">{career.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Key Requirements</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.requirements.map((req, i) => (
                            <Badge key={i} className="bg-gray-600 text-white">{req}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Essential Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, i) => (
                            <Badge key={i} className="bg-indigo-600 text-white">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Target Programs</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.colleges.map((college, i) => (
                            <Badge key={i} className="bg-blue-600 text-white">{college}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Career Readiness</span>
                          <span className="text-white">{career.progress}%</span>
                        </div>
                        <Progress value={career.progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}