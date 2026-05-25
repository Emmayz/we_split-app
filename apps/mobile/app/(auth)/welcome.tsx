import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { DivisionLogo } from "../../components/ui/DivisionLogo";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-bg items-center justify-between px-6 pb-12 pt-24">
      <View className="flex-1 items-center justify-center gap-4">
        <View
          style={{
            shadowColor: "#00E5FF",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 40,
            elevation: 20,
          }}
        >
          <DivisionLogo size={80} />
        </View>
        <Text
          className="text-4xl"
          style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}
        >
          wesplit
        </Text>
        <Text
          className="text-base text-center"
          style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}
        >
          Pay once. Settle in minutes.
        </Text>
      </View>

      <View className="w-full gap-3">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          className="w-full py-4 rounded-xl items-center"
          style={{ backgroundColor: "#00E5FF" }}
          activeOpacity={0.85}
        >
          <Text style={{ color: "#0B0B14", fontFamily: "SpaceGrotesk_700Bold", fontSize: 16 }}>
            Get Started
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="w-full py-4 rounded-xl items-center border"
          style={{ borderColor: "#00E5FF" }}
          activeOpacity={0.85}
        >
          <Text style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_600SemiBold", fontSize: 16 }}>
            Log In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
