import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import { 
  ChevronRight, 
  Users, 
  Info, 
  Cpu, 
  ArrowLeft, 
  Map,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

const SeminarHallDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHallDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/seminar-halls/${id}`);
        if (!response.ok) throw new Error("Failed to fetch seminar hall details");
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className=" z-10 flex items-center px-4 py-4 bg-white text-gray-700 g shadow-sm hover:bg-gray-50 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-3xl font-bold text-white mb-2">{hall.name}</h1>
            <p className="text-blue-100 flex items-center">
              <Map className="w-4 h-4 mr-2" />
              ID: {hall.displayId}
            </p>
          </div>
        </div>

        {/* Image Carousel Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gallery</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <Carousel images={hall.images || []} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hall Information Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Hall Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-600">Seating Capacity</span>
                  </div>
                  <span className="font-semibold text-gray-800">{hall.capacity || "N/A"}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-600">Description</span>
                  </div>
                  <p className="text-gray-800 mt-2">{hall.details || "No description provided."}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-blue-600" />
                Equipment
              </h2>
              {hall.equipment && hall.equipment.length > 0 ? (
                <div className="space-y-4">
                  {hall.equipment.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <span className={`flex items-center px-3 py-1 rounded-full text-sm ${
                          item.available 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {item.available ? (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1" />
                          )}
                          {item.available ? "Available" : "Not Available"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-gray-600">
                          <p>Type: {item.type || "N/A"}</p>
                          <p className="mt-1">Condition: {item.condition || "Unknown"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-800 font-medium">
                            {item.quantity} units
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Cpu className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No equipment available for this hall.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeminarHallDetails;