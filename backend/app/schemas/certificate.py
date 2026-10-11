from datetime import date

from pydantic import BaseModel


class CertificateCreate(BaseModel):
    student_id: int
    certificate_number: str
    certificate_type: str
    issue_date: date | None = None
    issued_by: int | None = None
    purpose: str | None = None
    pdf_path: str | None = None


class CertificateRead(CertificateCreate):
    id: int
