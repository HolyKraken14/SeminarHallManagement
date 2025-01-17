import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookingDetailsManager = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched booking details:", response.data);
        setBookingDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(
          err.response?.data?.message || "Failed to fetch booking details."
        );
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handleApprove = async () => {
    try {
      setBookingDetails((prevDetails) => ({
        ...prevDetails,
        status: "approved",
      }));
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/bookings/${bookingId}/approve/manager`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking approved successfully!");
    } catch (err) {
      setBookingDetails((prevDetails) => ({
        ...prevDetails,
        status: "pending", // Revert status
      }));
      console.error("Error approving booking:", err);
      alert(err.response?.data?.message || "Failed to approve booking.");
    }
  };
  

  const handleReject = async () => {
    if (!rejectionReason) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:5000/api/bookings/${bookingId}/reject/manager`,
        { reason: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookingDetails(response.data.booking);
      alert("Booking rejected successfully!");
      setIsRejecting(false);
      setRejectionReason("");
    } catch (err) {
      console.error("Error rejecting booking:", err);
      alert(err.response?.data?.message || "Failed to reject booking.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>
          Go Back
        </button>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>No booking details found</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Booking Details</h2>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <p><strong>Event Name:</strong> {bookingDetails.eventName}</p>
        <p><strong>Event Details:</strong> {bookingDetails.eventDetails}</p>
        <p><strong>Booking Date:</strong> {new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {bookingDetails.startTime} - {bookingDetails.endTime}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color:
                bookingDetails.status === "approved"
                  ? "green"
                  : bookingDetails.status === "rejected"
                  ? "red"
                  : "orange",
            }}
          >
            {bookingDetails.status}
          </span>
        </p>
        <p><strong>Seminar Hall:</strong> {bookingDetails.seminarHallId?.name || "N/A"}</p>
        
 <h3 style={{ marginTop: '20px' }}>Event Coordinators</h3>
        {bookingDetails.eventCoordinators?.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bookingDetails.eventCoordinators.map((coordinator, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <p><strong>Name:</strong> {coordinator.name}</p>
                <p><strong>Email:</strong> {coordinator.email}</p>
                <p><strong>Contact:</strong> {coordinator.contact}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No coordinators specified.</p>
        )}

        <h3 style={{ marginTop: '20px' }}>User Details</h3>
        <p><strong>User Name:</strong> {bookingDetails.userId?.username || 'N/A'}</p>
        <p><strong>User Email:</strong> {bookingDetails.userId?.email || 'N/A'}</p>

        {bookingDetails.status === "pending" && (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleApprove}
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Approve
            </button>
            <button
              onClick={() => setIsRejecting(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        )}

        {isRejecting && (
          <div style={{ marginTop: "20px" }}>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection"
              style={{ width: "100%", height: "80px", marginBottom: "10px" }}
            />
            <button
              onClick={handleReject}
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Submit Rejection
            </button>
            <button
              onClick={() => {
                setIsRejecting(false);
                setRejectionReason("");
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ccc",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default BookingDetailsManager;
