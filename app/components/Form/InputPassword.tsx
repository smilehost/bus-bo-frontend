import { useState } from "react";
import InputLabel from "./InputLabel"; // ปรับ path ให้ตรงกับโปรเจกต์คุณ
import { EyeIcon } from "../Icons/EyeIcon";
import { CopyIcon } from "../Icons/CopyIcon";


type PasswordInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  setValue: (val: string) => void;
  onGenerate?: () => void;
  autoComplete?: string;
  generateLabel?: string;
};

export default function PasswordInput({
  label,
  placeholder = "",
  value,
  setValue,
  onGenerate,
  autoComplete = "new-password",
  generateLabel = "Generate",
}: PasswordInputProps) {
  const [typePassword, setTypePassword] = useState(true);
  const [isCopy, setIsCopy] = useState(false);

  const togglePassword = () => setTypePassword((prev) => !prev);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopy(true);
      setTimeout(() => setIsCopy(false), 1000);
    } catch (err) {
      console.error("Failed to copy password", err);
    }
  };

  return (
    <div className="relative">
      <InputLabel
        label={
          <div className="flex justify-between">
            <p>{label}</p>
            {onGenerate && (
              <div onClick={onGenerate} className="cursor-pointer">
                <p className="text-sm text-blue-500 hover:underline">{generateLabel}</p>
              </div>
            )}
          </div>
        }
        placeholder={placeholder}
        type={typePassword ? "password" : "text"}
        value={value}
        setValue={setValue}
        autoComplete={autoComplete}
      />

      <div className="absolute bottom-2 right-4 flex gap-2 items-center">
        <button
          type="button"
          onClick={togglePassword}
          className="text-gray-500 hover:text-blue-500 transition-colors"
        >
          <EyeIcon visible={typePassword} />
        </button>
        <button
          type="button"
          onClick={copyPassword}
          className={`${isCopy ? "text-green-600" : "text-gray-500"} hover:text-green-700 transition-colors`}
        >
          <CopyIcon copied={isCopy} />
        </button>
      </div>
    </div>
  );
}