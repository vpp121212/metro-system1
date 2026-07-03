import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { incidentsApi } from "../api/incidents";

export function useIncidentList() {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: incidentsApi.list,
  });
}

export function useIncident(id: number | null) {
  return useQuery({
    queryKey: ["incidents", id],
    queryFn: () => incidentsApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => incidentsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incidents"] }),
  });
}

export function useUpdateIncident(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => incidentsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incidents"] }),
  });
}

export function useDeleteIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => incidentsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incidents"] }),
  });
}
