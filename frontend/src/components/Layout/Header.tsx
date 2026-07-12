import { Box, Typography, IconButton } from "@mui/material";
import { useClock } from "../../hooks/useClock";
import Notifications from "./Notifications";
import type { Alert } from "../../types";

interface HeaderProps {
  pageTitle: string;
  alertCount: number;
  onNotifications: () => void;
  showNotifications: boolean;
  onClearNotifications: () => void;
  alerts: Alert[];
  onAlertClick: (id: number) => void;
}

const pageTitles: Record<string, string> = {
  dashboard: "لوحة التحكم",
  map: "الخريطة المباشرة",
  cameras: "كاميرات المراقبة",
  analytics: "التحليلات",
  alerts: "التنبيهات الذكية",
  simulation: "محاكاة السيناريوهات",
  reports: "التقارير والتصدير",
  settings: "الإعدادات",
};

export default function Header({
  pageTitle,
  alertCount,
  onNotifications,
  showNotifications,
  onClearNotifications,
  alerts,
  onAlertClick,
}: HeaderProps) {
  const clock = useClock();

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(13,19,33,0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(30,42,66,0.6)",
          px: 2.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
            {pageTitles[pageTitle] || pageTitle}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1,
              py: 0.25,
              borderRadius: "20px",
              background: "rgba(22,163,74,0.15)",
              color: "#4ade80",
              fontSize: 9,
              border: "1px solid rgba(22,163,74,0.25)",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } },
              }}
            />
            مباشر
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              background: "#141c2e",
              border: "1px solid #1e2a42",
            }}
          >
            <i className="fas fa-clock" style={{ color: "#06b6d4", fontSize: 12 }} />
            <Typography sx={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8" }}>
              {clock}
            </Typography>
          </Box>

          <Box
            component="button"
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              background: "#141c2e",
              border: "1px solid #1e2a42",
              color: "#94a3b8",
              fontSize: 10,
              cursor: "pointer",
              "&:hover": { color: "#fff" },
            }}
          >
            EN
          </Box>

          <IconButton
            onClick={onNotifications}
            sx={{
              position: "relative",
              p: 0.75,
              borderRadius: "8px",
              background: "#141c2e",
              border: "1px solid #1e2a42",
              color: "#94a3b8",
              "&:hover": { color: "#fff" },
            }}
          >
            <i className="fas fa-bell" style={{ fontSize: 14 }} />
            {alertCount > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  minWidth: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {alertCount}
              </Box>
            )}
          </IconButton>

          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #9333ea)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            OP
          </Box>
        </Box>
      </Box>

      {showNotifications && (
        <Notifications
          alerts={alerts}
          onClear={onClearNotifications}
          onAlertClick={onAlertClick}
        />
      )}
    </>
  );
}
