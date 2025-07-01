import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Course Management',
  description: 'Curriculum and course administration',
};

export default function coursesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Course Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curriculum and course administration
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to Courses
            </h2>
            <p className="text-gray-600 mb-6">
              This page is part of the Universal One School AI Education Platform. 
              Our comprehensive system provides personalized learning experiences 
              for all students, with specialized support for neurodivergent learners.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  AI-Powered Learning
                </h3>
                <p className="text-blue-700">
                  Experience personalized education with our advanced AI tutoring system 
                  that adapts to your unique learning style and needs.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Accessibility First
                </h3>
                <p className="text-green-700">
                  Built with comprehensive accessibility features and neurodivergent 
                  accommodations to ensure every student can succeed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="text-center">
          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 sm:justify-center">
            <a
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </a>
            <a
              href="/ai-tutor"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start AI Tutoring
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}