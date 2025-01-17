import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate RVCE email
    const rvceEmailRegex = /^[a-zA-Z0-9._%+-]+@rvce\.edu\.in$/;
    if (!rvceEmailRegex.test(email)) {
      setMessage("Only RVCE email IDs are allowed.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      setMessage(`Registration successful: ${response.data.message}`);

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("Error: Could not connect to the server.");
      }
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
          padding: "1rem 1rem 0rem 1rem",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "left",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "black", textAlign: "center" }}>Register</h2>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
            >
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          >
            Register
          </button>
        </form>
        {message && (
          <p
            style={{
              marginTop: "1rem",
              color: message.startsWith("Error") ? "red" : "green",
              fontWeight: "600px",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
