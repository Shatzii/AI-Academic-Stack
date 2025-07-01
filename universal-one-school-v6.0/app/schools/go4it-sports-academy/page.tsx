'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Target, 
  Users, 
  Calendar, 
  Activity, 
  Award,
  Timer,
  MapPin,
  Star,
  TrendingUp,
  Heart,
  Zap,
  Medal,
  PlayCircle
} from 'lucide-react';

export default function Go4itSportsAcademy() {
  const [selectedSport, setSelectedSport] = useState('basketball');

  const sportsPrograms = [
    {
      id: 'basketball',
      name: 'Elite Basketball',
      description: 'Professional-level basketball training with NCAA pathway',
      features: ['NCAA Division I coaching', 'Skills development', 'Mental toughness', 'Game strategy'],
      seasons: 'Year-round',
      ageGroups: '8-18 years',
      color: 'text-orange-400'
    },
    {
      id: 'soccer',
      name: 'Premier Soccer',
      description: 'International-style soccer academy with pathway to professional leagues',
      features: ['UEFA certified coaches', 'Technical skills', 'Tactical awareness', 'Physical conditioning'],
      seasons: 'Year-round',
      ageGroups: '6-18 years',
      color: 'text-green-400'
    },
    {
      id: 'tennis',
      name: 'Championship Tennis',
      description: 'Individual excellence in tennis with tournament preparation',
      features: ['ITF junior circuit', 'Mental game coaching', 'Fitness training', 'Equipment optimization'],
      seasons: 'Year-round',
      ageGroups: '5-18 years',
      color: 'text-yellow-400'
    },
    {
      id: 'track',
      name: 'Track & Field Elite',
      description: 'Olympic-style training for track and field events',
      features: ['Olympic coaching methods', 'Event specialization', 'Performance analytics', 'Recovery protocols'],
      seasons: 'Year-round',
      ageGroups: '8-18 years',
      color: 'text-blue-400'
    },
    {
      id: 'swimming',
      name: 'Aquatic Excellence',
      description: 'Competitive swimming with pathway to collegiate and Olympic levels',
      features: ['USA Swimming certified', 'Stroke technique', 'Racing strategy', 'Nutrition planning'],
      seasons: 'Year-round',
      ageGroups: '5-18 years',
      color: 'text-cyan-400'
    },
    {
      id: 'baseball',
      name: 'Diamond Prospects',
      description: 'Baseball development with MLB scouting connections',
      features: ['MLB coaching staff', 'Position specialization', 'Batting analytics', 'Pitching development'],
      seasons: 'Spring/Summer intensive',
      ageGroups: '8-18 years',
      color: 'text-red-400'
    }
  ];

  const academyStats = [
    { label: 'Student Athletes', value: '847', icon: Users },
    { label: 'Scholarships Earned', value: '$2.4M', icon: Award },
    { label: 'College Commitments', value: '156', icon: Trophy },
    { label: 'Championship Titles', value: '73', icon: Medal }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="mb-4 border-yellow-400 text-yellow-400">
              Elite Athletic Academy
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Go4it Sports Academy
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Where champions are made. Elite athletic training combined with academic excellence 
              for the next generation of sports leaders.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {academyStats.map((stat, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <PlayCircle className="mr-2 h-5 w-5" />
              Schedule Campus Tour
            </Button>
            <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
              <Trophy className="mr-2 h-5 w-5" />
              View Athletic Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Sports Programs Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Elite Sports Programs</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your path to athletic excellence with our world-class training programs
            </p>
          </div>

          <Tabs value={selectedSport} onValueChange={setSelectedSport} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-slate-800">
              {sportsPrograms.map((sport) => (
                <TabsTrigger 
                  key={sport.id} 
                  value={sport.id}
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                >
                  {sport.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {sportsPrograms.map((sport) => (
              <TabsContent key={sport.id} value={sport.id} className="mt-8">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className={`text-2xl ${sport.color}`}>
                      {sport.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      {sport.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">Program Features</h4>
                        <ul className="space-y-1">
                          {sport.features.map((feature, index) => (
                            <li key={index} className="text-gray-300 flex items-center">
                              <Star className="h-4 w-4 mr-2 text-yellow-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">Training Schedule</h4>
                        <p className="text-gray-300 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                          {sport.seasons}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">Age Groups</h4>
                        <p className="text-gray-300 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-yellow-400" />
                          {sport.ageGroups}
                        </p>
                      </div>
                      <div>
                        <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                          <Target className="mr-2 h-4 w-4" />
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Academic Integration */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Academic Excellence Program</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Balancing athletic pursuits with rigorous academics for complete student-athlete development
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Flexible Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Customized academic schedules that accommodate intensive training periods, 
                  competitions, and travel for tournaments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Sports Psychology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Mental performance coaching, stress management, and psychological 
                  preparation for high-level competition and academic success.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">College Prep</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  SAT/ACT preparation, NCAA eligibility guidance, and college recruitment 
                  support for athletic scholarships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Go4it?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the next generation of elite student-athletes. Your championship journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  <MapPin className="mr-2 h-5 w-5" />
                  Schedule Campus Visit
                </Button>
                <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                  <Timer className="mr-2 h-5 w-5" />
                  Apply for Tryouts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}