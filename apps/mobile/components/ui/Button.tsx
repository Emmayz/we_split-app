import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<Size, { btn: string; text: string }> = {
  sm: { btn: "px-4 py-2 rounded-lg", text: "text-sm" },
  md: { btn: "px-6 py-3 rounded-xl", text: "text-base" },
  lg: { btn: "px-8 py-4 rounded-xl", text: "text-lg" },
};

const variantClasses: Record<Variant, { btn: string; text: string }> = {
  primary: { btn: "bg-accent border border-accent", text: "text-bg font-bold" },
  outline: { btn: "bg-transparent border border-accent", text: "text-[#F0EEE7] font-semibold" },
  ghost: { btn: "bg-transparent border border-transparent", text: "text-[#8A8A9B]" },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
}: Props) {
  const v = variantClasses[variant];
  const s = sizeClasses[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`${v.btn} ${s.btn} items-center justify-center flex-row gap-2 ${isDisabled ? "opacity-50" : ""} ${className}`}
      activeOpacity={0.8}
    >
      {loading && <ActivityIndicator size="small" color={variant === "primary" ? "#0B0B14" : "#00E5FF"} />}
      <Text className={`${v.text} ${s.text} font-medium`}>{label}</Text>
    </TouchableOpacity>
  );
}
