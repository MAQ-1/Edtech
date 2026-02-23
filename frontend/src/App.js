import './App.css';
// ✅ Vercel CI build fix: Removed unused Navigate import
import { Route, Routes } from "react-router-dom";
import {Home} from "../src/Pages/Home";
import Navbar from "../src/Component/common/Navbar";
import Login from "../src/Pages/Login";
import Signup from "../src/Pages/Signup";
import OpenRoute from "../src/Component/Core/Auth/OpenRoute"
import ForgotPassword from "../src/Pages/ForgotPassword"
import UpdatePassword from "../src/Pages/UpdatePassword"
import VerifyEmail from "../src/Pages/VerifyEmail"
import About from "../src/Pages/About"
import Myprofile from "../src/Component/Core/Dashboard/Myprofile"
import PrivateRoute from "../src/Component/Core/Auth/PrivateRoute"
import Dashboard from "./Pages/Dashboard";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from './slices/profileSlice';
import Spinner from './Component/common/Spinner';
import Setting from './Component/Core/Dashboard/Setting';
import EnrolledCourses from './Component/Core/Dashboard/EnrolledCourses';
import Cart from './Component/Core/Dashboard/Cart';
import { ACCOUNT_TYPE } from "./utils/constants";

// Import missing components
import Instructor from "./Component/Core/Dashboard/InstructorDashboard/Instructor";
import AddCourse from "./Component/Core/Dashboard/AddCourse";
import MyCourses from "./Component/Core/Dashboard/MyCourses.js";
import EditCourse from "./Component/Core/Dashboard/AddCourse/EditCourse/Index";
import Catalog from './Pages/Catalog';
import CourseDetails from './Pages/CourseDetails';
import Contact from "./Pages/Contact";
import VideoDetails from "./Component/Core/ViewCourse/VideoDetails";
import ViewCourse from "./Pages/ViewCourse"


function App() {
  const dispatch = useDispatch();
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  if (authLoading || profileLoading) {
    return <Spinner />;
  }
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'> 
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/catalog/:catalogName" element={<Catalog />} />
        <Route path="/course/:courseId" element={<CourseDetails/>}/>
        <Route path="/courses/:courseId" element={<CourseDetails/>}/>

            <Route
              path="signup"
              element={
                <OpenRoute>
                  <Signup />
                </OpenRoute>
              }
            />
        <Route
              path="login"
              element={
                <OpenRoute>
                  <Login />
                </OpenRoute>
              }
            />

            <Route path="/contact" element={<Contact />} />

            <Route
              path="forgot-password"
              element={
                <OpenRoute>
                  <ForgotPassword />
                </OpenRoute>
              }
            />

             <Route
              path="update-password/:id"
              element={
                <OpenRoute>
                  <UpdatePassword />
                </OpenRoute>
              }
            /> 

             <Route
              path="verify-email"
              element={
                <OpenRoute>
                  <VerifyEmail />
                </OpenRoute>
              }
            />  

            <Route
              path="about"
              element={
                <OpenRoute>
                  <About />
                </OpenRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            >
              <Route path="my-profile" element={<Myprofile />} />
               <Route path="settings" element={<Setting />} />

                {
                   user?.accountType === ACCOUNT_TYPE.STUDENT && (
                    <>
                    <Route path="cart" element={<Cart />} />
                    <Route path="enrolled-courses" element={<EnrolledCourses />} />
                    

                    </>
                   )
                }
                   


               
                {
                    user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                      <>
                      <Route path="instructor" element={<Instructor />} />
                      <Route path="add-course" element={<AddCourse />} />
                      <Route path="my-courses" element={<MyCourses />} />
                      <Route path="edit-course/:courseId" element={<EditCourse />} />
                      </>
                    )
                }
               

            </Route>

            {/* ViewCourse routes outside dashboard */}
            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                <Route 
                  path="/view-course/:courseId"
                  element={
                    <PrivateRoute>
                      <ViewCourse />
                    </PrivateRoute>
                  }
                >
                  <Route 
                    path="section/:sectionId/sub-section/:subSectionId"
                    element={<VideoDetails />}
                  />
                </Route>
                </>
              )
            }  

            {/* ✅ Vercel CI build fix: Proper JSX comment syntax */}
            <Route path="*" element={<div className="text-white p-8 mx-auto">Page not found. Current path: {window.location.pathname}</div>} />

      </Routes>
    </div>
  );
}

export default App;
