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
import { validateUKPhone } from "../../utils/phone";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().refine(validateUKPhone, "Enter a valid UK phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Form = z.infer<typeof schema>;

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: Form) {
    setLoading(true);
    try {
      await register(data.name, data.email, data.phone, data.password);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/");
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Sign up failed", err.message ?? "Could not create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="px-6 py-12 gap-6">
      <View className="gap-1">
        <Text className="text-3xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
          Create account
        </Text>
        <Text className="text-base" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_400Regular" }}>
          Start splitting bills in seconds
        </Text>
      </View>

      <View className="gap-4">
        <Controller control={control} name="name" render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Full name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
        )} />
        <Controller control={control} name="email" render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Email" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
        )} />
        <Controller control={control} name="phone" render={({ field: { value, onChange, onBlur } }) => (
          <Input label="UK phone number" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="phone-pad" placeholder="+44 7700 900000" error={errors.phone?.message} />
        )} />
        <Controller control={control} name="password" render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Password" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry error={errors.password?.message} />
        )} />
      </View>

      <Button label="Create Account" onPress={handleSubmit(onSubmit)} loading={loading} variant="primary" size="lg" />

      <TouchableOpacity onPress={() => router.back()} className="items-center">
        <Text className="text-sm" style={{ color: "#8A8A9B" }}>
          Already have an account? <Text style={{ color: "#00E5FF" }}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
