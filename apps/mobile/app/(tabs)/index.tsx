import React from "react";
import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useSplits } from "../../hooks/useSplits";
import { useAuthStore } from "../../stores/authStore";
import { SplitCard } from "../../components/splits/SplitCard";
import { DivisionLogo } from "../../components/ui/DivisionLogo";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatGbp } from "../../utils/money";
import { Split } from "@wesplit/shared";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { splits } = useSplits();

  const data = splits.data ?? [];
  const owedToYou = data
    .filter((s: Split) => s.status === "ACTIVE")
    .reduce(
      (sum: number, s: Split) =>
        sum + s.members.filter((m) => !m.paid).reduce((a, m) => a + m.shareGbp, 0),
      0
    );

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-16 pb-4">
        <Text className="text-2xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
          Hey, {user?.name?.split(" ")[0] ?? "there"}
        </Text>
        <Text className="text-5xl mt-1" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
          {formatGbp(user?.walletBalanceGbp ?? 0)}
        </Text>
        <Text className="text-sm mt-1" style={{ color: "#8A8A9B" }}>Wallet balance</Text>

        <View className="flex-row gap-3 mt-4">
          <View className="flex-1 bg-surface border border-border rounded-xl p-4">
            <Text className="text-xs" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>Owed to you</Text>
            <Text className="text-lg font-bold mt-1" style={{ color: "#00FF94", fontFamily: "SpaceGrotesk_700Bold" }}>
              {formatGbp(owedToYou)}
            </Text>
          </View>
          <View className="flex-1 bg-surface border border-border rounded-xl p-4">
            <Text className="text-xs" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>Active splits</Text>
            <Text className="text-lg font-bold mt-1" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
              {data.filter((s: Split) => s.status === "ACTIVE").length}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-6 pb-2">
        <Text className="text-lg font-semibold" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_600SemiBold" }}>
          Recent Splits
        </Text>
      </View>

      {splits.isLoading ? (
        <View className="px-6 gap-3">
          <Skeleton height={80} />
          <Skeleton height={80} />
          <Skeleton height={80} />
        </View>
      ) : splits.isError ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text style={{ color: "#FF4D6D" }}>Failed to load splits</Text>
          <TouchableOpacity onPress={() => splits.refetch()} className="px-4 py-2 rounded-lg border border-accent">
            <Text style={{ color: "#00E5FF" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : data.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-4">
          <DivisionLogo size={48} />
          <Text style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>No splits yet</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/new-split")} className="px-6 py-3 rounded-xl" style={{ backgroundColor: "#00E5FF" }}>
            <Text style={{ color: "#0B0B14", fontFamily: "SpaceGrotesk_700Bold" }}>Start a Split</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlashList
          data={data}
          renderItem={({ item }) => (
            <SplitCard
              split={item}
              onPress={() => router.push(`/split/${item.id}` as any)}
            />
          )}
          estimatedItemSize={90}
          contentContainerStyle={{ padding: 24 }}
          refreshControl={<RefreshControl refreshing={splits.isFetching} onRefresh={splits.refetch} tintColor="#00E5FF" />}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/new-split")}
        className="absolute bottom-8 right-6 w-14 h-14 rounded-full items-center justify-center"
        style={{ backgroundColor: "#00E5FF", elevation: 8, shadowColor: "#00E5FF", shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
        activeOpacity={0.85}
      >
        <Text style={{ fontSize: 28, color: "#0B0B14", fontFamily: "SpaceGrotesk_700Bold" }}>÷</Text>
      </TouchableOpacity>
    </View>
  );
}
