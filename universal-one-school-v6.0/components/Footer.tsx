import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">Universal One School</span>
            </div>
            <p className="text-gray-300 text-sm">
              Comprehensive AI-powered education serving neurodivergent learners across specialized schools.
            </p>
          </div>

          {/* Schools */}
          <div>
            <h3 className="font-semibold mb-4">Our Schools</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/schools/primary-school" className="hover:text-blue-400">SuperHero School (K-6)</Link></li>
              <li><Link href="/schools/secondary-school" className="hover:text-blue-400">Stage Prep School (7-12)</Link></li>
              <li><Link href="/schools/law-school" className="hover:text-blue-400">Legal Professionals</Link></li>
              <li><Link href="/schools/language-school" className="hover:text-blue-400">Language Academy</Link></li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h3 className="font-semibold mb-4">AI Features</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/ai-tutor" className="hover:text-blue-400">AI Personal Tutor</Link></li>
              <li><Link href="/ai-analytics" className="hover:text-blue-400">Learning Analytics</Link></li>
              <li><Link href="/virtual-classroom" className="hover:text-blue-400">Virtual Classroom</Link></li>
              <li><Link href="/curriculum-generator" className="hover:text-blue-400">Curriculum Generator</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@schools.shatzii.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Austin, Texas</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Universal One School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}