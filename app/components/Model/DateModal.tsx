"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Image from "next/image";

import TitleModel from "../Title/TitleModel";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";

interface DateModalProps {
  open: boolean;
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

function DateModal({ open, onClose, onSave, editingDate }: DateModalProps) {
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
    if (isEditing && editingDate) {
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
    } else {
      // รีเซ็ตค่าเมื่อเปิด modal ใหม่
      setNewDate({
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
      setSelectedOption("Select");
    }
  }, [editingDate, isEditing, open]);

  const validateForm = () => {
    if (!newDate.name) {
      return "Please enter date name";
    }

    if (
      selectedOption === "Select" &&
      !Object.values(newDate.days).some((day) => day)
    ) {
      return "Please select at least one day";
    }

    return null;
  };

  const handleSaveDate = () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      // ใช้ setTimeout เพื่อให้แน่ใจว่า Modal ปิดก่อน
      setTimeout(() => {
        alert(errorMessage);
      }, 100);
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

    // ส่งข้อมูลและปิด Modal
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
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        },
      });
    } else if (option === "Select") {
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
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="w-[448px] py-2 relative">
          <TitleModel
            title={isEditing ? "Edit Date" : "Add New Date"}
            description={
              isEditing
                ? "Update the date details below"
                : "Fill in the date details below"
            }
          />

          <div className="mt-7 flex flex-col gap-4">
            <div className="flex border rounded-md overflow-hidden mb-2">
              <button
                className={`flex-1 py-2 text-center font-medium ${
                  selectedOption === "Select"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-white"
                }`}
                onClick={() => handleSelectOption("Select")}
              >
                Select
              </button>
              <button
                className={`flex-1 py-2 text-center font-medium ${
                  selectedOption === "All Days"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-white"
                }`}
                onClick={() => handleSelectOption("All Days")}
              >
                All Days
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Date Name
              </label>
              <input
                type="text"
                placeholder="Enter date name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                value={newDate.name}
                onChange={(e) =>
                  setNewDate({ ...newDate, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Start date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                    value={newDate.startDate}
                    onChange={(e) =>
                      setNewDate({ ...newDate, startDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  End date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                    value={newDate.endDate}
                    onChange={(e) =>
                      setNewDate({ ...newDate, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
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
                      py-2 px-1 rounded-md text-center text-xs font-medium transition-all duration-200
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

          <div className="flex gap-3 justify-end mt-7">
            <ButtonDefault size="" text="Cancel" onClick={onClose} />
            <ButtonBG
              size=""
              text={isEditing ? "Update Date" : "Add Date"}
              onClick={handleSaveDate}
            />
          </div>

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

export default DateModal;
