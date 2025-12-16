const Category = require("../model/Category");
const Course = require("../model/Course");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      
      if (!categoryId || categoryId.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Category ID is required"
        })
      }
      
      // Get the selected category
      const selectedCategory = await Category.findById(categoryId)
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }

      // Get courses for the specified category
      const selectedCourses = await Course.find({ 
        categories: categoryId, 
        status: "Published" 
      })
      .populate("instructor")
      .populate("ratingAndReviews")
      .exec()
  
      // Handle the case when there are no courses - return success with empty data
      if (selectedCourses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(200).json({
          success: true,
          message: "Courses are currently not available for this category",
          data: {
            selectedCategory: {
              ...selectedCategory.toObject(),
              courses: []
            },
            differentCategory: null,
            mostSellingCourses: [],
          }
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      
      let differentCategory = null
      let differentCourses = []
      
      if (categoriesExceptSelected.length > 0) {
        differentCategory = categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        differentCourses = await Course.find({ 
          categories: differentCategory._id, 
          status: "Published" 
        })
        .populate("instructor")
        .exec()
      }
        
      // Get top-selling courses across all categories
      const allCourses = await Course.find({ status: "Published" })
        .populate("instructor")
        .exec()
        
      const mostSellingCourses = allCourses
        .sort((a, b) => (b.studentEnrolled?.length || 0) - (a.studentEnrolled?.length || 0))
        .slice(0, 10)
        
      res.status(200).json({
        success: true,
        data: {
          selectedCategory: {
            ...selectedCategory.toObject(),
            courses: selectedCourses
          },
          differentCategory: differentCategory ? {
            ...differentCategory.toObject(),
            courses: differentCourses
          } : null,
          mostSellingCourses,
        },
      })
    } catch (error) {
      console.error("Category page details error:", error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

// category wise page ---------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getCategoryWisePage = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find({}).lean(); // plain JS objects

    // For each category, fetch its courses
    const categoryData = await Promise.all(
      categories.map(async (cat) => {
        const courses = await Course.find({ categories: cat._id }).select(
          "courseName courseDescription price tags thumbnail status"
        );

        return {
          _id: cat._id,
          name: cat.name,
          description: cat.description,
          courses: courses || [], // empty array if no courses
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Category-wise page data fetched successfully",
      data: categoryData,
    });
  } catch (error) {
    console.error("Error in getCategoryWisePage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
