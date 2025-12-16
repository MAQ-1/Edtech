import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course || {})
  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])

  useEffect(() => {
    if (editCourse && course && course.instructions) {
      setRequirementsList(course.instructions)
    }
    register(name, { required: true, validate: (value) => Array.isArray(value) && value.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log('RequirementsField - Setting requirements value:', requirementsList)
    setValue(name, requirementsList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList])

  const handleAddRequirement = () => {
    console.log('RequirementsField - Adding requirement:', requirement)
    if (requirement) {
      const currentList = Array.isArray(requirementsList) ? requirementsList : []
      const newList = [...currentList, requirement]
      console.log('RequirementsField - New requirements list:', newList)
      setRequirementsList(newList)
      setRequirement("")
    }
  }

  const handleRemoveRequirement = (index) => {
    if (Array.isArray(requirementsList)) {
      const updatedRequirements = [...requirementsList]
      updatedRequirements.splice(index, 1)
      setRequirementsList(updatedRequirements)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full p-3 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50 transition-all duration-300 hover:border-yellow-50 hover:shadow-lg placeholder:text-richblack-400"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>

      {Array.isArray(requirementsList) && requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((requirement, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{requirement}</span>
              
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() => handleRemoveRequirement(index)}
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}