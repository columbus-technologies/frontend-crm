import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/index.css"; // Ensure the CSS file is imported
import loginImage from "../assets/columbus2.png"; // Import the image
import LoginForm from "../components/forms/LoginForm"; // Import the LoginForm component

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const onFinish = async (values: any) => {
    setLoading(true);
    // Example login request
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log(data);
      sessionStorage.setItem("jwtToken", data.token);
      message.success("Login successful");
      // Redirect to the dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
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
        <LoginForm onFinish={onFinish} loading={loading} />
      </div>
    </div>
  );
};

export default Login;