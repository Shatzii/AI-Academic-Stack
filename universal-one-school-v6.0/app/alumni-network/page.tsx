'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Users, MessageSquare, Trophy, Building2, GraduationCap, 
  Star, Target, TrendingUp, Calendar, MapPin, Award,
  Briefcase, DollarSign, Network, Globe, Phone, Mail,
  Search, Filter
} from 'lucide-react';

// Alumni Network Interface
function AlumniDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const [alumni] = useState([
    {
      id: 1,
      name: 'Marcus Johnson',
      graduationYear: '2019',
      sport: 'Track & Field',
      currentRole: 'Performance Director',
      company: 'Nike Athletic Performance',
      location: 'Portland, OR',
      achievements: ['Olympic Gold 2021', 'World Record Holder'],
      mentorshipAreas: ['Sprint Training', 'Mental Performance', 'Career Transition'],
      availability: 'Active Mentor',
      image: 'MJ',
      backgroundImage: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Sarah Martinez',
      graduationYear: '2018',
      sport: 'Swimming',
      currentRole: 'Sports Medicine Physician',
      company: 'Mayo Clinic Sports Medicine',
      location: 'Rochester, MN',
      achievements: ['NCAA Champion', 'Medical Degree - Harvard'],
      mentorshipAreas: ['Sports Medicine', 'Academic Excellence', 'Research'],
      availability: 'Available',
      image: 'SM',
      backgroundImage: 'bg-gradient-to-br from-green-500 to-teal-500'
    },
    {
      id: 3,
      name: 'David Chen',
      graduationYear: '2020',
      sport: 'Basketball',
      currentRole: 'Sports Analytics Director',
      company: 'Golden State Warriors',
      location: 'San Francisco, CA',
      achievements: ['NBA Champion', 'MIT Computer Science'],
      mentorshipAreas: ['Data Analytics', 'Technology', 'Professional Sports'],
      availability: 'Limited',
      image: 'DC',
      backgroundImage: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      id: 4,
      name: 'Elena Rodriguez',
      graduationYear: '2017',
      sport: 'Soccer',
      currentRole: 'Sports Marketing Executive',
      company: 'ESPN',
      location: 'New York, NY',
      achievements: ['World Cup Silver', 'Marketing MBA - Wharton'],
      mentorshipAreas: ['Media & Broadcasting', 'Brand Management', 'Leadership'],
      availability: 'Active Mentor',
      image: 'ER',
      backgroundImage: 'bg-gradient-to-br from-orange-500 to-red-500'
    }
  ]);

  const filteredAlumni = alumni.filter(alum => {
    const matchesSearch = alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alum.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alum.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'available') return matchesSearch && alum.availability !== 'Limited';
    if (selectedFilter === 'mentors') return matchesSearch && alum.availability === 'Active Mentor';
    return matchesSearch;
  });

  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Alumni Network Directory
        </CardTitle>
        
        {/* Search and Filter */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, sport, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/30 border-gray-600"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'available', 'mentors'].map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={selectedFilter === filter ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(filter)}
                className={selectedFilter === filter ? 'bg-blue-600' : 'border-blue-500 text-blue-400'}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {filteredAlumni.map((alum) => (
            <div 
              key={alum.id} 
              className={`p-6 rounded-lg border border-gray-600 ${alum.backgroundImage} bg-opacity-10 hover:bg-opacity-20 transition-all`}
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                    {alum.image}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">{alum.name}</h4>
                      <p className="text-sm text-gray-300">{alum.currentRole}</p>
                      <p className="text-sm text-gray-400">{alum.company}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        alum.availability === 'Active Mentor' 
                          ? 'border-green-500 text-green-400' 
                          : alum.availability === 'Available'
                          ? 'border-blue-500 text-blue-400'
                          : 'border-orange-500 text-orange-400'
                      }`}
                    >
                      {alum.availability}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      {alum.sport} • Class of {alum.graduationYear}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {alum.location}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs text-gray-400 mb-1">Notable Achievements:</div>
                    <div className="flex flex-wrap gap-1">
                      {alum.achievements.slice(0, 2).map((achievement, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs text-gray-400 mb-1">Mentorship Areas:</div>
                    <div className="flex flex-wrap gap-1">
                      {alum.mentorshipAreas.slice(0, 2).map((area, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-purple-500 text-purple-400">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={alum.availability === 'Limited'}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Connect
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-500 text-gray-300">
                      <Network className="w-3 h-3 mr-1" />
                      Profile
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

// Career Acceleration Programs
function CareerAcceleration() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  
  const programs = [
    {
      id: 'elite-placement',
      title: 'Elite Athletic Placement Program',
      description: 'Direct placement with professional sports organizations and athletic performance companies',
      participants: 45,
      successRate: 94,
      averageSalary: '$125K',
      duration: '6 months',
      features: [
        'Direct connections with 50+ professional organizations',
        'Personal branding and athletic portfolio development',
        'Negotiation training and contract consultation',
        'Performance analytics certification'
      ],
      outcomes: [
        'NFL/NBA/MLB team positions',
        'Olympic training center roles',
        'Elite athletic facilities management',
        'Sports performance technology companies'
      ]
    },
    {
      id: 'executive-track',
      title: 'Sports Executive Leadership Track',
      description: 'Fast-track program for sports management and executive positions',
      participants: 32,
      successRate: 89,
      averageSalary: '$185K',
      duration: '12 months',
      features: [
        'Executive shadowing with Fortune 500 sports companies',
        'MBA-level sports business curriculum',
        'Strategic leadership development',
        'Global sports industry networking'
      ],
      outcomes: [
        'Sports franchise management',
        'Athletic director positions',
        'Sports marketing executive roles',
        'Sports technology leadership'
      ]
    },
    {
      id: 'entrepreneur',
      title: 'Athletic Entrepreneur Accelerator',
      description: 'Launch sports technology startups and athletic innovation companies',
      participants: 28,
      successRate: 76,
      averageSalary: '$95K+',
      duration: '18 months',
      features: [
        'Startup incubation with $250K seed funding',
        'Athletic innovation lab access',
        'Venture capital connection program',
        'Sports tech mentorship network'
      ],
      outcomes: [
        'Sports technology startups',
        'Athletic performance apps',
        'Training equipment innovation',
        'Sports analytics platforms'
      ]
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-cyan-500/20 border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Career Acceleration Programs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {programs.map((program) => (
            <div 
              key={program.id}
              className={`p-6 rounded-lg border cursor-pointer transition-all ${
                selectedProgram === program.id 
                  ? 'bg-green-500/20 border-green-400' 
                  : 'bg-black/30 border-gray-600 hover:border-green-500'
              }`}
              onClick={() => setSelectedProgram(
                selectedProgram === program.id ? null : program.id
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-green-400">{program.title}</h4>
                  <p className="text-gray-300 mt-1">{program.description}</p>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {program.duration}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{program.participants}</div>
                  <div className="text-xs text-gray-400">Current Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{program.successRate}%</div>
                  <div className="text-xs text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{program.averageSalary}</div>
                  <div className="text-xs text-gray-400">Average Salary</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">85%</div>
                  <div className="text-xs text-gray-400">Alumni Satisfaction</div>
                </div>
              </div>

              {selectedProgram === program.id && (
                <div className="mt-6 space-y-4 border-t border-gray-600 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-cyan-400 mb-2">Program Features:</h5>
                      <ul className="space-y-1">
                        {program.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <Target className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-purple-400 mb-2">Career Outcomes:</h5>
                      <ul className="space-y-1">
                        {program.outcomes.map((outcome, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <Award className="w-3 h-3 text-purple-400 mt-1 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Apply Now
                    </Button>
                    <Button variant="outline" className="border-green-500 text-green-400">
                      Learn More
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Success Stories Dashboard
function SuccessStories() {
  const [stories] = useState([
    {
      id: 1,
      name: 'Jordan Williams',
      story: 'From Go4it Academy track athlete to Performance Director at USA Track & Field',
      achievement: 'Leading Olympic training programs',
      salaryIncrease: '340%',
      timeframe: '18 months',
      image: 'JW'
    },
    {
      id: 2,
      name: 'Maya Patel',
      story: 'Go4it Academy swimmer now Head of Sports Medicine at Stanford',
      achievement: 'Revolutionizing athletic recovery protocols',
      salaryIncrease: '290%',
      timeframe: '2 years',
      image: 'MP'
    },
    {
      id: 3,
      name: 'Alex Thompson',
      story: 'Basketball player turned Sports Tech CEO, company valued at $50M',
      achievement: 'Created AI-powered training platform',
      salaryIncrease: '1200%',
      timeframe: '3 years',
      image: 'AT'
    }
  ]);

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-400" />
          Alumni Success Stories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stories.map((story) => (
            <div key={story.id} className="p-4 bg-black/30 rounded-lg border border-gray-600">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-purple-500 text-white font-bold">
                    {story.image}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h4 className="font-bold text-purple-400">{story.name}</h4>
                  <p className="text-sm text-gray-300 mt-1">{story.story}</p>
                  <p className="text-sm text-green-400 mt-2 font-semibold">{story.achievement}</p>
                  
                  <div className="flex gap-4 mt-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">+{story.salaryIncrease}</div>
                      <div className="text-xs text-gray-400">Salary Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{story.timeframe}</div>
                      <div className="text-xs text-gray-400">Timeframe</div>
                    </div>
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

// Main Alumni Network Page
export default function AlumniNetworkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Alumni Network & Career Acceleration
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Connect with elite athletic professionals and accelerate your career through proven programs
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Users className="w-4 h-4 mr-2" />
              500+ Alumni Network
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <TrendingUp className="w-4 h-4 mr-2" />
              92% Career Success Rate
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Building2 className="w-4 h-4 mr-2" />
              250+ Partner Organizations
            </Badge>
          </div>
        </div>

        {/* Main Components */}
        <div className="space-y-8">
          {/* Alumni Directory */}
          <AlumniDirectory />

          {/* Career Acceleration Programs */}
          <CareerAcceleration />

          {/* Success Stories */}
          <SuccessStories />

          {/* Network Statistics */}
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-yellow-400">Alumni Network Impact & ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                  <div className="text-green-300">Alumni in Professional Sports</div>
                  <div className="text-sm text-green-200 mt-1">
                    Across NFL, NBA, MLB, Olympic programs
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">$145K</div>
                  <div className="text-blue-300">Average Starting Salary</div>
                  <div className="text-sm text-blue-200 mt-1">
                    280% above national average for athletes
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">92%</div>
                  <div className="text-purple-300">Career Success Rate</div>
                  <div className="text-sm text-purple-200 mt-1">
                    Leadership positions within 5 years
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 mb-2">200%</div>
                  <div className="text-orange-300">Platform ROI</div>
                  <div className="text-sm text-orange-200 mt-1">
                    Alumni network drives continuous revenue growth
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}