import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StripeProvider } from "@stripe/stripe-react-native";
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { useAuthStore } from "../stores/authStore";
import { configureApiAuth } from "../services/api";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_placeholder";
const MERCHANT_ID = process.env.EXPO_PUBLIC_STRIPE_MERCHANT_ID ?? "merchant.co.wesplit";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  const { accessToken, refreshToken, setAuth, logout, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    configureApiAuth({
      getToken: () => accessToken,
      getRefreshToken: () => refreshToken,
      setAuth: (at, rt, u) => { if (u) setAuth(at, rt, u); },
      logout,
    });
  }, [accessToken, refreshToken]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider publishableKey={STRIPE_KEY} merchantIdentifier={MERCHANT_ID}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0B0B14" } }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="split/[id]" />
          <Stack.Screen name="split/receipt" />
          <Stack.Screen name="split/share" />
          <Stack.Screen name="wallet/index" />
          <Stack.Screen name="wallet/withdraw" />
          <Stack.Screen name="wallet/kyc" />
        </Stack>
      </StripeProvider>
    </QueryClientProvider>
  );
}
