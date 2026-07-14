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
  S('b01', 'بنك الأول (ساب)', 'Alawwal Bank (SABB)', 24.829440, 46.618440, 1, true),
  S('b02', 'د. سليمان الحبيب', 'Dr. Sulaiman Al Habib', 24.811554, 46.626544, 2),
  S('b03', 'المركز المالي', 'KAFD', 24.768004, 46.643644, 3, true),
  S('b04', 'المروج', 'Al Muruj', 24.754746, 46.654221, 4),
  S('b05', 'حي الملك فهد', 'King Fahd District', 24.744914, 46.659327, 5),
  S('b06', 'حي الملك فهد 2', 'King Fahd District 2', 24.736652, 46.663387, 6),
  S('b07', 'الاتصالات السعودية', 'STC', 24.726797, 46.666880, 7, true),
  S('b08', 'الورود 2', 'Al Worood 2', 24.721727, 46.671129, 8),
  S('b09', 'العروبة', 'Al Orouba', 24.713216, 46.675366, 9),
  S('b10', 'مصرف الإنماء', 'Alinma Bank', 24.703166, 46.680325, 10),
  S('b11', 'بنك البلاد', 'Bank AlBilad', 24.696508, 46.683926, 11),
  S('b12', 'مكتبة الملك فهد', 'King Fahd Library', 24.689690, 46.687365, 12),
  S('b13', 'وزارة الداخلية', 'Ministry of Interior', 24.674243, 46.695048, 13),
  S('b14', 'المربع', 'Al Murabba', 24.664851, 46.702446, 14),
  S('b15', 'الجوازات', 'Passport Department', 24.659560, 46.704395, 15),
  S('b16', 'المتحف الوطني', 'National Museum', 24.646063, 46.714165, 16, true),
  S('b17', 'البطحاء', 'Al Batha', 24.637931, 46.715234, 17),
  S('b18', 'قصر الحكم', 'Justice Palace', 24.628582, 46.716119, 18, true),
  S('b19', 'العود', 'Al Oud', 24.625319, 46.721018, 19),
  S('b20', 'سكيرينة', 'Sukayrinah', 24.617552, 46.725407, 20),
  S('b21', 'منفوحة', 'Manfuhah', 24.610457, 46.727517, 21),
  S('b22', 'مستشفى الإيمان', 'Iman Hospital', 24.601008, 46.735244, 22),
  S('b23', 'مركز النقل العام', 'Public Transport Center', 24.597987, 46.745141, 23),
  S('b24', 'العزيزية', 'Al Aziziyah', 24.586137, 46.761196, 24),
  S('b25', 'الدار البيضاء', 'Dar Al Bayda', 24.559589, 46.776547, 25),
]

const line2Red: StationDef[] = [
  S('r01', 'جامعة الملك سعود', 'King Saud University', 24.709678, 46.628711, 1, true),
  S('r02', 'واحة الملك سلمان', 'King Salman Oasis', 24.716629, 46.638777, 2, true),
  S('r03', 'المدينة التقنية', 'Technology City', 24.720171, 46.646932, 3),
  S('r04', 'التخصصي', 'Al Takhassusi', 24.723407, 46.654649, 4),
  S('r05', 'الاتصالات السعودية', 'STC', 24.726558, 46.666545, 5, true),
  S('r06', 'الورود', 'Al Worood', 24.733040, 46.677493, 6),
  S('r07', 'طريق الملك عبدالعزيز', 'King Abdulaziz Road', 24.736239, 46.685219, 7),
  S('r08', 'وزارة التعليم', 'Ministry of Education', 24.739977, 46.693467, 8, true),
  S('r09', 'النزهة', 'Al Nuzha', 24.747822, 46.713114, 9),
  S('r10', 'مركز الرياض للمعارض', 'Riyadh Exhibition Center', 24.753785, 46.727212, 10),
  S('r11', 'طريق خالد بن الوليد', 'Khaled Bin Al Waleed Road', 24.767058, 46.758974, 11),
  S('r12', 'الحمراء', 'Al Hamra', 24.776421, 46.776758, 12, true),
  S('r13', 'الخليج', 'Al Khaleej', 24.781450, 46.794471, 13),
  S('r14', 'إشبيليا', 'Ishbiliyah', 24.792160, 46.811069, 14),
  S('r15', 'مدينة الملك فهد الرياضية', 'King Fahd Sports City', 24.792436, 46.836994, 15),
]

const line3Orange: StationDef[] = [
  S('o01', 'طريق جدة', 'Jeddah Road', 24.591214, 46.543394, 1),
  S('o02', 'طويق', 'Tuwaiq', 24.585326, 46.561904, 2),
  S('o03', 'الدوح', 'Al Doah', 24.582932, 46.588070, 3),
  S('o04', 'المحطة الغربية', 'Western Station', 24.582485, 46.614385, 4),
  S('o05', 'شارع عائشة بنت أبي بكر', 'Aisha bint Abi Bakr Street', 24.600529, 46.643749, 5),
  S('o06', 'ظهرة البديعة', 'Dahrat Al Badiah', 24.607375, 46.654974, 6),
  S('o07', 'سلطانة', 'Sultanah', 24.614812, 46.686104, 7),
  S('o08', 'الجرادية', 'Al Juradiyah', 24.618457, 46.698218, 8, true),
  S('o09', 'مجمع المحاكم', 'Courts Complex', 24.626966, 46.712421, 9, true),
  S('o10', 'قصر الحكم', 'Justice Palace', 24.628526, 46.716060, 10, true),
  S('o11', 'الحلة', 'Al Hillah', 24.631750, 46.720921, 11, true),
  S('o12', 'المرقب', 'Al Marqab', 24.634028, 46.725444, 12, true),
  S('o13', 'الصالحية', 'Al Salhiyah', 24.637229, 46.731929, 13),
  S('o14', 'المدينة الصناعية الأولى', 'Industrial City 1', 24.645182, 46.739493, 14),
  S('o15', 'سكة الحديد', 'Railway Station', 24.649233, 46.741243, 15),
  S('o16', 'الملز', 'Al Malaz', 24.661094, 46.745054, 16),
  S('o17', 'حي جرير', 'Jarir District', 24.672970, 46.760521, 17),
  S('o18', 'جامع الراجحي', 'Al Rajhi Mosque', 24.679712, 46.778497, 18),
  S('o19', 'طريق هارون الرشيد', 'Harun Al Rashid Road', 24.686085, 46.796017, 19),
  S('o20', 'النسيم', 'Al Naseem', 24.700268, 46.827814, 20, true),
  S('o21', 'شارع حسان بن ثابت', 'Hassan bin Thabit Street', 24.713153, 46.848109, 21, true),
  S('o22', 'خشم العان', 'Khashm Al An', 24.721566, 46.860326, 22, true),
]

const line4Yellow: StationDef[] = [
  S('y01', 'المركز المالي', 'KAFD', 24.768179, 46.643606, 1, true),
  S('y02', 'الربيع', 'Al Rabie', 24.786292, 46.660579, 2, true),
  S('y03', 'طريق عثمان بن عفان', 'Othman bin Affan Road', 24.800503, 46.696349, 3, true),
  S('y04', 'سابك', 'SABIC', 24.807235, 46.709751, 4, true),
  S('y05', 'جامعة الأميرة نورة', 'Princess Noura University', 24.840397, 46.716682, 5),
  S('y06', 'جامعة الأميرة نورة 2', 'Princess Noura University 2', 24.859834, 46.704317, 6),
  S('y07', 'المطار T5', 'Airport T5', 24.942955, 46.708264, 7),
  S('y08', 'المطار T3-4', 'Airport T3-4', 24.956299, 46.703221, 8),
  S('y09', 'المطار T1-2', 'Airport T1-2', 24.962815, 46.700028, 9),
]

const line5Green: StationDef[] = [
  S('g01', 'وزارة التعليم', 'Ministry of Education', 24.739770, 46.693598, 1, true),
  S('g02', 'حديقة الملك سلمان', 'King Salman Park', 24.728338, 46.701061, 2),
  S('g03', 'السليمانية', 'Al Sulimaniyah', 24.713043, 46.699544, 3),
  S('g04', 'الضباب', 'Al Dhabab', 24.709159, 46.708357, 4),
  S('g05', 'ميدان أبو ظبي', 'Abu Dhabi Square', 24.706116, 46.716342, 5),
  S('g06', 'نادي الضباط', 'Officers Club', 24.697523, 46.718029, 6, true),
  S('g07', 'التأمينات الاجتماعية', 'Social Insurance', 24.686692, 46.718199, 7),
  S('g08', 'الوزارات', 'Ministries Complex', 24.677217, 46.718358, 8),
  S('g09', 'وزارة الدفاع', 'Ministry of Defense', 24.667125, 46.718257, 9, true),
  S('g10', 'مستشفى الملك عبدالعزيز', 'King Abdulaziz Hospital', 24.659046, 46.717274, 10, true),
  S('g11', 'وزارة المالية', 'Ministry of Finance', 24.651279, 46.715731, 11, true),
  S('g12', 'المتحف الوطني', 'National Museum', 24.646073, 46.714280, 12, true),
]

const line6Purple: StationDef[] = [
  S('p01', 'المركز المالي', 'KAFD', 24.768179, 46.643606, 1, true),
  S('p02', 'الربيع', 'Al Rabie', 24.786292, 46.660579, 2, true),
  S('p03', 'طريق عثمان بن عفان', 'Othman bin Affan Road', 24.800503, 46.696349, 3, true),
  S('p04', 'سابك', 'SABIC', 24.807357, 46.709596, 4, true),
  S('p05', 'غرناطة', 'Granada', 24.786483, 46.729333, 5),
  S('p06', 'اليرموك', 'Al Yarmouk', 24.791027, 46.766422, 6, true),
  S('p07', 'الحمراء', 'Al Hamra', 24.776327, 46.776576, 7, true),
  S('p08', 'الأندلس', 'Al Andalus', 24.756747, 46.790510, 8, true),
  S('p09', 'طريق خريص', 'Khurais Road', 24.738084, 46.800096, 9, true),
  S('p10', 'السلام', 'Al Salam', 24.722197, 46.811446, 10),
  S('p11', 'النسيم', 'Al Naseem', 24.700481, 46.827963, 11, true),
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
        const key = `${s.lat.toFixed(3)}_${s.lng.toFixed(3)}`
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
