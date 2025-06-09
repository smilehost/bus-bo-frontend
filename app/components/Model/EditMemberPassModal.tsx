"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputPassword from "../Form/InputPassword";

import { createSecurePassword } from "@/utils/generatePassword";
import { getTextManageUserPage, useLanguageContext } from "@/app/i18n/translations";

type EditPasswordModelProps = {
  open: boolean;
  onClose: () => void;
  userId: string; // เพิ่ม userId ที่ต้องใช้ตอนส่ง API
  onSave: (userId: string, newPassword: string) => void;
};

function EditPasswordModel({
  open,
  onClose,
  userId,
  onSave,
}: EditPasswordModelProps) {
  const { isTH, isSuperAdmin } = useLanguageContext();

  const text = getTextManageUserPage({ isTH, isSuperAdmin });

  const [password, setPassword] = useState<string>("");


  const genPassword = (length: number) => {
    const newPassword = createSecurePassword(length);
    setPassword(newPassword);
  };


  const handleSave = () => {
    if (!password.trim()) {
      toast.error("Please enter a new password.");
      return;
    }
    onSave(userId, password.trim());
    onClose();
  };

  // รีเซ็ตทุกครั้งเมื่อเปิด modal
  useEffect(() => {
    if (open) {
      setPassword("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>

        <div className="w-[400px] py-4">
          <h3 className="text-lg font-medium text-gray-800">Edit Password</h3>
          <div className="mt-4">
            <InputPassword
              label={text.passWord}
              placeholder={text.enterPass}
              value={password}
              setValue={setPassword}
              onGenerate={() => genPassword(8)}
              generateLabel={text.genPassword}
            />
          </div>
          {/* <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </div> */}
          <div className="flex gap-3 justify-end mt-10">
            <ButtonDefault size="" text="Cancel" onClick={onClose} />
            <ButtonBG size="" text="Save" onClick={handleSave} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditPasswordModel;
