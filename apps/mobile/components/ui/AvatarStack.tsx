import React from "react";
import { View } from "react-native";
import { Avatar } from "./Avatar";

interface Props {
  names: string[];
  max?: number;
  size?: number;
}

export function AvatarStack({ names, max = 4, size = 32 }: Props) {
  const shown = names.slice(0, max);
  const overlap = Math.floor(size * 0.3);

  return (
    <View className="flex-row" style={{ height: size }}>
      {shown.map((name, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: i }}>
          <Avatar name={name} size={size} />
        </View>
      ))}
    </View>
  );
}
