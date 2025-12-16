const express = require("express");
const router = express.Router();

const { createSection, updateSection, deleteSection } = require("../controller/Section");
const { createSubSection, updateSubsection, deleteSubsection } = require("../controller/Subsection");

const { createRating, getAverageRating, getAllRatings } = require("../controller/RatingAndReview");
const { createCategory, showAllCategories , categoryPageDetails, getCategoryWisePage } = require("../controller/Category");

const { createCourse, allCourses, getCoursesDetails, editCourse, getAllCourses, getCourseDetails, getFullCourseDetails, getInstructorCourses, deleteCourse, updateCourseProgress } = require("../controller/Course");
const { updateCourseProgress: updateProgress } = require("../controller/CourseProgress");
const { freeEnrollment } = require("../controller/FreeEnrollment");
const { auth, isAdmin, isStudent } = require("../middleware/auth");

// Section routes
router.put("/section/update", updateSection);         
router.post("/section/create", createSection);        
router.post("/section/delete", deleteSection); 

// Subsection routes
router.post("/subsection/create", auth, createSubSection);         
router.put("/subsection/update", auth, updateSubsection ); 
router.post("/subsection/delete", auth, deleteSubsection);

// Rating & Review routes
router.post("/rating/create", auth, createRating);   
router.get("/rating/average", getAverageRating); 
router.get("/rating/all", getAllRatings);
router.get("/getReviews", getAllRatings);     

// Category routes 
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);     
router.post("/getCategoryPageDetails", categoryPageDetails);
router.get("/getCategoryWise", getCategoryWisePage);

// Courses
router.post("/createCourse", auth, createCourse);
router.post("/editCourse", auth, (req, res) => {
  console.log('Edit course route hit');
  console.log('Request body:', req.body);
  try {
    return editCourse(req, res);
  } catch (error) {
    console.error('Route error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/getAllCourses", allCourses);               
router.post("/getCourseDetails", getCourseDetails);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.post("/updateCourseProgress", auth, updateProgress);
router.post("/createRating", auth, createRating);
router.get("/getInstructorCourses", auth, getInstructorCourses);
router.delete("/deleteCourse", auth, deleteCourse);
router.post("/freeEnrollment", auth, isStudent, freeEnrollment);

module.exports = router;
