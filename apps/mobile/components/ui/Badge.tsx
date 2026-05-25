import React from "react";
import { View, Text } from "react-native";

type Status = "paid" | "pending" | "overdue" | "settled" | "cancelled" | "verified" | "none";

const statusConfig: Record<Status, { bg: string; text: string; label: string }> = {
  paid: { bg: "#00FF9420", text: "#00FF94", label: "Paid" },
  pending: { bg: "#FFB80020", text: "#FFB800", label: "Pending" },
  overdue: { bg: "#FF4D6D20", text: "#FF4D6D", label: "Overdue" },
  settled: { bg: "#00E5FF20", text: "#00E5FF", label: "Settled" },
  cancelled: { bg: "#5A5A6B20", text: "#5A5A6B", label: "Cancelled" },
  verified: { bg: "#00FF9420", text: "#00FF94", label: "Verified" },
  none: { bg: "#5A5A6B20", text: "#5A5A6B", label: "Unverified" },
};

interface Props {
  status: Status;
  label?: string;
}

export function Badge({ status, label }: Props) {
  const config = statusConfig[status];
  return (
    <View
      className="px-2 py-1 rounded-md"
      style={{ backgroundColor: config.bg }}
    >
      <Text
        className="text-xs font-medium"
        style={{ color: config.text, fontFamily: "SpaceGrotesk_500Medium" }}
      >
        {label ?? config.label}
      </Text>
    </View>
  );
}
