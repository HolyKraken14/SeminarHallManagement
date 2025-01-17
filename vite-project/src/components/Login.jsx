import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [credential, setCredential] = useState(""); // Allows username or email
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credential || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true); // Set loading state
    setMessage(""); // Clear any existing messages

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        credential,
        password,
      });
    
      console.log(response.data); // Check response for token and role
      const { token, role, userId } = response.data;

      if (token && role && userId) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId); // Store userId in localStorage
      }
      console.log("Token stored in localStorage:", localStorage.getItem("token"));
      console.log("Role stored in localStorage:", localStorage.getItem("role"));
      console.log("User ID stored in localStorage:", localStorage.getItem("userId"));
  
    
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "manager") {
        navigate("/manager-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.log(error); // Log full error for debugging
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("Error: Could not connect to the server.");
      }
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to bottom, #ffffff, #f0f0f0)",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "left",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "black", textAlign: "center" }}>Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
            >
              Username or Email:
            </label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              style={{
                width: "93%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
            >
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "93%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <p
            style={{
              marginTop: "1rem",
              color: message.startsWith("Error") ? "red" : "green",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
        <p style={{ marginTop: "1rem", color: "#555" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#007BFF",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
