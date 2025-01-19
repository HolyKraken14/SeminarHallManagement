import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Home, User, Calendar, LogOut } from 'lucide-react';

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
              <p className="text-gray-600">{user?.role || 'Manager'}</p>
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
                <p className="text-gray-800">{user?.role || 'Manager'}</p>
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
      pending: 'bg-yellow-200 text-yellow-800',
      approved_by_manager: 'bg-green-200 text-green-800',
      rejected_by_manager: 'bg-red-200 text-red-800'
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
                <h3 className="text-lg font-medium text-gray-800">{booking.seminarHallId.name}</h3>
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
                to={`/booking-details/${booking._id}/manager`}
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
          state.isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
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
              { id: "Bookings", icon: Calendar }
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => updateState({ activeTab: id })}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  state.activeTab === id 
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

      <div className={`transition-all duration-300 ${state.isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white border-b border-gray-300">
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => updateState({ isSidebarVisible: !state.isSidebarVisible })}
                className="bg-white hover:bg-gray-100 p-2 rounded-md"
              >
                <Menu size={22} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Manager Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {state.user && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{state.user.username}</span>
                </div>
              )}
              <div className="h-6 w-px bg-gray-200" />
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
          {state.activeTab === "Dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Seminar Halls</h2>
              </div>
              
              {state.loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : state.error ? (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {state.error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {state.seminarHalls.map((hall) => (
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
              )}
            </div>
          )}

          {state.activeTab === "Bookings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Bookings</h2>
              <div className="flex space-x-4 mb-6">
                {["Pending", "Approved", "Rejected"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => updateState({ activeBookingTab: tab })}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      state.activeBookingTab === tab
                        ? "bg-blue-600 text-white"
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

