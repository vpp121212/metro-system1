import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}

function minutesFromNow(m: number): Date {
  return new Date(Date.now() + m * 60 * 1000);
}

async function hasData(): Promise<boolean> {
  const count = await prisma.line.count();
  return count > 0;
}

// ---------------------------------------------------------------------------
// Seed data definitions
// ---------------------------------------------------------------------------

interface LineDef {
  nameAr: string;
  nameEn: string;
  color: string;
  colorHex: string;
  order: number;
  stations: StationDef[];
  trainCount: number;
}

interface StationDef {
  nameAr: string;
  nameEn: string;
  order: number;
  lat: number;
  lng: number;
  isInterchange?: boolean;
}

const LINES: LineDef[] = [
  // ── Blue Line (Line 1) ──────────────────────────────────────────────
  {
    nameAr: "الخط الأزرق",
    nameEn: "Blue Line",
    color: "BLUE",
    colorHex: "#2563eb",
    order: 1,
    trainCount: 10,
    stations: [
      { nameAr: "بنك الأول (ساب)", nameEn: "Alawwal Bank (SABB)", order: 1, lat: 24.7618, lng: 46.6412, isInterchange: true },
      { nameAr: "د. سليمان الحبيب", nameEn: "Dr. Sulaiman Al Habib", order: 2, lat: 24.7561, lng: 46.6524 },
      { nameAr: "المركز المالي", nameEn: "KAFD", order: 3, lat: 24.7487, lng: 46.6615, isInterchange: true },
      { nameAr: "المروج", nameEn: "Al Muruj", order: 4, lat: 24.7413, lng: 46.6698 },
      { nameAr: "حي الملك فهد", nameEn: "King Fahd District", order: 5, lat: 24.7340, lng: 46.6781 },
      { nameAr: "حي الملك فهد 2", nameEn: "King Fahd District 2", order: 6, lat: 24.7267, lng: 46.6864 },
      { nameAr: "الاتصالات السعودية", nameEn: "STC", order: 7, lat: 24.7194, lng: 46.6947, isInterchange: true },
      { nameAr: "الورود 2", nameEn: "Al Worood 2", order: 8, lat: 24.7121, lng: 46.7030 },
      { nameAr: "العروبة", nameEn: "Al Orouba", order: 9, lat: 24.7048, lng: 46.7113 },
      { nameAr: "مصرف الإنماء", nameEn: "Alinma Bank", order: 10, lat: 24.6975, lng: 46.7196 },
      { nameAr: "بنك البلاد", nameEn: "Bank AlBilad", order: 11, lat: 24.6902, lng: 46.7279 },
      { nameAr: "مكتبة الملك فهد", nameEn: "King Fahd Library", order: 12, lat: 24.6829, lng: 46.7362 },
      { nameAr: "وزارة الداخلية", nameEn: "Ministry of Interior", order: 13, lat: 24.6756, lng: 46.7445 },
      { nameAr: "المربع", nameEn: "Al Murabba", order: 14, lat: 24.6683, lng: 46.7528 },
      { nameAr: "الجوازات", nameEn: "Passport Department", order: 15, lat: 24.6610, lng: 46.7611 },
      { nameAr: "المتحف الوطني", nameEn: "National Museum", order: 16, lat: 24.6537, lng: 46.7694, isInterchange: true },
      { nameAr: "البطحاء", nameEn: "Al Batha", order: 17, lat: 24.6464, lng: 46.7777 },
      { nameAr: "قصر الحكم", nameEn: "Justice Palace", order: 18, lat: 24.6391, lng: 46.7860, isInterchange: true },
      { nameAr: "العود", nameEn: "Al Oud", order: 19, lat: 24.6318, lng: 46.7943 },
      { nameAr: "سكيرينة", nameEn: "Sukayrinah", order: 20, lat: 24.6245, lng: 46.8026 },
      { nameAr: "منفوحة", nameEn: "Manfuhah", order: 21, lat: 24.6172, lng: 46.8109 },
      { nameAr: "مستشفى الإيمان", nameEn: "Iman Hospital", order: 22, lat: 24.6099, lng: 46.8192 },
      { nameAr: "مركز النقل العام", nameEn: "Public Transport Center", order: 23, lat: 24.6026, lng: 46.8275 },
      { nameAr: "العزيزية", nameEn: "Al Aziziyah", order: 24, lat: 24.5953, lng: 46.8358 },
      { nameAr: "الدار البيضاء", nameEn: "Dar Al Bayda", order: 25, lat: 24.5880, lng: 46.8441 },
    ],
  },

  // ── Red Line (Line 2) ──────────────────────────────────────────────
  {
    nameAr: "الخط الأحمر",
    nameEn: "Red Line",
    color: "RED",
    colorHex: "#dc2626",
    order: 2,
    trainCount: 8,
    stations: [
      { nameAr: "جامعة الملك سعود", nameEn: "King Saud University", order: 1, lat: 24.7618, lng: 46.6412, isInterchange: true },
      { nameAr: "واحة الملك سلمان", nameEn: "King Salman Oasis", order: 2, lat: 24.7487, lng: 46.6615, isInterchange: true },
      { nameAr: "المدينة التقنية", nameEn: "Technology City", order: 3, lat: 24.7395, lng: 46.6680 },
      { nameAr: "التخصصي", nameEn: "Al Takhassusi", order: 4, lat: 24.7303, lng: 46.6745 },
      { nameAr: "الاتصالات السعودية", nameEn: "STC", order: 5, lat: 24.7211, lng: 46.6810, isInterchange: true },
      { nameAr: "الورود", nameEn: "Al Worood", order: 6, lat: 24.7119, lng: 46.6875 },
      { nameAr: "طريق الملك عبدالعزيز", nameEn: "King Abdulaziz Road", order: 7, lat: 24.7027, lng: 46.6940 },
      { nameAr: "وزارة التعليم", nameEn: "Ministry of Education", order: 8, lat: 24.6935, lng: 46.7005, isInterchange: true },
      { nameAr: "النزهة", nameEn: "Al Nuzha", order: 9, lat: 24.6843, lng: 46.7070 },
      { nameAr: "مركز الرياض للمعارض", nameEn: "Riyadh Exhibition Center", order: 10, lat: 24.6751, lng: 46.7135 },
      { nameAr: "طريق خالد بن الوليد", nameEn: "Khaled Bin Al Waleed Road", order: 11, lat: 24.6659, lng: 46.7200 },
      { nameAr: "الحمراء", nameEn: "Al Hamra", order: 12, lat: 24.6567, lng: 46.7265, isInterchange: true },
      { nameAr: "الخليج", nameEn: "Al Khaleej", order: 13, lat: 24.6475, lng: 46.7330 },
      { nameAr: "إشبيليا", nameEn: "Ishbiliyah", order: 14, lat: 24.6383, lng: 46.7395 },
      { nameAr: "مدينة الملك فهد الرياضية", nameEn: "King Fahd Sports City", order: 15, lat: 24.6291, lng: 46.7460 },
    ],
  },

  // ── Orange Line (Line 3) ──────────────────────────────────────────
  {
    nameAr: "الخط البرتقالي",
    nameEn: "Orange Line",
    color: "ORANGE",
    colorHex: "#ea580c",
    order: 3,
    trainCount: 8,
    stations: [
      { nameAr: "طريق جدة", nameEn: "Jeddah Road", order: 1, lat: 24.7700, lng: 46.6200 },
      { nameAr: "طويق", nameEn: "Tuwaiq", order: 2, lat: 24.7630, lng: 46.6280 },
      { nameAr: "الدوح", nameEn: "Al Doah", order: 3, lat: 24.7560, lng: 46.6360 },
      { nameAr: "المحطة الغربية", nameEn: "Western Station", order: 4, lat: 24.7490, lng: 46.6440 },
      { nameAr: "شارع عائشة بنت أبي بكر", nameEn: "Aisha bint Abi Bakr Street", order: 5, lat: 24.7420, lng: 46.6520 },
      { nameAr: "ظهرة البديعة", nameEn: "Dahrat Al Badiah", order: 6, lat: 24.7350, lng: 46.6600 },
      { nameAr: "سلطانة", nameEn: "Sultanah", order: 7, lat: 24.7280, lng: 46.6680 },
      { nameAr: "الجرادية", nameEn: "Al Juradiyah", order: 8, lat: 24.7487, lng: 46.6615, isInterchange: true },
      { nameAr: "مجمع المحاكم", nameEn: "Courts Complex", order: 9, lat: 24.6537, lng: 46.7694, isInterchange: true },
      { nameAr: "قصر الحكم", nameEn: "Justice Palace", order: 10, lat: 24.7267, lng: 46.6864, isInterchange: true },
      { nameAr: "الحلة", nameEn: "Al Hillah", order: 11, lat: 24.7121, lng: 46.7030, isInterchange: true },
      { nameAr: "المرقب", nameEn: "Al Marqab", order: 12, lat: 24.6756, lng: 46.7445, isInterchange: true },
      { nameAr: "الصالحية", nameEn: "Al Salhiyah", order: 13, lat: 24.6600, lng: 46.7500 },
      { nameAr: "المدينة الصناعية الأولى", nameEn: "Industrial City 1", order: 14, lat: 24.6500, lng: 46.7560 },
      { nameAr: "سكة الحديد", nameEn: "Railway Station", order: 15, lat: 24.6400, lng: 46.7620 },
      { nameAr: "الملز", nameEn: "Al Malaz", order: 16, lat: 24.6300, lng: 46.7680 },
      { nameAr: "حي جرير", nameEn: "Jarir District", order: 17, lat: 24.6200, lng: 46.7740 },
      { nameAr: "جامع الراجحي", nameEn: "Al Rajhi Mosque", order: 18, lat: 24.6100, lng: 46.7800 },
      { nameAr: "طريق هارون الرشيد", nameEn: "Harun Al Rashid Road", order: 19, lat: 24.6000, lng: 46.7860 },
      { nameAr: "النسيم", nameEn: "Al Naseem", order: 20, lat: 24.5900, lng: 46.7920, isInterchange: true },
      { nameAr: "شارع حسان بن ثابت", nameEn: "Hassan bin Thabit Street", order: 21, lat: 24.6383, lng: 46.7395, isInterchange: true },
      { nameAr: "خشم العان", nameEn: "Khashm Al An", order: 22, lat: 24.5880, lng: 46.8441, isInterchange: true },
    ],
  },

  // ── Yellow Line (Line 4) ──────────────────────────────────────────
  {
    nameAr: "الخط الأصفر",
    nameEn: "Yellow Line",
    color: "YELLOW",
    colorHex: "#eab308",
    order: 4,
    trainCount: 5,
    stations: [
      { nameAr: "المركز المالي", nameEn: "KAFD", order: 1, lat: 24.7618, lng: 46.6412, isInterchange: true },
      { nameAr: "الربيع", nameEn: "Al Rabie", order: 2, lat: 24.7550, lng: 46.6500, isInterchange: true },
      { nameAr: "طريق عثمان بن عفان", nameEn: "Othman bin Affan Road", order: 3, lat: 24.7482, lng: 46.6588, isInterchange: true },
      { nameAr: "سابك", nameEn: "SABIC", order: 4, lat: 24.7119, lng: 46.6875, isInterchange: true },
      { nameAr: "جامعة الأميرة نورة", nameEn: "Princess Noura University", order: 5, lat: 24.7162, lng: 46.7323 },
      { nameAr: "جامعة الأميرة نورة 2", nameEn: "Princess Noura University 2", order: 6, lat: 24.7200, lng: 46.7380 },
      { nameAr: "المطار T5", nameEn: "Airport T5", order: 7, lat: 24.9570, lng: 46.6988 },
      { nameAr: "المطار T3-4", nameEn: "Airport T3-4", order: 8, lat: 24.9620, lng: 46.7030 },
      { nameAr: "المطار T1-2", nameEn: "Airport T1-2", order: 9, lat: 24.9580, lng: 46.7070 },
    ],
  },

  // ── Green Line (Line 5) ──────────────────────────────────────────
  {
    nameAr: "الخط الأخضر",
    nameEn: "Green Line",
    color: "GREEN",
    colorHex: "#16a34a",
    order: 5,
    trainCount: 5,
    stations: [
      { nameAr: "وزارة التعليم", nameEn: "Ministry of Education", order: 1, lat: 24.5500, lng: 46.7000, isInterchange: true },
      { nameAr: "حديقة الملك سلمان", nameEn: "King Salman Park", order: 2, lat: 24.5580, lng: 46.7080 },
      { nameAr: "السليمانية", nameEn: "Al Sulimaniyah", order: 3, lat: 24.5660, lng: 46.7160 },
      { nameAr: "الضباب", nameEn: "Al Dhabab", order: 4, lat: 24.5740, lng: 46.7240 },
      { nameAr: "ميدان أبو ظبي", nameEn: "Abu Dhabi Square", order: 5, lat: 24.5820, lng: 46.7320 },
      { nameAr: "نادي الضباط", nameEn: "Officers Club", order: 6, lat: 24.5953, lng: 46.8358, isInterchange: true },
      { nameAr: "التأمينات الاجتماعية", nameEn: "Social Insurance", order: 7, lat: 24.6000, lng: 46.7400 },
      { nameAr: "الوزارات", nameEn: "Ministries Complex", order: 8, lat: 24.6080, lng: 46.7480 },
      { nameAr: "وزارة الدفاع", nameEn: "Ministry of Defense", order: 9, lat: 24.6537, lng: 46.7694, isInterchange: true },
      { nameAr: "مستشفى الملك عبدالعزيز", nameEn: "King Abdulaziz Hospital", order: 10, lat: 24.6610, lng: 46.7611, isInterchange: true },
      { nameAr: "وزارة المالية", nameEn: "Ministry of Finance", order: 11, lat: 24.6683, lng: 46.7528, isInterchange: true },
      { nameAr: "المتحف الوطني", nameEn: "National Museum", order: 12, lat: 24.7800, lng: 46.6100, isInterchange: true },
    ],
  },

  // ── Purple Line (Line 6) ──────────────────────────────────────────
  {
    nameAr: "الخط البنفسجي",
    nameEn: "Purple Line",
    color: "PURPLE",
    colorHex: "#9333ea",
    order: 6,
    trainCount: 6,
    stations: [
      { nameAr: "المركز المالي", nameEn: "KAFD", order: 1, lat: 24.7618, lng: 46.6412, isInterchange: true },
      { nameAr: "الربيع", nameEn: "Al Rabie", order: 2, lat: 24.7550, lng: 46.6500, isInterchange: true },
      { nameAr: "طريق عثمان بن عفان", nameEn: "Othman bin Affan Road", order: 3, lat: 24.7482, lng: 46.6588, isInterchange: true },
      { nameAr: "سابك", nameEn: "SABIC", order: 4, lat: 24.7119, lng: 46.6875, isInterchange: true },
      { nameAr: "غرناطة", nameEn: "Granada", order: 5, lat: 24.7000, lng: 46.6950 },
      { nameAr: "اليرموك", nameEn: "Al Yarmouk", order: 6, lat: 24.7027, lng: 46.6940, isInterchange: true },
      { nameAr: "الحمراء", nameEn: "Al Hamra", order: 7, lat: 24.6935, lng: 46.7005, isInterchange: true },
      { nameAr: "الأندلس", nameEn: "Al Andalus", order: 8, lat: 24.6751, lng: 46.7135, isInterchange: true },
      { nameAr: "طريق خريص", nameEn: "Khurais Road", order: 9, lat: 24.6026, lng: 46.8275, isInterchange: true },
      { nameAr: "السلام", nameEn: "Al Salam", order: 10, lat: 24.5950, lng: 46.8150 },
      { nameAr: "النسيم", nameEn: "Al Naseem", order: 11, lat: 24.5880, lng: 46.8030, isInterchange: true },
    ],
  },
];
const ALERTS = [
  {
    type: "CRITICAL",
    titleAr: "توقف قطار",
    titleEn: "Train Breakdown",
    descriptionAr: "توقف القطار B-001 بسبب عطل في النظام الكهربائي",
    descriptionEn: "Train B-001 stopped due to electrical system failure",
  },
  {
    type: "WARNING",
    titleAr: "ازدحام مرتفع",
    titleEn: "High Congestion",
    descriptionAr: "ازدحام مرتفع في محطة العليا بنسبة 92%",
    descriptionEn: "High congestion at Al Olaya station at 92%",
  },
  {
    type: "WARNING",
    titleAr: "تأخير في الخدمة",
    titleEn: "Service Delay",
    descriptionAr: "تأخير 15 دقيقة في الخط الأزرق بسبب صيانة مفاجئة",
    descriptionEn: "15-minute delay on Blue Line due to emergency maintenance",
  },
  {
    type: "CRITICAL",
    titleAr: "خلل في الكاميرا",
    titleEn: "Camera Malfunction",
    descriptionAr: "فقدان الإشارة من كاميرات المحطة الشرقية",
    descriptionEn: "Lost signal from Eastern Terminal cameras",
  },
  {
    type: "INFO",
    titleAr: "اكتمال الصيانة",
    titleEn: "Maintenance Completed",
    descriptionAr: "اكتملت صيانة القطار R-003 بنجاح",
    descriptionEn: "Maintenance completed successfully on train R-003",
  },
  {
    type: "CRITICAL",
    titleAr: "حريق في المحطة",
    titleEn: "Station Fire Alarm",
    descriptionAr: "تنبيه حريق في محطة المطار - تفعيل إجراءات الطوارئ",
    descriptionEn: "Fire alarm at Airport station - emergency procedures activated",
  },
  {
    type: "WARNING",
    titleAr: "ارتفاع درجة الحرارة",
    titleEn: "High Temperature",
    descriptionAr: "ارتفاع درجة حرارة معدات التبريد في محطة البطحاء",
    descriptionEn: "Elevated cooling equipment temperature at Al Batha station",
  },
  {
    type: "INFO",
    titleAr: "تحديث النظام",
    titleEn: "System Update",
    descriptionAr: "تم تحديث نظام التحكم في الإشارات بنجاح",
    descriptionEn: "Signal control system updated successfully",
  },
  {
    type: "CRITICAL",
    titleAr: "انقطاع الكهرباء",
    titleEn: "Power Outage",
    descriptionAr: "انقطاع جزئي في التيار الكهربائي على الخط البرتقالي",
    descriptionEn: "Partial power outage on Orange Line",
  },
];

const SETTINGS_DATA = [
  { key: "system_name", value: "TrainEye AI - Riyadh Metro" },
  { key: "system_name_ar", value: "ذكار القطار - مترو الرياض" },
  { key: "max_passenger_density", value: "100" },
  { key: "alert_threshold_critical", value: "90" },
  { key: "alert_threshold_warning", value: "75" },
  { key: "maintenance_interval_hours", value: "720" },
  { key: "train_max_speed_kmh", value: "120" },
  { key: "default_train_capacity", value: "1000" },
  { key: "station_camera_count", value: "3" },
  { key: "notification_retention_days", value: "90" },
  { key: "audit_log_retention_days", value: "365" },
  { key: "language_default", value: "ar" },
  { key: "theme", value: "dark" },
  { key: "auto_dispatch_enabled", value: "true" },
  { key: "ai_predictions_enabled", value: "true" },
];

const PERMISSIONS_LIST = [
  "view_dashboard",
  "manage_trains",
  "manage_stations",
  "manage_alerts",
  "manage_users",
  "view_analytics",
  "manage_maintenance",
  "manage_settings",
  "view_cameras",
  "manage_cameras",
  "view_audit_logs",
  "manage_notifications",
  "view_passenger_data",
  "manage_fleet",
  "system_admin",
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
async function main() {
  if (await hasData()) {
    console.log("⚡ Database already seeded – skipping.");
    return;
  }

  console.log("🚀 Seeding TrainEye AI database...");

  const password = await bcrypt.hash("metro123", 10);

  // ── 1. Roles & Permissions ──────────────────────────────────────────
  console.log("  → Creating roles & permissions...");

  const operationsRole = await prisma.role.create({
    data: {
      name: "OPERATIONS",
      description: "فريق العمليات - صلاحية كاملة على جميع الأنظمة",
      permissions: { create: PERMISSIONS_LIST.map((p) => ({ name: p })) },
    },
  });

  const stationMgrRole = await prisma.role.create({
    data: {
      name: "STATION_MANAGER",
      description: "مدير محطة - يمكنه إدارة تنبيهات محطته فقط",
      permissions: { create: [{ name: "view_dashboard" }, { name: "manage_alerts" }, { name: "view_analytics" }, { name: "view_cameras" }, { name: "view_passenger_data" }] },
    },
  });

  const securityRole = await prisma.role.create({
    data: {
      name: "SECURITY",
      description: "فريق الأمن - يمكنه إدارة بلاغات الحوادث",
      permissions: { create: [{ name: "view_dashboard" }, { name: "view_cameras" }, { name: "manage_alerts" }] },
    },
  });

  // ── 2. Users (basic, no station link yet) ────────────────────────
  console.log("  → Creating users...");
  const usersData = [
    { employeeId: "OP-001", name: "أحمد الشمري", email: "admin@traineye.sa", roleId: operationsRole.id },
    { employeeId: "OP-002", name: "محمد العتيبي", email: "op1@traineye.sa", roleId: operationsRole.id },
    { employeeId: "OP-003", name: "سعد القحطاني", email: "op2@traineye.sa", roleId: operationsRole.id },
    { employeeId: "SM-001", name: "فهد المطيري", email: "sm1@traineye.sa", roleId: stationMgrRole.id },
    { employeeId: "SM-002", name: "ناصر الدوسري", email: "sm2@traineye.sa", roleId: stationMgrRole.id },
    { employeeId: "SM-003", name: "عبدالله الزهراني", email: "sm3@traineye.sa", roleId: stationMgrRole.id },
    { employeeId: "SM-004", name: "خالد الغامدي", email: "sm4@traineye.sa", roleId: stationMgrRole.id },
    { employeeId: "SM-005", name: "فيصل الحربي", email: "sm5@traineye.sa", roleId: stationMgrRole.id },
    { employeeId: "SM-006", name: "ماجد العجمي", email: "sm6@traineye.sa", roleId: stationMgrRole.id },
    { employeeId: "SEC-001", name: "نايف الرشيدي", email: "sec1@traineye.sa", roleId: securityRole.id },
    { employeeId: "SEC-002", name: "بدر العنزي", email: "sec2@traineye.sa", roleId: securityRole.id },
  ];

  const createdUsers: { id: string; employeeId: string; name: string; roleId: string }[] = [];
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: { ...u, password },
    });
    createdUsers.push(user);
  }

  // ── 3. Lines & Stations ──────────────────────────────────────────
  console.log("  → Creating lines and stations...");
  const allStationsByLine: Record<string, { id: string; nameEn: string; order: number }[]> = {};

  for (const lineDef of LINES) {
    const line = await prisma.line.create({
      data: {
        nameAr: lineDef.nameAr,
        nameEn: lineDef.nameEn,
        color: lineDef.color,
        colorHex: lineDef.colorHex,
        order: lineDef.order,
      },
    });

    allStationsByLine[line.id] = [];

    for (const s of lineDef.stations) {
      const station = await prisma.station.create({
        data: {
          nameAr: s.nameAr,
          nameEn: s.nameEn,
          lineId: line.id,
          order: s.order,
          lat: s.lat,
          lng: s.lng,
          isInterchange: s.isInterchange ?? false,
        },
      });
      allStationsByLine[line.id].push({
        id: station.id,
        nameEn: s.nameEn,
        order: s.order,
      });
    }

    // ── 4. Trains ──────────────────────────────────────────────────
    console.log(`  → Creating ${lineDef.trainCount} trains for ${lineDef.nameEn}...`);
    const firstStation = allStationsByLine[line.id][0];
    const midIdx = Math.floor(lineDef.stations.length / 2);
    const midStation = allStationsByLine[line.id][midIdx];
    const lastStation = allStationsByLine[line.id][allStationsByLine[line.id].length - 1];

    const colorPrefix = lineDef.color.charAt(0);

    for (let i = 1; i <= lineDef.trainCount; i++) {
      const code = `${lineDef.color}-${String(i).padStart(3, "0")}`;
      const name = `${colorPrefix}-${String(i).padStart(3, "0")}`;
      const isAtMid = i <= Math.ceil(lineDef.trainCount / 2);
      const currentStationId = isAtMid ? midStation.id : lastStation.id;

      await prisma.train.create({
        data: {
          name,
          code,
          lineId: line.id,
          status: i === lineDef.trainCount ? "MAINTENANCE" : "ACTIVE",
          speed: i === lineDef.trainCount ? 0 : Math.round(Math.random() * 80 + 20),
          direction: i % 2 === 0 ? "forward" : "reverse",
          currentStationId,
          capacity: 1000,
          passengerCount: Math.round(Math.random() * 800 + 50),
          lastMaintenance: hoursAgo(Math.round(Math.random() * 720 + 24)),
          nextMaintenance: minutesFromNow(Math.round(Math.random() * 720 + 48)),
        },
      });
    }

    // ── 5. Cameras (2-3 per station) ──────────────────────────────
    console.log(`  → Creating cameras for ${lineDef.nameEn} stations...`);
    for (const st of allStationsByLine[line.id]) {
      const camCount = st.order % 3 === 0 ? 3 : 2;
      for (let c = 1; c <= camCount; c++) {
        await prisma.camera.create({
          data: {
            name: `${st.nameEn} Cam ${c}`,
            stationId: st.id,
            status: "ACTIVE",
            streamUrl: `rtsp://cameras.traineye.sa/${lineDef.color.toLowerCase()}/${st.order}/${c}`,
          },
        });
      }
    }
  }

  // ── 6. Assign Station Managers ─────────────────────────────────
  console.log("  → Assigning station managers to stations...");
  const stationMgrUsers = createdUsers.filter(u => u.roleId === stationMgrRole.id);
  const allStas = await prisma.station.findMany({ orderBy: { order: "asc" }, take: stationMgrUsers.length });
  for (let i = 0; i < stationMgrUsers.length && i < allStas.length; i++) {
    await prisma.user.update({
      where: { id: stationMgrUsers[i].id },
      data: { stationId: allStas[i].id },
    });
  }

  // ── 7. Alerts ──────────────────────────────────────────────────
  console.log("  → Creating alerts...");
  const blueLineId = (await prisma.line.findFirst({ where: { color: "BLUE" } }))!.id;
  const redLineId = (await prisma.line.findFirst({ where: { color: "RED" } }))!.id;
  const orangeLineId = (await prisma.line.findFirst({ where: { color: "ORANGE" } }))!.id;

  const allStations = await prisma.station.findMany({ take: 20 });

  for (let i = 0; i < ALERTS.length; i++) {
    const a = ALERTS[i];
    const stationIdx = i % allStations.length;
    const lineId = i % 3 === 0 ? blueLineId : i % 3 === 1 ? redLineId : orangeLineId;

    await prisma.alert.create({
      data: {
        type: a.type,
        titleAr: a.titleAr,
        titleEn: a.titleEn,
        descriptionAr: a.descriptionAr,
        descriptionEn: a.descriptionEn,
        stationId: allStations[stationIdx].id,
        lineId,
        isAcknowledged: i >= 6,
      },
    });
  }

  // ── 8. Passenger Records (24h data for multiple stations) ──────
  console.log("  → Creating passenger records...");
  const sampleStations = allStations.slice(0, 15);
  for (const st of sampleStations) {
    const stLineId = st.lineId;
    for (let h = 0; h < 24; h++) {
      const hour = h;
      const baseCount = hour >= 7 && hour <= 9 ? 800 :
        hour >= 17 && hour <= 19 ? 750 :
          hour >= 12 && hour <= 14 ? 500 :
            hour >= 22 || hour <= 5 ? 50 : 300;
      const count = baseCount + Math.round(Math.random() * 200 - 100);
      const density = Math.min(100, Math.round((count / 1000) * 100));

      await prisma.passengerRecord.create({
        data: {
          stationId: st.id,
          lineId: stLineId,
          count: Math.max(0, count),
          densityPercent: Math.max(0, Math.min(100, density)),
          timestamp: hoursAgo(24 - h),
        },
      });
    }
  }

  // ── 9. System Health Records ────────────────────────────────────
  console.log("  → Creating system health records...");
  for (let h = 0; h < 48; h++) {
    const health = 99.5 - Math.random() * 1.5;
    await prisma.systemHealth.create({
      data: {
        healthPercent: Math.round(health * 100) / 100,
        uptimeSeconds: 86400 + h * 3600,
        timestamp: hoursAgo(48 - h),
      },
    });
  }

  // ── 10. Fleet Records ───────────────────────────────────────────
  console.log("  → Creating fleet records...");
  const totalTrains = await prisma.train.count();
  const activeTrains = await prisma.train.count({ where: { status: "ACTIVE" } });
  const maintenanceTrains = await prisma.train.count({ where: { status: "MAINTENANCE" } });

  await prisma.fleet.create({
    data: {
      name: "Riyadh Metro Fleet",
      total: totalTrains,
      active: activeTrains,
      maintenance: maintenanceTrains,
      available: totalTrains - maintenanceTrains,
    },
  });

  // ── 11. Sample Trips ───────────────────────────────────────────
  console.log("  → Creating sample trips...");
  const trains = await prisma.train.findMany({ take: 20 });
  for (const train of trains) {
    const lineStations = allStationsByLine[train.lineId] ?? [];
    if (lineStations.length < 2) continue;

    const fromIdx = Math.floor(Math.random() * (lineStations.length - 1));
    const toIdx = fromIdx + 1;

    await prisma.trip.create({
      data: {
        trainId: train.id,
        lineId: train.lineId,
        fromStationId: lineStations[fromIdx].id,
        toStationId: lineStations[toIdx].id,
        status: Math.random() > 0.3 ? "COMPLETED" : "ON_TIME",
        scheduledAt: hoursAgo(Math.round(Math.random() * 12 + 1)),
        actualStartAt: hoursAgo(Math.round(Math.random() * 10 + 1)),
        actualEndAt: hoursAgo(Math.round(Math.random() * 8)),
        delayMinutes: Math.random() > 0.8 ? Math.round(Math.random() * 15) : 0,
        passengerCount: Math.round(Math.random() * 600 + 100),
      },
    });
  }

  // ── 12. Maintenance Records ─────────────────────────────────────
  console.log("  → Creating maintenance records...");
  const maintenanceTypes = ["preventive", "corrective", "emergency"];
  const maintenanceStatuses: string[] = ["COMPLETED", "SCHEDULED", "ACTIVE"];

  for (const train of trains.slice(0, 15)) {
    const type = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
    const scheduled = hoursAgo(Math.round(Math.random() * 168 + 24));
    const isCompleted = Math.random() > 0.4;

    await prisma.maintenanceRecord.create({
      data: {
        trainId: train.id,
        type,
        description: `${type === "preventive" ? "Preventive" : type === "corrective" ? "Corrective" : "Emergency"} maintenance for ${train.code}`,
        status: isCompleted ? "COMPLETED" : "SCHEDULED",
        scheduledAt: scheduled,
        completedAt: isCompleted ? new Date(scheduled.getTime() + 3600000) : null,
      },
    });
  }

  // ── 13. Notifications ──────────────────────────────────────────
  console.log("  → Creating notifications...");
  const notifTitles = [
    { title: "New alert on Blue Line", message: "Critical: Train B-001 breakdown" },
    { title: "Maintenance scheduled", message: "Preventive maintenance for R-003 tomorrow" },
    { title: "High passenger density", message: "Al Olaya station at 92% capacity" },
    { title: "System health restored", message: "All systems operating at 99.8%" },
    { title: "New user registered", message: "Operator account created for Mohammed" },
  ];

  for (const n of notifTitles) {
    await prisma.notification.create({
      data: {
        title: n.title,
        message: n.message,
        type: "INFO",
        isRead: false,
      },
    });
  }

  // ── 14. Audit Log entries ──────────────────────────────────────
  console.log("  → Creating audit logs...");
  const auditActions = ["login", "create_alert", "update_train", "view_dashboard", "manage_users"];
  for (let i = 0; i < 10; i++) {
    await prisma.auditLog.create({
      data: {
        action: auditActions[i % auditActions.length],
        details: `Action performed at ${new Date().toISOString()}`,
        ipAddress: `192.168.1.${Math.round(Math.random() * 254 + 1)}`,
      },
    });
  }

  // ── 15. Settings ───────────────────────────────────────────────
  console.log("  → Creating settings...");
  for (const s of SETTINGS_DATA) {
    await prisma.settings.create({ data: { key: s.key, value: s.value } });
  }

  // ── 16. Chat Messages (sample) ─────────────────────────────────
  console.log("  → Creating sample chat messages...");
  await prisma.chatMessage.create({
    data: {
      role: "user",
      content: "ما حالة الخط الأزرق؟",
    },
  });
  await prisma.chatMessage.create({
    data: {
      role: "assistant",
      content: "الخط الأزرق يعمل بشكل طبيعي. جميع القطارات في الخدمة عدا B-001 قيد الصيانة.",
      metadata: JSON.stringify({ line: "BLUE", activeTrains: 9, maintenanceTrains: 1 }),
    },
  });

  // ── 17. Incident Reports ─────────────────────────────────────────
  console.log("  → Creating sample incident reports...");
  const securityUsers = createdUsers.filter(u => u.roleId === securityRole.id);
  const incidentStations = await prisma.station.findMany({ take: 5 });
  if (incidentStations.length > 0 && securityUsers.length > 0) {
    const incidents = [
      { type: "SUSPICIOUS", description: "شخص مشبوه يحاول تجاوز البوابات الإلكترونية", stationId: incidentStations[0].id, priority: "HIGH" },
      { type: "DAMAGE", description: "تخريب في جهاز التذاكر بالرصيف رقم 2", stationId: incidentStations[1].id, priority: "MEDIUM" },
      { type: "MEDICAL", description: "شخص بحاجة إلى إسعاف في المدخل الرئيسي", stationId: incidentStations[2].id, priority: "HIGH" },
      { type: "THEFT", description: "سرقة هاتف من أحد الركاب", stationId: incidentStations[3].id, priority: "MEDIUM" },
      { type: "FIRE", description: "انبعاث دخان من صندوق كهربائي", stationId: incidentStations[4].id, priority: "CRITICAL", status: "RESOLVED" },
    ];
    for (const inc of incidents) {
      await prisma.incidentReport.create({
        data: {
          type: inc.type,
          description: inc.description,
          stationId: inc.stationId,
          priority: inc.priority,
          status: inc.status || "OPEN",
          reportedById: securityUsers[0].id,
          assignedToId: securityUsers[inc.type === "FIRE" ? 1 : 0].id,
          ...(inc.status === "RESOLVED" ? { resolvedAt: new Date() } : {}),
        },
      });
    }
  }

  console.log("✅ Seeding complete!");
  console.log(`   Lines: ${LINES.length}`);
  console.log(`   Stations: ${Object.values(allStationsByLine).flat().length}`);
  console.log(`   Trains: ${totalTrains}`);
  console.log(`   Cameras: ${await prisma.camera.count()}`);
  console.log(`   Alerts: ${ALERTS.length}`);
  console.log(`   Passenger Records: ${await prisma.passengerRecord.count()}`);
  console.log(`   Trips: ${await prisma.trip.count()}`);
  console.log(`   Maintenance Records: ${await prisma.maintenanceRecord.count()}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
