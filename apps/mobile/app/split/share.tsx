import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSplitStore } from "../../stores/splitStore";
import { MemberShareRow } from "../../components/splits/MemberShareRow";
import { PaymentProgress } from "../../components/splits/PaymentProgress";
import { formatGbp } from "../../utils/money";
import { api } from "../../services/api";

export default function ShareSplitScreen() {
  const router = useRouter();
  const { activeSplit } = useSplitStore();

  if (!activeSplit) {
    router.replace("/(tabs)/");
    return null;
  }

  const paidCount = activeSplit.members.filter((m) => m.paid).length;

  async function handleSendLink(memberId: string) {
    try {
      await api.post(`/splits/${activeSplit!.id}/invite/${memberId}`);
      Alert.alert("Link sent!");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="px-6 pt-16 pb-12 gap-6">
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "#8A8A9B" }}>← Back</Text>
      </TouchableOpacity>

      <View className="gap-1">
        <Text className="text-2xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
          {activeSplit.name}
        </Text>
        <Text className="text-4xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
          {formatGbp(activeSplit.totalGbp)}
        </Text>
      </View>

      <PaymentProgress paid={paidCount} total={activeSplit.members.length} />

      <View className="gap-1">
        <Text className="text-base font-semibold" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_600SemiBold" }}>
          Send payment links
        </Text>
        {activeSplit.members.map((member) => (
          <MemberShareRow
            key={member.id}
            member={member}
            isHost
            onSendLink={() => handleSendLink(member.id)}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/")}
        className="py-4 rounded-xl items-center"
        style={{ backgroundColor: "#00E5FF" }}
      >
        <Text style={{ color: "#0B0B14", fontFamily: "SpaceGrotesk_700Bold" }}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
