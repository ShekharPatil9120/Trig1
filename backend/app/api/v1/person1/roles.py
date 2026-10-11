from fastapi import APIRouter

router = APIRouter(prefix="/roles", tags=["person1-roles"])


@router.get("")
def list_roles() -> dict[str, str]:
    return {"message": "Roles endpoint placeholder"}
