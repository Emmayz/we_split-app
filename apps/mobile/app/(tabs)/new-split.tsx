import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useSplits } from "../../hooks/useSplits";
import { useSplitStore } from "../../stores/splitStore";

const memberSchema = z.object({
  guestName: z.string().min(1, "Name required"),
  guestContact: z.string().min(1, "Contact required"),
  contactType: z.enum(["PHONE", "EMAIL"]),
});

const schema = z.object({
  name: z.string().min(1, "Split name required"),
  totalGbp: z.coerce.number().positive("Must be a positive amount"),
  members: z.array(memberSchema).min(1, "Add at least one person"),
  splitType: z.enum(["EVEN", "ITEMISED"]),
});

type Form = z.infer<typeof schema>;

export default function NewSplitScreen() {
  const router = useRouter();
  const { createSplit } = useSplits();
  const setActiveSplit = useSplitStore((s) => s.setActiveSplit);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      totalGbp: 0,
      members: [{ guestName: "", guestContact: "", contactType: "PHONE" }],
      splitType: "EVEN",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "members" });
  const splitType = watch("splitType");

  async function onSubmit(data: Form) {
    try {
      const split = await createSplit.mutateAsync(data);
      setActiveSplit(split);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push("/split/share");
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", err.message ?? "Failed to create split");
    }
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="px-6 pt-16 pb-12 gap-6">
      <Text className="text-2xl" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_700Bold" }}>
        New Split
      </Text>

      <View className="flex-row gap-3">
        <TouchableOpacity className="flex-1 p-4 rounded-xl border border-border bg-surface items-center gap-2">
          <Text style={{ fontSize: 28 }}>📷</Text>
          <Text className="text-sm font-medium" style={{ color: "#00E5FF", fontFamily: "SpaceGrotesk_500Medium" }}>Scan Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 p-4 rounded-xl border border-border bg-surface items-center gap-2">
          <Text style={{ fontSize: 28 }}>⌨️</Text>
          <Text className="text-sm font-medium" style={{ color: "#00E5FF", fontFamily: "SpaceGrotesk_500Medium" }}>Enter Manually</Text>
        </TouchableOpacity>
      </View>

      <Controller control={control} name="name" render={({ field: { value, onChange, onBlur } }) => (
        <Input label="Split name" value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Friday dinner" error={errors.name?.message} />
      )} />

      <Controller control={control} name="totalGbp" render={({ field: { value, onChange, onBlur } }) => (
        <Input label="Total amount (£)" value={value ? String(value) : ""} onChangeText={onChange} onBlur={onBlur} keyboardType="decimal-pad" placeholder="0.00" error={errors.totalGbp?.message} />
      )} />

      <View className="gap-3">
        <Text className="text-base font-semibold" style={{ color: "#F0EEE7", fontFamily: "SpaceGrotesk_600SemiBold" }}>
          Add People
        </Text>
        {fields.map((field, index) => (
          <View key={field.id} className="bg-surface border border-border rounded-xl p-4 gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium" style={{ color: "#8A8A9B" }}>Person {index + 1}</Text>
              {fields.length > 1 && (
                <TouchableOpacity onPress={() => remove(index)}>
                  <Text style={{ color: "#FF4D6D" }}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
            <Controller control={control} name={`members.${index}.guestName`} render={({ field: { value, onChange, onBlur } }) => (
              <Input placeholder="Name" value={value} onChangeText={onChange} onBlur={onBlur} />
            )} />
            <Controller control={control} name={`members.${index}.guestContact`} render={({ field: { value, onChange, onBlur } }) => (
              <Input placeholder="Phone or email" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" autoCapitalize="none" />
            )} />
            <View className="flex-row gap-2">
              {(["PHONE", "EMAIL"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setValue(`members.${index}.contactType`, type)}
                  className="px-3 py-1.5 rounded-lg border"
                  style={{ borderColor: watch(`members.${index}.contactType`) === type ? "#00E5FF" : "#1F1F2D" }}
                >
                  <Text style={{ color: watch(`members.${index}.contactType`) === type ? "#00E5FF" : "#8A8A9B", fontSize: 12 }}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => append({ guestName: "", guestContact: "", contactType: "PHONE" })}
          className="py-3 rounded-xl border border-dashed border-border items-center"
        >
          <Text style={{ color: "#00E5FF", fontFamily: "SpaceGrotesk_500Medium" }}>+ Add Person</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-2">
        {(["EVEN", "ITEMISED"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setValue("splitType", type)}
            className="flex-1 py-3 rounded-xl border items-center"
            style={{ borderColor: splitType === type ? "#00E5FF" : "#1F1F2D", backgroundColor: splitType === type ? "#00E5FF20" : "transparent" }}
          >
            <Text style={{ color: splitType === type ? "#00E5FF" : "#8A8A9B", fontFamily: "SpaceGrotesk_500Medium" }}>
              {type === "EVEN" ? "Split Evenly" : "Assign Items"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button label="Create Split" onPress={handleSubmit(onSubmit)} loading={createSplit.isPending} variant="primary" size="lg" />
    </ScrollView>
  );
}
