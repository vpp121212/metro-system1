import datetime
import random
from sqlalchemy.orm import Session

from .models import (
    Line, Station, Train, Camera, Alert,
    PassengerRecord, SystemHealth, Settings,
)


def seed_lines(db: Session) -> list[Line]:
    lines_data = [
        {"name_ar": "الخط الأزرق", "name_en": "Blue Line", "color": "#2563eb", "order": 1},
        {"name_ar": "الخط الأحمر", "name_en": "Red Line", "color": "#dc2626", "order": 2},
        {"name_ar": "الخط البرتقالي", "name_en": "Orange Line", "color": "#ea580c", "order": 3},
        {"name_ar": "الخط الأصفر", "name_en": "Yellow Line", "color": "#eab308", "order": 4},
        {"name_ar": "الخط الأخضر", "name_en": "Green Line", "color": "#16a34a", "order": 5},
        {"name_ar": "الخط البنفسجي", "name_en": "Purple Line", "color": "#9333ea", "order": 6},
    ]
    lines = []
    for ld in lines_data:
        line = Line(**ld)
        db.add(line)
        lines.append(line)
    db.flush()
    return lines


def seed_stations(db: Session, lines: list[Line]) -> list[Station]:
    blue, red, orange, yellow, green, purple = lines

    stations_data = [
        # Blue Line (25 stations)
        {"name_ar": "الجامعة", "name_en": "University", "line": blue, "order": 1, "lat": 24.7204, "lng": 46.6286, "is_interchange": False},
        {"name_ar": "حي العارض", "name_en": "Al Arid", "line": blue, "order": 2, "lat": 24.7310, "lng": 46.6410, "is_interchange": False},
        {"name_ar": "طريق الأمير سلطان", "name_en": "Prince Sultan Road", "line": blue, "order": 3, "lat": 24.7420, "lng": 46.6520, "is_interchange": False},
        {"name_ar": "حي الندى", "name_en": "Al Nada", "line": blue, "order": 4, "lat": 24.7530, "lng": 46.6630, "is_interchange": False},
        {"name_ar": "حي الياسمين", "name_en": "Al Yasmin", "line": blue, "order": 5, "lat": 24.7640, "lng": 46.6740, "is_interchange": False},
        {"name_ar": "العليا", "name_en": "Al Olaya", "line": blue, "order": 6, "lat": 24.7750, "lng": 46.6850, "is_interchange": True},
        {"name_ar": "طريق الملك فهد", "name_en": "King Fahd Road", "line": blue, "order": 7, "lat": 24.7860, "lng": 46.6960, "is_interchange": False},
        {"name_ar": "السويلمية", "name_en": "Al Suwaidi", "line": blue, "order": 8, "lat": 24.7970, "lng": 46.7070, "is_interchange": False},
        {"name_ar": "حي الربوة", "name_en": "Al Rabwa", "line": blue, "order": 9, "lat": 24.8080, "lng": 46.7180, "is_interchange": False},
        {"name_ar": "المدينة الرياضية", "name_en": "Riyadh Sports City", "line": blue, "order": 10, "lat": 24.7190, "lng": 46.7290, "is_interchange": False},
        {"name_ar": "حي المروج", "name_en": "Al Morooj", "line": blue, "order": 11, "lat": 24.7300, "lng": 46.7400, "is_interchange": False},
        {"name_ar": "طريق الدمام", "name_en": "Dammam Road", "line": blue, "order": 12, "lat": 24.7410, "lng": 46.7510, "is_interchange": False},
        {"name_ar": "حي العليا", "name_en": "Al Ulaya", "line": blue, "order": 13, "lat": 24.7520, "lng": 46.7620, "is_interchange": True},
        {"name_ar": "الرياض بارك", "name_en": "Riyadh Park", "line": blue, "order": 14, "lat": 24.7630, "lng": 46.7730, "is_interchange": False},
        {"name_ar": "مجمع المعارض", "name_en": "Exhibition Center", "line": blue, "order": 15, "lat": 24.7740, "lng": 46.7840, "is_interchange": False},
        {"name_ar": "حي الصحافة", "name_en": "Al Sahafa", "line": blue, "order": 16, "lat": 24.7850, "lng": 46.7950, "is_interchange": False},
        {"name_ar": "طريق الثمامة", "name_en": "Thumamah Road", "line": blue, "order": 17, "lat": 24.7960, "lng": 46.8060, "is_interchange": False},
        {"name_ar": "حي الورود", "name_en": "Al Worood", "line": blue, "order": 18, "lat": 24.8070, "lng": 46.8170, "is_interchange": False},
        {"name_ar": "حي النخيل", "name_en": "Al Nakheel", "line": blue, "order": 19, "lat": 24.7180, "lng": 46.8280, "is_interchange": False},
        {"name_ar": "النور", "name_en": "Al Noor", "line": blue, "order": 20, "lat": 24.7290, "lng": 46.8390, "is_interchange": False},
        {"name_ar": "حي الملقا", "name_en": "Al Malqa", "line": blue, "order": 21, "lat": 24.7400, "lng": 46.8500, "is_interchange": False},
        {"name_ar": "طريق أبو بكر", "name_en": "Abu Bakr Road", "line": blue, "order": 22, "lat": 24.7510, "lng": 46.8610, "is_interchange": False},
        {"name_ar": "حي الربيع", "name_en": "Al Rabie", "line": blue, "order": 23, "lat": 24.7620, "lng": 46.8720, "is_interchange": False},
        {"name_ar": "الفيصلية", "name_en": "Al Faisaliah", "line": blue, "order": 24, "lat": 24.7730, "lng": 46.8830, "is_interchange": True},
        {"name_ar": "المرجان", "name_en": "Al Murjan", "line": blue, "order": 25, "lat": 24.7840, "lng": 46.8940, "is_interchange": False},

        # Red Line (15 stations)
        {"name_ar": "السلامة", "name_en": "Al Salama", "line": red, "order": 1, "lat": 24.6900, "lng": 46.7000, "is_interchange": False},
        {"name_ar": "حي النسيم", "name_en": "Al Naseem", "line": red, "order": 2, "lat": 24.6850, "lng": 46.7100, "is_interchange": False},
        {"name_ar": "الشميسي", "name_en": "Al Shimisee", "line": red, "order": 3, "lat": 24.6800, "lng": 46.7200, "is_interchange": False},
        {"name_ar": "البطحاء", "name_en": "Al Bathaa", "line": red, "order": 4, "lat": 24.6750, "lng": 46.7300, "is_interchange": True},
        {"name_ar": "سوق الحجاز", "name_en": "Al Hejaz Market", "line": red, "order": 5, "lat": 24.6700, "lng": 46.7400, "is_interchange": False},
        {"name_ar": "حي الزهراء", "name_en": "Al Zahraa", "line": red, "order": 6, "lat": 24.6650, "lng": 46.7500, "is_interchange": False},
        {"name_ar": "طريق مكة", "name_en": "Makkah Road", "line": red, "order": 7, "lat": 24.6600, "lng": 46.7600, "is_interchange": False},
        {"name_ar": "حي الضباط", "name_en": "Officers District", "line": red, "order": 8, "lat": 24.6550, "lng": 46.7700, "is_interchange": False},
        {"name_ar": "الملز", "name_en": "Al Malaz", "line": red, "order": 9, "lat": 24.6500, "lng": 46.7800, "is_interchange": False},
        {"name_ar": "حي الملك فهد", "name_en": "King Fahd District", "line": red, "order": 10, "lat": 24.6450, "lng": 46.7900, "is_interchange": False},
        {"name_ar": "المدينة الرقمية", "name_en": "Digital City", "line": red, "order": 11, "lat": 24.6400, "lng": 46.8000, "is_interchange": False},
        {"name_ar": "حي الجناد", "name_en": "Al Janad", "line": red, "order": 12, "lat": 24.6350, "lng": 46.8100, "is_interchange": False},
        {"name_ar": "الدانة", "name_en": "Al Danah", "line": red, "order": 13, "lat": 24.6300, "lng": 46.8200, "is_interchange": False},
        {"name_ar": "حي السلام", "name_en": "Al Salam", "line": red, "order": 14, "lat": 24.6250, "lng": 46.8300, "is_interchange": False},
        {"name_ar": "الخرج", "name_en": "Al Kharj", "line": red, "order": 15, "lat": 24.6200, "lng": 46.8400, "is_interchange": False},

        # Orange Line (22 stations)
        {"name_ar": "مطار الملك خالد", "name_en": "King Khalid Airport", "line": orange, "order": 1, "lat": 24.9580, "lng": 46.6980, "is_interchange": False},
        {"name_ar": "حي المطار", "name_en": "Airport District", "line": orange, "order": 2, "lat": 24.9450, "lng": 46.7080, "is_interchange": False},
        {"name_ar": "العريجاء", "name_en": "Al Urayja", "line": orange, "order": 3, "lat": 24.9320, "lng": 46.7180, "is_interchange": False},
        {"name_ar": "حي الغدير", "name_en": "Al Ghadir", "line": orange, "order": 4, "lat": 24.9190, "lng": 46.7280, "is_interchange": False},
        {"name_ar": "طريق الجيزة", "name_en": "Al Jizah Road", "line": orange, "order": 5, "lat": 24.9060, "lng": 46.7380, "is_interchange": False},
        {"name_ar": "حي الريان", "name_en": "Al Rayyan", "line": orange, "order": 6, "lat": 24.8930, "lng": 46.7480, "is_interchange": False},
        {"name_ar": "الوشم", "name_en": "Al Washm", "line": orange, "order": 7, "lat": 24.8800, "lng": 46.7580, "is_interchange": False},
        {"name_ar": "حي المروج", "name_en": "Al Morooj Orange", "line": orange, "order": 8, "lat": 24.8670, "lng": 46.7680, "is_interchange": False},
        {"name_ar": "طريق التحلية", "name_en": "Tahlia Road", "line": orange, "order": 9, "lat": 24.8540, "lng": 46.7780, "is_interchange": True},
        {"name_ar": "حي النزهة", "name_en": "Al Nahda", "line": orange, "order": 10, "lat": 24.8410, "lng": 46.7880, "is_interchange": False},
        {"name_ar": "السليمانية", "name_en": "Al Sulaimaniyah", "line": orange, "order": 11, "lat": 24.8280, "lng": 46.7980, "is_interchange": False},
        {"name_ar": "حي الورود", "name_en": "Al Worood Orange", "line": orange, "order": 12, "lat": 24.8150, "lng": 46.8080, "is_interchange": False},
        {"name_ar": "طريق الأمير نايف", "name_en": "Prince Naif Road", "line": orange, "order": 13, "lat": 24.8020, "lng": 46.8180, "is_interchange": False},
        {"name_ar": "حي الجوهرة", "name_en": "Al Jawhara", "line": orange, "order": 14, "lat": 24.7890, "lng": 46.8280, "is_interchange": False},
        {"name_ar": "الواحة", "name_en": "Al Wahda", "line": orange, "order": 15, "lat": 24.7760, "lng": 46.8380, "is_interchange": False},
        {"name_ar": "حي الأمير سلطان", "name_en": "Prince Sultan District", "line": orange, "order": 16, "lat": 24.7630, "lng": 46.8480, "is_interchange": False},
        {"name_ar": "طريق أبْيَر", "name_en": "Abiyar Road", "line": orange, "order": 17, "lat": 24.7500, "lng": 46.8580, "is_interchange": False},
        {"name_ar": "حي الزهراء", "name_en": "Al Zahraa Orange", "line": orange, "order": 18, "lat": 24.7370, "lng": 46.8680, "is_interchange": False},
        {"name_ar": "الفيصلية", "name_en": "Al Faisaliah Orange", "line": orange, "order": 19, "lat": 24.7240, "lng": 46.8780, "is_interchange": False},
        {"name_ar": "حي الحمراء", "name_en": "Al Hamra", "line": orange, "order": 20, "lat": 24.7110, "lng": 46.8880, "is_interchange": False},
        {"name_ar": "طريق الظهران", "name_en": "Dhahran Road", "line": orange, "order": 21, "lat": 24.6980, "lng": 46.8980, "is_interchange": False},
        {"name_ar": "الظهران", "name_en": "Al Dhahran", "line": orange, "order": 22, "lat": 24.6850, "lng": 46.9080, "is_interchange": False},

        # Yellow Line (9 stations)
        {"name_ar": "حي الري", "name_en": "Al Rii", "line": yellow, "order": 1, "lat": 24.8100, "lng": 46.6200, "is_interchange": False},
        {"name_ar": "طريق الثمامة", "name_en": "Thumamah Yellow", "line": yellow, "order": 2, "lat": 24.8200, "lng": 46.6300, "is_interchange": False},
        {"name_ar": "حي المحمدية", "name_en": "Al Mohammadiyah", "line": yellow, "order": 3, "lat": 24.8300, "lng": 46.6400, "is_interchange": False},
        {"name_ar": "العزيزية", "name_en": "Al Aziziyah", "line": yellow, "order": 4, "lat": 24.8400, "lng": 46.6500, "is_interchange": True},
        {"name_ar": "حي السلام", "name_en": "Al Salam Yellow", "line": yellow, "order": 5, "lat": 24.8500, "lng": 46.6600, "is_interchange": False},
        {"name_ar": "طريق أنس", "name_en": "Anas Road", "line": yellow, "order": 6, "lat": 24.8600, "lng": 46.6700, "is_interchange": False},
        {"name_ar": "حي النرجس", "name_en": "Al Narjis", "line": yellow, "order": 7, "lat": 24.8700, "lng": 46.6800, "is_interchange": False},
        {"name_ar": "الحمراء", "name_en": "Al Hamra Yellow", "line": yellow, "order": 8, "lat": 24.8800, "lng": 46.6900, "is_interchange": False},
        {"name_ar": "حي الياسمين", "name_en": "Al Yasmin Yellow", "line": yellow, "order": 9, "lat": 24.8900, "lng": 46.7000, "is_interchange": False},

        # Green Line (12 stations)
        {"name_ar": "حي الشراع", "name_en": "Al Sharai", "line": green, "order": 1, "lat": 24.6200, "lng": 46.6800, "is_interchange": False},
        {"name_ar": "طريق الخزان", "name_en": "Al Khazzan Road", "line": green, "order": 2, "lat": 24.6300, "lng": 46.6900, "is_interchange": False},
        {"name_ar": "حي الدوبية", "name_en": "Al Dobeat", "line": green, "order": 3, "lat": 24.6400, "lng": 46.7000, "is_interchange": False},
        {"name_ar": "الحراج", "name_en": "Al Haraj", "line": green, "order": 4, "lat": 24.6500, "lng": 46.7100, "is_interchange": False},
        {"name_ar": "حي الصفا", "name_en": "Al Safa", "line": green, "order": 5, "lat": 24.6600, "lng": 46.7200, "is_interchange": True},
        {"name_ar": "طريق الأمير سلطان", "name_en": "Prince Sultan Green", "line": green, "order": 6, "lat": 24.6700, "lng": 46.7300, "is_interchange": False},
        {"name_ar": "حي المونسية", "name_en": "Al Munsiyah", "line": green, "order": 7, "lat": 24.6800, "lng": 46.7400, "is_interchange": False},
        {"name_ar": "الشفاء", "name_en": "Al Shafa", "line": green, "order": 8, "lat": 24.6900, "lng": 46.7500, "is_interchange": False},
        {"name_ar": "حي ابن خلدون", "name_en": "Ibn Khaldun District", "line": green, "order": 9, "lat": 24.7000, "lng": 46.7600, "is_interchange": False},
        {"name_ar": "طريق الأرقام", "name_en": "Al Aqiq Road", "line": green, "order": 10, "lat": 24.7100, "lng": 46.7700, "is_interchange": False},
        {"name_ar": "حي الراكة", "name_en": "Al Raka", "line": green, "order": 11, "lat": 24.7200, "lng": 46.7800, "is_interchange": False},
        {"name_ar": "الخزان", "name_en": "Al Khazzan", "line": green, "order": 12, "lat": 24.7300, "lng": 46.7900, "is_interchange": False},

        # Purple Line (11 stations)
        {"name_ar": "حي المهدية", "name_en": "Al Mahdiyah", "line": purple, "order": 1, "lat": 24.8500, "lng": 46.5500, "is_interchange": False},
        {"name_ar": "طريق الطائف", "name_en": "Taif Road", "line": purple, "order": 2, "lat": 24.8600, "lng": 46.5600, "is_interchange": False},
        {"name_ar": "حي اليمامة", "name_en": "Al Yamamah", "line": purple, "order": 3, "lat": 24.8700, "lng": 46.5700, "is_interchange": False},
        {"name_ar": "الدرعية", "name_en": "Ad Diriyah", "line": purple, "order": 4, "lat": 24.8800, "lng": 46.5800, "is_interchange": True},
        {"name_ar": "حي أشبيلية", "name_en": "Al Ishbiliyah", "line": purple, "order": 5, "lat": 24.8900, "lng": 46.5900, "is_interchange": False},
        {"name_ar": "طريق أبي رقبة", "name_en": "Abi Roqibah Road", "line": purple, "order": 6, "lat": 24.9000, "lng": 46.6000, "is_interchange": False},
        {"name_ar": "حي بن مسعود", "name_en": "Bin Masoud District", "line": purple, "order": 7, "lat": 24.9100, "lng": 46.6100, "is_interchange": False},
        {"name_ar": "الحزم", "name_en": "Al Hazm", "line": purple, "order": 8, "lat": 24.9200, "lng": 46.6200, "is_interchange": False},
        {"name_ar": "حي الملك", "name_en": "Al Manz", "line": purple, "order": 9, "lat": 24.9300, "lng": 46.6300, "is_interchange": False},
        {"name_ar": "طريق النصر", "name_en": "Victory Road", "line": purple, "order": 10, "lat": 24.9400, "lng": 46.6400, "is_interchange": False},
        {"name_ar": "حي القصر", "name_en": "Al Qasr", "line": purple, "order": 11, "lat": 24.9500, "lng": 46.6500, "is_interchange": False},
    ]

    stations = []
    for sd in stations_data:
        line = sd.pop("line")
        station = Station(line_id=line.id, **sd)
        db.add(station)
        stations.append(station)
    db.flush()
    return stations


def seed_trains(db: Session, lines: list[Line], stations: list[Station]) -> list[Train]:
    trains = []
    status_pool = ["active"] * 8 + ["active"] * 1 + ["maintenance"] * 1
    directions = ["forward", "reverse"]

    for line in lines:
        line_stations = [s for s in stations if s.line_id == line.id]
        num_trains = random.randint(5, 8)
        for i in range(num_trains):
            station = random.choice(line_stations)
            train = Train(
                line_id=line.id,
                name=f"{line.name_en.split()[0]}-{i + 1:03d}",
                status=random.choice(status_pool),
                current_station_id=station.id,
                speed=random.uniform(0, 120),
                direction=random.choice(directions),
                last_updated=datetime.datetime.utcnow() - datetime.timedelta(seconds=random.randint(0, 300)),
            )
            db.add(train)
            trains.append(train)
    db.flush()
    return trains


def seed_cameras(db: Session, lines: list[Line], stations: list[Station]) -> list[Camera]:
    cameras = []
    status_pool = ["active"] * 8 + ["warning"] * 1 + ["offline"] * 1
    cam_names = [
        "Platform Camera", "Entrance Camera", "Exit Camera",
        "Concourse Camera", "Parking Camera", "Ticket Hall Camera",
    ]

    for line in lines:
        line_stations = [s for s in stations if s.line_id == line.id]
        for station in line_stations[:8]:
            cam = Camera(
                station_id=station.id,
                line_id=line.id,
                status=random.choice(status_pool),
                name=f"{station.name_en} - {random.choice(cam_names)}",
            )
            db.add(cam)
            cameras.append(cam)
    db.flush()
    return cameras


def seed_alerts(db: Session, lines: list[Line], stations: list[Station]) -> list[Alert]:
    alerts_data = [
        {
            "type": "critical",
            "title_ar": "انقطاع كهرباء في محطة الرياض بارك",
            "title_en": "Power Outage at Riyadh Park Station",
            "description_ar": "انقطاع في التيار الكهربائي يؤدي إلى توقف المصاعد والمصاطب الكهربائية",
            "description_en": "Power interruption causing elevator and escalator shutdown",
            "line": lines[0], "station": stations[9],
        },
        {
            "type": "critical",
            "title_ar": "حريق في غرفة التحكم الفرعية",
            "title_en": "Fire at Sub Control Room",
            "description_ar": "استشعار دخان في غرفة التحكم الفرعية - فرق الإطفاء في الطريق",
            "description_en": "Smoke detected in sub control room - fire teams en route",
            "line": lines[1], "station": stations[24],
        },
        {
            "type": "warning",
            "title_ar": "تأخير في الخط الأزرق",
            "title_en": "Blue Line Delay",
            "description_ar": "تأخير 5 دقائق بسبب صيانة مخططة على جسر حي الياسمين",
            "description_en": "5 minute delay due to scheduled maintenance on Al Yasmin bridge",
            "line": lines[0], "station": stations[4],
        },
        {
            "type": "warning",
            "title_ar": "ازدحام شديد في محطة البطحاء",
            "title_en": "High Crowd at Al Bathaa Station",
            "description_ar": "مستوى التجمع مرتفع - تم تفعيل إجراءات إدارة الحشود",
            "description_en": "High crowd level - crowd management protocols activated",
            "line": lines[1], "station": stations[27],
        },
        {
            "type": "warning",
            "title_ar": "كاميرا خارج الخدمة",
            "title_en": "Camera Offline at Terminal",
            "description_ar": "الكاميرا رقم C-014 خارج الخدمة في مطار الملك خالد",
            "description_en": "Camera C-014 offline at King Khalid Airport terminal",
            "line": lines[2], "station": stations[50],
        },
        {
            "type": "info",
            "title_ar": "صيانة مجدولة",
            "title_en": "Scheduled Maintenance",
            "description_ar": "صيانة وقائية على سكة الخط الأصفر - يوم الجمعة",
            "description_en": "Preventive maintenance on Yellow Line track - Friday schedule",
            "line": lines[3], "station": stations[75],
        },
        {
            "type": "info",
            "title_ar": "تحديث النظام",
            "title_en": "System Update",
            "description_ar": "تحديث برنامج التحكم في القطار - لا يتأثر التشغيل",
            "description_en": "Train control software update - no operational impact",
            "line": None, "station": None,
        },
        {
            "type": "info",
            "title_ar": "اختبار طارئ",
            "title_en": "Emergency Drill",
            "description_ar": "تمارين إخلاء مجدولة في محطة Dereiyah - لا تأثير على الخدمة",
            "description_en": "Scheduled evacuation drill at Diriyah Station - no service impact",
            "line": lines[5], "station": stations[86],
        },
        {
            "type": "info",
            "title_ar": "تحسينات البنية التحتية",
            "title_en": "Infrastructure Improvements",
            "description_ar": "تحسينات على نظام التهوية في محطة العزيزية",
            "description_en": "Ventilation system improvements at Al Aziziyah Station",
            "line": lines[3], "station": stations[78],
        },
    ]

    now = datetime.datetime.utcnow()
    alerts = []
    for i, ad in enumerate(alerts_data):
        line = ad.pop("line")
        station = ad.pop("station")
        alert = Alert(
            line_id=line.id if line else None,
            station_id=station.id if station else None,
            is_acknowledged=(i > 2),
            created_at=now - datetime.timedelta(minutes=random.randint(5, 120)),
            **ad,
        )
        db.add(alert)
        alerts.append(alert)
    db.flush()
    return alerts


def seed_passenger_records(db: Session, lines: list[Line], stations: list[Station]) -> None:
    now = datetime.datetime.utcnow()
    for hour_offset in range(24):
        ts = now - datetime.timedelta(hours=23 - hour_offset)
        hour = ts.hour
        for line in lines:
            line_stations = [s for s in stations if s.line_id == line.id]
            for station in line_stations[:5]:
                base_count = _passenger_count_for_hour(hour)
                count = int(base_count * random.uniform(0.7, 1.3))
                density = min(100.0, max(5.0, count / 150.0 * 100))
                rec = PassengerRecord(
                    line_id=line.id,
                    station_id=station.id,
                    count=count,
                    timestamp=ts,
                    density_percent=round(density, 1),
                )
                db.add(rec)


def _passenger_count_for_hour(hour: int) -> int:
    pattern = {
        0: 800, 1: 400, 2: 200, 3: 150, 4: 300, 5: 600,
        6: 1500, 7: 2500, 8: 3500, 9: 3200, 10: 2800, 11: 2600,
        12: 2400, 13: 2600, 14: 2800, 15: 3000, 16: 3500, 17: 4200,
        18: 4000, 19: 3500, 20: 3000, 21: 2500, 22: 1800, 23: 1200,
    }
    return pattern.get(hour, 1000)


def seed_system_health(db: Session) -> None:
    now = datetime.datetime.utcnow()
    for i in range(24):
        ts = now - datetime.timedelta(hours=i)
        db.add(SystemHealth(
            health_percent=round(random.uniform(97.5, 99.9), 1),
            uptime_seconds=86400 * 30 - i * 3600 + random.randint(0, 300),
            timestamp=ts,
        ))


def seed_settings(db: Session) -> None:
    existing = db.query(Settings).first()
    if not existing:
        db.add(Settings())


def run_seed(db: Session) -> None:
    if db.query(Line).first():
        return
    lines = seed_lines(db)
    stations = seed_stations(db, lines)
    seed_trains(db, lines, stations)
    seed_cameras(db, lines, stations)
    seed_alerts(db, lines, stations)
    seed_passenger_records(db, lines, stations)
    seed_system_health(db)
    seed_settings(db)
    db.commit()
