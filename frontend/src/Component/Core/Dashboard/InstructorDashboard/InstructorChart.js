import { useState, useMemo } from "react"

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")

  const chartData = useMemo(() => {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green  
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#F97316', // Orange
      '#84CC16', // Lime
      '#EC4899', // Pink
      '#6366F1'  // Indigo
    ]
    
    if (currChart === "students") {
      return courses.map((course, index) => ({
        name: course.courseName,
        value: course.totalStudentsEnrolled,
        color: colors[index % colors.length]
      }))
    } else {
      return courses.map((course, index) => ({
        name: course.courseName,
        value: course.totalAmountGenerated,
        color: colors[index % colors.length]
      }))
    }
  }, [courses, currChart])

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  // Create pie chart data
  const pieData = useMemo(() => {
    if (total === 0) return []
    
    let cumulativePercentage = 0
    return chartData.map(item => {
      const percentage = (item.value / total) * 100
      const startAngle = cumulativePercentage * 3.6 // Convert to degrees
      const endAngle = (cumulativePercentage + percentage) * 3.6
      cumulativePercentage += percentage
      
      return {
        ...item,
        percentage: percentage.toFixed(1),
        startAngle,
        endAngle
      }
    })
  }, [chartData, total])

  const createPieSlice = (item, index) => {
    const { startAngle, endAngle, color } = item
    const radius = 90
    const centerX = 110
    const centerY = 110
    
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180
    
    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')
    
    return (
      <path
        key={index}
        d={pathData}
        fill={color}
        stroke="#111827"
        strokeWidth="3"
        className="hover:brightness-110 hover:scale-105 transition-all duration-500 ease-out cursor-pointer filter drop-shadow-sm"
        style={{
          transformOrigin: `${centerX}px ${centerY}px`,
          animation: `fadeInScale 0.8s ease-out ${index * 0.1}s both`
        }}
      />
    )
  }

  return (
    <div className="h-full rounded-md bg-richblack-800 p-6 flex flex-col">
      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
      <p className="text-lg font-bold text-richblack-5 mb-4 animate-fadeInUp">Visualize</p>
      
      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setCurrChart("students")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            currChart === "students"
              ? "bg-yellow-50 text-richblack-900"
              : "bg-richblack-700 text-yellow-400 hover:bg-richblack-600"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            currChart === "income"
              ? "bg-yellow-50 text-richblack-900"
              : "bg-richblack-700 text-yellow-400 hover:bg-richblack-600"
          }`}
        >
          Income
        </button>
      </div>

      {/* Total Display */}
      {total > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-richblack-700 to-richblack-600 rounded-lg border border-richblack-500 transform transition-all duration-700 ease-out animate-fadeInUp">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-50 mb-1 transition-all duration-500 ease-out">
              {currChart === "students" ? total : `Rs. ${total.toLocaleString()}`}
            </div>
            <div className="text-sm text-richblack-300 transition-all duration-300 ease-out">
              Total {currChart === "students" ? "Students Enrolled" : "Revenue Generated"}
            </div>
          </div>
        </div>
      )}

      {/* Chart Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Pie Chart */}
        <div className="flex-1 flex items-center justify-center min-h-[250px] lg:min-h-0">
          {total > 0 ? (
            <div className="relative transform transition-all duration-700 ease-out animate-fadeInScale">
              <svg 
                width="200" 
                height="200" 
                className="w-48 h-48 sm:w-52 sm:h-52 lg:w-56 lg:h-56 transform -rotate-90 drop-shadow-lg transition-transform duration-500 ease-out hover:scale-105"
                viewBox="0 0 220 220"
              >
                {pieData.map((item, index) => createPieSlice(item, index))}
              </svg>
            </div>
          ) : (
            <div className="text-center text-richblack-400 animate-fadeIn">
              <div className="text-4xl mb-2 animate-bounce">📊</div>
              <div className="animate-fadeInUp">No data to display</div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="w-full lg:w-64 max-h-60 lg:max-h-none overflow-y-auto">
          <div className="space-y-2">
            {pieData.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-richblack-700 rounded-lg hover:bg-richblack-600 hover:scale-102 transition-all duration-300 ease-out transform"
                style={{
                  animation: `slideInRight 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300 ease-out hover:scale-125" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-richblack-50 text-xs sm:text-sm font-medium truncate transition-colors duration-200">{item.name}</span>
                </div>
                <div className="text-right ml-2">
                  <div className="text-richblack-25 font-bold text-xs sm:text-sm transition-all duration-200">
                    {currChart === "students" ? `${item.value}` : `Rs. ${item.value.toLocaleString()}`}
                  </div>
                  <div className="text-richblack-400 text-xs transition-colors duration-200">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}