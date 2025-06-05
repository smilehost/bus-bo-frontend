import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material'; // หรือ component dialog ที่ใช้อยู่จริง
import TitleModel from '../Title/TitleModel';
import InputLabel from '../Form/InputLabel';
import ButtonDefault from '../Form/ButtonDefault';
import ButtonBG from '../Form/ButtonBG';
import Image from 'next/image';

export type ConfirmWithInputProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
    placeholder?: string;
    defaultValue?: string;
    label?: string;
    onConfirm: (value: string) => void;
};

export const ConfirmWithInput: React.FC<ConfirmWithInputProps> = ({
    open,
    onClose,
    title,
    text,
    confirmText = "Confirm",
    cancelText = "Cancel",
    placeholder = "",
    defaultValue = "",
    label = "",
    onConfirm
}) => {
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = () => {
        if (!value.trim()) {
            setError("Please enter a value");
            return;
        }
        setError(null);
        onConfirm(value.trim());
        onClose();
    };

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <div className="w-[448px] py-2 relative">
                    <TitleModel title={title} description={text} />
                    <div className="mt-7 flex flex-col gap-4">
                        <InputLabel
                            label={label}
                            placeholder={placeholder}
                            type="text"
                            value={value}
                            setValue={(e) => setValue(e)}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <div className="flex gap-3 justify-end mt-7">
                        <ButtonDefault size="" text={cancelText} onClick={onClose} />
                        <ButtonBG size="" text={confirmText} onClick={handleConfirm} />
                    </div>
                    <div
                        className="absolute top-0 right-0 cursor-pointer"
                        onClick={onClose}
                    >
                        <Image src={"/icons/close.svg"} width={24} height={24} alt="close-icon" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};