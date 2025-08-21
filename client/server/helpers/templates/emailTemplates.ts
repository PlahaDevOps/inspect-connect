
export const resetEmailTemplate = (resetPasswordLink: string, logoImageLink: string, userName: string): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 500px; width: 90%;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${logoImageLink}" alt="Logo" style="max-width: 200px; height: auto;">
            </div>
            <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Reset Your Password</h1>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hello ${userName},
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
              <a href="${resetPasswordLink}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px; font-size: 14px;">
              If you didn't request this password reset, you can safely ignore this email. The link will expire in 10 minutes.
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser: ${resetPasswordLink}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  
export const welcomeHtml = (bgImageLink: string, logoImageLink: string): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to our platform</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
        <div style="background-image: url('${bgImageLink}'); background-size: cover; background-position: center; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 500px; width: 90%;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${logoImageLink}" alt="Logo" style="max-width: 200px; height: auto;">
            </div>
            <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Welcome</h1>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining our platform! Your account has been successfully created and your free trial has started.
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We're excited to have you on board and can't wait to see what you'll create with our platform.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  