import { Box, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { weeklyPassengerData } from "../../utils/simulation";

export default function PassengerChart() {
  return (
    <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>حركة الركاب الأسبوعية</Typography>
      </Box>
      <Box sx={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyPassengerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
            <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 10 }} />
            <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#141c2e", border: "1px solid #1e2a42", borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="value" fill="rgba(6,182,212,.5)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
