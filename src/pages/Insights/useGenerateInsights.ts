import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";

import { createInsights, type CreateInsightsPayload, type CreateInsightsResponse } from "@/services/insights";
import { type ApiErrorResponse } from "@/services/api-client";

export const useGenerateInsights = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateInsightsResponse,
    AxiosError<ApiErrorResponse>,
    CreateInsightsPayload
  >({
    mutationFn: createInsights,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });

  const errorMessage =
    mutation.error?.response?.data?.error_message ||
    (mutation.error ? "No se pudieron generar los insights." : null);

  const handleGenerate = async (payload: CreateInsightsPayload) => {
    mutation.reset();
    try {
      return await mutation.mutateAsync(payload);
    } catch {
      return undefined;
    }
  };

  return {
    generate: handleGenerate,
    isPending: mutation.isPending,
    errorMessage,
  };
};
