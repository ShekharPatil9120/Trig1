from fastapi import APIRouter

router = APIRouter(prefix="/certificates", tags=["person2-certificates"])


@router.get("")
def list_certificates() -> dict[str, str]:
    return {"message": "Certificates endpoint placeholder"}
