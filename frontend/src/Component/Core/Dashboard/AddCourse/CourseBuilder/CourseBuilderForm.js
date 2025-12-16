import React from 'react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import IconBtn from '../../../../common/IconBtn'
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice"
import NestView from './NestedView'
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI"

const CourseBuilderForm = () => {


  const{register,handleSubmit,setValue,formState:{errors}}=useForm()
  const[editSectionName,setEditSectionName]=useState(false)
  const {course}=useSelector((state)=>state.course || {}) 
  const[loading,setLoading]=useState(false);
  const { token } = useSelector((state) => state.auth)
  const dispatch=useDispatch();
  


  const onSubmit= async(data)=>{
   setLoading(true);
   
   console.log('CourseBuilderForm - onSubmit called');
   console.log('CourseBuilderForm - course from Redux:', course);
   console.log('CourseBuilderForm - course._id:', course?._id);
   console.log('CourseBuilderForm - form data:', data);

   if (!course || !course._id) {
     console.log('CourseBuilderForm - Course validation failed');
     toast.error("Course not found. Please create a course first.");
     setLoading(false);
     return;
   }

   console.log('CourseBuilderForm - Course validation passed, proceeding with section creation');
   let result;

   if(editSectionName){
     // we are editing the section name 
       result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },token
       )
   }else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      )
    }
    if (result) {
      // console.log("section result", result)
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }


  const cancelEdit=()=>{
    setEditSectionName(null);
    setValue("sectionName","");
  }

  const  goBack=() =>{
     dispatch(setStep(1));
     dispatch(setEditCourse(true));
  }

  const goToNext = () => {
    if (!course?.courseContent || course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    if (
      course.courseContent.some((section) => !section.subSection || section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }

   const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6" >
          <p className="text-2xl font-semibold text-richblack-5"> Course Builder </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               

               <div className="flex flex-col space-y-2">

                   // amazonq-ignore-next-line
                   <label className="text-sm text-richblack-5" htmlFor="sectionName">Section Name <sup className="text-pink-200">*</sup></label>
                   <input
                   id='sectionName'
                   placeholder='Add Section Name'
                   {...register('sectionName',{required:true})}
                    className="form-style w-full bg-richblack-600 p-2 rounded shadow shadow-richblack-300"
                   />
                   {
                     errors.sectionName && (<span className="ml-2 text-xs tracking-wide text-pink-200">
                       Section Name is required
                     </span>)
                   }
               </div>
               

               {/* Button  */}
               <div className="flex items-end gap-x-4" >
                    <IconBtn
                     type='Submit'
                     text={editSectionName ? "Edit Section Name" : "Create Section"}
                     outline={true}
                     className="text-yellow-400"

                    >
                        <IoAddCircleOutline size={20} className="text-yellow-50" />
                    </IconBtn>
                    {
                      editSectionName && (
                         <button 
                         type='button'
                         onClick={cancelEdit}
                         className="text-sm text-richblack-300 underline hover:text-richblack-5"
                         >
                            Cancel Edit
                         </button>
                      )
                    }
               </div>

          </form>

          {/* Nested View  */}

           {course?.courseContent.length>0 &&(
            <NestView  handleChangeEditSectionName={handleChangeEditSectionName}/>
           )} 

           <div className='flex justify-end gap-x-3'>
              <button onClick={goBack} 
              className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
                  Back
              </button>
              
              <IconBtn
                text='Next' onclick={goToNext}>
                 <MdNavigateNext />
              </IconBtn>


           </div>
    </div>
  )
}

export default CourseBuilderForm