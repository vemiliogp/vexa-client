import { apiClient } from "./api-client";

export type LoginPayload = {
  email: string;
  password: string;
};

type UserData = {
  id: number;
  email: string;
  full_name: string | null;
};

export type LoginResponse = {
  data: UserData;
  message: string;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
};

export type RegisterPayload = {
  email: string;
  password: string;
  fullName?: string;
};

export type RegisterResponse = {
  data: UserData;
  message: string;
};

export const register = async ({ fullName, ...rest }: RegisterPayload) => {
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", {
    ...rest,
    full_name: fullName,
  });
  return data;
};
