import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";

import {
  createConnection,
  type CreateConnectionPayload,
  type ConnectionResponse,
} from "@/services/connections";
import { type ApiErrorResponse } from "@/services/api-client";

export const useCreateConnection = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ConnectionResponse,
    AxiosError<ApiErrorResponse>,
    CreateConnectionPayload
  >({
    mutationFn: createConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });

  const errorMessage =
    mutation.error?.response?.data?.error_message ||
    (mutation.error
      ? "No pudimos crear la conexión. Inténtalo nuevamente."
      : null);

  const handleCreate = async (payload: CreateConnectionPayload) => {
    mutation.reset();
    try {
      return await mutation.mutateAsync(payload);
    } catch {
      return undefined;
    }
  };

  return {
    ...mutation,
    createConnection: handleCreate,
    errorMessage,
  };
};
