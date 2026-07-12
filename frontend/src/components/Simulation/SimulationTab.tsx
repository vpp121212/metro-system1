import { useState } from "react";
import { Box, Typography } from "@mui/material";
import ScenarioCard from "./ScenarioCard";
import SimulationLog from "./SimulationLog";
import LoadingBar from "../Common/LoadingBar";
import { scenarios } from "../../utils/simulation";

interface SimulationTabProps {
  simTitle: string;
  simSteps: Record<string, boolean>;
  simComplete: boolean;
  simLog: string[];
  showControls: boolean;
  showLog: boolean;
  isRunning: boolean;
  onStartScenario: (type: string, title: string, color: string) => void;
  onPause: () => void;
  onStop: () => void;
}

export default function SimulationTab({
  simTitle,
  simSteps,
  simComplete,
  simLog,
  showControls,
  showLog,
  onStartScenario,
  onPause,
  onStop,
}: SimulationTabProps) {
  const [activeColor, setActiveColor] = useState("cyan");
  const stepLabels = ["تهيئة السيناريو", "تحليل التأثير", "تطبيق الإجراءات", "مراقبة النتائج"];

  return (
    <Box sx={{ animation: "fade-in 0.4s ease-out", "@keyframes fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 2fr" }, gap: 1.5 }}>
        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <i className="fas fa-gamepad" style={{ color: "#06b6d4" }} />
            سيناريوهات المحاكاة
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {scenarios.map((s) => (
              <ScenarioCard
                key={s.type}
                {...s}
                onClick={() => {
                  setActiveColor(s.color);
                  onStartScenario(s.type, `محاكاة: ${s.title}`, s.color);
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>{simTitle}</Typography>
            {showControls && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box
                  component="button"
                  onClick={onPause}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "6px",
                    background: "rgba(234,179,8,0.15)",
                    color: "#facc15",
                    border: "1px solid rgba(234,179,8,0.25)",
                    fontSize: 9,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:hover": { background: "rgba(234,179,8,0.25)" },
                  }}
                >
                  <i className="fas fa-pause" />
                  إيقاف مؤقت
                </Box>
                <Box
                  component="button"
                  onClick={onStop}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "6px",
                    background: "rgba(239,68,68,0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.25)",
                    fontSize: 9,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:hover": { background: "rgba(239,68,68,0.25)" },
                  }}
                >
                  <i className="fas fa-stop" />
                  إنهاء
                </Box>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              background: "#141c2e",
              border: "1px solid #1e2a42",
              borderRadius: "8px",
              p: 2,
              minHeight: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showControls ? (
              <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
                <LoadingBar />
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  {!simComplete ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin" style={{ fontSize: 24, color: activeColor === "red" ? "#f87171" : activeColor === "yellow" ? "#facc15" : activeColor === "orange" ? "#fb923c" : activeColor === "blue" ? "#60a5fa" : "#22d3ee", marginBottom: 8 }} />
                      <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mt: 1 }}>جاري تشغيل المحاكاة...</Typography>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle" style={{ fontSize: 24, color: "#4ade80", marginBottom: 8 }} />
                      <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mt: 1 }}>اكتملت المحاكاة بنجاح</Typography>
                    </>
                  )}
                </Box>
                <Box sx={{ width: "100%", mt: 2 }}>
                  {stepLabels.map((label, i) => {
                    const stepKey = `step${i + 1}`;
                    const done = simSteps[stepKey];
                    return (
                      <Box key={stepKey} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: done ? (activeColor === "red" ? "#f87171" : activeColor === "yellow" ? "#facc15" : activeColor === "orange" ? "#fb923c" : activeColor === "blue" ? "#60a5fa" : "#22d3ee") : "#374151",
                            transition: "background 0.3s",
                          }}
                        />
                        <Typography sx={{ fontSize: 11, color: done ? "#94a3b8" : "#6b7280" }}>{label}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", color: "#4b5563" }}>
                <i className="fas fa-play-circle" style={{ fontSize: 48, opacity: 0.4, marginBottom: 12 }} />
                <Typography sx={{ fontSize: 12 }}>اختر سيناريو من القائمة لبدء المحاكاة</Typography>
              </Box>
            )}
          </Box>

          {showLog && <SimulationLog logs={simLog} color={activeColor} />}
        </Box>
      </Box>
    </Box>
  );
}
