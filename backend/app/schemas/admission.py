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
