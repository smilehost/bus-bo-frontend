import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker, ColorResult } from 'react-color'; 
import LabelText from './LabelText';

type ColorRouteProps = {
    color: string;
    setRouteColor: React.Dispatch<React.SetStateAction<string>>;
};

function ColorRoute({ color, setRouteColor }: ColorRouteProps) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null); // ใช้จับ ref

    const handleChangeComplete = (color: ColorResult) => {
        setRouteColor(color.hex);
    };

    const toggleColorPicker = () => {
        setShowColorPicker((prev) => !prev);
    };

    // ปิด Color Picker เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setShowColorPicker(false);
            }
        };

        if (showColorPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPicker]);

    return (
        <div ref={pickerRef} className="relative min-w-[300px] xl:w-[400px] max-w-[400px] flex flex-col gap-2">
            <LabelText text="Route Color" />
            <div className="flex gap-4 cursor-pointer" onClick={toggleColorPicker}>
                <div
                    style={{ backgroundColor: color }}
                    className="w-[32px] h-[32px] rounded-full flex-shrink-0 custom-border-gray"
                />
                <div
                    style={{ backgroundColor: color }}
                    className="h-[32px] w-full rounded-md custom-border-gray"
                />
            </div>

            {showColorPicker && (
                <div className="mt-2 absolute top-[100%] z-10">
                    <ChromePicker color={color} onChangeComplete={handleChangeComplete} />
                </div>
            )}
        </div>
    );
}

export default ColorRoute;
