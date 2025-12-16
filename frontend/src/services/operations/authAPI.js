import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser, setLoading as setProfileLoading } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../api"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        
      })

      console.log("SENDOTP API RESPONSE............", response.data)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response.data)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Signup Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response.data)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstname} ${response.data.user.lastname}`

      const userWithImage = { ...response.data.user, image: userImage }
      dispatch(setUser(userWithImage))

      // store clean token + user in localStorage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(userWithImage))

      // Clear loading state before navigation
      dispatch(setLoading(false))
      toast.dismiss(toastId)
      
      // Force page reload to ensure dashboard content loads
      window.location.replace("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Login Failed")
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, { email })

      console.log("RESET PASSWORD TOKEN RESPONSE....", response.data)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Failed to send reset email")
    }
    dispatch(setLoading(false))
  }
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESET PASSWORD RESPONSE ... ", response.data)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password has been reset successfully")
      navigate("/login")
    } catch (error) {
      console.log("RESET PASSWORD Error", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Unable to reset password")
    }
    dispatch(setLoading(false))
  }
}
