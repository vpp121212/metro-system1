import { Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const pieData = [
  { name: "أزرق", value: 35 },
  { name: "أحمر", value: 22 },
  { name: "برتقالي", value: 18 },
  { name: "أصفر", value: 10 },
  { name: "أخضر", value: 9 },
  { name: "بنفسجي", value: 6 },
];
const pieColors = ["#2563eb", "#dc2626", "#ea580c", "#eab308", "#16a34a", "#9333ea"];

export default function DistributionChart() {
  return (
    <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>توزيع الركاب حسب الخط</Typography>
      </Box>
      <Box sx={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
              {pieData.map((_, index) => (
                <Cell key={index} fill={pieColors[index]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
            <Tooltip contentStyle={{ background: "#141c2e", border: "1px solid #1e2a42", borderRadius: 8, fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
