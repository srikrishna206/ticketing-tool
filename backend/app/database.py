# from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, AsyncSession
# from sqlalchemy.orm import sessionmaker, declarative_base
# from .config import settings

# # Database URL from your settings
# DATABASE_URL = settings.database_url

# # Async engine
# engine: AsyncEngine = create_async_engine(
#     DATABASE_URL,
#     echo=False,
#     future=True,
# )

# # Async session factory
# async_session_maker = sessionmaker(
#     bind=engine,
#     expire_on_commit=False,
#     class_=AsyncSession,
# )

# # Base class for models
# Base = declarative_base()

# # Dependency helper for FastAPI endpoints
# async def get_session() -> AsyncSession:
#     async with async_session_maker() as session:
#         yield session
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# Database URL from your settings
DATABASE_URL = settings.database_url

# Async engine
engine: AsyncEngine = create_async_engine(
    DATABASE_URL,
    echo=True,  # This will show all SQL queries in console
    future=True,
)

# Async session factory
async_session_maker = sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

# Base class for models
Base = declarative_base()

# Dependency helper for FastAPI endpoints
async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()