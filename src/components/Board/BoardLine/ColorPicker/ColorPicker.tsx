import './ColorPicker.css';
import { Color, Colors } from 'store/types';

interface ColorPickerProps {
  onColorSelect: (c: Color) => void
  targetOffsetX: number
}

const ColorPicker = (props: ColorPickerProps) => {
  const { onColorSelect, targetOffsetX } = props;
  const colors = [];

  for (let i = 0; i < Colors.length; i++) {
    colors.push(
      <div
        key={`color-picker-${i}`}
        className="ColorPicker-item"
        style={{ backgroundColor: Colors[i] }}
        onClick={() => onColorSelect(Colors[i])}
      >
        {i + 1}
      </div>,
    );
  }

  return (
    <div className="ColorPicker">
      {colors}
      <div className="ColorPicker-anchor" style={{ left: targetOffsetX }}/>
    </div>
  );
};

export default ColorPicker;
