import { toast } from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;


export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Processing Enrollment...");
    try{
        //initiate the order
        console.log("BUY COURSE - Sending request with courses:", courses);
        console.log("BUY COURSE - Token:", token ? 'Present' : 'Missing');
        
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
                                {courses},
                                {
                                    Authorization: `Bearer ${token}`,
                                })

        console.log("BUY COURSE - Full API response:", orderResponse);
        
        if(!orderResponse.data.success) {
            console.log("BUY COURSE - API Error:", orderResponse.data.message);
            throw new Error(orderResponse.data.message);
        }
        console.log("PRINTING orderResponse", orderResponse);
        
        // Directly verify and enroll (no Razorpay payment required)
        await verifyPayment({courses}, token, navigate, dispatch);

    }
    catch(error) {
        console.log("ENROLLMENT API ERROR.....", error);
        toast.error("Could not complete Enrollment");
    }
    toast.dismiss(toastId);
}

// ✅ Vercel CI lint cleanup: Prefixed unused function with underscore
// eslint-disable-next-line no-unused-vars
async function _sendPaymentSuccessEmail(response, amount, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.orderId || 'free_enrollment',
            paymentId: response.paymentId || 'free_enrollment',
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("ENROLLMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify and enroll
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Enrolling...");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("Enrollment Successful! You are now enrolled in the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("ENROLLMENT VERIFY ERROR....", error);
        toast.error("Could not complete Enrollment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}