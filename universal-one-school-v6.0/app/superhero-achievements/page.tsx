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
  Zap, 
  Shield, 
  Star, 
  Heart, 
  BookOpen, 
  Calendar, 
  GraduationCap,
  Target,
  Award,
  Rocket,
  Sun,
  ChevronRight,
  Plus,
  Save,
  Eye,
  Trophy,
  Users,
  Brain,
  Puzzle,
  Gamepad2
} from 'lucide-react'

type AchievementTier = 'rookie' | 'hero' | 'super' | 'legendary' | 'ultimate'
type Grade = 'K' | '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th'

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
  category: 'academic' | 'social' | 'creative' | 'physical' | 'leadership'
  superpower: string
}

interface LearningGoal {
  subject: string
  skill: string
  gradeLevel: Grade
  progress: number
  maxProgress: number
  neurodivergentSupport: string[]
}

interface SuperPower {
  name: string
  description: string
  unlocked: boolean
  level: number
  maxLevel: number
  color: string
}

export default function SuperheroAchievements() {
  const [selectedGrade, setSelectedGrade] = useState<Grade>('3rd')
  const [viewMode, setViewMode] = useState<'achievements' | 'powers' | 'progress' | 'schedule'>('achievements')

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Reading Lightning',
      description: 'Read 100 books this school year',
      tier: 'super',
      points: 500,
      icon: <Zap className="h-6 w-6" />,
      unlocked: true,
      progress: 67,
      maxProgress: 100,
      category: 'academic',
      superpower: 'Super Speed Reading'
    },
    {
      id: '2',
      title: 'Math Master',
      description: 'Complete 500 math problems correctly',
      tier: 'hero',
      points: 300,
      icon: <Brain className="h-6 w-6" />,
      unlocked: false,
      progress: 234,
      maxProgress: 500,
      category: 'academic',
      superpower: 'Number Vision'
    },
    {
      id: '3',
      title: 'Kindness Captain',
      description: 'Help classmates 50 times',
      tier: 'legendary',
      points: 750,
      icon: <Heart className="h-6 w-6" />,
      unlocked: false,
      progress: 32,
      maxProgress: 50,
      category: 'social',
      superpower: 'Empathy Shield'
    },
    {
      id: '4',
      title: 'Creative Comet',
      description: 'Complete 25 art and creative projects',
      tier: 'super',
      points: 600,
      icon: <Star className="h-6 w-6" />,
      unlocked: false,
      progress: 18,
      maxProgress: 25,
      category: 'creative',
      superpower: 'Imagination Burst'
    },
    {
      id: '5',
      title: 'Focus Force',
      description: 'Complete 30 days of perfect attention',
      tier: 'ultimate',
      points: 1000,
      icon: <Zap className="h-6 w-6" />,
      unlocked: false,
      progress: 12,
      maxProgress: 30,
      category: 'academic',
      superpower: 'Concentration Power'
    },
    {
      id: '6',
      title: 'Team Hero',
      description: 'Lead 10 group activities successfully',
      tier: 'hero',
      points: 400,
      icon: <Users className="h-6 w-6" />,
      unlocked: false,
      progress: 4,
      maxProgress: 10,
      category: 'leadership',
      superpower: 'Unity Powers'
    }
  ]

  const superPowers: SuperPower[] = [
    {
      name: 'Super Speed Reading',
      description: 'Read faster and understand better',
      unlocked: true,
      level: 3,
      maxLevel: 5,
      color: 'bg-blue-500'
    },
    {
      name: 'Number Vision',
      description: 'See math patterns everywhere',
      unlocked: false,
      level: 1,
      maxLevel: 5,
      color: 'bg-green-500'
    },
    {
      name: 'Empathy Shield',
      description: 'Help others feel better',
      unlocked: false,
      level: 2,
      maxLevel: 5,
      color: 'bg-pink-500'
    },
    {
      name: 'Imagination Burst',
      description: 'Create amazing things',
      unlocked: false,
      level: 1,
      maxLevel: 5,
      color: 'bg-purple-500'
    },
    {
      name: 'Concentration Power',
      description: 'Focus like a laser beam',
      unlocked: false,
      level: 0,
      maxLevel: 5,
      color: 'bg-yellow-500'
    }
  ]

  const learningGoals: LearningGoal[] = [
    {
      subject: 'Reading',
      skill: 'Fluent Reading',
      gradeLevel: '3rd',
      progress: 85,
      maxProgress: 100,
      neurodivergentSupport: ['Text-to-Speech', 'Larger Fonts', 'Reading Tracker']
    },
    {
      subject: 'Math',
      skill: 'Multiplication Tables',
      gradeLevel: '3rd',
      progress: 70,
      maxProgress: 100,
      neurodivergentSupport: ['Visual Aids', 'Manipulatives', 'Extra Time']
    },
    {
      subject: 'Science',
      skill: 'Scientific Method',
      gradeLevel: '3rd',
      progress: 60,
      maxProgress: 100,
      neurodivergentSupport: ['Hands-on Experiments', 'Visual Diagrams', 'Step-by-step Guides']
    },
    {
      subject: 'Social Studies',
      skill: 'Community Helpers',
      gradeLevel: '3rd',
      progress: 90,
      maxProgress: 100,
      neurodivergentSupport: ['Picture Cards', 'Role Playing', 'Interactive Maps']
    },
    {
      subject: 'Art',
      skill: 'Creative Expression',
      gradeLevel: '3rd',
      progress: 95,
      maxProgress: 100,
      neurodivergentSupport: ['Sensory Materials', 'Flexible Tools', 'Multiple Mediums']
    }
  ]

  const getTierColor = (tier: AchievementTier) => {
    switch (tier) {
      case 'rookie': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'hero': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'super': return 'bg-green-100 text-green-800 border-green-300'
      case 'legendary': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'ultimate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const unlockedPowers = superPowers.filter(p => p.unlocked).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-yellow-300 drop-shadow-lg">
            🦸‍♀️ SUPERHERO SCHOOL 🦸‍♂️
          </h1>
          <p className="text-white text-xl font-semibold drop-shadow">
            Unlock Your Super Powers • {totalPoints.toLocaleString()} Hero Points • {unlockedPowers} Powers Unlocked
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur rounded-xl p-1 flex">
            {[
              { id: 'achievements', label: 'Hero Badges', icon: Trophy },
              { id: 'powers', label: 'Super Powers', icon: Zap },
              { id: 'progress', label: 'Learning Quest', icon: Target },
              { id: 'schedule', label: 'Hero Schedule', icon: Calendar }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-bold ${
                  viewMode === id 
                    ? 'bg-yellow-400 text-purple-800 shadow-lg' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements View */}
        {viewMode === 'achievements' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {['academic', 'social', 'creative', 'physical', 'leadership'].map(category => {
                const categoryAchievements = achievements.filter(a => a.category === category)
                const unlockedCount = categoryAchievements.filter(a => a.unlocked).length
                return (
                  <Card key={category} className="bg-white/90 backdrop-blur border-2 border-yellow-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-purple-800 capitalize flex items-center gap-2 text-lg font-bold">
                        {category === 'academic' && <Brain className="h-5 w-5" />}
                        {category === 'social' && <Heart className="h-5 w-5" />}
                        {category === 'creative' && <Star className="h-5 w-5" />}
                        {category === 'physical' && <Rocket className="h-5 w-5" />}
                        {category === 'leadership' && <Shield className="h-5 w-5" />}
                        {category} Hero
                      </CardTitle>
                      <CardDescription className="text-purple-600 font-semibold">
                        {unlockedCount} of {categoryAchievements.length} badges
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={(unlockedCount / categoryAchievements.length) * 100} className="h-3" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {achievements.map(achievement => (
                <Card key={achievement.id} className={`bg-white/95 backdrop-blur border-2 ${achievement.unlocked ? 'border-yellow-400 shadow-xl shadow-yellow-400/50' : 'border-gray-300'}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-yellow-400' : 'bg-gray-200'} shadow-lg`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <CardTitle className="text-purple-800 text-xl font-bold">{achievement.title}</CardTitle>
                          <CardDescription className="text-purple-600 font-medium">{achievement.description}</CardDescription>
                          <Badge className="mt-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold">
                            {achievement.superpower}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={`${getTierColor(achievement.tier)} font-bold text-sm`}>
                        {achievement.tier.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-purple-600">Progress</span>
                        <span className="text-purple-800">{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-bold text-lg">{achievement.points} Hero Points</span>
                        {achievement.unlocked && (
                          <Badge className="bg-green-500 text-white font-bold text-sm">UNLOCKED!</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Super Powers View */}
        {viewMode === 'powers' && (
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur border-2 border-yellow-400">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2 text-2xl font-bold">
                  <Zap className="h-6 w-6" />
                  Your Super Powers Arsenal
                </CardTitle>
                <CardDescription className="text-purple-600 font-semibold text-lg">
                  Unlock and level up your amazing abilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {superPowers.map((power, index) => (
                    <Card key={index} className={`${power.unlocked ? 'bg-gradient-to-br from-yellow-200 to-yellow-300 border-2 border-yellow-500' : 'bg-gray-100 border-2 border-gray-300'} shadow-lg`}>
                      <CardHeader>
                        <CardTitle className="text-purple-800 font-bold flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${power.color}`}></div>
                          {power.name}
                        </CardTitle>
                        <CardDescription className="text-purple-600 font-medium">
                          {power.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-semibold">
                            <span className="text-purple-600">Power Level</span>
                            <span className="text-purple-800">{power.level} / {power.maxLevel}</span>
                          </div>
                          <Progress value={(power.level / power.maxLevel) * 100} className="h-3" />
                          {power.unlocked ? (
                            <Badge className="bg-green-500 text-white font-bold w-full justify-center">ACTIVE</Badge>
                          ) : (
                            <Badge className="bg-gray-400 text-white font-bold w-full justify-center">LOCKED</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Learning Progress View */}
        {viewMode === 'progress' && (
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur border-2 border-green-400">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2 text-2xl font-bold">
                  <Target className="h-6 w-6" />
                  Learning Quest Progress
                </CardTitle>
                <CardDescription className="text-purple-600 font-semibold text-lg">
                  Track your academic adventures with neurodivergent-friendly support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningGoals.map((goal, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-purple-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-purple-800 font-bold text-xl">{goal.subject}: {goal.skill}</h4>
                          <p className="text-purple-600 font-medium">Grade {goal.gradeLevel} Level</p>
                        </div>
                        <Badge className="bg-purple-500 text-white font-bold text-lg px-4 py-2">
                          {goal.progress}%
                        </Badge>
                      </div>
                      
                      <Progress value={goal.progress} className="h-4 mb-4" />
                      
                      <div>
                        <h5 className="text-purple-700 font-semibold mb-2">Neurodivergent Support Tools:</h5>
                        <div className="flex flex-wrap gap-2">
                          {goal.neurodivergentSupport.map((support, i) => (
                            <Badge key={i} className="bg-green-500 text-white font-medium">{support}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schedule View */}
        {viewMode === 'schedule' && (
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur border-2 border-blue-400">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2 text-2xl font-bold">
                  <Calendar className="h-6 w-6" />
                  Hero Training Schedule
                </CardTitle>
                <CardDescription className="text-purple-600 font-semibold text-lg">
                  Plan your superhero learning adventures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-purple-800 font-bold text-lg">Choose Your Grade Level</Label>
                    <Select value={selectedGrade} onValueChange={(value) => setSelectedGrade(value as Grade)}>
                      <SelectTrigger className="bg-white border-2 border-purple-300 text-purple-800 font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="K">Kindergarten (Super Rookies)</SelectItem>
                        <SelectItem value="1st">1st Grade (Hero Trainees)</SelectItem>
                        <SelectItem value="2nd">2nd Grade (Power Builders)</SelectItem>
                        <SelectItem value="3rd">3rd Grade (Skill Masters)</SelectItem>
                        <SelectItem value="4th">4th Grade (Advanced Heroes)</SelectItem>
                        <SelectItem value="5th">5th Grade (Super Veterans)</SelectItem>
                        <SelectItem value="6th">6th Grade (Ultimate Champions)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-200 to-orange-200 p-4 rounded-xl border-2 border-yellow-400">
                    <h3 className="text-purple-800 font-bold text-xl mb-3">Today's Hero Training</h3>
                    <div className="space-y-3">
                      {[
                        { time: '8:00 AM', activity: 'Reading Power-Up', icon: <BookOpen className="h-5 w-5" /> },
                        { time: '9:00 AM', activity: 'Math Mission', icon: <Brain className="h-5 w-5" /> },
                        { time: '10:30 AM', activity: 'Science Experiments', icon: <Rocket className="h-5 w-5" /> },
                        { time: '12:00 PM', activity: 'Hero Lunch Break', icon: <Heart className="h-5 w-5" /> },
                        { time: '1:00 PM', activity: 'Creative Arts', icon: <Star className="h-5 w-5" /> },
                        { time: '2:30 PM', activity: 'Team Building', icon: <Users className="h-5 w-5" /> }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow">
                          <div className="text-purple-600">{item.icon}</div>
                          <span className="text-purple-800 font-semibold">{item.time}</span>
                          <span className="text-purple-700 font-medium">{item.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}