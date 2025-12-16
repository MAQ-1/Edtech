
import React from 'react'
import Template from '../Component/Core/Auth/Template';
import SignupImg from '../assets/Images/signup.webp'


const Signup = () => {
  return (
    <div>
        <Template
         title="Welcome Back"
         description1="Build skills for today, tomorrow, and beyond."
         description2="Education to future-proof your career."
         Image={SignupImg}
         formtype="signup"
        />
    </div>
  )
}

export default Signup;