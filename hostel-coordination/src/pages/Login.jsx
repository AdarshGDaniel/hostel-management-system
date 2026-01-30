import api from "../utils/axios.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuth } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate=useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    return errors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Login failed");
        return;
      }

      const token = response.data.token;


      sessionStorage.clear();
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("loginTime", String(Date.now()));
      sessionStorage.setItem("keepLoggedIn", JSON.stringify(true));
      localStorage.setItem("authToken", token);
      localStorage.setItem("loginTime", Date.now().toString());
      localStorage.setItem("keepLoggedIn", "true");


      console.log("LOGIN TIME SET:", sessionStorage.getItem("loginTime"));

      setAuth(token, response.data.user);

      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/homeScreen", { replace: true });
      }, 0);

    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }
  };

 

  const fetchUserDetails = async () => {
    try {

      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        return;
      }
      const response = await api.get('/api/auth/get-userDetails', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response);
      
      if (response.data.success) {
        console.log(response.data.user);
      } else {
        console.log(response.data.message || 'Failed to fetch user details');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      console.log(err.response?.data?.message || 'An error occurred');
    }
  };


  return (
    <div className="login-container">
      <h2>Login as Student / Staff</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      
      <p style={{ textAlign: "center" }}>
        Don't have an account?{" "}
        <Link
          to="/signUp"
          className="toggle-link"
          style={{ color: "#ff0000", textDecoration: "underline" }}
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
