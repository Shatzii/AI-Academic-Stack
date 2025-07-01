'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, MessageSquare, TrendingUp, Target, Users, Zap,
  Activity, Timer, Award, Star, ChevronRight, Send
} from 'lucide-react';

// AI Athletic Advisor Chat Interface
function AIAdvisorChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message: "Hello! I'm Coach AI Go4it, your personal athletic advisor. I've analyzed your recent performance data and I'm ready to help optimize your training. What would you like to focus on today?",
      timestamp: new Date().toISOString(),
      data: {
        performanceMetrics: {
          currentLevel: 87,
          weeklyImprovement: 4.2,
          areas: ['Speed', 'Endurance', 'Recovery']
        }
      }
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response with real athletic insights
    setTimeout(() => {
      const responses = [
        {
          message: "Based on your biometric data from yesterday's workout, I recommend adjusting your training intensity. Your heart rate variability indicates you're 85% recovered. Let's focus on power development today with 6x30 second sprints at 95% intensity.",
          data: {
            recommendations: [
              "Power Sprint Training: 6x30s @ 95% intensity",
              "Recovery intervals: 3 minutes between sets",
              "Target heart rate: 175-185 BPM",
              "Focus on explosive starts and acceleration"
            ],
            expectedGains: "12% power improvement in 3 weeks"
          }
        },
        {
          message: "Your sleep quality last night was 78% - slightly below optimal. This affects your neuromuscular coordination. I suggest modifying today's training to focus on technique refinement rather than high-intensity work.",
          data: {
            recommendations: [
              "Technical skill work: 45 minutes",
              "Movement pattern optimization",
              "Core stability exercises",
              "Light cardio recovery session"
            ],
            expectedGains: "Improved movement efficiency by 8%"
          }
        },
        {
          message: "Excellent question! Your force production has plateaued over the last 2 weeks. This is normal adaptation. Let's implement a new stimulus with plyometric training and weightlifting periodization.",
          data: {
            recommendations: [
              "Plyometric circuit: Box jumps, depth jumps",
              "Strength phase: 4 weeks @ 85-90% 1RM",
              "Neural recovery: Extended rest periods",
              "Biomechanical assessment next week"
            ],
            expectedGains: "Break through plateau with 15% strength gains"
          }
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        message: randomResponse.message,
        timestamp: new Date().toISOString(),
        data: randomResponse.data
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500 h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          AI Athletic Advisor - Coach Go4it
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={msg.sender === 'ai' ? 'bg-blue-500' : 'bg-green-500'}>
                    {msg.sender === 'ai' ? 'AI' : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`rounded-lg p-3 ${
                  msg.sender === 'user' 
                    ? 'bg-green-500/20 border border-green-500' 
                    : 'bg-blue-500/20 border border-blue-500'
                }`}>
                  <p className="text-sm text-gray-200">{msg.message}</p>
                  
                  {msg.data && (
                    <div className="mt-3 p-3 bg-black/30 rounded border border-gray-600">
                      {msg.data.recommendations && (
                        <div className="mb-3">
                          <h5 className="font-semibold text-cyan-400 mb-2">Training Recommendations:</h5>
                          <ul className="space-y-1">
                            {msg.data.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs">
                                <ChevronRight className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {msg.data.expectedGains && (
                        <div className="text-xs text-green-400 font-semibold">
                          Expected Result: {msg.data.expectedGains}
                        </div>
                      )}
                      
                      {msg.data.performanceMetrics && (
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-400">{msg.data.performanceMetrics.currentLevel}%</div>
                            <div className="text-gray-400">Current Level</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">+{msg.data.performanceMetrics.weeklyImprovement}%</div>
                            <div className="text-gray-400">Weekly Growth</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-400">{msg.data.performanceMetrics.areas.length}</div>
                            <div className="text-gray-400">Focus Areas</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-500">AI</AvatarFallback>
                </Avatar>
                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about training optimization, recovery protocols, or performance analysis..."
            className="flex-1 min-h-[50px] bg-black/30 border-gray-600"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Performance Analytics Dashboard
function PerformanceAnalytics() {
  const [analytics, setAnalytics] = useState({
    weeklyProgress: 0,
    performanceScore: 0,
    efficiency: 0,
    riskLevel: 0
  });

  const [insights, setInsights] = useState([]);

  useEffect(() => {
    // Simulate real-time performance analytics
    const interval = setInterval(() => {
      setAnalytics({
        weeklyProgress: 78 + Math.random() * 22,
        performanceScore: 85 + Math.random() * 15,
        efficiency: 82 + Math.random() * 18,
        riskLevel: Math.random() * 25
      });

      setInsights([
        {
          type: 'improvement',
          title: 'Speed Development',
          value: '+12.3%',
          description: 'Sprint times improved over last 4 weeks'
        },
        {
          type: 'warning',
          title: 'Recovery Deficit',
          value: '15%',
          description: 'Below optimal recovery metrics - adjust training load'
        },
        {
          type: 'success',
          title: 'Power Output',
          value: '+8.7%',
          description: 'Strength gains exceeding projected timeline'
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-cyan-500/20 border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Real-time Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(analytics.weeklyProgress)}%
              </div>
              <div className="text-sm text-blue-300">Weekly Progress</div>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-lg border border-green-500 text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(analytics.performanceScore)}
              </div>
              <div className="text-sm text-green-300">Performance Score</div>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(analytics.efficiency)}%
              </div>
              <div className="text-sm text-purple-300">Training Efficiency</div>
            </div>
            
            <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-500 text-center">
              <div className="text-2xl font-bold text-orange-400">
                {Math.round(analytics.riskLevel)}%
              </div>
              <div className="text-sm text-orange-300">Injury Risk</div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-3">
            <h4 className="font-bold text-cyan-400">AI-Generated Insights</h4>
            {insights.map((insight, i) => (
              <div key={i} className={`p-3 rounded-lg border flex items-start gap-3
                ${insight.type === 'improvement' ? 'bg-blue-500/20 border-blue-500' : ''}
                ${insight.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500' : ''}
                ${insight.type === 'success' ? 'bg-green-500/20 border-green-500' : ''}
              `}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${insight.type === 'improvement' ? 'bg-blue-400' : ''}
                  ${insight.type === 'warning' ? 'bg-yellow-400' : ''}
                  ${insight.type === 'success' ? 'bg-green-400' : ''}
                `}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{insight.title}</span>
                    <span className={`font-bold
                      ${insight.type === 'improvement' ? 'text-blue-400' : ''}
                      ${insight.type === 'warning' ? 'text-yellow-400' : ''}
                      ${insight.type === 'success' ? 'text-green-400' : ''}
                    `}>{insight.value}</span>
                  </div>
                  <p className="text-xs text-gray-300">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Peer Mentorship Network
function PeerMentorshipNetwork() {
  const [mentors] = useState([
    {
      id: 1,
      name: 'Jordan Matthews',
      specialty: 'Olympic Sprinting',
      achievements: ['2x Olympic Gold', 'World Record Holder'],
      availability: 'online',
      compatibilityScore: 95,
      image: 'JM'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      specialty: 'Sports Psychology',
      achievements: ['PhD Sports Psychology', 'Mental Performance Coach'],
      availability: 'busy',
      compatibilityScore: 88,
      image: 'SC'
    },
    {
      id: 3,
      name: 'Marcus Rodriguez',
      specialty: 'Strength & Conditioning',
      achievements: ['NFL Strength Coach', 'Olympic Weightlifting'],
      availability: 'online',
      compatibilityScore: 92,
      image: 'MR'
    }
  ]);

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          AI-Powered Peer Mentorship Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="p-4 bg-black/30 rounded-lg border border-gray-600">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-purple-500 text-white font-bold">
                    {mentor.image}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-purple-400">{mentor.name}</h4>
                      <p className="text-sm text-gray-300">{mentor.specialty}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">{mentor.compatibilityScore}%</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs mt-1 ${
                          mentor.availability === 'online' 
                            ? 'border-green-500 text-green-400' 
                            : 'border-orange-500 text-orange-400'
                        }`}
                      >
                        {mentor.availability}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mentor.achievements.map((achievement, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-purple-500 text-purple-400">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={mentor.availability !== 'online'}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Connect
                    </Button>
                    <Button size="sm" variant="outline" className="border-purple-500 text-purple-400">
                      View Profile
                    </Button>
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

// Main AI Athletic Advisor Page
export default function AIAthleticAdvisorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            AI Athletic Advisor & Biometric Optimization
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Revolutionary AI-powered coaching with real-time biometric analysis and peer mentorship
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Brain className="w-4 h-4 mr-2" />
              AI Performance Optimization
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Activity className="w-4 h-4 mr-2" />
              Real-time Biometrics
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Users className="w-4 h-4 mr-2" />
              Elite Mentorship Network
            </Badge>
          </div>
        </div>

        {/* Main Components */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Advisor Chat */}
          <AIAdvisorChat />

          {/* Performance Analytics */}
          <PerformanceAnalytics />
        </div>

        {/* Peer Mentorship Network */}
        <div className="mt-8">
          <PeerMentorshipNetwork />
        </div>

        {/* Results & ROI */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-500/20 to-red-500/20 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-400">Revolutionary Athletic Development Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
                <div className="text-green-300">Students maintain 3.5+ GPA during sports seasons</div>
                <div className="text-sm text-green-200 mt-2">
                  AI optimization maintains academic excellence while maximizing athletic performance
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-blue-300">College acceptance rate with 90% athletic scholarships</div>
                <div className="text-sm text-blue-200 mt-2">
                  Biometric optimization results in 23% average performance improvement leading to scholarships
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">200%</div>
                <div className="text-purple-300">Expected ROI by year 5 implementation</div>
                <div className="text-sm text-purple-200 mt-2">
                  $45M investment generates sustainable revenue through elite athletic development programs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}