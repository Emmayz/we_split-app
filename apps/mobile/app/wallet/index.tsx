import React from "react";
import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useWallet } from "../../hooks/useWallet";
import { useAuthStore } from "../../stores/authStore";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatGbp } from "../../utils/money";
import { WalletTransaction } from "@wesplit/shared";

export default function WalletScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { wallet } = useWallet();
  const isVerified = user?.kycStatus === "VERIFIED";

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-16 pb-6 gap-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#8A8A9B" }}>← Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>Wallet</Text>
        <Text className="text-5xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
          {formatGbp(wallet.data?.walletBalanceGbp ?? 0)}
        </Text>

        {isVerified ? (
          <TouchableOpacity
            onPress={() => router.push("/wallet/withdraw")}
            className="py-4 rounded-xl items-center"
            style={{ backgroundColor: "#00E5FF" }}
          >
            <Text style={{ color: "#0B0B14", fontFamily: "SpaceGrotesk_700Bold" }}>Withdraw</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/wallet/kyc")}
            className="py-4 rounded-xl items-center border border-accent"
          >
            <Text style={{ color: "#00E5FF", fontFamily: "SpaceGrotesk_600SemiBold" }}>Verify Identity to Withdraw</Text>
          </TouchableOpacity>
        )}
      </View>

      {wallet.isLoading ? (
        <View className="px-6 gap-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={60} />)}
        </View>
      ) : (
        <FlashList
          data={wallet.data?.transactions ?? []}
          renderItem={({ item }: { item: WalletTransaction }) => (
            <View className="flex-row items-center gap-3 px-6 py-4 border-b border-border">
              <View className="flex-1">
                <Text className="text-sm font-medium" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_500Medium" }}>
                  {item.description}
                </Text>
                <Text className="text-xs" style={{ color: "#8A8A9B" }}>
                  {new Date(item.createdAt).toLocaleDateString("en-GB")}
                </Text>
              </View>
              <Text style={{ color: item.type === "CREDIT" ? "#00FF94" : "#FF4D6D", fontFamily: "SpaceGrotesk_600SemiBold" }}>
                {item.type === "CREDIT" ? "+" : "-"}{formatGbp(item.amountGbp)}
              </Text>
            </View>
          )}
          estimatedItemSize={70}
          refreshControl={<RefreshControl refreshing={wallet.isFetching} onRefresh={wallet.refetch} tintColor="#00E5FF" />}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text style={{ color: "#8A8A9B" }}>No transactions yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
