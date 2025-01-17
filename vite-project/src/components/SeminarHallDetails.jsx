import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "./Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const SeminarHallDetails = () => {
  const { id } = useParams(); // This refers to _id of the seminar hall
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHallDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/seminar-halls/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch seminar hall details");
        }
        const data = await response.json();
        setHall(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHallDetails();
  }, [id]);

  // Render the content
  if (loading) return <p className="text-center">Loading seminar hall details...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">{hall.name || "Seminar Hall"}</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Carousel images={hall.images || []} />  {/* Pass images to Carousel */}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-8 mx-auto">
          <p><strong>ID:</strong> {hall.displayId || "N/A"}</p>
          <p><strong>Seating Capacity:</strong> {hall.capacity || "Unknown"}</p>
          <p><strong>Description:</strong> {hall.details || "No description provided."}</p>

          <h3 className="mt-4">Equipment</h3>
          {hall.equipment && hall.equipment.length > 0 ? (
            <ul className="list-group">
              {hall.equipment.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.name || "Unknown"}</strong> 
                    ({item.type || "N/A"}) - {item.condition || "Unknown"} 
                    ({item.available ? "Available" : "Not Available"}) 
                    - {item.quantity || 0} units
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No equipment available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeminarHallDetails;
