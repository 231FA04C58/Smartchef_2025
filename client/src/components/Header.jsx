import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDarkMode } from '../contexts/DarkModeContext'

const Header = () => {
  const { currentUser, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <i className="fas fa-utensils"></i> SmartChef
      </Link>
      <nav>
        {currentUser ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/recipes">Browse Recipes</Link>
            <Link to="/planner">Meal Planner</Link>
            <Link to="/collections">My Collections</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/recipes">Browse Recipes</Link>
          </>
        )}
        <Link to="/about">About</Link>
        {currentUser ? (
          <>
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
              <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>
            <Link to="/profile" className="user-profile">
              <div className="user-avatar">
                {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : currentUser.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span>{currentUser.firstName || currentUser.name || 'User'}</span>
            </Link>
            <a href="#" onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <>
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
              <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>
            <Link to="/login">Login / Signup</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header

