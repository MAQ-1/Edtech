import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper/modules"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/api"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        console.log('ReviewSlider - API endpoint:', ratingsEndpoints.REVIEWS_DETAILS_API)
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        console.log('ReviewSlider - API response:', data)
        if (data?.success) {
          setReviews(data?.data)
        }
      } catch (error) {
        console.log('ReviewSlider - API error:', error)
      }
    })()
  }, [])

  console.log('ReviewSlider - reviews:', reviews)

  return (
    <div className="text-white">
      <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
        {reviews.length === 0 ? (
          <div className="flex items-center justify-center h-full text-richblack-300">
            <p>No reviews available yet. Be the first to review a course!</p>
          </div>
        ) : (
          <Swiper
            slidesPerView={reviews.length >= 4 ? 4 : reviews.length}
            spaceBetween={25}
            loop={reviews.length > 1}
            freeMode={true}
            autoplay={reviews.length > 1 ? {
              delay: 2500,
              disableOnInteraction: false,
            } : false}
            modules={[FreeMode, Pagination, Autoplay]}
            className="w-full"
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: reviews.length >= 4 ? 4 : reviews.length }
            }}
          >
            {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.images?.[0]
                          ? review?.user?.images[0]
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstname} ${review?.user?.lastname}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstname} ${review?.user?.lastname}`}</h1>
                      <h2 className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-richblack-25">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>
                  <div className="flex items-center gap-2 ">
                    <h3 className="font-semibold text-yellow-100">
                      {review.rating.toFixed(1)}
                    </h3>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            )
            })}
            {/* <SwiperSlide>Slide 1</SwiperSlide> */}
          </Swiper>
        )}
      </div>
    </div>
  )
}

export default ReviewSlider