import React, { useState } from "react";

interface NewTime {
  name: string;
  startTime: string;
  times: string[];
  schedule?: string | string[]; // Added the 'schedule' property
}

interface TimeModalProps {
  onClose: () => void;
  onSave: (data: NewTime) => void;
  editingTime?: Partial<NewTime>;
}

function TimeModal({ onClose, onSave, editingTime }: TimeModalProps) {
  const [newTime, setNewTime] = useState<NewTime>({
    name: editingTime?.name || "",
    startTime: "",
    times: Array.isArray(editingTime?.schedule)
      ? editingTime?.schedule
      : typeof editingTime?.schedule === "string"
      ? (editingTime?.schedule as string).split(",").map((t) => t.trim())
      : [],
  });

  const isEditing = !!editingTime;

  const handleSaveTime = () => {
    if (!newTime.name.trim()) {
      alert("Please enter a time name");
      return;
    }

    if (!newTime.startTime.trim()) {
      alert("Please select a start time");
      return;
    }

    if (newTime.times.length === 0) {
      alert("Please add at least one time slot");
      return;
    }

    onSave(newTime);
  };

  const isValidTimeFormat = (time: string) => /^\d{2}:\d{2}$/.test(time);

  const addTimeSlot = () => {
    const trimmedTime = newTime.startTime.trim();
    if (!trimmedTime || !isValidTimeFormat(trimmedTime)) {
      alert("Invalid time format. Please use HH:mm.");
      return;
    }
    if (newTime.times.includes(trimmedTime)) return;

    setNewTime({
      ...newTime,
      times: [...(newTime.times ?? []), trimmedTime].sort(),
    });
  };

  const formatTimeDisplay = (time: string) => {
    const parts = time.split(":");
    return parts.length === 2 ? `${parts[0]}:${parts[1]}` : time;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all animate-fadeIn">
        <div className="bg-gradient-to-r from-orange-500 to-amber-400 p-6 text-white relative">
          <div className="absolute top-3 right-3">
            <button
              onClick={onClose}
              className="cursor-pointer text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Time" : "Add New Time"}
          </h2>
          <p className="opacity-90 mt-1 font-light">
            {isEditing
              ? "Update the time details below"
              : "Fill in the time details below"}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Time Name */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Time Name
            </label>
            <input
              type="text"
              placeholder="Enter time name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow shadow-sm hover:shadow"
              value={newTime.name}
              onChange={(e) => setNewTime({ ...newTime, name: e.target.value })}
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Start Time
            </label>
            <input
              type="time"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow shadow-sm hover:shadow text-gray-700"
              value={newTime.startTime}
              onChange={(e) =>
                setNewTime({ ...newTime, startTime: e.target.value })
              }
            />
          </div>

          {/* Time Slots */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="font-medium text-gray-700 text-sm">
                Time Slots
              </label>
              <button
                onClick={addTimeSlot}
                className="cursor-pointer flex items-center text-sm px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors font-medium shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Current Time
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-16 shadow-inner">
              {Array.isArray(newTime.times) && newTime.times.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {newTime.times.map((time, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg flex items-center shadow-sm transition-all hover:shadow"
                    >
                      <span className="font-medium">
                        {formatTimeDisplay(time)}
                      </span>
                      <button
                        onClick={() => {
                          const newTimes = [...newTime.times];
                          newTimes.splice(index, 1);
                          setNewTime({ ...newTime, times: newTimes });
                        }}
                        className="cursor-pointer ml-2 text-orange-400 hover:text-orange-700 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-300 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  No time slots added yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 border-t">
          <button
            onClick={onClose}
            className="cursor-pointer px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTime}
            className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow"
          >
            {isEditing ? "Update Time" : "Add Time"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeModal;