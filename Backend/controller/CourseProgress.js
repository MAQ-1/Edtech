const mongoose = require("mongoose")
const Section = require("../model/Section")
const SubSection = require("../model/Subsection")
const CourseProgress = require("../model/CourseProgress")
const Course = require("../model/Course")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user._id

  console.log('UPDATE COURSE PROGRESS - Request body:', req.body)
  console.log('UPDATE COURSE PROGRESS - courseId:', courseId)
  console.log('UPDATE COURSE PROGRESS - subsectionId:', subsectionId)
  console.log('UPDATE COURSE PROGRESS - userId:', userId)

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId
    })

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideo: [subsectionId]
      })
      await courseProgress.save()
      return res.status(200).json({ success: true, message: "Course progress created and updated" })
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideo.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideo array
      courseProgress.completedVideo.push(subsectionId)
    }

    // Save the updated course progress
    await courseProgress.save()

    return res.status(200).json({ success: true, message: "Course progress updated" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }