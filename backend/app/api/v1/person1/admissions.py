from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.academic_year import AcademicYear
from app.models.admission import Admission
from app.models.class_section import Class, Section
from app.models.parent import Parent
from app.models.student import Student
from app.schemas.admission import AdmissionRegistrationCreate, AdmissionRegistrationRead

router = APIRouter(prefix="/admissions", tags=["person1-admissions"])


@router.get("")
def list_admissions() -> dict[str, str]:
    return {"message": "Admissions endpoint placeholder"}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_admission(payload: AdmissionRegistrationCreate, db: Session = Depends(get_db)) -> AdmissionRegistrationRead:
    now = datetime.utcnow()
    academic_year = _get_or_create_academic_year(db, payload.academic_year, now)
    class_record = _get_or_create_class(db, payload.class_admitted)
    section_record = _get_or_create_section(db, payload.section)
    admission_number = _next_admission_number(db, payload.admission_date.year)
    student_code = _next_student_code(db, payload.admission_date.year)

    student = Student(
        student_id=student_code,
        admission_number=admission_number,
        name=payload.student_name.strip(),
        date_of_birth=payload.date_of_birth,
        gender=payload.gender,
        class_id=class_record.id,
        section_id=section_record.id,
        status="active",
        created_at=now,
        updated_at=now,
    )
    db.add(student)
    db.flush()

    admission = Admission(
        student_id=student.id,
        admission_number=admission_number,
        registration_number=payload.registration_number,
        admission_date=payload.admission_date,
        academic_year_id=academic_year.id,
        class_id=class_record.id,
        section_id=section_record.id,
        admission_type=payload.admission_type,
        previous_school=payload.previous_school,
        previous_class=payload.previous_class,
        previous_admission_number=payload.previous_admission_number,
        previous_tc_number=payload.previous_tc_number,
        created_at=now,
        updated_at=now,
    )
    db.add(admission)
    db.flush()

    if any([payload.father_name, payload.mother_name, payload.guardian_name, payload.parent_phone, payload.parent_email, payload.parent_address]):
        db.add(
            Parent(
                student_id=student.id,
                father_name=payload.father_name,
                mother_name=payload.mother_name,
                guardian_name=payload.guardian_name,
                phone=payload.parent_phone,
                email=payload.parent_email,
                address=payload.parent_address,
                created_at=now,
                updated_at=now,
            )
        )

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Admission could not be saved because a generated identifier already exists.") from exc

    db.refresh(student)
    db.refresh(admission)

    return AdmissionRegistrationRead(
        student_id=student.id,
        student_code=student.student_id,
        admission_id=admission.id,
        admission_number=admission.admission_number or admission_number,
        student_name=student.name,
        academic_year=academic_year.name,
        class_name=class_record.name,
        section_name=section_record.name,
    )


def _get_or_create_academic_year(db: Session, name: str, now: datetime) -> AcademicYear:
    academic_year = db.execute(select(AcademicYear).where(func.lower(AcademicYear.name) == name.strip().lower())).scalar_one_or_none()
    if academic_year is None:
        academic_year = AcademicYear(name=name.strip(), created_at=now, updated_at=now)
        db.add(academic_year)
        db.flush()
    return academic_year


def _get_or_create_class(db: Session, name: str) -> Class:
    class_record = db.execute(select(Class).where(func.lower(Class.name) == name.strip().lower())).scalar_one_or_none()
    if class_record is None:
        class_record = Class(name=name.strip())
        db.add(class_record)
        db.flush()
    return class_record


def _get_or_create_section(db: Session, name: str) -> Section:
    section = db.execute(select(Section).where(func.lower(Section.name) == name.strip().lower())).scalar_one_or_none()
    if section is None:
        section = Section(name=name.strip())
        db.add(section)
        db.flush()
    return section


def _next_admission_number(db: Session, year: int) -> str:
    prefix = f"ADM/{year}/"
    count = db.execute(select(func.count()).select_from(Student).where(Student.admission_number.like(f"{prefix}%"))).scalar_one()
    return f"{prefix}{count + 1:04d}"


def _next_student_code(db: Session, year: int) -> str:
    prefix = f"STU-{year}-"
    count = db.execute(select(func.count()).select_from(Student).where(Student.student_id.like(f"{prefix}%"))).scalar_one()
    return f"{prefix}{count + 1:04d}"
