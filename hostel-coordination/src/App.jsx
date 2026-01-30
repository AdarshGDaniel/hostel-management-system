import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import default CSS for toastify
import UserHomeScreen from "./pages/UserHomeScreen";
import StaffDashboard from "./pages/StaffDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Requests from "./pages/Requests";
import StaffRequests from "./pages/StaffRequests";
import StudentDashboard from "./pages/StudentDashboard";
import LiveStatus from "./pages/LiveStatus";
import StaffLeave from "./pages/StaffLeave";
import StaffUpdate from "./pages/StaffUpdate";
import SessionExpiryProvider from "./context/SessionExpiryContext";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const isLoggedIn = localStorage.getItem("keepLoggedIn") === "true";
  console.log(isLoggedIn);
  return (
    <Router>
    <SessionExpiryProvider>
      <Header/>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to={"/homeScreen"} /> : <Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/homeScreen" element={<UserHomeScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/staff-update" element={ <ProtectedRoute> <StaffUpdate /> </ProtectedRoute>}/>
            <Route path="*" element={<NotFound />} />
            <Route path="/staff-requests" element={<StaffRequests />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/live-status" element={<LiveStatus />} />
            <Route path="/view-leaves" element={<StaffLeave />} />
            <Route path="/staff-dashboard" element={ <ProtectedRoute> <StaffDashboard /> </ProtectedRoute>}/>
          </Routes>
        </Suspense>
        <ToastContainer 
          position="top-center" 
          autoClose={1000} 
          hideProgressBar={true} 
          closeOnClick 
          // pauseOnHover  
          theme="colored" 
        />
      </SessionExpiryProvider>
    </Router>
  );
};

export default App;
