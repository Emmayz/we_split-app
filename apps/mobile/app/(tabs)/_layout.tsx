import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#14141F",
          borderTopColor: "#1F1F2D",
          borderTopWidth: 1,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: "#00E5FF",
        tabBarInactiveTintColor: "#5A5A6B",
        tabBarLabelStyle: { fontFamily: "SpaceGrotesk_500Medium", fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⌂</Text> }} />
      <Tabs.Screen name="new-split" options={{ title: "Split", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>÷</Text> }} />
      <Tabs.Screen name="activity" options={{ title: "Activity", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>↗</Text> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>◎</Text> }} />
    </Tabs>
  );
}
