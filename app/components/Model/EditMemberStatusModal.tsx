"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import ButtonBG from "../Form/ButtonBG";
import ButtonDefault from "../Form/ButtonDefault";
import { getTextManageUserPage, useLanguageContext } from "@/app/i18n/translations";
import { STATUS } from "@/constants/enum";

type EditStatusModelProps = {
  open: boolean;
  onClose: () => void;
  currentStatus: number; // ใช้ number แทน STATUS enum string
  onSave: (newStatus: number) => void;
};

function EditStatusModel({
  open,
  onClose,
  currentStatus,
  onSave,
}: EditStatusModelProps) {
  const [status, setStatus] = useState<number>(currentStatus);

  const statusOptions = [
    { label: STATUS.ACTIVE, value: 1 },
    { label: STATUS.INACTIVE, value: 0 },
  ];
  const { isTH, isSuperAdmin } = useLanguageContext();
  const text = getTextManageUserPage({ isTH, isSuperAdmin });

  const handleSave = () => {
    onSave(status);
    onClose();
  };

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="w-[400px] py-4">
          <h3 className="text-lg font-medium text-gray-800">{text.editStatus}</h3>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">{text.status}</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <ButtonDefault size="" text={text.cancelText} onClick={onClose} />
            <ButtonBG size="" text={text.btnSave} onClick={handleSave} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditStatusModel;
