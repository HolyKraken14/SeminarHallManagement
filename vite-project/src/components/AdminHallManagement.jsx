import React, { useState } from 'react';

const AdminHallManagement = ({ hall, onUpdate }) => {
  const [isAvailable, setIsAvailable] = useState(hall.isAvailable);
  const [reason, setReason] = useState(hall.unavailabilityReason || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/seminar-halls/${hall._id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAvailable,
          unavailabilityReason: !isAvailable ? reason : ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update hall availability');
      }

      const data = await response.json();
      setSuccess('Seminar hall availability updated successfully');
      onUpdate(data.hall);
    } catch (err) {
      setError(err.message || 'Error updating availability');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Manage Hall Availability</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={isAvailable}
              onChange={() => setIsAvailable(true)}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Available</span>
          </label>
          
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={!isAvailable}
              onChange={() => setIsAvailable(false)}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Not Available</span>
          </label>
        </div>

        {!isAvailable && (
          <div>
            <label className="block mb-2">Reason for unavailability:</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required={!isAvailable}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-600 text-sm">{success}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
            transition-colors disabled:bg-indigo-300"
        >
          {isSubmitting ? 'Updating...' : 'Update Availability'}
        </button>
      </form>
    </div>
  );
};

export default AdminHallManagement;