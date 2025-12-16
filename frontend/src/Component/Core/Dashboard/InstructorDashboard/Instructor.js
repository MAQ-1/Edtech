import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

export default function Instructor() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false)
    const [instructorData, setInstructorData] = useState([])
    const [courses, setCourses] = useState([])
  
    useEffect(() => {
      ;(async () => {
        setLoading(true)
        const result = await fetchInstructorCourses(token)
        if (result) {
          setCourses(result)
          // Create instructor data from courses
          const instructorApiData = result.map(course => ({
            courseName: course.courseName,
            totalStudentsEnrolled: course.studentEnrolled?.length || 0,
            totalAmountGenerated: course.price * (course.studentEnrolled?.length || 0)
          }))
          setInstructorData(instructorApiData)
        }
        setLoading(false)
      })()
    }, [token])
  
    const totalAmount = instructorData?.reduce(
      (acc, curr) => acc + curr.totalAmountGenerated,
      0
    )
  
    const totalStudents = instructorData?.reduce(
      (acc, curr) => acc + curr.totalStudentsEnrolled,
      0
    )
  
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-richblack-5">
            Hi {user?.firstname} 👋
          </h1>
          <p className="font-medium text-richblack-200">
            Let's start something new
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="space-y-6">
            {/* Statistics Cards - Mobile First */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-richblack-800 rounded-lg">
                <p className="text-sm text-richblack-200 mb-2">Total Courses</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-50">
                  {courses.length}
                </p>
              </div>
              <div className="text-center p-4 bg-richblack-800 rounded-lg">
                <p className="text-sm text-richblack-200 mb-2">Total Students</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                  {totalStudents}
                </p>
              </div>
              <div className="text-center p-4 bg-richblack-800 rounded-lg">
                <p className="text-sm text-richblack-200 mb-2">Total Income</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">
                  Rs. {totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="mb-6">
              {totalAmount > 0 || totalStudents > 0 ? (
                <div className="min-h-[400px] sm:min-h-[500px]">
                  <InstructorChart courses={instructorData} />
                </div>
              ) : (
                <div className="h-64 sm:h-80 rounded-md bg-richblack-800 p-6 flex flex-col justify-center items-center">
                  <p className="text-lg font-bold text-richblack-5 mb-4">Visualize</p>
                  <p className="text-lg sm:text-xl font-medium text-richblack-50 text-center">
                    Not Enough Data To Visualize
                  </p>
                </div>
              )}
            </div>

            {/* Courses Section */}
            <div className="rounded-md bg-richblack-800 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                <Link to="/dashboard/my-courses">
                  <p className="text-sm font-semibold text-yellow-50 hover:text-yellow-25 transition-colors">
                    View All →
                  </p>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {courses.slice(0, 3).map((course) => (
                  <div key={course._id} className="bg-richblack-700 rounded-lg overflow-hidden hover:bg-richblack-600 transition-colors">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-32 sm:h-40 w-full object-cover"
                    />
                    <div className="p-3 sm:p-4">
                      <p className="text-sm font-medium text-richblack-50 mb-2 line-clamp-2">
                        {course.courseName}
                      </p>
                      <div className="flex items-center justify-between text-xs text-richblack-300">
                        <span className="flex items-center gap-1">
                          👥 {course.studentEnrolled?.length || 0} students
                        </span>
                        <span className="font-semibold text-yellow-50">
                          Rs. {course.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 sm:mt-20 rounded-md bg-richblack-800 p-6 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <p className="text-xl sm:text-2xl font-bold text-richblack-5 mb-4">
                You have not created any courses yet
              </p>
              <p className="text-sm sm:text-base text-richblack-300 mb-6">
                Start your teaching journey by creating your first course
              </p>
              <Link to="/dashboard/add-course">
                <button className="bg-yellow-50 text-richblack-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-yellow-25 transition-colors text-sm sm:text-base">
                  Create a Course
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }