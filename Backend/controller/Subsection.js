const SubSection = require("../model/Subsection");
const Section = require("../model/Section");
const {uploadImage} =require("../utils/ImageUploader");
require("dotenv").config();


// create

exports.createSubSection = async (req, res) => {
    try{
        
        // fetch data
       const {sectionId , title , timeDuration , description } = req.body;

        // extract file 
        const video = req.files?.video;
         // validate
         if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success:false,
                message:"Section ID, title, description and video are required"
            })
         }
        // upload video on Cloudinary
        const uploadDetails = await uploadImage(video,process.env.FOLDER_NAME);

        //create subsection 
         const newSubSection = await SubSection.create({
           
            title:title,
            timeDuration: timeDuration || "00:00",
            description:description,
            videoUrl:uploadDetails.secure_url
        });
    
        //update section with new subsection
       await Section.findByIdAndUpdate(sectionId,{
            $push:{subSection:newSubSection._id}
        });


        //return 
        return res.status(200).json({
            success:true,
            message:"Subsection created successfully",
            data:newSubSection
        });

    }catch(error){
        console.log("Error Occured while creating Subsection");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// update ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

exports.updateSubsection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImage(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
     
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

//Delete Sub section--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

exports.deleteSubsection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;

        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "subSectionId and sectionId are required"
            });
        }

        // Delete the subsection document
        const deleted = await SubSection.findByIdAndDelete(subSectionId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found or already deleted"
            });
        }

        // Remove the reference from the section
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $pull: { subSection: subSectionId } },
            { new: true }
        ).populate({
            path: "subSection",
            select: "title timeDuration description videoUrl"
        });
        
        console.log("Update Section",updatedSection);
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            section: updatedSection
        });

    } catch (error) {
        console.error("Deletion failed:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete the SubSection"
        });
    }
};
