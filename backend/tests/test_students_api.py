from datetime import date
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app
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


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, expire_on_commit=False, class_=Session)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


def seed_students(db: Session) -> None:
    academic_year = AcademicYear(id=1, name="2026-27")
    class_one = Class(id=1, name="Class 1")
    class_two = Class(id=2, name="Class 2")
    section_a = Section(id=1, name="A")
    section_b = Section(id=2, name="B")
    first = Student(
        id=1,
        student_id="STU-001",
        admission_number="ADM-001",
        name="Ananya Rao",
        date_of_birth=date(2018, 4, 12),
        gender="Female",
        class_id=1,
        section_id=1,
        status="active",
    )
    second = Student(
        id=2,
        student_id="STU-002",
        admission_number="ADM-002",
        name="Kabir Nair",
        date_of_birth=date(2017, 3, 2),
        gender="Male",
        class_id=2,
        section_id=2,
        status="transferred",
    )
    third = Student(id=3, student_id="STU-003", name="No Parent", status="archived")
    db.add_all([academic_year, class_one, class_two, section_a, section_b, first, second, third])
    db.flush()
    db.add_all(
        [
            Parent(student_id=1, guardian_name="Meera Rao", phone="9876543210"),
            Parent(student_id=2, father_name="Dev Nair", phone="9876500000"),
            Admission(student_id=1, admission_number="ADM-001", admission_date=date(2026, 10, 11), academic_year_id=1, class_id=1, section_id=1),
            Admission(student_id=2, admission_number="ADM-002", admission_date=date(2026, 10, 12), academic_year_id=1, class_id=2, section_id=2),
        ]
    )
    db.commit()


def test_empty_student_database(client: TestClient) -> None:
    response = client.get("/api/v1/students")

    assert response.status_code == 200
    assert response.json()["items"] == []
    assert response.json()["total"] == 0


def test_listing_search_filter_and_missing_optional_relationships(client: TestClient, db_session: Session) -> None:
    seed_students(db_session)

    response = client.get("/api/v1/students")
    payload = response.json()

    assert response.status_code == 200
    assert payload["total"] == 3
    assert payload["items"][0]["parent_guardian_name"] == "Meera Rao"

    search_by_name = client.get("/api/v1/students", params={"search": "kabir"}).json()
    assert search_by_name["total"] == 1
    assert search_by_name["items"][0]["admission_number"] == "ADM-002"

    search_by_parent_phone = client.get("/api/v1/students", params={"search": "9876543210"}).json()
    assert search_by_parent_phone["total"] == 1
    assert search_by_parent_phone["items"][0]["name"] == "Ananya Rao"

    filtered = client.get(
        "/api/v1/students",
        params={"class_id": 2, "section_id": 2, "academic_year_id": 1, "gender": "male", "status": "transferred"},
    ).json()
    assert filtered["total"] == 1
    assert filtered["items"][0]["name"] == "Kabir Nair"

    no_parent = client.get("/api/v1/students", params={"search": "No Parent"}).json()
    assert no_parent["items"][0]["parent_guardian_name"] is None


def test_pagination_and_invalid_date_range(client: TestClient, db_session: Session) -> None:
    seed_students(db_session)

    response = client.get("/api/v1/students", params={"page": 2, "page_size": 2})
    payload = response.json()

    assert response.status_code == 200
    assert payload["page"] == 2
    assert payload["total_pages"] == 2
    assert len(payload["items"]) == 1

    invalid = client.get(
        "/api/v1/students",
        params={"admission_date_from": "2026-10-12", "admission_date_to": "2026-10-11"},
    )
    assert invalid.status_code == 422


def test_recent_admission_sort_uses_real_admission_dates(client: TestClient, db_session: Session) -> None:
    seed_students(db_session)

    response = client.get("/api/v1/students", params={"sort_by": "recent_admission", "page_size": 3})
    payload = response.json()

    assert response.status_code == 200
    assert [item["name"] for item in payload["items"]] == ["Kabir Nair", "Ananya Rao", "No Parent"]

    invalid = client.get("/api/v1/students", params={"sort_by": "demo"})
    assert invalid.status_code == 422


def test_admission_registration_persists_and_is_searchable(client: TestClient, db_session: Session) -> None:
    payload = {
        "admission_date": "2026-10-11",
        "academic_year": "2026-27",
        "class_admitted": "Class 6",
        "section": "C",
        "admission_type": "New Admission",
        "student_name": "Test Student Search 2026 XYZ01",
        "date_of_birth": "2015-05-20",
        "gender": "Female",
        "guardian_name": "Test Guardian XYZ01",
        "parent_phone": "9000000099",
        "parent_address": "Development test address",
    }

    create_response = client.post("/api/v1/admissions", json=payload)

    assert create_response.status_code == 201
    created = create_response.json()
    assert created["student_name"] == "Test Student Search 2026 XYZ01"
    assert created["admission_number"].startswith("ADM/2026/")

    student = db_session.execute(select(Student).where(Student.name == "Test Student Search 2026 XYZ01")).scalar_one_or_none()
    assert student is not None
    assert student.student_id == created["student_code"]
    assert student.admission_number == created["admission_number"]

    admission = db_session.execute(select(Admission).where(Admission.student_id == student.id)).scalar_one_or_none()
    assert admission is not None
    assert admission.admission_number == created["admission_number"]
    assert admission.academic_year is not None
    assert admission.academic_year.name == "2026-27"
    assert admission.class_ is not None
    assert admission.class_.name == "Class 6"
    assert admission.section is not None
    assert admission.section.name == "C"

    parent = db_session.execute(select(Parent).where(Parent.student_id == student.id)).scalar_one_or_none()
    assert parent is not None
    assert parent.guardian_name == "Test Guardian XYZ01"
    assert parent.phone == "9000000099"

    all_students = client.get("/api/v1/students", params={"page_size": 100})
    assert all_students.status_code == 200
    assert any(item["name"] == "Test Student Search 2026 XYZ01" for item in all_students.json()["items"])

    full_name_search = client.get("/api/v1/students", params={"search": "Test Student Search 2026 XYZ01", "page_size": 100})
    assert full_name_search.status_code == 200
    assert full_name_search.json()["total"] == 1

    partial_case_search = client.get("/api/v1/students", params={"search": "student search 2026", "page_size": 100})
    assert partial_case_search.status_code == 200
    assert partial_case_search.json()["total"] == 1

    unrelated_filter = client.get("/api/v1/students", params={"search": "Test Student Search 2026 XYZ01", "class_id": 999, "page_size": 100})
    assert unrelated_filter.status_code == 200
    assert unrelated_filter.json()["total"] == 0
