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
import BookingDetailsManager from "./components/BookingDetailsManager"
import BookingDetailsAdmin from "./components/BookingDetailsAdmin"
import BookingDetailsUser from "./components/BookingDetailsUser"
import "./App.css"; // Import CSS for styling

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const Home = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="shrink-0">
                  <img 
                    src="./RVCE logo.jpg" 
                    alt="RVCE Logo" 
                    className="h-20 w-20 rounded-full border-4 border-white shadow-md"
                  />
                </div>
                <div className="text-white">
                  <h3 className="text-lg font-light mb-1">Rashtreeya Sikshana Samithi Trust</h3>
                  <h1 className="text-3xl font-bold mb-2">RV College of Engineering®</h1>
                  <p className="text-sm opacity-90">
                    Autonomous Institution affiliated to Visvesvaraya Technological University, Belagavi
                  </p>
                  <p className="text-sm opacity-90">Approved By AICTE, New Delhi</p>
                  <p className="text-sm font-semibold mt-2 bg-white/20 inline-block px-3 py-1 rounded-full">
                    Accredited by NAAC 'A+' Grade
                  </p>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-2xl font-bold border-b-2 border-white/30 pb-1 mb-1">Since 1963</div>
                <div className="text-sm opacity-90">Excellence in Education</div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* About RVCE Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">About RVCE</h2>
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/2">
                <p className="text-gray-600 leading-relaxed mb-6">
                  Established in 1963 with three engineering branches namely Civil, 
                  Mechanical and Electrical, today RVCE offers 15 Under Graduate Engineering programmes, 
                  14 Master Degree programmes and Doctoral Studies. Located 13 km from the heart of Bangalore City – 
                  the Silicon Valley of India, on Mysore Road.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Sprawling campus spread over an area of 16.85 acres set in sylvan surroundings,
                  providing an ideal ambience to stimulate the teaching-learning process, 
                  helping in bringing out skilled and disciplined Engineers.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-800 font-bold text-xl">15+</div>
                    <div className="text-blue-600 text-sm">UG Programs</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-800 font-bold text-xl">1400+</div>
                    <div className="text-blue-600 text-sm">Annual Intake</div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="./RVCE.jpg" 
                  alt="RVCE" 
                  className="rounded-xl shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Seminar Hall System Section */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Seminar Hall Management System</h2>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-2/3">
                <p className="text-lg leading-relaxed mb-6">
                  The Seminar Hall Management System is a streamlined platform designed to simplify 
                  the booking and management of seminar halls. It provides real-time booking updates, 
                  role-based access, and transparent records to ensure efficient resource utilization.
                </p>
                <Link to="/login">
                  <button className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold 
                    hover:bg-blue-50 transition-colors duration-300 shadow-lg">
                    Login to Get Started
                  </button>
                </Link>
              </div>
              <div className="lg:w-1/3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-1">Easy</div>
                    <div className="text-sm opacity-80">Booking Process</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-1">Real-time</div>
                    <div className="text-sm opacity-80">Updates</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-1">Secure</div>
                    <div className="text-sm opacity-80">Access Control</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-1">Smart</div>
                    <div className="text-sm opacity-80">Management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-400">
                Designed and Developed by{" "}
                <span className="font-semibold text-white">Vrushabh Brahmbhatt</span>
                {" "}&{" "}
                <span className="font-semibold text-white">Sithij Shetty</span>
              </p>
            </div>
          </div>
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
        <Route path="/booking-details/:bookingId/manager" element={<BookingDetailsManager />} />
        <Route path="/booking-details/:bookingId/admin" element={<BookingDetailsAdmin />} />
        <Route path="/booking-details/:bookingId/user" element={<BookingDetailsUser />} />
      
        
      </Routes>
    </Router>
  );
};

export default App;
