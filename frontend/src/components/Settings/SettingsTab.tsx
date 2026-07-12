import { useState } from "react";
import { Box, Typography } from "@mui/material";

interface ToggleSwitchProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

function ToggleSwitch({ defaultChecked = false, onChange }: ToggleSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <Box
      component="span"
      onClick={() => {
        const next = !checked;
        setChecked(next);
        onChange?.(next);
      }}
      sx={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer" }}
    >
      <Box sx={{ width: 36, height: 20, borderRadius: "10px", background: checked ? "#06b6d4" : "#374151", transition: "background 0.2s", position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 2,
            right: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "right 0.2s",
          }}
        />
      </Box>
    </Box>
  );
}

interface SettingRowProps {
  title: string;
  desc: string;
  defaultChecked?: boolean;
}

function SettingRow({ title, desc, defaultChecked = true }: SettingRowProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.5, background: "#141c2e", borderRadius: "8px", border: "1px solid #1e2a42" }}>
      <Box>
        <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{title}</Typography>
        <Typography sx={{ fontSize: 9, color: "#6b7280" }}>{desc}</Typography>
      </Box>
      <ToggleSwitch defaultChecked={defaultChecked} />
    </Box>
  );
}

export default function SettingsTab() {
  return (
    <Box sx={{ animation: "fade-in 0.4s ease-out", "@keyframes fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } }, maxWidth: 576, mx: "auto" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <i className="fas fa-cog" style={{ color: "#06b6d4" }} />
            الإعدادات العامة
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <SettingRow title="الوضع الليلي" desc="تفعيل الوضع الداكن دائماً" defaultChecked />
            <SettingRow title="الإشعارات الصوتية" desc="تشغيل صوت عند وصول تنبيه" defaultChecked />
            <SettingRow title="تحديث تلقائي" desc="تحديث البيانات كل 3 ثوانٍ" defaultChecked />
          </Box>
        </Box>

        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <i className="fas fa-bell" style={{ color: "#06b6d4" }} />
            إعدادات التنبيهات
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <SettingRow title="تنبيهات التأخير" desc="إشعار عند تأخير أكثر من 5 دقائق" defaultChecked />
            <SettingRow title="تنبيهات الازدحام" desc="إشعار عند تجاوز كثافة 80%" defaultChecked />
          </Box>
        </Box>

        <Box sx={{ background: "rgba(13,19,33,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(30,42,66,0.6)", borderRadius: "12px", p: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <i className="fas fa-info-circle" style={{ color: "#06b6d4" }} />
            عن النظام
          </Typography>
          <Box sx={{ background: "#141c2e", border: "1px solid #1e2a42", borderRadius: "8px", p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "8px", background: "linear-gradient(135deg, #2563eb, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-eye" style={{ color: "#fff" }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>TrainEye v2.0</Typography>
                <Typography sx={{ fontSize: 9, color: "#6b7280" }}>مركز قيادة مetro الرياض</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
                <i className="fas fa-check-circle" style={{ color: "#4ade80", marginLeft: 6 }} />
                6 خطوط مترو — 94 محطة
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
                <i className="fas fa-check-circle" style={{ color: "#4ade80", marginLeft: 6 }} />
                84 قطار نشط — 24 كاميرا
              </Typography>
            </Box>
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #1e2a42" }}>
              <Typography sx={{ fontSize: 8, color: "#4b5563" }}>© 2026 TrainEye. جميع الحقوق محفوظة.</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
