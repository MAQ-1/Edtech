import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../Component/Core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../Component/Core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  // ✅ Vercel CI lint cleanup - Removed unused navigate
  const [reviewModal, setReviewModal] = useState(false)

  useEffect(() => {
    console.log('ViewCourse - useEffect triggered with:', { courseId, token: !!token })
    ;(async () => {
      try {
        if (!courseId || !token) {
          console.log('ViewCourse - Missing courseId or token:', { courseId, hasToken: !!token })
          return
        }
        
        console.log('ViewCourse - Fetching course data for courseId:', courseId)
        const courseData = await getFullDetailsOfCourse(courseId, token)
        console.log('ViewCourse - Raw course data received:', JSON.stringify(courseData, null, 2))
        console.log('ViewCourse - Completed videos from API:', courseData?.completedVideos)
        console.log('ViewCourse - Completed videos length:', courseData?.completedVideos?.length)
        
        if (courseData?.courseDetails) {
          const courseDetails = courseData.courseDetails
          const courseContent = courseDetails.courseContent || []
          
          console.log('ViewCourse - Course details:', courseDetails)
          console.log('ViewCourse - Course content sections:', courseContent.length)
          console.log('ViewCourse - Completed videos being dispatched:', courseData.completedVideos)
          console.log('ViewCourse - Completed videos array:', JSON.stringify(courseData.completedVideos))
          
          dispatch(setCourseSectionData(courseContent))
          dispatch(setEntireCourseData(courseDetails))
          dispatch(setCompletedLectures(courseData.completedVideos || []))
          
          let lectures = 0
          if (Array.isArray(courseContent)) {
            courseContent.forEach((sec, index) => {
              console.log(`ViewCourse - Section ${index}:`, sec?.sectionName, 'SubSections:', sec?.subSection?.length || 0)
              if (sec && sec.subSection && Array.isArray(sec.subSection)) {
                lectures += sec.subSection.length
              }
            })
          }
          console.log('ViewCourse - Total lectures calculated:', lectures)
          dispatch(setTotalNoOfLectures(lectures))
        } else {
          console.log('ViewCourse - No course data received, courseData structure:', courseData)
          dispatch(setCourseSectionData([]))
          dispatch(setEntireCourseData({}))
          dispatch(setCompletedLectures([]))
          dispatch(setTotalNoOfLectures(0))
        }
      } catch (error) {
        console.error('ViewCourse - Error occurred:')
        console.error('ViewCourse - Error message:', error.message)
        console.error('ViewCourse - Error stack:', error.stack)
        console.error('ViewCourse - Full error object:', error)
        dispatch(setCourseSectionData([]))
        dispatch(setEntireCourseData({}))
        dispatch(setCompletedLectures([]))
        dispatch(setTotalNoOfLectures(0))
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, token])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}