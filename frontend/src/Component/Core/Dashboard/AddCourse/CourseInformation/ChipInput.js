
import { useEffect, useState } from "react"

import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"


export default function ChipInput({

  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  // Setting up state for managing chips array
  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse && course) {
      // console.log(course)
      setChips(course?.tag || [])
    }
    register(name, { required: false })
    
  }, [])

  useEffect(() => {

    setValue(name, [])
  
  }, [])

  useEffect(() => {
    console.log('ChipInput - Setting chips value:', chips)
    setValue(name, chips)

  }, [chips])


  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault()
      const chipValue = event.target.value.trim()
      console.log('ChipInput - Adding chip:', chipValue)
      if (chipValue && !chips.includes(chipValue)) {
        const newChips = [...chips, chipValue]
        console.log('ChipInput - New chips array:', newChips)
        setChips(newChips)
        event.target.value = ""
      }
    }
  }

  // Function to handle deletion of a chip
  const handleDeleteChip = (chipIndex) => {
    // Filter the chips array to remove the chip with the given index
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  // Render the component
  return (
    <div className="flex flex-col space-y-2">
      {/* Render the label for the input */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      {/* Render the chips and input */}
      <div className="flex w-full flex-wrap gap-y-2">
        {/* Map over the chips array and render each chip */}
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-600 px-3 py-1 text-sm text-richblack-5 font-medium shadow-sm border border-yellow-500 transition-all duration-200 hover:bg-yellow-700"
          >
            {/* Render the chip value */}
            {chip}
            {/* Render the button to delete the chip */}
            <button
              type="button"
              className="ml-2 focus:outline-none hover:bg-red-100 rounded-full p-1 transition-colors duration-200"
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className="text-sm text-richblack-5 hover:text-red-400" />
            </button>
          </div>
        ))}
        {/* Render the input for adding new chips */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="w-full p-3 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50 transition-all duration-300 hover:border-yellow-50 hover:shadow-lg placeholder:text-richblack-400"
        />
      </div>

      {console.log('ChipInput - Current errors:', errors[name], 'Chips:', chips)}
    </div>
  )
}