const mongoose=require("mongoose");

const ratingAndReview= new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User"
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"Course"
    },
    rating:{
        type:Number,
        require:true,
        min:1,
        max:5
    },
    review:{
        type:String,
        require:true,
        trim:true
    }
})

module.exports= mongoose.model("RatingAndReview",ratingAndReview);