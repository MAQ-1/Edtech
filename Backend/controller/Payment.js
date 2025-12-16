const {instance}= require("../config/Razorpay");
const Course = require("../model/Course");
const User= require("../model/User");
const mailSender = require("../utils/mailsender");
const {courseEnrollmentEmail} = require("../mail/courseEnrollmentEmail");
const mongoose = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../model/CourseProgress")


exports.capturePayment = async (req, res) => {
  console.log('CAPTURE PAYMENT - Request body:', req.body)
  console.log('CAPTURE PAYMENT - User:', req.user)
  
  const { courses } = req.body
  const userId = req.user._id
  
  console.log('CAPTURE PAYMENT - Courses:', courses)
  console.log('CAPTURE PAYMENT - User ID:', userId)
  
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      console.log('CAPTURE PAYMENT - Looking for course:', course_id)
      // Find the course by its ID
      course = await Course.findById(course_id)
      console.log('CAPTURE PAYMENT - Course found:', !!course)

      // If the course is not found, return an error
      if (!course) {
        console.log('CAPTURE PAYMENT - Course not found')
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      console.log('CAPTURE PAYMENT - Checking enrollment for user:', uid)
      console.log('CAPTURE PAYMENT - Students enrolled:', course.studentEnrolled)
      
      if (course.studentEnrolled && course.studentEnrolled.includes(uid)) {
        console.log('CAPTURE PAYMENT - Student already enrolled')
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      console.log('CAPTURE PAYMENT - Course price:', course.price)
      total_amount += course.price
    } catch (error) {
      console.log('CAPTURE PAYMENT - Error in course loop:', error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }
  
  console.log('CAPTURE PAYMENT - Total amount:', total_amount)

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Return mock response for testing without Razorpay
      return res.json({
        success: true,
        message: {
          id: 'order_mock_' + Date.now(),
          amount: total_amount * 100,
          currency: 'INR',
          status: 'created'
        }
      })
    }
    
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      message: paymentResponse,
    })
  } catch (error) {
    console.log('Payment Error:', error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order: " + error.message })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user._id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}



// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideo: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            course: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstname} ${enrolledStudent.lastname}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}






// capture the payment and initiate the razorpay 

// exports.capturePayment = async(req , res)=>{
//     try{
//             const{courseId} = req.body;
//             const userId = req.body.id;

//             //validation 
//             // valid course ID
//             if(!courseId){
//                 return res.status(400).json(
//                     {   success:false,
//                         message: "Invalid course ID"
//                     });
//             }
//             //valid course details
//             let course;
//             try{
//                   course = await Course.findById(courseId);
//                   if(!course){
//                     return res.status(404).json({
//                         success:false,
//                         message: "Course not found"
//                     })
//                   }

//                   // user already pay
//                   const uid = await mongoose.Types.ObjectId(userId);
//                   if(course.studentEnrolled.includes(uid)){
//                     return res.status(404).json({
//                         success:false,
//                         message: "User already enrolled"
//                     });
//                   }

//             }catch(error){
//                  return res.status(404).json({
//                      success:false,
//                      message: "Course not found"
//                  });
//             }
             
//             // order create 

//              const amount = course.price;
//              const currency = "INR";

//              const options ={
//                 amount: amount * 100,
//                 currency: currency,
//                 receipt: Math.random(Date.now()).toString(),
//                 notes:{
//                     courseId: courseId,
//                     userId: userId
//                 }
//              }


//              try{
//                         // initiate the payment  using razorpay
//                    const paymentResponse = await instance.orders.create(options);
//                    console.log("Payment Response:", paymentResponse); 
//                    // response 
//                    return res.status(200).json({
//                        success: true,
//                        courseName: Course.courseName,
//                        courseDescription: Course.courseDescription,
//                        thumbnail: Course.thumbnail,
//                        orderId : paymentResponse.id,
//                        amount: paymentResponse.amount,
//                        message: "Payment initiated successfully",
                       
//                    });
//                }catch(error){
//                    console.log(error);
//                    return res.status(500).json({
//                        success:false,
//                        message: "Payment initiation failed"
//                  });

//              }
//        return res.status(200).json({
//            success: true,
//            message: "Payment captured successfully",
//            data: {
//                orderId: paymentResponse.id,
//                amount: paymentResponse.amount
//            }
//        });
//     }catch(error){
//         console.error(error);
//         res.status(500).json({message: "Internal server error"});
//     }
// }

// // verify  signature of Razorpay------------------------------------------------------------------------------------------------------------------------------------------

// exports.verifySignature = async(req , res)=>{

//     try{
           

//            // create webhook
//             const webhookSecret = "123456";// hmara code
//             const signature = req.headers["x-razorpay-signature"]; // razorpay se reply on completion 
             
//             const shasum = crypto.createHmac("sha256", webhookSecret);
//             shasum.update(JSON.stringify(req.body));// convert in string format 
//             const digest = shasum.digest("hex");// output ko store krlenge

//             if(digest === signature){
//                 console.log("Payment Authorized");

//                 const{userId , courseId} = req.body.payload.payment.entity.notes;

//                 try{

//                     // enroll the student
//                     const enrolledCourse = await Course.findByIdAndUpdate(
//                         { _id: courseId },
//                         { $push: { studentEnrolled: userId } },
//                         { new: true }
//                     );

//                     if(!enrolledCourse){
//                         console.log("Error enrolling student");
//                         return res.status(500).json({
//                             success: false,
//                             message: "Error enrolling student"
//                         });
//                     }

//                     console.log(enrolledCourse,"Student enrolled or not ");

//                     // find the student and update it data

//                     const student = await User.findByIdAndUpdate(
//                         { _id: userId },
//                         { $push: { courses: courseId } },
//                         { new: true }
//                     );

//                     if(!student){
//                         console.log("Error updating student data");
//                         return res.status(500).json({
//                             success: false,
//                             message: "Error updating student data"
//                         });
//                     }
//                     console.log(enrolledCourse);
//                     console.log(student,"Student data updated successfully");

//                 const emailResponse = await mailSender(
//                     student.email,
//                     "Enrollment Successful",
//                     courseEnrollmentEmail(
//                         enrolledCourse.courseName,
//                         student.firstname,
//                         student.lastname
//                     )
//                 )
//                     console.log(emailResponse);

//                     return res.status(200).json({
//                         success: true,
//                         message: "Payment processed successfully",
//                         data: {
//                             enrolledCourse,
//                             student,
//                             emailResponse
//                         }
//                     });

//                 }catch(error){
//                     console.log("Error processing payment:", error);
//                 }
                
//             }else{
//                 return res.status(400).json({
//                     success: false,
//                     message: "Payment verification failed"
//                 });
//             }

//     }catch(error){
//         console.log("Error verifying signature:", error);
//         console.error(error);
//         res.status(500).json({
//             message: "Internal server error"
//         });
//     }

// }