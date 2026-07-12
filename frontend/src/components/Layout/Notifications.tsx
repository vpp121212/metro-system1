import { Box, Typography, Button } from "@mui/material";
import type { Alert } from "../../types";

interface NotificationsProps {
  alerts: Alert[];
  onClear: () => void;
  onAlertClick: (id: number) => void;
}

const borderColors = {
  critical: "rgba(239,68,68,0.25)",
  warning: "rgba(234,179,8,0.25)",
  info: "rgba(37,99,235,0.25)",
};

export default function Notifications({ alerts, onClear, onAlertClick }: NotificationsProps) {
  const active = alerts.filter((a) => !a.acknowledged);

  return (
    <Box
      sx={{
        position: "fixed",
        left: 16,
        top: 56,
        width: 288,
        background: "rgba(13,19,33,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(30,42,66,0.6)",
        borderRadius: "12px",
        zIndex: 40,
        animation: "slide-in 0.3s ease-out",
        "@keyframes slide-in": {
          from: { transform: "translateX(-100%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
      }}
    >
      <Box sx={{ p: 1.5, borderBottom: "1px solid #1e2a42", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>الإشعارات</Typography>
        <Button onClick={onClear} sx={{ fontSize: 9, color: "#06b6d4", textTransform: "none", minWidth: "auto", p: 0 }}>
          مسح الكل
        </Button>
      </Box>
      <Box sx={{ maxHeight: 256, overflow: "auto", p: 1 }}>
        {active.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "#4b5563", fontSize: 11, py: 1.5 }}>
            لا توجد إشعارات جديدة
          </Typography>
        ) : (
          active.map((a) => (
            <Box
              key={a.id}
              onClick={() => {
                onAlertClick(a.id);
              }}
              sx={{
                p: 1,
                mb: 0.75,
                borderRadius: "8px",
                background: "#141c2e",
                border: `1px solid ${borderColors[a.type]}`,
                cursor: "pointer",
                "&:hover": { background: "#1e2a42" },
                transition: "background 0.2s",
              }}
            >
              <Typography sx={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{a.title}</Typography>
              <Typography sx={{ fontSize: 9, color: "#9ca3af", mt: 0.25 }}>{a.desc}</Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
