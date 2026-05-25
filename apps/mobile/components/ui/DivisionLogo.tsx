import React from "react";
import Svg, { Text as SvgText } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

export function DivisionLogo({ size = 48, color = "#00E5FF" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <SvgText
        x="24"
        y="35"
        fontSize={size * 0.9}
        fill={color}
        textAnchor="middle"
        fontFamily="SpaceGrotesk_700Bold"
      >
        ÷
      </SvgText>
    </Svg>
  );
}
