exports.contactUsEmail = (
    email,
    firstname,
    lastname,
    message,
    phoneNo,
    countrycode
  ) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Confirmation - StudyNotion</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                padding: 20px;
            }
            .email-wrapper {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #FFD60A 0%, #FF8500 100%);
                padding: 40px 30px;
                text-align: center;
                color: #000;
            }
            .logo {
                max-width: 180px;
                margin-bottom: 20px;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
            }
            .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 20px;
                font-weight: 600;
                color: #2d3748;
                margin-bottom: 20px;
            }
            .message-text {
                font-size: 16px;
                color: #4a5568;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            .details-card {
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border-radius: 15px;
                padding: 25px;
                margin: 25px 0;
                border-left: 5px solid #FFD60A;
            }
            .details-title {
                font-size: 18px;
                font-weight: 600;
                color: #2d3748;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }
            .detail-item {
                display: flex;
                margin-bottom: 12px;
                align-items: flex-start;
            }
            .detail-label {
                font-weight: 600;
                color: #4a5568;
                min-width: 100px;
                margin-right: 10px;
            }
            .detail-value {
                color: #2d3748;
                flex: 1;
                word-break: break-word;
            }
            .message-box {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 15px;
                border-left: 4px solid #667eea;
                font-style: italic;
                color: #495057;
            }
            .cta-section {
                text-align: center;
                margin: 30px 0;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
            }
            .footer {
                background: #2d3748;
                color: #a0aec0;
                padding: 30px;
                text-align: center;
            }
            .footer-text {
                font-size: 14px;
                margin-bottom: 15px;
            }
            .footer a {
                color: #FFD60A;
                text-decoration: none;
                font-weight: 600;
            }
            .social-links {
                margin-top: 20px;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #FFD60A, transparent);
                margin: 20px 0;
            }
            @media (max-width: 600px) {
                .email-wrapper {
                    margin: 10px;
                    border-radius: 15px;
                }
                .header, .content, .footer {
                    padding: 25px 20px;
                }
                .header h1 {
                    font-size: 24px;
                }
                .details-card {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="header">
                <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
                <h1>Thank You for Contacting Us!</h1>
                <p>We've received your message and will get back to you soon</p>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${firstname} ${lastname}! 👋</div>
                
                <div class="message-text">
                    Thank you for reaching out to StudyNotion! We're excited to connect with you and appreciate your interest in our platform. Your message has been successfully received and our team will review it carefully.
                </div>
                
                <div class="divider"></div>
                
                <div class="details-card">
                    <div class="details-title">📋 Your Submission Details</div>
                    <div class="detail-item">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${firstname} ${lastname}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${countrycode} ${phoneNo}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Message:</span>
                        <div class="message-box">${message}</div>
                    </div>
                </div>
                
                <div class="message-text">
                    Our team typically responds within 24-48 hours during business days. In the meantime, feel free to explore our courses and resources.
                </div>
                
                <div class="cta-section">
                    <a href="https://studynotion-edtech-project.vercel.app" class="cta-button">Explore Our Courses</a>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-text">
                    Need immediate assistance? Contact us at <a href="mailto:info@studynotion.com">info@studynotion.com</a>
                </div>
                <div class="footer-text">
                    © 2024 StudyNotion. Empowering learners worldwide.
                </div>
                <div class="social-links">
                    <span>Follow us for updates and learning tips! 🚀</span>
                </div>
            </div>
        </div>
    </body>
    </html>`
  }