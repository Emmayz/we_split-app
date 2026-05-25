import React from "react";
import { View, ViewProps } from "react-native";

interface Props extends ViewProps {
  elevated?: boolean;
  children: React.ReactNode;
}

export function Card({ elevated = false, children, className = "", ...props }: Props) {
  return (
    <View
      className={`rounded-2xl border border-border p-4 ${elevated ? "bg-surface-elevated" : "bg-surface"} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
