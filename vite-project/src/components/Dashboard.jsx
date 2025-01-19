import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Home, User, Calendar, Mail, LogOut } from "lucide-react";
import BookingTab from './BookingTab';

const Dashboard = () => {
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
                <h3 className="text-xl font-semibold text-gray-800">{user.username || 'N/A'}</h3>
                <p className="text-gray-600">{user.role || 'User'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                  <p className="text-gray-800">{user.email || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                  <p className="text-gray-800">{user.username || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Role</h4>
                  <p className="text-gray-800">{user.role || 'User'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Joined On</h4>
                  <p className="text-gray-800">
                    {user.createdAt 
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
  const [seminarHalls, setSeminarHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState({ username: "", email: "" });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const navigate = useNavigate();

  // Existing fetch functions remain the same
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
        const response = await fetch("http://localhost:5000/api/bookings/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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


  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        console.log("Attempting to fetch user with ID:", userId);
        
        const response = await fetch(`http://localhost:5000/api/users/user/${userId}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch user information');
        
        const data = await response.json();
        console.log("Received user data:", data);
        
        // The response has userDetails property, so use that directly
        setUser(data.userDetails);
        
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserInfo();  // Remove the activeTab condition since we want to fetch user data on component mount
  }, []); // Remove activeTab from dependency array


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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
                <h1 className="text-xl font-semibold text-gray-800 whitespace-nowrap">User Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 mr-2">
                <div className="w-8 h-8  rounded-full flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700"> {user.username || 'User'}</span>
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
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {seminarHalls.map((hall) => (
                  <div 
                    key={hall._id} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-250 overflow-hidden"
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
                      <div className="space-y-2">
                        <Link
                          to={`/seminar-hall/${hall._id}`}
                          className="block w-full text-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => setSelectedHall(hall)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-gray-800">My Bookings</h2>
    {bookings.length === 0 ? (
      <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-800">No bookings found</h3>
        <p className="mt-2 text-gray-500">Start by booking a seminar hall from the dashboard.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className={`border rounded-xl p-4 hover:shadow-sm transition-all duration-200
              ${
                booking.status === 'approved_by_admin'
                  ? 'border-green-200 bg-green-300'
                  : booking.status === 'approved_by_manager' || booking.status === 'pending'
                  ? 'border-yellow-200 bg-yellow-300'
                  : 'border-red-200 bg-red-200'
              }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{booking.seminarHallId.name}</h3>
                <div className="mt-1 flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        booking.status === 'approved_by_admin'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'approved_by_manager' || booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {/* Move the button to the right */}
              <Link
                to={`/booking-details/${booking._id}/user`}
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


{activeTab === "Profile" && (
          <ProfileSection 
            user={user}
            loading={loading}
            error={error}
            bookings={bookings}
            
          />
        )}
        </main>
      </div>

      {/* Booking Modal */}
      {selectedHall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-3xl w-11/12 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Book Seminar Hall</h3>
                <button 
                  onClick={() => setSelectedHall(null)}
                  className="p-2 hover:bg-blue-450 rounded-lg transition-colors whitespace-nowrap w-auto"
                >
                Close
                </button>
              </div>
            </div>
            <div className="p-6">
              <BookingTab
                seminarHall={selectedHall}
                onClose={() => setSelectedHall(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;