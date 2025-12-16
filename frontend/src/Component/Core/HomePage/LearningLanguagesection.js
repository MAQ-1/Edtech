import React from 'react'
import Highlighttext from "../HomePage/HighlightText"
import Know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_your_lesson from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "../HomePage/CTAButton"


const LearningLanguagesection = () => {
  return (
    <div className='mt-[140px] mb-20'>
         <div className='flex flex-col gap-5 items-center'>
            
            <div className='text-4xl font-semibold text-center'>
                Your Swiss Knife for 
                <Highlighttext text={"Learning any language"}/>
            </div>

            <div className='text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3'>
                Using spin making learning multiple languages easy.
                 with 20+ languages realistic voice-over, progress tracking, 
                 custom schedule and more.
            </div>
               

               {/* 3 Images */ }

            <div className='flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0'>

                <img 
                src={Know_your_progress}
                alt="KnowYourProgessImage"
                className='object-contain lg:-mr-32 '
                
                />

                 <img 
                src={compare_your_lesson}
                alt="compare_your_lesson"
                className='object-contain lg:-mb-10 lg:-mt-0 -mt-12'
                
                />

               <img 
                src={plan_your_lesson}
                alt="plan_your_lesson"
                className='object-contain  lg:-ml-36 lg:-mt-5 -mt-16'
                
                />

            </div>
           
            <div className='w-fit mt-2 '>
                <CTAButton active={true} linkto={"/signup"}>
                      <div>
                        Learn More
                      </div>
                </CTAButton>
            </div>


         </div>
    </div>
  )
}

export default LearningLanguagesection;