import { Box, Typography } from "@mui/material";

export default function ReportPreview() {
  return (
    <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
      <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2 }}>معاينة التقرير</Typography>
      <Box
        sx={{
          background: "#fff",
          color: "#000",
          p: 4,
          borderRadius: "8px",
          minHeight: 350,
          fontFamily: "'Cairo', sans-serif",
        }}
      >
        <Box sx={{ textAlign: "center", borderBottom: "2px solid #374151", pb: 2, mb: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>TrainEye — تقرير يومي</Typography>
          <Typography sx={{ fontSize: 13, color: "#6b7280" }}>مركز قيادة مetro الرياض</Typography>
          <Typography sx={{ fontSize: 10, color: "#9ca3af" }}>12 يوليو 2026</Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
          <Box sx={{ border: "1px solid #d1d5db", p: 1.5, borderRadius: "4px" }}>
            <Typography sx={{ fontSize: 10, color: "#6b7280" }}>إجمالي الركاب</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>284,392</Typography>
          </Box>
          <Box sx={{ border: "1px solid #d1d5db", p: 1.5, borderRadius: "4px" }}>
            <Typography sx={{ fontSize: 10, color: "#6b7280" }}>متوسط التأخير</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>2.1 دقيقة</Typography>
          </Box>
        </Box>

        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", border: "1px solid #d1d5db", mb: 2 }}>
          <Box component="thead">
            <Box component="tr" sx={{ background: "#f3f4f6" }}>
              {["الخط", "الركاب", "التأخير", "الحالة"].map((h) => (
                <Box key={h} component="th" sx={{ border: "1px solid #d1d5db", p: 1, textAlign: "right", fontSize: 10 }}>{h}</Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {[
              ["الأزرق", "98,420", "1.8 د", "جيد"],
              ["الأحمر", "62,105", "2.4 د", "جيد"],
              ["البرتقالي", "54,230", "3.1 د", "متوسط"],
              ["الأصفر", "28,940", "1.2 د", "ممتاز"],
              ["الأخضر", "24,180", "2.0 د", "جيد"],
              ["البنفسجي", "16,517", "1.5 د", "ممتاز"],
            ].map((row, i) => (
              <Box component="tr" key={i}>
                {row.map((cell, j) => (
                  <Box
                    key={j}
                    component="td"
                    sx={{
                      border: "1px solid #d1d5db",
                      p: 1,
                      fontSize: 10,
                      color: j === 3 && cell === "ممتاز" ? "#16a34a" : j === 3 && cell === "متوسط" ? "#ca8a04" : undefined,
                    }}
                  >
                    {cell}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>

        <Typography sx={{ fontSize: 8, color: "#9ca3af", textAlign: "center" }}>
          تم إنشاء هذا التقرير تلقائياً بواسطة TrainEye
        </Typography>
      </Box>
    </Box>
  );
}
