import { api } from "./client";
import type { IncidentDetail, IncidentListItem } from "../types";

export const incidentsApi = {
  list: () => api.get<IncidentListItem[]>("/incidents"),
  get: (id: number) => api.get<IncidentDetail>(`/incidents/${id}`),
  create: (data: unknown) => api.post<IncidentDetail>("/incidents", data),
  update: (id: number, data: unknown) => api.put<IncidentDetail>(`/incidents/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/incidents/${id}`),
  reportUrl: (id: number) => `/api/incidents/${id}/report`,
};
