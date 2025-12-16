const mongoose= require("mongoose");

const ProfileSchema= new mongoose.Schema({
     
       gender:{
        type:String,

       },

       dateOfBirth:{
            type:String,
       },

       about:{
        type:String,
        trim:true,
       },

       contact:{
        type:Number,
        trim:true,
       },
     
       profilePic: {
          url: { type: String },
          public_id: { type: String },
       },

})

module.exports= mongoose.model("Profile",ProfileSchema);