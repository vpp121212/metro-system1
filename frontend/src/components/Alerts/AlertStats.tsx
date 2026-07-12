import { Box, Typography } from "@mui/material";

interface AlertStatsProps {
  critical: number;
  warning: number;
  info: number;
  resolved: number;
}

export default function AlertStats({ critical, warning, info, resolved }: AlertStatsProps) {
  const stats = [
    { label: "حرج", value: critical, color: "#f87171" },
    { label: "تحذير", value: warning, color: "#facc15" },
    { label: "معلومة", value: info, color: "#60a5fa" },
    { label: "تم حله", value: resolved, color: "#4ade80" },
  ];

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 1 }}>
      {stats.map((s) => (
        <Box
          key={s.label}
          sx={{
            textAlign: "center",
            p: 2,
            background: "#141c2e",
            borderRadius: "8px",
            border: "1px solid #1e2a42",
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</Typography>
          <Typography sx={{ fontSize: 9, color: "#6b7280" }}>{s.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}
