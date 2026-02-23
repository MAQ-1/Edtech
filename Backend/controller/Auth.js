const User= require("../model/User");
const OTP= require("../model/OTP");
const otpGenrator= require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailsender= require("../utils/mailsender");
const { emailVerificationTemplate } = require("../mail/emailVerificationTemplate");
const Profile= require("../model/Profile");

require("dotenv").config();



// send otp
 
exports.SendOtp= async( req , res)=>{

    try{
                //fetch email from req body 
    const email = req.body.email;

    //check if user already exist

    const checkUserPresent= await User.findOne({email});

    //if exist then return message
    if(checkUserPresent){
        return res.status(200).json({
            success:false,
            message: "User already exists"
        });
    }

    //generate Otp
    var otp = otpGenrator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
    
    console.log("OTP Generated Successfully:", otp);
        
    //check the otp unique or not 
    let result = await OTP.findOne({otp: otp});
    while(result){
        otp = otpGenrator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        result = await OTP.findOne({otp : otp});
    }


         //entry the otp in database
         const otpPayload = {
            email,
            otp,
         };

         try {
            await mailsender(
                email,
                "Email Verification - OTP",
                emailVerificationTemplate(otp)
            );
            console.log("OTP email sent successfully to:", email);
            
            const otpBody = await OTP.create(otpPayload);
            console.log("OTP saved to database:", otpBody._id);
         } catch (emailError) {
            console.log("Error sending OTP email:", emailError);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email"
            });
         }

         // return success response
         res.status(200).json({
            success: true,
            message: "OTP sent successfully",
         });

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "Error Occured while sending Otp"
           
        });
    }


    //
 
}

// signup-------------------------------------------------------------------------------------------------------------------------------------------------------
    
 exports.signUp = async (req , res)=>{
    try{
         // data fetch

         const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,
        } = req.body;

        // Handle both camelCase and lowercase field names for compatibility
        const firstname = firstName || req.body.firstname;
        const lastname = lastName || req.body.lastname;
        const Otp = otp || req.body.Otp;

         //validate the data

         if(!firstname || !lastname || !email || !password || !confirmPassword || !Otp) {
            return res.status(400).json({
               success: false,
               message: "All fields are required"
            });
         }

         // ✅ DEPLOYMENT FIX: Validate password strength (min 8 chars)
         if(password.length < 8) {
            return res.status(400).json({
               success: false,
               message: "Password must be at least 8 characters long"
            });
         }

         // 2 password match

         if(password !== confirmPassword) {
            return res.status(400).json({
               success: false,
               message: "Passwords do not match"
            });
         }

         //check user already exists

         const existingUser = await User.findOne({email});
         if(existingUser){
            return res.status(200).json({
                success:false,
                message:"User Already Exists"
            });
         }

         // find most recent otp for the user
             console.log("Looking for OTP for:", email);

         // find most recent otp for the user
            const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
            console.log("Found OTP:", recentOtp);
            
            if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
            }

            // validate otp
            if (recentOtp.otp !== Otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
            }

            if (recentOtp.expiresAt && recentOtp.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
            }


         // Hash the password

         const hashedPassword = await bcrypt.hash(password,10);


         // entry create in Db 

           const profileDetails = await Profile.create({
            gender:null,
            dateofBirth:null,
            about:null,

           })
           const user = await User.create({
               firstname,
               lastname,
               email,
               password: hashedPassword,
               accountType,
               additionalDetails:profileDetails._id,
               images: [
               `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(`${firstname} ${lastname}`)}`
               ]

           });
           console.log("User created successfully:", user);
         //return response

         return res.status(200).json({
            success:true,
            message: "SignUp completed successfully",
              user: {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            accountType: user.accountType,
            images: user.images,
            additionalDetails: profileDetails, 
            createdAt: user.createdAt
        }

         })

    }catch(error){
        console.error("Error in SignUp:", error); 
        return res.status(500).json({
            success: false,
            message: "SignUp can not be completed"
        })
    }
 }
// login-------------------------------------------------------------------------------------------------------------------------------------------

exports.login = async (req, res)=>{
    try{
            
        const {email , password}= req.body;
        // validate the data
         
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Email and password are required"
            });
        }
        // user not registered

        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }
        // generate token JWT, after pass match
          
         if( await bcrypt.compare(password,user.password)){

            const payload={
                email:user.email,
                _id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"1d",
            })
            user.token =token ;
            user.password= undefined;
              
            // create cookie and send response 

            // ✅ DEPLOYMENT FIX: Secure cookie in production
            const options ={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"Login successful",
                user,
                
            })

         }else{
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            });
         }
        

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failed, Please try again"
        })
    }
}

// change password-----------------------------------------------------------------------------------------------------------------------------------

exports.changePassword= async (req, res)=>{
    try{
            // fetch data
        const { email, oldPassword, newPassword, confirmPassword } = req.body;  
        // validation 
        if(!email || !oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // ✅ DEPLOYMENT FIX: Validate password strength (min 8 chars)
        if(newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        //comapre the pass 
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match",
            })
        }

        // get user 
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found",
            })
        }
            // update password 
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
        return res.status(401).json({ success: false, message: "Old password is incorrect" });
        }

    // hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

    // send mail about password updated
    await  mailsender(
      user.email,
      "Password Changed Successfully",
      `<h2>Hello ${user.name || "User"}</h2><p>Your password has been updated successfully.</p>`
    );
        // return response
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Change password failed, Please try again"
        })
    }
}

