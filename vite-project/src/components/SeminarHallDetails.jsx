import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "./Carousel";
import { ChevronRight, Users, Info, Cpu } from 'lucide-react';

const SeminarHallDetails = () => {
  const { id } = useParams();
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{hall.name || "Seminar Hall"}</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="bg-blue-600 px-4 py-5 sm:px-6">
              <h2 className="text-xl leading-6 font-medium text-white">Gallery</h2>
            </div>
            <div className="border-t border-gray-200">
              <Carousel images={hall.images || []} />
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="bg-blue-600 px-4 py-5 sm:px-6">
              <h2 className="text-xl leading-6 font-medium text-white">Hall Information</h2>
              <p className="mt-1 max-w-2xl text-sm text-white">Details about the seminar hall.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <ChevronRight className="mr-2 h-5 w-5 text-gray-400" />
                    ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{hall.displayId || "N/A"}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-gray-400" />
                    Seating Capacity
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{hall.capacity || "Unknown"}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Info className="mr-2 h-5 w-5 text-gray-400" />
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{hall.details || "No description provided."}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="bg-blue-600 px-4 py-5 sm:px-6">
              <h2 className="text-xl leading-6 font-medium text-white flex items-center">
                <Cpu className="mr-2 h-5 w-5 text-white" />
                Equipment
              </h2>
            </div>
            <div className="border-t border-gray-200">
              {hall.equipment && hall.equipment.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {hall.equipment.map((item, index) => (
                    <li key={index} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">{item.name || "Unknown"}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.available ? "Available" : "Not Available"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Type: {item.type || "N/A"}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Condition: {item.condition || "Unknown"}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Quantity: {item.quantity || 0} units
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-5 sm:px-6 text-sm text-gray-500">No equipment available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeminarHallDetails;

