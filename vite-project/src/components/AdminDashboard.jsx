import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Home, User, Calendar, LogOut, Mail } from "lucide-react";

const Dashboard = () => {
  const [seminarHalls, setSeminarHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeminarHalls = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/seminar-halls");
        if (!response.ok) throw new Error("Failed to fetch seminar halls");
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/pending/admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  const ProfileBox = () => {
    const username = "John Doe";
    const email = "johndoe@rvce.edu.in";

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{username}</h3>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-700">Account Details</h4>
            <p className="text-gray-600"><b>Email:</b> {email}</p>
          </div>
        </div>
      </div>
    );
  };

  const ContactForm = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Support</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Get in Touch</h3>
              <p className="text-gray-600">We're here to help</p>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea className="w-full p-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out z-20 ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
              <img src="./RVCE logo.jpg" alt="RVCE logo" className="w-10 h-10" />
              <span className="text-lg font-semibold text-gray-800">RVCE</span>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 text-white">
            {[
              { id: "Dashboard", icon: Home },
              { id: "Profile", icon: User },
              { id: "Bookings", icon: Calendar }
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === id 
                    ? 'bg-blue-50 text-blue-600 font-medium hover:text-white' 
                    : 'text-white hover:bg-blue-350'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="ml-3">{id}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-300">
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className=" bg-white  hover:bg-white"
              >
                <Menu size={22} className="text-black" />
              </button>
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-800 whitespace-nowrap">Admin Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 mr-2">
                <div className="w-8 h-8  rounded-full flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">John Doe</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-white-700 hover:bg-blue-700 transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 max-w-[1920px] mx-auto">
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Seminar Halls</h2>
              </div>
              
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {seminarHalls.map((hall) => (
                  <div 
                    key={hall._id} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={hall.images[0] || "/placeholder.jpg"}
                        alt={hall.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                        ID: {hall.displayId}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">{hall.name}</h3>
                      <Link
                        to={`/seminar-hall/${hall._id}`}
                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Bookings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">All Bookings</h2>
              {bookings.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-800">No bookings found</h3>
                  <p className="mt-2 text-gray-500">There are currently no booking requests.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className={`bg-white border rounded-xl p-4 hover:shadow-sm transition-all duration-200 ${getStatusColor(booking.status)}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {booking.seminarHallId.name}
                          </h3>
                          <div className="mt-1 flex items-center space-x-3">
                            <span className="text-sm text-gray-500">
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </span>
                            <span className="text-sm font-medium capitalize">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <Link
                          to={`/booking-details/${booking._id}/admin`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Profile" && <ProfileBox />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;