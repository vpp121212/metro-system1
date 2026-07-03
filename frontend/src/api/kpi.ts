import { api } from "./client";
import type { KPIResponse } from "../types";

export const kpiApi = {
  get: () => api.get<KPIResponse>("/kpi"),
};
