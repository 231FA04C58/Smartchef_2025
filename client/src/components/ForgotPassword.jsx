import { useState } from 'react';
import { forgotPassword, resetPassword } from '../services/authService';
import { useToast } from '../contexts/ToastContext';

const ForgotPassword = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { success, error: showError } = useToast();

  // Step 1: Enter email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setMessage('User found. You can now reset your password.');
        setStep('reset');
      } else {
        setError(response.message || 'Email not found');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.message || 'Failed to check email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(email, newPassword, confirmPassword);
      if (response.success) {
        success('Password reset successfully! You can now login with your new password.');
        if (onSuccess) onSuccess();
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <div className="form-header">
        <h2>Reset Password</h2>
        {step === 'email' ? (
          <p>Enter your email address to reset your password</p>
        ) : (
          <p>Enter your new password</p>
        )}
      </div>

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          {message && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn primary full-width"
            disabled={loading || !email}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Checking...
              </>
            ) : (
              <>
                <i className="fas fa-arrow-right"></i>
                Continue
              </>
            )}
          </button>

          <button 
            type="button" 
            className="btn secondary full-width"
            onClick={onBack}
            disabled={loading}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit}>
          <div className="input-group">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              autoFocus
            />
            <small className="input-hint">Password must be at least 6 characters</small>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <small className="error-text">Passwords do not match</small>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <small className="success-text">Passwords match</small>
            )}
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn primary full-width"
            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Resetting...
              </>
            ) : (
              <>
                <i className="fas fa-key"></i>
                Reset Password
              </>
            )}
          </button>

          <button 
            type="button" 
            className="btn secondary full-width"
            onClick={() => {
              setStep('email');
              setNewPassword('');
              setConfirmPassword('');
              setError('');
            }}
            disabled={loading}
          >
            <i className="fas fa-arrow-left"></i>
            Change Email
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;

