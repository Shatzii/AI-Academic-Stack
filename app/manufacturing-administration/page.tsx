'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Factory, Tablet, Globe, DollarSign, Truck,
  Settings, Users, CheckCircle, Star, Target,
  Package, ShoppingCart, BarChart, Clock,
  Shield, Award, Zap, Monitor, Camera
} from 'lucide-react';

// Custom Educational Tablet Specifications
const customTabletSpecs = {
  "Universal Learning Tablet Pro": {
    displaySpecs: {
      "Screen Size": "10.1-12 inch options",
      "Resolution": "2K (2560×1600) or 4K available",
      "Touch Response": "Multi-touch with palm rejection",
      "Brightness": "500+ nits for outdoor learning",
      "Eye Protection": "Blue light filter, flicker-free"
    },
    educationalFeatures: {
      "Stylus Support": "Pressure-sensitive for drawing and note-taking",
      "Parental Controls": "Built-in educational content filtering",
      "Offline Learning": "32GB+ local content storage",
      "Family Accounts": "Up to 6 user profiles with progress tracking",
      "Durability": "Drop-resistant case, reinforced corners"
    },
    techSpecs: {
      "Processor": "Octa-core ARM or equivalent",
      "RAM": "6-8GB for smooth multitasking",
      "Storage": "128GB+ with microSD expansion",
      "Battery": "12+ hour learning sessions",
      "Cameras": "Front + rear for AR learning experiences",
      "Audio": "Stereo speakers + headphone jack",
      "Connectivity": "WiFi 6, optional 4G/5G"
    },
    targetCost: "$120-180 manufacturing",
    targetPrice: "$299-499 retail",
    margin: "40-60% profit margin"
  }
};

// Asian Manufacturing Strategy
const manufacturingStrategy = {
  primaryRegions: [
    {
      region: "Shenzhen, China",
      advantages: ["Lowest cost", "Massive scale", "Component ecosystem", "Fast prototyping"],
      manufacturers: ["Foxconn", "BYD", "Huaqin", "Wingtech"],
      costStructure: "$100-140 per unit",
      moq: "1,000-5,000 units",
      leadTime: "45-60 days",
      qualityLevel: "High volume, good quality",
      icon: Factory,
      color: "blue"
    },
    {
      region: "Taiwan",
      advantages: ["Premium quality", "Advanced tech", "Reliable supply chain", "Innovation"],
      manufacturers: ["Quanta", "Compal", "Inventec", "Wistron"],
      costStructure: "$130-170 per unit", 
      moq: "500-2,000 units",
      leadTime: "60-75 days",
      qualityLevel: "Premium quality, advanced features",
      icon: Award,
      color: "purple"
    },
    {
      region: "South Korea",
      advantages: ["Cutting-edge displays", "Premium components", "Quality focus"],
      manufacturers: ["Samsung ODM", "LG Electronics"],
      costStructure: "$150-200 per unit",
      moq: "1,000-3,000 units", 
      leadTime: "75-90 days",
      qualityLevel: "Premium quality, latest technology",
      icon: Monitor,
      color: "green"
    },
    {
      region: "Vietnam/India",
      advantages: ["Lower labor costs", "Growing ecosystem", "Government incentives"],
      manufacturers: ["Foxconn Vietnam", "Samsung Vietnam", "Indian ODMs"],
      costStructure: "$110-150 per unit",
      moq: "2,000-10,000 units",
      leadTime: "60-90 days", 
      qualityLevel: "Good quality, cost-focused",
      icon: Globe,
      color: "orange"
    }
  ],
  recommendedApproach: {
    phase1: "Start with Shenzhen for cost and speed (1,000-5,000 units)",
    phase2: "Scale with Vietnam/India for volume (10,000+ units)",
    phase3: "Premium variant in Taiwan for advanced features",
    timeline: "6 months prototype → 3 months production → ongoing manufacturing"
  }
};

// Administration and Business Operations
const administrationPlan = {
  manufacturing: {
    "Product Development": [
      "Custom tablet specification and design",
      "Educational software optimization", 
      "Quality testing and certification",
      "Regulatory compliance (FCC, CE, RoHS)"
    ],
    "Supply Chain Management": [
      "Manufacturer selection and contracts",
      "Component sourcing and inventory",
      "Quality control and inspections",
      "Logistics and shipping coordination"
    ],
    "Operations": [
      "Order management and fulfillment",
      "Customer support and warranties",
      "Returns and repair services",
      "Inventory management and forecasting"
    ]
  },
  business: {
    "Financial Planning": [
      "Manufacturing cost budgeting",
      "Pricing strategy optimization",
      "Cash flow management for inventory",
      "Revenue projections and scaling"
    ],
    "Legal and Compliance": [
      "Manufacturing agreements",
      "Intellectual property protection", 
      "Product liability insurance",
      "International trade compliance"
    ],
    "Marketing and Sales": [
      "Product positioning and branding",
      "Channel partner relationships",
      "Direct-to-consumer sales platform",
      "Educational market penetration strategy"
    ]
  }
};

// Cost Analysis and Projections
const costAnalysis = {
  manufacturingCosts: {
    "Components": "$80-120 (display, processor, memory, etc.)",
    "Assembly": "$15-25 (labor and overhead)",
    "Packaging": "$3-5 (box, accessories, documentation)",
    "Quality Control": "$2-5 (testing and certification)",
    "Shipping": "$8-15 (factory to warehouse)",
    "Total Manufacturing": "$108-170 per unit"
  },
  businessCosts: {
    "R&D and Design": "$50,000-100,000 one-time",
    "Tooling and Setup": "$25,000-50,000 one-time", 
    "Certification": "$15,000-30,000 one-time",
    "Initial Inventory": "$200,000-500,000 (2,000-5,000 units)",
    "Working Capital": "$100,000-300,000 ongoing"
  },
  revenueProjections: {
    "Year 1": "2,000 units × $399 = $798,000 revenue",
    "Year 2": "10,000 units × $349 = $3,490,000 revenue",
    "Year 3": "25,000 units × $299 = $7,475,000 revenue",
    "Profit Margins": "40-60% gross margin, 25-35% net margin"
  }
};

// Quality and Feature Differentiation
const productDifferentiation = {
  educationalOptimizations: [
    {
      feature: "Learning-Optimized Display",
      description: "Eye-safe blue light filtering, anti-glare coating, adjustable color temperature",
      benefit: "Reduces eye strain during long learning sessions",
      cost: "+$8-12 per unit"
    },
    {
      feature: "Educational Software Suite",
      description: "Pre-installed learning apps, parental controls, progress tracking",
      benefit: "Ready-to-use educational experience out of the box",
      cost: "+$5-10 per unit in licensing"
    },
    {
      feature: "Rugged Educational Design",
      description: "Drop-resistant corners, spill-resistant keyboard, reinforced screen",
      benefit: "Survives typical classroom and home use",
      cost: "+$10-15 per unit"
    },
    {
      feature: "Family Learning Features",
      description: "Multi-user profiles, collaborative apps, family dashboard",
      benefit: "Enables whole family participation in learning",
      cost: "+$3-5 per unit in software"
    },
    {
      feature: "Offline Learning Capability",
      description: "Large local storage, downloadable content, offline mode",
      benefit: "Learning continues without internet connectivity",
      cost: "+$5-8 per unit for extra storage"
    }
  ]
};

// Manufacturing Strategy Display
function ManufacturingStrategyDisplay() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Factory className="w-5 h-5" />
            Custom Tablet Manufacturing Strategy
          </CardTitle>
          <p className="text-gray-300">Build our own educational tablets with Asian manufacturers for optimal cost and quality</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {manufacturingStrategy.primaryRegions.map((region, i) => {
              const IconComponent = region.icon;
              const isSelected = selectedRegion === region.region;
              
              return (
                <Card 
                  key={i}
                  className={`bg-gradient-to-br from-${region.color}-500/20 to-${region.color}-600/20 border-${region.color}-500 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-white/50' : ''
                  }`}
                  onClick={() => setSelectedRegion(isSelected ? null : region.region)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-8 h-8 text-${region.color}-400`} />
                        <div>
                          <CardTitle className={`text-${region.color}-400`}>{region.region}</CardTitle>
                          <p className="text-gray-400 text-sm">{region.qualityLevel}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">{region.costStructure}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-400">MOQ:</span>
                        <span className="text-white">{region.moq}</span>
                        <span className="text-gray-400">Lead Time:</span>
                        <span className="text-white">{region.leadTime}</span>
                      </div>
                      
                      <div>
                        <h6 className="font-semibold text-blue-400 mb-2">Key Advantages:</h6>
                        <ul className="space-y-1">
                          {region.advantages.slice(0, 2).map((advantage, j) => (
                            <li key={j} className="text-sm text-gray-300 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {isSelected && (
                        <div className="mt-4 space-y-3 border-t border-gray-600 pt-4">
                          <div>
                            <h6 className="font-semibold text-purple-400 mb-2">All Advantages:</h6>
                            <ul className="space-y-1">
                              {region.advantages.map((advantage, j) => (
                                <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                                  <Star className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                                  {advantage}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h6 className="font-semibold text-orange-400 mb-2">Recommended Manufacturers:</h6>
                            <div className="flex flex-wrap gap-1">
                              {region.manufacturers.map((manufacturer, j) => (
                                <Badge key={j} variant="outline" className="text-xs border-orange-500 text-orange-300">
                                  {manufacturer}
                                </Badge>
                              ))}
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
          
          <div className="mt-6 bg-black/30 p-4 rounded-lg border border-green-500/50">
            <h5 className="font-semibold text-green-400 mb-3">Recommended 3-Phase Approach:</h5>
            <div className="space-y-2 text-sm text-gray-300">
              <div><strong>Phase 1:</strong> {manufacturingStrategy.recommendedApproach.phase1}</div>
              <div><strong>Phase 2:</strong> {manufacturingStrategy.recommendedApproach.phase2}</div>
              <div><strong>Phase 3:</strong> {manufacturingStrategy.recommendedApproach.phase3}</div>
              <div className="pt-2 border-t border-gray-600">
                <strong>Timeline:</strong> {manufacturingStrategy.recommendedApproach.timeline}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Product Specifications Display
function ProductSpecsDisplay() {
  const tablet = customTabletSpecs["Universal Learning Tablet Pro"];
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Tablet className="w-5 h-5" />
            Universal Learning Tablet Pro Specifications
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-blue-500">{tablet.targetCost}</Badge>
            <Badge className="bg-green-500">{tablet.targetPrice}</Badge>
            <Badge className="bg-purple-500">{tablet.margin}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold text-blue-400 mb-3">Display Specifications</h5>
              <div className="space-y-2">
                {Object.entries(tablet.displaySpecs).map(([spec, value]) => (
                  <div key={spec} className="bg-black/30 p-2 rounded border border-gray-600">
                    <div className="text-sm font-semibold text-white">{spec}</div>
                    <div className="text-xs text-gray-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-green-400 mb-3">Educational Features</h5>
              <div className="space-y-2">
                {Object.entries(tablet.educationalFeatures).map(([feature, description]) => (
                  <div key={feature} className="bg-black/30 p-2 rounded border border-gray-600">
                    <div className="text-sm font-semibold text-white">{feature}</div>
                    <div className="text-xs text-gray-300">{description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-purple-400 mb-3">Technical Specifications</h5>
              <div className="space-y-2">
                {Object.entries(tablet.techSpecs).map(([spec, value]) => (
                  <div key={spec} className="bg-black/30 p-2 rounded border border-gray-600">
                    <div className="text-sm font-semibold text-white">{spec}</div>
                    <div className="text-xs text-gray-300">{value}</div>
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

// Administration Plan Display
function AdministrationPlanDisplay() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Object.entries(administrationPlan).map(([category, sections]) => (
        <Card key={category} className={`bg-gradient-to-br from-${category === 'manufacturing' ? 'orange' : 'cyan'}-500/20 to-${category === 'manufacturing' ? 'red' : 'blue'}-500/20 border-${category === 'manufacturing' ? 'orange' : 'cyan'}-500`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 text-${category === 'manufacturing' ? 'orange' : 'cyan'}-400`}>
              {category === 'manufacturing' ? <Factory className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              {category.charAt(0).toUpperCase() + category.slice(1)} Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(sections).map(([section, tasks]) => (
                <div key={section}>
                  <h6 className="font-semibold text-white mb-2">{section}</h6>
                  <ul className="space-y-1">
                    {tasks.map((task, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Cost Analysis Display
function CostAnalysisDisplay() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(costAnalysis).map(([category, costs]) => (
          <Card key={category} className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500">
            <CardHeader>
              <CardTitle className={`text-yellow-400 text-lg`}>
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(costs).map(([item, cost]) => (
                  <div key={item} className="flex justify-between items-center p-2 bg-black/30 rounded border border-gray-600">
                    <span className="text-sm text-gray-300">{item}:</span>
                    <span className="text-sm text-white font-semibold">{cost}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Product Differentiation Display
function ProductDifferentiationDisplay() {
  return (
    <div className="space-y-4">
      {productDifferentiation.educationalOptimizations.map((feature, i) => (
        <Card key={i} className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-400">{feature.feature}</CardTitle>
              <Badge className="bg-green-500">{feature.cost}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">{feature.description}</p>
              <div className="bg-black/30 p-3 rounded border border-green-500/30">
                <h6 className="font-semibold text-green-400 mb-1">Educational Benefit:</h6>
                <p className="text-sm text-gray-300">{feature.benefit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main Page
export default function ManufacturingAdministrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Custom Tablet Manufacturing & Administration
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Complete strategy for manufacturing our own educational tablets with Asian partners
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-orange-500 text-orange-400">
              <Factory className="w-4 h-4 mr-2" />
              Asian Manufacturing
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <DollarSign className="w-4 h-4 mr-2" />
              $108-170 Manufacturing Cost
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Target className="w-4 h-4 mr-2" />
              40-60% Profit Margin
            </Badge>
          </div>
        </div>

        {/* Business Case Overview */}
        <Card className="mb-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-400">Custom Educational Tablet Strategy</h3>
              <p className="text-gray-300 max-w-4xl mx-auto">
                Build our own educational tablets optimized for learning with Asian manufacturers. 
                Target $108-170 manufacturing cost, $299-499 retail price, achieving 40-60% profit margins 
                while providing superior educational features compared to generic tablets.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4 mt-6">
                <div className="bg-black/30 p-4 rounded-lg border border-orange-500/30">
                  <div className="text-2xl font-bold text-orange-400 mb-2">$150</div>
                  <div className="text-orange-300">Target Manufacturing</div>
                  <div className="text-sm text-gray-400">All-in cost per unit</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-green-500/30">
                  <div className="text-2xl font-bold text-green-400 mb-2">$399</div>
                  <div className="text-green-300">Retail Price</div>
                  <div className="text-sm text-gray-400">Premium educational features</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400 mb-2">60%</div>
                  <div className="text-blue-300">Gross Margin</div>
                  <div className="text-sm text-gray-400">Strong profitability</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-purple-500/30">
                  <div className="text-2xl font-bold text-purple-400 mb-2">$7.5M</div>
                  <div className="text-purple-300">Year 3 Revenue</div>
                  <div className="text-sm text-gray-400">25,000 units projected</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="manufacturing">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
            <TabsTrigger value="specs">Product Specs</TabsTrigger>
            <TabsTrigger value="administration">Administration</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="differentiation">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="manufacturing">
            <ManufacturingStrategyDisplay />
          </TabsContent>

          <TabsContent value="specs">
            <ProductSpecsDisplay />
          </TabsContent>

          <TabsContent value="administration">
            <AdministrationPlanDisplay />
          </TabsContent>

          <TabsContent value="costs">
            <CostAnalysisDisplay />
          </TabsContent>

          <TabsContent value="differentiation">
            <ProductDifferentiationDisplay />
          </TabsContent>
        </Tabs>

        {/* Implementation Timeline */}
        <Card className="mt-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500">
          <CardHeader>
            <CardTitle className="text-cyan-400">Implementation Timeline & Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/30 p-4 rounded-lg border border-green-500/30">
                  <h5 className="font-semibold text-green-400 mb-2">Months 1-3: Development</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Finalize tablet specifications</li>
                    <li>• Select manufacturing partner</li>
                    <li>• Create prototypes and testing</li>
                    <li>• Regulatory compliance planning</li>
                  </ul>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg border border-blue-500/30">
                  <h5 className="font-semibold text-blue-400 mb-2">Months 4-6: Production</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Tooling and production setup</li>
                    <li>• First production run (1,000-2,000 units)</li>
                    <li>• Quality control and testing</li>
                    <li>• Sales and marketing preparation</li>
                  </ul>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg border border-purple-500/30">
                  <h5 className="font-semibold text-purple-400 mb-2">Months 7+: Scale</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Launch to market</li>
                    <li>• Scale production based on demand</li>
                    <li>• Continuous improvement and optimization</li>
                    <li>• Expand to international markets</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-yellow-500/50">
                <h5 className="font-semibold text-yellow-400 mb-2">Immediate Action Items:</h5>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <strong>Technical:</strong>
                    <ul className="ml-4 mt-1">
                      <li>• Contact Shenzhen manufacturers for quotes</li>
                      <li>• Develop detailed technical specifications</li>
                      <li>• Plan certification requirements</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Business:</strong>
                    <ul className="ml-4 mt-1">
                      <li>• Secure initial manufacturing capital</li>
                      <li>• Set up supply chain operations</li>
                      <li>• Plan sales and distribution channels</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => window.location.href = '/self-hosted-device-ecosystem'}
                >
                  <Factory className="w-5 h-5 mr-2" />
                  View Device Ecosystem
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-green-500 text-green-400"
                  onClick={() => window.location.href = '/multi-device-learning'}
                >
                  <Tablet className="w-5 h-5 mr-2" />
                  See Learning Experience
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}