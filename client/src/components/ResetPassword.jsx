import { useState } from 'react';
import { resetPassword } from '../services/otpService';

const ResetPassword = ({ email, resetToken, onSuccess, onBack }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
      errors: {
        minLength: !minLength,
        hasUpperCase: !hasUpperCase,
        hasLowerCase: !hasLowerCase,
        hasNumber: !hasNumber
      }
    };
  };

  const passwordValidation = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements');
      return;
    }
    
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await resetPassword(email, newPassword, resetToken);
      onSuccess();
    } catch (error) {
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-form">
      <div className="form-header">
        <h2>Create New Password</h2>
        <p>Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          {newPassword && (
            <div className="password-strength">
              <div className="strength-indicator">
                <div 
                  className={`strength-bar ${passwordValidation.isValid ? 'strong' : 'weak'}`}
                  style={{ width: `${(Object.values(passwordValidation.errors).filter(Boolean).length / 4) * 100}%` }}
                ></div>
              </div>
              <div className="password-requirements">
                <div className={`requirement ${!passwordValidation.errors.minLength ? 'valid' : ''}`}>
                  <i className={`fas ${!passwordValidation.errors.minLength ? 'fa-check' : 'fa-times'}`}></i>
                  At least 6 characters
                </div>
                <div className={`requirement ${!passwordValidation.errors.hasUpperCase ? 'valid' : ''}`}>
                  <i className={`fas ${!passwordValidation.errors.hasUpperCase ? 'fa-check' : 'fa-times'}`}></i>
                  One uppercase letter
                </div>
                <div className={`requirement ${!passwordValidation.errors.hasLowerCase ? 'valid' : ''}`}>
                  <i className={`fas ${!passwordValidation.errors.hasLowerCase ? 'fa-check' : 'fa-times'}`}></i>
                  One lowercase letter
                </div>
                <div className={`requirement ${!passwordValidation.errors.hasNumber ? 'valid' : ''}`}>
                  <i className={`fas ${!passwordValidation.errors.hasNumber ? 'fa-check' : 'fa-times'}`}></i>
                  One number
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="input-group">
          <div className="password-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          {confirmPassword && (
            <div className={`password-match ${passwordsMatch ? 'valid' : 'invalid'}`}>
              <i className={`fas ${passwordsMatch ? 'fa-check' : 'fa-times'}`}></i>
              {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
            </div>
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
          disabled={loading || !passwordValidation.isValid || !passwordsMatch}
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
          Back to Verification
        </button>
      </form>

      <div className="help-text">
        <p>
          <i className="fas fa-shield-alt"></i>
          Your password is encrypted and secure. Make sure to use a strong password.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
