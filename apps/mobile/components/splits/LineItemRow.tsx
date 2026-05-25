import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { formatGbp } from "../../utils/money";
import { LineItem, SplitMember } from "@wesplit/shared";

interface Props {
  item: LineItem;
  members: SplitMember[];
  onAssign?: (itemId: string) => void;
}

export function LineItemRow({ item, members, onAssign }: Props) {
  const assignedMember = members.find((m) => m.id === item.assignedToMemberId);

  return (
    <View className="flex-row items-center py-3 border-b border-border gap-3">
      <View className="flex-1">
        <Text className="text-base" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_400Regular" }}>
          {item.name}
        </Text>
      </View>
      <Text className="text-base font-medium" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_500Medium" }}>
        {formatGbp(item.priceGbp)}
      </Text>
      <TouchableOpacity
        onPress={() => onAssign?.(item.id)}
        className="px-2 py-1 rounded-lg"
        style={{ backgroundColor: assignedMember ? "#00E5FF20" : "#1C1C2A" }}
      >
        <Text className="text-xs font-medium" style={{ color: assignedMember ? "#00E5FF" : "#8A8A9B", fontFamily: "SpaceGrotesk_500Medium" }}>
          {assignedMember ? assignedMember.guestName : "Assign"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
