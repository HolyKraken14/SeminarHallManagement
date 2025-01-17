import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log('Booking ID:', bookingId);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`);
        setBookingDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to fetch booking details.');
        setLoading(false);
      }
    };
  
    fetchBookingDetails();
  }, [bookingId]); // Only 'bookingId' as a dependency
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="booking-details">
      <h2>Booking Details</h2>
      <div className="booking-info">
        <p><strong>Event Name:</strong> {bookingDetails.eventName}</p>
        <p><strong>Event Details:</strong> {bookingDetails.eventDetails}</p>
        <p><strong>Booking Date:</strong> {new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {bookingDetails.startTime} - {bookingDetails.endTime}</p>
        <p><strong>Status:</strong> {bookingDetails.status}</p>
        <p><strong>Seminar Hall:</strong> {bookingDetails.seminarHallId?.name || 'N/A'}</p>
        <p><strong>Manager:</strong> {bookingDetails.managerId?.name || 'N/A'}</p>
        <p><strong>Admin:</strong> {bookingDetails.adminId?.name || 'N/A'}</p>
      </div>

      <h3>Event Coordinators</h3>
      {bookingDetails.eventCoordinators.length > 0 ? (
        <ul>
          {bookingDetails.eventCoordinators.map((coordinator, index) => (
            <li key={index}>
              <p><strong>Name:</strong> {coordinator.name}</p>
              <p><strong>Email:</strong> {coordinator.email}</p>
              <p><strong>Contact:</strong> {coordinator.contact}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No coordinators specified.</p>
      )}

      <h3>User Details</h3>
      <p><strong>User Name:</strong> {bookingDetails.userId?.name || 'N/A'}</p>
      <p><strong>User Email:</strong> {bookingDetails.userId?.email || 'N/A'}</p>
    </div>
  );
};

export default BookingDetails;
