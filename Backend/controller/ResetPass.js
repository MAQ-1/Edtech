const crypto = require("crypto");
const User = require("../model/User");
const mailSender = require("../utils/mailsender");
const bcrypt = require("bcrypt");
const {passwordUpdateEmail} = require("../mail/passwordUpdate");

// reset password token 
exports.resetPasswordToken = async (req , res)=>{
    try{
       //get email 
       const {email} = req.body;
       // verify email 
       const user = await User.findOne({email});
       if(!user){
           return res.status(404).json({
               success: false,
               message: "User not found"
           });
       }

        // generate token 
         const token = crypto.randomUUID();
        // update user by adding token and expiration time 
         const userDetails = await User.findOneAndUpdate
         ({email : email},{
            token: token,
            resetPasswordExpires: Date.now() + 3600000 // 1 hour
         },{new:true});
         console.log("Email from request:", `"${email}"`);
            console.log("User fetched before update:", user);
            console.log("User updated with token:", userDetails);


        // create url 
       const url=`http://localhost:3000/update-password/${token}`

       // send email  (optional: frontend can also send)
       await mailSender(
           user.email,
           "Reset Password",
           `<p>Click <a href="${url}">here</a> to reset your password</p>`
       );

       res.status(200).json({
           success: true,
           message: "Reset password link sent to email"
       });

   }catch(error){
    console.log(error);
       res.status(500).json({
           success: false,
           message: "Error Occured While sending Reset Pass email"
       });
   }
}

// reset password-----------------------------------------------------------------------------------------------------------------------------------

exports.resetPassword = async (req, res) => {
  try {
    // Extract data from request
    const { password, confirmPassword, token } = req.body;
    const trimmedToken = token?.trim();

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Find user by token
    const user = await User.findOne({ token: trimmedToken });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Check token expiry
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear token fields
    await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        token: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );

    console.log("Password updated for user:", user._id);

    // Send confirmation email
    await mailSender(
      user.email,
      "Password Updated Successfully",
      passwordUpdateEmail(user.firstname, user.lastname)
    );

    // Respond success
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error occurred while resetting password",
    });
  }
};
