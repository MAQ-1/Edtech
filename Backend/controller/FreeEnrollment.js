const Course = require("../model/Course");
const User = require("../model/User");
const CourseProgress = require("../model/CourseProgress");

// Free enrollment for students
exports.freeEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    console.log('FREE ENROLLMENT - Course ID:', courseId);
    console.log('FREE ENROLLMENT - User ID:', userId);

    // Validate course ID
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if student is already enrolled in THIS specific course
    const isAlreadyEnrolled = course.studentEnrolled && course.studentEnrolled.some(studentId => 
      studentId.toString() === userId.toString()
    );
    
    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this specific course"
      });
    }

    // Enroll the student in the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentEnrolled: userId } },
      { new: true }
    );

    // Create course progress for the student
    const courseProgress = await CourseProgress.create({
      courseId: courseId,
      userId: userId,
      completedVideo: [],
    });

    // Add course to student's enrolled courses
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          course: courseId,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    );

    console.log('FREE ENROLLMENT - Success');
    console.log('FREE ENROLLMENT - Final course enrolled students:', updatedCourse?.studentEnrolled);
    console.log('FREE ENROLLMENT - Final user courses:', updatedUser?.course);

    return res.status(200).json({
      success: true,
      message: "Successfully enrolled in the course for free!",
      data: {
        course: updatedCourse,
        courseProgress: courseProgress
      }
    });

  } catch (error) {
    console.log('FREE ENROLLMENT - Error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};