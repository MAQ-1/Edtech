import React from 'react'

const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-50"></div>
    </div>
  )
}

export default Spinner