'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Shield, 
  GraduationCap, 
  Settings, 
  Eye,
  Users
} from 'lucide-react'

export default function AdminToggle() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMasterAdmin, setIsMasterAdmin] = useState(false)

  useEffect(() => {
    // Check if admin mode is enabled
    const adminMode = localStorage.getItem('admin_mode') === 'true'
    const masterAdmin = localStorage.getItem('master_admin') === 'true'
    const userRole = localStorage.getItem('user_role') || 'student'
    setIsAdmin(adminMode || userRole === 'admin' || masterAdmin)
    setIsMasterAdmin(masterAdmin)
    
    // Show toggle if admin access was previously enabled
    setIsVisible(adminMode || userRole === 'admin' || masterAdmin)
  }, [])

  const toggleAdminMode = () => {
    const newAdminMode = !isAdmin
    setIsAdmin(newAdminMode)
    localStorage.setItem('admin_mode', newAdminMode.toString())
    localStorage.setItem('user_role', newAdminMode ? 'admin' : 'student')
    
    // Refresh page to apply changes
    window.location.reload()
  }

  const enableAdminAccess = () => {
    const password = prompt('Enter admin password:')
    if (password === 'admin123') {
      setIsVisible(true)
      setIsAdmin(true)
      localStorage.setItem('admin_mode', 'true')
      localStorage.setItem('user_role', 'admin')
      window.location.reload()
    } else if (password === 'master123') {
      setIsVisible(true)
      setIsAdmin(true)
      setIsMasterAdmin(true)
      localStorage.setItem('master_admin', 'true')
      localStorage.setItem('admin_mode', 'true')
      localStorage.setItem('user_role', 'admin')
      window.location.reload()
    } else if (password !== null) {
      alert('Invalid password. Use admin123 or master123')
    }
  }

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={enableAdminAccess}
        className="fixed top-4 right-4 z-50 opacity-30 hover:opacity-100"
      >
        <Eye className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border rounded-lg shadow-lg p-3">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <Shield className={`h-4 w-4 ${isMasterAdmin ? 'text-red-600' : 'text-blue-600'}`} />
          ) : (
            <GraduationCap className="h-4 w-4 text-green-600" />
          )}
          <span className="text-sm font-medium">
            {isMasterAdmin ? 'Master Admin' : isAdmin ? 'Admin' : 'Student'}
          </span>
        </div>
        
        <Switch
          checked={isAdmin}
          onCheckedChange={toggleAdminMode}
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            localStorage.removeItem('admin_mode')
            localStorage.removeItem('user_role')
            localStorage.removeItem('master_admin')
            setIsVisible(false)
            setIsAdmin(false)
            setIsMasterAdmin(false)
            window.location.reload()
          }}
        >
          ×
        </Button>
      </div>
      
      <div className="mt-2">
        <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs">
          {isMasterAdmin ? 'Master Access - All Schools' : isAdmin ? 'Admin Access' : 'Student View'}
        </Badge>
      </div>
    </div>
  )
}