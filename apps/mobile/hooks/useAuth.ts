import { useAuthStore } from "../stores/authStore";
import { api } from "../services/api";
import { User } from "@wesplit/shared";

export function useAuth() {
  const { user, accessToken, setAuth, logout } = useAuthStore();

  async function login(email: string, password: string): Promise<void> {
    const { data } = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = data.data;
    await setAuth(accessToken, refreshToken, user);
  }

  async function register(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<void> {
    const { data } = await api.post("/auth/register", { name, email, phone, password });
    const { accessToken, refreshToken, user } = data.data;
    await setAuth(accessToken, refreshToken, user);
  }

  async function logoutUser(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {}
    await logout();
  }

  return { user, isLoggedIn: !!accessToken, login, register, logout: logoutUser };
}
