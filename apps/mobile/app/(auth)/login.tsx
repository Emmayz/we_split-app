import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password required"),
});

type Form = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: Form) {
    setLoading(true);
    try {
      await login(data.email, data.password);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/");
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Login failed", err.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="flex-1 px-6 py-12 justify-center gap-6">
      <View className="gap-1">
        <Text className="text-3xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
          Welcome back
        </Text>
        <Text className="text-base" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>
          Log in to your account
        </Text>
      </View>

      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />
      </View>

      <Button
        label="Log In"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        variant="primary"
        size="lg"
      />

      <TouchableOpacity className="items-center">
        <Text className="text-sm" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>
          Forgot password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/signup")} className="items-center">
        <Text className="text-sm" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>
          Don't have an account?{" "}
          <Text style={{ color: "#00E5FF" }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
