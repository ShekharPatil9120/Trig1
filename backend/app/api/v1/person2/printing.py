from fastapi import APIRouter

router = APIRouter(prefix="/printing", tags=["person2-printing"])


@router.get("")
def printing() -> dict[str, str]:
    return {"message": "Printing endpoint placeholder"}
