import { useMutation } from "@tanstack/react-query";
import { type AxiosError } from "axios";

import { login, type LoginPayload, type LoginResponse } from "@/services/auth";
import { type ApiErrorResponse } from "@/services/api-client";
import { useAuthStore } from "@/store/auth";

export const useLogin = () => {
  const setIsAuth = useAuthStore((s) => s.setIsAuth);
  const setUser = useAuthStore((s) => s.setUser);

  const mutation = useMutation<
    LoginResponse,
    AxiosError<ApiErrorResponse>,
    LoginPayload
  >({
    mutationFn: login,
    onSuccess: (data) => {
      setIsAuth(true);
      setUser(data.data.full_name ?? data.data.email);
    },
  });

  const loginErrorMessage =
    mutation.error?.response?.data?.error_message ||
    (mutation.error
      ? "No pudimos iniciar sesión. Inténtalo nuevamente."
      : null);

  const handleLogin = async (payload: LoginPayload) => {
    mutation.reset();
    try {
      return await mutation.mutateAsync(payload);
    } catch {
      return undefined;
    }
  };

  return {
    ...mutation,
    login: handleLogin,
    loginErrorMessage,
  };
};
