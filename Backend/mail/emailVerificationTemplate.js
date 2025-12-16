exports.emailVerificationTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
      <style>
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background:#f3f4f6; padding:0; margin:0; }
        .container { max-width:600px; margin:30px auto; background:#fff; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.1); padding:40px; }
        .header { text-align:center; border-bottom:2px solid #eee; padding-bottom:20px; }
        .header h1 { color:#2563eb; font-size:24px; }
        .content { margin-top:20px; font-size:16px; line-height:1.6; color:#444; }
        .otp-box { margin:20px 0; padding:15px; background:#2563eb; color:#fff; font-size:22px; font-weight:bold; text-align:center; border-radius:6px; }
        .footer { margin-top:30px; font-size:13px; color:#888; text-align:center; border-top:1px solid #eee; padding-top:15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>🔐 Email Verification</h1></div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to verify your email address. Use the OTP below to complete the verification process:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP will expire in <strong>10 minutes</strong>. Please do not share it with anyone for your security.</p>
        </div>
        <div class="footer">&copy; ${new Date().getFullYear()} LearnHub • All Rights Reserved</div>
      </div>
    </body>
  </html>
  `;
};
