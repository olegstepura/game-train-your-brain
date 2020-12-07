import './ColorPicker.css';
import { Color, Colors } from 'store/types';

interface ColorPickerProps {
  selectedColors: Color[]
  onColorSelect: (c: Color) => void
  targetOffsetX: number
}

const ColorPicker = (props: ColorPickerProps) => {
  const { onColorSelect, targetOffsetX, selectedColors } = props;
  const colors = [];

  for (let i = 0; i < Colors.length; i++) {
    const color = Colors[i];
    colors.push(
      <div
        key={`color-picker-${i}`}
        className={`ColorPicker__Item ${selectedColors.includes(color) ? 'ColorPicker__Item--selected' : ''}`}
        style={{ backgroundColor: color }}
        onClick={() => onColorSelect(color)}
      >
        {i + 1}
      </div>,
    );
  }

  return (
    <div className="ColorPicker">
      {colors}
      <div className="ColorPicker__Anchor" style={{ left: targetOffsetX }}/>
    </div>
  );
};

export default ColorPicker;
