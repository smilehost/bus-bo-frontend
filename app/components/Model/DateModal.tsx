import React, { useEffect, useState } from "react";

interface DateModalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    startDate: string;
    endDate: string;
    days: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
    };
    status: string;
  }) => void;
  editingDate?: {
    name: string;
    startDate?: string;
    endDate?: string;
    days: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
    };
  };
}

function DateModal({ onClose, onSave, editingDate }: DateModalProps) {
  const [newDate, setNewDate] = useState({
    name: "",
    startDate: "",
    endDate: "",
    days: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });
  const [selectedOption, setSelectedOption] = useState("Select");
  const isEditing = !!editingDate;

  // โหลดข้อมูลถ้ามีการแก้ไข
  useEffect(() => {
    if (editingDate) {
      setNewDate({
        name: editingDate.name,
        startDate: editingDate.startDate || "",
        endDate: editingDate.endDate || "",
        days: { ...editingDate.days },
      });

      // ตรวจสอบว่าเป็น "All Days" หรือ "Select"
      const isAllDays = Object.values(editingDate.days).every(
        (day) => day === true
      );
      setSelectedOption(isAllDays ? "All Days" : "Select");
    }
  }, [editingDate]);

  const handleSaveDate = () => {
    if (
      selectedOption === "Select" &&
      !Object.values(newDate.days).some((day) => day)
    ) {
      alert("Please select at least one day");
      return;
    }

    const finalDays =
      selectedOption === "All Days"
        ? {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          }
        : newDate.days;

    const today = new Date();
    const endDate = new Date(newDate.endDate);
    const status = endDate < today ? "Inactive" : "Active";

    onSave({
      name: newDate.name,
      startDate: newDate.startDate,
      endDate: newDate.endDate,
      days: finalDays,
      status: status,
    });
  };

  const handleDaySelect = (day: string) => {
    if (selectedOption === "All Days") return;

    setNewDate({
      ...newDate,
      days: {
        ...newDate.days,
        [day.toLowerCase() as keyof typeof newDate.days]:
          !newDate.days[day.toLowerCase() as keyof typeof newDate.days],
      },
    });
  };

  const handleSelectOption = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
    if (option === "All Days") {
      setNewDate({
        ...newDate,
        days: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl shadow-xl">
        <h2 className="text-xl font-semibold mb-2 text-center">
          {isEditing ? "Edit Date" : "Add New Date"}
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Fill in the dates details below
        </p>

        <div className="mb-8">
          <div className="flex border rounded-md overflow-hidden mb-6">
            <button
              className={`flex-1 py-3 text-center font-medium ${
                selectedOption === "Select"
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => handleSelectOption("Select")}
            >
              Select
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${
                selectedOption === "All Days"
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => handleSelectOption("All Days")}
            >
              All Days
            </button>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Date Name
            </label>
            <input
              type="text"
              placeholder="Enter time name"
              className="w-full p-3 border rounded-md"
              value={newDate.name}
              onChange={(e) => setNewDate({ ...newDate, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Start date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3 border rounded-md pr-10"
                  value={newDate.startDate}
                  onChange={(e) =>
                    setNewDate({ ...newDate, startDate: e.target.value })
                  }
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                End date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3 border rounded-md pr-10"
                  value={newDate.endDate}
                  onChange={(e) =>
                    setNewDate({ ...newDate, endDate: e.target.value })
                  }
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-3 font-medium text-gray-700">
              Select Days
            </label>
            <div className="grid grid-cols-7 gap-2">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <button
                  key={day}
                  onClick={() => handleDaySelect(day)}
                  disabled={selectedOption === "All Days"}
                  className={`
                    py-2 px-1 rounded-md text-center text-sm font-medium transition-all duration-200
                    ${
                      newDate.days[
                        day.toLowerCase() as keyof typeof newDate.days
                      ]
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                        : "bg-white border hover:border-yellow-400 hover:bg-yellow-50"
                    }
                    ${
                      selectedOption === "All Days"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDate}
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-md font-medium hover:from-yellow-600 hover:to-orange-600 shadow-md"
          >
            {isEditing ? "Update Date" : "Add Date"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateModal;
