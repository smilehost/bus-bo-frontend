"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";
import { STATUS } from "@/constants/enum";

type EditStatusModelProps = {
  open: boolean;
  onClose: () => void;
  currentStatus: STATUS;
  onSave: (newStatus: STATUS) => void;
};

function EditStatusModel({
  open,
  onClose,
  currentStatus,
  onSave,
}: EditStatusModelProps) {
  const [status, setStatus] = useState<string>(currentStatus);

  const statusOptions = ["Active", "Inactive", "Cancelled"];

  const handleSave = () => {
    onSave(status as STATUS);
    onClose();
  };

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="w-[400px] py-4">
          <h3 className="text-lg font-medium text-gray-800">Edit Status</h3>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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

export default EditStatusModel;