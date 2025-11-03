# from datetime import datetime
# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     DateTime,
#     ForeignKey,
#     Enum,
# )
# from sqlalchemy.orm import relationship
# from app.database import Base
# import enum


# # --- ENUM DEFINITIONS ---

# class AssetTypeEnum(str, enum.Enum):
#     Laptop = "Laptop"
#     Charger = "Charger"
#     Network = "Network"


# class LocationEnum(str, enum.Enum):
#     WFH = "WFH"
#     WFO = "WFO"


# class StatusEnum(str, enum.Enum):
#     Open = "Open"
#     Assigned = "Assigned"
#     Closed = "Closed"


# # --- USER MODEL ---
# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # ✅ added autoincrement
#     email = Column(String, unique=True, index=True, nullable=False)
#     name = Column(String, nullable=True)

#     # Relationship to assets
#     assets = relationship("Asset", back_populates="user", cascade="all, delete")


# # --- ASSET MODEL ---
# class Asset(Base):
#     __tablename__ = "assets"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # ✅ added autoincrement
#     user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)

#     email = Column(String, nullable=False)
#     type = Column(Enum(AssetTypeEnum, name="asset_type_enum", native_enum=False), nullable=False)
#     location = Column(Enum(LocationEnum, name="location_enum", native_enum=False), nullable=True)
#     status = Column(Enum(StatusEnum, name="status_enum", native_enum=False), default=StatusEnum.Open, nullable=False)

#     open_date = Column(DateTime, default=datetime.utcnow, nullable=False)
#     close_date = Column(DateTime, nullable=True)

#     # Relationship back to User
#     user = relationship("User", back_populates="assets")
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, TIMESTAMP, func, Date, Boolean
from sqlalchemy.ext.declarative import declarative_base

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)  # Make sure this exists
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # Map to existing DB column names while keeping attribute names used by app
    email = Column('email_id', String(255), nullable=False)
    type = Column('asset_type', String(50), nullable=False)
    location = Column(String(10), nullable=False)
    status = Column(String(20), nullable=False)
    description = Column(Text, nullable=True)
    open_date = Column('assigned_date', DateTime(timezone=False), nullable=True)
    close_date = Column('return_date', DateTime(timezone=False), nullable=True)

class AdminAsset(Base):
    __tablename__ = "admin_assets"

    admin_asset_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id = Column(Integer, nullable=False)  # Reference to the original asset record
    email = Column('email_id', String(255), nullable=False)
    type = Column('asset_type', String(50), nullable=False)
    location = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default='Active')
    open_date = Column('assigned_date', TIMESTAMP, nullable=True)
    close_date = Column('return_date', TIMESTAMP, nullable=True)
    actions = Column(String(50), nullable=True)  # Edit, Delete, Save

# Use the shared Base imported from app.database for all models

class UsersManagement(Base):
    __tablename__ = "users_management"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), nullable=False, default='Developer')
    department = Column(String(100), nullable=False, default='Engineering')
    active = Column(Boolean, nullable=False, default=True)
    language = Column(String(50), nullable=False, default='English')
    mobile_number = Column(String(30), nullable=True)
    date_format = Column(String(30), nullable=False, default='YYYY-MM-DD')
    password_reset_needed = Column(Boolean, nullable=False, default=False)
    profile_file_name = Column(String(255), nullable=True)
    profile_file_size = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class UserProfile(Base):
    __tablename__ = "user_profile"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    mobile_number = Column(String(20), nullable=True)
    role = Column(String(50), nullable=False)
    department = Column(String(50), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    user_status = Column(String(20), default="Active", nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class AdminRegistration(Base):
    __tablename__ = "admin_registrations"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(255), nullable=False, default='')
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    project_key = Column(String(50), nullable=False, unique=True)
    project_type = Column(String(100), default='Software', nullable=False)
    leads = Column(Text, nullable=True)  # Comma-separated list of user emails
    team_members = Column(Text, nullable=True)  # Comma-separated list of team member emails
    description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Epic(Base):
    __tablename__ = "epics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, nullable=True)  # Reference to projects table, nullable for backward compatibility
    name = Column(String(100), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)  # Will reference users table
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default='Open', nullable=False)
    priority = Column(String(50), default='Medium', nullable=False)
    assignee = Column(String(255), nullable=True)  # Assigned user email
    reporter = Column(String(255), nullable=True)  # Email of user who created/assigned the ticket
    start_date = Column(Date, nullable=True)  # Task start date
    due_date = Column(Date, nullable=True)  # Task due date
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class AdminEpic(Base):
    __tablename__ = "admin_epics"

    admin_epic_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    epic_id = Column(Integer, nullable=False)  # Reference to original epic
    project_id = Column(Integer, nullable=True)  # Reference to project
    project_title = Column(String(200), nullable=True)  # Project name for easy lookup
    user_name = Column(String(255), nullable=True)  # User who created/owns this epic
    name = Column(String(100), nullable=False)  # Epic name
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class AdminTicket(Base):
    __tablename__ = "admin_tickets"

    admin_ticket_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_id = Column(Integer, nullable=False)  # Reference to original ticket
    epic_id = Column(Integer, nullable=True)  # Reference to epic
    project_id = Column(Integer, nullable=True)  # Reference to project
    project_title = Column(String(200), nullable=True)  # Project name for easy lookup
    user_name = Column(String(255), nullable=True)  # User who created/owns this ticket
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default='Open', nullable=False)
    priority = Column(String(50), default='Medium', nullable=False)
    assignee = Column(String(255), nullable=True)  # Assigned user email
    reporter = Column(String(255), nullable=True)  # Email of user who created/assigned the ticket
    start_date = Column(Date, nullable=True)  # Task start date
    due_date = Column(Date, nullable=True)  # Task due date
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
