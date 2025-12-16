import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../Component/Core/Dashboard/SideBar';


const Dashboard = () => {

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] max-w-full overflow-hidden">
        <SideBar/>
          <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto min-w-0">
            <div className="mx-auto w-11/12 max-w-[1000px] py-10 max-w-full">
              <Outlet />
            </div>
        </div>
    </div>
  )
}

export default Dashboard