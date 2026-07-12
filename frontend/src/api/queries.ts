import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { KpiData, Alert } from "../types";

export function useKpiQuery() {
  return useQuery<KpiData>({
    queryKey: ["kpi"],
    queryFn: async () => {
      const { data } = await apiClient.get("/kpi");
      return data;
    },
    enabled: false,
  });
}

export function useAlertsQuery() {
  return useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data } = await apiClient.get("/alerts");
      return data;
    },
    enabled: false,
  });
}
