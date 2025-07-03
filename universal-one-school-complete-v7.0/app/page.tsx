'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface School {
  id: string;
  name: string;
  description: string;
  grades: string;
  theme: string;
  features: string[];
  enrollment: number;
  aiModel: string;
}

interface AIHealth {
  status: string;
  models: number;
  responseTime: number;
  timestamp: string;
}

export default function HomePage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [aiHealth, setAIHealth] = useState<AIHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch schools data
      const schoolsResponse = await fetch('/api/schools');
      const schoolsData = await schoolsResponse.json();
      if (schoolsData.success) {
        setSchools(schoolsData.schools);
      }

      // Fetch AI health
      const aiResponse = await fetch('/api/ai/self-hosted/health');
      const aiData = await aiResponse.json();
      if (aiData.status === 'healthy') {
        setAIHealth({
          status: aiData.status,
          models: aiData.models?.length || 0,
          responseTime: aiData.responseTime || 0,
          timestamp: aiData.timestamp
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSchoolGradient = (theme: string) => {
    const gradients = {
      superhero: 'superhero-gradient',
      theater: 'theater-gradient', 
      legal: 'legal-gradient',
      multicultural: 'language-gradient',
      sports: 'sports-gradient'
    };
    return gradients[theme as keyof typeof gradients] || 'superhero-gradient';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="ai-pulse text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-gray-700">Loading Universal One School...</h2>
          <p className="text-gray-500 mt-2">Initializing self-hosted AI engine</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Universal One School
          </h1>
          <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto">
            Revolutionary VR Educational Gaming System
          </p>
          <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
            Complete state-compliant curriculum in 90 minutes daily with self-hosted AI, 
            supporting all learning types across US, Austrian, and Mexican educational standards.
          </p>
          
          {/* AI Status Display */}
          {aiHealth && (
            <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 ai-pulse"></div>
              <span className="text-sm font-medium">
                Self-Hosted AI Active • {aiHealth.models} Models • {aiHealth.responseTime}ms
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="gaming-button text-lg px-8 py-4">
              Start Learning Journey
            </button>
            <Link 
              href="/enrollment" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Five Specialized Schools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each school features dedicated AI models and specialized curriculum designed for different learning styles and academic goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school) => (
            <div key={school.id} className="vr-card group">
              <div className={`${getSchoolGradient(school.theme)} p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">{school.name}</h3>
                  <p className="text-lg opacity-90">{school.grades}</p>
                </div>
                
                <p className="mb-4 opacity-90">{school.description}</p>
                
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {school.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="achievement-badge text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm opacity-80">
                    {school.enrollment} students
                  </div>
                  <Link 
                    href={`/schools/${school.id}`}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Revolutionary AI-Powered Education
            </h2>
            <p className="text-xl text-gray-600">
              Complete independence with zero ongoing AI costs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Self-Hosted AI</h3>
              <p className="text-gray-600">
                5 specialized educational AI models with zero external dependencies and unlimited usage.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold mb-2">VR Gaming System</h3>
              <p className="text-gray-600">
                Immersive educational gaming with 90-minute daily curriculum and maximum outdoor time.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Neurodivergent Support</h3>
              <p className="text-gray-600">
                Built-in accommodations for ADHD, dyslexia, autism, and other learning differences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Global Impact
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {schools.reduce((sum, school) => sum + school.enrollment, 0).toLocaleString()}+
            </div>
            <div className="text-gray-600">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">$0</div>
            <div className="text-gray-600">Monthly AI Costs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
            <div className="text-gray-600">Global Campuses</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {aiHealth?.models || 5}
            </div>
            <div className="text-gray-600">AI Models</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Universal One School</h3>
              <p className="text-gray-400 mb-4">
                Revolutionary VR Educational Gaming System with complete AI independence and global reach.
              </p>
              <div className="text-sm text-gray-500">
                Platform v7.0 • Self-Hosted AI • Zero External Dependencies
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Schools</h4>
              <ul className="space-y-2 text-gray-400">
                {schools.slice(0, 4).map((school) => (
                  <li key={school.id}>
                    <Link href={`/schools/${school.id}`} className="hover:text-white transition-colors">
                      {school.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/enrollment" className="hover:text-white transition-colors">Enrollment</Link></li>
                <li><Link href="/api/ai/self-hosted/health" className="hover:text-white transition-colors">AI Status</Link></li>
                <li><a href="https://github.com/shatzii/universal-one-school" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://railway.app" className="hover:text-white transition-colors">Deploy on Railway</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Universal One School. Revolutionizing education with self-hosted AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}