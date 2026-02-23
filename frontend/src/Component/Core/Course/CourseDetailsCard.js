import React from "react"
import toast from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"


function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse, handleFreeEnrollment }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ✅ Unused import cleanup: Removed unused courseId variable
  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
  } = course

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success("Link copied to clipboard")
    }
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // amazonq-ignore-next-line
  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {CurrentPrice}
          </div>
          <div className="flex flex-col gap-4">
            {user && course?.studentsEnrolled?.includes(user?._id) ? (
              <button
                className="yellowButton"
                onClick={() => navigate("/dashboard/enrolled-courses")}
              >
                Go To Course
              </button>
            ) : (
              <>
                <div className="flex gap-3">
                  <button
                    className="flex-1 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 bg-yellow-50 hover:bg-yellow-25 transition-all duration-200 hover:scale-95"
                    onClick={handleBuyCourse}
                  >
                    Buy Now
                  </button>
                  <button
                    className="flex-1 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-5 bg-richblack-800 border border-richblack-700 hover:bg-richblack-900 transition-all duration-200 hover:scale-95"
                    onClick={handleFreeEnrollment}
                  >
                    Enroll Free
                  </button>
                </div>
                <button onClick={handleAddToCart} className="blackButton">
                  Add to Cart
                </button>
              </>
            )}
          </div>
          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Course Includes :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions && course.instructions.length > 0 ? (
                course.instructions.map((item, i) => (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                ))
              ) : (
                // Default course features
                [
                  "Full Lifetime Access",
                  "30-Day Money-Back Guarantee",
                  "Free Community Support",
                  "Mobile and TV Access",
                  "Certificate of Completion"
                ].map((item, i) => (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                ))
              )}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard