from fastapi import APIRouter

router = APIRouter(prefix="/students", tags=["person1-student-profile"])


@router.get("/{student_id}/profile")
def student_profile(student_id: str) -> dict[str, str]:
    return {"student_id": student_id, "message": "Student profile endpoint placeholder"}
