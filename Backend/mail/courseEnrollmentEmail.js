exports.courseEnrollmentEmail = (courseName, firstname, lastname) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to Your New Course</title>
      <style>
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f3f4f6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 650px;
          margin: 30px auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          padding: 40px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #eee;
        }
        .header h1 {
          color: #2563eb;
          font-size: 26px;
        }
        .content {
          margin-top: 25px;
          font-size: 16px;
          line-height: 1.7;
          color: #444;
        }
        .content strong {
          color: #111;
        }
        .highlight {
          font-size: 20px;
          font-weight: bold;
          color: #2563eb;
        }
        .button {
          display: inline-block;
          margin-top: 25px;
          padding: 14px 28px;
          background-color: #2563eb;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .footer {
          margin-top: 35px;
          font-size: 13px;
          color: #888;
          text-align: center;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Welcome to ${courseName}!</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${firstname} ${lastname}</strong>,</p>
          <p>We’re thrilled to let you know that you have been <strong>successfully enrolled</strong> in the course:</p>
          <p class="highlight">${courseName}</p>
          <p>This is the beginning of your new learning journey. Dive into the lessons, complete challenges, and level up your skills 🚀</p>
          <a href="http://localhost:3000/dashboard" class="button">Start Learning Now</a>
        </div>
        <div class="footer">
          <p>Need help? Reach out to us at <a href="mailto:support@learnhub.com">support@learnhub.com</a></p>
          <p>&copy; ${new Date().getFullYear()} LearnHub • All Rights Reserved</p>
        </div>
      </div>
    </body>
  </html>
  `;
};
