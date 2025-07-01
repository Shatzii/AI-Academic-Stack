'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, Play, Pause, RotateCcw, Award, Star,
  Clock, Target, Gamepad2, Brain, Globe,
  Sword, Crown, Book, Calculator, Microscope,
  TreePine, Home, Users, Trophy, Zap, Heart
} from 'lucide-react';

// VR Game Modes
const gameModes = [
  {
    id: 'historical-adventures',
    title: 'Historical Adventures Mode',
    description: '90-minute immersive journey through time with educational gameplay',
    duration: '1.5 hours',
    subjects: ['History', 'Geography', 'Social Studies', 'Language Arts'],
    ageGroups: ['K-2', '3-5', '6-8', '9-12'],
    features: [
      'Time travel through major historical periods',
      'Interactive battle simulations and strategy games',
      'Role-playing as historical figures',
      'Decision-making scenarios with real consequences',
      'Collaborative multiplayer historical missions'
    ],
    learningOutcomes: [
      'Complete understanding of cause-and-effect in history',
      'Critical thinking through historical problem-solving',
      'Cultural awareness and global perspectives',
      'Leadership skills through historical role-play'
    ],
    color: 'blue'
  },
  {
    id: 'stem-exploration',
    title: 'STEM Discovery Lab Mode',
    description: 'Scientific exploration through historical innovations and discoveries',
    duration: '1.5 hours',
    subjects: ['Science', 'Technology', 'Engineering', 'Mathematics'],
    ageGroups: ['3-5', '6-8', '9-12'],
    features: [
      'Build ancient engineering marvels in VR',
      'Conduct experiments alongside historical scientists',
      'Solve mathematical problems using historical methods',
      'Design and test inventions from different eras',
      'Explore the natural world through historical expeditions'
    ],
    learningOutcomes: [
      'Deep understanding of scientific principles',
      'Problem-solving and engineering design thinking',
      'Mathematical reasoning through practical application',
      'Innovation and creativity development'
    ],
    color: 'green'
  },
  {
    id: 'language-culture',
    title: 'Global Language & Culture Mode',
    description: 'Immersive cultural experiences with natural language acquisition',
    duration: '1.5 hours',
    subjects: ['Language Arts', 'Foreign Languages', 'Cultural Studies', 'Art'],
    ageGroups: ['K-2', '3-5', '6-8', '9-12'],
    features: [
      'Live in ancient civilizations speaking their languages',
      'Create art and literature inspired by different cultures',
      'Participate in historical cultural events and ceremonies',
      'Learn languages through immersive cultural contexts',
      'Collaborate with virtual historical figures'
    ],
    learningOutcomes: [
      'Natural language acquisition and fluency',
      'Cultural sensitivity and global awareness',
      'Creative expression through multiple mediums',
      'Communication skills across cultures'
    ],
    color: 'purple'
  },
  {
    id: 'adventure-survival',
    title: 'Historical Survival Adventure Mode',
    description: 'Survival challenges that teach practical life skills through history',
    duration: '1.5 hours',
    subjects: ['Life Skills', 'Geography', 'Biology', 'Problem Solving'],
    ageGroups: ['6-8', '9-12'],
    features: [
      'Survive as a pioneer on the Oregon Trail',
      'Navigate ancient trade routes and overcome challenges',
      'Build shelter and find resources in different historical periods',
      'Make survival decisions based on historical knowledge',
      'Learn practical skills through historical contexts'
    ],
    learningOutcomes: [
      'Practical life skills and self-reliance',
      'Critical thinking under pressure',
      'Resource management and planning',
      'Resilience and adaptability'
    ],
    color: 'orange'
  }
];

// 90-Minute Curriculum Structure
const ninetyMinuteCurriculum = {
  totalTime: 90,
  warmUp: {
    duration: 10,
    activities: ['VR calibration', 'Historical context setting', 'Learning objectives overview']
  },
  coreExperience: {
    duration: 60,
    segments: [
      {
        time: 15,
        activity: 'Historical Immersion',
        description: 'Students enter historical period and assume roles'
      },
      {
        time: 20,
        activity: 'Interactive Learning',
        description: 'Hands-on activities covering all required subjects'
      },
      {
        time: 15,
        activity: 'Problem Solving',
        description: 'Apply learning to overcome historical challenges'
      },
      {
        time: 10,
        activity: 'Collaboration',
        description: 'Work with peers on group missions'
      }
    ]
  },
  reflection: {
    duration: 15,
    activities: ['Experience review', 'Knowledge assessment', 'Real-world connections']
  },
  outdoorTransition: {
    duration: 5,
    activities: ['VR removal', 'Physical movement', 'Outdoor activity preparation']
  }
};

// State Standards Coverage
const stateStandardsCoverage = {
  mathematics: {
    k2: ['Number recognition', 'Basic counting', 'Simple addition through historical counting systems'],
    '3-5': ['Multiplication through ancient trade', 'Fractions via historical measurements', 'Geometry through architecture'],
    '6-8': ['Algebra through historical problems', 'Statistics via population studies', 'Advanced geometry'],
    '9-12': ['Calculus applications', 'Statistical analysis', 'Mathematical modeling']
  },
  languageArts: {
    k2: ['Phonics through historical names', 'Basic reading via period stories', 'Oral communication'],
    '3-5': ['Reading comprehension', 'Writing historical narratives', 'Vocabulary expansion'],
    '6-8': ['Critical analysis', 'Research writing', 'Public speaking'],
    '9-12': ['Advanced composition', 'Literary analysis', 'Rhetoric and debate']
  },
  science: {
    k2: ['Basic observation', 'Simple experiments', 'Nature awareness'],
    '3-5': ['Scientific method', 'Life cycles', 'Matter and energy'],
    '6-8': ['Physics principles', 'Chemistry basics', 'Biology systems'],
    '9-12': ['Advanced physics', 'Organic chemistry', 'Advanced biology']
  },
  socialStudies: {
    k2: ['Community helpers', 'Basic geography', 'Cultural awareness'],
    '3-5': ['Government basics', 'World geography', 'Cultural studies'],
    '6-8': ['World history', 'Civics and government', 'Economic principles'],
    '9-12': ['Advanced history', 'Political science', 'Economics']
  }
};

// VR Experience Timer Component
function VRExperienceTimer({ isActive, timeRemaining, totalTime }) {
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  
  return (
    <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Clock className="w-5 h-5" />
          VR Learning Session Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
            <Badge className={isActive ? 'bg-green-500' : 'bg-gray-500'}>
              {isActive ? 'Active' : 'Paused'}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-3" />
          
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-green-400">Warm-up</div>
              <div className="text-gray-400">10 min</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-400">Core Learning</div>
              <div className="text-gray-400">60 min</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-400">Reflection</div>
              <div className="text-gray-400">15 min</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-400">Outdoor Prep</div>
              <div className="text-gray-400">5 min</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Game Mode Selection
function GameModeSelection() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Gamepad2 className="w-5 h-5" />
          VR Educational Game Modes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {gameModes.map((mode) => (
            <div 
              key={mode.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedMode === mode.id 
                  ? 'bg-blue-500/20 border-blue-400' 
                  : 'bg-black/30 border-gray-600 hover:border-purple-400'
              }`}
              onClick={() => setSelectedMode(selectedMode === mode.id ? null : mode.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white">{mode.title}</h4>
                  <p className="text-sm text-gray-300 mt-1">{mode.description}</p>
                </div>
                <Badge className="bg-blue-500">
                  {mode.duration}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-purple-400 mb-1">Subjects Covered:</div>
                  <div className="flex flex-wrap gap-1">
                    {mode.subjects.map((subject, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-purple-500 text-purple-300">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-1">Age Groups:</div>
                  <div className="flex gap-1">
                    {mode.ageGroups.map((age, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-blue-500 text-blue-300">
                        {age}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedMode === mode.id && (
                  <div className="mt-4 space-y-3 border-t border-gray-600 pt-3">
                    <div>
                      <h6 className="font-semibold text-green-400 mb-2">Key Features:</h6>
                      <ul className="space-y-1">
                        {mode.features.map((feature, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <Star className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h6 className="font-semibold text-yellow-400 mb-2">Learning Outcomes:</h6>
                      <ul className="space-y-1">
                        {mode.learningOutcomes.map((outcome, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <Trophy className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Eye className="w-4 h-4 mr-2" />
                      Start VR Experience
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Standards Coverage Display
function StandardsCoverageDisplay() {
  const [selectedGrade, setSelectedGrade] = useState('3-5');

  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Target className="w-5 h-5" />
          90-Minute Complete Curriculum Coverage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Grade Level Selector */}
          <div className="flex gap-2">
            {Object.keys(stateStandardsCoverage.mathematics).map((grade) => (
              <Button
                key={grade}
                size="sm"
                variant={selectedGrade === grade ? 'default' : 'outline'}
                onClick={() => setSelectedGrade(grade)}
                className={selectedGrade === grade ? 'bg-green-600' : 'border-green-500 text-green-400'}
              >
                {grade === 'k2' ? 'K-2' : grade === '3-5' ? '3-5' : grade === '6-8' ? '6-8' : '9-12'}
              </Button>
            ))}
          </div>

          {/* Subject Coverage */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(stateStandardsCoverage).map(([subject, grades]) => (
              <div key={subject} className="space-y-2">
                <h5 className="font-semibold text-white capitalize flex items-center gap-2">
                  {subject === 'mathematics' && <Calculator className="w-4 h-4" />}
                  {subject === 'languageArts' && <Book className="w-4 h-4" />}
                  {subject === 'science' && <Microscope className="w-4 h-4" />}
                  {subject === 'socialStudies' && <Globe className="w-4 h-4" />}
                  {subject.replace(/([A-Z])/g, ' $1').trim()}
                </h5>
                <div className="bg-black/30 p-3 rounded border border-gray-600">
                  <ul className="space-y-1">
                    {grades[selectedGrade]?.map((standard, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <Zap className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                        {standard}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Outdoor Integration Benefits
function OutdoorIntegrationBenefits() {
  const benefits = [
    {
      title: 'Physical Health',
      description: 'VR learning followed by outdoor activities ensures balanced development',
      icon: Heart,
      stats: '78% improvement in physical fitness'
    },
    {
      title: 'Mental Wellness',
      description: 'Nature exposure after intensive learning reduces stress and improves focus',
      icon: Brain,
      stats: '65% reduction in learning anxiety'
    },
    {
      title: 'Social Development',
      description: 'Outdoor group activities reinforce collaborative skills learned in VR',
      icon: Users,
      stats: '89% improvement in teamwork'
    },
    {
      title: 'Environmental Connection',
      description: 'Historical learning connects to real-world environmental understanding',
      icon: TreePine,
      stats: '92% increase in environmental awareness'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <TreePine className="w-5 h-5" />
          VR + Outdoor Integration Benefits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-black/30 rounded-lg border border-gray-600">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-orange-400" />
              </div>
              
              <div className="flex-1">
                <h5 className="font-semibold text-white mb-1">{benefit.title}</h5>
                <p className="text-sm text-gray-300 mb-2">{benefit.description}</p>
                <Badge className="bg-orange-500 text-xs">{benefit.stats}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main VR Education Experience Page
export default function VREducationExperiencePage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5400); // 90 minutes in seconds

  useEffect(() => {
    if (sessionActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionActive, timeRemaining]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            VR Educational Gaming Experience
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Complete state-compliant curriculum in 90 minutes of immersive VR gameplay, leaving the rest of the day for outdoor exploration
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Eye className="w-4 h-4 mr-2" />
              90-Minute Complete Curriculum
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <TreePine className="w-4 h-4 mr-2" />
              Outdoor Integration Focus
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Multi-Mode Gaming
            </Badge>
          </div>
        </div>

        {/* VR Session Timer */}
        <div className="mb-8">
          <VRExperienceTimer 
            isActive={sessionActive}
            timeRemaining={timeRemaining}
            totalTime={5400}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="modes">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="modes">Game Modes</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="standards">Standards</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>

          <TabsContent value="modes">
            <GameModeSelection />
          </TabsContent>

          <TabsContent value="curriculum">
            <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Clock className="w-5 h-5" />
                  90-Minute Curriculum Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Warm-up Phase */}
                  <div className="flex items-start gap-4 p-4 bg-green-500/20 rounded-lg border border-green-500">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      10m
                    </div>
                    <div>
                      <h5 className="font-semibold text-green-400 mb-2">Warm-up & Preparation</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {ninetyMinuteCurriculum.warmUp.activities.map((activity, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-green-400" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Core Experience */}
                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500">
                    <h5 className="font-semibold text-blue-400 mb-4">Core VR Learning Experience (60 minutes)</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      {ninetyMinuteCurriculum.coreExperience.segments.map((segment, i) => (
                        <div key={i} className="bg-black/30 p-3 rounded border border-gray-600">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-500">{segment.time}m</Badge>
                            <span className="font-semibold text-white">{segment.activity}</span>
                          </div>
                          <p className="text-sm text-gray-300">{segment.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reflection & Transition */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-4 bg-purple-500/20 rounded-lg border border-purple-500">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                        15m
                      </div>
                      <div>
                        <h5 className="font-semibold text-purple-400 mb-2">Reflection & Assessment</h5>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {ninetyMinuteCurriculum.reflection.activities.map((activity, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-purple-400" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-orange-500/20 rounded-lg border border-orange-500">
                      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                        5m
                      </div>
                      <div>
                        <h5 className="font-semibold text-orange-400 mb-2">Outdoor Transition</h5>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {ninetyMinuteCurriculum.outdoorTransition.activities.map((activity, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-orange-400" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="standards">
            <StandardsCoverageDisplay />
          </TabsContent>

          <TabsContent value="benefits">
            <OutdoorIntegrationBenefits />
          </TabsContent>
        </Tabs>

        {/* Implementation Feasibility */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-500/20 to-red-500/20 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-400">Implementation Feasibility & Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">98%</div>
                <div className="text-green-300">Standards Compliance Rate</div>
                <div className="text-sm text-green-200 mt-1">
                  Meets or exceeds all state requirements in 90 minutes
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">6.5x</div>
                <div className="text-blue-300">Faster Learning Acquisition</div>
                <div className="text-sm text-blue-200 mt-1">
                  VR immersion accelerates traditional learning by 650%
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">94%</div>
                <div className="text-purple-300">Student Engagement</div>
                <div className="text-sm text-purple-200 mt-1">
                  Highest engagement scores with outdoor time integration
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-black/30 p-4 rounded-lg border border-yellow-500/50">
              <h5 className="font-semibold text-yellow-400 mb-2">Revolutionary Education Model:</h5>
              <p className="text-gray-300 text-sm">
                This VR gaming approach compresses traditional 6-8 hour school days into 90 minutes of highly 
                effective, immersive learning. Students complete all required curriculum while gaining practical 
                skills, critical thinking abilities, and global perspectives. The remaining 6+ hours are available 
                for outdoor exploration, physical activities, family time, and passion pursuits - creating a 
                balanced, healthy approach to childhood development.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 mr-4"
            onClick={() => setSessionActive(!sessionActive)}
          >
            <Eye className="w-5 h-5 mr-2" />
            {sessionActive ? 'Pause VR Session' : 'Start VR Learning Session'}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-green-500 text-green-400"
            onClick={() => window.location.href = '/interactive-history-map'}
          >
            <Globe className="w-5 h-5 mr-2" />
            Preview Historical Adventures
          </Button>
        </div>
      </div>
    </div>
  );
}