import React, { useEffect, useState } from "react";

interface LocationModalProps {
  onClose: () => void;
  onSave: (data: { name: string; latitude: number; longitude: number }) => void;
  editingLocation?: {
    name: string;
    latitude: number;
    longitude: number;
  } | null;
}

function LocationModal({
  onClose,
  onSave,
  editingLocation,
}: LocationModalProps) {
  const isEditing = !!editingLocation;

  const [location, setLocation] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (editingLocation) {
      setLocation({
        name: editingLocation.name,
        latitude: editingLocation.latitude.toString(),
        longitude: editingLocation.longitude.toString(),
      });
    }
  }, [editingLocation]);

  const handleSave = () => {
    if (
      !location.name ||
      isNaN(parseFloat(location.latitude)) ||
      isNaN(parseFloat(location.longitude))
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }
    onSave({
      name: location.name,
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {isEditing ? "Edit Location" : "Add New Location"}
        </h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Location Name
          </label>
          <input
            type="text"
            placeholder="Enter location name"
            className="w-full p-3 border rounded-md"
            value={location.name}
            onChange={(e) => setLocation({ ...location, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="text"
            placeholder="Enter latitude (e.g. 13.7563)"
            className="w-full p-3 border rounded-md"
            value={location.latitude}
            onChange={(e) =>
              setLocation({ ...location, latitude: e.target.value })
            }
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="text"
            placeholder="Enter longitude (e.g. 100.5018)"
            className="w-full p-3 border rounded-md"
            value={location.longitude}
            onChange={(e) =>
              setLocation({ ...location, longitude: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="cursor-pointer px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-md font-medium hover:from-yellow-600 hover:to-orange-600 shadow-md"
          >
            {isEditing ? "Update Location" : "Add Location"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;