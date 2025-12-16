const mongoose = require("mongoose");

const Category= new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String,
        require:true,
        trim:true
    },

    course:[{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"Course"
    }],
})

module.exports= mongoose.model("Category",Category);