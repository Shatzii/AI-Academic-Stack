import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, logout as logoutAction } from '../slices/authSlice'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading } = useSelector(state => state.auth)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (token && !isAuthenticated) {
        try {
          await dispatch(getUserProfile()).unwrap()
        } catch (error) {
          // Token is invalid, logout
          dispatch(logoutAction())
        }
      }
      setIsInitialized(true)
    }

    initializeAuth()
  }, [dispatch, isAuthenticated])

  const logout = () => {
    dispatch(logoutAction())
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    isInitialized,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
