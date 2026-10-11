from fastapi import APIRouter

router = APIRouter(prefix="/school", tags=["person1-school"])


@router.get("")
def get_school() -> dict[str, str]:
    return {"message": "School endpoint placeholder"}
