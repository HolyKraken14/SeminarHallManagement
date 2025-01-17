import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BookingTab from './BookingTab';

const Dashboard = () => {
  const [seminarHalls, setSeminarHalls] = useState([]);
  const [bookings, setBookings] = useState([]); // New state for bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
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

  // Fetch user bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/user", {
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
        // Notify admin (you can implement a notification system or simply log)
        alert("Booking approved. Notification sent to admin.");
      } else if (status === "rejected") {
        // Notify user
        alert("Booking rejected. User notified.");
      }
    } catch (err) {
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

  // Contact Us Form
  const ContactForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        if (response.ok) {
          setStatus("Message sent successfully!");
        } else {
          throw new Error("Failed to send message");
        }
      } catch (err) {
        setStatus("Error sending message.");
      }
    };

    return (
      <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "94%", marginBottom: "1rem", marginTop: "0.5rem" }}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "94%", marginBottom: "1rem", marginTop: "0.5rem" }}
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            style={{ width: "98%", height: "100px", marginBottom: "1rem", marginTop: "0.5rem" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem", background: "#007bff", color: "white" }}>
          Send
        </button>
        {status && <p>{status}</p>}
      </form>
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
            <span style={{ fontSize: "30px", margin: "4px 0px 0px 10px", fontWeight: "bolder" }}>RVCE ADMIN DASHBOARD</span>
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
              >
                <div>
                  <h3>{booking.seminarHallId.name}</h3>
                  <p>{booking.status}</p>
                </div>
                <div>
                  <p>{new Date(booking.bookingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  {booking.status === "pending" && (
                    <>
                      <button onClick={() => handleBookingStatusChange(booking._id, "approved")} style={{ marginRight: "0.5rem" }}>
                        Approve
                      </button>
                      <button onClick={() => handleBookingStatusChange(booking._id, "rejected")}>
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Profile" && <ProfileBox />}
        {activeTab === "Contact" && <ContactForm />}
      </main>
    </div>
  );
};

export default Dashboard;
