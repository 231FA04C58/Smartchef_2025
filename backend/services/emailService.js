const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Gmail SMTP configuration - Use EMAIL_USER/EMAIL_PASS or fallback to SMTP_USER/SMTP_PASS
    const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    // Only create transporter if credentials are available
    if (emailUser && emailPass) {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      // Verify connection configuration (non-blocking, wrapped in try/catch)
      this.transporter.verify((error, success) => {
        if (error) {
          console.log('❌ Email service configuration error:', error.message);
          console.log('⚠️ Email functionality will be disabled until configured properly');
        } else {
          console.log('✅ Email service is ready to send messages');
        }
      });
    } else {
      console.log('⚠️ Email service not configured: EMAIL_USER and EMAIL_PASS not set');
      console.log('⚠️ Email functionality will be disabled');
    }
  }

  async sendOTPEmail(email, otp, type = 'password-reset') {
    // Check if transporter is available
    if (!this.transporter) {
      console.warn('⚠️ Email service not configured, skipping email send');
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    try {
      let subject, htmlContent;

      switch (type) {
        case 'password-reset':
          subject = 'SmartChef - Password Reset OTP';
          htmlContent = this.getPasswordResetTemplate(otp);
          break;
        case 'email-verification':
          subject = 'SmartChef - Email Verification OTP';
          htmlContent = this.getEmailVerificationTemplate(otp);
          break;
        case 'login':
          subject = 'SmartChef - Login OTP';
          htmlContent = this.getLoginOTPTemplate(otp);
          break;
        default:
          subject = 'SmartChef - Verification Code';
          htmlContent = this.getGenericOTPTemplate(otp);
      }

      const mailOptions = {
        from: `"SmartChef" <${process.env.SMTP_FROM || 'noreply@smartchef.com'}>`,
        to: email,
        subject: subject,
        html: htmlContent,
        text: `Your SmartChef verification code is: ${otp}. This code will expire in 10 minutes.`
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // In development with Ethereal, log the preview URL
      if (process.env.NODE_ENV === 'development' && info.messageId) {
        console.log('📧 Email sent successfully');
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info)
      };

    } catch (error) {
      console.error('❌ Error sending email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getPasswordResetTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - SmartChef</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; margin: 20px 0; border-radius: 8px; }
          .reset-link { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍳 SmartChef</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>We received a request to reset your password for your SmartChef account.</p>
            <p>Please use the following verification code to reset your password:</p>
            
            <div class="otp-code">${otp}</div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This code will expire in 10 minutes</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Never share this code with anyone</li>
              </ul>
            </div>
            
            <p>If you have any questions, please contact our support team.</p>
            <p>Happy Cooking!<br>The SmartChef Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2025 SmartChef. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetLinkTemplate(resetLink) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - SmartChef</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reset-button { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
          .reset-button:hover { background: #5568d3; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍳 SmartChef</h1>
            <h2>Reset Your Password</h2>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>We received a request to reset your password for your SmartChef account.</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="reset-button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">${resetLink}</p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>If you have any questions, please contact our support team.</p>
            <p>Happy Cooking!<br>The SmartChef Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2025 SmartChef. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getEmailVerificationTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - SmartChef</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍳 SmartChef</h1>
            <h2>Email Verification</h2>
          </div>
          <div class="content">
            <p>Welcome to SmartChef!</p>
            <p>Please verify your email address using the code below:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p>This code will expire in 10 minutes.</p>
            <p>Happy Cooking!<br>The SmartChef Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 SmartChef. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getLoginOTPTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Verification - SmartChef</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍳 SmartChef</h1>
            <h2>Login Verification</h2>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>Someone is trying to log into your SmartChef account. If this is you, please use the verification code below:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this login, please secure your account immediately.</p>
            <p>Happy Cooking!<br>The SmartChef Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 SmartChef. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getGenericOTPTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code - SmartChef</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍳 SmartChef</h1>
            <h2>Verification Code</h2>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>Please use the following verification code:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p>This code will expire in 10 minutes.</p>
            <p>Happy Cooking!<br>The SmartChef Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 SmartChef. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendPasswordResetEmail(email, resetLink, resetToken) {
    // Check if transporter is available
    if (!this.transporter) {
      console.warn('⚠️ Email service not configured, skipping email send');
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    try {
      const subject = 'SmartChef - Reset Your Password';
      const htmlContent = this.getPasswordResetLinkTemplate(resetLink);

      const mailOptions = {
        from: `"SmartChef" <${process.env.SMTP_FROM || 'noreply@smartchef.com'}>`,
        to: email,
        subject: subject,
        html: htmlContent,
        text: `Reset your SmartChef password by clicking this link: ${resetLink}. This link will expire in 1 hour.`
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // In development with Ethereal, log the preview URL
      if (process.env.NODE_ENV === 'development' && info.messageId) {
        console.log('📧 Password reset email sent successfully');
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info)
      };

    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendWelcomeEmail(email, username) {
    // Check if transporter is available
    if (!this.transporter) {
      console.warn('⚠️ Email service not configured, skipping email send');
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SmartChef</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍳 SmartChef</h1>
              <h2>Welcome to SmartChef!</h2>
            </div>
            <div class="content">
              <p>Hello ${username}!</p>
              <p>Welcome to SmartChef - your intelligent recipe finder and meal planner!</p>
              <p>You can now:</p>
              <ul>
                <li>Discover amazing recipes</li>
                <li>Plan your meals</li>
                <li>Generate shopping lists</li>
                <li>Save your favorite recipes</li>
                <li>Get personalized recommendations</li>
              </ul>
              <p>Start exploring and happy cooking!</p>
              <p>The SmartChef Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 SmartChef. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"SmartChef" <${process.env.SMTP_FROM || 'noreply@smartchef.com'}>`,
        to: email,
        subject: 'Welcome to SmartChef!',
        html: htmlContent
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId
      };

    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new EmailService();
