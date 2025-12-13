import { useMutation } from "@tanstack/react-query";
import { type AxiosError } from "axios";

import { login, type LoginPayload, type LoginResponse } from "@/services/auth";
import { type ApiErrorResponse } from "@/services/api-client";

export const useLogin = () => {
  const mutation = useMutation<
    LoginResponse,
    AxiosError<ApiErrorResponse>,
    LoginPayload
  >({
    mutationFn: login,
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
