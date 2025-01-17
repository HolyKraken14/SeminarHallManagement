import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SeminarHallDetails from "./components/SeminarHallDetails";
import BookingTab from "./components/BookingTab";
import BookingDetails from "./components/BookingDetails"
import "./App.css"; // Import CSS for styling

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const Home = () => {
    return (
      <div className="home">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <img src="./RVCE logo.jpg" alt="RVCE Logo"/>
          </div>
          <div className="header-text" style={{color:"white"}}>
            <h3>Rashtreeya Sikshana Samithi Trust</h3>
            <h1>RV College of Engineering®</h1>
            <p>
              Autonomous Institution affiliated to Visvesvaraya Technological
              University, Belagavi
            </p>
            <p>Approved By AICTE, New Delhi</p>
            <p id="acc">Accredited by NAAC 'A+' Grade</p>
          </div>
          <div className="since">Since 1963</div>
        </header>

        {/* Glass Box */}
        <div className="glass-box1">
          <h2>About RVCE</h2>
          <p>
          Established in 1963 with three engineering branches namely Civil, 
          Mechanical and Electrical, today RVCE offers 15 Under Graduate Engineering programmes, 
          14 Master Degree programmes and Doctoral Studies.Located 13 km from the heart of Bangalore City – 
          the Silicon Valley of India, on Mysore Road.Sprawling campus spread over an area of 16.85 acres (16 acres & 34 guntas) 
          set in sylvan surroundings.Provides an ideal ambience to stimulate the teaching-learning process, 
          helping in bringing out skilled and disciplined Engineers. 
          Rated one amongst the top ten self-financing Engineering Institutions in the country. 
          Current annual student intake for Undergraduate Programmes & Post Graduate Programmes in Engineering is in excess of 1400. 
          Highly qualified and dedicated faculty. Utilizes its expertise in various disciplines to conduct Research and Development 
          for Industry and Defense establishments in the country.
          </p>
          <img id="rvce-img" src="./RVCE.jpg" alt="RVCE"/>
        </div>
        <div className="glass-box1">
          <h2>About the Seminar Hall Management System</h2>
          <p>
            The Seminar Hall Management System is a streamlined platform designed to simplify the booking and management of seminar halls. 
            It provides real-time booking updates, role-based access, and transparent records to ensure efficient resource utilization.
            Whether for academic events, workshops, or conferences, this system eliminates manual processes, 
            fostering seamless coordination and effective communication.
          </p>
          <div className="login-button-container">
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Designed and Developed by <b>Vrushabh Brahmbhatt</b> & <b>Sithij Shetty</b></p>
        </footer>
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
          path="/user-dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/seminar-hall/:id" element={<SeminarHallDetails />} />
        <Route path="/book/:seminarHallId" element={<BookingTab />} />
        <Route path="/booking-details/:bookingId" element={<BookingDetails />} />
        


        
      </Routes>
    </Router>
  );
};

export default App;
