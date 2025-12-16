const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true,
    },
    courseDescription: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    whatYouWillLearn: {
        type: String,
        required: true,
        trim: true
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        }
    ],
    price: {
        type: Number,
        required: true,
        default: 0
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        required: true,
        trim: true,
    },
    studentEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft"
    }
});

module.exports = mongoose.model("Course", CourseSchema);
