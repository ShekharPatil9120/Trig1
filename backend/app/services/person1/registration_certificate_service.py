import io
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.pdfgen import canvas

from app.core.branding import SCHOOL_NAME
from app.models.admission import Admission
from app.models.parent import Parent
from app.models.school import School
from app.models.student import Student


TEMPLATE_PATH = Path(__file__).resolve().parents[4] / "Student_Registration_Certificate_Blank_Fields.pdf"


@dataclass(frozen=True)
class RegistrationCertificateData:
    school_name: str
    school_address: str
    student_name: str
    registration_number: str
    admission_number: str
    academic_year: str
    class_section: str
    admission_date: str
    date_of_birth: str
    parent_guardian_name: str


def build_registration_certificate_pdf(student: Student, fallback_school: School | None = None) -> bytes:
    if not TEMPLATE_PATH.exists():
        raise FileNotFoundError(f"Registration certificate template was not found at {TEMPLATE_PATH}")

    data = _certificate_data(student, fallback_school)
    template_reader = PdfReader(str(TEMPLATE_PATH))
    template_page = template_reader.pages[0]
    width = float(template_page.mediabox.width)
    height = float(template_page.mediabox.height)

    overlay = _build_overlay(data, width, height)
    overlay_page = PdfReader(io.BytesIO(overlay)).pages[0]
    template_page.merge_page(overlay_page)

    writer = PdfWriter()
    writer.add_page(template_page)
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def registration_certificate_filename(student_name: str) -> str:
    safe_name = re.sub(r"[^A-Za-z0-9]+", "_", student_name).strip("_") or "Student"
    return f"Registration_Certificate_{safe_name}.pdf"


def _certificate_data(student: Student, fallback_school: School | None) -> RegistrationCertificateData:
    admission: Admission | None = student.admission
    parent: Parent | None = student.parent
    school = student.school or (student.class_.school if student.class_ else None) or (student.section.school if student.section else None) or fallback_school
    class_record = student.class_ or (admission.class_ if admission else None)
    section_record = student.section or (admission.section if admission else None)
    academic_year = admission.academic_year if admission else None

    # Keep the supplied template and its labeled fields; overlay the school's
    # database header data and the student fields without covering signatures.
    class_section = " / ".join(part for part in (class_record.name if class_record else None, section_record.name if section_record else None) if part)

    return RegistrationCertificateData(
        school_name=SCHOOL_NAME,
        school_address=_school_address(school),
        student_name=_value(student.name),
        registration_number=_value(admission.registration_number if admission else None),
        admission_number=_value(student.admission_number or (admission.admission_number if admission else None)),
        academic_year=_value(academic_year.name if academic_year else None),
        class_section=_value(class_section),
        admission_date=_format_date(admission.admission_date if admission else None),
        date_of_birth=_format_date(student.date_of_birth),
        parent_guardian_name=_value(_parent_name(parent)),
    )


def _build_overlay(data: RegistrationCertificateData, width: float, height: float) -> bytes:
    packet = io.BytesIO()
    pdf = canvas.Canvas(packet, pagesize=(width, height))

    if data.school_name:
        pdf.setFillColor(colors.white)
        pdf.rect(70, 737, width - 140, 50, fill=1, stroke=0)
        pdf.setFillColor(colors.HexColor("#111827"))
        _center_text(pdf, data.school_name, width / 2, 762.5, "Helvetica-Bold", 18)
        if data.school_address:
            _center_text(pdf, data.school_address, width / 2, 742.7, "Helvetica", 9, max_width=width - 120)
    # The template's eight labeled rows begin at y=608 and are spaced 36.85pt.
    # Place values in the open right column so labels and signature areas remain untouched.
    fields = (
        data.registration_number,
        data.student_name,
        data.admission_number,
        data.academic_year,
        data.class_section,
        data.admission_date,
        data.date_of_birth,
        data.parent_guardian_name,
    )
    for index, value in enumerate(fields):
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(260, 606 - index * 36.85, _fit_text(pdf, value, 10, width - 300))

    pdf.save()
    packet.seek(0)
    return packet.getvalue()


def _center_text(pdf: canvas.Canvas, text: str, x: float, y: float, font: str, size: int, max_width: float | None = None) -> None:
    value = text
    pdf.setFont(font, size)
    while max_width and pdf.stringWidth(value, font, size) > max_width and len(value) > 3:
        value = value[:-4].rstrip() + "..."
    pdf.drawCentredString(x, y, value)


def _fit_text(pdf: canvas.Canvas, text: str, size: int, max_width: float) -> str:
    value = text
    while value and pdf.stringWidth(value, "Helvetica-Bold", size) > max_width and len(value) > 3:
        value = value[:-4].rstrip() + "..."
    return value


def _school_address(school: School | None) -> str:
    if not school:
        return ""
    parts = [school.address, f"Phone: {school.phone}" if school.phone else None, school.email]
    return " | ".join(part.strip() for part in parts if part and part.strip())


def _parent_name(parent: Parent | None) -> str | None:
    if not parent:
        return None
    return parent.guardian_name or parent.father_name or parent.mother_name


def _format_date(value: date | None) -> str:
    return value.strftime("%d %B %Y") if value else ""


def _value(value: str | None) -> str:
    return value.strip() if value and value.strip() else ""
