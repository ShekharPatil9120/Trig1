from fastapi import APIRouter

router = APIRouter(prefix="/certificate-numbering", tags=["person2-certificate-numbering"])


@router.get("")
def certificate_numbering() -> dict[str, str]:
    return {"message": "Certificate numbering endpoint placeholder"}
