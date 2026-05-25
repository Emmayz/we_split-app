import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSplit } from "../../hooks/useSplits";
import { MemberShareRow } from "../../components/splits/MemberShareRow";
import { PaymentProgress } from "../../components/splits/PaymentProgress";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatGbp } from "../../utils/money";
import { api } from "../../services/api";
import { useQueryClient } from "@tanstack/react-query";

export default function SplitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: split, isLoading, isError, refetch } = useSplit(id!);

  const paidCount = split?.members.filter((m) => m.paid).length ?? 0;
  const totalCount = split?.members.length ?? 0;

  async function handleRemind(memberId: string) {
    try {
      await api.post(`/splits/${id}/remind/${memberId}`);
      Alert.alert("Reminder sent");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  }

  async function handleMarkPaid(memberId: string) {
    try {
      await api.patch(`/splits/${id}/members/${memberId}`, { paid: true });
      queryClient.invalidateQueries({ queryKey: ["split", id] });
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  }

  const statusMap: Record<string, "settled" | "pending" | "cancelled"> = {
    SETTLED: "settled",
    ACTIVE: "pending",
    CANCELLED: "cancelled",
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-bg px-6 pt-16 gap-4">
        <Skeleton height={32} width={200} />
        <Skeleton height={16} />
        <Skeleton height={60} />
        <Skeleton height={60} />
        <Skeleton height={60} />
      </View>
    );
  }

  if (isError || !split) {
    return (
      <View className="flex-1 bg-bg items-center justify-center gap-4">
        <Text style={{ color: "#FF4D6D" }}>Failed to load split</Text>
        <TouchableOpacity onPress={() => refetch()} className="px-4 py-2 rounded-lg border border-accent">
          <Text style={{ color: "#00E5FF" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="px-6 pt-16 pb-12 gap-6">
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>← Back</Text>
      </TouchableOpacity>

      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-1">
          <Text className="text-2xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
            {split.name}
          </Text>
          <Text className="text-3xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
            {formatGbp(split.totalGbp)}
          </Text>
        </View>
        <Badge status={statusMap[split.status] ?? "pending"} />
      </View>

      <PaymentProgress paid={paidCount} total={totalCount} />

      <View className="gap-2">
        <Text className="text-base font-semibold" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_600SemiBold" }}>
          Members
        </Text>
        {split.members.map((member) => (
          <MemberShareRow
            key={member.id}
            member={member}
            isHost
            onSendLink={() => handleRemind(member.id)}
            onRemind={() => handleRemind(member.id)}
          />
        ))}
      </View>

      {split.status === "ACTIVE" && paidCount > 0 && (
        <TouchableOpacity
          className="py-4 rounded-xl items-center mt-4"
          style={{ backgroundColor: "#00E5FF" }}
          onPress={() => Alert.alert("Coming soon", "Settlement is automatic when all members pay.")}
        >
          <Text style={{ color: "#0B0B14", fontFamily: "SpaceGrotesk_700Bold" }}>Settle Split</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
