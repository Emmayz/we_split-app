import React from "react";
import { View, Text } from "react-native";

interface Props {
  paid: number;
  total: number;
}

export function PaymentProgress({ paid, total }: Props) {
  const percent = total === 0 ? 0 : (paid / total) * 100;

  return (
    <View className="gap-1">
      <View className="flex-row justify-between">
        <Text className="text-sm" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>
          {paid} of {total} paid
        </Text>
        <Text className="text-sm font-medium" style={{ color: "#00E5FF", fontFamily: "SpaceGrotesk_500Medium" }}>
          {Math.round(percent)}%
        </Text>
      </View>
      <View className="h-1 rounded-full" style={{ backgroundColor: "#1F1F2D" }}>
        <View
          className="h-1 rounded-full"
          style={{ width: `${percent}%`, backgroundColor: "#00E5FF" }}
        />
      </View>
    </View>
  );
}
