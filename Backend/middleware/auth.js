const jwt = require("jsonwebtoken");
const User= require("../model/User");
require("dotenv").config();


//auth 
exports.auth= async(req , res , next)=>{
    try{
        //extract
      const authHeader = req.header("Authorization");
      const token = req.cookies?.token 
      || req.body?.token 
      || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null);

     // if token missing 

     if(!token){
        return res.status(401).json({
            success: false,
            message: "Token is missing ",
        });
     }

     // verify token 
     try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode);
        req.user= decode;
        console.log(req.user);

     }catch(error){
        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
     }

     next();
    }catch(error){
        console.log(error,"Auth middleware error")
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
// is student
 
  exports.isStudent = async(req , res , next)=>{
    try{
        const {accountType}= req.user;
        if(accountType !== "Student"){
            return res.status(403).json({
                success: false,
                message: "Only for Students"
            });
        }

        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "user role is not defined"
        });
    }
  }
// is instructor

  exports.isInstructor = async(req , res , next)=>{
    try{
        const {accountType}= req.user;
        if(accountType !== "Instructor"){
            return res.status(403).json({
                success: false,
                message: "Only for Instructors"
            });
        }

        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "user role is not defined"
        });
    }
  }
// is admin
  exports.isAdmin = async(req , res , next)=>{
    try{
        const {accountType}= req.user;
        if(accountType !== "Admin"){
            return res.status(403).json({
                success: false,
                message: "Only for Admins"
            });
        }

        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "user role is not defined"
        });
    }
  }