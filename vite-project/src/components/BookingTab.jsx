import React, { useState } from 'react';

const BookingTab = ({ seminarHall, onClose }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [eventCoordinators, setEventCoordinators] = useState([{ name: '', contact: '',email:'' }]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCoordinator = () => {
    setEventCoordinators([...eventCoordinators, { name: '', contact: '' ,email:''}]);
  };

  const handleCoordinatorChange = (index, field, value) => {
    const updatedCoordinators = eventCoordinators.map((coordinator, i) => {
      if (i === index) {
        return { ...coordinator, [field]: value };
      }
      return coordinator;
    });
    setEventCoordinators(updatedCoordinators);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get user ID from localStorage (assuming it's stored during login)
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      console.log(userId);
      console.log(token);
      console.log('seminarHall._id:', seminarHall._id);


      if (!userId && !token) {
        setMessage('Please login to book a seminar hall');
        return;
      }
      

      const response = await fetch('http://localhost:5000/api/bookings/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          seminarHallId: seminarHall._id,
          bookingDate,
          startTime,
          endTime,
          eventName,
          eventDetails,
          eventCoordinators,
        }),
      });

      

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error making booking');
      }

      setMessage('Booking request submitted successfully! Awaiting approval.');
      setBookingDate('');
    setStartTime('');
    setEndTime('');
    setEventName('');
    setEventDetails('');
    setEventCoordinators([{ name: '', contact: '',email:'' }]);

    // Close modal after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
    } catch (error) {
      setMessage(error.message || 'Error making booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Book {seminarHall.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Date:</label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">End Time:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Event Name:</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Event Details:</label>
            <textarea
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              required
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div>
            <label className="block mb-2">Event Coordinators:</label>
            {eventCoordinators.map((coordinator, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={coordinator.name}
                  onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value)}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="tel"
                  placeholder="Contact"
                  value={coordinator.contact}
                  onChange={(e) => handleCoordinatorChange(index, 'contact', e.target.value)}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={coordinator.email}
                  onChange={(e) => handleCoordinatorChange(index, 'email', e.target.value)}
                  required
                  className="p-2 border rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCoordinator}
              className="text-white-600 hover:text-white-600"
            >
              + Add Another Coordinator
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-3 rounded text-white ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-550 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingTab;