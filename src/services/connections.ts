import { apiClient } from "./api-client";

export type Connection = {
  id: number;
  name: string;
  description: string;
  engine: string;
};

export type CreateConnectionPayload = {
  name: string;
  description: string;
  engine: string;
  url: string;
};

export type ConnectionResponse = {
  data: Connection;
};

export type ConnectionsResponse = {
  data: Connection[];
};

export const createConnection = async (payload: CreateConnectionPayload) => {
  const { data } = await apiClient.post<ConnectionResponse>("/connection", payload);
  return data;
};

export const getConnections = async () => {
  const { data } = await apiClient.get<ConnectionsResponse>("/connection");
  return data;
};
