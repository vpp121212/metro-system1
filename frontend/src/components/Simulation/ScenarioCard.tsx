import { Box, Typography } from "@mui/material";

interface ScenarioCardProps {
  type: string;
  title: string;
  icon: string;
  color: string;
  desc: string;
  onClick: () => void;
}

const colorMap: Record<string, string> = {
  red: "#dc2626",
  yellow: "#eab308",
  orange: "#ea580c",
  blue: "#2563eb",
  cyan: "#06b6d4",
};

export default function ScenarioCard({ title, icon, color, desc, onClick }: ScenarioCardProps) {
  const hoverColor = colorMap[color] || "#06b6d4";

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        width: "100%",
        textAlign: "right",
        p: 2,
        borderRadius: "8px",
        background: "#141c2e",
        border: "1px solid #1e2a42",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": { borderColor: hoverColor + "66" },
        "&:hover .title": { color: hoverColor },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography className="title" sx={{ fontWeight: 700, color: "#fff", fontSize: 12, transition: "color 0.2s" }}>
          {title}
        </Typography>
        <i className={`fas ${icon}`} style={{ color: hoverColor, fontSize: 12 }} />
      </Box>
      <Typography sx={{ fontSize: 9, color: "#6b7280" }}>{desc}</Typography>
    </Box>
  );
}
