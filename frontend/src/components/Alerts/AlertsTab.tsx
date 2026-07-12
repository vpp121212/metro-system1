import { useState } from "react";
import { Box, Typography } from "@mui/material";
import AlertCard from "./AlertCard";
import AlertStats from "./AlertStats";
import type { Alert } from "../../types";

interface AlertsTabProps {
  alerts: Alert[];
  onAcknowledge: (id: number) => void;
  alertStats: { critical: number; warning: number; info: number; resolved: number };
}

const filterButtons: { key: string; label: string; color: string; icon?: string }[] = [
  { key: "all", label: "الكل", color: "#fff" },
  { key: "critical", label: "حرج", color: "#f87171", icon: "fa-exclamation-circle" },
  { key: "warning", label: "تحذير", color: "#facc15", icon: "fa-exclamation-triangle" },
  { key: "info", label: "معلومة", color: "#60a5fa", icon: "fa-info-circle" },
];

export default function AlertsTab({ alerts, onAcknowledge, alertStats }: AlertsTabProps) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);
  const activeCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <Box sx={{ animation: "fade-in 0.4s ease-out", "@keyframes fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>مركز التنبيهات الذكي</Typography>
          <Box sx={{ px: 1, py: 0.25, borderRadius: "6px", background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: 9, border: "1px solid rgba(239,68,68,0.25)" }}>
            {activeCount} تنبيهات نشطة
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {filterButtons.map((f) => (
            <Box
              key={f.key}
              component="button"
              onClick={() => setFilter(f.key)}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                background: "#141c2e",
                border: "1px solid #1e2a42",
                color: f.color,
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": { background: f.color + "15" },
              }}
            >
              {f.icon && <i className={`fas ${f.icon}`} style={{ fontSize: 10 }} />}
              {f.label}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {filtered.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onAcknowledge={onAcknowledge} onDetails={(id) => { void id; }} />
        ))}
      </Box>

      <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5, mt: 2 }}>
        <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2 }}>إحصائيات التنبيهات</Typography>
        <AlertStats {...alertStats} />
      </Box>
    </Box>
  );
}
