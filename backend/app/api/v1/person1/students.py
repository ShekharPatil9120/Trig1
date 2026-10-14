from datetime import date
from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.core.dependencies import get_db
from app.models.academic_year import AcademicYear
from app.models.admission import Admission
from app.models.class_section import Class, Section
from app.models.parent import Parent
from app.models.student import Student
from app.schemas.student import (
    StudentRegisterItem,
    StudentRegisterOption,
    StudentRegisterOptions,
    StudentRegisterResponse,
)

router = APIRouter(prefix="/students", tags=["person1-students"])


@router.get("")
def list_students(
    db: Session = Depends(get_db),
    search: str | None = Query(default=None),
    academic_year_id: int | None = Query(default=None),
    class_id: int | None = Query(default=None),
    section_id: int | None = Query(default=None),
    gender: str | None = Query(default=None),
    status: str | None = Query(default=None),
    admission_date_from: date | None = Query(default=None),
    admission_date_to: date | None = Query(default=None),
    sort_by: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
) -> StudentRegisterResponse:
    if admission_date_from and admission_date_to and admission_date_from > admission_date_to:
        raise HTTPException(status_code=422, detail="Admission date range is invalid.")

    query = (
        select(Student)
        .outerjoin(Student.admission)
        .outerjoin(Student.parent)
        .options(
            joinedload(Student.class_),
            joinedload(Student.section),
            joinedload(Student.parent),
            joinedload(Student.admission).joinedload(Admission.academic_year),
            joinedload(Student.admission).joinedload(Admission.class_),
            joinedload(Student.admission).joinedload(Admission.section),
        )
    )

    trimmed_search = search.strip() if search else None
    if trimmed_search:
        pattern = f"%{trimmed_search.lower()}%"
        query = query.where(
            or_(
                func.lower(func.coalesce(Student.admission_number, "")).like(pattern),
                func.lower(func.coalesce(Student.student_id, "")).like(pattern),
                func.lower(Student.name).like(pattern),
                func.lower(func.coalesce(Parent.father_name, "")).like(pattern),
                func.lower(func.coalesce(Parent.mother_name, "")).like(pattern),
                func.lower(func.coalesce(Parent.guardian_name, "")).like(pattern),
                func.lower(func.coalesce(Parent.phone, "")).like(pattern),
                func.lower(func.coalesce(Admission.admission_number, "")).like(pattern),
                func.lower(func.coalesce(Admission.registration_number, "")).like(pattern),
            )
        )

    if academic_year_id is not None:
        query = query.where(Admission.academic_year_id == academic_year_id)
    if class_id is not None:
        query = query.where(or_(Student.class_id == class_id, Admission.class_id == class_id))
    if section_id is not None:
        query = query.where(or_(Student.section_id == section_id, Admission.section_id == section_id))
    if gender:
        query = query.where(func.lower(func.coalesce(Student.gender, "")) == gender.strip().lower())
    if status:
        query = query.where(func.lower(func.coalesce(Student.status, "")) == status.strip().lower())
    if admission_date_from is not None:
        query = query.where(Admission.admission_date >= admission_date_from)
    if admission_date_to is not None:
        query = query.where(Admission.admission_date <= admission_date_to)

    count_query = select(func.count()).select_from(query.order_by(None).subquery())
    total = db.execute(count_query).scalar_one()
    total_pages = ceil(total / page_size) if total else 0
    if total_pages and page > total_pages:
        page = total_pages

    if sort_by == "recent_admission":
        query = query.order_by(
            Admission.admission_date.is_(None),
            Admission.admission_date.desc(),
            Student.created_at.is_(None),
            Student.created_at.desc(),
            Student.id.desc(),
        )
    elif sort_by:
        raise HTTPException(status_code=422, detail="Unsupported student sort option.")
    else:
        query = query.order_by(Student.name.asc(), Student.id.asc())

    students = db.execute(query.offset((page - 1) * page_size).limit(page_size)).scalars().unique().all()

    return StudentRegisterResponse(
        items=[_to_register_item(student) for student in students],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        options=_get_register_options(db),
    )


def _to_register_item(student: Student) -> StudentRegisterItem:
    admission = student.admission
    parent = student.parent
    class_record = student.class_ or (admission.class_ if admission else None)
    section_record = student.section or (admission.section if admission else None)
    academic_year = admission.academic_year if admission else None

    return StudentRegisterItem(
        id=student.id,
        admission_number=student.admission_number or (admission.admission_number if admission else None),
        registration_number=admission.registration_number if admission else None,
        student_id=student.student_id,
        name=student.name,
        class_id=class_record.id if class_record else None,
        class_name=class_record.name if class_record else None,
        section_id=section_record.id if section_record else None,
        section_name=section_record.name if section_record else None,
        gender=student.gender,
        date_of_birth=student.date_of_birth,
        parent_guardian_name=_parent_name(parent),
        parent_guardian_phone=parent.phone if parent else None,
        admission_date=admission.admission_date if admission else None,
        academic_year_id=academic_year.id if academic_year else None,
        academic_year_name=academic_year.name if academic_year else None,
        status=student.status or "active",
    )


def _parent_name(parent: Parent | None) -> str | None:
    if not parent:
        return None
    return parent.guardian_name or parent.father_name or parent.mother_name


def _get_register_options(db: Session) -> StudentRegisterOptions:
    academic_years = db.execute(select(AcademicYear).order_by(AcademicYear.name.asc())).scalars().all()
    classes = db.execute(select(Class).order_by(Class.name.asc())).scalars().all()
    sections = db.execute(select(Section).order_by(Section.name.asc())).scalars().all()
    status_value = cast(Student.status, String)
    genders = [
        row[0]
        for row in db.execute(
            select(Student.gender).where(Student.gender.is_not(None), Student.gender != "").distinct().order_by(Student.gender)
        ).all()
    ]
    statuses = [
        row[0]
        for row in db.execute(
            select(status_value)
            .where(Student.status.is_not(None), Student.status != "")
            .distinct()
            .order_by(status_value)
        ).all()
    ]

    return StudentRegisterOptions(
        academic_years=[StudentRegisterOption(id=item.id, name=item.name) for item in academic_years],
        classes=[StudentRegisterOption(id=item.id, name=item.name) for item in classes],
        sections=[StudentRegisterOption(id=item.id, name=item.name) for item in sections],
        genders=genders,
        statuses=statuses,
    )
