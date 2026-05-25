import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { formatGbp } from "../../utils/money";
import { SplitMember } from "@wesplit/shared";

interface Props {
  member: SplitMember;
  onSendLink?: () => void;
  onRemind?: () => void;
  isHost?: boolean;
}

export function MemberShareRow({ member, onSendLink, onRemind, isHost }: Props) {
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-border">
      <Avatar name={member.guestName} size={40} />
      <View className="flex-1">
        <Text className="text-base font-medium" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_500Medium" }}>
          {member.guestName}
        </Text>
        <Text className="text-sm" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>
          {formatGbp(member.shareGbp)}
        </Text>
      </View>
      <Badge status={member.paid ? "paid" : "pending"} />
      {isHost && !member.paid && (
        <TouchableOpacity
          onPress={onSendLink}
          className="px-3 py-1.5 rounded-lg border border-accent"
        >
          <Text className="text-xs font-medium" style={{ color: "#00E5FF", fontFamily: "SpaceGrotesk_500Medium" }}>
            Send
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
