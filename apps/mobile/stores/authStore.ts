import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "@wesplit/shared";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: true,

  setAuth: async (accessToken, refreshToken, user) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    set({ accessToken, refreshToken, user });
  },

  setUser: async (user) => {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    set({ user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
    set({ accessToken: null, refreshToken: null, user: null });
  },

  loadFromStorage: async () => {
    const [accessToken, refreshToken, userJson] = await Promise.all([
      SecureStore.getItemAsync("accessToken"),
      SecureStore.getItemAsync("refreshToken"),
      SecureStore.getItemAsync("user"),
    ]);
    const user = userJson ? (JSON.parse(userJson) as User) : null;
    set({ accessToken, refreshToken, user, isLoading: false });
  },
}));
