import React from "react"

import Footer from "../Component/common/Footer"
import ContactUsForm from "../Component/Core/ContactPage/ContactUsForm"

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
            <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
              <div className="flex flex-row items-center gap-3">
                <p className="text-lg font-semibold text-richblack-5">Chat with us</p>
              </div>
              <p>Our friendly team is here to help.</p>
              <p className="font-semibold text-richblack-5">info@studynotion.com</p>
            </div>
            <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
              <div className="flex flex-row items-center gap-3">
                <p className="text-lg font-semibold text-richblack-5">Visit us</p>
              </div>
              <p>Come and say hello at our office HQ.</p>
              <p className="font-semibold text-richblack-5">Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</p>
            </div>
            <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
              <div className="flex flex-row items-center gap-3">
                <p className="text-lg font-semibold text-richblack-5">Call us</p>
              </div>
              <p>Mon - Fri From 8am to 5pm</p>
              <p className="font-semibold text-richblack-5">+123 456 7890</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactUsForm />
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  )
}

export default Contact