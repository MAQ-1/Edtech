import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { useSelector } from "react-redux"

import { createRating } from "../../../services/operations/courseDetailsAPI"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)
  const [currentRating, setCurrentRating] = useState(0)

  const ratingLabels = {
    1: "⭐ Poor",
    2: "⭐⭐ Fair", 
    3: "⭐⭐⭐ Good",
    4: "⭐⭐⭐⭐ Very Good",
    5: "⭐⭐⭐⭐⭐ Excellent"
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ratingChanged = (newRating) => {
    // console.log(newRating)
    setValue("courseRating", newRating)
    setCurrentRating(newRating)
  }

  const onSubmit = async (data) => {
    if (currentRating < 1) {
      alert("Please select a rating between 1 and 5 stars")
      return
    }
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: currentRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black bg-opacity-50 backdrop-blur-md">
      <div className="my-10 w-11/12 max-w-[700px] rounded-xl border border-richblack-600 bg-gradient-to-b from-richblack-800 to-richblack-900 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-richblack-700 to-richblack-800 p-6 border-b border-richblack-600">
          <p className="text-2xl font-bold text-richblack-5 flex items-center gap-2">
            ⭐ Add Review
          </p>
          <button 
            onClick={() => setReviewModal(false)}
            className="p-2 rounded-full hover:bg-richblack-600 transition-all duration-200 hover:scale-110"
          >
            <RxCross2 className="text-2xl text-richblack-300 hover:text-richblack-5" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-8">
          <div className="flex items-center justify-center gap-x-4 mb-8 p-4 bg-richblack-700/50 rounded-lg">
            <img
              src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`}
              alt={user?.firstName + "profile"}
              className="aspect-square w-[60px] rounded-full object-cover border-2 border-yellow-400 shadow-lg"
            />
            <div className="">
              <p className="font-bold text-richblack-5 text-lg">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-300 flex items-center gap-1">
                🌍 Posting Publicly
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center space-y-6"
          >
            <div className="flex flex-col items-center space-y-3">
              <p className="text-lg font-semibold text-richblack-5">Rate this course</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => ratingChanged(star)}
                    className="text-3xl hover:scale-110 transition-transform duration-200"
                  >
                    <span className={star <= currentRating ? "text-yellow-400" : "text-gray-400"}>
                      ⭐
                    </span>
                  </button>
                ))}
              </div>
              {currentRating > 0 && (
                <p className="text-base font-medium text-yellow-400">
                  {ratingLabels[currentRating]}
                </p>
              )}
            </div>
            <div className="flex w-full flex-col space-y-3">
              <label
                className="text-base font-medium text-richblack-5 flex items-center gap-2"
                htmlFor="courseExperience"
              >
                📝 Share Your Experience <sup className="text-pink-400">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Tell others about your learning experience with this course..."
                {...register("courseExperience", { required: true })}
                className="w-full min-h-[140px] p-4 rounded-lg bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none transition-all duration-200"
              />
              {errors.courseExperience && (
                <span className="text-sm text-pink-400 flex items-center gap-1">
                  ⚠️ Please share your experience
                </span>
              )}
            </div>
            <div className="flex w-full justify-end gap-4 pt-4 border-t border-richblack-600">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="px-6 py-3 rounded-lg bg-richblack-600 hover:bg-richblack-500 text-richblack-200 hover:text-richblack-5 font-medium transition-all duration-200 border border-richblack-500 hover:border-richblack-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-richblack-900 font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                💾 Save Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}