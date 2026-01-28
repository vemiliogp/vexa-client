import axios from "axios";

export interface ApiErrorResponse {
  error_message?: string;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
