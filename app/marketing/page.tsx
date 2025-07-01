'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Mail, 
  Phone, 
  Globe, 
  Brain,
  Heart,
  Zap,
  Star,
  Award,
  UserCheck,
  Search,
  BookOpen,
  Trophy,
  Lightbulb,
  Share2,
  BarChart3,
  Calendar,
  MapPin
} from 'lucide-react';

interface MarketingCampaign {
  id: string;
  name: string;
  type: 'student' | 'parent' | 'teacher' | 'coach';
  channel: string;
  status: 'active' | 'paused' | 'completed';
  reach: number;
  engagement: number;
  conversions: number;
  cost: number;
  roi: number;
}

interface TargetAudience {
  id: string;
  name: string;
  description: string;
  size: number;
  engagement_score: number;
  conversion_rate: number;
  channels: string[];
  demographics: {
    age_range: string;
    interests: string[];
    locations: string[];
  };
}

export default function MarketingDashboard() {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [audiences, setAudiences] = useState<TargetAudience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        const response = await fetch('/api/marketing/dashboard');
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data.campaigns);
          setAudiences(data.audiences);
        }
      } catch (error) {
        console.error('Error fetching marketing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketingData();
  }, []);

  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const averageROI = campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + campaign.roi, 0) / campaigns.length : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Recruiting Department
          </h1>
          <p className="text-xl text-gray-300">
            Advanced recruitment system for Academics, Sports, and Arts
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-600/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Total Reach</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalReach.toLocaleString()}</div>
              <p className="text-xs text-blue-300">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-green-600/20 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-300">Conversions</CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalConversions}</div>
              <p className="text-xs text-green-300">+8.2% conversion rate</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-600/20 border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-300">Average ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{averageROI.toFixed(1)}x</div>
              <p className="text-xs text-yellow-300">Exceptional performance</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-600/20 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Active Campaigns</CardTitle>
              <Target className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{campaigns.filter(c => c.status === 'active').length}</div>
              <p className="text-xs text-purple-300">Across all channels</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="arts">Arts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recruitment Categories Overview */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  Three-Category Recruitment System
                </CardTitle>
                <CardDescription>
                  Specialized recruitment strategies for each educational focus area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-300">Academic Recruitment</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Neurodivergent Learners</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Gifted Students</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Special Ed Teachers</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-yellow-300">Sports Recruitment</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Elite Athletes</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Athletic Families</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Professional Coaches</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-300">Arts Recruitment</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Theater Students</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Creative Families</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Arts Educators</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Channel Performance */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-yellow-400" />
                  Multi-Channel Engagement
                </CardTitle>
                <CardDescription>
                  Performance across all marketing channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center space-y-2">
                    <Globe className="h-8 w-8 text-blue-400 mx-auto" />
                    <div className="text-lg font-semibold">Social Media</div>
                    <div className="text-sm text-gray-400">45% reach</div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="text-center space-y-2">
                    <Mail className="h-8 w-8 text-green-400 mx-auto" />
                    <div className="text-lg font-semibold">Email Marketing</div>
                    <div className="text-sm text-gray-400">32% reach</div>
                    <Progress value={32} className="h-2" />
                  </div>
                  <div className="text-center space-y-2">
                    <Search className="h-8 w-8 text-purple-400 mx-auto" />
                    <div className="text-lg font-semibold">Search Ads</div>
                    <div className="text-sm text-gray-400">28% reach</div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div className="text-center space-y-2">
                    <MessageSquare className="h-8 w-8 text-orange-400 mx-auto" />
                    <div className="text-lg font-semibold">Community Outreach</div>
                    <div className="text-sm text-gray-400">18% reach</div>
                    <Progress value={18} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-blue-300">Academic Recruitment</h3>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
                <BookOpen className="h-4 w-4 mr-2" />
                Launch Academic Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    Neurodivergent Learners
                  </CardTitle>
                  <CardDescription>ADHD, Dyslexia, Autism support focused recruitment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <span className="font-semibold">234K prospects</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-semibold text-green-400">12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Campaigns:</span>
                      <span className="font-semibold">8</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Primary Channels:</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">Facebook Groups</Badge>
                      <Badge variant="outline" className="text-xs">Reddit Communities</Badge>
                      <Badge variant="outline" className="text-xs">Educational Blogs</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Campaign Details</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-green-400" />
                    Gifted Students
                  </CardTitle>
                  <CardDescription>High-achieving students seeking challenges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <span className="font-semibold">89K prospects</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-semibold text-green-400">15.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Campaigns:</span>
                      <span className="font-semibold">5</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Primary Channels:</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">Academic Forums</Badge>
                      <Badge variant="outline" className="text-xs">STEM Communities</Badge>
                      <Badge variant="outline" className="text-xs">Competition Networks</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Campaign Details</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Special Ed Teachers
                  </CardTitle>
                  <CardDescription>Recruiting specialized education professionals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <span className="font-semibold">45K prospects</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-semibold text-green-400">11.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Campaigns:</span>
                      <span className="font-semibold">6</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Primary Channels:</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">LinkedIn</Badge>
                      <Badge variant="outline" className="text-xs">Teacher Forums</Badge>
                      <Badge variant="outline" className="text-xs">Job Boards</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Campaign Details</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Academic Recruitment Performance</CardTitle>
                <CardDescription>Current academic talent acquisition metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-400">368K</div>
                    <div className="text-sm text-gray-400">Total Academic Reach</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-400">13.1%</div>
                    <div className="text-sm text-gray-400">Average Conversion</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-purple-400">19</div>
                    <div className="text-sm text-gray-400">Active Campaigns</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-yellow-400">4.8x</div>
                    <div className="text-sm text-gray-400">ROI</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-yellow-300">Sports Recruitment</h3>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">
                <Trophy className="h-4 w-4 mr-2" />
                Launch Athletic Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    Elite Athletes
                  </CardTitle>
                  <CardDescription>Multi-platform athlete discovery & viral highlight tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <span className="font-semibold">2.4M prospects</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Viral Highlights Found:</span>
                      <span className="font-semibold text-green-400">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Campaigns:</span>
                      <span className="font-semibold">28</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Recruiting Platforms:</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">Hudl</Badge>
                      <Badge variant="outline" className="text-xs">Rivals</Badge>
                      <Badge variant="outline" className="text-xs">On3</Badge>
                      <Badge variant="outline" className="text-xs">247Sports</Badge>
                      <Badge variant="outline" className="text-xs">TikTok</Badge>
                      <Badge variant="outline" className="text-xs">Instagram</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Campaign Details</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    Athletic Families
                  </CardTitle>
                  <CardDescription>Parents seeking elite athletic programs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <span className="font-semibold">189K prospects</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-semibold text-green-400">18.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Campaigns:</span>
                      <span className="font-semibold">9</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Primary Channels:</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">Parent Groups</Badge>
                      <Badge variant="outline" className="text-xs">Sports Forums</Badge>
                      <Badge variant="outline" className="text-xs">Athletic Events</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Campaign Details</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-400" />
                    Professional Coaches
                  </CardTitle>
                  <CardDescription>Elite coaching talent acquisition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <span className="font-semibold">23K prospects</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-semibold text-green-400">8.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Campaigns:</span>
                      <span className="font-semibold">4</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Primary Channels:</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">Sports Networks</Badge>
                      <Badge variant="outline" className="text-xs">Coaching Assoc</Badge>
                      <Badge variant="outline" className="text-xs">LinkedIn</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Campaign Details</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Sports Recruitment Intelligence Dashboard</CardTitle>
                <CardDescription>Multi-platform athlete discovery and viral content tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-yellow-400">2.4M</div>
                    <div className="text-sm text-gray-400">Total Athletic Prospects</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-400">1,247</div>
                    <div className="text-sm text-gray-400">Viral Highlights Tracked</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-orange-400">28</div>
                    <div className="text-sm text-gray-400">Active Campaigns</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-red-400">94%</div>
                    <div className="text-sm text-gray-400">Platform Coverage</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Hudl Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Athletes Monitored:</span>
                        <span className="font-semibold text-blue-400">847K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Highlight Uploads:</span>
                        <span className="font-semibold text-green-400">12,847/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>AI Analysis Score:</span>
                        <span className="font-semibold text-yellow-400">97.2%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border-red-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        Rivals Network
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Prospects Tracked:</span>
                        <span className="font-semibold text-red-400">356K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ranking Updates:</span>
                        <span className="font-semibold text-green-400">1,247/week</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Commitment Alerts:</span>
                        <span className="font-semibold text-yellow-400">89/day</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border-purple-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        On3 Recruiting
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>RPM Database:</span>
                        <span className="font-semibold text-purple-400">567K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>NIL Tracking:</span>
                        <span className="font-semibold text-green-400">14,567</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Transfer Portal:</span>
                        <span className="font-semibold text-yellow-400">2,847</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        247Sports Intel
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Crystal Ball:</span>
                        <span className="font-semibold text-green-400">1,847</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Composite Rankings:</span>
                        <span className="font-semibold text-blue-400">34,567</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Team Rankings:</span>
                        <span className="font-semibold text-yellow-400">347</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 border-pink-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        Social Media Viral
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>TikTok Highlights:</span>
                        <span className="font-semibold text-pink-400">47K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Instagram Reels:</span>
                        <span className="font-semibold text-green-400">23K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Viral Threshold:</span>
                        <span className="font-semibold text-yellow-400">100K+ views</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cyan-600/20 to-teal-600/20 border-cyan-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        AI Talent Scoring
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Athletes Scored:</span>
                        <span className="font-semibold text-cyan-400">1.2M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Performance Index:</span>
                        <span className="font-semibold text-green-400">89.4</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Potential Rating:</span>
                        <span className="font-semibold text-yellow-400">94.7%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="arts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-purple-300">Arts Recruitment</h3>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Star className="h-4 w-4 mr-2" />
                Launch Arts Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-400" />
                    Theater Students
                  </CardTitle>
                  <CardDescription>Drama, musical theater, and performance students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <span className="font-semibold">78K prospects</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-semibold text-green-400">16.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Campaigns:</span>
                      <span className="font-semibold">7</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Primary Channels:</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">Theater Communities</Badge>
                      <Badge variant="outline" className="text-xs">TikTok</Badge>
                      <Badge variant="outline" className="text-xs">YouTube</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Campaign Details</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-400" />
                    Creative Families
                  </CardTitle>
                  <CardDescription>Parents supporting artistic pursuits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <span className="font-semibold">124K prospects</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-semibold text-green-400">14.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Campaigns:</span>
                      <span className="font-semibold">6</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Primary Channels:</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">Arts Parent Groups</Badge>
                      <Badge variant="outline" className="text-xs">Facebook</Badge>
                      <Badge variant="outline" className="text-xs">Arts Events</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Campaign Details</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border-indigo-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                    Arts Educators
                  </CardTitle>
                  <CardDescription>Drama teachers and arts professionals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <span className="font-semibold">34K prospects</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-semibold text-green-400">12.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Campaigns:</span>
                      <span className="font-semibold">5</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Primary Channels:</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">Theater Networks</Badge>
                      <Badge variant="outline" className="text-xs">LinkedIn</Badge>
                      <Badge variant="outline" className="text-xs">Arts Job Boards</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Campaign Details</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Arts Recruitment Performance</CardTitle>
                <CardDescription>Creative talent acquisition and community engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-purple-400">236K</div>
                    <div className="text-sm text-gray-400">Creative Community Reach</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-400">14.6%</div>
                    <div className="text-sm text-gray-400">Arts Conversion Rate</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-pink-400">18</div>
                    <div className="text-sm text-gray-400">Active Campaigns</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-indigo-400">4.1x</div>
                    <div className="text-sm text-gray-400">ROI</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">AI Content Hub</h3>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Lightbulb className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    Educational Content
                  </CardTitle>
                  <CardDescription>Learning-focused materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div>• Blog posts about neurodivergent learning</div>
                    <div>• Success story videos</div>
                    <div>• Interactive infographics</div>
                    <div>• Webinar presentations</div>
                  </div>
                  <Button size="sm" className="w-full">Generate Now</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-green-400" />
                    Parent Engagement
                  </CardTitle>
                  <CardDescription>Parent-focused content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div>• Parent testimonials</div>
                    <div>• Educational resource guides</div>
                    <div>• Support community posts</div>
                    <div>• Progress tracking demos</div>
                  </div>
                  <Button size="sm" className="w-full">Generate Now</Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    Athletic Content
                  </CardTitle>
                  <CardDescription>Sports academy materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div>• Training highlight videos</div>
                    <div>• College recruitment guides</div>
                    <div>• Athlete success stories</div>
                    <div>• Facility tour content</div>
                  </div>
                  <Button size="sm" className="w-full">Generate Now</Button>
                </CardContent>
              </Card>
            </div>

            {/* Content Calendar */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  Content Calendar
                </CardTitle>
                <CardDescription>Scheduled content across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center">
                  <div className="font-semibold text-gray-400 p-2">Mon</div>
                  <div className="font-semibold text-gray-400 p-2">Tue</div>
                  <div className="font-semibold text-gray-400 p-2">Wed</div>
                  <div className="font-semibold text-gray-400 p-2">Thu</div>
                  <div className="font-semibold text-gray-400 p-2">Fri</div>
                  <div className="font-semibold text-gray-400 p-2">Sat</div>
                  <div className="font-semibold text-gray-400 p-2">Sun</div>
                  
                  {Array.from({ length: 35 }, (_, i) => (
                    <div key={i} className="p-2 border border-slate-600 rounded text-sm min-h-[60px]">
                      {i < 31 && (
                        <div>
                          <div className="font-semibold">{i + 1}</div>
                          {i % 3 === 0 && <div className="text-xs text-blue-400">Blog</div>}
                          {i % 5 === 0 && <div className="text-xs text-green-400">Video</div>}
                          {i % 7 === 0 && <div className="text-xs text-purple-400">Social</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>Student enrollment journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Website Visits</span>
                      <span className="font-semibold">12,847</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Information Requests</span>
                      <span className="font-semibold">3,421</span>
                    </div>
                    <Progress value={27} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Campus Tours</span>
                      <span className="font-semibold">856</span>
                    </div>
                    <Progress value={7} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Applications</span>
                      <span className="font-semibold">342</span>
                    </div>
                    <Progress value={3} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Enrollments</span>
                      <span className="font-semibold text-green-400">189</span>
                    </div>
                    <Progress value={1.5} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Geographic Reach</CardTitle>
                  <CardDescription>Student interest by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span>Texas</span>
                      </div>
                      <span className="font-semibold">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-400" />
                        <span>California</span>
                      </div>
                      <span className="font-semibold">18%</span>
                    </div>
                    <Progress value={18} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        <span>Florida</span>
                      </div>
                      <span className="font-semibold">12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-400" />
                        <span>New York</span>
                      </div>
                      <span className="font-semibold">8%</span>
                    </div>
                    <Progress value={8} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>Other</span>
                      </div>
                      <span className="font-semibold">17%</span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>AI Performance Metrics</CardTitle>
                <CardDescription>Marketing automation effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-400">94%</div>
                    <div className="text-sm text-gray-400">Targeting Accuracy</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-400">67%</div>
                    <div className="text-sm text-gray-400">Engagement Rate</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-purple-400">42%</div>
                    <div className="text-sm text-gray-400">Cost Reduction</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-yellow-400">156%</div>
                    <div className="text-sm text-gray-400">ROI Improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}