import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ForgotPassword from '../components/ForgotPassword'

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [loginEmailError, setLoginEmailError] = useState(false)
  const [signupEmailError, setSignupEmailError] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  const { login, signup, loading, error, clearError, setError } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Client-side validation
    if (!validateEmail(loginEmail)) {
      setError('Please enter a valid email address')
      return
    }
    
    try {
      await login(loginEmail, loginPassword)
      navigate('/')
    } catch (error) {
      // Error is handled by AuthContext
    }
  }

  const handleLoginEmailChange = (e) => {
    const email = e.target.value
    setLoginEmail(email)
    setLoginEmailError(email && !validateEmail(email))
    if (error) clearError() // Clear error when user starts typing
  }

  const handleSignupEmailChange = (e) => {
    const email = e.target.value
    setSignupEmail(email)
    setSignupEmailError(email && !validateEmail(email))
    if (error) clearError() // Clear error when user starts typing
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    
    // Client-side validation
    if (!validateEmail(signupEmail)) {
      setError('Please enter a valid email address')
      return
    }
    
    try {
      await signup(signupName, signupEmail, signupPassword)
      navigate('/')
    } catch (error) {
      // Error is handled by AuthContext
    }
  }

  // Forgot password handlers
  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handlePasswordResetSuccess = () => {
    setShowForgotPassword(false)
    setActiveTab('login')
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Create account
          </button>
        </div>

        <form 
          className={`auth-form ${activeTab === 'login' ? '' : 'hidden'}`}
          onSubmit={handleLogin}
        >
          <h2>Welcome back</h2>
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
              <button 
                type="button" 
                className="error-close"
                onClick={clearError}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          <input 
            type="email" 
            placeholder="Email" 
            required 
            value={loginEmail}
            onChange={handleLoginEmailChange}
            disabled={loading}
            className={loginEmailError ? 'error' : ''}
          />
          {loginEmailError && (
            <div className="field-error">
              <i className="fas fa-exclamation-circle"></i>
              Please enter a valid email address
            </div>
          )}
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
          <p className="muted">
            <a className="forgot-password-link" onClick={handleForgotPassword}>
              Forgot your password?
            </a>
          </p>
          <p className="muted">
            No account? <a className="switch" onClick={() => setActiveTab('signup')}>Create account</a>
          </p>
        </form>

        <form 
          className={`auth-form ${activeTab === 'signup' ? '' : 'hidden'}`}
          onSubmit={handleSignup}
        >
          <h2>Create your account</h2>
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
              <button 
                type="button" 
                className="error-close"
                onClick={clearError}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          <input 
            type="text" 
            placeholder="Full name" 
            required 
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            disabled={loading}
          />
          <input 
            type="email" 
            placeholder="Email" 
            required 
            value={signupEmail}
            onChange={handleSignupEmailChange}
            disabled={loading}
            className={signupEmailError ? 'error' : ''}
          />
          {signupEmailError && (
            <div className="field-error">
              <i className="fas fa-exclamation-circle"></i>
              Please enter a valid email address
            </div>
          )}
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
          <p className="muted">
            Already have account? <a className="switch" onClick={() => setActiveTab('login')}>Login</a>
          </p>
        </form>

        {/* Forgot Password Component */}
        {showForgotPassword && (
          <ForgotPassword 
            onBack={handleBackToLogin}
            onSuccess={handlePasswordResetSuccess}
          />
        )}
      </div>

      <aside className="auth-illustration">
        <h3>Why join SmartChef?</h3>
        <ul>
          <li>Save favorites</li>
          <li>Generate meal plans</li>
          <li>Export shopping lists</li>
        </ul>
        <img 
          src="https://images.unsplash.com/photo-1556910633-5099dc3971e8?w=900&h=600&fit=crop" 
          alt="Person cooking in a bright kitchen"
        />
      </aside>
    </main>
  )
}

export default Login

