const Course = require("../model/Course");
const Category = require("../model/Category");
const User = require("../model/User");
const {uploadImage}=require("../utils/ImageUploader");

// createCourse handler 

exports.createCourse = async (req, res) => {
  try {
    console.log('CREATE COURSE - Request body:', req.body);
    console.log('CREATE COURSE - Request files:', req.files);
    console.log('CREATE COURSE - Request user:', req.user);
    
    // Fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tags, category } = req.body;

    // Get thumbnail (express-fileupload puts it inside req.files)
    const thumbnail = req.files?.thumbnail;
    console.log('CREATE COURSE - Thumbnail:', thumbnail);

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail file missing",
      });
    }
    

    // Validation logs
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tags) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check instructor
    const userId = req.user._id;
    const instructorDetails = await User.findById(userId);
    console.log("instructorDetails:", instructorDetails);
    console.log(userId);

    if (!instructorDetails) {
      return res.status(404).json({ error: "Instructor not found" });
    }

    // Check if given category is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Upload image to Cloudinary (express-fileupload gives .tempFilePath)
   const uploadResponse = await uploadImage(thumbnail, "course_thumbnails", 720, 80);

    console.log("Image",uploadResponse);

    // Create a new course entry
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price: Number(price),
      tags: Array.isArray(tags) ? tags : [tags],
      thumbnail: uploadResponse.secure_url,
      instructor: instructorDetails._id,
      categories: categoryDetails._id
    });

    // Update the user
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Update the category schema
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Return response
    res.status(201).json({
      message: "Course created successfully",
      data: newCourse
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};


// get all course ---------------------------------------------------------------------------------------------------------------------------------

exports.allCourses = async (req , res )=>{
    try {

       
        const allCourses = await Course.find(
            {},{courseName:true,
                courseDescription:true,
                whatYouWillLearn:true,
                price:true,
                Tag:true,
                thumbnail:true,
                instructor: true
            }).populate("instructor", "name").populate("instructor").exec();
        res.status(200).json({
            message: "All courses fetched successfully",
            data: allCourses
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}


// get courses details -----------------------------------------------------------------------------------------------------------
exports.getCoursesDetails = async (req , res)=>{
    try{
        // get data 
           const {courseId} = req.body;
        // find course details 
             const courseDetails = await Course.findById(
                {_id:courseId}
             ).populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                }
             })//.populate("category")
               // .populate("ratingAndReview")
               .populate({
                path:"courseContent",
                populate:{
                    path:"subSection"
                },
            })
            .exec();   

        //validation 

        if(!courseDetails) {
            return res.status(404).json({
                success: false,
                error: `Course not found with id ${courseId}`
            });
        }

        res.status(200).json({
            message: "Course details fetched successfully",
            data: courseDetails
        });
    } catch(error){
        console.log("Unable fetch Course Detail")
        res.status(500).json({
            success:false,
            error: error.message
        });
    }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    console.log('=== EDIT COURSE CALLED ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request user:', req.user);
    
    const { courseId } = req.body
    const updates = req.body
    
    console.log('Course ID:', courseId);
    console.log('Updates:', updates);
    
    if (!courseId) {
      return res.status(400).json({ 
        success: false,
        error: "Course ID is required" 
      });
    }
    
    const course = await Course.findById(courseId)
    console.log('Course found:', !!course);

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files && req.files.thumbnail) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnail
      const thumbnailImage = await uploadImage(thumbnail, "course_thumbnails", 720, 80)
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key) && key !== 'courseId') {
        if (key === "tags") {
          course[key] = Array.isArray(updates[key]) ? updates[key] : [updates[key]]
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("categories")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error('=== EDIT COURSE ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
      error: error.message,
    })
  }
}

// Get All Published Courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}

// Get Course Details (Updated version)
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    console.log('GET COURSE DETAILS - Course ID:', courseId)
    
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("categories")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    console.log('GET COURSE DETAILS - Course found:', !!courseDetails)
    console.log('GET COURSE DETAILS - Instructor data:', courseDetails?.instructor)
    
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
      },
    })
  } catch (error) {
    console.log('GET COURSE DETAILS - Error:', error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get Full Course Details (with video URLs)
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user._id
    
    console.log('GET FULL COURSE DETAILS - Course ID:', courseId)
    console.log('GET FULL COURSE DETAILS - User ID:', userId)
    
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("categories")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    console.log('GET FULL COURSE DETAILS - Course found:', !!courseDetails)
    console.log('GET FULL COURSE DETAILS - Course name:', courseDetails?.courseName)
    console.log('GET FULL COURSE DETAILS - Course content length:', courseDetails?.courseContent?.length)
    console.log('GET FULL COURSE DETAILS - Course content:', courseDetails?.courseContent)
    console.log('GET FULL COURSE DETAILS - Enrolled students:', courseDetails?.studentEnrolled)
    
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // Check if user is enrolled
    const isEnrolled = courseDetails.studentEnrolled && courseDetails.studentEnrolled.includes(userId)
    console.log('GET FULL COURSE DETAILS - Is user enrolled:', isEnrolled)
    
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      })
    }

    // Get course progress
    const CourseProgress = require("../model/CourseProgress")
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId
    })
    
    console.log('GET FULL COURSE DETAILS - Course progress found:', !!courseProgress)
    console.log('GET FULL COURSE DETAILS - Course progress data:', courseProgress)
    console.log('GET FULL COURSE DETAILS - completedVideo field:', courseProgress?.completedVideo)
    console.log('GET FULL COURSE DETAILS - completedVideos field:', courseProgress?.completedVideos)
    
    // If no course progress exists, create one
    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideo: []
      })
      console.log('GET FULL COURSE DETAILS - Created new course progress')
    }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        completedVideos: courseProgress.completedVideo || [],
      },
    })
  } catch (error) {
    console.error('GET FULL COURSE DETAILS - Error:', error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get Instructor Courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user._id

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

// Update Course Progress
exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.body
    const userId = req.user._id

    if (!courseId || !subsectionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Subsection ID are required"
      })
    }

    const CourseProgress = require("../model/CourseProgress")
    
    // Find course progress for this user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId
    })

    // If course progress doesn't exist, create it
    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: []
      })
      console.log('Created new course progress:', courseProgress)
    }

    // Initialize completedVideos array if it doesn't exist
    if (!courseProgress.completedVideos) {
      courseProgress.completedVideos = []
    }

    // Add subsection to completed videos if not already completed
    if (!courseProgress.completedVideos.includes(subsectionId)) {
      courseProgress.completedVideos.push(subsectionId)
      await courseProgress.save()
    }

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      data: courseProgress
    })

  } catch (error) {
    console.error('UPDATE COURSE PROGRESS ERROR:', error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    console.log('=== DELETE COURSE ===');
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    
    const { courseId } = req.body
    console.log('Course ID to delete:', courseId);
    
    const Section = require("../model/Section")
    const SubSection = require("../model/Subsection")

    const course = await Course.findById(courseId)
    console.log('Course found:', !!course);
    
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: "Course not found" 
      })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentEnrolled || []
    console.log('Students enrolled:', studentsEnrolled.length);
    
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent || []
    console.log('Course sections:', courseSections.length);
    
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection || []
        console.log('Deleting subsections:', subSections.length);
        
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)
    console.log('Course deleted successfully');

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error('DELETE COURSE ERROR:', error)
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}