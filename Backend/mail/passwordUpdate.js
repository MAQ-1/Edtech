exports.passwordUpdateEmail = (firstname, lastname) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Changed</title>
      <style>
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background:#f3f4f6; padding:0; margin:0; }
        .container { max-width:600px; margin:30px auto; background:#fff; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.1); padding:40px; }
        .header { text-align:center; border-bottom:2px solid #eee; padding-bottom:20px; }
        .header h1 { color:#16a34a; font-size:24px; }
        .content { margin-top:20px; font-size:16px; line-height:1.6; color:#444; }
        .footer { margin-top:30px; font-size:13px; color:#888; text-align:center; border-top:1px solid #eee; padding-top:15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>✅ Password Updated Successfully</h1></div>
        <div class="content">
          <p>Hello <strong>${firstname} ${lastname}</strong>,</p>
          <p>Your account password was changed successfully. If this was you, no action is required.</p>
          <p>If you did <strong>not</strong> make this change, please reset your password immediately and contact support.</p>
        </div>
        <div class="footer">&copy; ${new Date().getFullYear()} LearnHub • All Rights Reserved</div>
      </div>
    </body>
  </html>
  `;
};
