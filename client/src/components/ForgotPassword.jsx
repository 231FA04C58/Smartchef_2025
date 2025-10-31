import { useState } from 'react';
import { forgotPassword, resetPassword } from '../services/otpService';

const ForgotPassword = ({ onBack, onOTPSent }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPassword(email);
      setMessage(response.message || 'OTP sent! Check your email.');
      setOtpSent(true);
      onOTPSent(email);
    } catch (error) {
      console.error('Forgot password error details:', error);
      let errorMessage = error.message || 'Failed to send OTP. Please try again.';
      
      // Add detailed error if available in development
      if (error.details) {
        errorMessage += ` Details: ${error.details}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(email, newPassword, otp);
      if (response.success) {
        setMessage('Password reset successfully!');
        setTimeout(() => {
          onBack();
        }, 2000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message || 'Failed to reset password. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <div className="form-header">
        <h2>Forgot Password?</h2>
        {!otpSent ? (
          <p>Enter your email address and we'll send you an OTP.</p>
        ) : (
          <p>Enter the OTP you received and your new password.</p>
        )}
      </div>

      {!otpSent ? (
        <form onSubmit={handleSendOTP}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Send OTP
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
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter OTP (6 digits)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={loading}
              maxLength={6}
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
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
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
            disabled={loading || !otp || !newPassword || !confirmPassword}
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
              setOtpSent(false);
              setOtp('');
              setNewPassword('');
              setConfirmPassword('');
              setMessage('');
              setError('');
            }}
            disabled={loading}
          >
            <i className="fas fa-arrow-left"></i>
            Change Email
          </button>
        </form>
      )}

      {!otpSent && (
        <div className="help-text">
          <p>
            <i className="fas fa-info-circle"></i>
            The OTP will expire in 10 minutes. Check your spam folder if you don't see the email.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
