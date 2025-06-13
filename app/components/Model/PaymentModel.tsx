"use client";

import { PAYMENT_TYPE } from "@/constants/enum";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (member: {
    id?: string;
    name: string;
    url: string;
    type: string;
    slip: number;
  }) => void;
  editing?: {
    id: string;
    name: string;
    url: string;
    type: string;
    slip: number;
  };
};

export default function PaymentModel({
  onClose,
  onSave,
  editing,
}: ModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [slip, setSlip] = useState<number>(1);


  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setUrl(editing.url);
      setType(editing.type);
      setSlip(editing.slip);
    } else {
      setName("");
      setUrl("");
      setType(PAYMENT_TYPE.STATIC);
      setSlip(1);
    }
  }, [editing]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter all input.");
      return;
    }
    onSave({ name, url, type, slip });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✖️
        </button>

        <h2 className="text-xl font-semibold text-center mb-6">
          {editing ? "Edit Payment" : "Add New Payment"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Payment Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Url
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter Payment Url"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value={PAYMENT_TYPE.STATIC}>{PAYMENT_TYPE.STATIC}</option>
              <option value={PAYMENT_TYPE.GATE_WAY}>{PAYMENT_TYPE.GATE_WAY}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slip
            </label>
            <select
              value={slip}
              onChange={(e) => setSlip(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value={1}>Need a slip image</option>
              <option value={0}>No need for a slip image</option>
            </select>
          </div>



          <div className="flex justify-end space-x-2 mt-10">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90 cursor-pointer"
            >
              {editing ? "Update Payment" : "Add Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
