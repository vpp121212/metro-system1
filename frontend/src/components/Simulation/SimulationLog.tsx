import { Box, Typography } from "@mui/material";

interface SimulationLogProps {
  logs: string[];
  color: string;
}

export default function SimulationLog({ logs, color }: SimulationLogProps) {
  return (
    <Box
      sx={{
        mt: 1.5,
        background: "#141c2e",
        border: "1px solid #1e2a42",
        borderRadius: "8px",
        p: 1,
        maxHeight: 96,
        overflow: "auto",
      }}
    >
      {logs.map((log, i) => (
        <Typography key={i} sx={{ fontSize: 9, color: `${color === "red" ? "#f87171" : color === "yellow" ? "#facc15" : color === "orange" ? "#fb923c" : color === "blue" ? "#60a5fa" : "#22d3ee"}`, lineHeight: 1.5 }}>
          {log}
        </Typography>
      ))}
    </Box>
  );
}
