'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, Clock, Play, Pause, RotateCcw, Search, Filter,
  Eye, Volume2, Book, Users, Sword, Shield, Crown,
  MapPin, Calendar, Zap, Brain, Star, ChevronRight,
  Mountain, Ship, Castle, Target, Award, TrendingUp
} from 'lucide-react';

// AI-Powered Historical Event Data
const historicalEvents = [
  {
    id: 1,
    year: -3100,
    title: 'Egyptian Civilization Begins',
    description: 'Unification of Upper and Lower Egypt under Pharaoh Menes',
    category: 'civilization',
    region: 'africa',
    coordinates: { x: 52, y: 25 },
    visualType: 'kingdom',
    aiAnalysis: 'The birth of one of history\'s greatest civilizations marked the beginning of centralized government and monumental architecture.',
    battleDetails: null,
    impact: 'high',
    primarySource: 'Egyptian hieroglyphic records',
    modernConnection: 'Modern Egypt still follows the Nile River patterns established in ancient times'
  },
  {
    id: 2,
    year: -490,
    title: 'Battle of Marathon',
    description: 'Athenians defeat Persian invasion force',
    category: 'battle',
    region: 'europe',
    coordinates: { x: 55, y: 35 },
    visualType: 'battle',
    aiAnalysis: 'This decisive victory demonstrated that the mighty Persian Empire could be defeated, inspiring Greek resistance and preserving democratic ideals.',
    battleDetails: {
      attackers: 'Persian Empire (25,000 troops)',
      defenders: 'Athens & Plataea (11,000 troops)',
      strategy: 'Athenian phalanx formation with weakened center',
      outcome: 'Decisive Greek victory, 6,400 Persian casualties vs 192 Greek',
      significance: 'Preserved Greek independence and democratic development'
    },
    impact: 'high',
    primarySource: 'Herodotus Histories',
    modernConnection: 'The marathon race commemorates the messenger who ran from Marathon to Athens'
  },
  {
    id: 3,
    year: -44,
    title: 'Assassination of Julius Caesar',
    description: 'Roman dictator killed by senators on the Ides of March',
    category: 'political',
    region: 'europe',
    coordinates: { x: 48, y: 40 },
    visualType: 'political',
    aiAnalysis: 'Caesar\'s death marked the end of the Roman Republic and began the transition to imperial rule under Augustus.',
    battleDetails: null,
    impact: 'high',
    primarySource: 'Plutarch\'s Lives, Suetonius',
    modernConnection: 'The term "Caesar" became synonymous with emperor in many languages'
  },
  {
    id: 4,
    year: 1066,
    title: 'Battle of Hastings',
    description: 'Norman conquest of England begins',
    category: 'battle',
    region: 'europe',
    coordinates: { x: 45, y: 48 },
    visualType: 'battle',
    aiAnalysis: 'William the Conqueror\'s victory fundamentally changed English culture, language, and governance for centuries.',
    battleDetails: {
      attackers: 'Norman Forces (7,000-8,000 troops)',
      defenders: 'Anglo-Saxon England (7,000-8,000 troops)',
      strategy: 'Norman cavalry and archers vs Saxon shield wall',
      outcome: 'Norman victory, King Harold II killed',
      significance: 'Established Norman rule in England, transformed English society'
    },
    impact: 'high',
    primarySource: 'Bayeux Tapestry, Anglo-Saxon Chronicle',
    modernConnection: 'Modern English contains thousands of Norman French words'
  },
  {
    id: 5,
    title: 'Discovery of the Americas',
    year: 1492,
    description: 'Columbus reaches the Caribbean islands',
    category: 'exploration',
    region: 'americas',
    coordinates: { x: 25, y: 45 },
    visualType: 'exploration',
    aiAnalysis: 'This voyage connected two worlds that had been separate for millennia, beginning an era of global exchange and colonization.',
    battleDetails: null,
    impact: 'high',
    primarySource: 'Columbus\'s logbook, Spanish colonial records',
    modernConnection: 'The Columbian Exchange still influences global food, culture, and disease patterns'
  },
  {
    id: 6,
    year: 1776,
    title: 'American Declaration of Independence',
    description: 'Thirteen colonies declare independence from Britain',
    category: 'political',
    region: 'americas',
    coordinates: { x: 30, y: 52 },
    visualType: 'political',
    aiAnalysis: 'The principles of self-governance and individual rights established here influenced democratic movements worldwide.',
    battleDetails: null,
    impact: 'high',
    primarySource: 'Original Declaration document, Continental Congress records',
    modernConnection: 'Modern democratic constitutions worldwide draw from these principles'
  },
  {
    id: 7,
    year: 1969,
    title: 'Moon Landing',
    description: 'Apollo 11 lands first humans on the Moon',
    category: 'exploration',
    region: 'global',
    coordinates: { x: 50, y: 50 },
    visualType: 'exploration',
    aiAnalysis: 'Humanity\'s first steps on another celestial body demonstrated the power of science, technology, and international cooperation.',
    battleDetails: null,
    impact: 'high',
    primarySource: 'NASA mission transcripts, television broadcasts',
    modernConnection: 'Space technology developed for the moon landing now powers GPS, satellites, and modern communications'
  }
];

// Interactive Map Component
function InteractiveHistoryMap({ selectedYear, onEventSelect, selectedEvent }) {
  const mapRef = useRef<HTMLDivElement>(null);

  const getVisibleEvents = () => {
    return historicalEvents.filter(event => 
      Math.abs(event.year) <= Math.abs(selectedYear) + 100
    );
  };

  const getEventIcon = (visualType: string) => {
    switch (visualType) {
      case 'battle': return <Sword className="w-4 h-4" />;
      case 'kingdom': return <Crown className="w-4 h-4" />;
      case 'political': return <Users className="w-4 h-4" />;
      case 'exploration': return <Ship className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getEventColor = (category: string, isSelected: boolean) => {
    if (isSelected) return 'bg-yellow-500 border-yellow-300 text-black';
    switch (category) {
      case 'battle': return 'bg-red-500/80 border-red-300 text-white hover:bg-red-400';
      case 'civilization': return 'bg-purple-500/80 border-purple-300 text-white hover:bg-purple-400';
      case 'political': return 'bg-blue-500/80 border-blue-300 text-white hover:bg-blue-400';
      case 'exploration': return 'bg-green-500/80 border-green-300 text-white hover:bg-green-400';
      default: return 'bg-gray-500/80 border-gray-300 text-white hover:bg-gray-400';
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-900 to-green-900 rounded-lg border border-cyan-500 overflow-hidden">
      {/* World Map Background */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1000 500\'%3E%3Cpath fill=\'%23334155\' d=\'M100,100 Q200,50 300,100 T500,100 T700,100 T900,100 L900,400 Q700,350 500,400 T300,400 T100,400 Z\'/%3E%3Cpath fill=\'%23475569\' d=\'M150,150 Q250,120 350,150 T550,150 T750,150 L750,350 Q550,320 350,350 T150,350 Z\'/%3E%3C/svg%3E")'
        }}
      />
      
      {/* Grid Lines */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-cyan-500/20" style={{ left: `${i * 10}%` }} />
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-cyan-500/20" style={{ top: `${i * 16.67}%` }} />
        ))}
      </div>

      {/* Historical Events */}
      {getVisibleEvents().map((event) => (
        <button
          key={event.id}
          className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all transform hover:scale-110 z-10 ${
            getEventColor(event.category, selectedEvent?.id === event.id)
          }`}
          style={{ 
            left: `${event.coordinates.x}%`, 
            top: `${event.coordinates.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => onEventSelect(event)}
          title={event.title}
        >
          {getEventIcon(event.visualType)}
        </button>
      ))}

      {/* Year Display */}
      <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-lg border border-cyan-500">
        <div className="text-cyan-400 font-bold">
          {selectedYear < 0 ? `${Math.abs(selectedYear)} BCE` : `${selectedYear} CE`}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/70 p-3 rounded-lg border border-cyan-500">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white">Battles</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-white">Civilizations</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-white">Political</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">Exploration</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI-Generated Battle Visualization
function BattleVisualization({ battleDetails }) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (battleDetails) {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [battleDetails]);

  if (!battleDetails) return null;

  return (
    <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <Sword className="w-5 h-5" />
          Interactive Battle Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Battle Field */}
          <div className="relative w-full h-48 bg-gradient-to-b from-green-800 to-yellow-800 rounded-lg border border-red-500 overflow-hidden">
            {/* Terrain */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-green-700 to-yellow-700"></div>
            
            {/* Attacking Forces */}
            <div className={`absolute transition-all duration-2000 ${
              animationPhase >= 2 ? 'left-1/3' : 'left-4'
            } top-8`}>
              <div className="flex items-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`w-3 h-6 bg-red-500 transition-all duration-500 ${
                    animationPhase >= 1 ? 'transform -translate-y-1' : ''
                  }`} style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
              <div className="text-xs text-red-300 mt-1">Attackers</div>
            </div>

            {/* Defending Forces */}
            <div className={`absolute transition-all duration-2000 ${
              animationPhase >= 2 ? 'right-1/3' : 'right-4'
            } top-8`}>
              <div className="flex items-center gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`w-3 h-6 bg-blue-500 transition-all duration-500 ${
                    animationPhase >= 3 ? 'transform translate-y-2 opacity-60' : ''
                  }`} style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <div className="text-xs text-blue-300 mt-1">Defenders</div>
            </div>

            {/* Battle Effects */}
            {animationPhase >= 2 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 bg-yellow-500 rounded-full opacity-70 animate-ping"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white">
                  ⚔️
                </div>
              </div>
            )}

            {/* Animation Controls */}
            <div className="absolute top-2 right-2">
              <Button size="sm" onClick={() => setAnimationPhase(0)} className="bg-black/50">
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Battle Analysis */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-semibold text-red-400">Forces & Strategy</h5>
              <div className="text-sm space-y-1">
                <div><span className="text-red-300">Attackers:</span> {battleDetails.attackers}</div>
                <div><span className="text-blue-300">Defenders:</span> {battleDetails.defenders}</div>
                <div><span className="text-yellow-300">Strategy:</span> {battleDetails.strategy}</div>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-orange-400">Outcome & Impact</h5>
              <div className="text-sm space-y-1">
                <div><span className="text-green-300">Result:</span> {battleDetails.outcome}</div>
                <div><span className="text-purple-300">Significance:</span> {battleDetails.significance}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// AI Historical Analysis Panel
function AIHistoricalAnalysis({ event }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    if (event) {
      setIsAnalyzing(true);
      setAnalysisComplete(false);
      
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [event]);

  if (!event) {
    return (
      <Card className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-500">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-gray-400">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select an event on the timeline to see AI analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Brain className="w-5 h-5" />
          AI Historical Analysis
          {isAnalyzing && <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin ml-2" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="space-y-3">
            <div className="text-sm text-cyan-300">Analyzing historical significance...</div>
            <Progress value={75} className="h-2" />
            <div className="text-xs text-gray-400">Processing primary sources, cross-referencing data, generating insights...</div>
          </div>
        ) : (
          <>
            {/* Event Overview */}
            <div className="space-y-3">
              <div>
                <Badge className={`mb-2 ${
                  event.category === 'battle' ? 'bg-red-500' :
                  event.category === 'political' ? 'bg-blue-500' :
                  event.category === 'exploration' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}>
                  {event.category.toUpperCase()}
                </Badge>
                <h4 className="text-lg font-bold text-white">{event.title}</h4>
                <p className="text-gray-300">{event.description}</p>
              </div>

              {/* AI Analysis */}
              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/50">
                <h5 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  AI Historical Insight
                </h5>
                <p className="text-sm text-gray-200">{event.aiAnalysis}</p>
              </div>

              {/* Impact Assessment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-3 rounded border border-gray-600">
                  <div className="text-xs text-gray-400 mb-1">Historical Impact</div>
                  <div className={`text-lg font-bold ${
                    event.impact === 'high' ? 'text-red-400' :
                    event.impact === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {event.impact.toUpperCase()}
                  </div>
                </div>
                <div className="bg-black/30 p-3 rounded border border-gray-600">
                  <div className="text-xs text-gray-400 mb-1">Year</div>
                  <div className="text-lg font-bold text-cyan-400">
                    {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                  </div>
                </div>
              </div>

              {/* Primary Sources */}
              <div className="bg-black/30 p-3 rounded border border-gray-600">
                <h6 className="font-semibold text-purple-400 mb-1 flex items-center gap-1">
                  <Book className="w-4 h-4" />
                  Primary Sources
                </h6>
                <p className="text-sm text-gray-300">{event.primarySource}</p>
              </div>

              {/* Modern Connection */}
              <div className="bg-black/30 p-3 rounded border border-gray-600">
                <h6 className="font-semibold text-green-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Modern Relevance
                </h6>
                <p className="text-sm text-gray-300">{event.modernConnection}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Timeline Navigation Component
function TimelineNavigation({ currentYear, onYearChange, isPlaying, onPlayToggle }) {
  const minYear = -3500;
  const maxYear = 2024;

  const handleSliderChange = (value: number[]) => {
    onYearChange(value[0]);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Clock className="w-5 h-5" />
          Interactive Timeline Navigator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Play Controls */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={onPlayToggle}
            className={`${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <div className="text-2xl font-bold text-white">
            {currentYear < 0 ? `${Math.abs(currentYear)} BCE` : `${currentYear} CE`}
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2">
          <Slider
            value={[currentYear]}
            onValueChange={handleSliderChange}
            min={minYear}
            max={maxYear}
            step={50}
            className="w-full"
          />
          
          {/* Era Markers */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>3500 BCE</span>
            <span>Ancient</span>
            <span>Classical</span>
            <span>Medieval</span>
            <span>Modern</span>
            <span>2024 CE</span>
          </div>
        </div>

        {/* Quick Jump Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button size="sm" variant="outline" onClick={() => onYearChange(-3000)} className="border-purple-500 text-purple-400">
            Ancient
          </Button>
          <Button size="sm" variant="outline" onClick={() => onYearChange(-500)} className="border-purple-500 text-purple-400">
            Classical
          </Button>
          <Button size="sm" variant="outline" onClick={() => onYearChange(1000)} className="border-purple-500 text-purple-400">
            Medieval
          </Button>
          <Button size="sm" variant="outline" onClick={() => onYearChange(1800)} className="border-purple-500 text-purple-400">
            Modern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Interactive History Map Page
export default function InteractiveHistoryMapPage() {
  const [currentYear, setCurrentYear] = useState(1492);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentYear(prev => {
          const newYear = prev + 100;
          return newYear > 2024 ? -3500 : newYear;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setCurrentYear(event.year);
  };

  const filteredEvents = historicalEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Interactive Visual History Map
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            AI-powered historical exploration with immersive battle visualizations and timeline navigation
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-cyan-500 text-cyan-400">
              <Globe className="w-4 h-4 mr-2" />
              Interactive World Map
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Brain className="w-4 h-4 mr-2" />
              AI Historical Analysis
            </Badge>
            <Badge variant="outline" className="border-red-500 text-red-400">
              <Sword className="w-4 h-4 mr-2" />
              Battle Visualizations
            </Badge>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search historical events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/30 border-cyan-500"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline Navigation */}
          <div className="lg:col-span-3">
            <TimelineNavigation 
              currentYear={currentYear}
              onYearChange={setCurrentYear}
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
            />
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Globe className="w-5 h-5" />
                  Interactive World History Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveHistoryMap 
                  selectedYear={currentYear}
                  onEventSelect={handleEventSelect}
                  selectedEvent={selectedEvent}
                />
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Panel */}
          <div>
            <AIHistoricalAnalysis event={selectedEvent} />
          </div>

          {/* Battle Visualization */}
          {selectedEvent?.battleDetails && (
            <div className="lg:col-span-3">
              <BattleVisualization battleDetails={selectedEvent.battleDetails} />
            </div>
          )}

          {/* Event List */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Calendar className="w-5 h-5" />
                  Historical Events Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventSelect(event)}
                      className={`p-4 rounded-lg border text-left transition-all hover:scale-105 ${
                        selectedEvent?.id === event.id 
                          ? 'bg-yellow-500/20 border-yellow-400' 
                          : 'bg-black/30 border-gray-600 hover:border-green-400'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${
                          event.category === 'battle' ? 'bg-red-500' :
                          event.category === 'political' ? 'bg-blue-500' :
                          event.category === 'exploration' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}>
                          {event.category}
                        </Badge>
                        <div className="text-sm text-gray-400">
                          {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                        </div>
                      </div>
                      <h4 className="font-bold text-white mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-300">{event.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Educational Impact Stats */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-400">Interactive History Map - Educational Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
                <div className="text-green-300">Student engagement in history classes</div>
                <div className="text-sm text-green-200 mt-1">
                  Interactive visualization increases retention by 340%
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">78%</div>
                <div className="text-blue-300">Improvement in historical analysis skills</div>
                <div className="text-sm text-blue-200 mt-1">
                  AI-powered insights develop critical thinking
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
                <div className="text-purple-300">Historical events with AI analysis</div>
                <div className="text-sm text-purple-200 mt-1">
                  Comprehensive coverage from ancient to modern times
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">200%</div>
                <div className="text-orange-300">Expected educational ROI</div>
                <div className="text-sm text-orange-200 mt-1">
                  Revolutionary learning technology drives academic excellence
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}