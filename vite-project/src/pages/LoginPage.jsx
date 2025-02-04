import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";



const LoginPage = () => {
  const navigate = useNavigate();

  // State to toggle between login and sign-up forms
  const [isLogin, setIsLogin] = useState(true);

  // State to hold the form data (email, password, confirm password)
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect to the dashboard if the user is already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle login form submission
  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Logging in...");

      // Using the backend URL from the environment variable
      const resp = await axios.post(
        `https://notes-taking-pro.onrender.com/admin/login`,
        data
      );
      console.log(resp.data);
      navigate("/dashboard");
      // Store the received token in localStorage
      if (resp?.data?.data?.token) {
        localStorage.setItem("token", resp.data.data.token);
        toast.dismiss(); // Dismiss the loading toast
        toast.success("Logged In");

        // Redirect to the dashboard after successful login
        navigate("/dashboard");
      } else {
        toast.dismiss();
        toast.error("Failed to get token. Please try again.");
      }
    } catch (error) {
      toast.dismiss(); // Dismiss the loading toast
      console.log(error);

      // Show an error message from the response or a generic one
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message || "Invalid credentials.");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  // Handle sign-up form submission
  const signUpHandler = async (e) => {
    e.preventDefault();

    // Ensure passwords match
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      toast.loading("Signing up...");

      // Using the backend URL from the environment variable
      const resp = await axios.post(
        `https://notes-taking-pro.onrender.com/admin/register`,
        data
      );

      toast.dismiss(); // Dismiss the loading toast
      toast.success("Sign Up Successful");

      // After successful sign up, redirect to the login page
      setIsLogin(true); // Switch to the login form
      toast.success("Please log in with your credentials.");
    } catch (error) {
      toast.dismiss(); // Dismiss the loading toast
      console.log(error);

      // Show an error message from the response or a generic one
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message || "Email already exists.");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form
          onSubmit={isLogin ? loginHandler : signUpHandler}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={data.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            className="text-blue-600 font-bold ml-1 hover:underline"
            onClick={() => setIsLogin(!isLogin)} // Toggle between Login and Sign Up
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
