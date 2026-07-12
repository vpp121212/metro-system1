import { useState, useMemo } from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import CameraFeed from "./CameraFeed";
import { generateCameras, lineNamesAr } from "../../utils/simulation";
import type { LineKey, CameraStatus } from "../../types";

export default function CamerasTab() {
  const allCameras = useMemo(() => generateCameras(), []);
  const [lineFilter, setLineFilter] = useState<LineKey | "all">("all");
  const [statusFilter, setStatusFilter] = useState<CameraStatus | "all">("all");

  const filtered = useMemo(() => {
    let cams = allCameras;
    if (lineFilter !== "all") cams = cams.filter((c) => c.line === lineFilter);
    if (statusFilter !== "all") cams = cams.filter((c) => c.status === statusFilter);
    return cams;
  }, [allCameras, lineFilter, statusFilter]);

  return (
    <Box sx={{ animation: "fade-in 0.4s ease-out", "@keyframes fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>كاميرات المراقبة المباشرة</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, borderRadius: "6px", background: "rgba(22,163,74,0.15)", color: "#4ade80", fontSize: 9, border: "1px solid rgba(22,163,74,0.25)" }}>
            <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } } }} />
            {filtered.length} كاميرا نشطة
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={lineFilter}
              onChange={(e) => setLineFilter(e.target.value as LineKey | "all")}
              sx={{
                fontSize: 11,
                color: "#fff",
                background: "#141c2e",
                border: "1px solid #1e2a42",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSvgIcon-root": { color: "#94a3b8" },
              }}
            >
              <MenuItem value="all">كل الخطوط</MenuItem>
              {(Object.keys(lineNamesAr) as LineKey[]).map((k) => (
                <MenuItem key={k} value={k}>{lineNamesAr[k]}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CameraStatus | "all")}
              sx={{
                fontSize: 11,
                color: "#fff",
                background: "#141c2e",
                border: "1px solid #1e2a42",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSvgIcon-root": { color: "#94a3b8" },
              }}
            >
              <MenuItem value="all">كل الحالات</MenuItem>
              <MenuItem value="active">نشطة</MenuItem>
              <MenuItem value="warning">تحذير</MenuItem>
              <MenuItem value="offline">غير متصلة</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }, gap: 1.5 }}>
        {filtered.map((cam) => (
          <Box
            key={cam.id}
            sx={{
              background: "rgba(13,19,33,0.88)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(30,42,66,0.6)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <CameraFeed cam={cam} />
            <Box sx={{ p: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: 9, color: "#6b7280" }}>كاميرا</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box component="button" sx={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", "&:hover": { color: "#fff" } }}>
                  <i className="fas fa-expand" style={{ fontSize: 12 }} />
                </Box>
                <Box component="button" sx={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", "&:hover": { color: "#fff" } }}>
                  <i className="fas fa-camera" style={{ fontSize: 12 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
