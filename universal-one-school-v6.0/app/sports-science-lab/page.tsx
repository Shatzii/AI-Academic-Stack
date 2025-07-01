'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, Brain, Zap, Target, TrendingUp, AlertCircle,
  Timer, Heart, Thermometer, Droplets, Battery, Cpu
} from 'lucide-react';

// Real-time Biomechanical Analysis
function BiomechanicalAnalyzer() {
  const [analysis, setAnalysis] = useState({
    movementEfficiency: 0,
    forceProduction: 0,
    velocityOutput: 0,
    powerIndex: 0,
    asymmetryScore: 0,
    injuryRisk: 0
  });

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setAnalysis({
          movementEfficiency: 85 + Math.random() * 15,
          forceProduction: 70 + Math.random() * 30,
          velocityOutput: 75 + Math.random() * 25,
          powerIndex: 80 + Math.random() * 20,
          asymmetryScore: Math.random() * 20,
          injuryRisk: Math.random() * 30
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 15000); // 15 second scan
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          Biomechanical Motion Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={startScan}
            disabled={isScanning}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isScanning ? 'Scanning...' : 'Start Motion Capture'}
          </Button>

          {(isScanning || analysis.movementEfficiency > 0) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Movement Efficiency</span>
                    <span className="text-blue-400">{Math.round(analysis.movementEfficiency)}%</span>
                  </div>
                  <Progress value={analysis.movementEfficiency} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Force Production</span>
                    <span className="text-green-400">{Math.round(analysis.forceProduction)}%</span>
                  </div>
                  <Progress value={analysis.forceProduction} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Velocity Output</span>
                    <span className="text-yellow-400">{Math.round(analysis.velocityOutput)}%</span>
                  </div>
                  <Progress value={analysis.velocityOutput} className="h-2" />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Power Index</span>
                    <span className="text-purple-400">{Math.round(analysis.powerIndex)}%</span>
                  </div>
                  <Progress value={analysis.powerIndex} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Asymmetry Score</span>
                    <span className="text-orange-400">{Math.round(analysis.asymmetryScore)}%</span>
                  </div>
                  <Progress value={analysis.asymmetryScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Injury Risk</span>
                    <span className="text-red-400">{Math.round(analysis.injuryRisk)}%</span>
                  </div>
                  <Progress value={analysis.injuryRisk} className="h-2" />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Real-time Physiological Monitoring
function PhysiologicalMonitor() {
  const [vitals, setVitals] = useState({
    heartRate: 0,
    bodyTemp: 0,
    hydrationLevel: 0,
    lactateLevel: 0,
    vo2: 0,
    rpe: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        setVitals({
          heartRate: 140 + Math.random() * 40,
          bodyTemp: 98.2 + Math.random() * 2,
          hydrationLevel: 70 + Math.random() * 30,
          lactateLevel: 2 + Math.random() * 8,
          vo2: 40 + Math.random() * 20,
          rpe: 6 + Math.random() * 4
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  return (
    <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          Real-time Physiological Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`w-full ${isMonitoring ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Vital Signs Monitor'}
          </Button>

          {isMonitoring && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-red-500/20 p-3 rounded-lg border border-red-500">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm">Heart Rate</span>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {Math.round(vitals.heartRate)}
                </div>
                <div className="text-xs text-red-300">BPM</div>
              </div>

              <div className="bg-orange-500/20 p-3 rounded-lg border border-orange-500">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">Core Temp</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {vitals.bodyTemp.toFixed(1)}
                </div>
                <div className="text-xs text-orange-300">°F</div>
              </div>

              <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Hydration</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(vitals.hydrationLevel)}
                </div>
                <div className="text-xs text-blue-300">%</div>
              </div>

              <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Lactate</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {vitals.lactateLevel.toFixed(1)}
                </div>
                <div className="text-xs text-yellow-300">mmol/L</div>
              </div>

              <div className="bg-green-500/20 p-3 rounded-lg border border-green-500">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm">VO2</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(vitals.vo2)}
                </div>
                <div className="text-xs text-green-300">ml/kg/min</div>
              </div>

              <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-500">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">RPE</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(vitals.rpe)}
                </div>
                <div className="text-xs text-purple-300">/10</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// AI Performance Optimization Engine
function PerformanceOptimizer() {
  const [optimization, setOptimization] = useState({
    recommendations: [],
    predictedGains: {},
    riskAssessment: '',
    trainingZones: {},
    recoveryPlan: []
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization analysis
    setTimeout(() => {
      setOptimization({
        recommendations: [
          "Increase explosive power training by 20% based on force production deficits",
          "Implement altitude training protocol for improved VO2 max",
          "Focus on single-leg stability exercises to reduce asymmetry",
          "Add periodized strength training for sustained power output",
          "Integrate cognitive load training for mental resilience"
        ],
        predictedGains: {
          speed: 8.5,
          strength: 12.3,
          endurance: 15.7,
          agility: 6.9,
          recovery: 22.1
        },
        riskAssessment: 'Low risk with current protocols. Monitor hydration levels during high-intensity sessions.',
        trainingZones: {
          aerobic: '65-75% HRmax',
          threshold: '80-90% HRmax',
          neuromuscular: '95-100% HRmax',
          recovery: '50-60% HRmax'
        },
        recoveryPlan: [
          "Active recovery: 30min low-intensity cycling",
          "Cold therapy: 15min ice bath at 10-12°C",
          "Nutrition: 1.2g protein per kg body weight",
          "Sleep optimization: 8.5 hours with room temp 65-68°F",
          "Massage therapy: 45min deep tissue every 72 hours"
        ]
      });
      setIsOptimizing(false);
    }, 4000);
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-500/20 to-green-500/20 border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          AI Performance Optimization Engine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runOptimization}
            disabled={isOptimizing}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {isOptimizing ? 'Optimizing Performance...' : 'Run AI Analysis & Optimization'}
          </Button>

          {optimization.recommendations.length > 0 && (
            <div className="space-y-6">
              {/* Predicted Performance Gains */}
              <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg">
                <h4 className="font-bold text-green-400 mb-3">Predicted Performance Gains (6 weeks)</h4>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(optimization.predictedGains).map(([metric, gain]) => (
                    <div key={metric} className="text-center">
                      <div className="text-2xl font-bold text-green-400">+{gain}%</div>
                      <div className="text-sm text-green-300 capitalize">{metric}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Zones */}
              <div className="p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
                <h4 className="font-bold text-blue-400 mb-3">Optimized Training Zones</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(optimization.trainingZones).map(([zone, range]) => (
                    <div key={zone} className="flex justify-between">
                      <span className="capitalize text-blue-300">{zone}:</span>
                      <span className="text-blue-400 font-mono">{range}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="p-4 bg-purple-500/20 border border-purple-500 rounded-lg">
                <h4 className="font-bold text-purple-400 mb-3">AI Recommendations</h4>
                <ul className="space-y-2">
                  {optimization.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-purple-300">
                      <Target className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recovery Protocol */}
              <div className="p-4 bg-orange-500/20 border border-orange-500 rounded-lg">
                <h4 className="font-bold text-orange-400 mb-3">Optimized Recovery Protocol</h4>
                <ul className="space-y-2">
                  {optimization.recoveryPlan.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-orange-300">
                      <Timer className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Assessment */}
              <div className="p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg">
                <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Risk Assessment
                </h4>
                <p className="text-yellow-300 text-sm">{optimization.riskAssessment}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// STEM Integration Dashboard
function STEMIntegration() {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  
  const experiments = [
    {
      id: 'force-velocity',
      title: 'Force-Velocity Relationship',
      description: 'Analyze the biomechanical relationship between force and velocity in athletic movements',
      concepts: ['Newton\'s Laws', 'Power Equations', 'Vector Analysis'],
      status: 'ready'
    },
    {
      id: 'energy-systems',
      title: 'Energy System Analysis',
      description: 'Study ATP-PC, glycolytic, and oxidative energy pathways during exercise',
      concepts: ['Thermodynamics', 'Biochemistry', 'Metabolic Efficiency'],
      status: 'ready'
    },
    {
      id: 'biomechanics',
      title: 'Kinematic Analysis',
      description: 'Mathematical modeling of joint angles and movement patterns',
      concepts: ['Calculus', 'Trigonometry', 'Physics'],
      status: 'active'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border-indigo-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          STEM Training Integration Lab
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiments.map((experiment) => (
            <div 
              key={experiment.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer
                ${activeExperiment === experiment.id 
                  ? 'bg-indigo-500/30 border-indigo-400' 
                  : 'bg-gray-500/10 border-gray-500 hover:border-indigo-500'}`}
              onClick={() => setActiveExperiment(
                activeExperiment === experiment.id ? null : experiment.id
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-indigo-400">{experiment.title}</h4>
                <Badge 
                  variant={experiment.status === 'active' ? 'default' : 'secondary'}
                  className={experiment.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                >
                  {experiment.status}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{experiment.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {experiment.concepts.map((concept, i) => (
                  <Badge key={i} variant="outline" className="border-indigo-500 text-indigo-400 text-xs">
                    {concept}
                  </Badge>
                ))}
              </div>

              {activeExperiment === experiment.id && (
                <div className="mt-4 p-3 bg-indigo-500/20 rounded border border-indigo-400">
                  <div className="text-sm text-indigo-300">
                    {experiment.id === 'force-velocity' && (
                      <div>
                        <div className="font-semibold mb-2">Current Analysis:</div>
                        <div className="space-y-1">
                          <div>Force = Mass × Acceleration = 75kg × 12.5m/s² = 937.5N</div>
                          <div>Power = Force × Velocity = 937.5N × 8.2m/s = 7,687.5W</div>
                          <div>Efficiency = (Mechanical Power / Metabolic Power) × 100 = 82.3%</div>
                        </div>
                      </div>
                    )}
                    
                    {experiment.id === 'energy-systems' && (
                      <div>
                        <div className="font-semibold mb-2">Energy Pathway Distribution:</div>
                        <div className="space-y-1">
                          <div>ATP-PC System: 45% (0-10 seconds)</div>
                          <div>Glycolytic System: 35% (10-120 seconds)</div>
                          <div>Oxidative System: 20% (120+ seconds)</div>
                        </div>
                      </div>
                    )}
                    
                    {experiment.id === 'biomechanics' && (
                      <div>
                        <div className="font-semibold mb-2">Joint Angle Analysis:</div>
                        <div className="space-y-1">
                          <div>Knee Extension: 165° → 45° (120° ROM)</div>
                          <div>Hip Flexion: 15° → 95° (80° ROM)</div>
                          <div>Angular Velocity: 245°/second (peak)</div>
                        </div>
                      </div>
                    )}
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

// Main Sports Science Lab Page
export default function SportsScienceLabPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            Advanced Sports Science Laboratory
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Revolutionary biometric analysis and performance optimization with STEM integration
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Activity className="w-4 h-4 mr-2" />
              Real-time Biometrics
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Brain className="w-4 h-4 mr-2" />
              AI Optimization
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Target className="w-4 h-4 mr-2" />
              STEM Integration
            </Badge>
          </div>
        </div>

        {/* Main Lab Components */}
        <div className="space-y-8">
          {/* Biomechanical Analysis */}
          <BiomechanicalAnalyzer />

          {/* Physiological Monitoring */}
          <PhysiologicalMonitor />

          {/* Performance Optimization */}
          <PerformanceOptimizer />

          {/* STEM Integration */}
          <STEMIntegration />

          {/* Lab Results Summary */}
          <Card className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-yellow-400">Revolutionary Results & ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
                  <div className="text-green-300">Students maintain 3.5+ GPA during sports seasons</div>
                  <div className="text-sm text-green-200 mt-2">
                    STEM integration improves academic performance in physics and mathematics
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                  <div className="text-blue-300">College acceptance rate with 90% athletic scholarships</div>
                  <div className="text-sm text-blue-200 mt-2">
                    Biometric optimization results in 23% average performance improvement
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-400 mb-2">200%</div>
                  <div className="text-purple-300">Expected ROI by year 5 implementation</div>
                  <div className="text-sm text-purple-200 mt-2">
                    $45M investment generates sustainable revenue through athletic excellence
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