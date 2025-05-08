"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";

type EditPasswordModelProps = {
  open: boolean;
  onClose: () => void;
  onSave: (newPassword: string) => void;
};

function EditPasswordModel({ open, onClose, onSave }: EditPasswordModelProps) {
  const [password, setPassword] = useState<string>("");

  const handleSave = () => {
    if (!password) {
      alert("Please enter a new password.");
      return;
    }
    onSave(password);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="w-[400px] py-4">
          <h3 className="text-lg font-medium text-gray-800">Edit Password</h3>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <ButtonDefault size="" text="Cancel" onClick={onClose} />
            <ButtonBG size="" text="Save" onClick={handleSave} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditPasswordModel;
