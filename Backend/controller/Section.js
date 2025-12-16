const Section = require("../model/Section");
const Course = require("../model/Course");

exports.createSection = async (req, res) => {
    try{
     // fetch data
     const{sectionName, courseId} = req.body;
     // data validation 
     if(!sectionName || !courseId){
        return res.status(400).json({
            success:false,
            message:"Section name and course ID are required"
        })
     }
     // create section 

     const newSection = await Section.create({ sectionName });
     // update the course 
     const updatedCourse = await Course.findByIdAndUpdate(
                                    courseId,
                                    {
                                        $push: {
                                            courseContent: newSection._id
                                        }
                                    },
                                    { new: true }
                                )
                                .populate({
                                    path: "courseContent",   // courseContent = array of sections
                                    populate: {
                                        path: "subSection",   // subSection = array inside Section
                                        model: "SubSection"
                                    }
      })
      .exec();
     // return the response 
      
     return res.status(200).json({
        success: true,
        message: "Section created successfully",
        data: {
            section: newSection,
            course: updatedCourse
        }
     })
    }catch(error){
      console.log("Error Occured while creating Section");
      return res.status(500).json({
        success:false,
        message:error.message
      })

    }
}

//Update-----------------------------------------------------------------------------------------------------------------------------------------------

exports.updateSection = async (req, res) => {
    try{
        
        const{sectionName, sectionId,courseId}=req.body;
        //validate
         
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Section name and section ID are required"
            })
        }
        //now update the data
        const section = await Section.findByIdAndUpdate(sectionId,
            {sectionName},{new:true})


            const course = await Course.findById(courseId)
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection",
                },
            })
            .exec();
        
        //return 
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            data:course
        })


    }catch(error){
        console.log("Error Occured while updating Section");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// Deletion ----------------------------------------------------------------------------------------------------------------------------------

exports.deleteSection = async (req, res) => {
    try{
       // get data 
        const {sectionId, courseId} = req.body;

       // find and delete the section 
       const deletedSection = await Section.findByIdAndDelete(sectionId);
       if (!deletedSection) {
        return res.status(404).json({
            success: false,
            message: "Section not found"
        });
        }
       // then update the course

       const updatedCourse = await Course.findByIdAndUpdate(
           courseId,
           {
               $pull: {
                   courseContent: sectionId
               }
           },
           { new: true }
       )
       .populate({
           path: "courseContent",
           populate: { path: "subSection", model: "SubSection" }
       })
      .exec();
       // return response 

        return res.status(200).json({
        success: true,
        message: "Section deleted successfully",
        data: updatedCourse
        });

    }catch(error){
        console.log("Error Occured while deleting Section");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}