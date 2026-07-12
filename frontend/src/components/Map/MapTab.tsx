import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import type { LineKey } from "../../types";
import { linesData, stationCoords } from "../../utils/simulation";

interface TrainMarker {
  key: string;
  line: LineKey;
  stationIdx: number;
  direction: number;
  lat: number;
  lng: number;
}

const filterLines: { key: string; label: string; color: string }[] = [
  { key: "all", label: "الكل", color: "#fff" },
  { key: "blue", label: "أزرق", color: "#2563eb" },
  { key: "red", label: "أحمر", color: "#dc2626" },
  { key: "orange", label: "برتقالي", color: "#ea580c" },
  { key: "yellow", label: "أصفر", color: "#eab308" },
  { key: "green", label: "أخضر", color: "#16a34a" },
  { key: "purple", label: "بنفسجي", color: "#9333ea" },
];

export default function MapTab() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const trainMarkersRef = useRef<TrainMarker[]>([]);

  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = await import("leaflet");

    const map = L.map(mapRef.current, { zoomControl: false }).setView([24.71, 46.75], 12);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "TrainEye",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    (Object.keys(linesData) as LineKey[]).forEach((k) => {
      const l = linesData[k];
      const coords = l.stations.map((s) => stationCoords[s]).filter((c): c is [number, number] => !!c);
      if (coords.length > 1) {
        const isDashed = k === "orange" || k === "yellow" || k === "green" || k === "purple";
        L.polyline(coords, {
          color: l.color,
          weight: 3.5,
          opacity: 0.8,
          dashArray: isDashed ? "8,8" : undefined,
        }).addTo(map);
      }
    });

    (Object.keys(linesData) as LineKey[]).forEach((k) => {
      const l = linesData[k];
      l.stations.forEach((st, idx) => {
        const c = stationCoords[st];
        if (!c) return;
        const isI = l.interchange.includes(idx);
        const size = isI ? 12 : 8;
        const icon = L.divIcon({
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${l.color};border:${isI ? "3px" : "2px"} solid ${isI ? "#fbbf24" : "rgba(255,255,255,.9)"};box-shadow:${isI ? "0 0 14px rgba(251,191,36,.45)" : "0 0 8px rgba(0,0,0,.5)"}"></div>`,
          className: "",
          iconSize: [size, size],
        });
        const marker = L.marker(c, { icon }).addTo(map);
        marker.bindPopup(
          `<b style="color:${l.color}">${st}</b><br>${l.name}${isI ? '<br><span style="color:#fbbf24">⚡ محطة تبادل</span>' : ""}`
        );
      });
    });

    const trains: TrainMarker[] = [];
    (Object.keys(linesData) as LineKey[]).forEach((k) => {
      const l = linesData[k];
      const n = Math.floor(4 + Math.random() * 4);
      for (let i = 0; i < n; i++) {
        const si = Math.floor(Math.random() * l.stations.length);
        const st = l.stations[si]!;
        const c = stationCoords[st];
        if (!c) continue;
        const off = [(Math.random() - 0.5) * 0.003, (Math.random() - 0.5) * 0.003];
        const tc: [number, number] = [c[0] + off[0]!, c[1] + off[1]!];
        const html = `<div style="width:12px;height:12px;border-radius:50%;background:${l.color};color:${l.color};border:2px solid #fff;box-shadow:0 0 8px ${l.color}"></div>`;
        const icon = L.divIcon({ html, className: "", iconSize: [12, 12] });
        const marker = L.marker(tc, { icon }).addTo(map);
        marker.bindPopup(`<b>قطار ${l.name}</b><br>محطة: ${st}<br>الحالة: <span style="color:#22c55e">نشط</span>`);
        trains.push({ key: `${k}-${i}`, line: k, stationIdx: si, direction: Math.random() > 0.5 ? 1 : -1, lat: tc[0], lng: tc[1] });
      }
    });
    trainMarkersRef.current = trains;

    mapInstanceRef.current = map;
  }, []);

  useEffect(() => {
    initMap();
    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!mapInstanceRef.current) return;

      trainMarkersRef.current.forEach((tm) => {
        const l = linesData[tm.line];
        tm.stationIdx += tm.direction * (Math.random() > 0.7 ? 1 : 0);
        if (tm.stationIdx >= l.stations.length) {
          tm.stationIdx = l.stations.length - 2;
          tm.direction = -1;
        }
        if (tm.stationIdx < 0) {
          tm.stationIdx = 1;
          tm.direction = 1;
        }
        const st = l.stations[tm.stationIdx]!;
        const c = stationCoords[st];
        if (c) {
          const o = [(Math.random() - 0.5) * 0.002, (Math.random() - 0.5) * 0.002];
          tm.lat = c[0] + o[0]!;
          tm.lng = c[1] + o[1]!;
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ animation: "fade-in 0.4s ease-out", "@keyframes fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
      <Box
        sx={{
          background: "rgba(13,19,33,0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(30,42,66,0.6)",
          borderRadius: "12px",
          overflow: "hidden",
          height: "calc(100vh - 130px)",
        }}
      >
        <Box sx={{ p: 1.5, borderBottom: "1px solid #1e2a42", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>خريطة الشبكة</Typography>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              {filterLines.map((f) => (
                <Box
                  key={f.key}
                  component="button"
                  onClick={() => setActiveFilter(f.key)}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: "6px",
                    border: "1px solid #1e2a42",
                    fontSize: 9,
                    color: activeFilter === f.key ? "#fff" : f.color,
                    cursor: "pointer",
                    background: activeFilter === f.key ? "linear-gradient(135deg, #2563eb, #06b6d4)" : "#141c2e",
                    "&:hover": { background: "#1e2a42" },
                  }}
                >
                  {f.label}
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Box
              component="button"
              sx={{ width: 28, height: 28, borderRadius: "6px", background: "#141c2e", border: "1px solid #1e2a42", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, "&:hover": { background: "#1e2a42" } }}
            >
              <i className="fas fa-plus" />
            </Box>
            <Box
              component="button"
              sx={{ width: 28, height: 28, borderRadius: "6px", background: "#141c2e", border: "1px solid #1e2a42", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, "&:hover": { background: "#1e2a42" } }}
            >
              <i className="fas fa-minus" />
            </Box>
            <Box
              component="button"
              sx={{ px: 1, py: 0.5, borderRadius: "6px", background: "#141c2e", border: "1px solid #1e2a42", color: "#fff", cursor: "pointer", fontSize: 9, "&:hover": { background: "#1e2a42" } }}
            >
              إعادة تعيين
            </Box>
          </Box>
        </Box>
        <Box ref={mapRef} sx={{ width: "100%", height: "100%", background: "#060b18" }} />
      </Box>
    </Box>
  );
}
