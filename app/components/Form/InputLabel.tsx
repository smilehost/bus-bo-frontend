import React from 'react'
import LabelText from './LabelText'

type InputLabelProps = {
    label: React.ReactNode,
    placeholder: string,
    setValue: (value: string) => void;
    value?: string | undefined;
    type: string,
    size?: string
    autoComplete?: string;
    disabled?: boolean;
}
function InputLabel({ label, placeholder, setValue, type, size, value, disabled }: InputLabelProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (type === "amount") {
            // ✅ ถ้าเป็นค่าว่างให้ยอมให้ลบ
            if (val === "") {
                setValue("0");
                return;
            }

            const num = parseInt(val, 10);

            if (isNaN(num) || num < 0) return;

            setValue(num.toString());
        } else {
            setValue(val);
        }
    };
    return (
        <div className='flex flex-col gap-2'>
            <LabelText text={label} />
            <input
                value={value}
                type={type === "amount" ? "number" : type}
                min={type === "amount" ? 0 : undefined}

                placeholder={placeholder}
                className={` h-[38px] px-5 rounded-md custom-border-gray text-[14px] ${size} custom-focus-input`}
                onChange={handleChange}
                disabled={disabled}
            />
        </div>
    )
}

export default InputLabel
