import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { type AxiosError } from "axios";

import {
  createConversation,
  type CreateConversationPayload,
  type CreateConversationResponse,
} from "@/services/conversations";
import { type ApiErrorResponse } from "@/services/api-client";

export const useCreateConversation = () => {
  const navigate = useNavigate();

  const mutation = useMutation<
    CreateConversationResponse,
    AxiosError<ApiErrorResponse>,
    CreateConversationPayload
  >({
    mutationFn: createConversation,
    onSuccess: (response) => {
      navigate(`/conversations/${response.data.id}`);
    },
  });

  const errorMessage =
    mutation.error?.response?.data?.error_message ||
    (mutation.error ? "No pudimos crear la conversación. Inténtalo nuevamente." : null);

  const handleCreate = async (payload: CreateConversationPayload) => {
    mutation.reset();
    try {
      return await mutation.mutateAsync(payload);
    } catch {
      return undefined;
    }
  };

  return {
    ...mutation,
    createConversation: handleCreate,
    errorMessage,
  };
};
