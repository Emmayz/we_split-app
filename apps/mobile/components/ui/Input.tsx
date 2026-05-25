import React, { useState } from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1">
      {label && (
        <Text className="text-sm font-medium" style={{ color: "#8A8A9B", fontFamily: "SpaceGrotesk_500Medium" }}>
          {label}
        </Text>
      )}
      <TextInput
        className={`rounded-xl px-4 py-3 text-base ${className}`}
        style={{
          backgroundColor: "#14141F",
          borderWidth: 1,
          borderColor: error ? "#FF4D6D" : focused ? "#00E5FF" : "#1F1F2D",
          color: "#F0EEE7",
          fontFamily: "SpaceGrotesk_400Regular",
        }}
        placeholderTextColor="#5A5A6B"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && (
        <Text className="text-xs" style={{ color: "#FF4D6D", fontFamily: "SpaceGrotesk_400Regular" }}>
          {error}
        </Text>
      )}
    </View>
  );
}
