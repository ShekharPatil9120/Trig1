import io

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.dependencies import get_db
from app.models.admission import Admission
from app.models.class_section import Class, Section
from app.models.student import Student
from app.services.person2.certificate_service import CERTIFICATE_TYPES, generate_certificate_pdf

router = APIRouter(prefix="/certificates", tags=["person2-certificates"])


@router.get("/types")
def certificate_types() -> list[dict[str, str]]:
    return CERTIFICATE_TYPES


@router.get("/generate/{student_id}")
def generate_student_certificate(
    student_id: int,
    certificate_type: str = Query(...),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    student = (
        db.execute(
            select(Student)
            .where(Student.id == student_id)
            .options(
                joinedload(Student.school),
                joinedload(Student.class_).joinedload(Class.school),
                joinedload(Student.section).joinedload(Section.school),
                joinedload(Student.parent),
                joinedload(Student.admission).joinedload(Admission.academic_year),
                joinedload(Student.admission).joinedload(Admission.class_),
                joinedload(Student.admission).joinedload(Admission.section),
            )
        )
        .scalars()
        .unique()
        .one_or_none()
    )
    if student is None:
        raise HTTPException(status_code=404, detail="Student record was not found.")

    try:
        content, filename = generate_certificate_pdf(certificate_type, student)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except FileNotFoundError as error:
        raise HTTPException(status_code=500, detail="The selected certificate template is unavailable.") from error

    return StreamingResponse(
        io.BytesIO(content),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
