import React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/Button";
import { DivisionLogo } from "../../components/ui/DivisionLogo";
import { useWallet } from "../../hooks/useWallet";
import { useAuthStore } from "../../stores/authStore";

export default function KycScreen() {
  const router = useRouter();
  const { startKyc } = useWallet();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  async function handleVerify() {
    try {
      const { url } = await startKyc.mutateAsync();
      await WebBrowser.openBrowserAsync(url);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="flex-1 px-6 pt-16 pb-12 gap-6">
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "#8A8A9B" }}>← Back</Text>
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center gap-6">
        <DivisionLogo size={64} />
        <View className="gap-2 items-center">
          <Text className="text-2xl text-center" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
            Verify your identity
          </Text>
          <Text className="text-base text-center" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>
            UK regulations require identity verification before you can withdraw funds to your bank account. This is a one-time process powered by Stripe.
          </Text>
        </View>

        {user?.kycStatus === "VERIFIED" ? (
          <View className="px-6 py-3 rounded-xl" style={{ backgroundColor: "#00FF9420" }}>
            <Text style={{ color: "#00FF94", fontFamily: "SpaceGrotesk_600SemiBold" }}>✓ Identity verified</Text>
          </View>
        ) : (
          <Button
            label={user?.kycStatus === "PENDING" ? "Continue Verification" : "Verify Identity"}
            onPress={handleVerify}
            loading={startKyc.isPending}
            variant="primary"
            size="lg"
          />
        )}
      </View>
    </ScrollView>
  );
}
