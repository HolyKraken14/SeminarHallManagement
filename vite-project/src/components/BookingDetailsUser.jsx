import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AlertCircle, CheckCircle, Clock, User, Calendar, Clock3, ArrowLeft } from "lucide-react"

const BookingDetailsUser = () => {
  const { bookingId } = useParams()
  const [bookingDetails, setBookingDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }

        const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setBookingDetails(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch booking details.")
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [bookingId, navigate])

  const handleDeleteBooking = async () => {
    try {
      setIsDeleting(true)
      const token = localStorage.getItem("token")
      
      const response = await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (response.status === 200) {
        navigate("/user-dashboard", { 
          state: { activeTab: "Bookings" }
        })
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete booking.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirmation(false)
    }
  }

  const handleGoBack = () => {
    // Navigate back to the Dashboard with the Bookings tab active
    navigate("/user-dashboard", { state: { activeTab: "Bookings" } })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
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
    )
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
    )
  }

  const getStatusBadge = (status) => {
    // Define the display status mapping
    const getDisplayStatus = (backendStatus) => {
      switch (backendStatus) {
        case "pending":
        case "approved_by_manager":
          return "Pending"
        case "approved_by_admin":
          return "Confirmed"
        case "rejected_by_manager":
        case "rejected_by_admin":
          return "Rejected"
        default:
          return "Unknown"
      }
    }

    // Define styles based on the simplified status categories
    const styles = {
      Pending: "bg-yellow-500 text-white",
      Confirmed: "bg-green-500 text-white",
      Rejected: "bg-red-500 text-white",
      Unknown: "bg-gray-500 text-white",
    }

    // Define icons based on the simplified status categories
    const icons = {
      Pending: <Clock className="w-4 h-4 mr-1" />,
      Confirmed: <CheckCircle className="w-4 h-4 mr-1" />,
      Rejected: <AlertCircle className="w-4 h-4 mr-1" />,
      Unknown: <AlertCircle className="w-4 h-4 mr-1" />,
    }

    const displayStatus = getDisplayStatus(status)

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${styles[displayStatus]}`}>
        {icons[displayStatus]}
        {displayStatus}
      </span>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Back button */}
        <button
          onClick={handleGoBack}
          className="flex items-center bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 px-6 py-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Bookings
        </button>
        {/* Header */}
        <div className="flex justify-between bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex  items-center">
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          </div>
          <div className="flex">
          {bookingDetails.status !== 'approved_by_admin' && (
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="px-4 py-2 w-40 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Booking
              </button>
            )}
          </div>
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
                    <span>
                      {bookingDetails.startTime} - {bookingDetails.endTime}
                    </span>
                  </div>
                </div>
              </div>

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
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this booking? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isDeleting}
                  >
                    No
                  </button>
                  <button
                    onClick={handleDeleteBooking}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Cancelling..." : "Yes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingDetailsUser

