'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Lock } from 'lucide-react'
import LoginForm from './login-form'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  allowedRoles?: string[]
  fallbackPath?: string
  showLoginForm?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowedRoles,
  fallbackPath = '/auth',
  showLoginForm = true
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !showLoginForm) {
      router.push(fallbackPath)
    }
  }, [isLoading, isAuthenticated, router, fallbackPath, showLoginForm])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated and showLoginForm is true
  if (!isAuthenticated) {
    if (showLoginForm) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center mb-6">
              <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Required</h1>
              <p className="text-gray-600">Please sign in to access this area</p>
            </div>
            <LoginForm />
          </div>
        </div>
      )
    }
    return null // Will redirect via useEffect
  }

  // Check role permissions if specified
  if (user && (requiredRole || allowedRoles)) {
    const userRole = user.role || 'student'
    
    // Check single required role
    if (requiredRole && userRole !== requiredRole) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access this area.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-sm text-gray-600">
                <p>Required role: <span className="font-medium">{requiredRole}</span></p>
                <p>Your role: <span className="font-medium">{userRole}</span></p>
              </div>
              <button 
                onClick={() => router.back()}
                className="text-primary hover:underline"
              >
                Go back
              </button>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Check allowed roles array
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access this area.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-sm text-gray-600">
                <p>Allowed roles: <span className="font-medium">{allowedRoles.join(', ')}</span></p>
                <p>Your role: <span className="font-medium">{userRole}</span></p>
              </div>
              <button 
                onClick={() => router.back()}
                className="text-primary hover:underline"
              >
                Go back
              </button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  // User is authenticated and has proper permissions
  return <>{children}</>
}