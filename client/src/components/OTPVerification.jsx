import { useState, useEffect, useRef } from 'react';
import { verifyOTP, resendOTP } from '../services/otpService';

const OTPVerification = ({ email, onVerified, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    setError('');
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyOTP(email, otpString);
      onVerified(response.data.resetToken);
    } catch (error) {
      setError(error.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      await resendOTP(email);
      setResendCooldown(60); // 1 minute cooldown
      setTimeLeft(600); // Reset timer
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError(error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="otp-verification-form">
      <div className="form-header">
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit code to <strong>{email}</strong></p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={loading}
              className={`otp-digit ${error ? 'error' : ''}`}
            />
          ))}
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <div className="timer-info">
          <i className="fas fa-clock"></i>
          <span>Code expires in {formatTime(timeLeft)}</span>
        </div>

        <button 
          type="submit" 
          className="btn primary full-width"
          disabled={loading || otp.join('').length !== 6 || timeLeft === 0}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Verifying...
            </>
          ) : (
            <>
              <i className="fas fa-check"></i>
              Verify Code
            </>
          )}
        </button>

        <div className="resend-section">
          <button 
            type="button" 
            className="btn-link"
            onClick={handleResend}
            disabled={resendLoading || resendCooldown > 0}
          >
            {resendLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              <>
                <i className="fas fa-redo"></i>
                Resend Code
              </>
            )}
          </button>
        </div>

        <button 
          type="button" 
          className="btn secondary full-width"
          onClick={onBack}
          disabled={loading}
        >
          <i className="fas fa-arrow-left"></i>
          Back to Email
        </button>
      </form>

      <div className="help-text">
        <p>
          <i className="fas fa-info-circle"></i>
          Didn't receive the code? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
