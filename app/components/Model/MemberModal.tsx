"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Image from "next/image";
import axios from "axios";

import InputLabel from "../Form/InputLabel";
import TitleModel from "../Title/TitleModel";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";

type CompanyOption = {
  value: string;
  label: string;
};

type MemberModalProps = {
  open: boolean;
  onClose: () => void;
  onHandle: (member: {
    id?: string;
    name: string;
    username: string;
    companyId: string;
    role: string;
    password?: string;
    status: number;
  }) => void;
  editingMember?: {
    id: string;
    name: string;
    username: string;
    role: string;
    companyId: string;
  };
};

function MemberModal({
  open,
  onClose,
  onHandle,
  editingMember,
}: MemberModalProps) {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [role, setRole] = useState<string>("2"); // Default to Salesman
  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([
    { value: "", label: "Select a company" },
  ]);

  const isEditing = !!editingMember;

  const roleOptions = [{ value: "2", label: "Salesman" }];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/company/all`
        );
        const raw = res.data.result || [];
        const mapped = raw.map((com: any) => ({
          value: com.com_id.toString(),
          label: com.com_name,
        }));
        setCompanyOptions([
          { value: "", label: "Select a company" },
          ...mapped,
        ]);
      } catch (error) {
        console.error("Failed to load companies:", error);
      }
    };

    if (open) fetchCompanies();
  }, [open]);

  useEffect(() => {
    if (open && !isEditing) {
      const timer = setTimeout(() => {
        setUsername("");
        setPassword("");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, isEditing]);

  useEffect(() => {
    if (isEditing && editingMember) {
      setName(editingMember.name);
      setUsername(editingMember.username);
      setRole(editingMember.role);
      setCompanyId(editingMember.companyId);
      setPassword("");
    } else {
      setName("");
      setUsername("");
      setPassword("");
      setRole("2");
      setCompanyId("");
    }
  }, [editingMember, isEditing, open]);

  const handleSubmit = () => {
    if (!name || (!isEditing && (!username || !password || !companyId))) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const payload = isEditing
      ? {
          id: editingMember?.id,
          name,
          username: editingMember?.username || "", 
          role: editingMember?.role || "2",
          companyId: editingMember?.companyId || "",
          status: 0,
        }
      : {
          name,
          username,
          password,
          companyId,
          role,
          status: 1,
        };

    onHandle(payload);

    setName("");
    setUsername("");
    setPassword("");
    setRole("2");
    setCompanyId("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="w-[448px] py-2 relative">
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
              value={name}
              setValue={setName}
            />

            <InputLabel
              label="Username"
              placeholder="Enter username"
              type="text"
              value={username}
              setValue={setUsername}
              disabled={isEditing}
            />

            {!isEditing && (
              <InputLabel
                label="Password"
                placeholder="Enter password"
                type="password"
                value={password}
                setValue={setPassword}
                autoComplete="new-password"
              />
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Company
              </label>
              <select
                disabled={isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                disabled={isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
