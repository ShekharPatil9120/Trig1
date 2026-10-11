from fastapi import APIRouter

router = APIRouter(prefix="/pdf-preview", tags=["person2-pdf-preview"])


@router.get("")
def pdf_preview() -> dict[str, str]:
    return {"message": "PDF preview endpoint placeholder"}
