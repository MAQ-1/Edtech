
import React from 'react'
import Template from '../Component/Core/Auth/Template'
import loginImg from '../assets/Images/login.webp'

const Login = () => {
  return (
    <div>
        <Template
         title="Welcome Back"
         description1="Build skills for today, tomorrow, and beyond."
         description2="Education to future-proof your career."
         Image={loginImg}
         formtype="login"
        />
    </div>
  )
}

export default Login;