from fastapi import APIRouter

from app.api.v1.person1 import auth as person1_auth
from app.api.v1.person1 import admissions as person1_admissions
from app.api.v1.person1 import dashboard as person1_dashboard
from app.api.v1.person1 import roles as person1_roles
from app.api.v1.person1 import school as person1_school
from app.api.v1.person1 import student_profile as person1_student_profile
from app.api.v1.person1 import students as person1_students
from app.api.v1.person1 import users as person1_users
from app.api.v1.person2 import certificates as person2_certificates
from app.api.v1.person2 import certificate_numbering as person2_certificate_numbering
from app.api.v1.person2 import documents as person2_documents
from app.api.v1.person2 import pdf_generation as person2_pdf_generation
from app.api.v1.person2 import pdf_preview as person2_pdf_preview
from app.api.v1.person2 import printing as person2_printing

api_router = APIRouter(prefix="/api")

api_router.include_router(person1_auth.router, prefix="/v1")
api_router.include_router(person1_admissions.router, prefix="/v1")
api_router.include_router(person1_dashboard.router, prefix="/v1")
api_router.include_router(person1_roles.router, prefix="/v1")
api_router.include_router(person1_school.router, prefix="/v1")
api_router.include_router(person1_student_profile.router, prefix="/v1")
api_router.include_router(person1_students.router, prefix="/v1")
api_router.include_router(person1_users.router, prefix="/v1")

api_router.include_router(person2_certificates.router, prefix="/v1")
api_router.include_router(person2_certificate_numbering.router, prefix="/v1")
api_router.include_router(person2_documents.router, prefix="/v1")
api_router.include_router(person2_pdf_generation.router, prefix="/v1")
api_router.include_router(person2_pdf_preview.router, prefix="/v1")
api_router.include_router(person2_printing.router, prefix="/v1")
