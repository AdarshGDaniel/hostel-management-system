import React, { useEffect, useState } from "react";
import api from "../utils/axios.js";


function UserHomeScreen() {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    fetchUserDetails();
  }, []);
  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      console.log(token);

      if (!token) {
        return;
      }

      const response = await api.get(
        "/api/auth/get-userDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.data.success) {
        console.log(response.data.user);
        setUserData(response.data.user);
        let userInfo={
            isLoggedIn:true,
            userData:response.data.user
        }
        sessionStorage.setItem('userData',JSON.stringify(userInfo));
      } else {
        console.log(response.data.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      console.log(err.response?.data?.message || "An error occurred");
    }
  };
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Welcome to Digii Hostels</h2>
      <div style={{textAlign:'center'}}>
         <h2> Name: {userData.name} <br/> Email: {userData.email} </h2>

      </div>
    </div>
  );
}

export default UserHomeScreen;
