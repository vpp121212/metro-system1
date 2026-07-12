import { PrismaClient, Status, LineColor } from "@prisma/client";

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
  color: LineColor;
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
    color: LineColor.BLUE,
    colorHex: "#2563eb",
    order: 1,
    trainCount: 10,
    stations: [
      { nameAr: "ال financial District", nameEn: "King Abdullah Financial District", order: 1, lat: 24.7618, lng: 46.6412, isInterchange: true },
      { nameAr: "الأمير سلطان", nameEn: "Prince Sultan", order: 2, lat: 24.7561, lng: 46.6524 },
      { nameAr: "العليا", nameEn: "Al Olaya", order: 3, lat: 24.7487, lng: 46.6615, isInterchange: true },
      { nameAr: "طريق الملك فهد", nameEn: "King Fahd Road", order: 4, lat: 24.7413, lng: 46.6698 },
      { nameAr: "السويلمية", nameEn: "Al Swaylimiyah", order: 5, lat: 24.7340, lng: 46.6781 },
      { nameAr: "حي المروج", nameEn: "Al Muruj", order: 6, lat: 24.7267, lng: 46.6864 },
      { nameAr: "طريق الدمام", nameEn: "Dammam Road", order: 7, lat: 24.7194, lng: 46.6947 },
      { nameAr: "حي النخيل", nameEn: "Al Nakheel", order: 8, lat: 24.7121, lng: 46.7030 },
      { nameAr: "حي الياسمين", nameEn: "Al Yasmin", order: 9, lat: 24.7048, lng: 46.7113 },
      { nameAr: "حي الراكة", nameEn: "Al Raka", order: 10, lat: 24.6975, lng: 46.7196 },
      { nameAr: "حي النزهة", nameEn: "Al Nuzha", order: 11, lat: 24.6902, lng: 46.7279 },
      { nameAr: "حي الصفا", nameEn: "Al Safa", order: 12, lat: 24.6829, lng: 46.7362 },
      { nameAr: "حي العارض", nameEn: "Al Aard", order: 13, lat: 24.6756, lng: 46.7445 },
      { nameAr: "حي الملقا", nameEn: "Al Malqa", order: 14, lat: 24.6683, lng: 46.7528 },
      { nameAr: "حي الصحافة", nameEn: "Al Sahafa", order: 15, lat: 24.6610, lng: 46.7611 },
      { nameAr: "حي الورود", nameEn: "Al Worood", order: 16, lat: 24.6537, lng: 46.7694 },
      { nameAr: "حي الندى", nameEn: "Al Nada", order: 17, lat: 24.6464, lng: 46.7777 },
      { nameAr: "حي الرائد", nameEn: "Al Raid", order: 18, lat: 24.6391, lng: 46.7860 },
      { nameAr: "حي الزهراء", nameEn: "Al Zahra", order: 19, lat: 24.6318, lng: 46.7943 },
      { nameAr: "حي الريان", nameEn: "Al Rayyan", order: 20, lat: 24.6245, lng: 46.8026 },
      { nameAr: "حي التحلية", nameEn: "Al Tahliyah", order: 21, lat: 24.6172, lng: 46.8109 },
      { nameAr: "حي المحمدية", nameEn: "Al Mohammadiyah", order: 22, lat: 24.6099, lng: 46.8192 },
      { nameAr: "حي العزيزية", nameEn: "Al Aziziyah", order: 23, lat: 24.6026, lng: 46.8275 },
      { nameAr: "حي الفيصلية", nameEn: "Al Faisaliyah", order: 24, lat: 24.5953, lng: 46.8358 },
      { nameAr: "المحطة الجنوبية", nameEn: "Southern Terminal", order: 25, lat: 24.5880, lng: 46.8441 },
    ],
  },

  // ── Red Line (Line 2) ──────────────────────────────────────────────
  {
    nameAr: "الخط الأحمر",
    nameEn: "Red Line",
    color: LineColor.RED,
    colorHex: "#dc2626",
    order: 2,
    trainCount: 8,
    stations: [
      { nameAr: "ال financial District", nameEn: "King Abdullah Financial District", order: 1, lat: 24.7618, lng: 46.6412, isInterchange: true },
      { nameAr: "حي العليا", nameEn: "Al Olaya", order: 2, lat: 24.7487, lng: 46.6615, isInterchange: true },
      { nameAr: "حي الراكة الشمالية", nameEn: "Al Raka North", order: 3, lat: 24.7395, lng: 46.6680 },
      { nameAr: "حي الراكة الجنوبية", nameEn: "Al Raka South", order: 4, lat: 24.7303, lng: 46.6745 },
      { nameAr: "حي الحمراء", nameEn: "Al Hamra", order: 5, lat: 24.7211, lng: 46.6810 },
      { nameAr: "حي البطحاء", nameEn: "Al Batha", order: 6, lat: 24.7119, lng: 46.6875 },
      { nameAr: "حي الصالحية", nameEn: "Al Salhiyah", order: 7, lat: 24.7027, lng: 46.6940 },
      { nameAr: "حي الشمية", nameEn: "Al Shumaisi", order: 8, lat: 24.6935, lng: 46.7005 },
      { nameAr: "حي الدريهمية", nameEn: "Al Diraihimiyah", order: 9, lat: 24.6843, lng: 46.7070 },
      { nameAr: "حي المنصورة", nameEn: "Al Mansourah", order: 10, lat: 24.6751, lng: 46.7135 },
      { nameAr: "حي الدفاع", nameEn: "Al Defaa", order: 11, lat: 24.6659, lng: 46.7200 },
      { nameAr: "حي العرقة", nameEn: "Al Arqah", order: 12, lat: 24.6567, lng: 46.7265 },
      { nameAr: "حي السلامة", nameEn: "Al Salamah", order: 13, lat: 24.6475, lng: 46.7330 },
      { nameAr: "طريق الخرج", nameEn: "Al Kharj Road", order: 14, lat: 24.6383, lng: 46.7395 },
      { nameAr: "المحطة الشرقية", nameEn: "Eastern Terminal", order: 15, lat: 24.6291, lng: 46.7460 },
    ],
  },

  // ── Orange Line (Line 3) ──────────────────────────────────────────
  {
    nameAr: "الخط البرتقالي",
    nameEn: "Orange Line",
    color: LineColor.ORANGE,
    colorHex: "#ea580c",
    order: 3,
    trainCount: 8,
    stations: [
      { nameAr: "الجمارك", nameEn: "Al Jamarat", order: 1, lat: 24.7700, lng: 46.6200 },
      { nameAr: "حي المربع", nameEn: "Al Murabba", order: 2, lat: 24.7630, lng: 46.6280 },
      { nameAr: "حي السفارات", nameEn: "Embassy District", order: 3, lat: 24.7560, lng: 46.6360 },
      { nameAr: "حي السفاح", nameEn: "Al Safi", order: 4, lat: 24.7490, lng: 46.6440 },
      { nameAr: "حي الناصرية", nameEn: "Al Nasiriyah", order: 5, lat: 24.7420, lng: 46.6520 },
      { nameAr: "حي الفيحاء", nameEn: "Al Faiha", order: 6, lat: 24.7350, lng: 46.6600 },
      { nameAr: "حي الجزيرة", nameEn: "Al Jazirah", order: 7, lat: 24.7280, lng: 46.6680 },
      { nameAr: "حي العليا", nameEn: "Al Olaya", order: 8, lat: 24.7487, lng: 46.6615, isInterchange: true },
      { nameAr: "حي الورود", nameEn: "Al Worood", order: 9, lat: 24.6537, lng: 46.7694, isInterchange: true },
      { nameAr: "حي المروج", nameEn: "Al Muruj", order: 10, lat: 24.7267, lng: 46.6864, isInterchange: true },
      { nameAr: "حي النخيل", nameEn: "Al Nakheel", order: 11, lat: 24.7121, lng: 46.7030, isInterchange: true },
      { nameAr: "حي العارض", nameEn: "Al Aard", order: 12, lat: 24.6756, lng: 46.7445, isInterchange: true },
      { nameAr: "حي الروضة", nameEn: "Al Rawdah", order: 13, lat: 24.6600, lng: 46.7500 },
      { nameAr: "حي الأمير سلطان", nameEn: "Al Prince Sultan", order: 14, lat: 24.6500, lng: 46.7560 },
      { nameAr: "حي الغدير", nameEn: "Al Ghadir", order: 15, lat: 24.6400, lng: 46.7620 },
      { nameAr: "حي العارض", nameEn: "Al Aard South", order: 16, lat: 24.6300, lng: 46.7680 },
      { nameAr: "حي الشفاء", nameEn: "Al Shifa", order: 17, lat: 24.6200, lng: 46.7740 },
      { nameAr: "حي المهدية", nameEn: "Al Mahdiyah", order: 18, lat: 24.6100, lng: 46.7800 },
      { nameAr: "حي النزهة", nameEn: "Al Nuzha", order: 19, lat: 24.6000, lng: 46.7860 },
      { nameAr: "حي العزيزية", nameEn: "Al Aziziyah", order: 20, lat: 24.5900, lng: 46.7920, isInterchange: true },
      { nameAr: "طريق الخرج", nameEn: "Al Kharj Road", order: 21, lat: 24.6383, lng: 46.7395, isInterchange: true },
      { nameAr: "المحطة الجنوبية", nameEn: "Southern Terminal", order: 22, lat: 24.5880, lng: 46.8441, isInterchange: true },
    ],
  },

  // ── Yellow Line (Line 4) ──────────────────────────────────────────
  {
    nameAr: "الخط الأصفر",
    nameEn: "Yellow Line",
    color: LineColor.YELLOW,
    colorHex: "#eab308",
    order: 4,
    trainCount: 5,
    stations: [
      { nameAr: "مطار الملك عبدالعزيز", nameEn: "King Abdulaziz International Airport", order: 1, lat: 24.5597, lng: 46.6988 },
      { nameAr: "حي الحمراء", nameEn: "Al Hamra", order: 2, lat: 24.5650, lng: 46.7050, isInterchange: true },
      { nameAr: "حي النزهة", nameEn: "Al Nuzha", order: 3, lat: 24.5703, lng: 46.7112 },
      { nameAr: "حي الصفا", nameEn: "Al Safa", order: 4, lat: 24.5756, lng: 46.7174 },
      { nameAr: "حي المروج", nameEn: "Al Muruj", order: 5, lat: 24.5809, lng: 46.7236, isInterchange: true },
      { nameAr: "حي الياسمين", nameEn: "Al Yasmin", order: 6, lat: 24.5862, lng: 46.7298 },
      { nameAr: "حي الراكة", nameEn: "Al Raka", order: 7, lat: 24.5915, lng: 46.7360 },
      { nameAr: "حي العزيزية", nameEn: "Al Aziziyah", order: 8, lat: 24.5968, lng: 46.7422, isInterchange: true },
      { nameAr: "حي السالمية", nameEn: "Al Salamiyah", order: 9, lat: 24.6021, lng: 46.7484 },
    ],
  },

  // ── Green Line (Line 5) ──────────────────────────────────────────
  {
    nameAr: "الخط الأخضر",
    nameEn: "Green Line",
    color: LineColor.GREEN,
    colorHex: "#16a34a",
    order: 5,
    trainCount: 5,
    stations: [
      { nameAr: "المحطة الجنوبية", nameEn: "Southern Station", order: 1, lat: 24.5500, lng: 46.7000, isInterchange: true },
      { nameAr: "حي الندى", nameEn: "Al Nada", order: 2, lat: 24.5580, lng: 46.7080 },
      { nameAr: "حي الريان", nameEn: "Al Rayyan", order: 3, lat: 24.5660, lng: 46.7160 },
      { nameAr: "حي التحلية", nameEn: "Al Tahliyah", order: 4, lat: 24.5740, lng: 46.7240 },
      { nameAr: "حي المحمدية", nameEn: "Al Mohammadiyah", order: 5, lat: 24.5820, lng: 46.7320 },
      { nameAr: "حي الفيصلية", nameEn: "Al Faisaliyah", order: 6, lat: 24.5953, lng: 46.8358, isInterchange: true },
      { nameAr: "حي الزهراء", nameEn: "Al Zahra", order: 7, lat: 24.6000, lng: 46.7400 },
      { nameAr: "حي الرائد", nameEn: "Al Raid", order: 8, lat: 24.6080, lng: 46.7480 },
      { nameAr: "حي الورود", nameEn: "Al Worood", order: 9, lat: 24.6537, lng: 46.7694, isInterchange: true },
      { nameAr: "حي الصحافة", nameEn: "Al Sahafa", order: 10, lat: 24.6610, lng: 46.7611, isInterchange: true },
      { nameAr: "حي الملقا", nameEn: "Al Malqa", order: 11, lat: 24.6683, lng: 46.7528, isInterchange: true },
      { nameAr: "المحطة الشمالية", nameEn: "Northern Station", order: 12, lat: 24.7800, lng: 46.6100 },
    ],
  },

  // ── Purple Line (Line 6) ──────────────────────────────────────────
  {
    nameAr: "الخط البنفسجي",
    nameEn: "Purple Line",
    color: LineColor.PURPLE,
    colorHex: "#9333ea",
    order: 6,
    trainCount: 6,
    stations: [
      { nameAr: "ال financial District", nameEn: "King Abdullah Financial District", order: 1, lat: 24.7618, lng: 46.6412, isInterchange: true },
      { nameAr: "حي القصيم", nameEn: "Al Qassim", order: 2, lat: 24.7550, lng: 46.6500 },
      { nameAr: "حي القصيصة", nameEn: "Al Qusaizah", order: 3, lat: 24.7482, lng: 46.6588 },
      { nameAr: "حي البطحاء", nameEn: "Al Batha", order: 4, lat: 24.7119, lng: 46.6875, isInterchange: true },
      { nameAr: "حي الديرة", nameEn: "Al Dirah", order: 5, lat: 24.7000, lng: 46.6950 },
      { nameAr: "حي الصالحية", nameEn: "Al Salhiyah", order: 6, lat: 24.7027, lng: 46.6940, isInterchange: true },
      { nameAr: "حي الشميسي", nameEn: "Al Shumaisi", order: 7, lat: 24.6935, lng: 46.7005, isInterchange: true },
      { nameAr: "حي المنصورة", nameEn: "Al Mansourah", order: 8, lat: 24.6751, lng: 46.7135, isInterchange: true },
      { nameAr: "حي العزيزية", nameEn: "Al Aziziyah", order: 9, lat: 24.6026, lng: 46.8275, isInterchange: true },
      { nameAr: "حي القادة", nameEn: "Al Qada", order: 10, lat: 24.5950, lng: 46.8150 },
      { nameAr: "حي القادسية", nameEn: "Al Qadisiyyah", order: 11, lat: 24.5880, lng: 46.8030 },
    ],
  },
];

const ALERTS = [
  {
    type: Status.CRITICAL,
    titleAr: "توقف قطار",
    titleEn: "Train Breakdown",
    descriptionAr: "توقف القطار B-001 بسبب عطل في النظام الكهربائي",
    descriptionEn: "Train B-001 stopped due to electrical system failure",
  },
  {
    type: Status.WARNING,
    titleAr: "ازدحام مرتفع",
    titleEn: "High Congestion",
    descriptionAr: "ازدحام مرتفع في محطة العليا بنسبة 92%",
    descriptionEn: "High congestion at Al Olaya station at 92%",
  },
  {
    type: Status.WARNING,
    titleAr: "تأخير في الخدمة",
    titleEn: "Service Delay",
    descriptionAr: "تأخير 15 دقيقة في الخط الأزرق بسبب صيانة مفاجئة",
    descriptionEn: "15-minute delay on Blue Line due to emergency maintenance",
  },
  {
    type: Status.CRITICAL,
    titleAr: "خلل في الكاميرا",
    titleEn: "Camera Malfunction",
    descriptionAr: "فقدان الإشارة من كاميرات المحطة الشرقية",
    descriptionEn: "Lost signal from Eastern Terminal cameras",
  },
  {
    type: Status.INFO,
    titleAr: "اكتمال الصيانة",
    titleEn: "Maintenance Completed",
    descriptionAr: "اكتملت صيانة القطار R-003 بنجاح",
    descriptionEn: "Maintenance completed successfully on train R-003",
  },
  {
    type: Status.CRITICAL,
    titleAr: "حريق في المحطة",
    titleEn: "Station Fire Alarm",
    descriptionAr: "تنبيه حريق في محطة المطار - تفعيل إجراءات الطوارئ",
    descriptionEn: "Fire alarm at Airport station - emergency procedures activated",
  },
  {
    type: Status.WARNING,
    titleAr: "ارتفاع درجة الحرارة",
    titleEn: "High Temperature",
    descriptionAr: "ارتفاع درجة حرارة معدات التبريد في محطة البطحاء",
    descriptionEn: "Elevated cooling equipment temperature at Al Batha station",
  },
  {
    type: Status.INFO,
    titleAr: "تحديث النظام",
    titleEn: "System Update",
    descriptionAr: "تم تحديث نظام التحكم في الإشارات بنجاح",
    descriptionEn: "Signal control system updated successfully",
  },
  {
    type: Status.CRITICAL,
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

  // ── 1. Roles & Permissions ──────────────────────────────────────────
  console.log("  → Creating roles & permissions...");
  const adminRole = await prisma.role.create({
    data: {
      name: "ADMIN",
      description: "System administrator with full access",
      permissions: {
        create: PERMISSIONS_LIST.map((p) => ({ name: p })),
      },
    },
  });

  const operatorRole = await prisma.role.create({
    data: {
      name: "OPERATOR",
      description: "Metro operator – can manage trains, trips, and alerts",
      permissions: {
        create: [
          { name: "view_dashboard" },
          { name: "manage_trains" },
          { name: "manage_alerts" },
          { name: "view_analytics" },
          { name: "view_cameras" },
          { name: "view_passenger_data" },
          { name: "manage_notifications" },
        ],
      },
    },
  });

  const viewerRole = await prisma.role.create({
    data: {
      name: "VIEWER",
      description: "Read-only access to dashboards and analytics",
      permissions: {
        create: [
          { name: "view_dashboard" },
          { name: "view_analytics" },
          { name: "view_passenger_data" },
        ],
      },
    },
  });

  const maintenanceRole = await prisma.role.create({
    data: {
      name: "MAINTENANCE",
      description: "Maintenance crew – can manage maintenance records and view fleet",
      permissions: {
        create: [
          { name: "view_dashboard" },
          { name: "manage_maintenance" },
          { name: "manage_fleet" },
          { name: "view_cameras" },
        ],
      },
    },
  });

  // ── 2. Admin User ──────────────────────────────────────────────────
  console.log("  → Creating admin user...");
  await prisma.user.create({
    data: {
      name: "أحمد الشمري",
      email: "admin@traineye.sa",
      password: "$2b$10$placeholder_hash_should_be_replaced_with_real_bcrypt_hash",
      roleId: adminRole.id,
      avatar: "/avatars/admin.png",
      isActive: true,
    },
  });

  await prisma.user.create({
    data: {
      name: "محمد العتيبي",
      email: "operator@traineye.sa",
      password: "$2b$10$placeholder_hash_should_be_replaced_with_real_bcrypt_hash",
      roleId: operatorRole.id,
      isActive: true,
    },
  });

  await prisma.user.create({
    data: {
      name: "فهد المطيري",
      email: "maintenance@traineye.sa",
      password: "$2b$10$placeholder_hash_should_be_replaced_with_real_bcrypt_hash",
      roleId: maintenanceRole.id,
      isActive: true,
    },
  });

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
          status: i === lineDef.trainCount ? Status.MAINTENANCE : Status.ACTIVE,
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
            status: Status.ACTIVE,
            streamUrl: `rtsp://cameras.traineye.sa/${lineDef.color.toLowerCase()}/${st.order}/${c}`,
          },
        });
      }
    }
  }

  // ── 6. Alerts ──────────────────────────────────────────────────
  console.log("  → Creating alerts...");
  const blueLineId = (await prisma.line.findFirst({ where: { color: LineColor.BLUE } }))!.id;
  const redLineId = (await prisma.line.findFirst({ where: { color: LineColor.RED } }))!.id;
  const orangeLineId = (await prisma.line.findFirst({ where: { color: LineColor.ORANGE } }))!.id;

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

  // ── 7. Passenger Records (24h data for multiple stations) ──────
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

  // ── 8. System Health Records ────────────────────────────────────
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

  // ── 9. Fleet Records ────────────────────────────────────────────
  console.log("  → Creating fleet records...");
  const totalTrains = await prisma.train.count();
  const activeTrains = await prisma.train.count({ where: { status: Status.ACTIVE } });
  const maintenanceTrains = await prisma.train.count({ where: { status: Status.MAINTENANCE } });

  await prisma.fleet.create({
    data: {
      name: "Riyadh Metro Fleet",
      total: totalTrains,
      active: activeTrains,
      maintenance: maintenanceTrains,
      available: totalTrains - maintenanceTrains,
    },
  });

  // ── 10. Sample Trips ───────────────────────────────────────────
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
        status: Math.random() > 0.3 ? Status.COMPLETED : Status.ON_TIME,
        scheduledAt: hoursAgo(Math.round(Math.random() * 12 + 1)),
        actualStartAt: hoursAgo(Math.round(Math.random() * 10 + 1)),
        actualEndAt: hoursAgo(Math.round(Math.random() * 8)),
        delayMinutes: Math.random() > 0.8 ? Math.round(Math.random() * 15) : 0,
        passengerCount: Math.round(Math.random() * 600 + 100),
      },
    });
  }

  // ── 11. Maintenance Records ─────────────────────────────────────
  console.log("  → Creating maintenance records...");
  const maintenanceTypes = ["preventive", "corrective", "emergency"];
  const maintenanceStatuses: Status[] = [Status.COMPLETED, Status.SCHEDULED, Status.ACTIVE];

  for (const train of trains.slice(0, 15)) {
    const type = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
    const scheduled = hoursAgo(Math.round(Math.random() * 168 + 24));
    const isCompleted = Math.random() > 0.4;

    await prisma.maintenanceRecord.create({
      data: {
        trainId: train.id,
        type,
        description: `${type === "preventive" ? "Preventive" : type === "corrective" ? "Corrective" : "Emergency"} maintenance for ${train.code}`,
        status: isCompleted ? Status.COMPLETED : Status.SCHEDULED,
        scheduledAt: scheduled,
        completedAt: isCompleted ? new Date(scheduled.getTime() + 3600000) : null,
      },
    });
  }

  // ── 12. Notifications ──────────────────────────────────────────
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
        type: Status.INFO,
        isRead: false,
      },
    });
  }

  // ── 13. Audit Log entries ──────────────────────────────────────
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

  // ── 14. Settings ───────────────────────────────────────────────
  console.log("  → Creating settings...");
  for (const s of SETTINGS_DATA) {
    await prisma.settings.create({ data: { key: s.key, value: s.value } });
  }

  // ── 15. Chat Messages (sample) ─────────────────────────────────
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
