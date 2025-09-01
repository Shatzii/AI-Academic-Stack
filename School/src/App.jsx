import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from 'react-hot-toast'

// Layout Components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'

// Loading Component
import Loading from './components/common/Loading'

// Lazy load components for code splitting
const Home = lazy(() => import('./components/common/Home'))
const Login = lazy(() => import('./components/auth/Login'))
const Register = lazy(() => import('./components/auth/Register'))
const TwoFactorAuth = lazy(() => import('./components/auth/TwoFactorAuth'))
const Dashboard = lazy(() => import('./components/common/Dashboard'))
const AchievementSystem = lazy(() => import('./components/common/AchievementSystem'))
const Leaderboard = lazy(() => import('./components/common/Leaderboard'))
const AccessibilitySettings = lazy(() => import('./components/common/AccessibilitySettings'))
const PersonalizationEngine = lazy(() => import('./components/common/PersonalizationEngine'))
const InternationalizationSettings = lazy(() => import('./components/common/InternationalizationSettings'))
const OnboardingWizard = lazy(() => import('./components/common/OnboardingWizard'))
const CoursesList = lazy(() => import('./components/courses/CoursesList'))
const AIAssistant = lazy(() => import('./components/ai/AIAssistant'))
const StudentIDSystem = lazy(() => import('./components/common/StudentIDSystem'))
const StudentIDAdmin = lazy(() => import('./components/common/StudentIDAdmin'))

// Context
import { AuthProvider } from './context/AuthContext.jsx'
import { BrandingProvider } from './context/BrandingContext.jsx'

// Components
import AchievementNotifications from './components/common/AchievementNotifications'

// Styles
import './App.css'
import './components.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Provider store={store}>
      <BrandingProvider>
        <AuthProvider>
          <AchievementNotifications />
          <Router>
            {/* Skip Links for Accessibility */}
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <a href="#navigation" className="skip-link">Skip to navigation</a>
            <div className="app-container" role="application" aria-label="OpenEdTex Academic Platform">
            <div className="app">
              <Navbar />
              <div className="main-content">
                <Sidebar />
                <main id="main-content" className="content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                      <Suspense fallback={<Loading message="Loading home page..." />}>
                        <Home />
                      </Suspense>
                    } />
                  <Route path="/login" element={
                    <Suspense fallback={<Loading message="Loading login..." />}>
                      <Login />
                    </Suspense>
                  } />
                  <Route path="/register" element={
                    <Suspense fallback={<Loading message="Loading registration..." />}>
                      <Register />
                    </Suspense>
                  } />
                  <Route path="/2fa" element={
                    <Suspense fallback={<Loading message="Loading 2FA settings..." />}>
                      <TwoFactorAuth />
                    </Suspense>
                  } />

                  {/* Protected Routes */}
                  <Route path="/onboarding" element={
                    <Suspense fallback={<Loading message="Setting up your experience..." />}>
                      <OnboardingWizard />
                    </Suspense>
                  } />
                  <Route path="/dashboard" element={
                    <Suspense fallback={<Loading message="Loading dashboard..." />}>
                      <Dashboard />
                    </Suspense>
                  } />
                  <Route path="/achievements" element={
                    <Suspense fallback={<Loading message="Loading achievements..." />}>
                      <AchievementSystem />
                    </Suspense>
                  } />
                  <Route path="/leaderboard" element={
                    <Suspense fallback={<Loading message="Loading leaderboard..." />}>
                      <Leaderboard />
                    </Suspense>
                  } />
                  <Route path="/accessibility" element={
                    <Suspense fallback={<Loading message="Loading accessibility settings..." />}>
                      <AccessibilitySettings />
                    </Suspense>
                  } />
                  <Route path="/personalization" element={
                    <Suspense fallback={<Loading message="Loading AI recommendations..." />}>
                      <PersonalizationEngine />
                    </Suspense>
                  } />
                  <Route path="/internationalization" element={
                    <Suspense fallback={<Loading message="Loading language settings..." />}>
                      <InternationalizationSettings />
                    </Suspense>
                  } />
                  <Route path="/courses" element={
                    <Suspense fallback={<Loading message="Loading courses..." />}>
                      <CoursesList />
                    </Suspense>
                  } />
                  <Route path="/ai/chat" element={
                    <Suspense fallback={<Loading message="Loading AI assistant..." />}>
                      <AIAssistant />
                    </Suspense>
                  } />
                  <Route path="/student-id" element={
                    <Suspense fallback={<Loading message="Loading Student ID system..." />}>
                      <StudentIDSystem />
                    </Suspense>
                  } />
                  <Route path="/admin/student-id" element={
                    <Suspense fallback={<Loading message="Loading Student ID admin..." />}>
                      <StudentIDAdmin />
                    </Suspense>
                  } />

                  {/* 404 Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </BrandingProvider>
    </Provider>
  )
}

export default App
