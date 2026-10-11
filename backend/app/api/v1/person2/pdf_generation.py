from fastapi import APIRouter

router = APIRouter(prefix="/pdf-generation", tags=["person2-pdf-generation"])


@router.get("")
def pdf_generation() -> dict[str, str]:
    return {"message": "PDF generation endpoint placeholder"}
