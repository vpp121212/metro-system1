import { Box, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import type { TabKey } from "../../types";

interface SidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  alertCount: number;
  cameraCount: number;
  health: number;
  uptime: string;
}

const navItems: { key: TabKey; icon: string; label: string; showBadge?: boolean }[] = [
  { key: "dashboard", icon: "fas fa-th-large", label: "لوحة التحكم" },
  { key: "map", icon: "fas fa-map-marked-alt", label: "الخريطة المباشرة" },
  { key: "cameras", icon: "fas fa-video", label: "كاميرات المراقبة", showBadge: true },
  { key: "analytics", icon: "fas fa-chart-line", label: "التحليلات" },
  { key: "alerts", icon: "fas fa-bell", label: "التنبيهات", showBadge: true },
  { key: "simulation", icon: "fas fa-gamepad", label: "محاكاة السيناريوهات" },
  { key: "reports", icon: "fas fa-file-export", label: "التقارير" },
  { key: "settings", icon: "fas fa-cog", label: "الإعدادات" },
];

export default function Sidebar({ activeTab, onTabChange, alertCount, cameraCount, health, uptime }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const getBadge = (key: TabKey) => {
    if (key === "alerts") return alertCount;
    if (key === "cameras") return cameraCount;
    return 0;
  };

  return (
    <>
      <IconButton
        onClick={() => setMobileOpen(!mobileOpen)}
        sx={{
          display: { md: "none" },
          position: "fixed",
          top: 8,
          right: 8,
          zIndex: 60,
          width: 36,
          height: 36,
          background: "#141c2e",
          border: "1px solid #1e2a42",
          color: "#fff",
          "&:hover": { background: "#1e2a42" },
        }}
      >
        <i className="fas fa-bars" style={{ fontSize: 14 }} />
      </IconButton>

      <Box
        component="aside"
        sx={{
          position: { xs: mobileOpen ? "fixed" : "none", md: "fixed" },
          right: { xs: mobileOpen ? 0 : "-240px", md: 0 },
          top: 0,
          height: "100vh",
          width: 240,
          background: "#0d1321",
          borderLeft: "1px solid #1e2a42",
          zIndex: 50,
          transition: "right 0.3s",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #1e2a42" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(6,182,212,0.2)",
              }}
            >
              <i className="fas fa-eye" style={{ color: "#fff", fontSize: 14 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                TrainEye
              </Typography>
              <Typography sx={{ fontSize: 9, color: "#6b7280" }}>مركز قيادة مترو الرياض</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            const badge = item.showBadge ? getBadge(item.key) : 0;
            return (
              <Box
                key={item.key}
                component="button"
                onClick={() => {
                  onTabChange(item.key);
                  setMobileOpen(false);
                }}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  mb: 0.25,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "right",
                  fontSize: 13,
                  color: isActive ? "#fff" : "#9ca3af",
                  background: isActive ? "linear-gradient(135deg, #2563eb, #06b6d4)" : "transparent",
                  boxShadow: isActive ? "0 0 14px rgba(37,99,235,0.35)" : "none",
                  "&:hover": {
                    background: isActive ? "linear-gradient(135deg, #2563eb, #06b6d4)" : "#141c2e",
                    color: "#fff",
                  },
                  transition: "all 0.2s",
                }}
              >
                <i className={item.icon} style={{ width: 16, fontSize: 12 }} />
                <Box component="span" sx={{ flex: 1 }}>
                  {item.label}
                </Box>
                {badge > 0 && (
                  <Box
                    sx={{
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
                    {badge}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ p: 1.5, borderTop: "1px solid #1e2a42" }}>
          <Box
            sx={{
              background: "rgba(13,19,33,0.88)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(30,42,66,0.6)",
              borderRadius: "8px",
              p: 1.5,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={{ fontSize: 9, color: "#6b7280" }}>صحة النظام</Typography>
              <Typography sx={{ fontSize: 9, color: "#4ade80", fontWeight: 700 }}>{health.toFixed(1)}%</Typography>
            </Box>
            <Box sx={{ width: "100%", background: "#1f2937", borderRadius: "4px", height: 4 }}>
              <Box
                sx={{
                  width: `${health}%`,
                  height: 4,
                  borderRadius: "4px",
                  background: "linear-gradient(90deg, #22c55e, #34d399)",
                  transition: "width 0.5s",
                }}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.75, fontSize: 9, color: "#6b7280" }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } } }} />
            <span>متصل بالخادم</span>
            <Box sx={{ mr: "auto", color: "#6b7280" }}>{uptime}</Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
