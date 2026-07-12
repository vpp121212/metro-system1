import { Box, Typography } from "@mui/material";

export default function AiPredictions() {
  return (
    <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
      <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <i className="fas fa-brain" style={{ color: "#9333ea" }} />
        تحليلات تنبؤية (AI)
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 1.5 }}>
        <Box sx={{ background: "#141c2e", borderRadius: "8px", p: 2, border: "1px solid #1e2a42" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <i className="fas fa-brain" style={{ color: "#9333ea", fontSize: 12 }} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>توقع الازدحام</Typography>
          </Box>
          <Typography sx={{ fontSize: 9, color: "#6b7280", mb: 1 }}>المركز المالي — 18:00</Typography>
          <Box sx={{ width: "100%", background: "#1f2937", borderRadius: "4px", height: 6, mb: 0.5 }}>
            <Box sx={{ width: "85%", height: 6, borderRadius: "4px", background: "linear-gradient(90deg, #eab308, #dc2626)" }} />
          </Box>
          <Typography sx={{ fontSize: 9, color: "#facc15", mt: 0.5 }}>85% — ازدحام شديد متوقع</Typography>
        </Box>

        <Box sx={{ background: "#141c2e", borderRadius: "8px", p: 2, border: "1px solid #1e2a42" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <i className="fas fa-tools" style={{ color: "#2563eb", fontSize: 12 }} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>صيانة متوقعة</Typography>
          </Box>
          <Typography sx={{ fontSize: 9, color: "#6b7280", mb: 1 }}>خط أزرق — محطة العروبة</Typography>
          <Box sx={{ mt: 1.5, display: "flex", gap: 0.5 }}>
            <Box sx={{ px: 1, py: 0.25, borderRadius: "4px", background: "rgba(234,179,8,0.15)", color: "#facc15", fontSize: 9 }}>
              خلال 48 ساعة
            </Box>
          </Box>
        </Box>

        <Box sx={{ background: "#141c2e", borderRadius: "8px", p: 2, border: "1px solid #1e2a42" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <i className="fas fa-chart-line" style={{ color: "#16a34a", fontSize: 12 }} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>توقع الركاب غداً</Typography>
          </Box>
          <Typography sx={{ fontSize: 9, color: "#6b7280", mb: 1 }}>إجمالي الشبكة</Typography>
          <Typography variant="h5" sx={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>412,000</Typography>
          <Typography sx={{ fontSize: 9, color: "#4ade80" }}>+5.2% عن اليوم</Typography>
        </Box>
      </Box>
    </Box>
  );
}
