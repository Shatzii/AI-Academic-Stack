'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Zap, 
  Globe, 
  Award, 
  Activity, 
  Network, 
  CheckCircle, 
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  Rocket,
  Star,
  Trophy,
  BookOpen,
  Cpu,
  Heart,
  GraduationCap
} from 'lucide-react';

interface Suggestion {
  id: number;
  title: string;
  category: string;
  description: string;
  implementation: any;
}

interface ApiResponse {
  success: boolean;
  data: {
    suggestions: Suggestion[];
    implementation_priority_matrix: {
      immediate_implementation: string[];
      short_term_development: string[];
      long_term_vision: string[];
    };
    investment_analysis: {
      total_investment: string;
      roi_projection: Record<string, string>;
      competitive_advantages: string[];
    };
    success_metrics: {
      academic_performance: Record<string, string>;
      athletic_performance: Record<string, string>;
      holistic_development: Record<string, string>;
    };
  };
  summary: {
    total_suggestions: number;
    total_investment: string;
    expected_roi: string;
    implementation_timeline: string;
    competitive_advantage: string;
  };
}

const categoryIcons: Record<string, any> = {
  'Academic Innovation': BookOpen,
  'AI-Powered Guidance': Brain,
  'STEM Enhancement': Cpu,
  'Experiential Education': Globe,
  'Career Preparation': GraduationCap,
  'Health-Optimized Education': Heart,
  'Community Building': Users,
  'Academic Flexibility': Target,
  'Holistic Development': Activity,
  'Long-term Success': Trophy
};

const categoryColors: Record<string, string> = {
  'Academic Innovation': 'bg-blue-500',
  'AI-Powered Guidance': 'bg-purple-500',
  'STEM Enhancement': 'bg-green-500',
  'Experiential Education': 'bg-orange-500',
  'Career Preparation': 'bg-red-500',
  'Health-Optimized Education': 'bg-pink-500',
  'Community Building': 'bg-cyan-500',
  'Academic Flexibility': 'bg-yellow-500',
  'Holistic Development': 'bg-indigo-500',
  'Long-term Success': 'bg-emerald-500'
};

export default function AcademyImprovements() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [implementationProgress, setImplementationProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchImprovements();
    
    // Simulate implementation progress
    const timer = setInterval(() => {
      setImplementationProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const fetchImprovements = async () => {
    try {
      const response = await fetch('/api/academy-improvements');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching improvements:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Revolutionary Improvements...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Failed to Load Improvements</h2>
          <Button onClick={fetchImprovements} className="bg-yellow-500 hover:bg-yellow-600">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const filteredSuggestions = selectedCategory === 'all' 
    ? data.data.suggestions 
    : data.data.suggestions.filter(s => s.category === selectedCategory);

  const uniqueCategories = Array.from(new Set(data.data.suggestions.map(s => s.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Rocket className="w-12 h-12 text-yellow-400 mr-4" />
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              Academy Improvements
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
            10 Expert-Designed Enhancements to Transform Student-Athlete Education
          </p>

          {/* Implementation Progress */}
          <div className="bg-black/30 rounded-lg p-6 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Implementation Progress</span>
              <span className="text-2xl font-bold text-yellow-400">{implementationProgress}%</span>
            </div>
            <Progress value={implementationProgress} className="h-3 bg-white/20" />
            <p className="text-sm text-white/70 mt-2">
              {implementationProgress < 100 
                ? "Deploying cutting-edge features..." 
                : "All improvements successfully implemented!"
              }
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{data.summary.total_suggestions}</p>
                <p className="text-sm text-white/70">Expert Suggestions</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{data.summary.total_investment}</p>
                <p className="text-sm text-white/70">Total Investment</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{data.summary.expected_roi}</p>
                <p className="text-sm text-white/70">Expected ROI</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">5 Years</p>
                <p className="text-sm text-white/70">Implementation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="improvements" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="improvements" className="text-white">Improvements</TabsTrigger>
              <TabsTrigger value="implementation" className="text-white">Implementation</TabsTrigger>
              <TabsTrigger value="metrics" className="text-white">Success Metrics</TabsTrigger>
              <TabsTrigger value="investment" className="text-white">Investment</TabsTrigger>
            </TabsList>

            <TabsContent value="improvements" className="space-y-8">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="bg-white/20 border-white/30"
                >
                  All Categories
                </Button>
                {uniqueCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className="bg-white/20 border-white/30"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Improvements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSuggestions.map((suggestion) => {
                  const IconComponent = categoryIcons[suggestion.category] || BookOpen;
                  const categoryColor = categoryColors[suggestion.category] || 'bg-gray-500';
                  
                  return (
                    <Card key={suggestion.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${categoryColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            #{suggestion.id}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-white">{suggestion.title}</CardTitle>
                        <Badge className={`${categoryColor} text-white`}>
                          {suggestion.category}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-white/80 mb-4">
                          {suggestion.description}
                        </CardDescription>
                        
                        {/* Key Features */}
                        {suggestion.implementation && (
                          <div className="space-y-3">
                            {suggestion.implementation.concept && (
                              <div>
                                <h4 className="font-semibold text-yellow-400 mb-2">Concept:</h4>
                                <p className="text-sm text-white/70">{suggestion.implementation.concept}</p>
                              </div>
                            )}
                            
                            {suggestion.implementation.investment && (
                              <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                                <span className="text-sm font-medium">Investment:</span>
                                <span className="text-green-400 font-bold">{suggestion.implementation.investment}</span>
                              </div>
                            )}
                            
                            {suggestion.implementation.roi_timeline && (
                              <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                                <span className="text-sm font-medium">ROI Timeline:</span>
                                <span className="text-blue-400 font-bold">{suggestion.implementation.roi_timeline}</span>
                              </div>
                            )}
                            
                            {/* Success Metrics Preview */}
                            {suggestion.implementation.success_metrics && (
                              <div className="space-y-2">
                                <h4 className="font-semibold text-yellow-400">Expected Outcomes:</h4>
                                {Object.entries(suggestion.implementation.success_metrics).map(([key, value]) => (
                                  <div key={key} className="flex items-center text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                                    <span className="text-white/80">{value as string}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Immediate Implementation */}
                <Card className="bg-green-900/30 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-400">
                      <Zap className="w-6 h-6 mr-2" />
                      Immediate Implementation
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Deploy immediately for instant impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.data.implementation_priority_matrix.immediate_implementation.map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-white/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span className="text-white">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Short-term Development */}
                <Card className="bg-yellow-900/30 border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-yellow-400">
                      <Target className="w-6 h-6 mr-2" />
                      Short-term Development
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      6-18 month development cycle
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.data.implementation_priority_matrix.short_term_development.map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-white/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-yellow-400 mr-3" />
                        <span className="text-white">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Long-term Vision */}
                <Card className="bg-purple-900/30 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-400">
                      <Star className="w-6 h-6 mr-2" />
                      Long-term Vision
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      2-5 year transformational projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.data.implementation_priority_matrix.long_term_vision.map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-white/10 rounded-lg">
                        <Rocket className="w-5 h-5 text-purple-400 mr-3" />
                        <span className="text-white">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Academic Performance */}
                <Card className="bg-blue-900/30 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-400">
                      <BookOpen className="w-6 h-6 mr-2" />
                      Academic Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(data.data.success_metrics.academic_performance).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70 capitalize">{key.replace('_', ' ')}</span>
                          <Badge className="bg-blue-500 text-white">Target</Badge>
                        </div>
                        <p className="text-white font-medium">{value}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Athletic Performance */}
                <Card className="bg-orange-900/30 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-400">
                      <Trophy className="w-6 h-6 mr-2" />
                      Athletic Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(data.data.success_metrics.athletic_performance).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70 capitalize">{key.replace('_', ' ')}</span>
                          <Badge className="bg-orange-500 text-white">Goal</Badge>
                        </div>
                        <p className="text-white font-medium">{value}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Holistic Development */}
                <Card className="bg-green-900/30 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-400">
                      <Heart className="w-6 h-6 mr-2" />
                      Holistic Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(data.data.success_metrics.holistic_development).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70 capitalize">{key.replace('_', ' ')}</span>
                          <Badge className="bg-green-500 text-white">Objective</Badge>
                        </div>
                        <p className="text-white font-medium">{value}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="investment" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Investment Analysis */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-400">
                      <DollarSign className="w-6 h-6 mr-2" />
                      Investment Breakdown
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {data.data.investment_analysis.total_investment} over 5-year implementation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(data.data.investment_analysis.roi_projection).map(([year, projection]) => (
                      <div key={year} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="font-medium capitalize">{year}</span>
                        <span className="text-green-400 font-bold">{projection}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Competitive Advantages */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-400">
                      <Network className="w-6 h-6 mr-2" />
                      Competitive Advantages
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Market differentiators and unique value propositions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.data.investment_analysis.competitive_advantages.map((advantage, index) => (
                      <div key={index} className="flex items-start p-3 bg-white/10 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-white">{advantage}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Student-Athlete Education?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            These revolutionary improvements will position Go4it Academy as the world's leading 
            student-athlete development institution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4">
              Begin Implementation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4">
              Download Full Report
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}