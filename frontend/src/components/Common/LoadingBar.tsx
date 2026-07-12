import { Box } from "@mui/material";

export default function LoadingBar() {
  return (
    <Box
      sx={{
        height: "2px",
        background: "linear-gradient(90deg, #2563eb, #06b6d4, #2563eb)",
        backgroundSize: "200% 100%",
        animation: "loading 1.5s linear infinite",
        borderRadius: "2px",
        "@keyframes loading": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      }}
    />
  );
}
