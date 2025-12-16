import { toast } from "react-hot-toast"
import { profileEndpoints } from "../api"
import { apiConnector } from "../apiconnector"

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API } = profileEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstname} ${response.data.data.lastname}`
      
      return { ...response.data.data, image: userImage }
    } catch (error) {
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
      navigate("/dashboard/my-profile")
    }
    toast.dismiss(toastId)
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
    console.log("Token:", token);
    console.log("API URL:", GET_USER_ENROLLED_COURSES_API);
    
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("GET_USER_ENROLLED_COURSES_API API RESPONSE............", response)

    if (!response.data.success) {
      console.log("API returned success: false, message:", response.data.message);
      throw new Error(response.data.message)
    }
    result = response.data.data
    toast.success("Enrolled courses loaded successfully")
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    console.log("Error response:", error.response?.data);
    console.log("Error status:", error.response?.status);
    console.log("Error message:", error.message);
    
    if (error.response?.status === 500) {
      toast.error("Server error. Please check backend logs.");
    } else if (error.response?.status === 404) {
      toast.error("API endpoint not found. Check if backend server is running.");
    } else if (error.response?.status === 401) {
      toast.error("Authentication failed. Please login again.");
    } else if (error.message === 'Network Error') {
      toast.error("Cannot connect to server. Check if backend is running on port 4000.");
    } else {
      toast.error("Could Not Get Enrolled Courses");
    }
  }
  toast.dismiss(toastId)
  return result
}