const ratingAndReview = require("../model/RatingAndReview");
const Course = require("../model/Course");
const mongoose = require("mongoose");

// create rating-------------------------------------------------------------------------------------------------------------

exports.createRating = async (req, res) => {
    try{
        const userId = req.user._id || req.user.id;
        const{ courseId , rating, review} = req.body;

        // Auto-enroll user if not already enrolled
        const course = await Course.findById(courseId);
        if (course && !course.studentEnrolled?.includes(userId)) {
            await Course.findByIdAndUpdate(
                courseId,
                { $push: { studentEnrolled: userId } },
                { new: true }
            );
        }
        
        // check if user is enrolled int hat course 
        const courseDetails =await Course.findOne(
            {_id:courseId,
                studentEnrolled:{$elemMatch: {$eq: userId}},

            }
        );
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "User is not enrolled in this course"
            });
        }
        // checkif user alreay reviewed or not 
        const alreadyReviewed = await ratingAndReview.findOne(
            {user:userId,
                course:courseId,
            }
        )
             if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message: "User has already reviewed this course"
            })
        }
        // create ratinga and review 
        
        const ratingReview = await ratingAndReview.create({
                                                        rating,review,
                                                        user:userId,
                                                        course:courseId
                                                    });
        // update course with rating and review 
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
                                $push: {
                                         ratingsAndReviews: ratingReview._id,
                                        }
                                    },{new:true});

        console.log("Updated Course:", updatedCourse);                            
         // return response 

        return res.status(201).json({
            success:true,
            message: "Rating and review added successfully",
            data: ratingReview
        });
    }catch(error){
        console.error('CREATE RATING - Error:', error.message);
        return res.status(500).json({
            success:false,
            message: "Internal server error",
            error: error.message
        });
    }
};
// getAverage Rating---------------------------------------------------------------------------------------------------------

exports.getAverageRating = async (req, res) => {
    try{

        const courseId =req.body.courseId;
        // calculate averager rating 
        
        const result = await ratingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null, // sabhi courses le liye 
                    averageRating: { $avg: "$rating" }
                }
            }
        ])
        // return rating 
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,// aray mai retunr kr diya result 
            })
        }

       // if no ratings found
       return res.status(404).json({
           success:false,
           message: "No ratings found for this course"
       });

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// get all ratings for a course-----------------------------------------------------------------------------------------------

exports.getAllRatings = async (req, res) => {
    try{
        console.log('GET ALL RATINGS - Called');
        
        const allReview = await ratingAndReview.find({})
                                               .sort({
                                                rating:"desc"
                                               })
                                               .populate({
                                                   path: "user",
                                                   select: "firstname lastname email images"
                                               })
                                               .populate({
                                                   path: "course",
                                                   select: "courseName",
                                               })
                                               .exec();

        console.log('GET ALL RATINGS - Found reviews:', allReview.length);
        
       return res.status(200).json({
           success: true,
           data: allReview
       });

    }catch(error){
        console.error('GET ALL RATINGS - Error:', error);
        return res.status(500).json({
            success:false,
            message: "Error while fetching ratings",
            error: error.message
        });
    }
}


// delete a rating------------------------------------------------------------------------------------------------------------

// update a rating-------------------------------------------------------------------------------------------------------------

