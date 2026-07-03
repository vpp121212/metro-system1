import os
import tempfile
from datetime import datetime

from fastapi.responses import FileResponse
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle


def generate_incident_report(incident) -> FileResponse:
    buf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    doc = SimpleDocTemplate(
        buf.name, pagesize=A4,
        rightMargin=15*mm, leftMargin=15*mm,
        topMargin=15*mm, bottomMargin=15*mm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("Title", parent=styles["Title"], fontSize=18, spaceAfter=20, alignment=TA_CENTER)
    heading_style = ParagraphStyle(
        "Heading", parent=styles["Heading2"], fontSize=13, spaceAfter=8, spaceBefore=16,
        textColor=colors.HexColor("#1a237e"),
    )
    normal = ParagraphStyle("Normal", parent=styles["Normal"], fontSize=10, spaceAfter=4)

    elements = []
    elements.append(Paragraph("Incident Report", title_style))
    elements.append(Paragraph(
        "Smart Metro Operations Management System",
        ParagraphStyle("Sub", parent=normal, fontSize=11, alignment=TA_CENTER, textColor=colors.gray, spaceAfter=20),
    ))

    inc = incident
    info = [
        ["Incident #", inc.incident_number or "", "Date", str(inc.date or "")],
        ["Time", inc.time.strftime("%H:%M") if inc.time else "", "Shift", inc.shift or ""],
        ["Station", inc.station or "", "Location", inc.location or ""],
    ]
    t = Table(info, colWidths=[70, 120, 70, 120])
    t.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e8eaf6")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#e8eaf6")),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("Description", heading_style))
    elements.append(Paragraph(inc.description or "", normal))
    elements.append(Spacer(1, 6))

    det = inc.detection
    if det:
        elements.append(Paragraph("Detection & Reporting", heading_style))
        det_info = [
            ["Discovered By", det.discovered_by or "", "First Reporter", det.first_reporter or ""],
            ["Detection Time", str(det.detection_time or ""), "OCC Notification", str(det.occ_notification_time or "")],
            ["OCC Response", str(det.occ_response_time or ""), "Emergency Code", det.emergency_code or ""],
        ]
        t = Table(det_info, colWidths=[90, 100, 90, 100])
        t.setStyle(TableStyle([
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e8f5e9")),
            ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#e8f5e9")),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("PADDING", (0, 0), (-1, -1), 6),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 6))

    if inc.incident_types:
        elements.append(Paragraph("Incident Type", heading_style))
        types_str = ", ".join(t.type_name for t in inc.incident_types)
        elements.append(Paragraph(types_str, normal))

    if inc.passengers:
        elements.append(Paragraph("Passenger Data", heading_style))
        for p in inc.passengers:
            pdata = [
                ["Name", p.name or "", "Age", str(p.age or "")],
                ["Phone", p.phone or "", "Emergency Contact", p.emergency_contact or ""],
                ["Status", p.passenger_status or "", "Hospital", p.hospital_name or ""],
            ]
            t = Table(pdata, colWidths=[70, 120, 70, 120])
            t.setStyle(TableStyle([
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#fff3e0")),
                ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#fff3e0")),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("PADDING", (0, 0), (-1, -1), 5),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 4))

    train = inc.train_operations
    if train and train.train_number:
        elements.append(Paragraph("Train Operations", heading_style))
        tinfo = [
            ["Train Number", train.train_number or "", "Mode", train.operation_mode or ""],
            ["Location", train.current_location or "", "Destination", train.destination or ""],
        ]
        if train.rescue_train_number:
            tinfo.append(["Rescue Train", train.rescue_train_number, "", ""])
        t = Table(tinfo, colWidths=[90, 100, 70, 120])
        t.setStyle(TableStyle([
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e3f2fd")),
            ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#e3f2fd")),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("PADDING", (0, 0), (-1, -1), 5),
        ]))
        elements.append(t)

    evac = inc.evacuation
    if evac and evac.evacuation_order_time:
        elements.append(Paragraph("Station Evacuation", heading_style))
        einfo = [
            ["Order Time", str(evac.evacuation_order_time or ""), "Start Time", str(evac.evacuation_start_time or "")],
            ["Completion", str(evac.evacuation_completion_time or ""), "OCC Clear", str(evac.station_clear_notification_time or "")],
            ["Reopening", str(evac.station_reopening_time or ""), "", ""],
        ]
        t = Table(einfo, colWidths=[90, 100, 90, 100])
        t.setStyle(TableStyle([
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#fce4ec")),
            ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#fce4ec")),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("PADDING", (0, 0), (-1, -1), 5),
        ]))
        elements.append(t)

    impact = inc.impact
    if impact:
        elements.append(Paragraph("Impact Assessment", heading_style))
        iinfo = [
            ["Duration (min)", str(impact.incident_duration or ""), "Response Time", str(impact.response_duration or "")],
            ["Train Delays", str(impact.train_delays or ""), "Passengers Affected", str(impact.passengers_affected or "")],
            ["Injuries", str(impact.injuries or ""), "Fatalities", str(impact.fatalities or "")],
        ]
        t = Table(iinfo, colWidths=[90, 100, 90, 100])
        t.setStyle(TableStyle([
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f3e5f5")),
            ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#f3e5f5")),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("PADDING", (0, 0), (-1, -1), 5),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 6))

        if impact.cause:
            elements.append(Paragraph("Cause", heading_style))
            elements.append(Paragraph(impact.cause, normal))
        if impact.corrective_actions:
            elements.append(Paragraph("Corrective Actions", heading_style))
            elements.append(Paragraph(impact.corrective_actions, normal))
        if impact.lessons_learned:
            elements.append(Paragraph("Lessons Learned", heading_style))
            elements.append(Paragraph(impact.lessons_learned, normal))

    elements.append(Spacer(1, 20))
    footer = ParagraphStyle("Footer", parent=normal, fontSize=8, textColor=colors.grey, alignment=TA_CENTER)
    elements.append(Paragraph(
        f"Report generated: {datetime.now().strftime('%Y-%m-%d %H:%M')} | Smart Metro Operations Management System",
        footer,
    ))

    doc.build(elements)

    with open(buf.name, "rb") as f:
        pdf_bytes = f.read()

    os.unlink(buf.name)
    from fastapi.responses import Response
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=incident_{inc.incident_number}.pdf"},
    )
