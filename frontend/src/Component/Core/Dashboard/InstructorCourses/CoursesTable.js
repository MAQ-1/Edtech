import { useDispatch, useSelector } from "react-redux"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import toast from "react-hot-toast"

import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"

export default function CoursesTable({ courses, setCourses }) {
  // Redux hooks for state management and navigation
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  
  // Local state management
  const [loading, setLoading] = useState(false) // Loading state for delete operations
  const [confirmationModal, setConfirmationModal] = useState(null) // Modal state for delete confirmations
  const [selectedCourses, setSelectedCourses] = useState([]) // Array of selected course IDs for bulk operations
  
  // Constants
  const TRUNCATE_LENGTH = 30 // Maximum words to show in course description

  // Handle single course deletion
  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    // Delete the course via API
    await deleteCourse({ courseId: courseId }, token)
    // Refresh the courses list
    const result = await fetchInstructorCourses(token, false)
    if (result) {
      setCourses(result)
    }
    // Close modal and reset loading state
    setConfirmationModal(null)
    setLoading(false)
  }

  // Handle bulk deletion of selected courses
  const handleBulkDelete = async () => {
    setLoading(true)
    // Delete each selected course
    for (const courseId of selectedCourses) {
      await deleteCourse({ courseId }, token)
    }
    // Refresh the courses list
    const result = await fetchInstructorCourses(token, false)
    if (result) {
      setCourses(result)
    }
    // Show success toast and reset state
    toast.success("Selected courses deleted successfully")
    setSelectedCourses([])
    setConfirmationModal(null)
    setLoading(false)
  }

  // Toggle individual course selection
  const handleSelectCourse = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) // Remove if already selected
        : [...prev, courseId] // Add if not selected
    )
  }

  // Toggle select all courses
  const handleSelectAll = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]) // Deselect all if all are selected
    } else {
      setSelectedCourses(courses.map(course => course._id)) // Select all courses
    }
  }

  // console.log("All Course ", courses)

  return (
    <>
      {/* Bulk delete action bar - shows when courses are selected */}
      {selectedCourses.length > 0 && (
        <div className="mb-4 flex justify-between items-center bg-richblack-700 p-4 rounded-lg">
          <span className="text-richblack-100">
            {selectedCourses.length} course(s) selected
          </span>
          <button
            onClick={() => {
              // Show confirmation modal for bulk delete
              setConfirmationModal({
                text1: `Delete ${selectedCourses.length} course(s)?`,
                text2: "All selected courses and their data will be permanently deleted",
                btn1Text: !loading ? "Delete All" : "Deleting...",
                btn2Text: "Cancel",
                btn1Handler: !loading ? handleBulkDelete : () => {},
                btn2Handler: () => setConfirmationModal(null),
              })
            }}
            disabled={loading}
            className="bg-pink-200 text-richblack-900 px-4 py-2 rounded-md hover:bg-pink-300 transition-colors disabled:opacity-50"
          >
            Delete Selected
          </button>
        </div>
      )}
      {/* Main courses table */}
      <Table className="rounded-xl border border-richblack-800 ">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            {/* Select all checkbox column */}
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              <div
                onClick={handleSelectAll}
                className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                  selectedCourses.length === courses.length && courses.length > 0
                    ? 'bg-yellow-50 border-yellow-50' // All selected
                    : selectedCourses.length > 0
                    ? 'bg-yellow-50/20 border-yellow-50' // Partially selected
                    : 'border-richblack-400 hover:border-yellow-50' // None selected
                }`}
              >
                {/* Show checkmark if all selected, small square if partially selected */}
                {selectedCourses.length === courses.length && courses.length > 0 ? (
                  <FaCheck className="text-richblack-900 text-xs" />
                ) : selectedCourses.length > 0 ? (
                  <div className="w-2 h-2 bg-yellow-50 rounded-sm" />
                ) : null}
              </div>
            </Th>
            {/* Table header columns */}
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Show empty state if no courses */}
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
                {/* TODO: Need to change this state */}
              </Td>
            </Tr>
          ) : (
            /* Render each course row */
            courses?.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
                {/* Individual course selection checkbox */}
                <Td className="flex items-center">
                  <div
                    onClick={() => handleSelectCourse(course._id)}
                    className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                      selectedCourses.includes(course._id)
                        ? 'bg-yellow-50 border-yellow-50' // Selected state
                        : 'border-richblack-400 hover:border-yellow-50' // Unselected state
                    }`}
                  >
                    {/* Show checkmark if course is selected */}
                    {selectedCourses.includes(course._id) && (
                      <FaCheck className="text-richblack-900 text-xs" />
                    )}
                  </div>
                </Td>
                {/* Course details column */}
                <Td className="flex flex-1 gap-x-4">
                  {/* Course thumbnail */}
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    {/* Course name */}
                    <p className="text-lg font-semibold text-richblack-5">
                      {course.courseName}
                    </p>
                    {/* Course description (truncated) */}
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}
                    </p>
                    {/* Course creation date */}
                    <p className="text-[12px] text-white">
                      Created: {formatDate(course.createdAt)}
                    </p>
                    {/* Course status badge */}
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        Published
                      </p>
                    )}
                  </div>
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  2hr 30min
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  ₹{course.price}
                </Td>
                <Td className="text-sm font-medium text-richblack-100 ">
                  <button
                    disabled={loading}
                    onClick={() => {
                      // Set course data in Redux store for editing
                      dispatch(setCourse(course))
                      dispatch(setEditCourse(true))
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}