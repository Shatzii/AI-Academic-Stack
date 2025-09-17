import { createContext, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login, register, logout, getProfile } from '../slices/authSlice'

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
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && !user) {
      // Try to get user profile if we have a token but no user
      dispatch(getProfile())
    }
  }, [dispatch, user])

  const loginUser = async (credentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap()
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  const registerUser = async (userData) => {
    try {
      const result = await dispatch(register(userData)).unwrap()
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  const logoutUser = () => {
    dispatch(logout())
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
