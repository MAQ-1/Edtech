const mongoose= require("mongoose");

const CourseProgress= new mongoose.Schema({
       userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
       },
       courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required: true
       },
       completedVideo:[{
             type:mongoose.Schema.Types.ObjectId,
             ref:"SubSection",
       }]
})

module.exports= mongoose.model("CourseProgress",CourseProgress);