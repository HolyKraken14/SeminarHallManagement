import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Home, User, Calendar, LogOut, Mail } from 'lucide-react';

const ProfileSection = ({ user, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
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
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <User size={36} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{user?.username || 'N/A'}</h3>
              <p className="text-indigo-600 font-medium">{user?.role || 'Manager'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Email Address</h4>
                <p className="text-gray-800 font-medium">{user?.email || 'N/A'}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Username</h4>
                <p className="text-gray-800 font-medium">{user?.username || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Role</h4>
                <p className="text-gray-800 font-medium">{user?.role || 'Manager'}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:bg-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Joined On</h4>
                <p className="text-gray-800 font-medium">
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

const Dashboard = () => {
  const [state, setState] = useState({
    seminarHalls: [],
    pendingBookings: [],
    approvedBookings: [],
    rejectedBookings: [],
    loading: true,
    error: null,
    activeTab: "Dashboard",
    activeBookingTab: "Pending",
    isSidebarVisible: false,
    user: null
  });

  const navigate = useNavigate();

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const fetchData = async (url, options = {}) => {
    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      ...options
    };

    const response = await fetch(url, defaultOptions);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    return response.json();
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        updateState({ loading: true });
        const [hallsData, bookingsData, userData] = await Promise.all([
          fetchData("http://localhost:5000/api/seminar-halls"),
          fetchData("http://localhost:5000/api/bookings/all"),
          fetchData(`http://localhost:5000/api/users/user/${localStorage.getItem('userId')}`)
        ]);

        const bookings = bookingsData.bookings;
        updateState({
          seminarHalls: hallsData,
          pendingBookings: bookings.filter(b => b.status === "pending"),
          approvedBookings: bookings.filter(b => b.status === "approved_by_manager"),
          rejectedBookings: bookings.filter(b => b.status === "rejected_by_manager"),
          user: userData.userDetails,
          loading: false
        });
      } catch (error) {
        updateState({ error: error.message, loading: false });
      }
    };

    fetchAllData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      approved_by_manager: 'bg-green-50 text-green-800 border-green-200',
      rejected_by_manager: 'bg-red-50 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderBookings = (bookings) => {
    if (bookings.length === 0) {
      return (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-lg">
          <Calendar className="mx-auto h-16 w-16 text-indigo-400" />
          <h3 className="mt-6 text-xl font-bold text-gray-800">No bookings found</h3>
          <p className="mt-3 text-gray-500">There are currently no booking requests in this category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${getStatusColor(booking.status)}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{booking.seminarHallId.name}</h3>
                <div className="mt-3 flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(booking.status)}`}
                  >
                    {booking.status.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Link
                to={`/booking-details/${booking._id}/manager`}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-indigo-600 to-indigo-800 shadow-xl 
          transform transition-transform duration-300 ease-in-out z-20 ${
          state.isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-center">
          <div className="p-6 border-b border-indigo-500/30">
            <div className="flex items-center space-x-4">
              <img src="/RVCE logo.jpg" alt="RVCE logo" className="w-14 h-14 rounded-full border-4 shadow-lg" />
              <span className="text-xl font-bold text-white">RVCE</span>
            </div>
          </div>
          
          <nav className="flex-1 p-6 space-y-4">
            {[
              { id: "Dashboard", icon: Home },
              { id: "Profile", icon: User },
              { id: "Bookings", icon: Calendar }
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => updateState({ activeTab: id })}
                className={`flex items-center w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                  state.activeTab === id 
                    ? 'bg-white text-indigo-600 shadow-lg transform scale-105 hover:text-white/80' 
                    : 'text-white/80 hover:bg-white/10'
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
      <div className={`transition-all duration-300 ${state.isSidebarVisible ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-md">
          <div className="h-20 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => updateState({ isSidebarVisible: !state.isSidebarVisible })}
                className="bg-white hover:bg-white"
              >
                <Menu size={23} className="text-indigo-800" />
              </button>
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-indigo-700 whitespace-nowrap">Welcome, Manager</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{state.user?.username}</span>
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
          {state.activeTab === "Dashboard" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Seminar Halls</h2>
              </div>
              
              {state.loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              ) : state.error ? (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {state.error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-12">
                  {state.seminarHalls.map((hall) => (
                    <div 
                      key={hall._id} 
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
                        border border-gray-100 overflow-hidden transform hover:-translate-y-1"
                    >
                      <div className="relative">
                        <img
                          src={hall.images[0] || "/placeholder.svg"}
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
                            bg-gradient-to-r from-indigo-600 to-indigo-700 text-white 
                            hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {state.activeTab === "Bookings" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800">Bookings</h2>
              <div className="flex space-x-4 mb-6">
                {["Pending", "Approved", "Rejected"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => updateState({ activeBookingTab: tab })}
                    className={`px-6 py-3 rounded-xl transition-colors ${
                      state.activeBookingTab === tab
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {tab} Bookings
                  </button>
                ))}
              </div>
              {state.activeBookingTab === "Pending" && renderBookings(state.pendingBookings)}
              {state.activeBookingTab === "Approved" && renderBookings(state.approvedBookings)}
              {state.activeBookingTab === "Rejected" && renderBookings(state.rejectedBookings)}
            </div>
          )}

          {state.activeTab === "Profile" && (
            <ProfileSection 
              user={state.user}
              loading={state.loading}
              error={state.error}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

