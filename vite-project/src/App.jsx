import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const Home = () => {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>Seminar Hall Management System</h1>
        <p>Welcome to the Seminar Hall Management System. Please register or login to proceed.</p>
        <div>
          <Link to="/register">
            <button style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}>Register</button>
          </Link>
          <Link to="/login">
            <button style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}>Login</button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
