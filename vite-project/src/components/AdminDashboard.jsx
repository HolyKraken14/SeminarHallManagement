import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Home, User, Calendar, LogOut, Mail } from 'lucide-react';

const ProfileSection = ({ user, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{user?.username || 'N/A'}</h3>
              <p className="text-gray-600">{user?.role || 'Admin'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                <p className="text-gray-800">{user?.email || 'N/A'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                <p className="text-gray-800">{user?.username || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Role</h4>
                <p className="text-gray-800">{user?.role || 'Admin'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Joined On</h4>
                <p className="text-gray-800">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
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

const Dashboard = () => {
  const [seminarHalls, setSeminarHalls] = useState([]);
  const [managerApprovedBookings, setManagerApprovedBookings] = useState([]);
  const [adminApprovedBookings, setAdminApprovedBookings] = useState([]);
  const [adminRejectedBookings, setAdminRejectedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeBookingTab, setActiveBookingTab] = useState("ManagerApproved");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [user, setUser] = useState(null);
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
        const response = await fetch("http://localhost:5000/api/bookings/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setManagerApprovedBookings(data.bookings.filter(booking => booking.status === "approved_by_manager"));
        setAdminApprovedBookings(data.bookings.filter(booking => booking.status === "approved_by_admin"));
        setAdminRejectedBookings(data.bookings.filter(booking => booking.status === "rejected_by_admin"));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5000/api/users/user/${userId}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch user information');
        
        const data = await response.json();
        setUser(data.userDetails);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  const getStatusColor = (status) => {
    const colors = {
      'approved_by_manager': 'bg-yellow-200 text-yellow-800',
      'approved_by_admin': 'bg-green-200 text-green-800',
      'rejected_by_admin': 'bg-red-200 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderBookings = (bookings) => {
    if (bookings.length === 0) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-800">No bookings found</h3>
          <p className="mt-2 text-gray-500">There are currently no booking requests in this category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className={` border rounded-xl p-4 hover:shadow-sm transition-all duration-200 ${getStatusColor(booking.status)}`}
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
                    {booking.status.replace(/_/g, ' ')}
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out z-20 ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img src="/RVCE logo.jpg" alt="RVCE logo" className="w-10 h-10" />
              <span className="text-lg font-semibold text-gray-800">RVCE</span>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: "Dashboard", icon: Home },
              { id: "Profile", icon: User },
              { id: "Bookings", icon: Calendar },
              { id: "Contact", icon: Mail }
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === id 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="ml-3">{id}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white border-b border-gray-300">
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className="bg-white hover:bg-gray-100 p-2 rounded-md"
              >
                <Menu size={22} className="text-gray-600" />
              </button>
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-800 whitespace-nowrap">Admin Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 mr-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.username || 'Admin'}</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

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
                        src={hall.images[0] || "/placeholder.svg"}
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
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveBookingTab("ManagerApproved")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeBookingTab === "ManagerApproved"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Pending Bookings
                </button>
                <button
                  onClick={() => setActiveBookingTab("AdminApproved")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeBookingTab === "AdminApproved"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Confirmed Bookings
                </button>
                <button
                  onClick={() => setActiveBookingTab("AdminRejected")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeBookingTab === "AdminRejected"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Rejected Bookings
                </button>
              </div>
              {activeBookingTab === "ManagerApproved" && renderBookings(managerApprovedBookings)}
              {activeBookingTab === "AdminApproved" && renderBookings(adminApprovedBookings)}
              {activeBookingTab === "AdminRejected" && renderBookings(adminRejectedBookings)}
            </div>
          )}

          {activeTab === "Profile" && (
            <ProfileSection 
              user={user}
              loading={loading}
              error={error}
            />
          )}

          {activeTab === "Contact" && <ContactForm />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

