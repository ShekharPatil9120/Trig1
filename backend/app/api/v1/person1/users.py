from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["person1-users"])


@router.get("")
def list_users() -> dict[str, str]:
    return {"message": "Users endpoint placeholder"}
