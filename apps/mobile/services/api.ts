import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { ApiError } from "@wesplit/shared";

let _getToken: () => string | null = () => null;
let _getRefreshToken: () => string | null = () => null;
let _setAuth: (access: string, refresh: string, user: any) => void = () => {};
let _logout: () => void = () => {};

export function configureApiAuth(opts: {
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  setAuth: (access: string, refresh: string, user: any) => void;
  logout: () => void;
}) {
  _getToken = opts.getToken;
  _getRefreshToken = opts.getRefreshToken;
  _setAuth = opts.setAuth;
  _logout = opts.logout;
}

const baseURL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:3000";

export const api: AxiosInstance = axios.create({ baseURL });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = _getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      const data = error.response?.data as Partial<ApiError> | undefined;
      return Promise.reject({
        message: data?.message ?? "An error occurred",
        code: data?.code ?? "UNKNOWN_ERROR",
        statusCode: error.response?.status ?? 0,
      } satisfies ApiError);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = _getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      _logout();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefresh } = data.data;
      _setAuth(accessToken, newRefresh, null);
      processQueue(null, accessToken);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      _logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
