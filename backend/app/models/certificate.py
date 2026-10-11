from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    certificate_number = Column(String(100), unique=True, nullable=False)
    certificate_type = Column(String(100), nullable=False)
    issue_date = Column(Date, nullable=True)
    issued_by = Column(Integer, nullable=True)
    purpose = Column(String(255), nullable=True)
    pdf_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="certificates")
