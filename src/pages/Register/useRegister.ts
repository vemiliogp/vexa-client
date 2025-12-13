import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { type AxiosError } from "axios";

import {
  register,
  type RegisterPayload,
  type RegisterResponse,
} from "@/services/auth";
import { type ApiErrorResponse } from "@/services/api-client";

export const useRegister = () => {
  const navigate = useNavigate();

  const mutation = useMutation<
    RegisterResponse,
    AxiosError<ApiErrorResponse>,
    RegisterPayload
  >({
    mutationFn: register,
    onSuccess: () => {
      navigate("/");
    },
  });

  const registerErrorMessage =
    mutation.error?.response?.data?.error_message ||
    (mutation.error
      ? "No pudimos crear tu cuenta. Inténtalo nuevamente."
      : null);

  const handleRegister = async (payload: RegisterPayload) => {
    mutation.reset();
    try {
      return await mutation.mutateAsync(payload);
    } catch {
      return undefined;
    }
  };

  return {
    ...mutation,
    register: handleRegister,
    registerErrorMessage,
  };
};
