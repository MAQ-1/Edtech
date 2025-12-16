const express = require("express");
const router = express.Router();

const { updateProfile, deleteProfile, getProfileDetails, getEnrolledCourses, updateDisplayPicture } = require("../controller/Profile");
const { auth } = require("../middleware/auth");

// Profile routes
router.put("/updateProfile", auth, updateProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.delete("/deleteProfile", auth, deleteProfile);
router.get("/getUserDetails", auth, getProfileDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);   

module.exports = router;