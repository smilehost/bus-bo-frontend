"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Image from "next/image";
import { Clock } from "lucide-react";

import TitleModel from "../Title/TitleModel";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NewTime {
  name: string;
  startTime: string;
  times: string[];
}

interface TimeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewTime) => void;
  editingTime?: Partial<NewTime>;
}

// Custom TimePicker
interface CustomTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  format?: string;
  disableClock?: boolean;
  clearIcon?: React.ReactNode;
  clockIcon?: React.ReactNode;
  className?: string;
}

const CustomTimePicker = ({
  value,
  onChange,
  format,
  disableClock,
  clearIcon,
  clockIcon,
  className,
}: CustomTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const [currentHour, currentMinute] = value ? value.split(":") : ["00", "00"];

  const handleSelectTime = (hour: string, minute: string) => {
    onChange(`${hour}:${minute}`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        className={`flex items-center justify-between cursor-pointer ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          value={value || ""}
          readOnly
          placeholder="HH:MM"
          className="w-full bg-transparent focus:outline-none"
        />
        <Clock size={18} className="text-gray-500" />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex h-64">
            <div className="w-1/2 overflow-y-auto border-r border-gray-200">
              <div className="py-1 text-center text-xs font-medium text-gray-500">
                Hour
              </div>
              {hours.map((hour) => (
                <div
                  key={`hour-${hour}`}
                  className={`py-2 px-3 text-center cursor-pointer hover:bg-orange-100 ${
                    hour === currentHour ? "bg-orange-200 font-medium" : ""
                  }`}
                  onClick={() => handleSelectTime(hour, currentMinute)}
                >
                  {hour}
                </div>
              ))}
            </div>
            <div className="w-1/2 overflow-y-auto">
              <div className="py-1 text-center text-xs font-medium text-gray-500">
                Minutes
              </div>
              {minutes.map((minute) => (
                <div
                  key={`minute-${minute}`}
                  className={`py-2 px-3 text-center cursor-pointer hover:bg-orange-100 ${
                    minute === currentMinute ? "bg-orange-200 font-medium" : ""
                  }`}
                  onClick={() => handleSelectTime(currentHour, minute)}
                >
                  {minute}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function TimeModal({ open, onClose, onSave, editingTime }: TimeModalProps) {
  const [newTime, setNewTime] = useState<NewTime>({
    name: editingTime?.name || "",
    startTime: editingTime?.startTime || "",
    times: Array.isArray(editingTime?.times)
      ? editingTime.times
      : typeof editingTime?.times === "string"
      ? (editingTime.times as string).split(",").map((t) => t.trim())
      : [],
  });

  const [showHint, setShowHint] = useState(false);
  const isEditing = !!editingTime;

  useEffect(() => {
    if (isEditing && editingTime) {
      setNewTime({
        name: editingTime.name || "",
        startTime: editingTime.startTime || "",
        times: Array.isArray(editingTime.times)
          ? editingTime.times
          : typeof editingTime.times === "string"
          ? (editingTime.times as string).split(",").map((t) => t.trim())
          : [],
      });
    } else {
      setNewTime({
        name: "",
        startTime: "",
        times: [],
      });
    }
  }, [editingTime, isEditing, open]);

  const handleSaveTime = () => {
    if (!newTime.name.trim()) {
      setTimeout(() => toast.error("Please enter a time name"), 100);
      return;
    }
    if (newTime.times.length === 0) {
      setTimeout(() => toast.error("Please add at least one time slot"), 100);
      return;
    }
    onSave(newTime);
  };

  const isValidTimeFormat = (time: string) => /^\d{2}:\d{2}$/.test(time);

  const handleTimeChange = (val: string) => {
    setNewTime({ ...newTime, startTime: val || "" });
    // แสดง hint เมื่อเลือกเวลาแล้ว
    if (val && isValidTimeFormat(val)) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  const addTimeSlot = () => {
    const trimmedTime = newTime.startTime.trim();
    if (!trimmedTime || !isValidTimeFormat(trimmedTime)) {
      toast.error("Invalid time format. Please use HH:mm.");
      return;
    }
    if (newTime.times.includes(trimmedTime)) {
      toast.warning("This time slot already exists.");
      return;
    }

    setNewTime({
      ...newTime,
      times: [...newTime.times, trimmedTime].sort(),
      startTime: "", // Clear เวลาหลังจาก add เพื่อให้เพิ่มเวลาใหม่ได้
    });

    setShowHint(false);
    toast.success("Time slot added successfully!");
  };

  const formatTimeDisplay = (time: string) => {
    const parts = time.split(":");
    return parts.length === 2 ? `${parts[0]}:${parts[1]}` : time;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="w-[448px] py-2 relative">
          <TitleModel
            title={isEditing ? "Edit Time" : "Add New Time"}
            description={
              isEditing
                ? "Update the time details below"
                : "Fill in the time details below"
            }
          />
          <div className="flex flex-col gap-4">
            {/* Time Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Time Name
              </label>
              <input
                type="text"
                placeholder="Enter time name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 ${
                  newTime.name
                    ? ""
                    : "border-gray-300"
                }`}
                value={newTime.name}
                onChange={(e) =>
                  setNewTime({ ...newTime, name: e.target.value })
                }
              />
            </div>

            {/* Start Time */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Select Time to Add
              </label>
              <div className="relative">
                <CustomTimePicker
                  onChange={handleTimeChange}
                  value={newTime.startTime}
                  format="HH:mm"
                  disableClock
                  clearIcon={null}
                  clockIcon={null}
                  className={`w-full border rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 ${
                    newTime.startTime
                      ? "border-orange-300 bg-orange-50"
                      : "border-gray-300"
                  }`}
                />
                {newTime.startTime && showHint && (
                  <div className="absolute -bottom-6 left-0 text-xs text-orange-600 animate-pulse flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Click "Add This Time" to add this slot
                  </div>
                )}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-medium text-gray-700 text-sm">
                  Time Slots ({newTime.times.length})
                </label>
                <button
                  onClick={addTimeSlot}
                  disabled={!newTime.startTime.trim()}
                  className={`flex items-center text-sm px-4 py-1.5 rounded-full font-medium shadow-sm transition-all ${
                    !newTime.startTime.trim()
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer hover:shadow-md"
                  }`}
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
                  Add This Time
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-20 shadow-inner">
                {Array.isArray(newTime.times) && newTime.times.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {newTime.times.map((time, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg flex items-center shadow-sm transition-all hover:shadow animate-fadeIn"
                      >
                        <span className="font-medium">
                          {formatTimeDisplay(time)}
                        </span>
                        <button
                          onClick={() => {
                            const newTimes = [...newTime.times];
                            newTimes.splice(index, 1);
                            setNewTime({ ...newTime, times: newTimes });
                            toast.info("Time slot removed");
                          }}
                          className="ml-2 text-orange-400 hover:text-red-600 transition-colors cursor-pointer"
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
                  <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-300 mb-3"
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
                      {newTime.startTime && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <span className="text-sm">
                      {newTime.startTime
                        ? "Ready to add your selected time!"
                        : "No time slots added yet."}
                    </span>
                    {newTime.startTime && (
                      <span className="text-xs text-orange-600 mt-1">
                        Selected: {formatTimeDisplay(newTime.startTime)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 justify-end mt-7">
            <ButtonDefault size="" text="Cancel" onClick={onClose} />
            <ButtonBG
              size=""
              text={isEditing ? "Update Time" : "Add Time"}
              onClick={handleSaveTime}
            />
          </div>

          {/* Close Button */}
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={onClose}
          >
            <Image
              src={"/icons/close.svg"}
              width={24}
              height={24}
              priority
              alt="close-icon"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TimeModal;
