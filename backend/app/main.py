# from fastapi import FastAPI, Depends, HTTPException, status
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List, Optional

# from . import models, schemas, crud, database, config

# app = FastAPI(title="Flow Track API")

# # CORS
# def _normalize_allowed_origins(origins):
#     """Ensure allowed_origins is a list of origin strings.

#     Accepts either a list (already correct) or a single comma-separated
#     string (from environment) and returns a list.
#     """
#     if origins is None:
#         return []
#     # If already a list/tuple, return as list
#     if isinstance(origins, (list, tuple)):
#         return list(origins)
#     # If it's a string, split on commas and strip whitespace
#     if isinstance(origins, str):
#         return [o.strip() for o in origins.split(",") if o.strip()]
#     # Fallback: coerce to string and return single-item list
#     return [str(origins)]

# allowed_origins = _normalize_allowed_origins(config.settings.allowed_origins)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=allowed_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # create tables automatically for quick dev (optional)
# @app.on_event("startup")
# async def startup():
#     # Create tables (for dev). In production use alembic migrations.
#     async with database.engine.begin() as conn:
#         await conn.run_sync(models.Base.metadata.create_all)

# # Dependency
# async def get_session() -> AsyncSession:
#     async for s in database.get_session():
#         yield s

# # Routes
# @app.get("/assets", response_model=List[schemas.AssetOut])
# async def read_assets(status: Optional[schemas.StatusEnum] = None, session: AsyncSession = Depends(get_session)):
#     rows = await crud.list_assets(session, status.value if status else None)
#     return rows

# @app.post("/assets", response_model=schemas.AssetOut, status_code=status.HTTP_201_CREATED)
# async def create_asset(asset_in: schemas.AssetCreate, session: AsyncSession = Depends(get_session)):
#     created = await crud.create_asset(session, asset_in)
#     return created

# @app.get("/assets/{asset_id}", response_model=schemas.AssetOut)
# async def get_asset(asset_id: str, session: AsyncSession = Depends(get_session)):
#     obj = await crud.get_asset(session, asset_id)
#     if not obj:
#         raise HTTPException(status_code=404, detail="Asset not found")
#     return obj

# @app.put("/assets/{asset_id}", response_model=schemas.AssetOut)
# async def update_asset(asset_id: str, asset_in: schemas.AssetUpdate, session: AsyncSession = Depends(get_session)):
#     updated = await crud.update_asset(session, asset_id, asset_in)
#     if not updated:
#         raise HTTPException(status_code=404, detail="Asset not found")
#     return updated

# @app.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_asset(asset_id: str, session: AsyncSession = Depends(get_session)):
#     ok = await crud.delete_asset(session, asset_id)
#     if not ok:
#         raise HTTPException(status_code=404, detail="Asset not found")
#     return None

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import logging

from . import models, schemas, crud, database

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Flow Track API")

# CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add validation error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error on {request.method} {request.url.path}")
    logger.error(f"Validation errors: {exc.errors()}")
    logger.error(f"Request body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

# Create tables on startup
@app.on_event("startup")
async def startup():
    try:
        async with database.engine.begin() as conn:
            await conn.run_sync(models.Base.metadata.create_all)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Error creating tables: {e}")

# Unified DB session dependency
async def get_db() -> AsyncSession:
    async with database.async_session_maker() as session:
        yield session

# --- Routes ---

@app.get("/")
async def root():
    return {"message": "Flow Track API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Flow Track API"}

# --- Asset Routes ---
@app.get("/assets", response_model=List[schemas.AssetOut])
async def read_assets(status: Optional[str] = None, user_email: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    try:
        logger.info(f"Fetching assets with status: {status}, user_email: {user_email}")
        rows = await crud.list_assets(db, status, user_email)
        logger.info(f"Found {len(rows)} assets")
        return rows
    except Exception as e:
        logger.error(f"Error fetching assets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assets", response_model=schemas.AssetOut, status_code=status.HTTP_201_CREATED)
async def create_asset(asset_in: schemas.AssetCreate, db: AsyncSession = Depends(get_db)):
    try:
        logger.info(f"Creating asset: {asset_in.dict()}")
        created = await crud.create_asset(db, asset_in)
        logger.info(f"Asset created successfully: {created.id}")
        
        # Also create an admin_asset entry for admin portal viewing
        try:
            admin_asset_data = schemas.AdminAssetCreate(
                id=created.id,
                email=created.email,
                type=created.type,
                location=created.location,
                description=created.description,
                status=created.status,
                open_date=created.open_date,
                close_date=created.close_date,
                actions=None
            )
            await crud.create_admin_asset(db, admin_asset_data)
            logger.info(f"Admin asset created successfully for asset ID: {created.id}")
        except Exception as admin_error:
            logger.error(f"Failed to create admin_asset for asset ID {created.id}: {admin_error}")
            # Continue anyway - the main asset was created successfully
        
        return created
    except Exception as e:
        logger.error(f"Error creating asset: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/assets/{asset_id}", response_model=schemas.AssetOut)
async def get_asset(asset_id: int, db: AsyncSession = Depends(get_db)):
    obj = await crud.get_asset(db, asset_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Asset not found")
    return obj

@app.put("/assets/{asset_id}", response_model=schemas.AssetOut)
async def update_asset(asset_id: int, asset_in: schemas.AssetUpdate, db: AsyncSession = Depends(get_db)):
    updated = await crud.update_asset(db, asset_id, asset_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Asset not found")
    return updated

@app.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(asset_id: int, db: AsyncSession = Depends(get_db)):
    ok = await crud.delete_asset(db, asset_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Asset not found")
    return None

# --- User Authentication ---
@app.post("/auth/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        logger.info(f"Registering user: {user_in.email}")
        existing_user = await crud.get_user_by_email(db, user_in.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        created_user = await crud.create_user(db, user_in)
        return schemas.UserOut(id=created_user.id, email=created_user.email, full_name=created_user.full_name)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login", response_model=schemas.UserOut)
async def login_user(credentials: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    import bcrypt
    try:
        user = await crud.get_user_by_email(db, credentials.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        password_bytes = credentials.password.encode("utf-8")[:72]  # bcrypt limit
        if not bcrypt.checkpw(password_bytes, user.hashed_password.encode("utf-8")):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        return schemas.UserOut(id=user.id, email=user.email, full_name=user.full_name)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- User CRUD ---
@app.get("/users/", response_model=List[schemas.UserProfileResponse])
async def read_users(db: AsyncSession = Depends(get_db)):
    return await crud.get_users(db)

@app.get("/users/{user_id}", response_model=schemas.UserProfileResponse)
async def read_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/", response_model=schemas.UserProfileResponse)
async def create_user(user: schemas.UserProfileCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_user_profile(db, user)

@app.put("/users/{user_id}", response_model=schemas.UserProfileResponse)
async def update_user(user_id: int, user: schemas.UserProfileUpdate, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return await crud.update_user(db, user_id, user)

@app.delete("/users/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return await crud.delete_user(db, user_id)

@app.get("/users-by-email/{email}")
async def get_user_by_email(email: str, db: AsyncSession = Depends(get_db)):
    """Get a user by email address"""
    try:
        user = await crud.get_user_by_email(db, email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user by email: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/users-simple", response_model=schemas.UserOut)
async def create_simple_user(user_data: dict, db: AsyncSession = Depends(get_db)):
    """Create a simple user entry (for ticket foreign key requirement)"""
    try:
        email = user_data.get('email', 'unknown@example.com')
        name = user_data.get('name', 'Unknown User')
        
        # Check if user already exists
        existing_user = await crud.get_user_by_email(db, email)
        if existing_user:
            logger.info(f"User already exists: {email}")
            return existing_user
        
        # Create new user in users table
        new_user = schemas.UserCreate(
            email=email,
            password="",  # No password for simple users created for tickets
            full_name=name
        )
        created_user = await crud.create_user(db, new_user)
        logger.info(f"Created simple user: {created_user.email}")
        return created_user
    except Exception as e:
        logger.error(f"Error creating simple user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Admin Registration and Login Routes ---
@app.post("/admin/register", response_model=schemas.AdminOut, status_code=status.HTTP_201_CREATED)
async def register_admin(admin_in: schemas.AdminCreate, db: AsyncSession = Depends(get_db)):
    """Register a new admin"""
    try:
        logger.info(f"Registering admin: {admin_in.email}")
        # Check if admin already exists
        existing_admin = await crud.get_admin_by_email(db, admin_in.email)
        if existing_admin:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new admin
        created_admin = await crud.create_admin(db, admin_in)
        logger.info(f"Admin registered successfully: {created_admin.email}")
        return created_admin
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering admin: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/login", response_model=schemas.AdminOut)
async def login_admin(credentials: schemas.AdminLogin, db: AsyncSession = Depends(get_db)):
    """Admin login"""
    import bcrypt
    try:
        logger.info(f"Admin login attempt: {credentials.email}")
        admin = await crud.get_admin_by_email(db, credentials.email)
        if not admin:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        password_bytes = credentials.password.encode("utf-8")[:72]  # bcrypt limit
        if not bcrypt.checkpw(password_bytes, admin.hashed_password.encode("utf-8")):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        logger.info(f"Admin login successful: {admin.email}")
        return admin
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during admin login: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Admin Asset Routes ---
@app.get("/admin/assets", response_model=List[schemas.AdminAssetOut])
async def read_admin_assets(db: AsyncSession = Depends(get_db)):
    """Get all admin assets"""
    try:
        logger.info("Fetching admin assets")
        admin_assets = await crud.list_admin_assets(db)
        logger.info(f"Found {len(admin_assets)} admin assets")
        return admin_assets
    except Exception as e:
        logger.error(f"Error fetching admin assets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/assets/{admin_asset_id}", response_model=schemas.AdminAssetOut)
async def get_admin_asset(admin_asset_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific admin asset"""
    admin_asset = await crud.get_admin_asset(db, admin_asset_id)
    if not admin_asset:
        raise HTTPException(status_code=404, detail="Admin asset not found")
    return admin_asset

@app.put("/admin/assets/{admin_asset_id}", response_model=schemas.AdminAssetOut)
async def update_admin_asset(admin_asset_id: int, admin_asset_in: schemas.AdminAssetUpdate, db: AsyncSession = Depends(get_db)):
    """Update an admin asset"""
    try:
        logger.info(f"Updating admin asset ID: {admin_asset_id}")
        updated = await crud.update_admin_asset(db, admin_asset_id, admin_asset_in)
        if not updated:
            raise HTTPException(status_code=404, detail="Admin asset not found")
        
        # Also update the original asset if needed
        if updated.id:
            asset_update_data = schemas.AssetUpdate(
                email=admin_asset_in.email,
                type=admin_asset_in.type,
                location=admin_asset_in.location,
                description=admin_asset_in.description,
                status=admin_asset_in.status
            )
            await crud.update_asset(db, updated.id, asset_update_data)
            logger.info(f"Updated original asset ID: {updated.id}")
        
        return updated
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating admin asset: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/assets/{admin_asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_admin_asset(admin_asset_id: int, db: AsyncSession = Depends(get_db)):
    """Delete an admin asset"""
    success = await crud.delete_admin_asset(db, admin_asset_id)
    if not success:
        raise HTTPException(status_code=404, detail="Admin asset not found")
    return None

# --- Ticket Routes ---
@app.get("/tickets", response_model=List[schemas.TicketOut])
async def read_tickets(user_id: Optional[int] = None, status: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """Get tickets with optional filters"""
    try:
        logger.info(f"Fetching tickets with user_id: {user_id}, status: {status}")
        tickets = await crud.list_tickets(db, user_id, status)
        logger.info(f"Found {len(tickets)} tickets")
        return tickets
    except Exception as e:
        logger.error(f"Error fetching tickets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tickets", response_model=schemas.TicketOut, status_code=status.HTTP_201_CREATED)
async def create_ticket(ticket_in: schemas.TicketCreate, epic_id: Optional[int] = None, project_id: Optional[int] = None, user_name: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """Create a new ticket"""
    try:
        logger.info(f"Creating ticket: {ticket_in.dict()}")
        created_ticket = await crud.create_ticket(db, ticket_in)
        logger.info(f"Ticket created successfully: {created_ticket.id}")
        
        # Also create an admin_ticket entry for admin portal visibility
        try:
            # Get project details if project_id is provided
            project_title = None
            if project_id:
                project = await crud.get_project(db, project_id)
                if project:
                    project_title = project.name
            
            admin_ticket_data = schemas.AdminTicketCreate(
                ticket_id=created_ticket.id,
                epic_id=epic_id,
                project_id=project_id,
                project_title=project_title,
                user_name=user_name,
                title=created_ticket.title,
                description=created_ticket.description,
                status=created_ticket.status,
                priority=created_ticket.priority,
                assignee=created_ticket.assignee,
                reporter=created_ticket.reporter,  # ✅ Include reporter field
                start_date=created_ticket.start_date,
                due_date=created_ticket.due_date
            )
            await crud.create_admin_ticket(db, admin_ticket_data)
            logger.info(f"Admin ticket created successfully for ticket_id: {created_ticket.id}")
        except Exception as admin_err:
            logger.error(f"Failed to create admin ticket (non-critical): {admin_err}")
        
        return created_ticket
    except Exception as e:
        logger.error(f"Error creating ticket: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tickets/{ticket_id}", response_model=schemas.TicketOut)
async def get_ticket(ticket_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific ticket"""
    ticket = await crud.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@app.put("/tickets/{ticket_id}", response_model=schemas.TicketOut)
async def update_ticket(ticket_id: int, ticket_in: schemas.TicketUpdate, db: AsyncSession = Depends(get_db)):
    """Update a ticket"""
    updated_ticket = await crud.update_ticket(db, ticket_id, ticket_in)
    if not updated_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Also update the corresponding admin_ticket if it exists
    try:
        admin_ticket = await crud.get_admin_ticket_by_ticket_id(db, ticket_id)
        if admin_ticket:
            admin_ticket_update = schemas.AdminTicketUpdate(
                title=ticket_in.title,
                description=ticket_in.description,
                status=ticket_in.status,
                priority=ticket_in.priority,
                assignee=ticket_in.assignee,
                reporter=ticket_in.reporter,  # ✅ Include reporter field
                start_date=ticket_in.start_date,
                due_date=ticket_in.due_date
            )
            await crud.update_admin_ticket(db, admin_ticket.admin_ticket_id, admin_ticket_update)
            logger.info(f"Updated admin_ticket for ticket_id: {ticket_id}")
    except Exception as admin_err:
        logger.error(f"Failed to update admin ticket (non-critical): {admin_err}")
    
    return updated_ticket

@app.delete("/tickets/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ticket(ticket_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a ticket and its corresponding admin ticket"""
    try:
        # Delete from tickets table
        success = await crud.delete_ticket(db, ticket_id)
        if not success:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        # Also delete the corresponding admin_ticket for bidirectional sync
        try:
            admin_ticket = await crud.get_admin_ticket_by_ticket_id(db, ticket_id)
            if admin_ticket:
                await crud.delete_admin_ticket(db, admin_ticket.admin_ticket_id)
                logger.info(f"Deleted admin_ticket for ticket_id: {ticket_id}")
        except Exception as admin_err:
            logger.error(f"Failed to delete admin ticket (non-critical): {admin_err}")
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting ticket: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Project Routes ---
@app.get("/projects", response_model=List[schemas.ProjectOut])
async def read_projects(user_email: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """Get all projects, optionally filtered by user_email (leads or team_members)"""
    try:
        logger.info(f"Fetching projects for user_email: {user_email}")
        projects = await crud.list_projects(db, user_email)
        logger.info(f"Found {len(projects)} projects")
        return projects
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/projects", response_model=schemas.ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(project_in: schemas.ProjectCreate, db: AsyncSession = Depends(get_db)):
    """Create a new project"""
    try:
        logger.info(f"Creating project: {project_in.name}")
        created_project = await crud.create_project(db, project_in)
        logger.info(f"Project created successfully: {created_project.id}")
        return created_project
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/projects/{project_id}", response_model=schemas.ProjectOut)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific project"""
    project = await crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.put("/projects/{project_id}", response_model=schemas.ProjectOut)
async def update_project(project_id: int, project_in: schemas.ProjectUpdate, db: AsyncSession = Depends(get_db)):
    """Update a project"""
    updated_project = await crud.update_project(db, project_id, project_in)
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_project

@app.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a project"""
    success = await crud.delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return None

# --- Epic Routes ---
@app.get("/epics", response_model=List[schemas.EpicOut])
async def read_epics(project_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    """Get all epics, optionally filtered by project"""
    try:
        logger.info(f"Fetching epics for project_id: {project_id}")
        epics = await crud.list_epics(db, project_id)
        logger.info(f"Found {len(epics)} epics")
        return epics
    except Exception as e:
        logger.error(f"Error fetching epics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/epics", response_model=schemas.EpicOut, status_code=status.HTTP_201_CREATED)
async def create_epic(epic_in: schemas.EpicCreate, user_name: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """Create a new epic"""
    try:
        logger.info(f"Creating epic: {epic_in.name}")
        created_epic = await crud.create_epic(db, epic_in)
        logger.info(f"Epic created successfully: {created_epic.id}")
        
        # Also create an admin_epic entry for admin portal visibility
        try:
            # Get project details if project_id is provided
            project_title = None
            if created_epic.project_id:
                project = await crud.get_project(db, created_epic.project_id)
                if project:
                    project_title = project.name
            
            admin_epic_data = schemas.AdminEpicCreate(
                epic_id=created_epic.id,
                project_id=created_epic.project_id,
                project_title=project_title,
                user_name=user_name,
                name=created_epic.name
            )
            await crud.create_admin_epic(db, admin_epic_data)
            logger.info(f"Admin epic created successfully for epic_id: {created_epic.id}")
        except Exception as admin_err:
            logger.error(f"Failed to create admin epic (non-critical): {admin_err}")
        
        return created_epic
    except Exception as e:
        logger.error(f"Error creating epic: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/epics/{epic_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_epic(epic_id: int, db: AsyncSession = Depends(get_db)):
    """Delete an epic and its corresponding admin epic (bidirectional sync)"""
    try:
        # Delete from epics table
        success = await crud.delete_epic(db, epic_id)
        if not success:
            raise HTTPException(status_code=404, detail="Epic not found")
        
        # Also delete the corresponding admin_epic for bidirectional sync
        try:
            admin_epic = await crud.get_admin_epic_by_epic_id(db, epic_id)
            if admin_epic:
                await crud.delete_admin_epic(db, admin_epic.admin_epic_id)
                logger.info(f"Deleted admin_epic for epic_id: {epic_id}")
        except Exception as admin_err:
            logger.error(f"Failed to delete admin epic (non-critical): {admin_err}")
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting epic: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- UsersManagement Routes (User Frontend Profile Data) ---
@app.get("/users-management", response_model=List[schemas.UsersManagementOut])
async def read_users_management(db: AsyncSession = Depends(get_db)):
    """Get all users from users_management table"""
    try:
        logger.info("Fetching users from users_management")
        users = await crud.list_users_management(db)
        logger.info(f"Found {len(users)} users")
        return users
    except Exception as e:
        logger.error(f"Error fetching users_management: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users-management/email/{email}", response_model=schemas.UsersManagementOut)
async def get_users_management_by_email(email: str, db: AsyncSession = Depends(get_db)):
    """Get a user from users_management by email"""
    user = await crud.get_users_management_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users-management", response_model=schemas.UsersManagementOut, status_code=status.HTTP_201_CREATED)
async def create_users_management(user_in: schemas.UsersManagementCreate, db: AsyncSession = Depends(get_db)):
    """Create a new user in users_management table - Auto-syncs to user_profile"""
    try:
        logger.info(f"Creating user in users_management: {user_in.email}")
        # Check if user already exists
        existing_user = await crud.get_users_management_by_email(db, user_in.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        created_user = await crud.create_users_management(db, user_in)
        logger.info(f"User created successfully in users_management: {created_user.id}")
        
        # Auto-sync to user_profile table for consistency
        try:
            profile_data = schemas.UserProfileCreate(
                full_name=f"{user_in.first_name} {user_in.last_name}".strip(),
                email=user_in.email,
                role=user_in.role,
                department=user_in.department,
                mobile_number=user_in.mobile_number,
                date_of_birth=None,
                user_status="Active" if user_in.active else "Inactive"
            )
            await crud.create_user_profile(db, profile_data)
            logger.info(f"Successfully synced to user_profile table")
        except Exception as sync_error:
            logger.warning(f"Failed to sync to user_profile (non-critical): {sync_error}")
            # Continue - the main user was created successfully
        
        return created_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user in users_management: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/users-management/{user_id}", response_model=schemas.UsersManagementOut)
async def update_users_management(user_id: int, user_in: schemas.UsersManagementUpdate, db: AsyncSession = Depends(get_db)):
    """Update a user in users_management table - Auto-syncs to user_profile"""
    updated_user = await crud.update_users_management(db, user_id, user_in)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Auto-sync to user_profile table (bidirectional sync)
    try:
        user_profile = await crud.get_user_profile_by_email(db, updated_user.email)
        if user_profile:
            # Update user_profile with the data from users_management
            profile_update = schemas.UserProfileUpdate(
                full_name=f"{updated_user.first_name} {updated_user.last_name}".strip(),
                role=updated_user.role,
                department=updated_user.department,
                mobile_number=updated_user.mobile_number,
                user_status="Active" if updated_user.active else "Inactive"
            )
            await crud.update_user_profile(db, user_profile.user_id, profile_update)
            logger.info(f"Successfully synced update to user_profile table")
    except Exception as sync_error:
        logger.warning(f"Failed to sync to user_profile (non-critical): {sync_error}")
    
    return updated_user

@app.delete("/users-management/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_users_management(user_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a user from ALL tables: users_management, user_profile, AND users (complete sync)"""
    try:
        # Get the user first to find their email
        user = await crud.get_users_management_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_email = user.email
        
        # 1. Delete from users_management table
        success = await crud.delete_users_management(db, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"✓ Deleted from users_management: {user_email}")
        
        # 2. Delete from user_profile table
        try:
            user_profile = await crud.get_user_profile_by_email(db, user_email)
            if user_profile:
                await crud.delete_user_profile(db, user_profile.user_id)
                logger.info(f"✓ Deleted from user_profile table")
        except Exception as sync_error:
            logger.warning(f"Failed to delete from user_profile: {sync_error}")
        
        # 3. Delete from users table (authentication)
        try:
            auth_user = await crud.get_user_by_email(db, user_email)
            if auth_user:
                await db.delete(auth_user)
                await db.commit()
                logger.info(f"✓ Deleted from users table (authentication)")
        except Exception as sync_error:
            logger.warning(f"Failed to delete from users table: {sync_error}")
        
        logger.info(f"🎉 User completely deleted from all tables: {user_email}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- UserProfile Routes (Admin Portal Profile Data) ---
@app.get("/user-profiles", response_model=List[schemas.UserProfileOut])
async def read_user_profiles(db: AsyncSession = Depends(get_db)):
    """Get all user profiles"""
    try:
        logger.info("Fetching user profiles")
        profiles = await crud.list_user_profiles(db)
        logger.info(f"Found {len(profiles)} user profiles")
        return profiles
    except Exception as e:
        logger.error(f"Error fetching user profiles: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user-profiles/email/{email}", response_model=schemas.UserProfileOut)
async def get_user_profile_by_email(email: str, db: AsyncSession = Depends(get_db)):
    """Get a user profile by email"""
    profile = await crud.get_user_profile_by_email(db, email)
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    return profile

@app.post("/user-profiles", response_model=schemas.UserProfileOut, status_code=status.HTTP_201_CREATED)
async def create_user_profile(profile_in: schemas.UserProfileCreate, db: AsyncSession = Depends(get_db)):
    """Create a new user profile (from user frontend) - Auto-syncs to users_management"""
    try:
        logger.info(f"Creating user profile: {profile_in.email}")
        logger.info(f"Profile data: full_name={profile_in.full_name}, role={profile_in.role}, department={profile_in.department}")
        
        # Check if profile already exists in user_profile
        existing_profile = await crud.get_user_profile_by_email(db, profile_in.email)
        if existing_profile:
            raise HTTPException(status_code=400, detail="User profile with this email already exists")
        
        # Create in user_profile table
        created_profile = await crud.create_user_profile(db, profile_in)
        logger.info(f"User profile created successfully: {created_profile.user_id}")
        
        # Auto-sync to users_management table for admin portal visibility
        try:
            # Split full_name into first_name and last_name
            name_parts = profile_in.full_name.strip().split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ""
            
            users_mgmt_data = schemas.UsersManagementCreate(
                first_name=first_name,
                last_name=last_name,
                email=profile_in.email,
                role=profile_in.role,
                department=profile_in.department,
                active=(profile_in.user_status == "Active"),
                language="English",
                mobile_number=profile_in.mobile_number,
                date_format="YYYY-MM-DD",
                password_reset_needed=False,
                profile_file_name=None,
                profile_file_size=None
            )
            await crud.create_users_management(db, users_mgmt_data)
            logger.info(f"Successfully synced to users_management table")
        except Exception as sync_error:
            logger.warning(f"Failed to sync to users_management (non-critical): {sync_error}")
            # Continue - the main profile was created successfully
        
        return created_profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user profile: {e}")
        logger.error(f"Exception type: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/user-profiles/{user_id}", response_model=schemas.UserProfileOut)
async def update_user_profile(user_id: int, profile_in: schemas.UserProfileUpdate, db: AsyncSession = Depends(get_db)):
    """Update a user profile (admin edits)"""
    try:
        logger.info(f"Updating user profile: {user_id}")
        updated_profile = await crud.update_user_profile(db, user_id, profile_in)
        if not updated_profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Also update the corresponding users_management entry if it exists
        if updated_profile.email:
            users_mgmt = await crud.get_users_management_by_email(db, updated_profile.email)
            if users_mgmt:
                # Update users_management with the new data
                full_name_parts = updated_profile.full_name.split(' ', 1)
                first_name = full_name_parts[0] if full_name_parts else updated_profile.full_name
                last_name = full_name_parts[1] if len(full_name_parts) > 1 else ''
                
                users_mgmt_update = schemas.UsersManagementUpdate(
                    first_name=first_name,
                    last_name=last_name,
                    email=updated_profile.email,
                    role=updated_profile.role,
                    department=updated_profile.department,
                    mobile_number=updated_profile.mobile_number,
                    active=(updated_profile.user_status == "Active")
                )
                await crud.update_users_management(db, users_mgmt.id, users_mgmt_update)
                logger.info(f"Synchronized update to users_management: {users_mgmt.id}")
        
        return updated_profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/user-profiles/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_profile(user_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a user profile from ALL tables: user_profile, users_management, AND users (complete sync)"""
    try:
        # Get the profile first to find their email
        profile = await crud.get_user_profile_by_id(db, user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        user_email = profile.email
        
        # 1. Delete from user_profile table
        success = await crud.delete_user_profile(db, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        logger.info(f"✓ Deleted from user_profile: {user_email}")
        
        # 2. Delete from users_management table
        try:
            users_mgmt = await crud.get_users_management_by_email(db, user_email)
            if users_mgmt:
                await crud.delete_users_management(db, users_mgmt.id)
                logger.info(f"✓ Deleted from users_management table")
        except Exception as sync_error:
            logger.warning(f"Failed to delete from users_management: {sync_error}")
        
        # 3. Delete from users table (authentication)
        try:
            auth_user = await crud.get_user_by_email(db, user_email)
            if auth_user:
                await db.delete(auth_user)
                await db.commit()
                logger.info(f"✓ Deleted from users table (authentication)")
        except Exception as sync_error:
            logger.warning(f"Failed to delete from users table: {sync_error}")
        
        logger.info(f"🎉 User completely deleted from all tables: {user_email}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- AdminEpic Routes (For Admin Portal Boards) ---
@app.get("/admin/epics", response_model=List[schemas.AdminEpicOut])
async def read_admin_epics(project_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    """Get all admin epics, optionally filtered by project"""
    try:
        logger.info(f"Fetching admin epics for project_id: {project_id}")
        admin_epics = await crud.list_admin_epics(db, project_id)
        logger.info(f"Found {len(admin_epics)} admin epics")
        return admin_epics
    except Exception as e:
        logger.error(f"Error fetching admin epics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/epics/{admin_epic_id}", response_model=schemas.AdminEpicOut)
async def get_admin_epic(admin_epic_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific admin epic"""
    admin_epic = await crud.get_admin_epic(db, admin_epic_id)
    if not admin_epic:
        raise HTTPException(status_code=404, detail="Admin epic not found")
    return admin_epic

@app.put("/admin/epics/{admin_epic_id}", response_model=schemas.AdminEpicOut)
async def update_admin_epic(admin_epic_id: int, admin_epic_in: schemas.AdminEpicUpdate, db: AsyncSession = Depends(get_db)):
    """Update an admin epic"""
    updated = await crud.update_admin_epic(db, admin_epic_id, admin_epic_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Admin epic not found")
    return updated

@app.delete("/admin/epics/{admin_epic_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_admin_epic(admin_epic_id: int, db: AsyncSession = Depends(get_db)):
    """Delete an admin epic"""
    success = await crud.delete_admin_epic(db, admin_epic_id)
    if not success:
        raise HTTPException(status_code=404, detail="Admin epic not found")
    return None

# --- AdminTicket Routes (For Admin Portal Boards) ---
@app.get("/admin/tickets", response_model=List[schemas.AdminTicketOut])
async def read_admin_tickets(project_id: Optional[int] = None, epic_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    """Get all admin tickets, optionally filtered by project or epic"""
    try:
        logger.info(f"Fetching admin tickets for project_id: {project_id}, epic_id: {epic_id}")
        admin_tickets = await crud.list_admin_tickets(db, project_id, epic_id)
        logger.info(f"Found {len(admin_tickets)} admin tickets")
        return admin_tickets
    except Exception as e:
        logger.error(f"Error fetching admin tickets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/tickets/{admin_ticket_id}", response_model=schemas.AdminTicketOut)
async def get_admin_ticket(admin_ticket_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific admin ticket"""
    admin_ticket = await crud.get_admin_ticket(db, admin_ticket_id)
    if not admin_ticket:
        raise HTTPException(status_code=404, detail="Admin ticket not found")
    return admin_ticket

@app.put("/admin/tickets/{admin_ticket_id}", response_model=schemas.AdminTicketOut)
async def update_admin_ticket(admin_ticket_id: int, admin_ticket_in: schemas.AdminTicketUpdate, db: AsyncSession = Depends(get_db)):
    """Update an admin ticket"""
    try:
        logger.info(f"Updating admin ticket ID: {admin_ticket_id}")
        updated = await crud.update_admin_ticket(db, admin_ticket_id, admin_ticket_in)
        if not updated:
            raise HTTPException(status_code=404, detail="Admin ticket not found")
        
        # Also update the original ticket if needed
        if updated.ticket_id:
            ticket_update_data = schemas.TicketUpdate(
                title=admin_ticket_in.title,
                description=admin_ticket_in.description,
                status=admin_ticket_in.status,
                priority=admin_ticket_in.priority,
                assignee=admin_ticket_in.assignee,
                reporter=admin_ticket_in.reporter,  # ✅ Include reporter field
                start_date=admin_ticket_in.start_date,
                due_date=admin_ticket_in.due_date
            )
            await crud.update_ticket(db, updated.ticket_id, ticket_update_data)
            logger.info(f"Updated original ticket ID: {updated.ticket_id}")
        
        return updated
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating admin ticket: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/tickets/{admin_ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_admin_ticket(admin_ticket_id: int, db: AsyncSession = Depends(get_db)):
    """Delete an admin ticket and its corresponding ticket"""
    try:
        # Get the admin ticket first to find the corresponding ticket_id
        admin_ticket = await crud.get_admin_ticket(db, admin_ticket_id)
        if not admin_ticket:
            raise HTTPException(status_code=404, detail="Admin ticket not found")
        
        # Delete from admin_tickets table
        success = await crud.delete_admin_ticket(db, admin_ticket_id)
        if not success:
            raise HTTPException(status_code=404, detail="Failed to delete admin ticket")
        
        # Also delete the corresponding ticket from tickets table for bidirectional sync
        if admin_ticket.ticket_id:
            try:
                await crud.delete_ticket(db, admin_ticket.ticket_id)
                logger.info(f"Deleted original ticket ID: {admin_ticket.ticket_id}")
            except Exception as ticket_err:
                logger.error(f"Failed to delete original ticket (non-critical): {ticket_err}")
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting admin ticket: {e}")
        raise HTTPException(status_code=500, detail=str(e))
