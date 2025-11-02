import { useState } from 'react';
import { forgotPassword, resetPassword } from '../services/authService';
import { useToast } from '../contexts/ToastContext';

const ForgotPassword = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { success, error: showError } = useToast();

  // Handle form submission - check email first, then reset password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validation
    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

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
      // Step 1: Check if email exists
      const emailCheck = await forgotPassword(email);
      if (!emailCheck.success) {
        setError(emailCheck.message || 'Email not found');
        setLoading(false);
        return;
      }

      // Step 2: Reset password
      const response = await resetPassword(email, newPassword, confirmPassword);
      if (response.success) {
        success('Password reset successfully! You can now login with your new password.');
        // Clear form
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        // Go back to login page
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
        <p>Enter your email and new password to reset</p>
      </div>

      <form onSubmit={handleSubmit}>
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

        <div className="input-group">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
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
          {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
            <small className="success-text">✓ Passwords match</small>
          )}
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
          disabled={loading || !email || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Resetting Password...
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
          onClick={onBack}
          disabled={loading}
        >
          <i className="fas fa-arrow-left"></i>
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

