import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
};

export default function EnterPassModal({ isOpen, onClose, onSubmit }: Props) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-3">กรอกรหัสผ่าน</h2>
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2 ">
          <button onClick={onClose} className="text-gray-500 hover:underline cursor-pointer">ยกเลิก</button>
          <button
            onClick={() => {
              onSubmit(password);
              setPassword("");
            }}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}
