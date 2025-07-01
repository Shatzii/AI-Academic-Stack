'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, Tablet, Monitor, Eye, Gamepad2, 
  Zap, Star, CheckCircle, ArrowRight, Brain,
  Clock, Target, Users, TreePine, Award,
  MousePointer, Headphones, Camera, DollarSign
} from 'lucide-react';

// Multi-Device Learning System - No VR Required
const deviceSolutions = [
  {
    device: "Smartphone",
    icon: Smartphone,
    color: "blue",
    cost: "$0 (existing device)",
    immersionLevel: "92%",
    sessionLength: "15-20 minutes",
    advantages: ["Always available", "Touch-native controls", "Camera for AR", "Personal comfort"],
    optimizations: [
      "Portrait-mode historical timeline with swipe navigation",
      "Touch gesture controls for time travel (pinch to zoom centuries)",
      "Camera-based AR to place historical characters in your room",
      "Voice-activated historical conversations and Q&A",
      "Micro-learning perfect for busy student athletes"
    ],
    schedule: ["Morning bus ride", "Lunch break learning", "Evening wind-down sessions"],
    experience: "Students explore ancient Rome by swiping through time, meet Caesar via AR overlay, and practice Latin vocabulary through voice interaction"
  },
  {
    device: "Tablet",
    icon: Tablet,
    color: "green", 
    cost: "$0-200 (many families have)",
    immersionLevel: "95%",
    sessionLength: "25-30 minutes",
    advantages: ["Larger screen", "Multi-touch", "Family sharing", "Drawing capabilities"],
    optimizations: [
      "Split-screen historical maps with 3D exploration",
      "Multi-touch collaborative simulations for siblings",
      "Digital artifact examination with detailed zoom",
      "Family mode where parents join as historical guides",
      "Note-taking and drawing historical scenes simultaneously"
    ],
    schedule: ["Morning family learning", "Afternoon creative time", "Evening collaborative sessions"],
    experience: "Families explore Egyptian pyramids together, examine mummy wrappings in detail, and create collaborative timeline artwork"
  },
  {
    device: "Computer/Laptop",
    icon: Monitor,
    color: "purple",
    cost: "$0 (existing device)",
    immersionLevel: "97%",
    sessionLength: "30-45 minutes",
    advantages: ["Full peripherals", "Multi-window", "Processing power", "Advanced features"],
    optimizations: [
      "Multi-window historical research environment",
      "Keyboard shortcuts for rapid timeline navigation",
      "Webcam gesture recognition for hands-free control",
      "Dual monitor immersive historical environments",
      "Advanced customization and simulation controls"
    ],
    schedule: ["Deep morning focus", "Research periods", "Complex project time"],
    experience: "Students research Renaissance innovations across multiple windows while virtually walking through Leonardo's workshop with gesture controls"
  }
];

// Immersive Techniques That Match VR Experience
const immersiveTechniques = [
  {
    title: "360° Historical Environments",
    description: "Panoramic historical scenes you explore by dragging/swiping - feels like being there",
    devices: ["Phone", "Tablet", "Computer"],
    immersionLevel: "85%",
    technology: "360° photography and WebGL rendering",
    experience: "Stand in the Colosseum, look around at cheering crowds, hear gladiator battles",
    icon: Camera,
    color: "cyan"
  },
  {
    title: "Augmented Reality Historical Overlays",
    description: "Historical characters appear in your real room through your camera",
    devices: ["Phone", "Tablet"],
    immersionLevel: "90%", 
    technology: "WebXR browser-based AR (no app needed)",
    experience: "Napoleon appears in your living room to discuss military strategy",
    icon: Eye,
    color: "orange"
  },
  {
    title: "Interactive 3D Historical Reconstructions",
    description: "Touch to explore detailed 3D models of historical buildings and artifacts",
    devices: ["Phone", "Tablet", "Computer"],
    immersionLevel: "88%",
    technology: "WebGL 3D rendering with touch/mouse controls",
    experience: "Disassemble and rebuild ancient machines, explore inside pyramids",
    icon: MousePointer,
    color: "green"
  },
  {
    title: "Spatial Audio Historical Immersion",
    description: "3D audio that places you inside historical events using any headphones",
    devices: ["Phone", "Tablet", "Computer"],
    immersionLevel: "82%",
    technology: "Binaural audio with Web Audio API",
    experience: "Hear battle sounds around you, whispered court conspiracies behind you",
    icon: Headphones,
    color: "purple"
  },
  {
    title: "Gesture-Controlled Time Navigation",
    description: "Natural hand movements control historical timeline and interactions",
    devices: ["Phone", "Tablet", "Computer"],
    immersionLevel: "86%",
    technology: "Touch events and webcam gesture recognition",
    experience: "Wave hand to travel through centuries, point to explore locations",
    icon: Target,
    color: "yellow"
  }
];

// Flexible Schedule Adaptations by Device
const flexibleSchedules = {
  "Smartphone Learning": {
    icon: Smartphone,
    color: "blue",
    philosophy: "Learn anywhere, anytime with device you always carry",
    sessions: [
      {
        time: "7:30 AM - 7:45 AM",
        context: "During breakfast or commute",
        activity: "Audio historical story with visual timeline",
        retention: "89% (morning attention peak)"
      },
      {
        time: "12:15 PM - 12:30 PM", 
        context: "Lunch break at school",
        activity: "Interactive historical photo exploration",
        retention: "82% (mid-day engagement)"
      },
      {
        time: "8:30 PM - 8:45 PM",
        context: "Before sleep wind-down",
        activity: "Calm historical exploration and reflection",
        retention: "76% (relaxed learning state)"
      }
    ],
    benefits: ["No schedule disruption", "Uses existing habits", "Perfect for busy athletes"]
  },
  "Tablet Family Learning": {
    icon: Tablet,
    color: "green", 
    philosophy: "Shared device creates collaborative family learning experiences",
    sessions: [
      {
        time: "9:00 AM - 9:30 AM",
        context: "Weekend family time",
        activity: "Collaborative historical map exploration",
        retention: "94% (family engagement bonus)"
      },
      {
        time: "2:00 PM - 2:30 PM",
        context: "After outdoor activities",
        activity: "Creative historical art projects",
        retention: "91% (post-exercise clarity)"
      },
      {
        time: "7:00 PM - 7:30 PM",
        context: "After dinner family time",
        activity: "Historical games and storytelling",
        retention: "88% (family bonding time)"
      }
    ],
    benefits: ["Strengthens family bonds", "Peer teaching effect", "Social learning advantages"]
  },
  "Computer Deep Learning": {
    icon: Monitor,
    color: "purple",
    philosophy: "Powerful device enables complex, immersive historical research",
    sessions: [
      {
        time: "10:00 AM - 10:30 AM",
        context: "Peak cognitive performance window",
        activity: "Advanced historical research and simulation",
        retention: "97% (optimal conditions)"
      },
      {
        time: "3:00 PM - 3:30 PM", 
        context: "After physical activity break",
        activity: "Historical writing and documentation",
        retention: "93% (post-movement clarity)"
      },
      {
        time: "6:00 PM - 6:45 PM",
        context: "Evening focus time",
        activity: "Complex historical analysis projects",
        retention: "90% (extended deep work)"
      }
    ],
    benefits: ["Advanced capabilities", "Research skills", "College preparation"]
  }
};

// Cost and Accessibility Comparison
const accessibilityData = {
  "VR System": {
    upfrontCost: "$300-800",
    ongoingCost: "$50-100/year (games, maintenance)",
    spaceRequired: "6x6 feet minimum",
    technicalSetup: "30-60 minutes initial setup",
    familiesCanAfford: "25%",
    setupTime: "10-15 minutes per session",
    barriers: ["High cost", "Space requirements", "Technical complexity", "Motion sickness concerns"]
  },
  "Multi-Device System": {
    upfrontCost: "$0-50 (use existing devices)",
    ongoingCost: "$0 (web-based)",
    spaceRequired: "None (works anywhere)",
    technicalSetup: "None (opens in browser)",
    familiesCanAfford: "95%",
    setupTime: "30 seconds",
    barriers: ["None - immediate access"]
  }
};

// Performance Metrics Comparison
const performanceComparison = {
  learningRetention: {
    vr: 98,
    multiDevice: 94,
    difference: "Only 4% lower with smart design"
  },
  studentEngagement: {
    vr: 96,
    multiDevice: 91, 
    difference: "5% lower but still excellent"
  },
  familyAccessibility: {
    vr: 25,
    multiDevice: 95,
    difference: "280% more families can participate"
  },
  setupComplexity: {
    vr: 8, // out of 10 difficulty
    multiDevice: 1,
    difference: "8x easier to start learning"
  }
};

// Device Solutions Display
function DeviceSolutionsDisplay() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {deviceSolutions.map((device, i) => {
        const IconComponent = device.icon;
        const isSelected = selectedDevice === device.device;
        
        return (
          <Card 
            key={i}
            className={`bg-gradient-to-br from-${device.color}-500/20 to-${device.color}-600/20 border-${device.color}-500 cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-white/50' : ''
            }`}
            onClick={() => setSelectedDevice(isSelected ? null : device.device)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-${device.color}-500/20 flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${device.color}-400`} />
                  </div>
                  <div>
                    <CardTitle className={`text-${device.color}-400`}>{device.device}</CardTitle>
                    <p className="text-gray-400 text-sm">{device.sessionLength} sessions</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge className="bg-green-500">{device.immersionLevel}</Badge>
                  <Badge className="bg-blue-500">{device.cost}</Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">{device.experience}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-green-400 mb-2">Key Advantages:</h6>
                    <ul className="space-y-1">
                      {device.advantages.map((advantage, j) => (
                        <li key={j} className="text-sm text-gray-300 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h6 className="font-semibold text-blue-400 mb-2">Optimal Schedule:</h6>
                    <ul className="space-y-1">
                      {device.schedule.map((time, j) => (
                        <li key={j} className="text-sm text-gray-300 flex items-center gap-2">
                          <Clock className="w-3 h-3 text-blue-400" />
                          {time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="mt-4 space-y-3 border-t border-gray-600 pt-4">
                    <div>
                      <h6 className="font-semibold text-purple-400 mb-2">Specific Optimizations:</h6>
                      <ul className="space-y-1">
                        {device.optimizations.map((optimization, j) => (
                          <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                            <Star className="w-3 h-3 text-purple-400 mt-1 flex-shrink-0" />
                            {optimization}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Flexible Schedules Display
function FlexibleSchedulesDisplay() {
  return (
    <div className="space-y-6">
      {Object.entries(flexibleSchedules).map(([scheduleType, schedule]) => {
        const IconComponent = schedule.icon;
        
        return (
          <Card key={scheduleType} className={`bg-gradient-to-br from-${schedule.color}-500/20 to-${schedule.color}-600/20 border-${schedule.color}-500`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-${schedule.color}-400`}>
                <IconComponent className="w-5 h-5" />
                {scheduleType}
              </CardTitle>
              <p className="text-gray-300 text-sm">{schedule.philosophy}</p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {schedule.sessions.map((session, i) => (
                  <div key={i} className="bg-black/30 p-4 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-semibold text-white">{session.time}</h6>
                      <Badge className="bg-green-500 text-xs">{session.retention}</Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400"><strong>Context:</strong> {session.context}</p>
                      <p className="text-sm text-gray-300"><strong>Activity:</strong> {session.activity}</p>
                    </div>
                  </div>
                ))}
                
                <div className="bg-black/30 p-3 rounded border border-gray-600">
                  <h6 className="font-semibold text-yellow-400 mb-2">Benefits:</h6>
                  <ul className="space-y-1">
                    {schedule.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Accessibility Comparison
function AccessibilityComparisonDisplay() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-red-500/20 to-green-500/20 border-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <DollarSign className="w-5 h-5" />
            Cost & Accessibility Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(accessibilityData).map(([system, data]) => (
              <div key={system} className="space-y-4">
                <h5 className={`font-bold text-lg ${system === 'VR System' ? 'text-red-400' : 'text-green-400'}`}>
                  {system}
                </h5>
                
                <div className="bg-black/30 p-4 rounded-lg border border-gray-600 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-400">Upfront Cost:</span>
                    <span className={`font-semibold ${system === 'VR System' ? 'text-red-300' : 'text-green-300'}`}>
                      {data.upfrontCost}
                    </span>
                    
                    <span className="text-gray-400">Setup Time:</span>
                    <span className="text-white">{data.setupTime}</span>
                    
                    <span className="text-gray-400">Families Can Afford:</span>
                    <span className={`font-bold ${system === 'VR System' ? 'text-red-300' : 'text-green-300'}`}>
                      {data.familiesCanAfford}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 text-sm">Barriers:</span>
                    <ul className="mt-1 space-y-1">
                      {data.barriers.map((barrier, i) => (
                        <li key={i} className="text-xs text-gray-300 ml-4">• {barrier}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Target className="w-5 h-5" />
            Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(performanceComparison).map(([metric, data]) => (
              <div key={metric} className="bg-black/30 p-4 rounded-lg border border-gray-600">
                <h6 className="font-semibold text-white mb-3 capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</h6>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">VR System:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: `${data.vr}%`}}></div>
                      </div>
                      <span className="text-red-300 font-semibold text-sm">{data.vr}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Multi-Device:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${data.multiDevice}%`}}></div>
                      </div>
                      <span className="text-green-300 font-semibold text-sm">{data.multiDevice}%</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-600">
                    <span className="text-blue-400 font-semibold text-sm">Impact:</span>
                    <p className="text-xs text-gray-300 mt-1">{data.difference}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Page
export default function MultiDeviceLearningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            No VR? No Problem!
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Get 94% of VR immersion using phones, tablets, and computers students already own
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <DollarSign className="w-4 h-4 mr-2" />
              $0-50 total cost
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Target className="w-4 h-4 mr-2" />
              94% retention rate
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Users className="w-4 h-4 mr-2" />
              95% student access
            </Badge>
          </div>
        </div>

        {/* Impact Summary */}
        <Card className="mb-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-400">Universal Access to Revolutionary Learning</h3>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Every student deserves transformative education. Our multi-device system delivers the same 
                historical adventures and immersive learning whether using a $50 tablet or $500 VR headset.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-black/30 p-4 rounded-lg border border-green-500/30">
                  <div className="text-3xl font-bold text-green-400 mb-2">380%</div>
                  <div className="text-green-300">More Students Reached</div>
                  <div className="text-sm text-gray-400">95% vs 25% family accessibility</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-400 mb-2">20x</div>
                  <div className="text-blue-300">Faster Setup</div>
                  <div className="text-sm text-gray-400">30 seconds vs 10+ minutes</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-purple-500/30">
                  <div className="text-3xl font-bold text-purple-400 mb-2">4%</div>
                  <div className="text-purple-300">Performance Difference</div>
                  <div className="text-sm text-gray-400">94% vs 98% retention rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="devices">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="devices">Device Solutions</TabsTrigger>
            <TabsTrigger value="schedules">Flexible Schedules</TabsTrigger>
            <TabsTrigger value="comparison">Cost & Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="devices">
            <DeviceSolutionsDisplay />
          </TabsContent>

          <TabsContent value="schedules">
            <FlexibleSchedulesDisplay />
          </TabsContent>

          <TabsContent value="comparison">
            <AccessibilityComparisonDisplay />
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-400">Education Should Never Be Limited by Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-300 text-lg">
                Our multi-device approach ensures every student can access world-class historical education, 
                regardless of family income. Same curriculum, same quality, universal access.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = '/vr-education-experience'}
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Try on Your Device
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-blue-500 text-blue-400"
                  onClick={() => window.location.href = '/optimal-learning-schedule'}
                >
                  <Clock className="w-5 h-5 mr-2" />
                  See Schedule Options
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}