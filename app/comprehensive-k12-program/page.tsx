'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, Globe, Brain, Users, Star, Calendar,
  BookOpen, Zap, Target, Award, ChevronRight, MapPin,
  Clock, Eye, Heart, Lightbulb, Puzzle, Music,
  Palette, Calculator, Microscope, Telescope, Atom,
  TreePine, Home, Gamepad2, Crown, Sword
} from 'lucide-react';

// Comprehensive Program Overview
const programOverview = {
  title: "Universal One School: Revolutionary K-12 Human-Centered Education",
  mission: "Transform education through interdisciplinary learning rooted in human stories, ensuring every student succeeds regardless of neurotype or learning style",
  compliance: ["All 50 US States", "Austria", "Mexico", "International Standards"],
  totalStudents: 2847,
  successRate: 97.8,
  collegeAcceptance: 100,
  neurodivergentSupport: 89,
  vrImplementation: 98,
  outdoorIntegration: 94
};

// 15 Innovation Features Integrated
const innovationFeatures = [
  {
    id: 1,
    title: "Neural-Adaptive Learning Algorithms",
    description: "AI automatically adjusts content delivery based on each student's neurotype",
    implementation: "Real-time learning style detection and content adaptation",
    icon: Brain,
    color: "purple",
    status: "Active"
  },
  {
    id: 2,
    title: "Global Virtual Reality Field Trips",
    description: "Students visit historical sites through immersive VR experiences",
    implementation: "Partnership with 47 historical sites for authentic VR reconstruction",
    icon: Eye,
    color: "cyan",
    status: "Active"
  },
  {
    id: 3,
    title: "Multi-Language Immersion Through History",
    description: "Learn languages naturally through historical and cultural context",
    implementation: "Spanish via Aztec studies, German via Scientific Revolution, Arabic via Islamic Golden Age",
    icon: Globe,
    color: "green",
    status: "Active"
  },
  {
    id: 4,
    title: "Peer-to-Peer Global Collaboration",
    description: "Students worldwide collaborate on historical projects in real-time",
    implementation: "Live collaboration between Dallas, Vienna, and Merida campuses",
    icon: Users,
    color: "blue",
    status: "Active"
  },
  {
    id: 5,
    title: "Micro-Credentialing Achievement System",
    description: "Skills-based progression with specific competency badges",
    implementation: "Digital badges for 127 historical and cross-subject competencies",
    icon: Award,
    color: "yellow",
    status: "Active"
  },
  {
    id: 6,
    title: "Family Integration Learning Pods",
    description: "Parents become learning facilitators through guided activities",
    implementation: "Family cooking historical recipes, creating period crafts, role-playing cultural exchanges",
    icon: Heart,
    color: "pink",
    status: "Active"
  },
  {
    id: 7,
    title: "Real-World Problem Solving Through History",
    description: "Tackle current issues using historical wisdom and examples",
    implementation: "Modern water scarcity solved through ancient irrigation, climate adaptation via historical civilizations",
    icon: Lightbulb,
    color: "orange",
    status: "Active"
  },
  {
    id: 8,
    title: "Sensory-Rich Learning Environments",
    description: "Multi-sensory approach for neurodivergent students",
    implementation: "Textured timeline walls, scented historical periods, musical eras, taste experiences",
    icon: Palette,
    color: "red",
    status: "Active"
  },
  {
    id: 9,
    title: "Community Expert Integration",
    description: "Local historians, scientists, and artists as regular contributors",
    implementation: "Weekly expert sessions with 23 community professionals per campus",
    icon: Users,
    color: "teal",
    status: "Active"
  },
  {
    id: 10,
    title: "Adaptive Assessment Through Demonstration",
    description: "Project-based assessment instead of traditional testing",
    implementation: "Build medieval castles, perform historical plays, recreate scientific experiments",
    icon: Target,
    color: "indigo",
    status: "Active"
  },
  {
    id: 11,
    title: "Time-Travel Narrative Learning",
    description: "Students become time travelers with personal avatars",
    implementation: "Immersive storytelling with decision-making and consequence-based learning",
    icon: Clock,
    color: "violet",
    status: "Active"
  },
  {
    id: 12,
    title: "Therapeutic Learning Integration",
    description: "Education becomes therapeutic intervention for special needs",
    implementation: "Occupational therapy via historical crafts, speech therapy via storytelling",
    icon: Heart,
    color: "rose",
    status: "Active"
  },
  {
    id: 13,
    title: "Entrepreneurial Historical Simulation",
    description: "Students create businesses based on historical innovations",
    implementation: "Run medieval guilds, manage Renaissance workshops, operate Industrial Revolution factories",
    icon: Crown,
    color: "amber",
    status: "Active"
  },
  {
    id: 14,
    title: "Environmental Time-Lapse Learning",
    description: "Track human activities' impact on landscapes over time",
    implementation: "Watch forests become cities, observe agricultural development, see climate adaptation",
    icon: TreePine,
    color: "emerald",
    status: "Active"
  },
  {
    id: 15,
    title: "Future-Forward Historical Application",
    description: "Connect every historical lesson to future careers and innovations",
    implementation: "Ancient engineering to modern architecture, historical pandemics to public health careers",
    icon: Telescope,
    color: "sky",
    status: "Active"
  }
];

// Complete K-12 Grade Structure
const gradeStructure = [
  {
    level: "K-2 (Ages 5-7)",
    title: "Foundation Explorers",
    focus: "Sensory Learning Through Human Stories",
    vrTime: "45 minutes",
    outdoorTime: "7+ hours",
    standards: {
      us: ["Common Core ELA K-2", "Common Core Math K-2", "NGSS K-2", "Social Studies Standards"],
      austria: ["Austrian Primary Curriculum", "European Language Framework"],
      mexico: ["SEP Preescolar-Primaria", "Mexican National Standards"]
    },
    subjects: {
      mathematics: [
        "Number recognition through ancient counting systems",
        "Basic addition via historical trade scenarios",
        "Shape recognition through historical architecture",
        "Measurement using historical tools and methods"
      ],
      languageArts: [
        "Phonics through historical character names",
        "Basic reading via period-appropriate stories",
        "Oral storytelling of historical events",
        "Beginning writing through historical journals"
      ],
      science: [
        "Basic observation skills through historical exploration",
        "Simple experiments recreating historical discoveries",
        "Nature awareness through historical environmental changes",
        "Introduction to scientific method via historical examples"
      ],
      socialStudies: [
        "Community helpers throughout history",
        "Basic geography through historical migration",
        "Cultural awareness via historical civilizations",
        "Understanding time and chronology"
      ]
    },
    neurodivergentSupport: [
      "Sensory integration through textured historical materials",
      "Visual supports with historical timeline graphics",
      "Flexible pacing with interest-based learning paths",
      "Movement breaks integrated into historical role-play"
    ]
  },
  {
    level: "3-5 (Ages 8-10)",
    title: "Cultural Investigators", 
    focus: "Cross-Subject Exploration Through Civilizations",
    vrTime: "60 minutes",
    outdoorTime: "6+ hours",
    standards: {
      us: ["Common Core ELA 3-5", "Common Core Math 3-5", "NGSS 3-5", "C3 Social Studies"],
      austria: ["Austrian Elementary Standards", "European Qualifications Framework"],
      mexico: ["SEP Primaria 3-5", "Mexican Education Standards"]
    },
    subjects: {
      mathematics: [
        "Multiplication through ancient trade calculations",
        "Fractions via historical measurement systems",
        "Geometry through ancient architectural design",
        "Data analysis using historical population studies"
      ],
      languageArts: [
        "Reading comprehension through historical narratives",
        "Writing historical fiction and reports",
        "Vocabulary expansion via period-specific terms",
        "Research skills using historical sources"
      ],
      science: [
        "Scientific method through historical discoveries",
        "Life cycles studied via historical agricultural practices",
        "Matter and energy through historical innovations",
        "Earth science via historical environmental changes"
      ],
      socialStudies: [
        "Ancient civilizations comparative study",
        "Government systems throughout history",
        "World geography through historical exploration",
        "Economic principles via historical trade"
      ]
    },
    neurodivergentSupport: [
      "Differentiated instruction with multiple learning modalities",
      "Assistive technology integration for reading and writing",
      "Therapeutic activities integrated into historical crafts",
      "Peer mentoring through collaborative historical projects"
    ]
  },
  {
    level: "6-8 (Ages 11-13)",
    title: "Innovation Analysts",
    focus: "Scientific Revolution and Human Progress",
    vrTime: "75 minutes",
    outdoorTime: "5+ hours", 
    standards: {
      us: ["Common Core ELA 6-8", "Common Core Math 6-8", "NGSS MS", "C3 Social Studies MS"],
      austria: ["Austrian Middle School Standards", "European STEM Framework"],
      mexico: ["SEP Secundaria", "Mexican Middle School Standards"]
    },
    subjects: {
      mathematics: [
        "Algebra through historical problem-solving scenarios",
        "Statistics via historical population and trade data",
        "Advanced geometry through architectural analysis",
        "Probability using historical event likelihood studies"
      ],
      languageArts: [
        "Critical analysis of historical documents and literature",
        "Research writing with primary and secondary sources",
        "Public speaking through historical figure presentations",
        "Media literacy via historical propaganda analysis"
      ],
      science: [
        "Physics principles through historical inventions",
        "Chemistry basics via historical metallurgy and medicine",
        "Biology systems through historical medical discoveries",
        "Earth science via historical geological understanding"
      ],
      socialStudies: [
        "World history with emphasis on cultural interactions",
        "Civics and government through historical examples",
        "Economic principles via historical economic systems",
        "Geography through historical exploration and trade"
      ]
    },
    neurodivergentSupport: [
      "Executive function support through structured historical projects",
      "Adaptive assessments with multiple demonstration options",
      "Social skills development through historical role-play",
      "Attention management tools during immersive experiences"
    ]
  },
  {
    level: "9-12 (Ages 14-18)",
    title: "Future Builders",
    focus: "Modern Applications and Career Preparation",
    vrTime: "90 minutes",
    outdoorTime: "4+ hours",
    standards: {
      us: ["Common Core ELA 9-12", "Common Core Math 9-12", "NGSS HS", "Advanced Placement"],
      austria: ["Austrian Matura Preparation", "European University Standards"],
      mexico: ["SEP Bachillerato", "University Preparation Standards"]
    },
    subjects: {
      mathematics: [
        "Calculus applications in historical engineering projects",
        "Statistics and data analysis for historical research",
        "Mathematical modeling of historical phenomena",
        "Advanced geometry in historical architectural analysis"
      ],
      languageArts: [
        "Advanced composition through historical analysis",
        "Literary analysis of period literature",
        "Rhetoric and debate using historical examples",
        "Creative writing inspired by historical periods"
      ],
      science: [
        "Advanced physics through historical scientific breakthroughs",
        "Organic chemistry via historical pharmaceutical development",
        "Advanced biology through historical medical advances",
        "Environmental science via historical ecological changes"
      ],
      socialStudies: [
        "Advanced historical analysis and interpretation",
        "Political science through historical government systems",
        "Economics through historical economic theory and practice",
        "International relations via historical diplomatic studies"
      ]
    },
    neurodivergentSupport: [
      "Transition planning with career connections to historical interests",
      "Independent living skills through historical self-sufficiency projects",
      "College preparation with accommodations and support",
      "Mentorship programs connecting students with historical professionals"
    ]
  }
];

// Global Campus Integration with VR Field Trips
const globalCampuses = [
  {
    location: "Dallas, Texas",
    focus: "Space Exploration & Technology Innovation",
    specialVRSites: [
      "NASA Johnson Space Center historical timeline",
      "Wright Brothers first flight simulation",
      "Silicon Valley technology evolution",
      "American Industrial Revolution factories"
    ],
    partnerships: ["NASA", "UT Dallas", "Smithsonian", "National Archives"],
    students: 947,
    languages: ["English", "Spanish"]
  },
  {
    location: "Vienna, Austria", 
    focus: "Arts, Music & European Cultural Heritage",
    specialVRSites: [
      "Mozart's Vienna concert halls",
      "Habsburg Empire palace tours",
      "Beethoven's workshop recreation",
      "European Renaissance art studios"
    ],
    partnerships: ["Vienna State Opera", "University of Vienna", "Kunsthistorisches Museum", "Salzburg Festival"],
    students: 623,
    languages: ["German", "English", "French"]
  },
  {
    location: "Merida, Mexico",
    focus: "Archaeological Studies & Environmental Science",
    specialVRSites: [
      "Chichen Itza at its historical peak",
      "Mayan astronomical observatory experiences",
      "Cenote underwater exploration",
      "Pre-Columbian trade route simulations"
    ],
    partnerships: ["INAH", "Universidad Autónoma de Yucatán", "Mayan Cultural Center", "UNESCO"],
    students: 1277,
    languages: ["Spanish", "English", "Mayan"]
  }
];

// Compliance Matrix for All Jurisdictions
const complianceMatrix = {
  "United States": {
    federal: ["Every Student Succeeds Act", "IDEA Special Education", "Title IX Compliance"],
    states: {
      core: ["Common Core Standards", "Next Generation Science Standards", "C3 Social Studies"],
      assessment: ["State Testing Requirements", "SAT/ACT Preparation", "Advanced Placement"],
      specialNeeds: ["504 Plans", "IEP Implementation", "RTI Framework"]
    },
    coverage: "100% compliance across all 50 states"
  },
  "Austria": {
    national: ["Austrian Education Act", "School Organization Act", "Compulsory Education Law"],
    european: ["European Qualifications Framework", "Common European Framework"],
    assessment: ["Matura Examination Preparation", "European Language Certifications"],
    specialNeeds: ["Inclusive Education Guidelines", "Special Needs Support Framework"],
    coverage: "Full Austrian Ministry of Education approval"
  },
  "Mexico": {
    federal: ["General Education Law", "SEP National Curriculum", "Educational Equity Law"],
    assessment: ["PLANEA Preparation", "CENEVAL University Entrance", "PISA International"],
    specialNeeds: ["Inclusive Education Framework", "Indigenous Language Support"],
    bilingual: ["Spanish-English Dual Language", "Cultural Heritage Integration"],
    coverage: "Complete SEP and UNESCO compliance"
  }
};

// Innovation Features Display
function InnovationFeaturesDisplay() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Zap className="w-5 h-5" />
          15 Revolutionary Innovation Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {innovationFeatures.slice(0, 15).map((feature) => (
            <div 
              key={feature.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedFeature === feature.id 
                  ? 'bg-purple-500/30 border-purple-400' 
                  : 'bg-black/30 border-gray-600 hover:border-purple-400'
              }`}
              onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <feature.icon className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <Badge className="bg-green-500 text-xs">{feature.status}</Badge>
              </div>
              
              <h5 className="font-semibold text-white text-sm mb-2">{feature.title}</h5>
              <p className="text-xs text-gray-300 mb-2">{feature.description}</p>
              
              {selectedFeature === feature.id && (
                <div className="mt-3 pt-3 border-t border-purple-500/50">
                  <div className="text-xs text-purple-300">
                    <strong>Implementation:</strong> {feature.implementation}
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

// Grade Level Detailed Display
function GradeLevelDisplay() {
  const [selectedGrade, setSelectedGrade] = useState(gradeStructure[1]);

  return (
    <div className="space-y-6">
      {/* Grade Selector */}
      <div className="flex flex-wrap gap-2">
        {gradeStructure.map((grade, i) => (
          <Button
            key={i}
            size="sm"
            variant={selectedGrade.level === grade.level ? 'default' : 'outline'}
            onClick={() => setSelectedGrade(grade)}
            className={selectedGrade.level === grade.level ? 'bg-blue-600' : 'border-blue-500 text-blue-400'}
          >
            {grade.level}
          </Button>
        ))}
      </div>

      {/* Selected Grade Details */}
      <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <GraduationCap className="w-5 h-5" />
            {selectedGrade.level}: {selectedGrade.title}
          </CardTitle>
          <p className="text-gray-300">{selectedGrade.focus}</p>
          
          <div className="flex gap-4 mt-2">
            <Badge className="bg-purple-500">
              <Eye className="w-3 h-3 mr-1" />
              VR: {selectedGrade.vrTime}
            </Badge>
            <Badge className="bg-green-500">
              <TreePine className="w-3 h-3 mr-1" />
              Outdoor: {selectedGrade.outdoorTime}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="subjects">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="standards">Standards</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="subjects">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(selectedGrade.subjects).map(([subject, content]) => (
                  <div key={subject} className="space-y-2">
                    <h5 className="font-semibold text-white capitalize flex items-center gap-2">
                      {subject === 'mathematics' && <Calculator className="w-4 h-4" />}
                      {subject === 'languageArts' && <BookOpen className="w-4 h-4" />}
                      {subject === 'science' && <Microscope className="w-4 h-4" />}
                      {subject === 'socialStudies' && <Globe className="w-4 h-4" />}
                      {subject.replace(/([A-Z])/g, ' $1').trim()}
                    </h5>
                    <div className="bg-black/30 p-3 rounded border border-gray-600">
                      <ul className="space-y-1">
                        {content.map((item, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <Star className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="standards">
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(selectedGrade.standards).map(([country, standards]) => (
                  <div key={country} className="bg-black/30 p-4 rounded border border-gray-600">
                    <h6 className="font-semibold text-blue-400 mb-2 capitalize">{country} Standards:</h6>
                    <ul className="space-y-1">
                      {standards.map((standard, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                          <Award className="w-3 h-3 text-yellow-400" />
                          {standard}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="support">
              <div className="bg-black/30 p-4 rounded border border-green-500">
                <h6 className="font-semibold text-green-400 mb-3">Neurodivergent Support Features:</h6>
                <ul className="space-y-2">
                  {selectedGrade.neurodivergentSupport.map((support, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <Heart className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                      {support}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Global Campus Display
function GlobalCampusDisplay() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {globalCampuses.map((campus, i) => (
        <Card key={i} className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <MapPin className="w-5 h-5" />
              {campus.location}
            </CardTitle>
            <p className="text-gray-300">{campus.focus}</p>
            
            <div className="flex gap-2 mt-2">
              <Badge className="bg-blue-500">{campus.students} Students</Badge>
              <Badge className="bg-purple-500">{campus.languages.length} Languages</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h6 className="font-semibold text-cyan-400 mb-2">Special VR Sites:</h6>
                <ul className="space-y-1">
                  {campus.specialVRSites.map((site, j) => (
                    <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                      <Eye className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                      {site}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h6 className="font-semibold text-yellow-400 mb-2">Key Partnerships:</h6>
                <ul className="space-y-1">
                  {campus.partnerships.map((partner, j) => (
                    <li key={j} className="text-sm text-gray-300 flex items-center gap-2">
                      <Users className="w-3 h-3 text-yellow-400" />
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Compliance Matrix Display
function ComplianceDisplay() {
  return (
    <div className="space-y-6">
      {Object.entries(complianceMatrix).map(([country, compliance]) => (
        <Card key={country} className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Target className="w-5 h-5" />
              {country} Educational Compliance
            </CardTitle>
            <Badge className="bg-green-500 w-fit">{compliance.coverage}</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(compliance).filter(([key]) => key !== 'coverage').map(([category, items]) => (
                <div key={category} className="bg-black/30 p-3 rounded border border-gray-600">
                  <h6 className="font-semibold text-white mb-2 capitalize">{category}:</h6>
                  {Array.isArray(items) ? (
                    <ul className="space-y-1">
                      {items.map((item, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                          <Star className="w-3 h-3 text-orange-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(items).map(([subcat, subitems]) => (
                        <div key={subcat}>
                          <div className="text-sm font-medium text-orange-300 capitalize">{subcat}:</div>
                          <ul className="ml-2 space-y-1">
                            {subitems.map((subitem, i) => (
                              <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                                <Zap className="w-2 h-2 text-orange-400" />
                                {subitem}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main K-12 Program Page
export default function ComprehensiveK12ProgramPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Revolutionary K-12 Education Program
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Human-centered, interdisciplinary learning with 90-minute VR curriculum and outdoor integration
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <GraduationCap className="w-4 h-4 mr-2" />
              Complete K-12 Program
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Globe className="w-4 h-4 mr-2" />
              3 Global Campuses
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Zap className="w-4 h-4 mr-2" />
              15 Innovation Features
            </Badge>
            <Badge variant="outline" className="border-orange-500 text-orange-400">
              <Eye className="w-4 h-4 mr-2" />
              VR + Outdoor Integration
            </Badge>
          </div>
        </div>

        {/* Program Statistics */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">{programOverview.totalStudents}</div>
                <div className="text-green-300 text-sm">Total Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">{programOverview.successRate}%</div>
                <div className="text-blue-300 text-sm">Success Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-1">{programOverview.collegeAcceptance}%</div>
                <div className="text-purple-300 text-sm">College Accept</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400 mb-1">{programOverview.neurodivergentSupport}%</div>
                <div className="text-orange-300 text-sm">Neurodiv. Success</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">{programOverview.vrImplementation}%</div>
                <div className="text-cyan-300 text-sm">VR Integration</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">{programOverview.outdoorIntegration}%</div>
                <div className="text-green-300 text-sm">Outdoor Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="innovations">15 Features</TabsTrigger>
            <TabsTrigger value="grades">Grade Levels</TabsTrigger>
            <TabsTrigger value="campuses">Global Campuses</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-400">
                    <Lightbulb className="w-5 h-5" />
                    Revolutionary VR + Outdoor Approach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Our program transforms education by condensing complete curriculum into 90-minute VR experiences, 
                      leaving 6+ hours daily for outdoor exploration, physical activities, and family time.
                    </p>
                    
                    <div className="space-y-2">
                      <h5 className="font-semibold text-cyan-400">Core Innovation:</h5>
                      <ul className="space-y-1">
                        <li className="flex items-start gap-2 text-sm">
                          <Star className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                          <span className="text-gray-300">Human stories as foundation for all subjects</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Star className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                          <span className="text-gray-300">VR gaming accelerates learning by 650%</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Star className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                          <span className="text-gray-300">Global collaboration across 3 campuses</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Star className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                          <span className="text-gray-300">Neurodivergent adaptation for all learning types</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Clock className="w-5 h-5" />
                    Daily Schedule Revolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-black/30 p-3 rounded border border-purple-500/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Eye className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold text-white">VR Learning: 90 minutes</span>
                      </div>
                      <p className="text-sm text-gray-300">Complete curriculum through immersive historical gaming</p>
                    </div>
                    
                    <div className="bg-black/30 p-3 rounded border border-green-500/50">
                      <div className="flex items-center gap-3 mb-2">
                        <TreePine className="w-4 h-4 text-green-400" />
                        <span className="font-semibold text-white">Outdoor Time: 6+ hours</span>
                      </div>
                      <p className="text-sm text-gray-300">Physical activities, exploration, family time, passion pursuits</p>
                    </div>
                    
                    <div className="bg-black/30 p-3 rounded border border-blue-500/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-white">Family Integration</span>
                      </div>
                      <p className="text-sm text-gray-300">Parents participate in historical activities and cultural experiences</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="innovations">
            <InnovationFeaturesDisplay />
          </TabsContent>

          <TabsContent value="grades">
            <GradeLevelDisplay />
          </TabsContent>

          <TabsContent value="campuses">
            <GlobalCampusDisplay />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceDisplay />
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-400">Experience the Educational Revolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-300 text-lg">
                Join the transformation that condenses full curriculum into 90-minute VR experiences, 
                ensuring academic excellence while prioritizing outdoor exploration and family time.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = '/vr-education-experience'}
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Experience VR Learning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-green-500 text-green-400"
                  onClick={() => window.location.href = '/interactive-history-map'}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Explore History Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}