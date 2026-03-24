import axios from "axios";
import { useAuthStore } from "@/store/auth";

export interface ApiErrorResponse {
  error_message?: string;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().setIsAuth(false);
    }
    return Promise.reject(error);
  }
);
