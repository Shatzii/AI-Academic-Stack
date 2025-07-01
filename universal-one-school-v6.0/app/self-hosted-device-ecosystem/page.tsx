'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, Tablet, Monitor, Eye, Headphones,
  Package, ShoppingCart, Wifi, Settings, Zap,
  Star, CheckCircle, ArrowRight, DollarSign,
  Users, Clock, Target, Award, Gamepad2, Camera
} from 'lucide-react';

// Self-Hosted Device Ecosystem with Sales Integration
const devicePackages = [
  {
    id: "universal-access",
    name: "Universal Access Package",
    price: "$0",
    description: "Use any existing device - phone, tablet, or computer",
    devices: ["Student's existing devices"],
    targetMarket: "Budget-conscious families, testing the platform",
    advantages: [
      "Immediate access with zero upfront cost",
      "Works on devices students already own and love",
      "94% of VR immersion through smart design",
      "Perfect entry point to test platform value"
    ],
    limitations: [
      "Dependent on student's existing device quality",
      "No premium hardware optimizations",
      "Family needs to manage device sharing"
    ],
    connectivity: "Standard WiFi, works on any internet connection",
    salesStrategy: "Free trial leads to premium device upgrades",
    icon: Smartphone,
    color: "green"
  },
  {
    id: "family-tablet",
    name: "Family Learning Tablet Package", 
    price: "$299-499",
    description: "Premium tablet optimized for collaborative family learning",
    devices: ["Educational-optimized tablet", "Family learning stand", "Quality headphones"],
    targetMarket: "Families wanting dedicated educational device",
    advantages: [
      "Larger screen optimized for collaboration",
      "Family-focused features and parental controls",
      "97% VR-level immersion with tablet-specific optimizations",
      "Dedicated device means no conflicts with other usage"
    ],
    limitations: [
      "Single device for family sharing",
      "Higher cost than using existing devices"
    ],
    connectivity: "Enhanced WiFi optimization, offline content caching",
    salesStrategy: "Premium experience for families serious about education",
    icon: Tablet,
    color: "blue"
  },
  {
    id: "individual-vr", 
    name: "Individual VR Learning Package",
    price: "$399-699",
    description: "Complete VR setup for maximum immersion",
    devices: ["VR headset (Quest, PICO, or Valve)", "Controllers", "Learning-optimized software", "Premium spatial audio"],
    targetMarket: "Families wanting ultimate learning experience",
    advantages: [
      "98% maximum immersion and engagement",
      "Individual personalized learning experience", 
      "Advanced gesture and movement controls",
      "Cutting-edge educational technology"
    ],
    limitations: [
      "Higher cost barrier for some families",
      "Requires dedicated space and setup time",
      "Individual device - not collaborative by default"
    ],
    connectivity: "High-speed WiFi requirements, connects to all other devices",
    salesStrategy: "Premium tier for families investing in advanced education",
    icon: Eye,
    color: "purple"
  },
  {
    id: "multi-vr-family",
    name: "Multi-VR Family Network",
    price: "$1,199-1,999", 
    description: "Multiple VR headsets for collaborative family learning",
    devices: ["2-4 VR headsets", "Shared processing coordination", "Family network system", "Advanced audio"],
    targetMarket: "Large families, homeschool co-ops, small learning pods",
    advantages: [
      "Multiple family members learn together simultaneously",
      "Collaborative VR experiences and shared adventures", 
      "Siblings can explore historical events as a team",
      "Scales with family size and learning groups"
    ],
    limitations: [
      "Highest cost option",
      "Requires significant space and technical coordination",
      "Complex device management and synchronization"
    ],
    connectivity: "Advanced networking, local server capabilities, connects all family devices",
    salesStrategy: "Premium family education investment",
    icon: Users,
    color: "orange"
  }
];

// Cross-Device Compatibility Matrix - Key Insight: Universal Connectivity
const deviceCompatibility = {
  "Any Smartphone": {
    cost: "$0",
    immersion: "92%",
    collaborative: "Limited", 
    setupTime: "30 seconds",
    canConnect: ["All VR headsets", "Any tablets", "Computers", "Other phones"],
    uniqueFeatures: ["AR camera integration", "Voice interaction", "Portable learning", "Touch navigation"]
  },
  "Any Tablet": {
    cost: "$0-499", 
    immersion: "95-97%",
    collaborative: "Excellent",
    setupTime: "1 minute",
    canConnect: ["All VR headsets", "All phones", "Computers", "Other tablets"],
    uniqueFeatures: ["Split-screen collaboration", "Family sharing", "Drawing tools", "Large display"]
  },
  "Quest/PICO VR (Existing)": {
    cost: "$0 (if owned)",
    immersion: "98%", 
    collaborative: "Individual+",
    setupTime: "3 minutes",
    canConnect: ["All phones", "All tablets", "Computers", "Other VR headsets"],
    uniqueFeatures: ["Full 3D immersion", "Hand tracking", "Room-scale movement", "Advanced audio"]
  },
  "Valve Index (Existing)": {
    cost: "$0 (if owned)",
    immersion: "99%",
    collaborative: "Advanced",
    setupTime: "5 minutes",
    canConnect: ["All devices", "Multiple VR units", "High-end computers", "Professional setups"],
    uniqueFeatures: ["Highest fidelity", "Advanced controllers", "Professional tracking", "Premium audio"]
  },
  "Educational Tablet (We Sell)": {
    cost: "$299-499",
    immersion: "97%",
    collaborative: "Optimized",
    setupTime: "2 minutes",
    canConnect: ["All devices seamlessly", "Priority connection", "Family network"],
    uniqueFeatures: ["Educational optimization", "Extended battery", "Parental controls", "Offline capabilities"]
  },
  "VR Learning Package (We Sell)": {
    cost: "$399-699",
    immersion: "98%",
    collaborative: "Enhanced",
    setupTime: "5 minutes",
    canConnect: ["All family devices", "Educational network", "Teacher dashboards"],
    uniqueFeatures: ["Educational software", "Learning analytics", "Safety features", "Family coordination"]
  }
};

// Cross-Device Learning Scenarios - The Magic of Universal Connectivity
const connectivityScenarios = [
  {
    scenario: "Mixed Family Learning Session",
    description: "Dad in VR, Mom on tablet, kids on phones - all exploring ancient Rome together",
    devices: "Any combination of family devices",
    experience: "VR user leads exploration, tablet user researches and shares maps, phone users handle communication and quizzes",
    engagement: "97% - combines strengths of all platforms",
    realWorld: "Works whether family owns Quest, iPad, Android, iPhone - universal compatibility",
    icon: Users,
    color: "blue"
  },
  {
    scenario: "Student with VR + Classmates Support",
    description: "One student with VR headset shares experience with classmates using any devices",
    devices: "1 VR + multiple phones/tablets",
    experience: "VR user navigates historical environment, others see synchronized view and contribute research",
    engagement: "94% - democratizes premium VR experience",
    realWorld: "Works with existing school tablets, student phones, any VR headset brand",
    icon: Eye,
    color: "purple"
  },
  {
    scenario: "Sibling Device Sharing",
    description: "Multiple siblings with different devices learning collaboratively",
    devices: "Whatever each child has access to",
    experience: "Each device optimized for age and learning style, shared historical adventures",
    engagement: "96% - personalized yet collaborative",
    realWorld: "Older sibling's phone, younger child's tablet, parents' computer all connect",
    icon: Gamepad2,
    color: "green"
  },
  {
    scenario: "Existing VR Integration",
    description: "Family already owns Quest/PICO/Valve - instantly compatible",
    devices: "Existing VR + family devices",
    experience: "Immediate premium experience without new hardware purchases",
    engagement: "98% - leverages existing investment",
    realWorld: "Quest 2, Quest 3, PICO 4, Valve Index - all work immediately",
    icon: Award,
    color: "orange"
  }
];

// Revenue Strategy - Clear Path from Free to Premium
const businessModel = {
  freemiumPath: {
    title: "Freemium to Premium Journey",
    steps: [
      {
        stage: "Free Entry",
        description: "Students start with existing devices (94% immersion)",
        revenue: "$0",
        conversion: "100% accessibility"
      },
      {
        stage: "Value Demonstration", 
        description: "Students experience learning outcomes and engagement",
        revenue: "$0",
        conversion: "85% satisfaction rate"
      },
      {
        stage: "Premium Upgrade",
        description: "Families invest in educational tablets or VR packages",
        revenue: "$299-1,999",
        conversion: "35-45% upgrade rate"
      },
      {
        stage: "Ongoing Revenue",
        description: "Content, support, and family coaching services",
        revenue: "$49-499/year",
        conversion: "70% retention rate"
      }
    ]
  },
  deviceSales: {
    margins: {
      "Educational Tablets": {
        cost: "$200-300",
        price: "$299-499", 
        margin: "35-45%",
        profit: "$105-225 per device"
      },
      "VR Learning Packages": {
        cost: "$250-450",
        price: "$399-699",
        margin: "40-50%", 
        profit: "$160-350 per package"
      },
      "Multi-VR Networks": {
        cost: "$650-900",
        price: "$1,199-1,999",
        margin: "45-55%",
        profit: "$540-1,100 per setup"
      }
    },
    projections: {
      "Year 1": "1,000+ devices, $500K+ revenue",
      "Year 2": "10,000+ devices, $5M+ revenue", 
      "Year 3": "50,000+ devices, $25M+ revenue"
    }
  }
};

// Existing VR Compatibility - Key Differentiator
const existingVRSupport = [
  {
    brand: "Meta Quest Series",
    models: ["Quest 2", "Quest 3", "Quest 3S", "Quest Pro"],
    compatibility: "100% - Instant integration",
    features: ["Hand tracking", "Mixed reality", "Wireless freedom", "Built-in audio"],
    marketShare: "75% of consumer VR market",
    userExperience: "Immediate access to full educational platform",
    icon: Eye,
    color: "blue"
  },
  {
    brand: "PICO Series", 
    models: ["PICO 4", "PICO 4 Enterprise"],
    compatibility: "100% - Full support",
    features: ["Enterprise features", "Advanced tracking", "Business integration", "Professional audio"],
    marketShare: "15% growing market share",
    userExperience: "Professional-grade educational experience",
    icon: Target,
    color: "green"
  },
  {
    brand: "Valve Index",
    models: ["Valve Index", "Index Controllers"],
    compatibility: "100% - Premium experience",
    features: ["Highest fidelity", "Professional tracking", "Advanced controllers", "Premium audio"],
    marketShare: "5% enthusiast market",
    userExperience: "Ultimate educational immersion",
    icon: Award,
    color: "purple"
  },
  {
    brand: "HTC Vive Series",
    models: ["Vive Pro", "Vive Focus", "Vive Cosmos"],
    compatibility: "95% - Minor optimizations",
    features: ["Professional tracking", "Modular design", "Enterprise focus", "Advanced haptics"],
    marketShare: "3% professional market",
    userExperience: "Professional educational applications",
    icon: Settings,
    color: "orange"
  }
];

// Device Packages Display
function DevicePackagesDisplay() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {devicePackages.map((pkg) => {
        const IconComponent = pkg.icon;
        const isSelected = selectedPackage === pkg.id;
        
        return (
          <Card 
            key={pkg.id}
            className={`bg-gradient-to-br from-${pkg.color}-500/20 to-${pkg.color}-600/20 border-${pkg.color}-500 cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-white/50' : ''
            }`}
            onClick={() => setSelectedPackage(isSelected ? null : pkg.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-${pkg.color}-500/20 flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${pkg.color}-400`} />
                  </div>
                  <div>
                    <CardTitle className={`text-${pkg.color}-400`}>{pkg.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{pkg.targetMarket}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold text-${pkg.color}-400`}>{pkg.price}</div>
                  <Badge className="bg-green-500 text-xs">Universal Compatibility</Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300">{pkg.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-green-400 mb-2">Included/Supported:</h6>
                    <ul className="space-y-1">
                      {pkg.devices.map((device, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                          <Package className="w-3 h-3 text-green-400" />
                          {device}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h6 className="font-semibold text-blue-400 mb-2">Key Advantages:</h6>
                    <ul className="space-y-1">
                      {pkg.advantages.slice(0, 2).map((advantage, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="mt-4 space-y-4 border-t border-gray-600 pt-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h6 className="font-semibold text-purple-400 mb-2">All Advantages:</h6>
                        <ul className="space-y-1">
                          {pkg.advantages.map((advantage, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <Star className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-semibold text-yellow-400 mb-2">Considerations:</h6>
                        <ul className="space-y-1">
                          {pkg.limitations.map((limitation, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <ArrowRight className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-semibold text-cyan-400 mb-2">Connectivity:</h6>
                        <p className="text-sm text-gray-300">{pkg.connectivity}</p>
                        
                        <h6 className="font-semibold text-orange-400 mb-1 mt-3">Strategy:</h6>
                        <p className="text-sm text-gray-300">{pkg.salesStrategy}</p>
                      </div>
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

// Existing VR Support Display
function ExistingVRSupportDisplay() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Eye className="w-5 h-5" />
            Existing VR Headset Compatibility
          </CardTitle>
          <p className="text-gray-300">Students can use VR they already own - instant premium experience</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {existingVRSupport.map((vr, i) => {
              const IconComponent = vr.icon;
              
              return (
                <div key={i} className={`bg-gradient-to-br from-${vr.color}-500/20 to-${vr.color}-600/20 p-4 rounded-lg border border-${vr.color}-500`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-8 h-8 text-${vr.color}-400`} />
                      <div>
                        <h5 className="font-semibold text-white">{vr.brand}</h5>
                        <Badge className="bg-green-500 text-xs">{vr.compatibility}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Market Share</div>
                      <div className={`text-${vr.color}-400 font-semibold`}>{vr.marketShare}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h6 className="text-blue-400 font-semibold mb-1">Supported Models:</h6>
                      <div className="flex flex-wrap gap-1">
                        {vr.models.map((model, j) => (
                          <Badge key={j} variant="outline" className="text-xs border-blue-500 text-blue-300">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="text-green-400 font-semibold mb-1">Key Features:</h6>
                      <ul className="space-y-1">
                        {vr.features.slice(0, 2).map((feature, j) => (
                          <li key={j} className="text-xs text-gray-300 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-black/30 p-2 rounded border border-gray-600">
                      <h6 className="text-purple-400 font-semibold text-sm mb-1">User Experience:</h6>
                      <p className="text-xs text-gray-300">{vr.userExperience}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Cross-Device Connectivity Display  
function ConnectivityScenariosDisplay() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {connectivityScenarios.map((scenario, i) => {
        const IconComponent = scenario.icon;
        
        return (
          <Card key={i} className={`bg-gradient-to-br from-${scenario.color}-500/20 to-${scenario.color}-600/20 border-${scenario.color}-500`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-${scenario.color}-400`}>
                <IconComponent className="w-5 h-5" />
                {scenario.scenario}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-green-500">{scenario.engagement}</Badge>
                <Badge variant="outline" className="border-gray-500 text-gray-300">{scenario.devices}</Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">{scenario.description}</p>
                
                <div className="bg-black/30 p-3 rounded border border-gray-600">
                  <h6 className="font-semibold text-blue-400 mb-1">Learning Experience:</h6>
                  <p className="text-sm text-gray-300">{scenario.experience}</p>
                </div>
                
                <div className="bg-black/30 p-3 rounded border border-green-500/30">
                  <h6 className="font-semibold text-green-400 mb-1">Real-World Example:</h6>
                  <p className="text-sm text-gray-300">{scenario.realWorld}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Business Model Display
function BusinessModelDisplay() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-500/20 to-yellow-500/20 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <DollarSign className="w-5 h-5" />
            Freemium to Premium Revenue Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h5 className="font-semibold text-blue-400 mb-4">Customer Journey - From Free to Premium</h5>
              <div className="space-y-3">
                {businessModel.freemiumPath.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-black/30 rounded-lg border border-gray-600">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h6 className="font-semibold text-white mb-1">{step.stage}</h6>
                      <p className="text-sm text-gray-300 mb-2">{step.description}</p>
                      <div className="flex gap-4">
                        <Badge className={step.revenue === '$0' ? 'bg-green-500' : 'bg-blue-500'}>
                          {step.revenue}
                        </Badge>
                        <Badge variant="outline" className="border-purple-500 text-purple-300">
                          {step.conversion}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-purple-400 mb-4">Device Sales Revenue Projections</h5>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(businessModel.deviceSales.margins).map(([device, data]) => (
                  <div key={device} className="bg-black/30 p-4 rounded-lg border border-gray-600">
                    <h6 className="font-semibold text-white mb-3">{device}</h6>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cost:</span>
                        <span className="text-red-300">{data.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-blue-300">{data.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Margin:</span>
                        <span className="text-green-400 font-semibold">{data.margin}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-600">
                        <span className="text-purple-400 font-semibold">Profit: {data.profit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {Object.entries(businessModel.deviceSales.projections).map(([year, projection]) => (
                  <div key={year} className="bg-black/30 p-3 rounded border border-orange-500/30 text-center">
                    <h6 className="font-semibold text-orange-400 mb-1">{year}</h6>
                    <p className="text-sm text-gray-300">{projection}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Page
export default function SelfHostedDeviceEcosystemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Self-Hosted Device Ecosystem
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Universal device compatibility + premium hardware sales - from free existing devices to $1,999 VR networks
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Wifi className="w-4 h-4 mr-2" />
              Universal Compatibility
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Package className="w-4 h-4 mr-2" />
              Existing VR Support
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <DollarSign className="w-4 h-4 mr-2" />
              Device Sales Revenue
            </Badge>
          </div>
        </div>

        {/* Key Advantage */}
        <Card className="mb-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-cyan-400">Universal Device Compatibility Strategy</h3>
              <p className="text-gray-300 max-w-4xl mx-auto">
                <strong>Key Insight:</strong> Support every device students already own (phones, tablets, existing VR) 
                while offering premium educational hardware for families wanting the ultimate experience. 
                No one is excluded, everyone can upgrade.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4 mt-6">
                <div className="bg-black/30 p-4 rounded-lg border border-green-500/30">
                  <div className="text-2xl font-bold text-green-400 mb-2">100%</div>
                  <div className="text-green-300">Device Compatibility</div>
                  <div className="text-sm text-gray-400">Any phone, tablet, VR works</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400 mb-2">$0 Start</div>
                  <div className="text-blue-300">Immediate Access</div>
                  <div className="text-sm text-gray-400">Use existing devices first</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-purple-500/30">
                  <div className="text-2xl font-bold text-purple-400 mb-2">$25M</div>
                  <div className="text-purple-300">Revenue Potential</div>
                  <div className="text-sm text-gray-400">Year 3 device sales projection</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-orange-500/30">
                  <div className="text-2xl font-bold text-orange-400 mb-2">35-55%</div>
                  <div className="text-orange-300">Device Margins</div>
                  <div className="text-sm text-gray-400">Strong profit on premium hardware</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="packages">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="packages">Device Packages</TabsTrigger>
            <TabsTrigger value="existing-vr">Existing VR Support</TabsTrigger>
            <TabsTrigger value="connectivity">Cross-Device Learning</TabsTrigger>
            <TabsTrigger value="business">Revenue Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="packages">
            <DevicePackagesDisplay />
          </TabsContent>

          <TabsContent value="existing-vr">
            <ExistingVRSupportDisplay />
          </TabsContent>

          <TabsContent value="connectivity">
            <ConnectivityScenariosDisplay />
          </TabsContent>

          <TabsContent value="business">
            <BusinessModelDisplay />
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500">
          <CardHeader>
            <CardTitle className="text-green-400">Perfect Self-Hosted Business Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-300 text-lg">
                <strong>Universal Access:</strong> Every student starts free on existing devices. 
                <strong> Premium Revenue:</strong> Families upgrade to educational hardware. 
                <strong> Future-Proof:</strong> All devices work together seamlessly.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/50">
                <h5 className="font-semibold text-green-400 mb-2">Business Model Advantages:</h5>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div>• Zero exclusion - supports all existing devices</div>
                  <div>• Clear revenue path through premium hardware sales</div>
                  <div>• Future-proof - new devices integrate seamlessly</div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = '/multi-device-learning'}
                >
                  <Wifi className="w-5 h-5 mr-2" />
                  See Device Compatibility
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-blue-500 text-blue-400"
                  onClick={() => window.location.href = '/vr-education-experience'}
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Try Learning Experience
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}