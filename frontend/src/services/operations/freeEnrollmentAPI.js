import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { courseEndpoints } from "../api"

const { FREE_ENROLLMENT_API } = courseEndpoints

export const freeEnrollment = async (courseId, token, navigate) => {
  const toastId = toast.loading("Enrolling...")
  try {
    const response = await apiConnector("POST", FREE_ENROLLMENT_API, 
      { courseId },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log("FREE ENROLLMENT API RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Successfully enrolled in the course!")
    // Force page reload to refresh enrolled courses
    window.location.href = "/dashboard/enrolled-courses"
    
  } catch (error) {
    console.log("FREE ENROLLMENT API ERROR:", error)
    toast.error(error.response?.data?.message || "Failed to enroll in course")
  }
  toast.dismiss(toastId)
}