import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/index.css"; // Ensure the CSS file is imported
import loginImage from "../assets/sailor.png"; // Import the image
import LoginForm from "../components/forms/LoginForm"; // Import the LoginForm component
import { BACKEND_URL } from "../config";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function
  console.log(BACKEND_URL);
  const LOGIN_SETTINGS_URL = BACKEND_URL + "login";
  console.log(import.meta.env);

  const onFinish = async (values: any) => {
    setLoading(true);
    // Example login request
    try {
      console.log("start");
      const response = await fetch(LOGIN_SETTINGS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log(data, "data");

      message.success("Login successful");
      // Redirect to the dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      message.error(
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={loginImage} alt="Login Background" />
      </div>
      <div className="login-form">
        <h1 className="login-title">Sign in to Columbus</h1>
        <LoginForm onFinish={onFinish} loading={loading} />
      </div>
    </div>
  );
};

export default Login;
