from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class StudentDocument(Base):
    __tablename__ = "student_documents"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    document_type = Column(String(100), nullable=False)
    file_path = Column(String(255), nullable=False)
    uploaded_by = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="documents")
