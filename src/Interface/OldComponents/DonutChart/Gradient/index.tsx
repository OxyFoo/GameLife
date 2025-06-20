import { memo } from "react";
import { Defs, LinearGradient, Stop } from "react-native-svg";

export const Gradient = memo(function Gradient({ label, colors }: Props) {
  const maxIndex = colors.length - 1;
  return (
    <Defs>
      <LinearGradient x1={0} x2={0} y1={0} y2={1} id={label}>
        {colors.map((color, i) => {
          return (
            <Stop
              stopColor={color}
              key={`${color}-${i}`}
              offset={i / maxIndex}
            />
          );
        })}
      </LinearGradient>
    </Defs>
  );
});

interface Props {
  label: string;
  colors: string[];
}
