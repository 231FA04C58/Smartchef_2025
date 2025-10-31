const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    length: 6
  },
  type: {
    type: String,
    enum: ['password-reset', 'email-verification', 'login'],
    required: [true, 'OTP type is required'],
    default: 'password-reset'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better performance
otpSchema.index({ email: 1, type: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Static method to create OTP
otpSchema.statics.createOTP = async function(email, type = 'password-reset', ipAddress = '', userAgent = '') {
  try {
    // Delete any existing OTPs for this email and type
    await this.deleteMany({ email, type });
    
    // Generate new OTP
    const otp = this.generateOTP();
    
    // Create OTP document
    const otpDoc = new this({
      email,
      otp,
      type,
      ipAddress,
      userAgent
    });
    
    await otpDoc.save();
    return otpDoc;
  } catch (error) {
    throw new Error('Failed to create OTP');
  }
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(email, otp, type = 'password-reset') {
  try {
    const otpDoc = await this.findOne({
      email,
      otp,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpDoc) {
      return { valid: false, message: 'Invalid or expired OTP' };
    }
    
    // Check attempts
    if (otpDoc.attempts >= 3) {
      await this.deleteOne({ _id: otpDoc._id });
      return { valid: false, message: 'Too many attempts. OTP has been invalidated.' };
    }
    
    // Mark as used
    otpDoc.isUsed = true;
    await otpDoc.save();
    
    return { valid: true, message: 'OTP verified successfully' };
  } catch (error) {
    return { valid: false, message: 'Error verifying OTP' };
  }
};

// Static method to increment attempts
otpSchema.statics.incrementAttempts = async function(email, otp, type = 'password-reset') {
  try {
    const otpDoc = await this.findOne({
      email,
      otp,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (otpDoc) {
      otpDoc.attempts += 1;
      await otpDoc.save();
    }
  } catch (error) {
    // Silently fail - this is just for tracking attempts
  }
};

// Static method to cleanup expired OTPs
otpSchema.statics.cleanupExpired = async function() {
  try {
    const result = await this.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
    return 0;
  }
};

module.exports = mongoose.model('OTP', otpSchema);
