import React from 'react';
import { ChromePicker, ColorResult } from 'react-color';

type ColorModelProps = {
  color: string;
  onChangeComplete: (color: ColorResult) => void;
  show: boolean;
};

const ColorModel: React.FC<ColorModelProps> = ({ color, onChangeComplete, show }) => {
  if (!show) return null;

  return (
    <div className="mt-2 absolute top-[100%] z-10">
      <ChromePicker color={color} onChangeComplete={onChangeComplete} />
    </div>
  );
};

export default ColorModel;
