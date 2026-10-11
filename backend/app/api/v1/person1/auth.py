from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["person1-auth"])


@router.post("/login")
def login() -> dict[str, str]:
    return {"message": "Login endpoint placeholder"}
