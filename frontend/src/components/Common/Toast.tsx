import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { AlertType } from "../../types";

interface ToastProps {
  title: string;
  msg: string;
  type: AlertType;
  onDone: () => void;
}

const borderColors: Record<AlertType, string> = {
  critical: "#dc2626",
  warning: "#eab308",
  info: "#2563eb",
};

export default function Toast({ title, msg, type, onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <Fade in={visible}>
      <Box
        sx={{
          position: "fixed",
          top: 56,
          left: 16,
          zIndex: 1300,
          background: "rgba(13,19,33,0.92)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(30,42,66,0.6)",
          borderLeft: `4px solid ${borderColors[type]}`,
          borderRadius: "8px",
          p: 1.5,
          maxWidth: 320,
          animation: "slide-in 0.3s ease-out",
          "@keyframes slide-in": {
            from: { transform: "translateX(-100%)", opacity: 0 },
            to: { transform: "translateX(0)", opacity: 1 },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#fff", fontSize: 12 }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: 10, color: "#94a3b8", mt: 0.25 }}>{msg}</Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => {
              setVisible(false);
              setTimeout(onDone, 300);
            }}
            sx={{ color: "#64748b", "&:hover": { color: "#fff" } }}
          >
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      </Box>
    </Fade>
  );
}
