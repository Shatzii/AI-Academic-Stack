'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, Clock, Trophy, Star, ChevronRight,
  Brain, Target, TrendingUp, Calendar, Users,
  Globe, Sword, Crown, MapPin, Zap, Award,
  PlayCircle, PauseCircle, RotateCcw, Search
} from 'lucide-react';

// Student Progress Data
const studentData = {
  name: 'Alex Johnson',
  grade: '8th Grade',
  school: 'Stage Prep School',
  avatar: 'AJ',
  currentLevel: 'Advanced Learner',
  weeklyGoal: 85,
  currentProgress: 78,
  achievements: [
    { name: 'History Explorer', level: 'Gold', progress: 100 },
    { name: 'Battle Strategist', level: 'Silver', progress: 85 },
    { name: 'Time Navigator', level: 'Bronze', progress: 60 }
  ],
  recentActivities: [
    { subject: 'History', activity: 'Explored Battle of Marathon', score: 95, time: '2 hours ago' },
    { subject: 'Science', activity: 'Completed Solar System Quiz', score: 88, time: '1 day ago' },
    { subject: 'Math', activity: 'Geometry Problem Set', score: 92, time: '2 days ago' }
  ]
};

// Quick Access History Events
const quickHistoryEvents = [
  {
    id: 1,
    title: 'Battle of Marathon',
    year: -490,
    category: 'battle',
    completed: true,
    score: 95
  },
  {
    id: 2,
    title: 'Roman Empire Formation',
    year: -27,
    category: 'political',
    completed: true,
    score: 88
  },
  {
    id: 3,
    title: 'Viking Exploration',
    year: 793,
    category: 'exploration',
    completed: false,
    score: null
  },
  {
    id: 4,
    title: 'Renaissance Beginning',
    year: 1400,
    category: 'cultural',
    completed: false,
    score: null
  }
];

// Student Dashboard Header
function DashboardHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-white/20 text-white font-bold text-xl">
              {studentData.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-white">{studentData.name}</h2>
            <p className="text-blue-200">{studentData.grade} • {studentData.school}</p>
            <Badge className="mt-2 bg-white/20 text-white">{studentData.currentLevel}</Badge>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{studentData.currentProgress}%</div>
          <div className="text-blue-200">Weekly Progress</div>
          <Progress value={studentData.currentProgress} className="w-32 mt-2" />
        </div>
      </div>
    </div>
  );
}

// Interactive History Map Preview
function HistoryMapPreview() {
  const [currentEvent, setCurrentEvent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEvent(prev => (prev + 1) % quickHistoryEvents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const event = quickHistoryEvents[currentEvent];

  return (
    <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Globe className="w-5 h-5" />
          Interactive History Map - Quick Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mini Map Visualization */}
          <div className="relative w-full h-32 bg-gradient-to-br from-blue-900 to-green-900 rounded-lg border border-cyan-500 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-gradient-to-r from-blue-500/30 to-green-500/30 animate-pulse"></div>
            </div>
            
            {/* Event markers */}
            {quickHistoryEvents.map((evt, i) => (
              <div
                key={evt.id}
                className={`absolute w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  i === currentEvent 
                    ? 'bg-yellow-500 border-yellow-300 scale-125' 
                    : evt.completed 
                    ? 'bg-green-500 border-green-300' 
                    : 'bg-gray-500 border-gray-300'
                }`}
                style={{ 
                  left: `${20 + i * 20}%`, 
                  top: `${30 + Math.sin(i) * 20}%`
                }}
              >
                {evt.category === 'battle' && <Sword className="w-2 h-2" />}
                {evt.category === 'political' && <Crown className="w-2 h-2" />}
                {evt.category === 'exploration' && <MapPin className="w-2 h-2" />}
                {evt.category === 'cultural' && <Star className="w-2 h-2" />}
              </div>
            ))}
          </div>

          {/* Current Event Display */}
          <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-white">{event.title}</h4>
                <p className="text-sm text-gray-300">
                  {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                </p>
              </div>
              <Badge className={`${
                event.category === 'battle' ? 'bg-red-500' :
                event.category === 'political' ? 'bg-blue-500' :
                event.category === 'exploration' ? 'bg-green-500' :
                'bg-purple-500'
              }`}>
                {event.category.toUpperCase()}
              </Badge>
            </div>
            
            {event.completed ? (
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-green-400 font-semibold">Completed - Score: {event.score}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400">Ready to Explore</span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              onClick={() => window.location.href = '/interactive-history-map'}
            >
              <Globe className="w-4 h-4 mr-2" />
              Open Full Map
            </Button>
            <Button 
              variant="outline" 
              className="border-cyan-500 text-cyan-400"
              onClick={() => setCurrentEvent((currentEvent + 1) % quickHistoryEvents.length)}
            >
              Next Event
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Achievement Display
function AchievementDisplay() {
  return (
    <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <Trophy className="w-5 h-5" />
          History Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studentData.achievements.map((achievement, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-black/30 rounded-lg border border-gray-600">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                achievement.level === 'Gold' ? 'bg-yellow-500' :
                achievement.level === 'Silver' ? 'bg-gray-400' :
                'bg-orange-600'
              }`}>
                <Award className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white">{achievement.name}</h4>
                  <Badge className={`${
                    achievement.level === 'Gold' ? 'bg-yellow-500' :
                    achievement.level === 'Silver' ? 'bg-gray-500' :
                    'bg-orange-600'
                  }`}>
                    {achievement.level}
                  </Badge>
                </div>
                <Progress value={achievement.progress} className="h-2" />
                <div className="text-xs text-gray-400 mt-1">{achievement.progress}% Complete</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activities
function RecentActivities() {
  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Clock className="w-5 h-5" />
          Recent Learning Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {studentData.recentActivities.map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-black/30 rounded-lg border border-gray-600">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.subject === 'History' ? 'bg-cyan-500' :
                activity.subject === 'Science' ? 'bg-purple-500' :
                'bg-blue-500'
              }`}>
                {activity.subject === 'History' && <Globe className="w-5 h-5 text-white" />}
                {activity.subject === 'Science' && <Zap className="w-5 h-5 text-white" />}
                {activity.subject === 'Math' && <Target className="w-5 h-5 text-white" />}
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-white">{activity.activity}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-400">{activity.subject}</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">Score: {activity.score}%</Badge>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Access Menu
function QuickAccessMenu() {
  const menuItems = [
    { name: 'History Map', icon: Globe, color: 'cyan', href: '/interactive-history-map' },
    { name: 'AI Tutor', icon: Brain, color: 'purple', href: '/ai-tutor' },
    { name: 'Battle Simulator', icon: Sword, color: 'red', href: '/battle-simulator' },
    { name: 'Timeline Explorer', icon: Clock, color: 'blue', href: '/timeline-explorer' },
    { name: 'Study Groups', icon: Users, color: 'green', href: '/study-groups' },
    { name: 'Progress Reports', icon: TrendingUp, color: 'yellow', href: '/progress-reports' }
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Star className="w-5 h-5" />
          Quick Access Learning Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {menuItems.map((item, i) => (
            <Button
              key={i}
              variant="outline"
              className={`h-20 flex-col gap-2 border-gray-500 text-gray-300 hover:bg-purple-500/20`}
              onClick={() => window.location.href = item.href}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Student Dashboard
export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured: Interactive History Map */}
          <div className="lg:col-span-2">
            <HistoryMapPreview />
          </div>

          {/* Achievement Display */}
          <div>
            <AchievementDisplay />
          </div>

          {/* Quick Access Menu */}
          <div className="lg:col-span-2">
            <QuickAccessMenu />
          </div>

          {/* Recent Activities */}
          <div>
            <RecentActivities />
          </div>

          {/* AI Learning Assistant */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-400">
                  <Brain className="w-5 h-5" />
                  AI Learning Assistant - Historical Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Today's Recommended Learning Path</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-black/30 rounded border border-indigo-500/50">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Explore Medieval Kingdoms (30 min)</span>
                        <Badge className="ml-auto bg-green-500">New</Badge>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-black/30 rounded border border-indigo-500/50">
                        <Sword className="w-4 h-4 text-red-400" />
                        <span className="text-sm">Battle of Hastings Analysis (45 min)</span>
                        <Badge className="ml-auto bg-blue-500">Recommended</Badge>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-black/30 rounded border border-indigo-500/50">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Viking Trade Routes Quiz (20 min)</span>
                        <Badge className="ml-auto bg-purple-500">Review</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">AI Insights & Tips</h4>
                    <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/50">
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <div className="text-sm text-gray-200">
                          <strong className="text-indigo-400">Learning Pattern Detected:</strong> You perform 23% better on historical analysis when starting with interactive map exploration. Consider beginning today's session with the History Map feature.
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      <Brain className="w-4 h-4 mr-2" />
                      Get Personalized Study Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dashboard Stats */}
        <Card className="mt-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-400">Student Dashboard - Learning Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">89%</div>
                <div className="text-green-300">History Mastery Score</div>
                <div className="text-sm text-green-200 mt-1">
                  Interactive visualization boosts comprehension
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">45</div>
                <div className="text-blue-300">Events Explored This Month</div>
                <div className="text-sm text-blue-200 mt-1">
                  AI-guided historical journey progress
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">12</div>
                <div className="text-purple-300">Battle Simulations Completed</div>
                <div className="text-sm text-purple-200 mt-1">
                  Strategic thinking development
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">98%</div>
                <div className="text-orange-300">Student Engagement Rate</div>
                <div className="text-sm text-orange-200 mt-1">
                  Revolutionary learning technology results
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}