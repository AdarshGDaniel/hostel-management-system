import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import usr_img from '../assets/userlog.webp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { getUser, logout as clearAuth } from '../utils/auth';
import './components.css';
import img from "../assets/Digii.png";

const Header = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);


  const navigate=useNavigate();

  useEffect(() => {
    const auth = getUser();
    if (auth?.isLoggedIn) {
      getData(auth.userData);
    }
  }, [location]);

  const logout = () => {
    localStorage.clear();
    clearAuth();
    setUserData(null);
    navigate("/");
  };

  const getData=async()=>{
    const data =await JSON.parse(sessionStorage.getItem('userData'));
    
    if (data && data.isLoggedIn) {
      setUserData(data.userData);
    }
  }


  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={img} style={{width: '20px', margin: '10px'}}></img>
        <span className="logo-text"><b style={{color: "red"}}>Digii </b>Hostels</span>
      </div>
      <ul className="navbar-links"> 
        <li>
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>Home</Link>
        </li>

        {userData && (userData.userType === "student") && (
          <li>
            <Link to="/requests" className={location.pathname === '/requests' ? 'active' : ''}>Requests</Link>
          </li>
        )}

        {userData && (userData.userType === "staff" || userData.userType === "admin") && (
          <li>
            <Link to="/staff-update" className={location.pathname === '/staff-update' ? 'active' : ''}>Post Updates</Link>
          </li>
        )}
        {userData && (userData.userType === "staff" || userData.userType === "admin") && (
          <li>
            <Link to="/staff-requests" className={location.pathname === '/staff-requests' ? 'active' : ''}>View Requests</Link>
          </li>
        )}
        {userData && (userData.userType === "staff" || userData.userType === "admin") && (
          <li>
            <Link to="/live-status" className={location.pathname === '/live-status' ? 'active' : ''}>Live Status</Link>
          </li>
        )}
        {userData && (userData.userType === "staff" || userData.userType === "admin") && (
          <li>
            <Link to="/view-leaves" className={location.pathname === '/view-leaves' ? 'active' : ''}>View Leaves</Link>
          </li>
        )}


{/* Conditional Rendering based on user login status  */}
        {userData ? (
          <>
           <li className="navbar-profile">
              {userData && (userData.userType === "staff" || userData.userType === "admin") && (
                  <Link to="/staff-dashboard" className={location.pathname === '/staff-dashboard' ? 'active' : ''} style={{display:'flex'}}>
                  <img 
                    src={usr_img} 
                    alt="Profile" 
                    className="profile-photo-circle" 
                  />
                  <span className="username">{userData.name}</span></Link>
              )}
              {userData && (userData.userType === "student") && (
                  <Link to="/student-dashboard" className={location.pathname === '/student-dashboard' ? 'active' : ''} style={{display:'flex'}}>
                  <img 
                    src={usr_img} 
                    alt="Profile" 
                    className="profile-photo-circle" 
                  />
                  <span className="username">{userData.name}</span></Link>
              )}

          
          </li>
          <li>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="logo-icon"
              style={{ cursor: "pointer", fontSize: "20px", color: "#fff" }}
              onClick={logout}
            />

          </li>
          </>

         
        ) : (
          <>
            <li>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
            </li>
            <li>
              <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
