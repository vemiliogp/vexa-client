import { apiClient } from "./api-client";

export interface Insight {
  id: number;
  title: string;
  description: string;
}

export interface InsightsResponse {
  data: Insight[];
  message: string;
}

export const getInsights = async () => {
  const { data } = await apiClient.get<InsightsResponse>("/insight");
  return data;
};
