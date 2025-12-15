const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // For development, we'll use a simple console log
    // In production, you would configure with real SMTP settings
    this.transporter = nodemailer.createTransport({
      // For development - logs emails to console
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }

  async sendVerificationEmail(email, token, username) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@devflow.ai',
      to: email,
      subject: '🚀 Verify your DevFlow AI account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #667eea; margin-bottom: 20px;">🎉 Welcome to DevFlow AI!</h1>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hi <strong>${username}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
              Thank you for registering with DevFlow AI! To complete your registration and secure your account, please verify your email address by clicking the button below:
            </p>
            
            <a href="${verificationUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; margin-bottom: 30px;">
              ✨ Verify My Email
            </a>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
              Or copy and paste this link in your browser:
            </p>
            
            <p style="font-size: 12px; color: #999; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 30px;">
              ${verificationUrl}
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                🔒 <strong>Why verify your email?</strong>
              </p>
              <ul style="text-align: left; font-size: 14px; color: #666; margin-bottom: 20px;">
                <li>✅ Secure your account</li>
                <li>✅ Enable password recovery</li>
                <li>✅ Receive important updates</li>
                <li>✅ Access all DevFlow AI features</li>
              </ul>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
              This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
            </p>
            
            <p style="font-size: 12px; color: #999; margin-top: 10px;">
              Best regards,<br>
              The DevFlow AI Team 🚀
            </p>
          </div>
        </div>
      `
    };

    try {
      // For development - just log the email
      console.log('\n📧 EMAIL VERIFICATION SENT:');
      console.log('To:', email);
      console.log('Subject:', mailOptions.subject);
      console.log('Verification URL:', verificationUrl);
      console.log('Token:', token);
      console.log('\n--- EMAIL CONTENT ---');
      console.log(mailOptions.html);
      console.log('--- END EMAIL ---\n');

      // In production, uncomment this line to actually send emails:
      // await this.transporter.sendMail(mailOptions);
      
      return { success: true, verificationUrl };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, username) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@devflow.ai',
      to: email,
      subject: '🎉 Welcome to DevFlow AI - Account Verified!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #667eea; margin-bottom: 20px;">🎉 Account Verified Successfully!</h1>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hi <strong>${username}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
              Congratulations! Your DevFlow AI account has been successfully verified. You can now access all features and start automating your development workflow.
            </p>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; margin-bottom: 30px;">
              🚀 Go to Dashboard
            </a>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                🌟 <strong>What's next?</strong>
              </p>
              <ul style="text-align: left; font-size: 14px; color: #666; margin-bottom: 20px;">
                <li>🔗 Connect your GitHub account</li>
                <li>📊 Explore your dashboard</li>
                <li>🤖 Try GitHub Copilot integration</li>
                <li>⚡ Set up workflow automation</li>
              </ul>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
              Need help? Contact us or check our documentation.
            </p>
            
            <p style="font-size: 12px; color: #999; margin-top: 10px;">
              Happy coding!<br>
              The DevFlow AI Team 🚀
            </p>
          </div>
        </div>
      `
    };

    try {
      console.log('\n🎉 WELCOME EMAIL SENT:');
      console.log('To:', email);
      console.log('Subject:', mailOptions.subject);
      
      return { success: true };
    } catch (error) {
      console.error('Welcome email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();