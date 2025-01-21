import React, { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, Home, User, Calendar, Mail, LogOut } from "lucide-react"
import BookingTab from "./BookingTab"

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "Dashboard")
  const [bookingTabView, setBookingTabView] = useState("pending")
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    const saved = localStorage.getItem("sidebarVisible")
    return saved !== null ? JSON.parse(saved) : false
  })
  const [seminarHalls, setSeminarHalls] = useState([])
  const [bookings, setBookings] = useState([])
  const [user, setUser] = useState({ username: "", email: "" })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  //const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedHall, setSelectedHall] = useState(null)

  // Existing fetch functions remain the same
  useEffect(() => {
    const fetchSeminarHalls = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/seminar-halls")
        if (!response.ok) throw new Error("Failed to fetch seminar halls")
        const data = await response.json()
        setSeminarHalls(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSeminarHalls()
  }, [])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        if (!response.ok) throw new Error("Failed to fetch bookings")
        const data = await response.json()
        setBookings(data.bookings)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchBookings()
  }, [])

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true)
      try {
        const userId = localStorage.getItem("userId")
        console.log("Attempting to fetch user with ID:", userId)

        const response = await fetch(`http://localhost:5000/api/users/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch user information")

        const data = await response.json()
        console.log("Received user data:", data)

        // The response has userDetails property, so use that directly
        setUser(data.userDetails)
      } catch (err) {
        console.error("Error fetching user info:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo() // Remove the activeTab condition since we want to fetch user data on component mount
  }, []) // Remove activeTab from dependency array

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev)
  }

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

  const getStatusStyle = (backendStatus) => {
    const baseStyle = "inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium"

    switch (backendStatus) {
      case "pending":
      case "approved_by_manager":
        return `${baseStyle} bg-yellow-100 text-yellow-700`
      case "approved_by_admin":
        return `${baseStyle} bg-green-100 text-green-700`
      case "rejected_by_manager":
      case "rejected_by_admin":
        return `${baseStyle} bg-red-100 text-red-700`
      default:
        return `${baseStyle} bg-gray-100 text-gray-700`
    }
  }
  const filterBookings = (status) => {
    switch (status) {
      case "pending":
        return bookings.filter((booking) => booking.status === "pending" || booking.status === "approved_by_manager")
      case "confirmed":
        return bookings.filter((booking) => booking.status === "approved_by_admin")
      case "rejected":
        return bookings.filter(
          (booking) => booking.status === "rejected_by_manager" || booking.status === "rejected_by_admin",
        )
      default:
        return []
    }
  }

  const BookingsList = ({ bookings }) => {
    if (bookings.length === 0) {
      return (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-lg">
          <Calendar className="mx-auto h-16 w-16 text-indigo-400" />
          <h3 className="mt-6 text-xl font-bold text-gray-800">No bookings found</h3>
          <p className="mt-3 text-gray-500">No bookings in this category.</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1
              ${
                booking.status === "approved_by_admin"
                  ? "border-green-200 bg-green-50"
                  : booking.status === "rejected_by_manager" || booking.status === "rejected_by_admin"
                    ? "border-red-200 bg-red-50"
                    : "border-yellow-200 bg-yellow-50"
              }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{booking.seminarHallId.name}</h3>
                <div className="mt-3 flex items-center space-x-4">
                  <span className={getStatusStyle(booking.status)}>{getDisplayStatus(booking.status)}</span>
                  <span className="text-sm text-gray-500 font-medium">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Link
                to={`/booking-details/${booking._id}/user`}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl 
                  hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab)
      // Clear the state after setting the active tab
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  useEffect(() => {
    localStorage.setItem("sidebarVisible", JSON.stringify(isSidebarVisible))
  }, [isSidebarVisible])

  const ProfileSection = ({ user, loading, error }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
                <User size={36} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{user.username || "N/A"}</h3>
                <p className="text-indigo-600 font-medium">{user.role || "User"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Email Address</h4>
                  <p className="text-gray-800 font-medium">{user.email || "N/A"}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Username</h4>
                  <p className="text-gray-800 font-medium">{user.username || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Role</h4>
                  <p className="text-gray-800 font-medium">{user.role || "User"}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Joined On</h4>
                  <p className="text-gray-800 font-medium">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-indigo-600 to-indigo-800 shadow-xl 
          transform transition-transform duration-300 ease-in-out z-20 ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-indigo-500/30">
            <div className="flex items-center space-x-4">
              <img src="./RVCE logo.jpg" alt="RVCE logo" className="w-14 h-14 rounded-full border-4 shadow-lg" />
              <span className="text-xl font-bold text-white">RVCE</span>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-4">
            {[
              { id: "Dashboard", icon: Home },
              { id: "Profile", icon: User },
              { id: "Bookings", icon: Calendar },
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === id
                    ? "bg-white text-indigo-600 shadow-lg transform scale-105 hover:text-white/80"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="ml-4 font-medium">{id}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarVisible ? "ml-72" : "ml-0"}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-md">
          <div className="h-20 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={toggleSidebar} className="bg-white hover:bg-white">
                <Menu size={23} className="text-indigo-800" />
              </button>
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-indigo-700 whitespace-nowrap">Welcome, {user.username}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-5">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-indigo-600" />
                </div>
                <div className="flex w-20">
                  <span className="text-sm font-medium text-gray-700"> {user.username || "User"}</span>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl 
                  bg-gradient-to-r from-indigo-600 to-indigo-700 text-white-700 
                  hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 max-w-[1920px] mx-auto">
          {activeTab === "Dashboard" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Book a Seminar Hall</h2>
              </div>

              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-8">
                {seminarHalls.map((hall) => (
                  <div
                    key={hall._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
                      border border-gray-100 overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={hall.images[0] || "/placeholder.jpg"}
                        alt={hall.name}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium text-gray-700">
                        ID: {hall.displayId}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">{hall.name}</h3>
                      <div className="space-y-3">
                        <Link
                          to={`/seminar-hall/${hall._id}`}
                          className="block w-full text-center px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl 
                            hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => setSelectedHall(hall)}
                          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl 
                            hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Bookings" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>

                {/* Booking Status Tabs */}
                <div className="flex space-x-4 mb-8">
                  {[
                    { id: "pending", label: "Pending", color: "yellow" },
                    { id: "confirmed", label: "Confirmed", color: "green" },
                    { id: "rejected", label: "Rejected", color: "red" },
                  ].map(({ id, label, color }) => (
                    <button
                      key={id}
                      onClick={() => setBookingTabView(id)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 
                        ${
                          bookingTabView === id
                            ? `bg-${color}-100 text-${color}-800 shadow-lg hover:bg-blue-100`
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        } border-2 border-${color}-200`}
                    >
                      {label}
                      <span className="ml-2 px-2 py-1 rounded-lg bg-white text-sm">{filterBookings(id).length}</span>
                    </button>
                  ))}
                </div>

                {/* Filtered Bookings List */}
                <BookingsList bookings={filterBookings(bookingTabView)} />
              </div>
            </div>
          )}

          {activeTab === "Profile" && (
            <ProfileSection user={user} loading={loading} error={error} bookings={bookings} />
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {selectedHall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-11/12 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Book Seminar Hall</h3>
                <div>
                  <button
                    onClick={() => setSelectedHall(null)}
                    className="items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 
                      text-white-700 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <span className="text-sm font-medium">Close</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-8">
              <BookingTab seminarHall={selectedHall} onClose={() => setSelectedHall(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

