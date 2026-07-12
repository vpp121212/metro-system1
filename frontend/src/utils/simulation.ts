import type { LineData, LineKey, Alert, AlertType, Camera, StationDensity, SimulationStep } from "../types";

export const linesData: Record<LineKey, LineData> = {
  blue: {
    name: "الخط الأزرق",
    nameEn: "Blue Line",
    color: "#2563eb",
    stations: ["-Olaya", "Al Olaya", "King Abdullah Financial District", "Al Rabie", "King Fahd Road 1", "King Fahd Road 2", "STC", "Al Wurud 2", "Al Urubah", "Al Enma Bank", "Banque Biladi", "King Fahd Library", "Interior Ministry", "Al Murabba", "Passport Department", "National Museum", "Al Batha", "Al Qasr", "Al Awad", "Skirinah", "Manfuha", "Iman Hospital", "General Transport", "Al Aziziyah", "Dar Al Baida"],
    interchange: [1, 5, 6, 15, 17],
  },
  red: {
    name: "الخط الأحمر",
    nameEn: "Red Line",
    color: "#dc2626",
    stations: ["King Saud University", "King Salman Park", "Tech City", "Specialist", "STC", "Al Wurud", "King Abdulaziz Rd", "Education Ministry", "Al Nahda", "Riyadh Exhibitions", "Khaled bin Al Waleed", "Al Hamra", "Al Khaleej", "Ishbiliyah", "King Fahd Stadium"],
    interchange: [4, 5, 7, 11, 12],
  },
  orange: {
    name: "الخط البرتقالي",
    nameEn: "Orange Line",
    color: "#ea580c",
    stations: ["Jeddah Rd", "Tuwaiq", "Ad Duhal", "West Station", "Aisha Bint Abi Bakr", "Al Badi'ah", "Sultanah", "Al Jaradiyah", "Courts Complex", "Al Qasr", "Al Hillah", "Al Marqab", "Al Salhiyah", "1st Industrial City", "Railway", "Al Malaz", "Jarir", "Al Rajhi Mosque", "Harun Al Rashid", "Al Naseem", "Hassan bin Thabit", "Khashm Al Aan"],
    interchange: [9],
  },
  yellow: {
    name: "الخط الأصفر",
    nameEn: "Yellow Line",
    color: "#eab308",
    stations: ["King Abdullah Financial District", "Al Rabie", "King Fahd Road", "SAIBOC", "Princess Nora Univ 1", "Princess Nora Univ 2", "Hall 5", "Hall 3-4", "Hall 1-2"],
    interchange: [0, 1, 2, 3],
  },
  green: {
    name: "الخط الأخضر",
    nameEn: "Green Line",
    color: "#16a34a",
    stations: ["Education Ministry", "King Salman Park", "Al Sulimaniyah", "Al Dhabab", "Abu Dhabi Sq", "Officers Club", "Social Insurance", "Ministries", "Defense Ministry", "King Abdulaziz Hospital", "Finance Ministry", "National Museum"],
    interchange: [0, 11],
  },
  purple: {
    name: "الخط البنفسجي",
    nameEn: "Purple Line",
    color: "#9333ea",
    stations: ["King Abdullah Financial District", "Al Rabie", "King Fahd Road", "SAIBOC", "Granada", "Al Yarmouk", "Al Hamra", "Al Andalus", "Khuraysh Rd", "Al Salam", "Al Naseem"],
    interchange: [0, 1, 2, 3, 6],
  },
};

export const stationCoords: Record<string, [number, number]> = {
  "-Olaya": [24.768, 46.698],
  "Al Olaya": [24.765, 46.705],
  "King Abdullah Financial District": [24.76, 46.71],
  "Al Rabie": [24.755, 46.715],
  "King Fahd Road 1": [24.75, 46.72],
  "King Fahd Road 2": [24.745, 46.725],
  STC: [24.74, 46.73],
  "Al Wurud 2": [24.735, 46.735],
  "Al Urubah": [24.73, 46.74],
  "Al Enma Bank": [24.725, 46.745],
  "Banque Biladi": [24.72, 46.75],
  "King Fahd Library": [24.715, 46.755],
  "Interior Ministry": [24.71, 46.76],
  "Al Murabba": [24.705, 46.765],
  "Passport Department": [24.7, 46.77],
  "National Museum": [24.695, 46.775],
  "Al Batha": [24.69, 46.78],
  "Al Qasr": [24.685, 46.785],
  "Al Awad": [24.68, 46.79],
  Skirinah: [24.675, 46.795],
  Manfuha: [24.67, 46.8],
  "Iman Hospital": [24.665, 46.805],
  "General Transport": [24.66, 46.81],
  "Al Aziziyah": [24.655, 46.815],
  "Dar Al Baida": [24.65, 46.82],
  "King Saud University": [24.72, 46.68],
  "King Salman Park": [24.718, 46.685],
  "Tech City": [24.715, 46.69],
  Specialist: [24.712, 46.695],
  "Al Wurud": [24.735, 46.735],
  "King Abdulaziz Rd": [24.71, 46.7],
  "Education Ministry": [24.708, 46.705],
  "Al Nahda": [24.705, 46.71],
  "Riyadh Exhibitions": [24.7, 46.715],
  "Khaled bin Al Waleed": [24.695, 46.72],
  "Al Hamra": [24.69, 46.725],
  "Al Khaleej": [24.685, 46.73],
  Ishbiliyah: [24.68, 46.735],
  "King Fahd Stadium": [24.675, 46.74],
  "Jeddah Rd": [24.78, 46.72],
  Tuwaiq: [24.775, 46.725],
  "Ad Duhal": [24.77, 46.73],
  "West Station": [24.765, 46.735],
  "Aisha Bint Abi Bakr": [24.76, 46.74],
  "Al Badi'ah": [24.755, 46.745],
  Sultanah: [24.75, 46.75],
  "Al Jaradiyah": [24.745, 46.755],
  "Courts Complex": [24.74, 46.76],
  "Al Hillah": [24.725, 46.775],
  "Al Marqab": [24.72, 46.78],
  "Al Salhiyah": [24.715, 46.785],
  "1st Industrial City": [24.71, 46.79],
  Railway: [24.705, 46.795],
  "Al Malaz": [24.7, 46.8],
  Jarir: [24.695, 46.805],
  "Al Rajhi Mosque": [24.69, 46.81],
  "Harun Al Rashid": [24.685, 46.815],
  "Al Naseem": [24.68, 46.82],
  "Hassan bin Thabit": [24.675, 46.82],
  "Khashm Al Aan": [24.67, 46.825],
  "King Fahd Road": [24.745, 46.705],
  SAIBOC: [24.74, 46.71],
  "Princess Nora Univ 1": [24.735, 46.715],
  "Princess Nora Univ 2": [24.73, 46.72],
  "Hall 5": [24.725, 46.725],
  "Hall 3-4": [24.72, 46.73],
  "Hall 1-2": [24.715, 46.735],
  "Al Sulimaniyah": [24.7, 46.705],
  "Al Dhabab": [24.695, 46.71],
  "Abu Dhabi Sq": [24.69, 46.715],
  "Officers Club": [24.685, 46.72],
  "Social Insurance": [24.68, 46.725],
  Ministries: [24.675, 46.73],
  "Defense Ministry": [24.67, 46.735],
  "King Abdulaziz Hospital": [24.665, 46.74],
  "Finance Ministry": [24.66, 46.745],
  Granada: [24.735, 46.7],
  "Al Yarmouk": [24.73, 46.705],
  "Al Andalus": [24.725, 46.71],
  "Khuraysh Rd": [24.72, 46.715],
  "Al Salam": [24.715, 46.72],
};

export const initialAlerts: Alert[] = [
  { id: 1, type: "critical", title: "تأخير حرج", desc: "تأخير 12 دقيقة في الخط الأزرق — محطة Al Urubah", time: "منذ 2 دقيقة", line: "blue", acknowledged: false },
  { id: 2, type: "warning", title: "ازدحام مرتفع", desc: "كثافة ركاب 87% في محطة King Abdullah Financial District", time: "منذ 5 دقائق", line: "blue", acknowledged: false },
  { id: 3, type: "warning", title: "صيانة مجدولة", desc: "إغلاق جزئي لمحطة Al Wurud 2 الساعة 14:00", time: "منذ 15 دقيقة", line: "blue", acknowledged: false },
  { id: 4, type: "info", title: "تحديث جدول", desc: "تعديل جدول الخط الأحمر في عطلة نهاية الأسبوع", time: "منذ 30 دقيقة", line: "red", acknowledged: true },
  { id: 5, type: "info", title: "كاميرا غير متصلة", desc: "كاميرا محطة King Saud University تحت الصيانة", time: "منذ 45 دقيقة", line: "red", acknowledged: true },
  { id: 6, type: "info", title: "تقرير يومي", desc: "تم إنشاء التقرير اليومي بنجاح", time: "منذ ساعة", line: "all", acknowledged: true },
];

export function generateCameras(): Camera[] {
  const cams: Camera[] = [];
  (Object.keys(linesData) as LineKey[]).forEach((k) => {
    linesData[k]!.stations.forEach((st, idx) => {
      if (idx % 2 === 0) {
        const s = Math.random() > 0.9 ? "offline" : Math.random() > 0.95 ? "warning" : "active";
        cams.push({ line: k, station: st, status: s, id: `${k}-${idx}` });
      }
    });
  });
  return cams;
}

export function generateStationDensity(): StationDensity[] {
  return [
    { name: "King Abdullah Financial District", density: Math.floor(75 + Math.random() * 20) },
    { name: "Al Qasr", density: Math.floor(70 + Math.random() * 20) },
    { name: "King Saud University", density: Math.floor(65 + Math.random() * 20) },
    { name: "Dar Al Baida", density: Math.floor(60 + Math.random() * 20) },
    { name: "Al Wurud 2", density: Math.floor(55 + Math.random() * 20) },
    { name: "Education Ministry", density: Math.floor(50 + Math.random() * 20) },
    { name: "National Museum", density: Math.floor(45 + Math.random() * 20) },
    { name: "Al Hamra", density: Math.floor(40 + Math.random() * 20) },
  ];
}

export const weeklyPassengerData = [
  { name: "السبت", value: 280000 },
  { name: "الأحد", value: 310000 },
  { name: "الإثنين", value: 325000 },
  { name: "الثلاثاء", value: 330000 },
  { name: "الأربعاء", value: 340000 },
  { name: "الخميس", value: 350000 },
  { name: "الجمعة", value: 220000 },
];

export const delayData = [
  { name: "أزرق", value: 2.1, color: "#2563eb" },
  { name: "أحمر", value: 2.8, color: "#dc2626" },
  { name: "برتقالي", value: 3.5, color: "#ea580c" },
  { name: "أصفر", value: 1.5, color: "#eab308" },
  { name: "أخضر", value: 2.0, color: "#16a34a" },
  { name: "بنفسجي", value: 1.8, color: "#9333ea" },
];

export const performanceData = [
  { subject: "السرعة", A: 85, B: 90 },
  { subject: "الدقة", A: 78, B: 90 },
  { subject: "السلامة", A: 95, B: 98 },
  { subject: "الراحة", A: 82, B: 90 },
  { subject: "النظافة", A: 88, B: 95 },
  { subject: "الخدمة", A: 80, B: 90 },
];

export const lineColors: Record<LineKey, string> = {
  blue: "#2563eb",
  red: "#dc2626",
  orange: "#ea580c",
  yellow: "#eab308",
  green: "#16a34a",
  purple: "#9333ea",
};

export const lineNamesAr: Record<LineKey, string> = {
  blue: "الأزرق",
  red: "الأحمر",
  orange: "البرتقالي",
  yellow: "الأصفر",
  green: "الأخضر",
  purple: "البنفسجي",
};

export const scenarios = [
  { type: "emergency", title: "حالة طوارئ", icon: "fa-ambulance", color: "red", desc: "إخلاء طوارئ في محطة مع إيقاف الخطوط" },
  { type: "breakdown", title: "عطل فني", icon: "fa-wrench", color: "yellow", desc: "عطل في قطار وتأثيره على الجدول" },
  { type: "crowd", title: "ازدحام شديد", icon: "fa-users", color: "orange", desc: "ازدحام مفاجئ في محطات رئيسية" },
  { type: "maintenance", title: "صيانة مجدولة", icon: "fa-tools", color: "blue", desc: "إغلاق جزئي للخط لأعمال الصيانة" },
  { type: "weather", title: "حالة طقس", icon: "fa-cloud-rain", color: "cyan", desc: "تأثير الأمطار على حركة القطارات" },
];

export const scenarioTitles: Record<string, string> = {
  emergency: "محاكاة: حالة طوارئ",
  breakdown: "محاكاة: عطل فني",
  crowd: "محاكاة: ازدحام شديد",
  maintenance: "محاكاة: صيانة مجدولة",
  weather: "محاكاة: حالة طقس",
};

export const simulationSteps: SimulationStep[] = [
  { msg: "تم تهيئة السيناريو بنجاح", step: "step1", delay: 1000 },
  { msg: "تحليل التأثير على الخطوط المجاورة", step: "step2", delay: 2500 },
  { msg: "تفعيل بروتوكول الاستجابة", step: "step3", delay: 4000 },
  { msg: "المراقبة المستمرة للوضع", step: "step4", delay: 5500 },
];

export const savedReports = [
  { name: "تقرير يومي — 11 يوليو", format: "PDF", size: "2.4 MB" },
  { name: "أداء الخط الأزرق — يونيو", format: "Excel", size: "1.8 MB" },
];

export function randomAlertType(): AlertType {
  const types: AlertType[] = ["warning", "info"];
  return types[Math.floor(Math.random() * types.length)]!;
}

export function randomStation(lineKey: LineKey): string {
  const line = linesData[lineKey]!;
  return line.stations[Math.floor(Math.random() * line.stations.length)]!;
}
