import { useQuery } from "@tanstack/react-query";
import { kpiApi } from "../api/kpi";

export function useKpi() {
  return useQuery({
    queryKey: ["kpi"],
    queryFn: kpiApi.get,
    refetchInterval: 60_000,
  });
}
