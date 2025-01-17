import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [seminarHalls, setSeminarHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedBooking, setSelectedBooking] = useState(null); // New state for selected booking
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch seminar halls from backend
  useEffect(() => {
    const fetchSeminarHalls = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/seminar-halls");
        if (!response.ok) {
          throw new Error("Failed to fetch seminar halls");
        }
        const data = await response.json();
        setSeminarHalls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeminarHalls();
  }, []);

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/pending/manager", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookings();
  }, []);

  // Handle Approve/Reject Action
  const handleBookingStatusChange = async (bookingId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      );

      // Notify user or admin
      if (status === "approved") {
        alert("Booking approved. Notification sent to admin.");
      } else if (status === "rejected") {
        alert("Booking rejected. User notified.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Set the selected booking and open the detailed view
  const handleBookingClick = async (bookingId) => {
    console.log("Fetching details for booking with ID:", bookingId); // Log the booking ID
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch booking details with status code ${response.status}`);
      }
      const bookingDetails = await response.json();
      console.log("Fetched booking details:", bookingDetails);
      setSelectedBooking(bookingDetails); // Store selected booking in state
      setActiveTab("BookingDetails"); // Switch to booking details tab
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError(err.message);
    }
  };
  

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  // Profile Box
  const ProfileBox = () => {
    const username = "John Doe"; // Replace with actual username from backend
    const email = "johndoe@rvce.edu.in"; // Replace with actual email from backend

    return (
      <div style={{ padding: "1rem", background: "#f1f1f1", borderRadius: "5px" }}>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>
    );
  };

  // Get color based on booking status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      {isSidebarVisible && (
        <aside
          style={{
            width: "100px",
            background: "#f8f9fa",
            padding: "1rem",
            borderRight: "1px solid #ddd",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            transition: "transform 0.9s ease-in-out",
            transform: isSidebarVisible ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li
              style={{
                marginBottom: "1.5rem",
                marginTop: "2rem",
                cursor: "pointer",
                fontWeight: activeTab === "Dashboard" ? "bold" : "normal",
              }}
              onClick={() => setActiveTab("Dashboard")}
            >
              Home
            </li>
            <li
              style={{
                marginBottom: "1.5rem",
                cursor: "pointer",
                fontWeight: activeTab === "Profile" ? "bold" : "normal",
              }}
              onClick={() => setActiveTab("Profile")}
            >
              Profile
            </li>
            <li
              style={{
                marginBottom: "1.5rem",
                cursor: "pointer",
                fontWeight: activeTab === "Bookings" ? "bold" : "normal",
              }}
              onClick={() => setActiveTab("Bookings")}
            >
              Bookings
            </li>
            <li
              style={{
                cursor: "pointer",
                fontWeight: activeTab === "Contact" ? "bold" : "normal",
              }}
              onClick={() => setActiveTab("Contact")}
            >
              Contact Us
            </li>
          </ul>
        </aside>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", marginLeft: isSidebarVisible ? "150px" : "0" }}>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            borderBottom: "1px solid #ddd",
            paddingBottom: "0.5rem",
          }}
        >
          <div onClick={toggleSidebar} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "24px", marginRight: "0.5rem" }}>☰</span>
            <img src="./RVCE logo.jpg" alt="RVCE logo" style={{ width: "40px", marginLeft: "20px" }} />
            <span style={{ fontSize: "30px", margin: "4px 0px 0px 10px", fontWeight: "bolder" }}>RVCE MANAGER DASHBOARD</span>
          </div>
          <button onClick={handleLogout} style={{ background: "#dc3545", color: "white", width: "100px", padding: "0.5rem 1rem" }}>
            Logout
          </button>
        </nav>

        {/* Conditional Rendering */}
        {activeTab === "Dashboard" && (
          <>
            <h2>Seminar Halls</h2>
            {loading && <p>Loading seminar halls...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {seminarHalls.map((hall) => (
                <div
                  key={hall._id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "1rem",
                    width: "200px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={hall.images[0] || "/placeholder.jpg"}
                    alt={hall.name}
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                  <h3>{hall.name}</h3>
                  <p>ID: {hall.displayId}</p>
                  <Link to={`/seminar-hall/${hall._id}`}>
                    <button style={{ padding: "0.5rem 1rem" }}>View Details</button>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Bookings" && (
          <div>
            <h2>All Bookings</h2>
            {bookings.length === 0 && <p>No bookings found</p>}
            {bookings.map((booking) => (
              <div
                key={booking._id}
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: getStatusColor(booking.status),
                }}
                 // Handle click to open booking details
              >
                <div>
                  <h3>{booking.seminarHallId.name}</h3>
                  <p>{booking.status}</p>
                </div>
                <div>
                  <p>{new Date(booking.bookingDate).toLocaleDateString()}</p>
                  
                </div>
                <Link to={`/booking-details/${booking._id}`}>
                                    <button style={{ padding: "0.5rem 1rem" }}>View Details</button>
                                  </Link>
              </div>
            ))}
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}


        

        {activeTab === "Profile" && <ProfileBox />}
        {activeTab === "Contact" && <ContactForm />}
      </main>
    </div>
  );
};

export default Dashboard;
