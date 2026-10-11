from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    description = Column(Text, nullable=True)

    school = relationship("School", back_populates="classes")
    students = relationship("Student", back_populates="class_")
    admissions = relationship("Admission", back_populates="class_")


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    description = Column(Text, nullable=True)

    school = relationship("School", back_populates="sections")
    students = relationship("Student", back_populates="section")
    admissions = relationship("Admission", back_populates="section")
