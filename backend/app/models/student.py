from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), unique=True, nullable=False, index=True)
    admission_number = Column(String(100), unique=True, nullable=True, index=True)
    name = Column(String(255), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(50), nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)

    school = relationship("School", back_populates="students")
    class_ = relationship("Class", back_populates="students")
    section = relationship("Section", back_populates="students")
    admission = relationship("Admission", back_populates="student", uselist=False)
    parent = relationship("Parent", back_populates="student", uselist=False)
    documents = relationship("StudentDocument", back_populates="student")
    certificates = relationship("Certificate", back_populates="student")
