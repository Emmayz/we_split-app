import React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useWallet } from "../../hooks/useWallet";

const schema = z.object({
  amountGbp: z.coerce.number().min(1, "Minimum withdrawal is £1"),
  stripeBankAccountId: z.string().min(1, "Bank account required"),
});

type Form = z.infer<typeof schema>;

export default function WithdrawScreen() {
  const router = useRouter();
  const { wallet, withdraw } = useWallet();
  const balance = wallet.data?.walletBalanceGbp ?? 0;

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { amountGbp: balance, stripeBankAccountId: "" },
  });

  async function onSubmit(data: Form) {
    try {
      await withdraw.mutateAsync(data);
      Alert.alert("Withdrawal initiated", "Funds will arrive within 2 hours via Faster Payments.");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="px-6 pt-16 pb-12 gap-6">
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "#8A8A9B" }}>← Back</Text>
      </TouchableOpacity>
      <Text className="text-2xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>Withdraw</Text>
      <Text style={{ color: "#8A8A9B" }}>Available: {balance.toFixed(2)}</Text>

      <Controller control={control} name="amountGbp" render={({ field: { value, onChange, onBlur } }) => (
        <Input label="Amount (£)" value={String(value)} onChangeText={onChange} onBlur={onBlur} keyboardType="decimal-pad" error={errors.amountGbp?.message} />
      )} />
      <Controller control={control} name="stripeBankAccountId" render={({ field: { value, onChange, onBlur } }) => (
        <Input label="Bank account ID" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.stripeBankAccountId?.message} />
      )} />

      <Button label="Withdraw" onPress={handleSubmit(onSubmit)} loading={withdraw.isPending} variant="primary" size="lg" />
    </ScrollView>
  );
}
