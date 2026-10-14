import io
import re
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

from app.core.branding import SCHOOL_LOGO_PATH, SCHOOL_NAME
from app.models.student import Student
from app.services.person1.registration_certificate_service import (
    build_registration_certificate_pdf,
    registration_certificate_filename,
)


TEMPLATE_DIR = Path(__file__).resolve().parents[2] / "templates" / "certificates"
CERTIFICATE_TEMPLATES = {
    "registration": ("registration", ""),
    "bonafide": ("bonafide_certificate.html", "Bonafide Certificate"),
    "study": ("study_certificate.html", "Study Certificate"),
    "character": ("character_certificate.html", "Character Certificate"),
    "transfer": ("transfer_certificate.html", "Transfer Certificate"),
}
CERTIFICATE_TYPES = [
    {"id": key, "name": title}
    for key, (_, title) in CERTIFICATE_TEMPLATES.items()
    if key != "registration"
]
CERTIFICATE_TYPES.insert(0, {"id": "registration", "name": "Registration Certificate"})


class _TitleParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_heading = False
        self.title = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "h1":
            self.in_heading = True

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "h1":
            self.in_heading = False

    def handle_data(self, data: str) -> None:
        if self.in_heading:
            self.title += data


def generate_certificate_pdf(
    certificate_type: str,
    student: Student,
) -> tuple[bytes, str]:
    selected_type = certificate_type.strip().lower()
    if selected_type not in CERTIFICATE_TEMPLATES:
        raise ValueError("Unsupported certificate type.")

    if selected_type == "registration":
        return build_registration_certificate_pdf(student), registration_certificate_filename(student.name)

    template_name, _ = CERTIFICATE_TEMPLATES[selected_type]
    template_path = TEMPLATE_DIR / template_name
    if not template_path.exists():
        raise FileNotFoundError(f"Certificate template was not found: {template_path.name}")

    parser = _TitleParser()
    parser.feed(template_path.read_text(encoding="utf-8"))
    title = parser.title.strip() or next(item["name"] for item in CERTIFICATE_TYPES if item["id"] == selected_type)
    content = _build_student_certificate(title, selected_type, student)
    return content, _certificate_filename(title, student.name)


def _build_student_certificate(title: str, certificate_type: str, student: Student) -> bytes:
    packet = io.BytesIO()
    pdf = canvas.Canvas(packet, pagesize=A4)
    width, height = A4

    pdf.setStrokeColor(colors.HexColor("#1d4ed8"))
    pdf.setLineWidth(1.5)
    pdf.roundRect(42, 42, width - 84, height - 84, 12, stroke=1, fill=0)
    pdf.setFillColor(colors.HexColor("#0f172a"))
    pdf.drawImage(
        ImageReader(str(SCHOOL_LOGO_PATH)),
        58,
        height - 170,
        width=54,
        height=54,
        preserveAspectRatio=True,
        anchor="c",
        mask="auto",
    )
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawCentredString(width / 2, height - 120, SCHOOL_NAME)
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawCentredString(width / 2, height - 190, title)
    pdf.setStrokeColor(colors.HexColor("#94a3b8"))
    pdf.line(100, height - 205, width - 100, height - 205)

    academic_year = student.admission.academic_year.name if student.admission and student.admission.academic_year else ""
    class_record = student.class_ or (student.admission.class_ if student.admission else None)
    section_record = student.section or (student.admission.section if student.admission else None)
    class_section = " / ".join(
        value for value in (class_record.name if class_record else None, section_record.name if section_record else None) if value
    )
    parent = student.parent
    guardian = (parent.guardian_name or parent.father_name or parent.mother_name) if parent else ""
    admission = student.admission
    fields = [
        ("Student Name", student.name),
        ("Registration Number", admission.registration_number if admission else ""),
        ("Admission Number", student.admission_number or (admission.admission_number if admission else "")),
        ("Class / Section", class_section),
        ("Academic Year", academic_year),
        ("Date of Birth", _format_date(student.date_of_birth)),
        ("Admission Date", _format_date(admission.admission_date if admission else None)),
        ("Parent / Guardian", guardian),
    ]

    statements = {
        "bonafide": "This certificate confirms the student's enrollment as recorded by the school.",
        "study": "This certificate records the student's study details available in the school register.",
        "character": "This certificate is issued with reference to the student's school record.",
        "transfer": "This certificate records the student's admission details available in the school register.",
    }
    pdf.setFont("Helvetica", 11)
    pdf.drawCentredString(width / 2, height - 245, statements[certificate_type])
    y = height - 300
    for label, value in fields:
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(92, y, f"{label}:")
        pdf.setFont("Helvetica", 11)
        pdf.drawString(245, y, _fit_value(value or "", 245))
        y -= 34

    # Keep signing fields empty for the school to complete.
    pdf.setFont("Helvetica", 10)
    pdf.line(90, 115, 230, 115)
    pdf.line(width - 230, 115, width - 90, 115)
    pdf.drawCentredString(160, 98, "Class Teacher")
    pdf.drawCentredString(width - 160, 98, "Head Teacher / Principal")
    pdf.save()
    return packet.getvalue()


def _fit_value(value: str, max_width: float) -> str:
    while value and len(value) > 3 and len(value) * 6.2 > max_width:
        value = value[:-4].rstrip() + "..."
    return value


def _format_date(value: date | None) -> str:
    return value.strftime("%d %B %Y") if value else ""


def _certificate_filename(title: str, student_name: str) -> str:
    safe_title = re.sub(r"[^A-Za-z0-9]+", "_", title).strip("_") or "Certificate"
    safe_name = re.sub(r"[^A-Za-z0-9]+", "_", student_name).strip("_") or "Student"
    return f"{safe_title}_{safe_name}.pdf"
