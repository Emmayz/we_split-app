import React from "react";
import { View, Text } from "react-native";

interface Props {
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, size = 40 }: Props) {
  const initials = getInitials(name);
  return (
    <View
      className="items-center justify-center rounded-full bg-surface border border-border"
      style={{ width: size, height: size }}
    >
      <Text
        style={{ fontSize: size * 0.35, color: "#F0EEE7", fontFamily: "SpaceGrotesk_600SemiBold" }}
      >
        {initials}
      </Text>
    </View>
  );
}
