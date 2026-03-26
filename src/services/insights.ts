import { apiClient } from "./api-client";

export interface Insight {
  id: number;
  title: string;
  description: string;
  created_at: string | null;
  connection_id: number | null;
  connection_name: string | null;
}

export interface InsightsResponse {
  data: Insight[];
  message: string;
}

export const getInsights = async () => {
  const { data } = await apiClient.get<InsightsResponse>("/insight");
  return data;
};

export interface CreateInsightsPayload {
  count: number;
  connection_id?: number;
  delivery_method?: "email" | "in_app";
}

export interface CreateInsightsResponse {
  message: string;
}

export const createInsights = async (payload: CreateInsightsPayload) => {
  const { data } = await apiClient.post<CreateInsightsResponse>("/insight", payload);
  return data;
};
