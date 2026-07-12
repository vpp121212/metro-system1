import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import KpiCard from "./KpiCard";
import LineStatusList from "./LineStatusList";
import type { Alert } from "../../types";
import { randomInRange, randomDecimal } from "../../utils/formatters";

const pieData = [
  { name: "أزرق", value: 35 },
  { name: "أحمر", value: 22 },
  { name: "برتقالي", value: 18 },
  { name: "أصفر", value: 10 },
  { name: "أخضر", value: 9 },
  { name: "بنفسجي", value: 6 },
];
const pieColors = ["#2563eb", "#dc2626", "#ea580c", "#eab308", "#16a34a", "#9333ea"];

const basePassengerData = [
  { time: "00:00", value: 5000 },
  { time: "03:00", value: 2000 },
  { time: "06:00", value: 15000 },
  { time: "09:00", value: 35000 },
  { time: "12:00", value: 22000 },
  { time: "15:00", value: 28000 },
  { time: "18:00", value: 42000 },
  { time: "21:00", value: 18000 },
];

interface DashboardTabProps {
  alerts: Alert[];
  onSwitchTab: (tab: string) => void;
}

export default function DashboardTab({ alerts, onSwitchTab }: DashboardTabProps) {
  const [trains, setTrains] = useState(84);
  const [passengers, setPassengers] = useState(24583);
  const [delay, setDelay] = useState(3.2);
  const [safety, setSafety] = useState(99.8);
  const [passengerData, setPassengerData] = useState(basePassengerData);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(randomInRange(80, 90));
      setPassengers(randomInRange(22000, 28000));
      setDelay(randomDecimal(2.5, 4.5, 1));
      setSafety(randomDecimal(99.5, 99.9, 1));
      setPassengerData((prev) =>
        prev.map((d) => ({ ...d, value: d.value + randomInRange(-1000, 1000) }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const recentAlerts = alerts.filter((a) => !a.acknowledged).slice(0, 3);

  const borderColors = {
    critical: "rgba(239,68,68,0.25)",
    warning: "rgba(234,179,8,0.25)",
    info: "rgba(37,99,235,0.25)",
  };

  return (
    <Box sx={{ animation: "fade-in 0.4s ease-out", "@keyframes fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 1.5, mb: 1.5 }}>
        <KpiCard icon="fas fa-train" value={String(trains)} label="قطار نشط" trend="2.4%" trendUp trendIcon="fas fa-arrow-up" accentColor="#2563eb" gradientFrom="#2563eb" gradientTo="#06b6d4" />
        <KpiCard icon="fas fa-users" value={passengers.toLocaleString("ar-SA")} label="راكب / الساعة" trend="12.1%" trendUp trendIcon="fas fa-arrow-up" accentColor="#16a34a" gradientFrom="#16a34a" gradientTo="#22d3ee" />
        <KpiCard icon="fas fa-clock" value={`${delay}%`} label="معدل التأخير" trend="1.2%" trendUp={false} trendIcon="fas fa-arrow-up" accentColor="#eab308" gradientFrom="#eab308" gradientTo="#f97316" />
        <KpiCard icon="fas fa-shield-alt" value={`${safety}%`} label="مؤشر السلامة" trend="جيد" trendUp trendIcon="fas fa-check" accentColor="#9333ea" gradientFrom="#9333ea" gradientTo="#ec4899" />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { lg: "2fr 1fr" }, gap: 1.5, mb: 1.5 }}>
        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4" }} />
              حالة الخطوط
            </Typography>
            <Typography sx={{ fontSize: 9, color: "#4b5563" }}>محدث لحظياً</Typography>
          </Box>
          <LineStatusList />
        </Box>

        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#eab308" }} />
              آخر التنبيهات
            </Typography>
            <Box
              component="button"
              onClick={() => onSwitchTab("alerts")}
              sx={{
                background: "none",
                border: "none",
                color: "#06b6d4",
                fontSize: 9,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              عرض الكل
            </Box>
          </Box>
          <Box sx={{ maxHeight: 224, overflow: "auto" }}>
            {recentAlerts.map((a) => (
              <Box
                key={a.id}
                sx={{
                  p: 1,
                  mb: 0.75,
                  borderRadius: "8px",
                  background: "#141c2e",
                  border: `1px solid ${borderColors[a.type]}`,
                  fontSize: 9,
                }}
              >
                <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 10 }}>{a.title}</Typography>
                <Typography sx={{ color: "#6b7280", mt: 0.25, fontSize: 9 }}>{a.desc}</Typography>
              </Box>
            ))}
            {recentAlerts.length === 0 && (
              <Typography sx={{ textAlign: "center", color: "#4b5563", fontSize: 10, py: 2 }}>
                لا توجد تنبيهات نشطة
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 1fr" }, gap: 1.5 }}>
        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2, display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4" }} />
            حركة الركاب (24 ساعة)
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={passengerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
                <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 10 }} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#141c2e", border: "1px solid #1e2a42", borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" fill="rgba(6,182,212,0.08)" strokeWidth={2} dot={{ r: 2, fill: "#06b6d4" }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2, display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4" }} />
            توزيع الركاب حسب الخط
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name }) => name}>
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
      </Box>
    </Box>
  );
}
