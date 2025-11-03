# from sqlalchemy import select
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List, Optional
# from datetime import datetime
# from . import models, schemas


# def _coerce_enum_value(model_enum, incoming):
#     """
#     Coerce incoming value (str or Enum) to the DB enum string value.
#     Handles Pydantic enums, raw strings (both names and values).
#     """
#     if incoming is None:
#         return None

#     # If it's an enum instance, use its value
#     if hasattr(incoming, "value"):
#         incoming = incoming.value

#     if isinstance(incoming, str):
#         # Try as enum value
#         try:
#             return model_enum(incoming).value
#         except ValueError:
#             # Try as enum member name
#             try:
#                 return model_enum[incoming.replace(" ", "")].value
#             except Exception:
#                 return incoming  # fallback to string

#     return str(incoming)


# async def get_asset(session: AsyncSession, asset_id: str) -> Optional[models.Asset]:
#     q = select(models.Asset).where(models.Asset.id == asset_id)
#     res = await session.execute(q)
#     return res.scalars().first()


# async def list_assets(session: AsyncSession, status: Optional[str] = None) -> List[models.Asset]:
#     q = select(models.Asset)
#     if status:
#         q = q.where(models.Asset.status == status)
#     q = q.order_by(models.Asset.open_date.desc())
#     res = await session.execute(q)
#     return res.scalars().all()


# def _map_status_to_db(incoming: Optional[str]) -> Optional[str]:
#     """Map incoming status strings (from frontend/schemas) to DB StatusEnum values.

#     The frontend/schema use different status names (e.g. 'active', 'maintenance', 'inactive').
#     The DB model expects 'Open', 'Assigned', 'Closed'. Map commonly used values accordingly.
#     """
#     if incoming is None:
#         return None
#     # coerce enum-like inputs first
#     if hasattr(incoming, "value"):
#         incoming_val = incoming.value
#     else:
#         incoming_val = str(incoming)

#     # direct match to DB enum value
#     try:
#         return models.StatusEnum(incoming_val).value
#     except Exception:
#         pass

#     # common mapping from older/frontend statuses to DB statuses
#     mapping = {
#         "active": models.StatusEnum.Open.value,
#         "maintenance": models.StatusEnum.Assigned.value,
#         "inactive": models.StatusEnum.Closed.value,
#         "open": models.StatusEnum.Open.value,
#         "assigned": models.StatusEnum.Assigned.value,
#         "closed": models.StatusEnum.Closed.value,
#     }
#     key = incoming_val.lower()
#     return mapping.get(key, incoming_val)


# def _map_type_to_db(incoming: Optional[str]) -> Optional[str]:
#     """Map frontend type values to DB AssetTypeEnum values.

#     Frontend may send 'Network Issue' or 'NetworkIssue'; DB expects 'Network'.
#     """
#     if incoming is None:
#         return None
#     if hasattr(incoming, "value"):
#         incoming_val = incoming.value
#     else:
#         incoming_val = str(incoming)

#     # direct match
#     try:
#         return models.AssetTypeEnum(incoming_val).value
#     except Exception:
#         pass

#     # normalize names without spaces
#     name_key = incoming_val.replace(" ", "").lower()
#     type_map = {
#         "laptop": models.AssetTypeEnum.Laptop.value,
#         "charger": models.AssetTypeEnum.Charger.value,
#         "networkissue": models.AssetTypeEnum.Network.value,
#         "network": models.AssetTypeEnum.Network.value,
#     }
#     return type_map.get(name_key, incoming_val)


# async def create_asset(session: AsyncSession, asset_in: schemas.AssetCreate) -> models.Asset:
#     obj = models.Asset(
#         email=asset_in.email,
#         type=_map_type_to_db(asset_in.type),
#         location=_coerce_enum_value(models.LocationEnum, asset_in.location),
#         status=_map_status_to_db(asset_in.status),
#         open_date=datetime.utcnow(),
#     )
#     session.add(obj)
#     await session.commit()
#     await session.refresh(obj)
#     return obj


# async def delete_asset(session: AsyncSession, asset_id: str) -> bool:
#     obj = await get_asset(session, asset_id)
#     if not obj:
#         return False
#     await session.delete(obj)
#     await session.commit()
#     return True
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession 
from typing import List, Optional
from datetime import datetime
from . import models, schemas 
from .models import UserProfile 
from .schemas import UserProfileCreate, UserProfileUpdate 
import bcrypt 



# Helpers to normalize inputs to DB-expected strings
def _normalize_type(incoming) -> Optional[str]:
    if incoming is None:
        return None
    val = incoming.value if hasattr(incoming, 'value') else str(incoming)
    val = str(val).strip()
    key = ''.join(ch for ch in val.lower() if ch.isalnum())
    if key in ('laptop',):
        return 'Laptop'
    if key in ('charger',):
        return 'Charger'
    if key in ('networkissue', 'network', 'networkissue'):
        # DB expects 'NetworkIssue' (without space, camelCase)
        return 'NetworkIssue'
    # fallback: return original trimmed value 
    return val


def _normalize_status(incoming) -> str:
    # Map frontend status values to DB status values: Open/Assigned/Closed
    if incoming is None:
        return 'Open'
    val = incoming.value if hasattr(incoming, 'value') else str(incoming)
    val = str(val).strip()
    key = ''.join(ch for ch in val.lower() if ch.isalnum())
    if key in ('active', 'open'):
        return 'Open'
    if key in ('maintenance', 'assigned'):
        return 'Assigned'
    if key in ('inactive', 'closed'):
        return 'Closed'
    return val


def _normalize_location(incoming) -> Optional[str]:
    if incoming is None:
        return None
    val = incoming.value if hasattr(incoming, 'value') else str(incoming)
    val = str(val).strip()
    key = ''.join(ch for ch in val.lower() if ch.isalnum())
    if key in ('wfo', 'office', 'onsite'):
        return 'WFO'
    if key in ('wfh', 'home'):
        return 'WFH'
    return val

async def get_asset(session: AsyncSession, asset_id: int) -> Optional[models.Asset]:
    q = select(models.Asset).where(models.Asset.id == asset_id)
    res = await session.execute(q)
    return res.scalars().first()

async def list_assets(session: AsyncSession, status: Optional[str] = None, user_email: Optional[str] = None) -> List[models.Asset]:
    q = select(models.Asset)
    if status:
        # Map frontend status to database status
        status_map = {
            "active": "Open",
            "maintenance": "Assigned", 
            "inactive": "Closed"
        }
        db_status = status_map.get(status, status)
        q = q.where(models.Asset.status == db_status)
    if user_email:
        q = q.where(models.Asset.email == user_email)
    q = q.order_by(models.Asset.open_date.desc())
    res = await session.execute(q)
    return res.scalars().all()

async def create_asset(session: AsyncSession, asset_in: schemas.AssetCreate) -> models.Asset:
    # Normalize incoming values to what the DB check constraints expect
    type_val = _normalize_type(asset_in.type)
    status_val = _normalize_status(asset_in.status)
    loc_val = _normalize_location(asset_in.location) or 'WFO'

    obj = models.Asset(
        email=asset_in.email,
        type=type_val,
        location=loc_val,
        status=status_val,
        description=asset_in.description,
        open_date=datetime.utcnow(),
    )
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj

async def update_asset(session: AsyncSession, asset_id: int, asset_in: schemas.AssetUpdate) -> Optional[models.Asset]:
    obj = await get_asset(session, asset_id)
    if not obj:
        return None
    
    # Use normalization helpers for updates as well
    
    if asset_in.email is not None:
        obj.email = asset_in.email
    if asset_in.type is not None:
        obj.type = _normalize_type(asset_in.type)
    if asset_in.location is not None:
        obj.location = _normalize_location(asset_in.location)
    if asset_in.status is not None:
        obj.status = _normalize_status(asset_in.status)
    if asset_in.description is not None:
        obj.description = asset_in.description
    
    await session.commit()
    await session.refresh(obj)
    return obj

async def delete_asset(session: AsyncSession, asset_id: int) -> bool:
    obj = await get_asset(session, asset_id)
    if not obj:
        return False
    await session.delete(obj)
    await session.commit()
    return True


async def create_user(session: AsyncSession, user_in: schemas.UserCreate) -> models.User:
    # Hash password with bcrypt - ensure password is bytes and not too long
    password_bytes = user_in.password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    user = models.User(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=hashed_password,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def get_user_by_email(session: AsyncSession, email: str) -> Optional[models.User]:
    q = select(models.User).where(models.User.email == email)
    res = await session.execute(q)
    return res.scalars().first()



async def get_users(db: AsyncSession):
    result = await db.execute(select(UserProfile))
    return result.scalars().all()

async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
    return result.scalar_one_or_none()

async def create_user_profile(db: AsyncSession, user: UserProfileCreate):
    db_user = UserProfile(**user.dict())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def update_user(db: AsyncSession, user_id: int, user: UserProfileUpdate):
    await db.execute(
        update(UserProfile)
        .where(UserProfile.user_id == user_id)
        .values(**user.dict(exclude_unset=True))
    )
    await db.commit()
    return await get_user(db, user_id)

async def delete_user(db: AsyncSession, user_id: int):
    await db.execute(delete(UserProfile).where(UserProfile.user_id == user_id))
    await db.commit()
    return {"message": "User deleted successfully"}

# Admin Registration CRUD Functions
async def create_admin(session: AsyncSession, admin_in: schemas.AdminCreate) -> models.AdminRegistration:
    """Create a new admin registration"""
    # Hash password with bcrypt
    password_bytes = admin_in.password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    admin = models.AdminRegistration(
        full_name=admin_in.full_name,
        email=admin_in.email,
        hashed_password=hashed_password,
    )
    session.add(admin)
    await session.commit()
    await session.refresh(admin)
    return admin

async def get_admin_by_email(session: AsyncSession, email: str) -> Optional[models.AdminRegistration]:
    """Get admin by email"""
    q = select(models.AdminRegistration).where(models.AdminRegistration.email == email)
    res = await session.execute(q)
    return res.scalars().first()

# Ticket CRUD Functions
async def create_ticket(session: AsyncSession, ticket_in: schemas.TicketCreate) -> models.Ticket:
    """Create a new ticket"""
    ticket = models.Ticket(
        user_id=ticket_in.user_id,
        title=ticket_in.title,
        description=ticket_in.description,
        status=ticket_in.status,
        priority=ticket_in.priority,
        assignee=ticket_in.assignee,
        reporter=ticket_in.reporter,
        start_date=ticket_in.start_date,
        due_date=ticket_in.due_date
    )
    session.add(ticket)
    await session.commit()
    await session.refresh(ticket)
    return ticket

async def get_ticket(session: AsyncSession, ticket_id: int) -> Optional[models.Ticket]:
    """Get ticket by ID"""
    q = select(models.Ticket).where(models.Ticket.id == ticket_id)
    res = await session.execute(q)
    return res.scalars().first()

async def list_tickets(session: AsyncSession, user_id: Optional[int] = None, status: Optional[str] = None) -> List[models.Ticket]:
    """List tickets with optional filters"""
    q = select(models.Ticket)
    if user_id:
        q = q.where(models.Ticket.user_id == user_id)
    if status:
        q = q.where(models.Ticket.status == status)
    q = q.order_by(models.Ticket.created_at.desc())
    res = await session.execute(q)
    return res.scalars().all()

async def update_ticket(session: AsyncSession, ticket_id: int, ticket_in: schemas.TicketUpdate) -> Optional[models.Ticket]:
    """Update a ticket"""
    ticket = await get_ticket(session, ticket_id)
    if not ticket:
        return None
    
    if ticket_in.title is not None:
        ticket.title = ticket_in.title
    if ticket_in.description is not None:
        ticket.description = ticket_in.description
    if ticket_in.status is not None:
        ticket.status = ticket_in.status
    if ticket_in.priority is not None:
        ticket.priority = ticket_in.priority
    if ticket_in.assignee is not None:
        ticket.assignee = ticket_in.assignee
    if ticket_in.reporter is not None:
        ticket.reporter = ticket_in.reporter
    if ticket_in.start_date is not None:
        ticket.start_date = ticket_in.start_date
    if ticket_in.due_date is not None:
        ticket.due_date = ticket_in.due_date
    
    await session.commit()
    await session.refresh(ticket)
    return ticket

async def delete_ticket(session: AsyncSession, ticket_id: int) -> bool:
    """Delete a ticket"""
    ticket = await get_ticket(session, ticket_id)
    if not ticket:
        return False
    await session.delete(ticket)
    await session.commit()
    return True

# Project CRUD Functions
async def create_project(session: AsyncSession, project_in: schemas.ProjectCreate) -> models.Project:
    """Create a new project"""
    project = models.Project(
        name=project_in.name,
        project_key=project_in.project_key,
        project_type=project_in.project_type,
        leads=project_in.leads,
        description=project_in.description
    )
    session.add(project)
    await session.commit()
    await session.refresh(project)
    return project

async def get_project(session: AsyncSession, project_id: int) -> Optional[models.Project]:
    """Get project by ID"""
    q = select(models.Project).where(models.Project.id == project_id)
    res = await session.execute(q)
    return res.scalars().first()

async def list_projects(session: AsyncSession, user_email: Optional[str] = None) -> List[models.Project]:
    """List projects, optionally filtered by user email (as lead or team member)"""
    q = select(models.Project).order_by(models.Project.created_at.desc())
    res = await session.execute(q)
    projects = res.scalars().all()
    
    # If user_email is provided, filter projects where user is lead OR team member
    if user_email:
        filtered_projects = []
        for project in projects:
            # Check if user is in leads
            is_lead = False
            if project.leads:
                lead_emails = [email.strip() for email in project.leads.split(',') if email.strip()]
                is_lead = user_email in lead_emails
            
            # Check if user is in team_members
            is_team_member = False
            if project.team_members:
                team_emails = [email.strip() for email in project.team_members.split(',') if email.strip()]
                is_team_member = user_email in team_emails
            
            # Include project if user is either lead or team member
            if is_lead or is_team_member:
                filtered_projects.append(project)
        
        return filtered_projects
    
    return projects

async def update_project(session: AsyncSession, project_id: int, project_in: schemas.ProjectUpdate) -> Optional[models.Project]:
    """Update a project"""
    project = await get_project(session, project_id)
    if not project:
        return None

    if project_in.name is not None:
        project.name = project_in.name
    if project_in.project_key is not None:
        project.project_key = project_in.project_key
    if project_in.project_type is not None:
        project.project_type = project_in.project_type
    if project_in.leads is not None:
        project.leads = project_in.leads
    if project_in.team_members is not None:
        project.team_members = project_in.team_members
    if project_in.description is not None:
        project.description = project_in.description

    await session.commit()
    await session.refresh(project)
    return project

async def delete_project(session: AsyncSession, project_id: int) -> bool:
    """Delete a project and all associated epics and tickets (cascade delete)"""
    from sqlalchemy import delete
    
    project = await get_project(session, project_id)
    if not project:
        return False
    
    # Delete associated admin_tickets first
    await session.execute(
        delete(models.AdminTicket).where(models.AdminTicket.project_id == project_id)
    )
    
    # Delete associated admin_epics
    await session.execute(
        delete(models.AdminEpic).where(models.AdminEpic.project_id == project_id)
    )
    
    # Delete associated tickets (if you have a project_id column in tickets table)
    # Note: Currently tickets don't have project_id directly, so we need to delete by epic_id
    # First, get all epic IDs for this project
    epics_result = await session.execute(
        select(models.Epic.id).where(models.Epic.project_id == project_id)
    )
    epic_ids = [row[0] for row in epics_result.all()]
    
    # Delete tickets associated with these epics (from admin_tickets by epic_id)
    if epic_ids:
        await session.execute(
            delete(models.AdminTicket).where(models.AdminTicket.epic_id.in_(epic_ids))
        )
    
    # Delete associated epics
    await session.execute(
        delete(models.Epic).where(models.Epic.project_id == project_id)
    )
    
    # Finally, delete the project itself
    await session.delete(project)
    await session.commit()
    return True

# Epic CRUD Functions
async def create_epic(session: AsyncSession, epic_in: schemas.EpicCreate) -> models.Epic:
    """Create a new epic"""
    epic = models.Epic(project_id=epic_in.project_id, name=epic_in.name)
    session.add(epic)
    await session.commit()
    await session.refresh(epic)
    return epic

async def get_epic(session: AsyncSession, epic_id: int) -> Optional[models.Epic]:
    """Get epic by ID"""
    q = select(models.Epic).where(models.Epic.id == epic_id)
    res = await session.execute(q)
    return res.scalars().first()

async def list_epics(session: AsyncSession, project_id: Optional[int] = None) -> List[models.Epic]:
    """List all epics, optionally filtered by project"""
    q = select(models.Epic)
    if project_id:
        q = q.where(models.Epic.project_id == project_id)
    q = q.order_by(models.Epic.created_at.desc())
    res = await session.execute(q)
    return res.scalars().all()

async def delete_epic(session: AsyncSession, epic_id: int) -> bool:
    """Delete an epic"""
    epic = await get_epic(session, epic_id)
    if not epic:
        return False
    await session.delete(epic)
    await session.commit()
    return True

# Admin Asset CRUD Functions
async def create_admin_asset(session: AsyncSession, admin_asset_in: schemas.AdminAssetCreate) -> models.AdminAsset:
    """Create a new admin asset"""
    admin_asset = models.AdminAsset(
        id=admin_asset_in.id,
        email=admin_asset_in.email,
        type=admin_asset_in.type,
        location=admin_asset_in.location,
        description=admin_asset_in.description,
        status=admin_asset_in.status,
        open_date=admin_asset_in.open_date,
        close_date=admin_asset_in.close_date,
        actions=admin_asset_in.actions
    )
    session.add(admin_asset)
    await session.commit()
    await session.refresh(admin_asset)
    return admin_asset

async def get_admin_asset(session: AsyncSession, admin_asset_id: int) -> Optional[models.AdminAsset]:
    """Get admin asset by ID"""
    q = select(models.AdminAsset).where(models.AdminAsset.admin_asset_id == admin_asset_id)
    res = await session.execute(q)
    return res.scalars().first()

async def list_admin_assets(session: AsyncSession) -> List[models.AdminAsset]:
    """List all admin assets"""
    q = select(models.AdminAsset).order_by(models.AdminAsset.open_date.desc())
    res = await session.execute(q)
    return res.scalars().all()

async def update_admin_asset(session: AsyncSession, admin_asset_id: int, admin_asset_in: schemas.AdminAssetUpdate) -> Optional[models.AdminAsset]:
    """Update an admin asset"""
    admin_asset = await get_admin_asset(session, admin_asset_id)
    if not admin_asset:
        return None

    if admin_asset_in.email is not None:
        admin_asset.email = admin_asset_in.email
    if admin_asset_in.type is not None:
        admin_asset.type = admin_asset_in.type
    if admin_asset_in.location is not None:
        admin_asset.location = admin_asset_in.location
    if admin_asset_in.description is not None:
        admin_asset.description = admin_asset_in.description
    if admin_asset_in.status is not None:
        admin_asset.status = admin_asset_in.status
    if admin_asset_in.open_date is not None:
        admin_asset.open_date = admin_asset_in.open_date
    if admin_asset_in.close_date is not None:
        admin_asset.close_date = admin_asset_in.close_date
    if admin_asset_in.actions is not None:
        admin_asset.actions = admin_asset_in.actions

    await session.commit()
    await session.refresh(admin_asset)
    return admin_asset

async def delete_admin_asset(session: AsyncSession, admin_asset_id: int) -> bool:
    """Delete an admin asset"""
    admin_asset = await get_admin_asset(session, admin_asset_id)
    if not admin_asset:
        return False
    await session.delete(admin_asset)
    await session.commit()
    return True

# ==================== UsersManagement CRUD ====================

async def create_users_management(session: AsyncSession, user_in: schemas.UsersManagementCreate) -> models.UsersManagement:
    """Create a new user in users_management table"""
    user = models.UsersManagement(
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        role=user_in.role,
        department=user_in.department,
        active=user_in.active,
        language=user_in.language,
        mobile_number=user_in.mobile_number,
        date_format=user_in.date_format,
        password_reset_needed=user_in.password_reset_needed,
        profile_file_name=user_in.profile_file_name,
        profile_file_size=user_in.profile_file_size
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def get_users_management_by_id(session: AsyncSession, user_id: int) -> Optional[models.UsersManagement]:
    """Get a user from users_management by ID"""
    result = await session.execute(
        select(models.UsersManagement).where(models.UsersManagement.id == user_id)
    )
    return result.scalar_one_or_none()

async def get_users_management_by_email(session: AsyncSession, email: str) -> Optional[models.UsersManagement]:
    """Get a user from users_management by email"""
    result = await session.execute(
        select(models.UsersManagement).where(models.UsersManagement.email == email)
    )
    return result.scalar_one_or_none()

async def list_users_management(session: AsyncSession) -> List[models.UsersManagement]:
    """List all users from users_management table"""
    result = await session.execute(select(models.UsersManagement))
    return list(result.scalars().all())

async def update_users_management(session: AsyncSession, user_id: int, user_in: schemas.UsersManagementUpdate) -> Optional[models.UsersManagement]:
    """Update a user in users_management table"""
    user = await get_users_management_by_id(session, user_id)
    if not user:
        return None
    
    if user_in.first_name is not None:
        user.first_name = user_in.first_name
    if user_in.last_name is not None:
        user.last_name = user_in.last_name
    if user_in.email is not None:
        user.email = user_in.email
    if user_in.role is not None:
        user.role = user_in.role
    if user_in.department is not None:
        user.department = user_in.department
    if user_in.active is not None:
        user.active = user_in.active
    if user_in.language is not None:
        user.language = user_in.language
    if user_in.mobile_number is not None:
        user.mobile_number = user_in.mobile_number
    if user_in.date_format is not None:
        user.date_format = user_in.date_format
    if user_in.password_reset_needed is not None:
        user.password_reset_needed = user_in.password_reset_needed
    if user_in.profile_file_name is not None:
        user.profile_file_name = user_in.profile_file_name
    if user_in.profile_file_size is not None:
        user.profile_file_size = user_in.profile_file_size
    
    await session.commit()
    await session.refresh(user)
    return user

async def delete_users_management(session: AsyncSession, user_id: int) -> bool:
    """Delete a user from users_management table"""
    user = await get_users_management_by_id(session, user_id)
    if not user:
        return False
    await session.delete(user)
    await session.commit()
    return True

# ==================== UserProfile CRUD ====================

async def create_user_profile(session: AsyncSession, profile_in: schemas.UserProfileCreate) -> models.UserProfile:
    """Create a new user profile"""
    profile = models.UserProfile(
        full_name=profile_in.full_name,
        email=profile_in.email,
        mobile_number=profile_in.mobile_number,
        role=profile_in.role,
        department=profile_in.department,
        date_of_birth=profile_in.date_of_birth,
        user_status=profile_in.user_status
    )
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile

async def get_user_profile_by_id(session: AsyncSession, user_id: int) -> Optional[models.UserProfile]:
    """Get a user profile by user_id"""
    result = await session.execute(
        select(models.UserProfile).where(models.UserProfile.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def get_user_profile_by_email(session: AsyncSession, email: str) -> Optional[models.UserProfile]:
    """Get a user profile by email"""
    result = await session.execute(
        select(models.UserProfile).where(models.UserProfile.email == email)
    )
    return result.scalar_one_or_none()

async def list_user_profiles(session: AsyncSession) -> List[models.UserProfile]:
    """List all user profiles"""
    result = await session.execute(select(models.UserProfile))
    return list(result.scalars().all())

async def update_user_profile(session: AsyncSession, user_id: int, profile_in: schemas.UserProfileUpdate) -> Optional[models.UserProfile]:
    """Update a user profile"""
    profile = await get_user_profile_by_id(session, user_id)
    if not profile:
        return None
    
    if profile_in.full_name is not None:
        profile.full_name = profile_in.full_name
    if profile_in.email is not None:
        profile.email = profile_in.email
    if profile_in.mobile_number is not None:
        profile.mobile_number = profile_in.mobile_number
    if profile_in.role is not None:
        profile.role = profile_in.role
    if profile_in.department is not None:
        profile.department = profile_in.department
    if profile_in.date_of_birth is not None:
        profile.date_of_birth = profile_in.date_of_birth
    if profile_in.user_status is not None:
        profile.user_status = profile_in.user_status
    
    await session.commit()
    await session.refresh(profile)
    return profile

async def delete_user_profile(session: AsyncSession, user_id: int) -> bool:
    """Delete a user profile"""
    profile = await get_user_profile_by_id(session, user_id)
    if not profile:
        return False
    await session.delete(profile)
    await session.commit()
    return True

# ==================== AdminEpic CRUD ====================

async def create_admin_epic(session: AsyncSession, admin_epic_in: schemas.AdminEpicCreate) -> models.AdminEpic:
    """Create a new admin epic"""
    admin_epic = models.AdminEpic(
        epic_id=admin_epic_in.epic_id,
        project_id=admin_epic_in.project_id,
        project_title=admin_epic_in.project_title,
        user_name=admin_epic_in.user_name,
        name=admin_epic_in.name
    )
    session.add(admin_epic)
    await session.commit()
    await session.refresh(admin_epic)
    return admin_epic

async def get_admin_epic(session: AsyncSession, admin_epic_id: int) -> Optional[models.AdminEpic]:
    """Get an admin epic by admin_epic_id"""
    result = await session.execute(
        select(models.AdminEpic).where(models.AdminEpic.admin_epic_id == admin_epic_id)
    )
    return result.scalar_one_or_none()

async def get_admin_epic_by_epic_id(session: AsyncSession, epic_id: int) -> Optional[models.AdminEpic]:
    """Get an admin epic by original epic_id"""
    result = await session.execute(
        select(models.AdminEpic).where(models.AdminEpic.epic_id == epic_id)
    )
    return result.scalar_one_or_none()

async def list_admin_epics(session: AsyncSession, project_id: Optional[int] = None) -> List[models.AdminEpic]:
    """List all admin epics, optionally filtered by project"""
    query = select(models.AdminEpic)
    if project_id is not None:
        query = query.where(models.AdminEpic.project_id == project_id)
    result = await session.execute(query)
    return list(result.scalars().all())

async def update_admin_epic(session: AsyncSession, admin_epic_id: int, admin_epic_in: schemas.AdminEpicUpdate) -> Optional[models.AdminEpic]:
    """Update an admin epic"""
    admin_epic = await get_admin_epic(session, admin_epic_id)
    if not admin_epic:
        return None
    
    if admin_epic_in.project_id is not None:
        admin_epic.project_id = admin_epic_in.project_id
    if admin_epic_in.project_title is not None:
        admin_epic.project_title = admin_epic_in.project_title
    if admin_epic_in.user_name is not None:
        admin_epic.user_name = admin_epic_in.user_name
    if admin_epic_in.name is not None:
        admin_epic.name = admin_epic_in.name
    
    await session.commit()
    await session.refresh(admin_epic)
    return admin_epic

async def delete_admin_epic(session: AsyncSession, admin_epic_id: int) -> bool:
    """Delete an admin epic"""
    admin_epic = await get_admin_epic(session, admin_epic_id)
    if not admin_epic:
        return False
    await session.delete(admin_epic)
    await session.commit()
    return True

# ==================== AdminTicket CRUD ====================

async def create_admin_ticket(session: AsyncSession, admin_ticket_in: schemas.AdminTicketCreate) -> models.AdminTicket:
    """Create a new admin ticket"""
    admin_ticket = models.AdminTicket(
        ticket_id=admin_ticket_in.ticket_id,
        epic_id=admin_ticket_in.epic_id,
        project_id=admin_ticket_in.project_id,
        project_title=admin_ticket_in.project_title,
        user_name=admin_ticket_in.user_name,
        title=admin_ticket_in.title,
        description=admin_ticket_in.description,
        status=admin_ticket_in.status,
        priority=admin_ticket_in.priority,
        assignee=admin_ticket_in.assignee,
        reporter=admin_ticket_in.reporter,
        start_date=admin_ticket_in.start_date,
        due_date=admin_ticket_in.due_date
    )
    session.add(admin_ticket)
    await session.commit()
    await session.refresh(admin_ticket)
    return admin_ticket

async def get_admin_ticket(session: AsyncSession, admin_ticket_id: int) -> Optional[models.AdminTicket]:
    """Get an admin ticket by admin_ticket_id"""
    result = await session.execute(
        select(models.AdminTicket).where(models.AdminTicket.admin_ticket_id == admin_ticket_id)
    )
    return result.scalar_one_or_none()

async def get_admin_ticket_by_ticket_id(session: AsyncSession, ticket_id: int) -> Optional[models.AdminTicket]:
    """Get an admin ticket by original ticket_id"""
    result = await session.execute(
        select(models.AdminTicket).where(models.AdminTicket.ticket_id == ticket_id)
    )
    return result.scalar_one_or_none()

async def list_admin_tickets(session: AsyncSession, project_id: Optional[int] = None, epic_id: Optional[int] = None) -> List[models.AdminTicket]:
    """List all admin tickets, optionally filtered by project or epic"""
    query = select(models.AdminTicket)
    if project_id is not None:
        query = query.where(models.AdminTicket.project_id == project_id)
    if epic_id is not None:
        query = query.where(models.AdminTicket.epic_id == epic_id)
    result = await session.execute(query)
    return list(result.scalars().all())

async def update_admin_ticket(session: AsyncSession, admin_ticket_id: int, admin_ticket_in: schemas.AdminTicketUpdate) -> Optional[models.AdminTicket]:
    """Update an admin ticket"""
    admin_ticket = await get_admin_ticket(session, admin_ticket_id)
    if not admin_ticket:
        return None
    
    if admin_ticket_in.epic_id is not None:
        admin_ticket.epic_id = admin_ticket_in.epic_id
    if admin_ticket_in.project_id is not None:
        admin_ticket.project_id = admin_ticket_in.project_id
    if admin_ticket_in.project_title is not None:
        admin_ticket.project_title = admin_ticket_in.project_title
    if admin_ticket_in.user_name is not None:
        admin_ticket.user_name = admin_ticket_in.user_name
    if admin_ticket_in.title is not None:
        admin_ticket.title = admin_ticket_in.title
    if admin_ticket_in.description is not None:
        admin_ticket.description = admin_ticket_in.description
    if admin_ticket_in.status is not None:
        admin_ticket.status = admin_ticket_in.status
    if admin_ticket_in.priority is not None:
        admin_ticket.priority = admin_ticket_in.priority
    if admin_ticket_in.assignee is not None:
        admin_ticket.assignee = admin_ticket_in.assignee
    if admin_ticket_in.reporter is not None:
        admin_ticket.reporter = admin_ticket_in.reporter
    if admin_ticket_in.start_date is not None:
        admin_ticket.start_date = admin_ticket_in.start_date
    if admin_ticket_in.due_date is not None:
        admin_ticket.due_date = admin_ticket_in.due_date
    
    await session.commit()
    await session.refresh(admin_ticket)
    return admin_ticket

async def delete_admin_ticket(session: AsyncSession, admin_ticket_id: int) -> bool:
    """Delete an admin ticket"""
    admin_ticket = await get_admin_ticket(session, admin_ticket_id)
    if not admin_ticket:
        return False
    await session.delete(admin_ticket)
    await session.commit()
    return True