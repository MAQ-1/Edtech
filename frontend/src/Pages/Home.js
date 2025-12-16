import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HighlightText from "../Component/Core/HomePage/HighlightText"
import CTAButton from "../Component/Core/HomePage/CTAButton"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../Component/Core/HomePage/CodeBlocks"
import TimelineSection from "../Component/Core/HomePage/TimelineSection"
import LearningLanguageSection from '../Component/Core/HomePage/LearningLanguagesection'
import InstructorSection from "../Component/Core/HomePage/InstructorSection"
import Footer from "../Component/common/Footer"
import ExploreMore from "../Component/Core/HomePage/ExploreMore"
import ReviewSlider from '../Component/common/ReviewSlider'

export const Home = () => {


  return (
    <div>

        {/* Section- 1*/}
        
        <div className=' relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
           <Link to ={"/signup"}>
             <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit shadow shadow-richblack-600 '>
                   <div className='flex flex-row items-center gap-2 rounded-full px-6 py-[5px]
                    transition-all duration-200 group-hover:bg-richblack-900 '>
                          <p>Become an Instructure</p>
                          <FaArrowRight/>
                   </div>
             </div>
           </Link>

            <div className=' mt-7 text-center text-2xl sm:text-3xl md:text-4xl font-semibold'>
                Empower Your Future with
                <HighlightText text={"Coding Skills"}/>
            </div>

            <div className='w-[95%] sm:w-[90%] mt-3 text-center text-sm sm:text-base md:text-lg font-bold text-richblack-300' 
               
            >
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
            </div>

            <div className='flex flex-col sm:flex-row gap-4 sm:gap-7 mt-8'>

                <CTAButton active={true} linkto={"/signup"}>
                     Learn More
                </CTAButton>

                <CTAButton active={false} linkto={"/signup"}>
                     Book a Demo
                </CTAButton>

            </div>
            
            <div className =' mx-3 sm:mx-5 my-10 sm:my-16 max-w-full shadow-[10px_-5px_50px_-5px] shadow-blue-200 '>
                 <video className="w-full  shadow-[20px_20px_rgba(255,255,255)]"
                 muted
                 loop
                 autoPlay>
                 
                 <source src={Banner} type="video/mp4"/>
                 </video>
            </div>


            {/* Code Section-1 */}

             <div>
                <CodeBlocks
                  position={"lg:flex-row"}
                  heading={
                     <div className='text-4xl font-bold'>
                        Unlock Your
                        <HighlightText text={"coding Potential"}/>
                        {" "}
                        with our online courses
                     </div>
                  }
                  subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                  ctabtn1={
                    {
                        btnText:"Try it yourself",
                        linkto :"/login",
                        active: true,

                    }
                  }

                      ctabtn2={
                    {
                      btnText:"Learn More",
                      linkto:"/login",
                      active:false,
                    }
                  }

                  codeBlock={'<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a>\n<a href="/two">Two</a><a href="/three">Three</a>\n</nav>\n</body>'}
                  codeColor="text-yellow-200"
                  backgroundGradient={<div className="codeblock1 absolute"></div>}

                />
             </div>


             {/* Code Section-2 */}
             <div>
                <CodeBlocks
                  position={'lg:flex-row-reverse'}
                  heading={
                     <div className='text-4xl font-bold'>
                        Start
                        <HighlightText text={"coding in seconds"}/>
                        {" "}
                        
                     </div>
                  }
                  subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                  ctabtn1={
                    {
                        btnText:"Continue Lesson",
                        linkto :"/login",
                        active:true,

                    }
                  }
                  ctabtn2={
                    {
                      btnText:"Learn More",
                      linkto:"/login",
                      active:false,
                    }
                  }

                  codeBlock={'<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="/one">One</a>\n<a href="/two">Two</a><a href="/three">Three</a>\n</nav>\n</body>'}
                  codeColor="text-pink-200"
                  backgroundGradient={<div className="codeblock2 absolute"></div>}

                />
             </div>
                  
           
           <ExploreMore/>

        </div>

        {/* Section- 2*/}

        <div className=' bg-pure-greys-5  text-richblack-700 mt-10'>
            <div className='homepage_bg h-[333px]'>
                
                <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'> 
                            
                            <div className='lg:h-[150px]'></div>
                            <div className='flex flex-row gap-7 text-white'> 
                                    <CTAButton active={true} linkto={"/signup"}>
                                      <div className='flex items-center gap-3'>
                                        Explore Full Catalog
                                        <FaArrowRight/>
                                      </div>
                                    
                                    </CTAButton>

                                    <CTAButton active={false} linkto={"/signup"}>
                                           <div>
                                            Learn More
                                           </div>
                                    </CTAButton>
                            </div>
                </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 '>
                  
                  <div className='mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0'>
                       <div className='text-4xl font-semibold lg:w-[45%]'>
                        Get The Skills you need for a 
                        <HighlightText text={"Job that is in demand"}/>
                       </div>

                      <div className='flex flex-col items-start gap-10 lg:w-[40%] '>

                        <p className='text-[16px]'>
                        The modern StudyNotion is the dictates its own terms. Today, to
                        be a competitive specialist requires more than professional
                        skills.
                        </p>

                        <CTAButton active={true} linkto={"/signup"}>
                          <div>
                                  Learn More
                          </div>
                        </CTAButton>

                    </div>
                  </div>


                              <TimelineSection/>

                              <LearningLanguageSection/>
            </div>




        </div>
         

        {/* Section- 3*/}

         <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 
         text-white '>

                  <InstructorSection/> 

                  <h2 className='text-center text-4xl font-semibold mt-20'> Review from other Learners</h2>

                  <ReviewSlider />

         </div>


        {/* Section- 4*/}

        <Footer/>


    </div>
  )
}
