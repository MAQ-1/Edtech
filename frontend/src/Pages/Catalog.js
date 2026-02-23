import React, { useState, useEffect } from 'react'
import Footer from '../Component/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/api';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import CourseCard from '../Component/Core/Catalog/Course_Card';
import CourseSlider from '../Component/Core/Catalog/CourseSlider';

const Catalog = () => {
  
    const{catalogName}=useParams();
    const[catalogPageData,setCatalogPageData]=useState(null);
    const[categoryId,setCategoryId]=useState("");
    const[active,setActive]=useState(1);


    //fetch All categories

    useEffect(()=>{
         
        const getCategories = async()=>{
         const res = await apiConnector("GET", categories.CATEGORIES_API);

         const decodedCatalogName = decodeURIComponent(catalogName);
         const category_id= res?.data?.data?.filter((ct)=>{
           const normalizedName = ct.name.toLowerCase().replace(/[\s]+/g, '-').replace(/[^a-z0-9-]/g, '');
           return normalizedName === decodedCatalogName || ct.name.split(" ").join("-").toLowerCase() === catalogName;
         })[0];

         setCategoryId(category_id?._id);

        }

        getCategories();
    },[catalogName]);


    useEffect(()=>{
       const getCategoryDetails = async()=>{
           try{
            const res =await getCatalogaPageData(categoryId);
            setCatalogPageData(res);
           }
           catch(error){
            console.log(error);
            // Set empty data structure for categories with no courses
            setCatalogPageData({
              data: {
                selectedCategory: { name: catalogName, description: "No courses available in this category yet." },
                differentCategory: { courses: [] },
                mostSellingCourses: []
              }
            });
           }
       }

       if(categoryId) {
         getCategoryDetails();
       }
    },[categoryId, catalogName]);
  




   return (
        <>
          {/* Hero Section */}
          <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                  {catalogPageData?.data?.selectedCategory?.name}
                </span>
              </p>
              <p className="text-3xl text-richblack-5">
                {catalogPageData?.data?.selectedCategory?.name}
              </p>
              <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.description}
              </p>
            </div>
          </div>
    
          {/* Section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Populer
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}
              >
                New
              </p>
            </div>
            <div>
              {catalogPageData?.data?.selectedCategory?.courses?.length > 0 ? (
                <CourseSlider
                  Courses={catalogPageData?.data?.selectedCategory?.courses}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-richblack-300 text-lg">No courses available in this category yet.</p>
                  <p className="text-richblack-400 text-sm mt-2">Check back later for new courses!</p>
                </div>
              )}
            </div>
          </div>
          {/* Section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top courses in {catalogPageData?.data?.selectedCategory?.name}
            </div>
            <div className="py-8">
              {catalogPageData?.data?.differentCategory?.courses?.length > 0 ? (
                <CourseSlider
                  Courses={catalogPageData?.data?.differentCategory?.courses}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-richblack-300 text-lg">No related courses available.</p>
                </div>
              )}
            </div>
          </div>
    
          {/* Section 3 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
              {catalogPageData?.data?.mostSellingCourses?.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {catalogPageData?.data?.mostSellingCourses
                    ?.slice(0, 4)
                    .map((course, i) => (
                      <CourseCard course={course} key={i} Height={"h-[400px]"} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-richblack-300 text-lg">No popular courses available.</p>
                </div>
              )}
            </div>
          </div>
    
          <Footer />
        </>
      )
}

export default Catalog