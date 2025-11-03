"""
One-off migration script to convert assets.id column to Postgres uuid type.

This script will:
 - connect to the database using the project's Settings (from app.config)
 - check that every id in the assets table is a valid UUID string
 - run the ALTER TABLE statement: ALTER TABLE assets ALTER COLUMN id TYPE uuid USING id::uuid;

Use cautiously. Backup your DB before running in production.
"""
import sys
import asyncio
import uuid
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings


async def main():
    DATABASE_URL = settings.database_url
    if not DATABASE_URL:
        print("DATABASE_URL not found in settings. Set it in .env or config.")
        return 2

    # Create a simple async engine
    engine = create_async_engine(DATABASE_URL, future=True)

    async with engine.begin() as conn:
        print("Checking existing asset ids are valid UUID strings...")
        # fetch ids
        res = await conn.execute(text("SELECT id FROM assets"))
        rows = res.all()
        invalid = []
        for (id_val,) in rows:
            try:
                uuid.UUID(str(id_val))
            except Exception:
                invalid.append(id_val)

        if invalid:
            print("Found invalid UUID-like strings in assets.id. Aborting.")
            for v in invalid[:20]:
                print("  ", v)
            print("Fix or remove invalid ids before running this migration.")
            return 3

        print("All ids appear to be valid UUID strings. Running ALTER TABLE...")
        # Run the alter statement
        try:
            await conn.execute(text("ALTER TABLE assets ALTER COLUMN id TYPE uuid USING id::uuid;"))
            print("ALTER TABLE completed successfully.")
        except Exception as e:
            print("ERROR running ALTER TABLE:", e)
            return 4

    await engine.dispose()
    return 0


if __name__ == "__main__":
    code = asyncio.run(main())
    sys.exit(code)
