import { Grid, Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AirlineStopsIcon from "@mui/icons-material/AirlineStops";
import { useKpi } from "../hooks/useKpi";

const COLORS = ["#0f2b5e", "#d4a843", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899"];

function KpiCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
        <Box sx={{ width: 52, height: 52, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: `${color}15`, color }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: kpi, isLoading } = useKpi();

  if (isLoading) return <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />;
  if (!kpi) return <Typography color="error">Failed to load KPI data</Typography>;

  const stationData = Object.entries(kpi.incidents_by_station).map(([name, count]) => ({ name, count }));
  const typeData = Object.entries(kpi.incidents_by_type).map(([name, count]) => ({ name, count }));
  const trendData = kpi.monthly_trend;

  return (
    <Box>
      <Typography variant="h4" mb={3}>Dashboard</Typography>
      <Grid container spacing={2.5} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Total Incidents" value={String(kpi.total_incidents)} icon={<LocalPoliceIcon />} color="#0f2b5e" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Open Incidents" value={String(kpi.open_incidents)} icon={<ErrorIcon />} color="#ef4444" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Closed Incidents" value={String(kpi.closed_incidents)} icon={<CheckCircleIcon />} color="#22c55e" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Injuries / Fatalities" value={`${kpi.total_injuries} / ${kpi.total_fatalities}`} icon={<AirlineStopsIcon />} color="#d4a843" />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Monthly Trend</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f2b5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>By Type</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={typeData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name }) => name}>
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]!} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>By Station</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={140} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f2b5e" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
