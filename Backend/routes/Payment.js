const express = require("express");
const router = express.Router();

const { capturePayment, verifyPayment } = require("../controller/Payment");
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
// Payment routes
router.post("/capturePayment",auth ,isStudent, capturePayment);   
router.post("/verifyPayment",auth, isStudent, verifyPayment);    


module.exports = router;
