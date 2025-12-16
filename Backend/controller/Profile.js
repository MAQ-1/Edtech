const Profile = require("../model/Profile");
const User = require("../model/User");
const Course = require("../model/Course");
const CourseProgress = require("../model/CourseProgress");
const mailSender = require("../utils/mailsender");
const { uploadImage } = require("../utils/ImageUploader");


exports.updateDisplayPicture = async (req, res) => {
  try {
    console.log("=== updateDisplayPicture called ===");
    console.log("req.files:", req.files);
    console.log("req.user:", req.user);
    
    const userId = req.user.id || req.user._id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in request"
      });
    }
    
    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }
    
    const displayPicture = req.files.displayPicture;
    
    // Upload image to cloudinary
    const image = await uploadImage(displayPicture, "CoderArea", 500, "auto");
    
    // Update user's images field (it's an array in the User model)
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { images: [image.secure_url] },
      { new: true }
    ).populate("additionalDetails");
    
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    return res.json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile
    });
    
  } catch (error) {
    console.error("=== Error in updateDisplayPicture ===");
    console.error("Error details:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating display picture: " + error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log("=== updateProfile called ===");
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);
    
    const {
      firstname = "",
      lastname = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;

    const id = req.user.id || req.user._id;
    console.log("User ID:", id);

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID not found in request" 
      });
    }

    // Find user
    const userDetails = await User.findById(id);
    console.log("User found:", !!userDetails);
    
    if (!userDetails) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("User additionalDetails ID:", userDetails.additionalDetails);

    // Find profile
    const profile = await Profile.findById(userDetails.additionalDetails);
    console.log("Profile found:", !!profile);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: "Profile not found" 
      });
    }

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstname, lastname },
      { new: true }
    );
    console.log("User updated:", !!updatedUser);

    // Update profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contact = contactNumber; // Profile model uses 'contact' not 'contactNumber'
    profile.gender = gender;

    // If profilePic file is sent
    if (req.files && req.files.profilePic) {
      console.log("Profile pic file found, uploading...");
      const file = req.files.profilePic;

      try {
        const result = await uploadImage(file, "CoderArea", 500, "auto");
        profile.profilePic = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        console.log("Profile pic uploaded successfully");
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        // Continue without failing the entire update
      }
    }

    await profile.save();
    console.log("Profile saved successfully");

    // Fetch updated details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    
    console.log("Final updated user details fetched:", !!updatedUserDetails);

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.error("=== Error in updateProfile ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};



// delete----------------------------------------------------------------------------------------------------------------------------------------

exports.deleteProfile = async (req, res) => {
    try {
        console.log("=== deleteProfile called ===");
        console.log("req.user:", req.user);
        
        // get user id
        const userId = req.user.id || req.user._id;
        console.log("Printing Id", userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in request"
            });
        }

        // find user
        const userDetails = await User.findById(userId);
        console.log("User Details found:", !!userDetails);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const profileId = userDetails.additionalDetails;

        // validation
        if (!profileId) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // send email immediately
        const displayName = userDetails.firstname
            ? `${userDetails.firstname} ${userDetails.lastname || ""}`.trim()
            : (userDetails.name || userDetails.email);

        try {
            await mailSender(
                userDetails.email,
                "Account Deletion Scheduled",
                `<h2>Hello ${displayName}</h2>
                 <p>Your account and profile are scheduled to be deleted in 24 hours.</p>
                 <p>If this was not intended, please contact support immediately.</p>`
            );
            console.log("Deletion email sent to:", userDetails.email);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // Continue with deletion even if email fails
        }

        // schedule deletion after 24 hours
        const deletionDelay = 24 * 60 * 60 * 1000;
        setTimeout(async () => {
            try {
                await Profile.findByIdAndDelete(profileId);
                await User.findByIdAndDelete(userId);
                console.log(`Profile and user ${userId} deleted successfully after delay.`);
            } catch (err) {
                console.error("Error during scheduled deletion:", err);
            }
        }, deletionDelay);

        // return response
        return res.status(200).json({
            success: true,
            message: "Account deletion scheduled successfully"
        });

    } catch (error) {
        console.error("=== Error in deleteProfile ===");
        console.error("Error details:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

//get All Details ------------------------------------------------------------------------------------------------------------------------------------------------------------------

exports.getProfileDetails = async (req, res) => {
  try {
    console.log("=== getProfileDetails called ===");
    console.log("req.user:", req.user);
    console.log("req.params:", req.params);

    // fetch data
    const userId = req.params.userId || req.user.id || req.user._id;
    console.log("Fetching profile for userId:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found"
      });
    }

    // get user details
    const userDetails = await User.findById(userId).populate("additionalDetails");

    console.log("Fetched userDetails:", !!userDetails);
    console.log("userDetails.additionalDetails:", !!userDetails?.additionalDetails);

     // validate
    if (!userDetails) {
      return res.status(404).json({
         success: false, message: "User not found" 
        });
    }
    if (!userDetails.additionalDetails) {
      return res.status(404).json({
         success: false, message: "Profile not found" 
        });
    }
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: userDetails.additionalDetails
    });
  } catch (error) {
    console.error("=== Error in getProfileDetails ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

// Get Enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    console.log("=== getEnrolledCourses called ===");
    console.log("req.user:", req.user);
    
    const userId = req.user.id || req.user._id;
    console.log("Fetching enrolled courses for userId:", userId);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in request",
      });
    }
    
    // First, get user with detailed course population
    let userDetails = await User.findById(userId).populate({
      path: "course",
      populate: [
        {
          path: "instructor",
          select: "firstname lastname email"
        },
        {
          path: "courseContent",
          populate: {
            path: "subSection"
          }
        }
      ]
    });
    console.log("User found:", !!userDetails);
    console.log("User raw course field:", userDetails?.course);
    console.log("User courses count:", userDetails?.course?.length || 0);
    
    // Also check the raw user document
    const rawUser = await User.findById(userId);
    console.log("Raw user course field:", rawUser?.course);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    // If user has no enrolled courses, return empty array
    if (!userDetails.course || userDetails.course.length === 0) {
      console.log("No courses found for user");
      return res.status(200).json({
        success: true,
        data: [],
        message: "No enrolled courses found"
      });
    }

    // Calculate progress for each course
    const coursesWithProgress = await Promise.all(
      userDetails.course.map(async (course) => {
        // Get course progress for this user and course
        const courseProgress = await CourseProgress.findOne({
          courseId: course._id,
          userId: userId
        });

        // Calculate total lectures in the course
        let totalLectures = 0;
        if (course.courseContent && Array.isArray(course.courseContent)) {
          course.courseContent.forEach((section) => {
            if (section.subSection && Array.isArray(section.subSection)) {
              totalLectures += section.subSection.length;
            }
          });
        }

        // Calculate progress percentage
        const completedLectures = courseProgress?.completedVideo?.length || 0;
        const progressPercentage = totalLectures > 0 
          ? Math.round((completedLectures / totalLectures) * 100) 
          : 0;

        return {
          ...course.toObject(),
          progressPercentage,
          totalLectures,
          completedLectures
        };
      })
    );

    console.log("Returning courses with progress:", coursesWithProgress.length);
    return res.status(200).json({
      success: true,
      data: coursesWithProgress,
      message: "Enrolled courses fetched successfully"
    });
    
  } catch (error) {
    console.error("=== Error in getEnrolledCourses ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

function convertSecondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor((totalSeconds % 3600) % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}