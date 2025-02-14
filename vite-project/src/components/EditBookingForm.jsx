import React, { useState } from "react"

const EditBookingForm = ({ booking, onClose, onUpdate }) => {
  const [bookingDate, setBookingDate] = useState(booking.bookingDate.split('T')[0])
  const [startTime, setStartTime] = useState(booking.startTime)
  const [endTime, setEndTime] = useState(booking.endTime)
  const [eventName, setEventName] = useState(booking.eventName)
  const [eventDetails, setEventDetails] = useState(booking.eventDetails)
  const [eventCoordinators, setEventCoordinators] = useState(booking.eventCoordinators)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactErrors, setContactErrors] = useState(booking.eventCoordinators.map(() => ""))

  const handleAddCoordinator = () => {
    setEventCoordinators([...eventCoordinators, { name: "", contact: "", email: "" }])
    setContactErrors([...contactErrors, ""])
  }

  const handleRemoveCoordinator = (index) => {
    const updatedCoordinators = eventCoordinators.filter((_, i) => i !== index)
    const updatedErrors = contactErrors.filter((_, i) => i !== index)
    setEventCoordinators(updatedCoordinators)
    setContactErrors(updatedErrors)
  }

  const validateContact = (contact) => {
    const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/
    return phoneRegex.test(contact)
  }

  const handleCoordinatorChange = (index, field, value) => {
    const updatedCoordinators = eventCoordinators.map((coordinator, i) => {
      if (i === index) {
        return { ...coordinator, [field]: value }
      }
      return coordinator
    })
    setEventCoordinators(updatedCoordinators)

    if (field === "contact") {
      const newContactErrors = [...contactErrors]
      if (!validateContact(value)) {
        newContactErrors[index] = "Invalid phone number"
      } else {
        newContactErrors[index] = ""
      }
      setContactErrors(newContactErrors)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (contactErrors.some((error) => error !== "")) {
      setMessage("Please correct the contact number errors before submitting.")
      return
    }
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      
      const response = await fetch(`http://localhost:5000/api/bookings/${booking._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingDate,
          startTime,
          endTime,
          eventName,
          eventDetails,
          eventCoordinators,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error updating booking")
      }

      setMessage("Booking updated successfully!")
      onUpdate(data.booking)
      
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      setMessage(error.message || "Error updating booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-4 max-h-[90vh] overflow-y-auto">
        <div className="m-10 flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Booking</h2>
          <button 
            onClick={onClose}
            className="items-center w-20 space-x-2 px-4 py-2 rounded-xl 
              bg-gradient-to-r from-indigo-600 to-indigo-700 text-white-700 
              hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Close
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
              min={new Date().toISOString().split("T")[0]}
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
              <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-700">Coordinator {index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCoordinator(index)}
                      className="items-center w-40 space-x-2 px-4 py-2 rounded-xl 
                      bg-gradient-to-r from-indigo-600 to-indigo-700 text-white-700 
                      hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Name"
                  value={coordinator.name}
                  onChange={(e) => handleCoordinatorChange(index, "name", e.target.value)}
                  required
                  className="p-2 border rounded"
                />
                <div>
                  <input
                    type="tel"
                    placeholder="Contact"
                    value={coordinator.contact}
                    onChange={(e) => handleCoordinatorChange(index, "contact", e.target.value)}
                    required
                    className={`p-2 border rounded w-full ${contactErrors[index] ? "border-red-500" : ""}`}
                  />
                  {contactErrors[index] && <p className="text-red-500 text-xs mt-1">{contactErrors[index]}</p>}
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={coordinator.email}
                  onChange={(e) => handleCoordinatorChange(index, "email", e.target.value)}
                  required
                  className="p-2 border rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCoordinator}
              className="items-center space-x-2 px-4 py-2 rounded-xl 
              bg-gradient-to-r from-indigo-600 to-indigo-700 text-white-700 
              hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              + Add Another Coordinator
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`items-center space-x-2 px-4 py-2 rounded-xl 
            bg-gradient-to-r from-indigo-600 to-indigo-700 text-white-700 
            hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${
              isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-550 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Booking"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-4 rounded ${
              message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default EditBookingForm