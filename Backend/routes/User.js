const express = require("express");
const router = express.Router();

const { SendOtp, signUp, login, changePassword } = require("../controller/Auth");
const { resetPasswordToken, resetPassword } = require("../controller/ResetPass");
const { auth } = require("../middleware/auth")
// Auth routes
router.post("/send-otp", SendOtp);             
router.post("/signup", signUp);                
router.post("/login", login);                 
router.post("/change-password",auth, changePassword);

// Test email endpoint
router.post("/test-email", async (req, res) => {
    const mailsender = require("../utils/mailsender");
    try {
        await mailsender(req.body.email, "Test Email", "<h1>Test email working!</h1>");
        res.json({ success: true, message: "Test email sent" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}); 

// Reset password routes
router.post("/reset-password-token", resetPasswordToken); 
router.post("/reset-password", resetPassword);            

module.exports = router;
