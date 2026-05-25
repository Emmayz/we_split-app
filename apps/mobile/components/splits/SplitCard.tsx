import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AvatarStack } from "../ui/AvatarStack";
import { Badge } from "../ui/Badge";
import { formatGbp } from "../../utils/money";
import { Split } from "@wesplit/shared";

interface Props {
  split: Split;
  onPress: () => void;
}

export function SplitCard({ split, onPress }: Props) {
  const names = split.members.map((m) => m.guestName);
  const paidCount = split.members.filter((m) => m.paid).length;
  const statusMap: Record<string, "settled" | "pending" | "cancelled"> = {
    SETTLED: "settled",
    ACTIVE: "pending",
    CANCELLED: "cancelled",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-surface border border-border rounded-2xl p-4 mb-3"
      activeOpacity={0.8}
    >
      <View className="flex-row items-start justify-between mb-3">
        <Text className="text-base font-semibold flex-1 mr-2" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_600SemiBold" }}>
          {split.name}
        </Text>
        <View className="items-end gap-1">
          <Text className="text-lg font-bold" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
            {formatGbp(split.totalGbp)}
          </Text>
          <Badge status={statusMap[split.status] ?? "pending"} />
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <AvatarStack names={names} size={28} />
        <Text className="text-sm" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>
          {paidCount}/{split.members.length} paid
        </Text>
      </View>
    </TouchableOpacity>
  );
}
