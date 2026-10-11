from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr | None = None
    full_name: str | None = None
    password: str
    role_id: int | None = None


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr | None = None
    full_name: str | None = None
    role_id: int | None = None
