import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Use environment variable or default to Render URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smartchef-2025.onrender.com/api'

  useEffect(() => {
    // Check for existing user in localStorage
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      const user = {
        id: data.data.user._id,
        name: data.data.user.firstName ? `${data.data.user.firstName} ${data.data.user.lastName}`.trim() : data.data.user.username,
        email: data.data.user.email,
        username: data.data.user.username,
        token: data.data.token
      }

      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('authToken', data.data.token)
      setCurrentUser(user)
      
      return { success: true, user }
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name, email, password) => {
    try {
      setError(null)
      setLoading(true)

      // Split name into first and last name
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || ''
      
      // Generate username from email
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          email, 
          password, 
          firstName, 
          lastName 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (data.message === 'Email already registered') {
          throw new Error('This email is already registered. Please use a different email or try logging in.')
        } else if (data.message === 'Username already taken') {
          throw new Error('This username is already taken. Please try a different email address.')
        } else if (data.errors && data.errors.length > 0) {
          // Handle validation errors
          const errorMessages = data.errors.map(err => err.msg).join(', ')
          throw new Error(errorMessages)
        } else {
          throw new Error(data.message || 'Registration failed')
        }
      }

      const user = {
        id: data.data.user._id,
        name: data.data.user.firstName ? `${data.data.user.firstName} ${data.data.user.lastName}`.trim() : data.data.user.username,
        email: data.data.user.email,
        username: data.data.user.username,
        token: data.data.token
      }

      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('authToken', data.data.token)
      setCurrentUser(user)
      
      return { success: true, user }
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('authToken')
    setCurrentUser(null)
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    error,
    clearError,
    setError // Export setError for client-side validation
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

