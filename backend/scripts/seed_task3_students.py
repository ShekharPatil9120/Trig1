"""Development-only seed data for Task 3 Student Register testing.

Run from the backend directory:
    python scripts/seed_task3_students.py --allow-dev-seed
"""

from __future__ import annotations

import argparse
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path

from sqlalchemy import inspect, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.config import settings  # noqa: E402
from app.core.database import SessionLocal  # noqa: E402
from app.models.academic_year import AcademicYear  # noqa: E402
from app.models.admission import Admission  # noqa: E402
from app.models.class_section import Class, Section  # noqa: E402
from app.models.parent import Parent  # noqa: E402
from app.models.student import Student  # noqa: E402


@dataclass(frozen=True)
class SeedStudent:
    admission_number: str
    student_id: str
    name: str
    class_name: str
    section_name: str
    gender: str
    status: str
    date_of_birth: date
    parent_name: str
    parent_phone: str


ACADEMIC_YEAR = "2026-27"
ADMISSION_DATE = date(2026, 6, 1)

SEED_STUDENTS = [
    SeedStudent("ADM/2026/0001", "TEST-STU-2026-0001", "Aarav Sharma", "Class 8", "A", "Male", "active", date(2012, 5, 14), "Test Parent - Neha Sharma", "9000000001"),
    SeedStudent("ADM/2026/0002", "TEST-STU-2026-0002", "Ananya Patil", "Class 8", "B", "Female", "active", date(2012, 8, 22), "Test Parent - Suresh Patil", "9000000002"),
    SeedStudent("ADM/2026/0003", "TEST-STU-2026-0003", "Rahul Kumar", "Class 9", "A", "Male", "active", date(2011, 2, 9), "Test Parent - Kavita Kumar", "9000000003"),
    SeedStudent("ADM/2026/0004", "TEST-STU-2026-0004", "Sneha Rao", "Class 7", "A", "Female", "transferred", date(2013, 11, 3), "Test Parent - Arvind Rao", "9000000004"),
    SeedStudent("ADM/2026/0005", "TEST-STU-2026-0005", "Kiran Gowda", "Class 10", "B", "Male", "completed", date(2010, 7, 18), "Test Parent - Lakshmi Gowda", "9000000005"),
    SeedStudent("ADM/2026/0006", "TEST-STU-2026-0006", "Priya Nair", "Class 9", "B", "Female", "active", date(2011, 12, 27), "Test Parent - Manoj Nair", "9000000006"),
    SeedStudent("ADM/2026/0007", "TEST-STU-2026-0007", "Rohan Desai", "Class 8", "A", "Male", "left_school", date(2012, 1, 30), "Test Parent - Farah Desai", "9000000007"),
    SeedStudent("ADM/2026/0008", "TEST-STU-2026-0008", "Meera Kulkarni", "Class 10", "A", "Female", "archived", date(2010, 9, 6), "Test Parent - Vikram Kulkarni", "9000000008"),
]

REQUIRED_TABLES = {
    "academic_years",
    "admissions",
    "classes",
    "parents",
    "sections",
    "students",
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Seed eight fictional Task 3 student register records.")
    parser.add_argument("--allow-dev-seed", action="store_true", help="Required safety acknowledgement for local development seeding.")
    parser.add_argument("--verify-api", default="http://127.0.0.1:8000", help="Student Register API base URL to verify after seeding.")
    parser.add_argument("--skip-api-verify", action="store_true", help="Skip API verification.")
    args = parser.parse_args()

    try:
        assert_development_database(args.allow_dev_seed)
    except RuntimeError as exc:
        print(f"Refusing to seed: {exc}", file=sys.stderr)
        return 2

    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
            assert_required_tables(db)
            result = seed_students(db)
            db.commit()
    except SQLAlchemyError as exc:
        print("Seed failed: database is unavailable or rejected the seed operation.", file=sys.stderr)
        print(str(exc), file=sys.stderr)
        return 1
    except RuntimeError as exc:
        print(f"Seed failed: {exc}", file=sys.stderr)
        return 1

    print(f"Seed complete: {result['created']} created, {result['updated']} updated, {result['unchanged']} unchanged.")
    if not args.skip_api_verify:
        verify_api(args.verify_api)
    return 0


def assert_development_database(allow_dev_seed: bool) -> None:
    if not allow_dev_seed:
        raise RuntimeError("pass --allow-dev-seed to confirm this is a development database.")

    url = make_url(settings.DATABASE_URL)
    database_name = str(url.database or "").lower()
    host = str(url.host or "").lower()
    unsafe_terms = ("prod", "production", "live")
    local_hosts = {"localhost", "127.0.0.1", "::1", "db", "postgres"}

    if any(term in database_name or term in host for term in unsafe_terms):
        raise RuntimeError(f"database target looks production-like: host={host!r}, database={database_name!r}.")
    if host and host not in local_hosts:
        raise RuntimeError(f"database host {host!r} is not an approved local development host.")


def seed_students(db: Session) -> dict[str, int]:
    academic_year = get_or_create_academic_year(db)
    classes = {name: get_or_create_class(db, name) for name in sorted({student.class_name for student in SEED_STUDENTS})}
    sections = {name: get_or_create_section(db, name) for name in sorted({student.section_name for student in SEED_STUDENTS})}

    counts = {"created": 0, "updated": 0, "unchanged": 0}
    now = datetime.utcnow()

    for seed in SEED_STUDENTS:
        class_record = classes[seed.class_name]
        section_record = sections[seed.section_name]
        student = db.execute(select(Student).where(Student.admission_number == seed.admission_number)).scalar_one_or_none()
        created = False

        if student is None:
            student = db.execute(select(Student).where(Student.student_id == seed.student_id)).scalar_one_or_none()

        if student is None:
            student = Student(student_id=seed.student_id, created_at=now)
            db.add(student)
            created = True

        before = snapshot_student(student)
        student.student_id = seed.student_id
        student.admission_number = seed.admission_number
        student.name = seed.name
        student.date_of_birth = seed.date_of_birth
        student.gender = seed.gender
        student.class_id = class_record.id
        student.section_id = section_record.id
        student.status = seed.status
        student.updated_at = now
        db.flush()

        admission = db.execute(select(Admission).where(Admission.student_id == student.id)).scalar_one_or_none()
        if admission is None:
            admission = Admission(student_id=student.id, created_at=now)
            db.add(admission)
        admission.admission_number = seed.admission_number
        admission.registration_number = seed.admission_number
        admission.admission_date = ADMISSION_DATE
        admission.academic_year_id = academic_year.id
        admission.class_id = class_record.id
        admission.section_id = section_record.id
        admission.admission_type = "Development Test Seed"
        admission.updated_at = now

        parent = db.execute(select(Parent).where(Parent.student_id == student.id)).scalar_one_or_none()
        if parent is None:
            parent = Parent(student_id=student.id, created_at=now)
            db.add(parent)
        parent.guardian_name = seed.parent_name
        parent.phone = seed.parent_phone
        parent.address = "Development test data only"
        parent.occupation = "Test data"
        parent.updated_at = now

        after = snapshot_student(student)
        if created:
            counts["created"] += 1
        elif before == after:
            counts["unchanged"] += 1
        else:
            counts["updated"] += 1

    return counts


def assert_required_tables(db: Session) -> None:
    inspector = inspect(db.bind)
    existing_tables = set(inspector.get_table_names())
    missing_tables = sorted(REQUIRED_TABLES - existing_tables)
    if missing_tables:
        raise RuntimeError(
            "required database tables are missing: "
            + ", ".join(missing_tables)
            + ". Run Alembic migrations before seeding."
        )


def get_or_create_academic_year(db: Session) -> AcademicYear:
    academic_year = db.execute(select(AcademicYear).where(AcademicYear.name == ACADEMIC_YEAR)).scalar_one_or_none()
    if academic_year is None:
        academic_year = AcademicYear(name=ACADEMIC_YEAR, start_date=date(2026, 4, 1), end_date=date(2027, 3, 31), is_active=1, created_at=datetime.utcnow())
        db.add(academic_year)
        db.flush()
    return academic_year


def get_or_create_class(db: Session, name: str) -> Class:
    class_record = db.execute(select(Class).where(Class.name == name)).scalar_one_or_none()
    if class_record is None:
        class_record = Class(name=name, description="Development test data")
        db.add(class_record)
        db.flush()
    return class_record


def get_or_create_section(db: Session, name: str) -> Section:
    section = db.execute(select(Section).where(Section.name == name)).scalar_one_or_none()
    if section is None:
        section = Section(name=name, description="Development test data")
        db.add(section)
        db.flush()
    return section


def snapshot_student(student: Student) -> tuple[object, ...]:
    return (
        student.student_id,
        student.admission_number,
        student.name,
        student.date_of_birth,
        student.gender,
        student.class_id,
        student.section_id,
        student.status,
    )


def verify_api(base_url: str) -> None:
    params = urllib.parse.urlencode({"search": "ADM/2026", "page_size": "100"})
    url = f"{base_url.rstrip('/')}/api/v1/students?{params}"
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            body = response.read().decode("utf-8")
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"API verification skipped: Student Register API unavailable at {url}: {exc}")
        return

    print(f"API verification response from {url}:")
    print(body)


if __name__ == "__main__":
    raise SystemExit(main())
