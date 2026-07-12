import { Box, Typography } from "@mui/material";
import type { Alert } from "../../types";

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: number) => void;
  onDetails: (id: number) => void;
}

const typeConfig = {
  critical: { border: "rgba(239,68,68,0.4)", bg: "rgba(239,68,68,0.08)", icon: "fa-exclamation-circle", color: "#f87171" },
  warning: { border: "rgba(234,179,8,0.4)", bg: "rgba(234,179,8,0.08)", icon: "fa-exclamation-triangle", color: "#facc15" },
  info: { border: "rgba(37,99,235,0.4)", bg: "rgba(37,99,235,0.08)", icon: "fa-info-circle", color: "#60a5fa" },
};

export default function AlertCard({ alert, onAcknowledge, onDetails }: AlertCardProps) {
  const cfg = typeConfig[alert.type];

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: "8px",
        border: `1px solid ${cfg.border}`,
        background: cfg.bg,
        opacity: alert.acknowledged ? 0.5 : 1,
        animation: "fade-in 0.4s ease-out",
        "@keyframes fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <i className={`fas ${cfg.icon}`} style={{ color: cfg.color, fontSize: 14, marginTop: 2 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 12 }}>{alert.title}</Typography>
            <Typography sx={{ fontSize: 9, color: "#94a3b8", mt: 0.25 }}>{alert.desc}</Typography>
            <Typography sx={{ fontSize: 8, color: "#4b5563", mt: 0.5 }}>{alert.time}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {!alert.acknowledged && (
            <Box
              component="button"
              onClick={() => onAcknowledge(alert.id)}
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: "4px",
                background: "#141c2e",
                border: "1px solid #1e2a42",
                color: "#fff",
                fontSize: 9,
                cursor: "pointer",
                "&:hover": { background: "#1e2a42" },
              }}
            >
              إقرار
            </Box>
          )}
          {alert.acknowledged && (
            <Typography sx={{ fontSize: 9, color: "#4ade80" }}>
              <i className="fas fa-check" /> تم
            </Typography>
          )}
          <Box
            component="button"
            onClick={() => onDetails(alert.id)}
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: "4px",
              background: "#141c2e",
              border: "1px solid #1e2a42",
              color: "#06b6d4",
              fontSize: 9,
              cursor: "pointer",
              "&:hover": { background: "#1e2a42" },
            }}
          >
            تفاصيل
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
