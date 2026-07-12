import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { linesData } from "../../utils/simulation";
import type { LineKey } from "../../types";

interface LineStatusItem {
  key: LineKey;
  status: "normal" | "delayed" | "issue";
  trainCount: number;
  passengerCount: number;
}

const statusConfig = {
  normal: { c: "#4ade80", bg: "rgba(22,163,74,0.15)", border: "rgba(22,163,74,0.25)", t: "يعمل بكفاءة", i: "fa-check-circle" },
  delayed: { c: "#facc15", bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.25)", t: "تأخيرات طفيفة", i: "fa-clock" },
  issue: { c: "#f87171", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.25)", t: "يوجد مشكلة", i: "fa-exclamation-circle" },
};

function generateRandomStatus(): LineStatusItem[] {
  return (Object.keys(linesData) as LineKey[]).map((k) => {
    const rand = Math.random();
    const status = rand > 0.95 ? "issue" : rand > 0.8 ? "delayed" : "normal";
    return {
      key: k,
      status,
      trainCount: Math.floor(8 + Math.random() * 6),
      passengerCount: Math.floor(3000 + Math.random() * 4000),
    };
  });
}

export default function LineStatusList() {
  const [lines, setLines] = useState<LineStatusItem[]>(generateRandomStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines(generateRandomStatus());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      {lines.map((item) => {
        const line = linesData[item.key];
        const cfg = statusConfig[item.status];
        return (
          <Box
            key={item.key}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              mb: 0.75,
              borderRadius: "8px",
              background: "#141c2e",
              border: `1px solid ${cfg.border}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: line.color,
                  boxShadow: `0 0 6px ${line.color}`,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{line.name}</Typography>
                <Typography sx={{ fontSize: 9, color: "#6b7280" }}>
                  {line.stations.length} محطة • {item.trainCount} قطار
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography sx={{ fontSize: 9, color: "#6b7280" }}>
                {item.passengerCount.toLocaleString("ar-SA")} راكب/س
              </Typography>
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: "4px",
                  background: cfg.bg,
                  color: cfg.c,
                  fontSize: 9,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                <i className={`fas ${cfg.i}`} style={{ fontSize: 7 }} />
                {cfg.t}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
