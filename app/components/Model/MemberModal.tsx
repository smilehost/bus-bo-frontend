"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Image from "next/image";

//component
import InputLabel from "../Form/InputLabel";
import TitleModel from "../Title/TitleModel";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";
import SelectInput from "../Form/SelectInput"; // ต้องมีหรือสร้าง component นี้

type MemberModelProps = {
  open: boolean;
  onClose: () => void;
  onHandle: (member: {
    name: string;
    phone: string;
    company: string;
    role: string;
  }) => void;
};

function MemberModel({ open, onClose, onHandle }: MemberModelProps) {
  //new member
  const [newName, setNewName] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newCompany, setNewCompany] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("Admin");

  // ข้อมูลตัวเลือกสำหรับ dropdown
  const companyOptions = [
    { value: "", label: "Select a company" },
    { value: "northern", label: "Northern Bus Co." },
    { value: "southern", label: "Southern Express" },
    { value: "eastern", label: "Eastern Transport" },
    { value: "western", label: "Western Metro" },
  ];

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
    { value: "Manager", label: "Manager" },
  ];

  const handleSubmit = () => {
    if (!newName || !newPhone || !newCompany) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    onHandle({
      name: newName,
      phone: newPhone,
      company: newCompany,
      role: newRole,
    });

    // รีเซ็ตค่าหลังจากเพิ่มสมาชิก
    setNewName("");
    setNewPhone("");
    setNewCompany("");
    setNewRole("Admin");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="w-[448px] py-2 relative">
          <div className="">
            <TitleModel
              title="Add New Member"
              description="Fill in the member details below"
            />
            <div className="mt-7 flex flex-col gap-4">
              <InputLabel
                label="Member Name"
                placeholder="Enter member name"
                type="text"
                value={newName}
                setValue={setNewName}
              />
              <InputLabel
                label="Phone Number"
                placeholder="123-456-7890"
                type="text"
                value={newPhone}
                setValue={setNewPhone}
              />

              {/* เพิ่ม Company Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Company
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                >
                  {companyOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.value === ""}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* เพิ่ม Role Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-7">
            <ButtonDefault size="" text="Cancel" onClick={onClose} />
            <ButtonBG size="" text="Add Member" onClick={handleSubmit} />
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

export default MemberModel;
