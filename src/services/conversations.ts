import { apiClient } from "./api-client";

export type ConversationModel = "deepseek/r1" | "openai/gpt-5" | "openai/gpt-oss";

export interface CreateConversationPayload {
  model: ConversationModel;
  title?: string;
  context?: string;
  connection_id?: number;
}

export interface CreateConversationResponse {
  data: Conversation;
  message: string;
}

export const createConversation = async (payload: CreateConversationPayload) => {
  const { data } = await apiClient.post<CreateConversationResponse>("/conversation", payload);
  return data;
};

export interface Conversation {
  id: number;
  title: string | null;
  context: string;
  model: string;
  connection_id: number | null;
  created_at: string;
}

export interface ConversationsResponse {
  data: Conversation[];
  message: string;
}

export interface Message {
  id: number;
  content: {
    role: "user" | "assistant";
    content: string;
  };
  created_at: string;
}

export interface MessagesResponse {
  data: Message[];
  message: string;
}

export const getConversations = async () => {
  const { data } = await apiClient.get<ConversationsResponse>("/conversation");
  return data;
};

export const getConversationMessages = async (conversationId: string) => {
  const { data } = await apiClient.get<MessagesResponse>(
    `/conversation/${conversationId}/messages`
  );
  return data;
};

export interface AudioMessageResponse {
  url: string;
  message: string;
}

export const sendAudioMessage = async (conversationId: string, audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.mp3");

  const { data } = await apiClient.post<AudioMessageResponse>(
    `/conversation/${conversationId}/message/audio`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};
