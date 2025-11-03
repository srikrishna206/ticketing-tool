"""
Scan the database and print foreign key constraints that reference the `assets` table.

Usage:
  set PYTHONPATH=%CD% & python .\scripts\scan_assets_fks.py   (PowerShell: $env:PYTHONPATH=(Get-Location).Path; python ...)
"""
import asyncio
import asyncpg
from app.config import settings


async def main():
  dsn = settings.database_url
  # asyncpg expects a DSN like postgresql://; accept postgresql+asyncpg:// and normalize
  if dsn.startswith('postgresql+asyncpg://'):
    dsn = dsn.replace('postgresql+asyncpg://', 'postgresql://', 1)
    if not dsn:
        print("DATABASE_URL not configured in settings")
        return 2

    conn = await asyncpg.connect(dsn)
    try:
        sql = """
        SELECT
          tc.constraint_name,
          kcu.table_schema,
          kcu.table_name,
          kcu.column_name,
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'assets';
        """

        rows = await conn.fetch(sql)
        if not rows:
            print('No foreign keys reference the assets table.')
            return 0

        print('Foreign keys referencing assets:')
        for r in rows:
            print(f"- constraint={r['constraint_name']}, table={r['table_schema']}.{r['table_name']}, column={r['column_name']}")
        return 0
    finally:
        await conn.close()


if __name__ == '__main__':
    code = asyncio.run(main())
    raise SystemExit(code)
