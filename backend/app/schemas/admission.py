from datetime import date

from pydantic import BaseModel


class AdmissionCreate(BaseModel):
    student_id: int
    admission_number: str | None = None
    registration_number: str | None = None
    admission_date: date | None = None
    academic_year_id: int | None = None
    class_id: int | None = None
    section_id: int | None = None
    admission_type: str | None = None
    previous_school: str | None = None
    previous_class: str | None = None
    previous_admission_number: str | None = None
    previous_tc_number: str | None = None


class AdmissionRead(AdmissionCreate):
    id: int


class AdmissionRegistrationCreate(BaseModel):
    admission_date: date
    academic_year: str
    class_admitted: str
    section: str
    admission_type: str
    registration_number: str | None = None
    previous_school: str | None = None
    previous_class: str | None = None
    previous_admission_number: str | None = None
    previous_tc_number: str | None = None
    student_name: str
    date_of_birth: date
    gender: str
    father_name: str | None = None
    mother_name: str | None = None
    guardian_name: str | None = None
    parent_phone: str | None = None
    parent_email: str | None = None
    parent_address: str | None = None


class AdmissionRegistrationRead(BaseModel):
    student_id: int
    student_code: str
    admission_id: int
    admission_number: str
    student_name: str
    academic_year: str
    class_name: str
    section_name: str


class BulkAdmissionError(BaseModel):
    row_number: int
    column: str
    value: str | None = None
    message: str
    suggestion: str | None = None


class BulkAdmissionPreviewRow(BaseModel):
    row_number: int
    status: str
    admission_date: date | None = None
    academic_year: str | None = None
    class_admitted: str | None = None
    section: str | None = None
    admission_type: str | None = None
    registration_number: str | None = None
    student_name: str | None = None
    date_of_birth: date | None = None
    gender: str | None = None
    parent_phone: str | None = None
    errors: list[BulkAdmissionError] = []


class BulkAdmissionValidationResponse(BaseModel):
    total_rows: int
    valid_rows: int
    invalid_rows: int
    duplicate_rows: int
    rows: list[BulkAdmissionPreviewRow]
    errors: list[BulkAdmissionError] = []
    academic_years_to_create: list[str] = []
    classes_to_create: list[str] = []
    sections_to_create: list[str] = []


class BulkAdmissionImportSummary(BaseModel):
    rows_processed: int
    imported: int
    invalid_rows: int
    duplicate_rows: int
    failed_rows: int
    academic_years_created: list[str] = []
    classes_created: list[str] = []
    sections_created: list[str] = []


class BulkAdmissionImportResponse(BaseModel):
    summary: BulkAdmissionImportSummary
    imported_records: list[AdmissionRegistrationRead] = []
    validation: BulkAdmissionValidationResponse
