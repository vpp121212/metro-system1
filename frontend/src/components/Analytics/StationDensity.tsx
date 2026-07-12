import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { generateStationDensity } from "../../utils/simulation";

export default function StationDensity() {
  const [stations, setStations] = useState(generateStationDensity);

  useEffect(() => {
    const interval = setInterval(() => {
      setStations(generateStationDensity());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
      <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2 }}>
        كثافة المحطات (الآن)
      </Typography>
      <Box sx={{ maxHeight: 224, overflow: "auto" }}>
        {stations.map((s) => {
          const gradient =
            s.density > 80
              ? "linear-gradient(90deg, #dc2626, #ea580c)"
              : s.density > 60
                ? "linear-gradient(90deg, #eab308, #ea580c)"
                : "linear-gradient(90deg, #16a34a, #34d399)";
          return (
            <Box key={s.name} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography sx={{ fontSize: 9, color: "#6b7280", width: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.name}
              </Typography>
              <Box sx={{ flex: 1, background: "#1f2937", borderRadius: "4px", height: 6 }}>
                <Box sx={{ width: `${s.density}%`, height: 6, borderRadius: "4px", background: gradient, transition: "width 0.5s" }} />
              </Box>
              <Typography sx={{ fontSize: 9, color: "#fff", width: 28, textAlign: "left" }}>
                {s.density}%
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
