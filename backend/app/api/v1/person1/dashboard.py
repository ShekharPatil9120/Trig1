from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["person1-dashboard"])


@router.get("")
def dashboard() -> dict[str, str]:
    return {"message": "Dashboard endpoint placeholder"}
