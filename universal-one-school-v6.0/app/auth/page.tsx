'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login, register, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/')
    return null
  }

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const username = formData.get('username') as string
      const password = formData.get('password') as string
      
      await login(username, password)
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in to Universal One School',
      })
      router.push('/')
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const userData = {
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        email: formData.get('email') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        role: formData.get('role') as string || 'student',
        neurotype: formData.get('neurotype') as string,
      }
      
      await register(userData)
      toast({
        title: 'Welcome to Universal One School!',
        description: 'Your account has been created successfully',
      })
      router.push('/')
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Universal One School
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Join our innovative educational platform designed for neurodivergent learners with specialized support across four unique schools.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">SuperHero School</h3>
              <p className="text-sm text-blue-600">Primary K-6 with gamified learning</p>
              <Badge className="mt-2 bg-blue-600">Ages 5-11</Badge>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">Stage Prep School</h3>
              <p className="text-sm text-purple-600">Secondary 7-12 theater focus</p>
              <Badge className="mt-2 bg-purple-600">Ages 12-18</Badge>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Language School</h3>
              <p className="text-sm text-green-600">Multilingual immersion</p>
              <Badge className="mt-2 bg-green-600">All Ages</Badge>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Law School</h3>
              <p className="text-sm text-amber-600">Professional legal education</p>
              <Badge className="mt-2 bg-amber-600">18+</Badge>
            </div>
          </div>
        </div>

        {/* Authentication Forms */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join Our Learning Community</CardTitle>
            <CardDescription>Sign in or create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form action={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      name="username"
                      placeholder="Enter your username"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Demo credentials: <br />
                    Username: <code className="bg-gray-100 px-1 rounded">demo_student</code> <br />
                    Password: <code className="bg-gray-100 px-1 rounded">password</code>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form action={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      name="username"
                      placeholder="Choose a username"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="Create a secure password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" defaultValue="student" disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="parent">Parent/Guardian</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="neurotype">Learning Profile (Optional)</Label>
                    <Select name="neurotype" disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select if applicable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neurotypical">Neurotypical</SelectItem>
                        <SelectItem value="ADHD">ADHD</SelectItem>
                        <SelectItem value="dyslexia">Dyslexia</SelectItem>
                        <SelectItem value="autism">Autism Spectrum</SelectItem>
                        <SelectItem value="multiple">Multiple Conditions</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}