import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, CheckCircle, Clock, User, Calendar, Clock3, ArrowLeft } from "lucide-react";

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

        setBookingDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch booking details."
        );
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handleGoBack = () => {
    // Navigate back to the Manager Dashboard with the Bookings tab active
    // and preserve the sidebar state
    const sidebarVisible = localStorage.getItem("sidebarVisible")
    navigate("/manager-dashboard", {
      state: {
        activeTab: "Bookings",
        sidebarVisible: sidebarVisible ? JSON.parse(sidebarVisible) : false,
      },
    })
  }
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
        status: "pending",
      }));
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
      alert(err.response?.data?.message || "Failed to reject booking.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center text-yellow-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>No booking details found</p>
        </div>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      approved_by_manager: "bg-green-500 text-white",
      approved_by_admin: "bg-green-500 text-white",
      rejected_by_manager: "bg-red-500 text-white",
      pending: "bg-yellow-500 text-white",
    };

    const icons = {
      approved_by_manager: <CheckCircle className="w-4 h-4 mr-1" />,
      approved_by_admin: <CheckCircle className="w-4 h-4 mr-1" />,
      rejected_by_manager: <AlertCircle className="w-4 h-4 mr-1" />,
      pending: <Clock className="w-4 h-4 mr-1" />,
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Back button */}
      <button
        onClick={handleGoBack}
        className="flex items-center bg-gray-50 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Bookings
      </button>
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium mr-2">Event Name:</span>
                    <span>{bookingDetails.eventName}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock3 className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium mr-2">Date:</span>
                    <span>{new Date(bookingDetails.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock3 className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium mr-2">Time:</span>
                    <span>{bookingDetails.startTime} - {bookingDetails.endTime}</span>
                  </div>
                </div>
              </div>
``
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
                {getStatusBadge(bookingDetails.status)}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Venue</h3>
                <p className="text-gray-600">{bookingDetails.seminarHallId?.name || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Details</h3>
                <p className="text-gray-600">{bookingDetails.eventDetails}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium mr-2">Name:</span>
                    <span>{bookingDetails.userId?.username || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium mr-2">Email:</span>
                    <span>{bookingDetails.userId?.email || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Coordinators Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Coordinators</h3>
            {bookingDetails.eventCoordinators?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookingDetails.eventCoordinators.map((coordinator, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-medium mr-2">Name:</span>
                        <span>{coordinator.name}</span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium mr-2">Email:</span>
                        {coordinator.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium mr-2">Contact:</span>
                        {coordinator.contact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No coordinators specified.</p>
            )}
          </div>
          
        </div>
        <div>
                {(bookingDetails.status === 'rejected_by_manager' || 
                  bookingDetails.status === 'rejected_by_admin') && 
                  bookingDetails.rejectionReason && (
                  <div className="px-6 py-4 bg-red-50 border-t border-red-100">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-red-800">Rejection Reason:</h4>
                        <p className="mt-1 text-sm text-red-700">{bookingDetails.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
        

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 space-y-4">
          {bookingDetails.status === "pending" && (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApprove}
                className="w-full sm:w-1/2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => setIsRejecting(true)}
                className="w-full sm:w-1/2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          )}

          {isRejecting && (
            <div className="space-y-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection"
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleReject}
                  className="w-full sm:w-1/2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Rejection
                </button>
                <button
                  onClick={() => {
                    setIsRejecting(false);
                    setRejectionReason("");
                  }}
                  className="w-full sm:w-1/2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsManager;