// InputLabel.tsx
import React from "react";

type InputLabelProps = {
  label: string;
  placeholder?: string;
  type: string;
  value: string;
  setValue: (val: string) => void;
};

function InputLabel({
  label,
  placeholder,
  type,
  value,
  setValue,
}: InputLabelProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        className="p-2 border rounded"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default InputLabel;
