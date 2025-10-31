import { useAuth } from '../contexts/AuthContext'
import Layout from './Layout'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'

const HomeRoute = () => {
  const { currentUser, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </Layout>
    )
  }

  // If user is logged in, show Dashboard
  if (currentUser) {
    return (
      <Layout>
        <Dashboard />
      </Layout>
    )
  }

  // If user is not logged in, show Home page (public home/welcome page)
  return (
    <Layout>
      <Home />
    </Layout>
  )
}

export default HomeRoute

