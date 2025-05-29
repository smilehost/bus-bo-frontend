declare module 'react-color' {
    import * as React from 'react';
  
    export interface Color {
      r: number;
      g: number;
      b: number;
      a: number;
    }
  
    export interface ColorResult {
      hex: string;
      rgb: Color;
    }
  
    interface PickerProps {
      color: string;
      onChangeComplete: (color: ColorResult) => void;
    }
  
    export class ChromePicker extends React.Component<PickerProps> {}
  }
  