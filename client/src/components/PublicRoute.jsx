import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // If user is already logged in, redirect to Dashboard
  if (currentUser) {
    return <Navigate to="/" replace />
  }

  // If user is not logged in, show the public page
  return children
}

export default PublicRoute

