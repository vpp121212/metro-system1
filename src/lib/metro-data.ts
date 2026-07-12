export const LINE_COLORS: Record<string, { hex: string; nameAr: string; nameEn: string }> = {
  BLUE:    { hex: '#2563eb', nameAr: 'الخط الأزرق', nameEn: 'Blue Line' },
  RED:     { hex: '#dc2626', nameAr: 'الخط الأحمر', nameEn: 'Red Line' },
  ORANGE:  { hex: '#ea580c', nameAr: 'الخط البرتقالي', nameEn: 'Orange Line' },
  YELLOW:  { hex: '#eab308', nameAr: 'الخط الأصفر', nameEn: 'Yellow Line' },
  GREEN:   { hex: '#16a34a', nameAr: 'الخط الأخضر', nameEn: 'Green Line' },
  PURPLE:  { hex: '#9333ea', nameAr: 'الخط البنفسجي', nameEn: 'Purple Line' },
}

export interface StationDef {
  id: string; nameAr: string; nameEn: string; lat: number; lng: number; order: number; isInterchange: boolean
}

export interface LineDef {
  id: string; color: string; nameAr: string; nameEn: string; stations: StationDef[]
}

const S = (id: string, nameAr: string, nameEn: string, lat: number, lng: number, order: number, isInterchange = false): StationDef => ({
  id, nameAr, nameEn, lat, lng, order, isInterchange,
})

const line1Blue: StationDef[] = [
  S('b01', 'بنك الأول (ساب)', 'Alawwal Bank (SABB)', 24.7618, 46.6412, 1, true),
  S('b02', 'د. سليمان الحبيب', 'Dr. Sulaiman Al Habib', 24.7561, 46.6524, 2),
  S('b03', 'المركز المالي', 'KAFD', 24.7487, 46.6615, 3, true),
  S('b04', 'المروج', 'Al Muruj', 24.7413, 46.6698, 4),
  S('b05', 'حي الملك فهد', 'King Fahd District', 24.7340, 46.6781, 5),
  S('b06', 'حي الملك فهد 2', 'King Fahd District 2', 24.7267, 46.6864, 6),
  S('b07', 'الاتصالات السعودية', 'STC', 24.7194, 46.6947, 7, true),
  S('b08', 'الورود 2', 'Al Worood 2', 24.7121, 46.7030, 8),
  S('b09', 'العروبة', 'Al Orouba', 24.7048, 46.7113, 9),
  S('b10', 'مصرف الإنماء', 'Alinma Bank', 24.6975, 46.7196, 10),
  S('b11', 'بنك البلاد', 'Bank AlBilad', 24.6902, 46.7279, 11),
  S('b12', 'مكتبة الملك فهد', 'King Fahd Library', 24.6829, 46.7362, 12),
  S('b13', 'وزارة الداخلية', 'Ministry of Interior', 24.6756, 46.7445, 13),
  S('b14', 'المربع', 'Al Murabba', 24.6683, 46.7528, 14),
  S('b15', 'الجوازات', 'Passport Department', 24.6610, 46.7611, 15),
  S('b16', 'المتحف الوطني', 'National Museum', 24.6537, 46.7694, 16, true),
  S('b17', 'البطحاء', 'Al Batha', 24.6464, 46.7777, 17),
  S('b18', 'قصر الحكم', 'Justice Palace', 24.6391, 46.7860, 18, true),
  S('b19', 'العود', 'Al Oud', 24.6318, 46.7943, 19),
  S('b20', 'سكيرينة', 'Sukayrinah', 24.6245, 46.8026, 20),
  S('b21', 'منفوحة', 'Manfuhah', 24.6172, 46.8109, 21),
  S('b22', 'مستشفى الإيمان', 'Iman Hospital', 24.6099, 46.8192, 22),
  S('b23', 'مركز النقل العام', 'Public Transport Center', 24.6026, 46.8275, 23),
  S('b24', 'العزيزية', 'Al Aziziyah', 24.5953, 46.8358, 24),
  S('b25', 'الدار البيضاء', 'Dar Al Bayda', 24.5880, 46.8441, 25),
]

const line2Red: StationDef[] = [
  S('r01', 'جامعة الملك سعود', 'King Saud University', 24.7618, 46.6412, 1, true),
  S('r02', 'واحة الملك سلمان', 'King Salman Oasis', 24.7487, 46.6615, 2, true),
  S('r03', 'المدينة التقنية', 'Technology City', 24.7395, 46.6680, 3),
  S('r04', 'التخصصي', 'Al Takhassusi', 24.7303, 46.6745, 4),
  S('r05', 'الاتصالات السعودية', 'STC', 24.7211, 46.6810, 5, true),
  S('r06', 'الورود', 'Al Worood', 24.7119, 46.6875, 6),
  S('r07', 'طريق الملك عبدالعزيز', 'King Abdulaziz Road', 24.7027, 46.6940, 7),
  S('r08', 'وزارة التعليم', 'Ministry of Education', 24.6935, 46.7005, 8, true),
  S('r09', 'النزهة', 'Al Nuzha', 24.6843, 46.7070, 9),
  S('r10', 'مركز الرياض للمعارض', 'Riyadh Exhibition Center', 24.6751, 46.7135, 10),
  S('r11', 'طريق خالد بن الوليد', 'Khaled Bin Al Waleed Road', 24.6659, 46.7200, 11),
  S('r12', 'الحمراء', 'Al Hamra', 24.6567, 46.7265, 12, true),
  S('r13', 'الخليج', 'Al Khaleej', 24.6475, 46.7330, 13),
  S('r14', 'إشبيليا', 'Ishbiliyah', 24.6383, 46.7395, 14),
  S('r15', 'مدينة الملك فهد الرياضية', 'King Fahd Sports City', 24.6291, 46.7460, 15),
]

const line3Orange: StationDef[] = [
  S('o01', 'طريق جدة', 'Jeddah Road', 24.7700, 46.6200, 1),
  S('o02', 'طويق', 'Tuwaiq', 24.7630, 46.6280, 2),
  S('o03', 'الدوح', 'Al Doah', 24.7560, 46.6360, 3),
  S('o04', 'المحطة الغربية', 'Western Station', 24.7490, 46.6440, 4),
  S('o05', 'شارع عائشة بنت أبي بكر', 'Aisha bint Abi Bakr Street', 24.7420, 46.6520, 5),
  S('o06', 'ظهرة البديعة', 'Dahrat Al Badiah', 24.7350, 46.6600, 6),
  S('o07', 'سلطانة', 'Sultanah', 24.7280, 46.6680, 7),
  S('o08', 'الجرادية', 'Al Juradiyah', 24.7487, 46.6615, 8, true),
  S('o09', 'مجمع المحاكم', 'Courts Complex', 24.6537, 46.7694, 9, true),
  S('o10', 'قصر الحكم', 'Justice Palace', 24.7267, 46.6864, 10, true),
  S('o11', 'الحلة', 'Al Hillah', 24.7121, 46.7030, 11, true),
  S('o12', 'المرقب', 'Al Marqab', 24.6756, 46.7445, 12, true),
  S('o13', 'الصالحية', 'Al Salhiyah', 24.6600, 46.7500, 13),
  S('o14', 'المدينة الصناعية الأولى', 'Industrial City 1', 24.6500, 46.7560, 14),
  S('o15', 'سكة الحديد', 'Railway Station', 24.6400, 46.7620, 15),
  S('o16', 'الملز', 'Al Malaz', 24.6300, 46.7680, 16),
  S('o17', 'حي جرير', 'Jarir District', 24.6200, 46.7740, 17),
  S('o18', 'جامع الراجحي', 'Al Rajhi Mosque', 24.6100, 46.7800, 18),
  S('o19', 'طريق هارون الرشيد', 'Harun Al Rashid Road', 24.6000, 46.7860, 19),
  S('o20', 'النسيم', 'Al Naseem', 24.5900, 46.7920, 20, true),
  S('o21', 'شارع حسان بن ثابت', 'Hassan bin Thabit Street', 24.6383, 46.7395, 21, true),
  S('o22', 'خشم العان', 'Khashm Al An', 24.5880, 46.8441, 22, true),
]

const line4Yellow: StationDef[] = [
  S('y01', 'المركز المالي', 'KAFD', 24.7618, 46.6412, 1, true),
  S('y02', 'الربيع', 'Al Rabie', 24.7550, 46.6500, 2, true),
  S('y03', 'طريق عثمان بن عفان', 'Othman bin Affan Road', 24.7482, 46.6588, 3, true),
  S('y04', 'سابك', 'SABIC', 24.7119, 46.6875, 4, true),
  S('y05', 'جامعة الأميرة نورة', 'Princess Noura University', 24.7162, 46.7323, 5),
  S('y06', 'جامعة الأميرة نورة 2', 'Princess Noura University 2', 24.7200, 46.7380, 6),
  S('y07', 'المطار T5', 'Airport T5', 24.9570, 46.6988, 7),
  S('y08', 'المطار T3-4', 'Airport T3-4', 24.9620, 46.7030, 8),
  S('y09', 'المطار T1-2', 'Airport T1-2', 24.9580, 46.7070, 9),
]

const line5Green: StationDef[] = [
  S('g01', 'وزارة التعليم', 'Ministry of Education', 24.5500, 46.7000, 1, true),
  S('g02', 'حديقة الملك سلمان', 'King Salman Park', 24.5580, 46.7080, 2),
  S('g03', 'السليمانية', 'Al Sulimaniyah', 24.5660, 46.7160, 3),
  S('g04', 'الضباب', 'Al Dhabab', 24.5740, 46.7240, 4),
  S('g05', 'ميدان أبو ظبي', 'Abu Dhabi Square', 24.5820, 46.7320, 5),
  S('g06', 'نادي الضباط', 'Officers Club', 24.5953, 46.8358, 6, true),
  S('g07', 'التأمينات الاجتماعية', 'Social Insurance', 24.6000, 46.7400, 7),
  S('g08', 'الوزارات', 'Ministries Complex', 24.6080, 46.7480, 8),
  S('g09', 'وزارة الدفاع', 'Ministry of Defense', 24.6537, 46.7694, 9, true),
  S('g10', 'مستشفى الملك عبدالعزيز', 'King Abdulaziz Hospital', 24.6610, 46.7611, 10, true),
  S('g11', 'وزارة المالية', 'Ministry of Finance', 24.6683, 46.7528, 11, true),
  S('g12', 'المتحف الوطني', 'National Museum', 24.7800, 46.6100, 12, true),
]

const line6Purple: StationDef[] = [
  S('p01', 'المركز المالي', 'KAFD', 24.7618, 46.6412, 1, true),
  S('p02', 'الربيع', 'Al Rabie', 24.7550, 46.6500, 2, true),
  S('p03', 'طريق عثمان بن عفان', 'Othman bin Affan Road', 24.7482, 46.6588, 3, true),
  S('p04', 'سابك', 'SABIC', 24.7119, 46.6875, 4, true),
  S('p05', 'غرناطة', 'Granada', 24.7000, 46.6950, 5),
  S('p06', 'اليرموك', 'Al Yarmouk', 24.7027, 46.6940, 6, true),
  S('p07', 'الحمراء', 'Al Hamra', 24.6935, 46.7005, 7, true),
  S('p08', 'الأندلس', 'Al Andalus', 24.6751, 46.7135, 8, true),
  S('p09', 'طريق خريص', 'Khurais Road', 24.6026, 46.8275, 9, true),
  S('p10', 'السلام', 'Al Salam', 24.5950, 46.8150, 10),
  S('p11', 'النسيم', 'Al Naseem', 24.5880, 46.8030, 11, true),
]

export const LINES: LineDef[] = [
  { id: 'BLUE', color: 'BLUE', nameAr: 'الخط الأزرق', nameEn: 'Blue Line', stations: line1Blue },
  { id: 'RED', color: 'RED', nameAr: 'الخط الأحمر', nameEn: 'Red Line', stations: line2Red },
  { id: 'ORANGE', color: 'ORANGE', nameAr: 'الخط البرتقالي', nameEn: 'Orange Line', stations: line3Orange },
  { id: 'YELLOW', color: 'YELLOW', nameAr: 'الخط الأصفر', nameEn: 'Yellow Line', stations: line4Yellow },
  { id: 'GREEN', color: 'GREEN', nameAr: 'الخط الأخضر', nameEn: 'Green Line', stations: line5Green },
  { id: 'PURPLE', color: 'PURPLE', nameAr: 'الخط البنفسجي', nameEn: 'Purple Line', stations: line6Purple },
]

export function getLineGeoJSON(line: LineDef): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: 'Feature',
    properties: {
      id: line.id,
      color: LINE_COLORS[line.color].hex,
      nameAr: line.nameAr,
      nameEn: line.nameEn,
    },
    geometry: {
      type: 'LineString',
      coordinates: line.stations.map(s => [s.lng, s.lat]),
    },
  }
}

export function getStationsGeoJSON(): GeoJSON.FeatureCollection<GeoJSON.Point> {
  const seen = new Set<string>()
  return {
    type: 'FeatureCollection',
    features: LINES.flatMap(line =>
      line.stations.map(s => {
        const key = `${s.lat.toFixed(4)}_${s.lng.toFixed(4)}`
        const isInterchange = seen.has(key)
        seen.add(key)
        return {
          type: 'Feature',
          properties: {
            id: s.id,
            nameAr: s.nameAr,
            nameEn: s.nameEn,
            line: line.color,
            lineColor: LINE_COLORS[line.color].hex,
            isInterchange: s.isInterchange || isInterchange,
          },
          geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
        } as GeoJSON.Feature<GeoJSON.Point>
      })
    ),
  }
}

export function getTrainPathsGeoJSON(): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  return {
    type: 'FeatureCollection',
    features: LINES.map(line => ({
      type: 'Feature',
      properties: { line: line.id, color: LINE_COLORS[line.color].hex },
      geometry: {
        type: 'LineString',
        coordinates: line.stations.map(s => [s.lng, s.lat]),
      },
    })),
  }
}

export function generateTrains(): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: LINES.flatMap(line => {
      const stations = line.stations
      const numTrains = line.id === 'YELLOW' ? 3 : line.id === 'GREEN' ? 4 : line.id === 'PURPLE' ? 4 : 6
      return Array.from({ length: numTrains }, (_, i) => {
        const t = (i / numTrains + Date.now() / 60000) % 1
        const totalLen = stations.length - 1
        const idx = Math.floor(t * totalLen)
        const frac = (t * totalLen) - idx
        const s0 = stations[Math.min(idx, totalLen)]
        const s1 = stations[Math.min(idx + 1, totalLen)]
        const lng = s0.lng + (s1.lng - s0.lng) * frac
        const lat = s0.lat + (s1.lat - s0.lat) * frac
        const angle = Math.atan2(s1.lng - s0.lng, s1.lat - s0.lat) * (180 / Math.PI)
        const prefix = line.id.charAt(0)
        return {
          type: 'Feature',
          properties: {
            id: `${line.id}-${String(i + 1).padStart(3, '0')}`,
            name: `${prefix}-${String(i + 1).padStart(3, '0')}`,
            line: line.id,
            lineColor: LINE_COLORS[line.color].hex,
            speed: Math.round(40 + Math.random() * 50),
            bearing: angle,
            status: i === 0 ? 'MAINTENANCE' : 'ACTIVE',
            direction: i % 2 === 0 ? 'forward' : 'reverse',
            passengerCount: Math.round(Math.random() * 800 + 50),
            capacity: 1000,
          },
          geometry: { type: 'Point', coordinates: [lng, lat] },
        } as GeoJSON.Feature<GeoJSON.Point>
      })
    }),
  }
}

export function generateAlerts(): GeoJSON.FeatureCollection<GeoJSON.Point> {
  const types: { type: string; color: string }[] = [
    { type: 'CRITICAL', color: '#ef4444' },
    { type: 'WARNING', color: '#f97316' },
    { type: 'INFO', color: '#3b82f6' },
  ]
  const alerts = LINES.flatMap(line => {
    const mid = Math.floor(line.stations.length / 2)
    const targets = [line.stations[0], line.stations[mid], line.stations[line.stations.length - 1]]
    return types.map((t, i) => ({
      type: 'Feature',
      properties: {
        id: `alert-${line.id}-${i}`,
        type: t.type,
        color: t.color,
        title: t.type === 'CRITICAL' ? 'عطل فني' : t.type === 'WARNING' ? 'ازدحام' : 'صيانة مجدولة',
        description: t.type === 'CRITICAL' ? `عطل في الإشارات على ${line.nameAr}` : t.type === 'WARNING' ? `ازدحام متوقع في ${targets[i].nameAr}` : `صيانة دورية على ${line.nameAr}`,
        line: line.nameAr,
      },
      geometry: { type: 'Point', coordinates: [targets[i].lng + (Math.random() - 0.5) * 0.01, targets[i].lat + (Math.random() - 0.5) * 0.01] },
    } as GeoJSON.Feature<GeoJSON.Point>))
  })
  return { type: 'FeatureCollection', features: alerts }
}
