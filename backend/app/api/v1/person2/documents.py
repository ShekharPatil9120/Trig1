from fastapi import APIRouter

router = APIRouter(prefix="/documents", tags=["person2-documents"])


@router.get("")
def list_documents() -> dict[str, str]:
    return {"message": "Documents endpoint placeholder"}
