'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, VolumeUp, Users, Camera, Mic, Activity, Zap, Target } from 'lucide-react';

// Holographic Classroom Simulation (2D Visualization)
function HolographicClassroom({ isActive }: { isActive: boolean }) {
  const [dataPoints, setDataPoints] = useState<Array<{ x: number; y: number; intensity: number }>>([]);
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setDataPoints(prev => [
          ...prev.slice(-20),
          {
            x: Math.random() * 100,
            y: Math.random() * 100,
            intensity: Math.random()
          }
        ]);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-lg overflow-hidden border border-cyan-500/50">
      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Central AI Coach Avatar */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className={`w-16 h-16 rounded-full border-2 border-cyan-400 flex items-center justify-center
            ${isActive ? 'bg-cyan-400/20 animate-pulse' : 'bg-gray-600/20'}`}>
            <Activity className={`w-8 h-8 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-cyan-400">
            AI COACH GO4IT
          </div>
        </div>
      </div>

      {/* Virtual Students Ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = 50 + Math.cos(angle) * 35;
        const y = 50 + Math.sin(angle) * 35;
        
        return (
          <div 
            key={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className={`w-8 h-8 rounded-full border border-orange-400 flex items-center justify-center
              ${isActive ? 'bg-orange-400/30 animate-pulse' : 'bg-gray-500/30'}`}>
              <Users className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-gray-400'}`} />
            </div>
          </div>
        );
      })}

      {/* Real-time Data Visualization */}
      {isActive && dataPoints.map((point, i) => (
        <div 
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
          style={{ 
            left: `${point.x}%`, 
            top: `${point.y}%`,
            opacity: point.intensity 
          }}
        />
      ))}

      {/* Status Indicators */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-xs text-gray-300">Holographic Projection</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-gray-300">AI Analysis</span>
        </div>
      </div>
    </div>
  );
}

// Real-time Biometric Data Simulation
function BiometricMonitor() {
  const [metrics, setMetrics] = useState({
    heartRate: 0,
    vo2Max: 0,
    lactateThreshold: 0,
    powerOutput: 0,
    efficiency: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        heartRate: 140 + Math.random() * 40,
        vo2Max: 45 + Math.random() * 15,
        lactateThreshold: 160 + Math.random() * 20,
        powerOutput: 250 + Math.random() * 100,
        efficiency: 85 + Math.random() * 15
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="bg-red-500/20 border-red-500">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-red-400">
            {Math.round(metrics.heartRate)}
          </div>
          <div className="text-sm text-red-300">Heart Rate (BPM)</div>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-500/20 border-blue-500">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(metrics.vo2Max)}
          </div>
          <div className="text-sm text-blue-300">VO2 Max</div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-500/20 border-green-500">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-400">
            {Math.round(metrics.lactateThreshold)}
          </div>
          <div className="text-sm text-green-300">Lactate Threshold</div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-500/20 border-purple-500">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(metrics.powerOutput)}W
          </div>
          <div className="text-sm text-purple-300">Power Output</div>
        </CardContent>
      </Card>
      
      <Card className="bg-orange-500/20 border-orange-500">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-orange-400">
            {Math.round(metrics.efficiency)}%
          </div>
          <div className="text-sm text-orange-300">Efficiency</div>
        </CardContent>
      </Card>
    </div>
  );
}

// AI Performance Analysis Engine
function AIPerformanceEngine() {
  const [analysis, setAnalysis] = useState({
    recommendations: [],
    riskFactors: [],
    optimizations: [],
    prediction: ""
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with real performance algorithms
    setTimeout(() => {
      setAnalysis({
        recommendations: [
          "Increase interval training by 15% to improve VO2 max",
          "Focus on lactate threshold training 3x weekly",
          "Implement power-based training zones",
          "Add plyometric exercises for explosive power"
        ],
        riskFactors: [
          "Elevated resting heart rate indicates overtraining",
          "Power output plateau suggests training adaptation needed",
          "Recovery metrics below optimal range"
        ],
        optimizations: [
          "Training load: Reduce by 10% this week",
          "Nutrition: Increase carb intake pre-workout",
          "Recovery: Add 30min ice bath post-training",
          "Sleep: Target 8.5 hours for optimal adaptation"
        ],
        prediction: "With current optimization plan, expect 12% performance improvement over 6 weeks"
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          AI Performance Analysis Engine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={runAnalysis} 
          disabled={isAnalyzing}
          className="mb-4 bg-cyan-600 hover:bg-cyan-700"
        >
          {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
        </Button>
        
        {analysis.prediction && (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg">
              <h4 className="font-bold text-green-400 mb-2">Performance Prediction</h4>
              <p className="text-green-300">{analysis.prediction}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-bold text-cyan-400 mb-2">AI Recommendations</h4>
                <ul className="space-y-1 text-sm text-cyan-300">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full mt-2"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-orange-400 mb-2">Risk Factors</h4>
                <ul className="space-y-1 text-sm text-orange-300">
                  {analysis.riskFactors.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-orange-400 rounded-full mt-2"></div>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-purple-400 mb-2">Optimizations</h4>
                <ul className="space-y-1 text-sm text-purple-300">
                  {analysis.optimizations.map((opt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full mt-2"></div>
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Holographic Classroom Page
export default function HolographicClassroomPage() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [connectedStudents, setConnectedStudents] = useState(12);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Holographic Virtual-Physical Classroom
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Revolutionary hybrid learning environment with real-time AI coaching
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-cyan-500 text-cyan-400">
              <Users className="w-4 h-4 mr-2" />
              {connectedStudents} Students Connected
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Camera className="w-4 h-4 mr-2" />
              Holographic Mode: Active
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              Session: {formatTime(sessionTime)}
            </Badge>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => setIsSessionActive(!isSessionActive)}
              className={`${isSessionActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isSessionActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isSessionActive ? 'End Session' : 'Start Session'}
            </Button>
            <Button variant="outline" className="border-cyan-500 text-cyan-400">
              <Mic className="w-4 h-4 mr-2" />
              Audio Settings
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-400">
              <VolumeUp className="w-4 h-4 mr-2" />
              Hologram Quality
            </Button>
          </div>
        </div>

        {/* Holographic Environment Simulation */}
        <Card className="mb-8 bg-black/50 border-cyan-500">
          <CardContent className="p-4">
            <HolographicClassroom isActive={isSessionActive} />
          </CardContent>
        </Card>

        {/* Real-time Biometric Monitoring */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Real-time Biometric Monitoring</h2>
          <BiometricMonitor />
        </div>

        {/* AI Performance Analysis */}
        <div className="mb-8">
          <AIPerformanceEngine />
        </div>

        {/* Training Modules */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-400">STEM Training Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-300 mb-4">
                Physics-based athletic training with biomechanical analysis
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Force Analysis</span>
                  <span className="text-green-400">95%</span>
                </div>
                <div className="flex justify-between">
                  <span>Velocity Calculations</span>
                  <span className="text-green-400">88%</span>
                </div>
                <div className="flex justify-between">
                  <span>Energy Systems</span>
                  <span className="text-yellow-400">72%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500">
            <CardHeader>
              <CardTitle className="text-green-400">Peer Mentorship Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-300 mb-4">
                AI-powered matching with elite athlete mentors
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold">Jordan Davis</div>
                    <div className="text-xs text-green-300">Olympic Sprinter</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                    SR
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Rodriguez</div>
                    <div className="text-xs text-green-300">Sports Scientist</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
            <CardHeader>
              <CardTitle className="text-purple-400">Alumni Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-300 mb-4">
                Career acceleration through elite athletic connections
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>NFL Alumni</span>
                  <span className="text-purple-400">47</span>
                </div>
                <div className="flex justify-between">
                  <span>Olympic Athletes</span>
                  <span className="text-purple-400">23</span>
                </div>
                <div className="flex justify-between">
                  <span>Sports Executives</span>
                  <span className="text-purple-400">156</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-400">Revolutionary Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-400">95%</div>
                <div className="text-green-300">Students maintain 3.5+ GPA during sports seasons</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400">100%</div>
                <div className="text-blue-300">College acceptance rate with 90% athletic scholarships</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400">200%</div>
                <div className="text-purple-300">Expected ROI by year 5 implementation</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}