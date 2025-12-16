const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    // Check if required environment variables are set
    if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
      throw new Error("Mail credentials not configured in environment variables");
    }

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: process.env.MAIL_PORT || 587,
      secure: process.env.MAIL_SECURE === "true" || false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USERNAME}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.log("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = mailSender;