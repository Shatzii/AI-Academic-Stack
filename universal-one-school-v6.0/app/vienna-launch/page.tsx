"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Globe, 
  Users, 
  Building, 
  Heart, 
  Trophy, 
  GraduationCap, 
  Dumbbell,
  Star,
  Target,
  Calendar,
  Euro,
  CheckCircle2,
  ArrowRight,
  Play,
  Gift,
  Crown,
  Zap
} from 'lucide-react';

export default function ViennaLaunchPage() {
  const [selectedTier, setSelectedTier] = useState<string>('supporter');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    message: ''
  });

  const fundingTiers = [
    {
      id: 'supporter',
      name: 'Community Supporter',
      amount: 50,
      description: 'Help us build the future of community education',
      perks: [
        'Vienna Academy digital newsletter',
        'Exclusive construction updates',
        'Community supporter certificate',
        'Early access to facility tours'
      ],
      icon: <Heart className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'champion',
      name: 'Academy Champion',
      amount: 250,
      description: 'Champion the next generation of global citizens',
      perks: [
        'All Community Supporter benefits',
        'VIP opening ceremony invitation',
        'Go4it Academy branded merchandise',
        'Quarterly impact reports',
        'Behind-the-scenes facility videos'
      ],
      icon: <Trophy className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'founder',
      name: 'Founding Partner',
      amount: 1000,
      description: 'Be a founding partner in global education revolution',
      perks: [
        'All Academy Champion benefits',
        'Permanent recognition plaque at Vienna location',
        'Annual VIP family experience day',
        'Direct line to facility leadership',
        'First access to franchise opportunities'
      ],
      icon: <Crown className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'visionary',
      name: 'Global Visionary',
      amount: 5000,
      description: 'Shape the future of international education',
      perks: [
        'All Founding Partner benefits',
        'Advisory board consideration',
        'Naming rights to facility spaces',
        'Lifetime family membership benefits',
        'Global franchise investment opportunities',
        'Annual Vienna Academy retreat invitation'
      ],
      icon: <Star className="h-6 w-6" />,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const currentFunding = 847520; // Current funding amount in EUR
  const fundingGoal = 12500000; // 12.5M EUR goal
  const fundingProgress = (currentFunding / fundingGoal) * 100;
  const daysRemaining = 127;
  const totalBackers = 1847;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-400/30 px-6 py-2 text-lg">
                <MapPin className="h-4 w-4 mr-2" />
                Vienna, Austria Launch
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Go4it Global Academy
              </h1>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
                The world's first IMG Academy + McDonald's + Community Recreation Center hybrid. 
                Elite sports training meets community enrichment in a revolutionary global franchise model.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg"
                onClick={() => document.getElementById('funding-tiers')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Gift className="h-5 w-5 mr-2" />
                Fund Vienna Academy
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-400 text-blue-300 hover:bg-blue-400/10 px-8 py-4 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Vision Video
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Progress Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Vienna Academy Fundraising Campaign</h2>
                <p className="text-gray-400">Help us build the first global location in the heart of Europe</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-400">€{currentFunding.toLocaleString()}</span>
                  <span className="text-lg text-gray-400">raised of €{fundingGoal.toLocaleString()} goal</span>
                </div>
                <Progress value={fundingProgress} className="h-4" />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{fundingProgress.toFixed(1)}% funded</span>
                  <span>{daysRemaining} days remaining</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-400">{totalBackers}</div>
                  <div className="text-sm text-gray-400">Global Backers</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-400">1st</div>
                  <div className="text-sm text-gray-400">Global Location</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-400">2026</div>
                  <div className="text-sm text-gray-400">Target Opening</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Franchise Model Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 px-4 py-2">
              Revolutionary Franchise Model
            </Badge>
            <h2 className="text-4xl font-bold text-white">IMG Academy × McDonald's × Community Center</h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              Combining elite sports training, standardized excellence, and community enrichment 
              in a scalable global franchise that transforms communities worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* IMG Academy Component */}
            <Card className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border-red-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Dumbbell className="h-8 w-8 text-red-400" />
                  <Badge className="bg-red-500/20 text-red-300 border-red-400/30">Elite Training</Badge>
                </div>
                <CardTitle className="text-xl text-white">IMG Academy Excellence</CardTitle>
                <CardDescription>World-class sports training and academic integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Professional-grade training facilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Elite coaching and sports science</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Academic integration with athletics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>College recruitment pathways</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* McDonald's Component */}
            <Card className="bg-gradient-to-br from-yellow-600/20 to-red-600/20 border-yellow-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-8 w-8 text-yellow-400" />
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">Global Standardization</Badge>
                </div>
                <CardTitle className="text-xl text-white">McDonald's Scalability</CardTitle>
                <CardDescription>Proven franchise model with consistent global quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Standardized operational systems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Rapid global expansion model</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Quality control and training systems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Local adaptation with global standards</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Center Component */}
            <Card className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border-green-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-8 w-8 text-green-400" />
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Community Impact</Badge>
                </div>
                <CardTitle className="text-xl text-white">Recreation Center Heart</CardTitle>
                <CardDescription>Community enrichment and family-centered programming</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>All-ages family programming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Community events and gatherings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Local cultural integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Social impact and wellness focus</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Vienna Location Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">Vienna: Our First Global Location</h3>
                  <p className="text-gray-400 text-lg">
                    Vienna, Austria represents the perfect launch location for our global expansion. 
                    Located in the heart of Europe with world-class infrastructure and a growing 
                    international community seeking innovative educational solutions.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white">Why Vienna?</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">Central European gateway with 1.9M metro population</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">High demand for international education and sports programs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">Strong economy with €48,000 average household income</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300">Limited premium youth sports and community facilities</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-gray-300">Strategic location for European expansion</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white">Facility Specifications</h4>
                  <div className="grid gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Facility Size:</span>
                      <span className="text-white font-semibold">15,000 m² (161,000 sq ft)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sports Fields & Courts:</span>
                      <span className="text-white font-semibold">8 professional-grade facilities</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Academic Classrooms:</span>
                      <span className="text-white font-semibold">24 smart learning spaces</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Community Capacity:</span>
                      <span className="text-white font-semibold">1,200 daily users</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Student Enrollment:</span>
                      <span className="text-white font-semibold">600 full-time students</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target Opening:</span>
                      <span className="text-white font-semibold">September 2026</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white">Investment Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Land & Construction:</span>
                      <span className="text-white">€8.5M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Equipment & Technology:</span>
                      <span className="text-white">€2.8M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Operating Capital:</span>
                      <span className="text-white">€1.2M</span>
                    </div>
                    <hr className="border-slate-600" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total Investment:</span>
                      <span className="text-green-400">€12.5M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funding Tiers Section */}
      <div id="funding-tiers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Support the Vienna Launch</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose your investment level and be part of the global education revolution. 
              Every contribution brings us closer to opening our first international location.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fundingTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`relative overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                  selectedTier === tier.id 
                    ? 'border-green-400 bg-gradient-to-br from-green-900/20 to-emerald-900/20' 
                    : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10`}></div>
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${tier.color}`}>
                      {tier.icon}
                    </div>
                    {selectedTier === tier.id && (
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg text-white">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-white">€{tier.amount}</div>
                  <CardDescription className="text-gray-400">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="space-y-2">
                    {tier.perks.map((perk, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Donation Form Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">Complete Your Investment</CardTitle>
            <CardDescription className="text-center">
              Join thousands of supporters building the future of global education
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="preset" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preset">Preset Amount</TabsTrigger>
                <TabsTrigger value="custom">Custom Amount</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preset" className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Selected Tier:</div>
                  <div className="text-2xl font-bold text-white">
                    €{fundingTiers.find(t => t.id === selectedTier)?.amount}
                  </div>
                  <div className="text-gray-400">
                    {fundingTiers.find(t => t.id === selectedTier)?.name}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Custom Amount (EUR)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="text-lg text-center"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="donor-name">Full Name</Label>
                <Input
                  id="donor-name"
                  placeholder="Your full name"
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="donor-email">Email Address</Label>
                <Input
                  id="donor-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="donor-message">Message (Optional)</Label>
                <Textarea
                  id="donor-message"
                  placeholder="Share your vision for global education..."
                  value={donorInfo.message}
                  onChange={(e) => setDonorInfo({...donorInfo, message: e.target.value})}
                  rows={3}
                />
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Complete Investment - €{fundingTiers.find(t => t.id === selectedTier)?.amount || customAmount}
            </Button>

            <div className="text-xs text-gray-400 text-center">
              Secure payment processing • Tax-deductible where applicable • Instant confirmation
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Expansion Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                After Vienna: Global Expansion Plan
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Vienna is just the beginning. Our proven franchise model will expand to 50+ locations 
                worldwide by 2030, creating a global network of elite sports academies and community centers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-400">2026-2027</div>
                <div className="text-lg text-white">European Expansion</div>
                <div className="text-sm text-gray-400">Berlin, London, Paris, Milan</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-400">2027-2028</div>
                <div className="text-lg text-white">North American Launch</div>
                <div className="text-sm text-gray-400">Toronto, New York, Los Angeles</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-400">2028-2030</div>
                <div className="text-lg text-white">Global Network</div>
                <div className="text-sm text-gray-400">Asia-Pacific, Latin America, Middle East</div>
              </div>
            </div>

            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-400 text-purple-300 hover:bg-purple-400/10 px-8 py-3"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Explore Franchise Opportunities
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}