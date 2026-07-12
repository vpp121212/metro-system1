import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import ReportPreview from "./ReportPreview";
import { savedReports } from "../../utils/simulation";

const reportTypes = [
  { label: "ملخص يومي", defaultChecked: true },
  { label: "أداء الخطوط", defaultChecked: false },
  { label: "حركة الركاب", defaultChecked: false },
  { label: "صيانة واعطال", defaultChecked: false },
];

export default function ReportsTab() {
  return (
    <Box sx={{ animation: "fade-in 0.4s ease-out", "@keyframes fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>التقارير والتصدير</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            component="button"
            sx={{
              px: 2,
              py: 1,
              borderRadius: "8px",
              background: "rgba(239,68,68,0.15)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.25)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 12,
              "&:hover": { background: "rgba(239,68,68,0.25)" },
            }}
          >
            <i className="fas fa-file-pdf" />
            PDF
          </Box>
          <Box
            component="button"
            sx={{
              px: 2,
              py: 1,
              borderRadius: "8px",
              background: "rgba(22,163,74,0.15)",
              color: "#4ade80",
              border: "1px solid rgba(22,163,74,0.25)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 12,
              "&:hover": { background: "rgba(22,163,74,0.25)" },
            }}
          >
            <i className="fas fa-file-excel" />
            Excel
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 1fr 1fr" }, gap: 1.5, mb: 1.5 }}>
        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 12, mb: 1.5 }}>نوع التقرير</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {reportTypes.map((rt) => (
              <FormControlLabel
                key={rt.label}
                control={<Checkbox defaultChecked={rt.defaultChecked} sx={{ color: "#4b5563", "&.Mui-checked": { color: "#06b6d4" }, width: 14, height: 14 }} />}
                label={<Typography sx={{ fontSize: 12, color: "#cbd5e1" }}>{rt.label}</Typography>}
                sx={{
                  p: 1,
                  borderRadius: "6px",
                  background: "#141c2e",
                  border: "1px solid #1e2a42",
                  m: 0,
                  "&:hover": { borderColor: "rgba(6,182,212,0.4)" },
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 12, mb: 1.5 }}>الفترة الزمنية</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontSize: 9, color: "#6b7280", mb: 0.25 }}>من</Typography>
              <Box
                component="input"
                type="date"
                defaultValue="2026-07-01"
                sx={{
                  width: "100%",
                  background: "#141c2e",
                  border: "1px solid #1e2a42",
                  borderRadius: "6px",
                  px: 1.5,
                  py: 1,
                  fontSize: 12,
                  color: "#fff",
                  outline: "none",
                  "&:focus": { borderColor: "#06b6d4" },
                }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 9, color: "#6b7280", mb: 0.25 }}>إلى</Typography>
              <Box
                component="input"
                type="date"
                defaultValue="2026-07-12"
                sx={{
                  width: "100%",
                  background: "#141c2e",
                  border: "1px solid #1e2a42",
                  borderRadius: "6px",
                  px: 1.5,
                  py: 1,
                  fontSize: 12,
                  color: "#fff",
                  outline: "none",
                  "&:focus": { borderColor: "#06b6d4" },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 12, mb: 1.5 }}>التقارير المحفوظة</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {savedReports.map((r) => (
              <Box
                key={r.name}
                sx={{
                  p: 1.5,
                  borderRadius: "6px",
                  background: "#141c2e",
                  border: "1px solid #1e2a42",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 10, color: "#fff" }}>{r.name}</Typography>
                  <Typography sx={{ fontSize: 9, color: "#6b7280" }}>{r.format} • {r.size}</Typography>
                </Box>
                <Box component="button" sx={{ background: "none", border: "none", color: "#06b6d4", cursor: "pointer", "&:hover": { color: "#fff" } }}>
                  <i className="fas fa-download" style={{ fontSize: 12 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <ReportPreview />
    </Box>
  );
}
