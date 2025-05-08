"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Image from "next/image";

//component
import InputLabel from "../Form/InputLabel";
import TitleModel from "../Title/TitleModel";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";

type MemberModalProps = {
  open: boolean;
  onClose: () => void;
  onHandle: (member: {
    id?: number;
    name: string;
    phone: string;
    company: string;
    role: string;
  }) => void;
  editingMember?: {
    id: number;
    name: string;
    phone: string;
    company: string;
    role: string;
  };
};

function MemberModal({
  open,
  onClose,
  onHandle,
  editingMember,
}: MemberModalProps) {
  const [newName, setNewName] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newCompany, setNewCompany] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("Admin");

  const isEditing = !!editingMember;

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

  // โหลดข้อมูลสมาชิกเมื่อเป็นการแก้ไข
  useEffect(() => {
    if (editingMember) {
      setNewName(editingMember.name);
      setNewPhone(editingMember.phone);
      setNewCompany(editingMember.company);
      setNewRole(editingMember.role);
    } else {
      // รีเซ็ตค่าถ้าเป็นการเพิ่มสมาชิกใหม่
      setNewName("");
      setNewPhone("");
      setNewCompany("");
      setNewRole("Admin");
    }
  }, [editingMember]);

  const handleSubmit = () => {
    if (!newName || !newPhone) {
      alert("กรุณากรอกข้อมูลชื่อและเบอร์โทรให้ครบถ้วน");
      return;
    }

    onHandle({
      id: editingMember?.id, 
      name: newName || editingMember?.name || "", 
      phone: newPhone || editingMember?.phone || "", 
      company: newCompany || editingMember?.company || "", 
      role: newRole || editingMember?.role || "Admin", 
    });

    // รีเซ็ตค่าหลังจากบันทึก
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
              title={isEditing ? "Edit Member" : "Add New Member"}
              description={
                isEditing
                  ? "Update the member details below"
                  : "Fill in the member details below"
              }
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
            <ButtonBG
              size=""
              text={isEditing ? "Update Member" : "Add Member"}
              onClick={handleSubmit}
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

export default MemberModal;
