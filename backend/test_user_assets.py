import asyncio
import selectors
from app.database import engine
from sqlalchemy import text

async def test_user_assets():
    try:
        async with engine.connect() as conn:
            print("Testing user-specific asset filtering...")
            
            # First, check the table structure
            result = await conn.execute(text("PRAGMA table_info(assets)"))
            columns = result.fetchall()
            print("Assets table structure:")
            for col in columns:
                print(f"  {col[1]} ({col[2]})")
            
            # Get all assets grouped by email (try different column names)
            try:
                result = await conn.execute(text("SELECT email_id, COUNT(*) as count FROM assets GROUP BY email_id"))
                assets_by_email = result.fetchall()
                email_col = "email_id"
            except:
                try:
                    result = await conn.execute(text("SELECT email, COUNT(*) as count FROM assets GROUP BY email"))
                    assets_by_email = result.fetchall()
                    email_col = "email"
                except:
                    print("Could not find email column")
                    return False
            
            print(f"\nAssets by email (using column: {email_col}):")
            for row in assets_by_email:
                print(f"  {row[0]}: {row[1]} assets")
            
            # Test filtering for a specific user
            if assets_by_email:
                test_email = assets_by_email[0][0]
                print(f"\nTesting filter for user: {test_email}")
                result = await conn.execute(text(f"SELECT id, {email_col}, type, status FROM assets WHERE {email_col} = :email"), {"email": test_email})
                user_assets = result.fetchall()
                print(f"Found {len(user_assets)} assets for {test_email}:")
                for asset in user_assets:
                    print(f"  ID: {asset[0]}, Type: {asset[2]}, Status: {asset[3]}")
            
            return True
    except Exception as e:
        print(f"Test failed: {e}")
        return False

if __name__ == "__main__":
    loop = asyncio.SelectorEventLoop(selectors.SelectSelector())
    asyncio.set_event_loop(loop)
    asyncio.run(test_user_assets())
