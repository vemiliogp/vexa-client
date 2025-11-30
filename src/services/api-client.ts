import axios from "axios";

export type ApiErrorResponse = {
  message?: string;
  detail?: string;
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
