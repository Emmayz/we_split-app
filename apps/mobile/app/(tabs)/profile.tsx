import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    Alert.alert("Log out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  }

  const kycStatusMap: Record<string, "verified" | "pending" | "none"> = {
    VERIFIED: "verified",
    PENDING: "pending",
    NONE: "none",
    REJECTED: "overdue" as any,
  };

  return (
    <View className="flex-1 bg-bg px-6 pt-16 gap-6">
      <Text className="text-2xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>Profile</Text>

      <View className="items-center gap-3">
        <Avatar name={user?.name ?? "?"} size={72} />
        <Text className="text-xl font-semibold" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_600SemiBold" }}>
          {user?.name}
        </Text>
        <Text style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>{user?.email}</Text>
        <Text style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>{user?.phone}</Text>
      </View>

      <View className="bg-surface border border-border rounded-2xl overflow-hidden">
        {[
          { label: "Wallet", onPress: () => router.push("/wallet/") },
          {
            label: "Verify Identity",
            onPress: () => router.push("/wallet/kyc"),
            right: <Badge status={kycStatusMap[user?.kycStatus ?? "NONE"] ?? "none"} label={user?.kycStatus ?? "NONE"} />,
          },
          { label: "Log Out", onPress: handleLogout, danger: true },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={item.onPress}
            className="flex-row items-center justify-between px-5 py-4 border-b border-border last:border-b-0"
            activeOpacity={0.7}
          >
            <Text
              className="text-base"
              style={{ color: item.danger ? "#FF4D6D" : "#F0EEE7", fontFamily: "SpaceGrotesk_400Regular" }}
            >
              {item.label}
            </Text>
            {item.right ?? <Text style={{ color: "#5A5A6B" }}>›</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
