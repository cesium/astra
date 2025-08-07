import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false,
});

export const apiWithCredentials = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await apiWithCredentials.post("/auth/refresh");
        const { access_token } = res.data;

        useAuthStore.getState().setToken(access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return axios(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().setToken(undefined);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
