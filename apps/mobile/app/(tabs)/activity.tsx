import React from "react";
import { View, Text, RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useWallet } from "../../hooks/useWallet";
import { Skeleton } from "../../components/ui/Skeleton";
import { Badge } from "../../components/ui/Badge";
import { formatGbp } from "../../utils/money";
import { WalletTransaction } from "@wesplit/shared";

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const isCredit = tx.type === "CREDIT";
  const statusMap: Record<string, "paid" | "pending" | "overdue"> = {
    COMPLETED: "paid",
    PENDING: "pending",
    FAILED: "overdue",
  };

  return (
    <View className="flex-row items-center gap-3 py-4 border-b border-border">
      <View className="w-10 h-10 rounded-full bg-surface-elevated items-center justify-center">
        <Text style={{ fontSize: 18 }}>{isCredit ? "↓" : "↑"}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_500Medium" }}>
          {tx.description}
        </Text>
        <Text className="text-xs" style={{ color: "#8A8A9B" }}>
          {new Date(tx.createdAt).toLocaleDateString("en-GB")}
        </Text>
      </View>
      <View className="items-end gap-1">
        <Text
          className="text-base font-semibold"
          style={{ color: isCredit ? "#00FF94" : "#FF4D6D", fontFamily: "SpaceGrotesk_600SemiBold" }}
        >
          {isCredit ? "+" : "-"}{formatGbp(tx.amountGbp)}
        </Text>
        <Badge status={statusMap[tx.status] ?? "pending"} />
      </View>
    </View>
  );
}

export default function ActivityScreen() {
  const { wallet } = useWallet();
  const transactions = wallet.data?.transactions ?? [];

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-16 pb-4">
        <Text className="text-2xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>Activity</Text>
      </View>

      {wallet.isLoading ? (
        <View className="px-6 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={60} />)}
        </View>
      ) : transactions.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Text style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>No transactions yet</Text>
        </View>
      ) : (
        <FlashList
          data={transactions}
          renderItem={({ item }) => <TransactionRow tx={item} />}
          estimatedItemSize={70}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          refreshControl={<RefreshControl refreshing={wallet.isFetching} onRefresh={wallet.refetch} tintColor="#00E5FF" />}
        />
      )}
    </View>
  );
}
