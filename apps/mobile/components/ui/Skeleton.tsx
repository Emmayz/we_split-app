import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate } from "react-native-reanimated";

interface Props {
  width?: number | string;
  height?: number;
  className?: string;
}

export function Skeleton({ width = "100%", height = 16, className = "" }: Props) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius: 8, backgroundColor: "#1C1C2A" }, animStyle]}
      className={className}
    />
  );
}
