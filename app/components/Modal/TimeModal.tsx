import React, { useState } from "react";

interface TimeModalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    startTime: string;
    times: string[];
    status: string;
  }) => void;
  editingTime?: {
    name: string;
    startTime: string;
    times: string[];
    status: string;
  };
}

function TimeModal({ onClose, onSave, editingTime }: TimeModalProps) {
  const [newTime, setNewTime] = useState({
    name: editingTime?.name || "",
    startTime: editingTime?.startTime || "",
    times: editingTime?.times || [],
    status: editingTime?.status || "Active",
  });

  const isEditing = !!editingTime;

  const handleSaveTime = () => {
    if (!newTime.name.trim()) {
      alert("Please enter a time name");
      return;
    }

    if (!newTime.startTime) {
      alert("Please select a start time");
      return;
    }

    if (newTime.times.length === 0) {
      alert("Please add at least one time slot");
      return;
    }

    onSave(newTime);
  };

  const formatTimeDisplay = (time: string) => {
    try {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  const addTimeSlot = () => {
    if (!newTime.startTime) return;

    // Check if this time already exists
    if (newTime.times.includes(newTime.startTime)) {
      return;
    }

    setNewTime({
      ...newTime,
      times: [...newTime.times, newTime.startTime].sort(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
          <h2 className="text-2xl font-semibold">
            {isEditing ? "Edit Time" : "Add New Time"}
          </h2>
          <p className="opacity-90 mt-1">
            {isEditing
              ? "Update the time details below"
              : "Fill in the time details below"}
          </p>
        </div>

        <div className="p-6">
          {/* Time Name */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Time Name
            </label>
            <input
              type="text"
              placeholder="Enter time name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              value={newTime.name}
              onChange={(e) => setNewTime({ ...newTime, name: e.target.value })}
            />
          </div>

          {/* Start Time Selector */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Start Time
            </label>
            <div className="relative">
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none pr-10 transition"
                value={newTime.startTime}
                onChange={(e) =>
                  setNewTime({ ...newTime, startTime: e.target.value })
                }
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium text-gray-700">Time Slots</label>
              <button
                onClick={addTimeSlot}
                className="flex items-center text-sm px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Current Time
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-16">
              {newTime.times.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {newTime.times.map((time, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-800 rounded-md flex items-center shadow-sm"
                    >
                      <span>{formatTimeDisplay(time)}</span>
                      <button
                        onClick={() => {
                          const newTimes = [...newTime.times];
                          newTimes.splice(index, 1);
                          setNewTime({ ...newTime, times: newTimes });
                        }}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No time slots added yet. Add your first time slot.
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Status Selection */}
          <div className="mb-6">
            <label className="block mb-3 font-medium text-gray-700">
              Status
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Active Option */}
              <div
                className={`relative rounded-lg overflow-hidden ${
                  newTime.status === "Active"
                    ? "ring-2 ring-green-500"
                    : "border border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  id="status-active"
                  name="status"
                  value="Active"
                  checked={newTime.status === "Active"}
                  onChange={() => setNewTime({ ...newTime, status: "Active" })}
                  className="sr-only" // Hide the actual radio button
                />
                <label
                  htmlFor="status-active"
                  className={`block cursor-pointer p-4 ${
                    newTime.status === "Active"
                      ? "bg-green-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        newTime.status === "Active"
                          ? "bg-green-500"
                          : "border-2 border-gray-300"
                      }`}
                    >
                      {newTime.status === "Active" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <span className="font-medium">Active</span>
                      <p className="text-sm text-gray-500 mt-1">
                        Time is visible and can be selected
                      </p>
                    </div>
                  </div>
                  {newTime.status === "Active" && (
                    <div className="absolute top-0 right-0 mt-1 mr-1">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Inactive Option */}
              <div
                className={`relative rounded-lg overflow-hidden ${
                  newTime.status === "Inactive"
                    ? "ring-2 ring-red-500"
                    : "border border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  id="status-inactive"
                  name="status"
                  value="Inactive"
                  checked={newTime.status === "Inactive"}
                  onChange={() =>
                    setNewTime({ ...newTime, status: "Inactive" })
                  }
                  className="sr-only" // Hide the actual radio button
                />
                <label
                  htmlFor="status-inactive"
                  className={`block cursor-pointer p-4 ${
                    newTime.status === "Inactive"
                      ? "bg-red-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        newTime.status === "Inactive"
                          ? "bg-red-500"
                          : "border-2 border-gray-300"
                      }`}
                    >
                      {newTime.status === "Inactive" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <span className="font-medium">Inactive</span>
                      <p className="text-sm text-gray-500 mt-1">
                        Time is hidden and cannot be selected
                      </p>
                    </div>
                  </div>
                  {newTime.status === "Inactive" && (
                    <div className="absolute top-0 right-0 mt-1 mr-1">
                      <div className="bg-red-500 text-white rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Button Bar */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTime}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 shadow-md transition"
          >
            {isEditing ? "Update Time" : "Add Time"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeModal;