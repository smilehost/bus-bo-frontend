import React, { useState } from "react";
import InputPassword from "../Form/InputPassword";
import { createSecurePassword } from "@/utils/generatePassword";
import ButtonDefault from "../Form/ButtonDefault";
import ButtonBG from "../Form/ButtonBG";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
};

export default function EnterPassModal({ isOpen, onClose, onSubmit }: Props) {
  const [password, setPassword] = useState("");


  const genPassword = (length: number) => {
    const newPassword = createSecurePassword(length);
    setPassword(newPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-sm">
        <h3 className="text-lg font-medium text-gray-800">Edit Password</h3>
        <div className="mt-4">
          <InputPassword
            label={"กรอกรหัสผ่าน"}
            placeholder={"Password"}
            value={password}
            setValue={setPassword}
            onGenerate={() => genPassword(8)}
            generateLabel={"Genarage Password"}
            warring="Please specify length greater than 8."
          />
        </div>

        <div className="flex gap-3 justify-end mt-10">
          <ButtonDefault size="" text="Cancel" onClick={onClose} />
          <ButtonBG size="" text="Save" onClick={() => onSubmit(password)} />
        </div>
        {/* <input
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
        </div> */}
      </div>
    </div>
  );
}
