import pytest
from sqlalchemy import text

from app.core.database import check_database_connection, engine


def test_database_connection() -> None:
    if not check_database_connection():
        pytest.skip("Configured database is unavailable.")

    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        assert result.scalar_one() == 1
