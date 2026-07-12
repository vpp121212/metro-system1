import { Box } from "@mui/material";
import WeeklyChart from "./WeeklyChart";
import DelayChart from "./DelayChart";
import StationDensity from "./StationDensity";
import PerformanceChart from "./PerformanceChart";
import AiPredictions from "./AiPredictions";

export default function AnalyticsTab() {
  return (
    <Box sx={{ animation: "fade-in 0.4s ease-out", "@keyframes fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 1fr" }, gap: 1.5, mb: 1.5 }}>
        <WeeklyChart />
        <DelayChart />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 2fr" }, gap: 1.5, mb: 1.5 }}>
        <StationDensity />
        <PerformanceChart />
      </Box>
      <AiPredictions />
    </Box>
  );
}
