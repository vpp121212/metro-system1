import { Box, Typography } from "@mui/material";

interface KpiCardProps {
  icon: string;
  value: string;
  label: string;
  trend: string;
  trendUp: boolean;
  trendIcon: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function KpiCard({ icon, value, label, trend, trendUp, trendIcon, accentColor, gradientFrom, gradientTo }: KpiCardProps) {
  return (
    <Box
      className="kpi-card"
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "rgba(13,19,33,0.88)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(30,42,66,0.6)",
        borderRadius: "12px",
        p: 2.5,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "3px",
          height: "100%",
          background: `linear-gradient(180deg, ${gradientFrom}, ${gradientTo})`,
          borderRadius: "0 2px 2px 0",
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,0,0,.3)",
        },
        transition: "all 0.3s",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: `${accentColor}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
          }}
        >
          <i className={icon} style={{ fontSize: 12 }} />
        </Box>
        <Typography
          sx={{
            fontSize: 9,
            color: trendUp ? "#4ade80" : "#f87171",
            display: "flex",
            alignItems: "center",
            gap: 0.25,
          }}
        >
          <i className={trendIcon} style={{ fontSize: 7 }} />
          {trend}
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 10, color: "#6b7280" }}>{label}</Typography>
    </Box>
  );
}
