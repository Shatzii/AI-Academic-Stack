import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from 'react-hot-toast'

// Layout Components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Profile from './components/auth/Profile'

// Course Components
import CourseList from './components/courses/CourseList'
import CourseDetail from './components/courses/CourseDetail'
import CourseCreate from './components/courses/CourseCreate'
import CourseEdit from './components/courses/CourseEdit'
import LessonView from './components/courses/LessonView'

// Classroom Components
import ClassroomList from './components/classrooms/ClassroomList'
import ClassroomDetail from './components/classrooms/ClassroomDetail'
import ClassroomCreate from './components/classrooms/ClassroomCreate'

// AI Assistant Components
import AIChat from './components/ai/AIChat'
import StudyPlans from './components/ai/StudyPlans'
import QuizGenerator from './components/ai/QuizGenerator'
import QuizAttempt from './components/ai/QuizAttempt'

// Analytics Components
import Dashboard from './components/analytics/Dashboard'
import Analytics from './components/analytics/Analytics'

// Common Components
import Home from './components/common/Home'
import NotFound from './components/common/NotFound'
import Loading from './components/common/Loading'

// Context
import { AuthProvider } from './context/AuthContext.jsx'

// Styles
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="main-content">
              <Sidebar />
              <main className="content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route path="/courses" element={<CourseList />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/courses/:id/lessons/:lessonId" element={<LessonView />} />
                  <Route path="/courses/create" element={<CourseCreate />} />
                  <Route path="/courses/:id/edit" element={<CourseEdit />} />

                  <Route path="/classrooms" element={<ClassroomList />} />
                  <Route path="/classrooms/:id" element={<ClassroomDetail />} />
                  <Route path="/classrooms/create" element={<ClassroomCreate />} />

                  <Route path="/ai/chat" element={<AIChat />} />
                  <Route path="/ai/study-plans" element={<StudyPlans />} />
                  <Route path="/ai/quiz-generator" element={<QuizGenerator />} />
                  <Route path="/ai/quiz/:id" element={<QuizAttempt />} />

                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* 404 Route */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
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
    </Provider>
  )
}

export default App
