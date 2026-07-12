import { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import type { Camera } from "../../types";
import { linesData } from "../../utils/simulation";

interface CameraFeedProps {
  cam: Camera;
}

export default function CameraFeed({ cam }: CameraFeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = 400;
    canvas.height = 200;

    let running = true;

    function draw() {
      if (!running) return;
      const cv = canvasRef.current;
      const c = cv?.getContext("2d");
      if (!cv || !c) return;

      frameRef.current++;
      const status = cam.status;

      c.fillStyle = status === "offline" ? "#111" : "#060b18";
      c.fillRect(0, 0, cv.width, cv.height);

      if (status === "offline") {
        c.fillStyle = "#333";
        c.font = "12px Cairo";
        c.textAlign = "center";
        c.fillText("لا إشارة", cv.width / 2, cv.height / 2);
        return;
      }

      const n = status === "warning" ? 70 : 35;
      for (let i = 0; i < n; i++) {
        const x = (Math.sin(frameRef.current * 0.01 + i * 100) * 0.5 + 0.5) * cv.width;
        const y = (Math.cos(frameRef.current * 0.015 + i * 150) * 0.5 + 0.5) * cv.height;
        const sz = 1.5 + Math.sin(frameRef.current * 0.02 + i) * 0.8;
        c.beginPath();
        c.arc(x, y, sz, 0, Math.PI * 2);
        c.fillStyle = `hsla(${190 + Math.sin(frameRef.current * 0.01 + i) * 50},70%,55%,.55)`;
        c.fill();
      }

      const sy = (frameRef.current * 2) % cv.height;
      c.strokeStyle = "rgba(6,182,212,.25)";
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(0, sy);
      c.lineTo(cv.width, sy);
      c.stroke();

      c.strokeStyle = "rgba(6,182,212,.04)";
      c.lineWidth = 0.4;
      for (let x = 0; x < cv.width; x += 35) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, cv.height);
        c.stroke();
      }
      for (let y = 0; y < cv.height; y += 35) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(cv.width, y);
        c.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [cam.status]);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "#000",
        borderRadius: "8px",
        height: 144,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "rgba(0,0,0,.75)",
          px: 1,
          py: 0.375,
          borderRadius: "4px",
          fontSize: 10,
          color: "#06b6d4",
          backdropFilter: "blur(4px)",
        }}
      >
        <i className="fas fa-video" style={{ marginRight: 4 }} />
        {cam.station}
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: cam.status === "active" ? "#22c55e" : cam.status === "warning" ? "#eab308" : "#4b5563",
          animation: "pulse 1.5s infinite",
          "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 6,
          left: 6,
          right: 6,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: 9, color: "#fff", background: "rgba(0,0,0,.6)", px: 0.75, py: 0.25, borderRadius: "4px" }}>
          {linesData[cam.line].name}
        </Typography>
        <Typography sx={{ fontSize: 9, color: "#fff", background: "rgba(0,0,0,.6)", px: 0.75, py: 0.25, borderRadius: "4px" }}>
          {cam.status === "active" ? "مباشر" : cam.status === "warning" ? "تحذير" : "غير متصلة"}
        </Typography>
      </Box>
    </Box>
  );
}
