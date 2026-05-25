import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSplitStore } from "../../stores/splitStore";
import { LineItemRow } from "../../components/splits/LineItemRow";
import { formatGbp } from "../../utils/money";
import { Skeleton } from "../../components/ui/Skeleton";

export default function ReceiptScreen() {
  const router = useRouter();
  const { activeSplit } = useSplitStore();

  if (!activeSplit) {
    router.replace("/(tabs)/");
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="px-6 pt-16 pb-12 gap-6">
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "#8A8A9B" }}>← Back</Text>
      </TouchableOpacity>

      <Text className="text-2xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
        Review Receipt
      </Text>

      <View className="bg-surface border border-border rounded-2xl p-4 gap-1">
        {activeSplit.lineItems.length === 0 ? (
          <Text style={{ color: "#8A8A9B" }}>No line items. Add them manually or scan a receipt.</Text>
        ) : (
          activeSplit.lineItems.map((item) => (
            <LineItemRow
              key={item.id}
              item={item}
              members={activeSplit.members}
              onAssign={(itemId) => Alert.alert("Assign", `Assign item ${itemId}`)}
            />
          ))
        )}
      </View>

      <View className="flex-row justify-between py-3 border-t border-border">
        <Text style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_500Medium" }}>Total</Text>
        <Text style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold", fontSize: 18 }}>
          {formatGbp(activeSplit.totalGbp)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/split/share")}
        className="py-4 rounded-xl items-center"
        style={{ backgroundColor: "#00E5FF" }}
      >
        <Text style={{ color: "#0B0B14", fontFamily: "SpaceGrotesk_700Bold" }}>Confirm Split</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
