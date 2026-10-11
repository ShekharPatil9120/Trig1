from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Admission(Base):
    __tablename__ = "admissions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, unique=True)
    admission_number = Column(String(100), nullable=True)
    registration_number = Column(String(100), nullable=True)
    admission_date = Column(Date, nullable=True)
    academic_year_id = Column(Integer, ForeignKey("academic_years.id"), nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    admission_type = Column(String(100), nullable=True)
    previous_school = Column(String(255), nullable=True)
    previous_class = Column(String(100), nullable=True)
    previous_admission_number = Column(String(100), nullable=True)
    previous_tc_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="admission")
    academic_year = relationship("AcademicYear", back_populates="admissions")
    class_ = relationship("Class", back_populates="admissions")
    section = relationship("Section", back_populates="admissions")
