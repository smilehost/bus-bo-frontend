import React, { useState, useRef, useEffect } from 'react';
import { ColorResult } from 'react-color';
import LabelText from './LabelText';

//component 
import ColorModel from '../Model/ColorModel';

type ColorRouteProps = {
    color: string;
    label: string;
    size_circle?: string;
    size_input?: string;
    size?: string
    setRouteColor: React.Dispatch<React.SetStateAction<string>>;
};

function ColorRoute({ color, setRouteColor, label, size_circle, size_input, size }: ColorRouteProps) {
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
        <div ref={pickerRef} className={`relative ${size} flex flex-col gap-2`}>
            <LabelText text={label} />
            <div className={`flex gap-4 cursor-pointer`} onClick={toggleColorPicker}>
                <div
                    style={{ backgroundColor: color }}
                    className={`${size_circle} rounded-full flex-shrink-0 custom-border-gray`}
                />
                <div
                    style={{ backgroundColor: color }}
                    className={`${size_input} rounded-md custom-border-gray`}
                />
            </div>

            <ColorModel color={color} onChangeComplete={handleChangeComplete} show={showColorPicker} />

        </div>
    );
}

export default ColorRoute;
