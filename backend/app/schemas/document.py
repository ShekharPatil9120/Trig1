from pydantic import BaseModel


class StudentDocumentCreate(BaseModel):
    student_id: int
    document_type: str
    file_path: str
    uploaded_by: int | None = None


class StudentDocumentRead(StudentDocumentCreate):
    id: int
