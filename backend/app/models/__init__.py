"""SQLAlchemy models package.

Import model modules here so string-based SQLAlchemy relationships are
registered consistently across API handlers, scripts, migrations and tests.
"""

from app.models.academic_year import AcademicYear
from app.models.admission import Admission
from app.models.audit_log import AuditLog
from app.models.certificate import Certificate
from app.models.class_section import Class, Section
from app.models.document import StudentDocument
from app.models.parent import Parent
from app.models.role import Role
from app.models.school import School
from app.models.student import Student
from app.models.user import User

__all__ = [
    "AcademicYear",
    "Admission",
    "AuditLog",
    "Certificate",
    "Class",
    "Parent",
    "Role",
    "School",
    "Section",
    "Student",
    "StudentDocument",
    "User",
]
