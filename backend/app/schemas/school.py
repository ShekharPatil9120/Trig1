from pydantic import BaseModel


class SchoolCreate(BaseModel):
    name: str
    code: str | None = None
    address: str | None = None
    phone: str | None = None
    email: str | None = None


class SchoolRead(BaseModel):
    id: int
    name: str
    code: str | None = None
