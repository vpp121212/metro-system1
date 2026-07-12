import { Box, Typography } from "@mui/material";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { performanceData } from "../../utils/simulation";

export default function PerformanceChart() {
  return (
    <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
      <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2 }}>
        أداء الخطوط (الساعة الأخيرة)
      </Typography>
      <Box sx={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={performanceData}>
            <PolarGrid stroke="#1e2a42" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fill: "#4b5563", fontSize: 9 }} />
            <Radar name="الأداء" dataKey="A" stroke="#06b6d4" fill="rgba(6,182,212,.15)" fillOpacity={1} />
            <Radar name="الهدف" dataKey="B" stroke="#16a34a" fill="rgba(22,163,74,.08)" fillOpacity={1} strokeWidth={1.5} />
            <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
            <Tooltip contentStyle={{ background: "#141c2e", border: "1px solid #1e2a42", borderRadius: 8, fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
