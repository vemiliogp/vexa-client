import { apiClient } from "./api-client";

export type ConnectionStatus = "active" | "standby" | "inactive";

export interface Connection {
  id: number;
  name: string;
  description: string;
  engine: string;
  status?: ConnectionStatus;
}

export interface CreateConnectionPayload {
  name: string;
  description: string;
  engine: string;
  url: string;
}

export interface ConnectionResponse {
  data: Connection;
}

export interface ConnectionsResponse {
  data: Connection[];
}

export const createConnection = async (payload: CreateConnectionPayload) => {
  const { data } = await apiClient.post<ConnectionResponse>(
    "/connection",
    payload,
  );
  return data;
};

export const getConnections = async () => {
  const { data } = await apiClient.get<ConnectionsResponse>("/connection");
  return data;
};

export const deleteConnection = async (id: number) => {
  const { data } = await apiClient.delete(`/connection/${id}`);
  return data;
};

export interface CheckConnectionPayload {
  url: string;
}

export interface CheckConnectionResponse {
  success: boolean;
  message: string;
}

export const checkConnection = async (payload: CheckConnectionPayload) => {
  const { data } = await apiClient.post<CheckConnectionResponse>(
    "/connection/check",
    payload,
  );
  return data;
};
