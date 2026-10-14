from datetime import date

from pydantic import BaseModel


class StudentBase(BaseModel):
    student_id: str
    admission_number: str | None = None
    name: str
    date_of_birth: date | None = None
    gender: str | None = None
    class_id: int | None = None
    section_id: int | None = None
    status: str = "active"


class StudentCreate(StudentBase):
    pass


class StudentRead(StudentBase):
    id: int


class StudentRegisterItem(BaseModel):
    id: int
    admission_number: str | None = None
    registration_number: str | None = None
    student_id: str | None = None
    name: str
    class_id: int | None = None
    class_name: str | None = None
    section_id: int | None = None
    section_name: str | None = None
    gender: str | None = None
    date_of_birth: date | None = None
    parent_guardian_name: str | None = None
    parent_guardian_phone: str | None = None
    admission_date: date | None = None
    academic_year_id: int | None = None
    academic_year_name: str | None = None
    status: str = "active"


class StudentRegisterOption(BaseModel):
    id: int
    name: str


class StudentRegisterOptions(BaseModel):
    academic_years: list[StudentRegisterOption] = []
    classes: list[StudentRegisterOption] = []
    sections: list[StudentRegisterOption] = []
    genders: list[str] = []
    statuses: list[str] = []


class StudentRegisterResponse(BaseModel):
    items: list[StudentRegisterItem]
    total: int
    page: int
    page_size: int
    total_pages: int
    options: StudentRegisterOptions
