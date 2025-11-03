from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum
from datetime import date


# Enums matching your DB values
class AssetTypeEnum(str, Enum):
    Laptop = "Laptop"
    Charger = "Charger"
    NetworkIssue = "NetworkIssue"

class LocationEnum(str, Enum):
    WFO = "WFO"
    WFH = "WFH"

class StatusEnum(str, Enum):
    active = "active"
    maintenance = "maintenance"
    inactive = "inactive"

# Base model for asset input
class AssetBase(BaseModel):
    email: EmailStr
    type: AssetTypeEnum
    location: Optional[LocationEnum] = LocationEnum.WFO
    status: Optional[StatusEnum] = StatusEnum.active
    description: Optional[str] = None

class AssetCreate(AssetBase):
    pass

# Duplicate AssetUpdate class commented out - using the one below (line ~129)
# class AssetUpdate(BaseModel):
#     email: Optional[EmailStr] = None
#     type: Optional[AssetTypeEnum] = None
#     location: Optional[LocationEnum] = None
#     status: Optional[StatusEnum] = None
#     description: Optional[str] = None

# First AssetOut definition removed - using the one below that matches database model
# First AssetOut class commented out - using the one below that matches database model
# class AssetOut(BaseModel):
#     id: int
#     email: EmailStr
#     type: AssetTypeEnum
#     location: Optional[LocationEnum] = None
#     status: StatusEnum          # Use correct enum
#     open_date: datetime = Field(..., alias="openDate")
#     close_date: Optional[datetime] = Field(None, alias="closeDate")
#     description: Optional[str] = None
#
#     class Config:
#         orm_mode = True
#         allow_population_by_field_name = True
#
#     @field_validator("type", mode="before")
#     def coerce_type(cls, v):
#         if isinstance(v, AssetTypeEnum):
#             return v
#         if not isinstance(v, str):
#             raise ValueError(f"Invalid asset type: {v}")
#         s = v.strip()
#         # direct match by value (case-insensitive)
#         for member in AssetTypeEnum:
#             if s.lower() == member.value.lower():
#                 return member
#         # match by enum name (case-insensitive, allow spacing differences)
#         compact = ''.join(ch for ch in s.lower() if ch.isalnum())
#         for member in AssetTypeEnum:
#             if compact == ''.join(ch for ch in member.name.lower() if ch.isalnum()):
#                 return member
#         # tolerate common variations: e.g. 'network issue', 'Network issue', 'networkissue'
#         for member in AssetTypeEnum:
#             member_compact = ''.join(ch for ch in member.value.lower() if ch.isalnum())
#             if compact == member_compact:
#                 return member
#         raise ValueError(f"Invalid asset type: {v}")
#
#     @field_validator("location", mode="before")
#     def coerce_location(cls, v):
#         if v is None:
#             return v
#         if isinstance(v, LocationEnum):
#             return v
#         if not isinstance(v, str):
#             raise ValueError(f"Invalid location: {v}")
#         s = v.strip()
#         try:
#             return LocationEnum(s)
#         except Exception:
#             pass
#         try:
#             return LocationEnum[s]
#         except Exception:
#             pass
#         ss = s.replace('-', '').replace('_', '').upper()
#         for member in LocationEnum:
#             if ss == member.value.replace('-', '').replace('_', '').upper() or ss == member.name.upper():
#                 return member
#         raise ValueError(f"Invalid location: {v}")
#
#     @field_validator("status", mode="before")
#     def coerce_status(cls, v):
#         if v is None:
#             return v
#         if isinstance(v, StatusEnum):
#             return v
#         if not isinstance(v, str):
#             raise ValueError(f"Invalid status: {v}")
#         s = v.strip()
#         try:
#             return StatusEnum(s)
#         except Exception:
#             pass
#         try:
#             return StatusEnum[s]
#         except Exception:
#             pass
#         ss = ''.join(ch for ch in s.lower() if ch.isalnum())
#         for member in StatusEnum:
#             if ss == ''.join(ch for ch in member.value.lower() if ch.isalnum()) or ss == member.name.lower():
#                 return member
#         raise ValueError(f"Invalid status: {v}")

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    email: Optional[EmailStr] = None
    type: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None  # Accept any string - will be normalized in CRUD
    description: Optional[str] = None

# Output model for responses (updated to match database model)
class AssetOut(BaseModel):
    id: int
    email: str
    type: str
    location: Optional[str] = None
    status: str
    description: Optional[str] = None
    open_date: Optional[datetime] = None
    close_date: Optional[datetime] = None

    class Config:
        from_attributes = True
        populate_by_name = True

# Admin Asset Schemas
class AdminAssetCreate(BaseModel):
    id: int  # Reference to original asset id
    email: str
    type: str
    location: str
    description: Optional[str] = None
    status: str = "Active"
    open_date: Optional[datetime] = None
    close_date: Optional[datetime] = None
    actions: Optional[str] = None

class AdminAssetUpdate(BaseModel):
    email: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    open_date: Optional[datetime] = None
    close_date: Optional[datetime] = None
    actions: Optional[str] = None

class AdminAssetOut(BaseModel):
    admin_asset_id: int
    id: int  # Reference to original asset id
    email: str
    type: str
    location: str
    description: Optional[str] = None
    status: str
    open_date: Optional[datetime] = None
    close_date: Optional[datetime] = None
    actions: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None

    class Config:
        from_attributes = True

class UserProfileBase(BaseModel):
    full_name: str
    email: EmailStr
    mobile_number: Optional[str] = None
    role: str
    department: str
    date_of_birth: Optional[date] = None
    user_status: Optional[str] = "Active"

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile_number: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    date_of_birth: Optional[date] = None
    user_status: Optional[str] = None

class UserProfileResponse(UserProfileBase):
    user_id: int

    class Config:
        from_attributes = True

# Admin Registration Schemas
class AdminCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Ticket Schemas
class TicketCreate(BaseModel):
    user_id: int
    title: str
    description: Optional[str] = None
    status: Optional[str] = "Open"
    priority: Optional[str] = "Medium"
    assignee: Optional[str] = None
    reporter: Optional[str] = None  # Email of user who created/assigned the ticket
    start_date: Optional[date] = None
    due_date: Optional[date] = None

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None
    reporter: Optional[str] = None  # Email of user who created/assigned the ticket
    start_date: Optional[date] = None
    due_date: Optional[date] = None

# Project Schemas
class ProjectCreate(BaseModel):
    name: str
    project_key: str
    project_type: Optional[str] = "Software"
    leads: Optional[str] = None
    team_members: Optional[str] = None  # Comma-separated team member emails
    description: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    project_key: Optional[str] = None
    project_type: Optional[str] = None
    leads: Optional[str] = None
    team_members: Optional[str] = None  # Comma-separated team member emails
    description: Optional[str] = None

class ProjectOut(BaseModel):
    id: int
    name: str
    project_key: str
    project_type: str
    leads: Optional[str] = None
    team_members: Optional[str] = None  # Comma-separated team member emails
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Epic Schemas
class EpicCreate(BaseModel):
    project_id: Optional[int] = None  # Make optional for backward compatibility
    name: str

class EpicOut(BaseModel):
    id: int
    project_id: Optional[int] = None  # Make optional for backward compatibility
    name: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TicketOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    assignee: Optional[str] = None
    reporter: Optional[str] = None  # Email of user who created/assigned the ticket
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# AdminEpic Schemas
class AdminEpicCreate(BaseModel):
    epic_id: int
    project_id: Optional[int] = None
    project_title: Optional[str] = None
    user_name: Optional[str] = None
    name: str

class AdminEpicUpdate(BaseModel):
    project_id: Optional[int] = None
    project_title: Optional[str] = None
    user_name: Optional[str] = None
    name: Optional[str] = None

class AdminEpicOut(BaseModel):
    admin_epic_id: int
    epic_id: int
    project_id: Optional[int] = None
    project_title: Optional[str] = None
    user_name: Optional[str] = None
    name: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# AdminTicket Schemas
class AdminTicketCreate(BaseModel):
    ticket_id: int
    epic_id: Optional[int] = None
    project_id: Optional[int] = None
    project_title: Optional[str] = None
    user_name: Optional[str] = None
    title: str
    description: Optional[str] = None
    status: str = 'Open'
    priority: str = 'Medium'
    assignee: Optional[str] = None
    reporter: Optional[str] = None  # Email of user who created/assigned the ticket
    start_date: Optional[date] = None
    due_date: Optional[date] = None

class AdminTicketUpdate(BaseModel):
    epic_id: Optional[int] = None
    project_id: Optional[int] = None
    project_title: Optional[str] = None
    user_name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None
    reporter: Optional[str] = None  # Email of user who created/assigned the ticket
    start_date: Optional[date] = None
    due_date: Optional[date] = None

class AdminTicketOut(BaseModel):
    admin_ticket_id: int
    ticket_id: int
    epic_id: Optional[int] = None
    project_id: Optional[int] = None
    project_title: Optional[str] = None
    user_name: Optional[str] = None
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    assignee: Optional[str] = None
    reporter: Optional[str] = None  # Email of user who created/assigned the ticket
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# UsersManagement Schemas
class UsersManagementCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: str = 'Developer'
    department: str = 'Engineering'
    active: bool = True
    language: str = 'English'
    mobile_number: Optional[str] = None
    date_format: str = 'YYYY-MM-DD'
    password_reset_needed: bool = False
    profile_file_name: Optional[str] = None
    profile_file_size: Optional[int] = None

class UsersManagementUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    department: Optional[str] = None
    active: Optional[bool] = None
    language: Optional[str] = None
    mobile_number: Optional[str] = None
    date_format: Optional[str] = None
    password_reset_needed: Optional[bool] = None
    profile_file_name: Optional[str] = None
    profile_file_size: Optional[int] = None

class UsersManagementOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role: str
    department: str
    active: bool
    language: str
    mobile_number: Optional[str] = None
    date_format: str
    password_reset_needed: bool
    profile_file_name: Optional[str] = None
    profile_file_size: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# UserProfile Schemas
class UserProfileCreate(BaseModel):
    full_name: str
    email: EmailStr
    mobile_number: Optional[str] = None
    role: str
    department: str
    date_of_birth: Optional[date] = None
    user_status: str = "Active"

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile_number: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    date_of_birth: Optional[date] = None
    user_status: Optional[str] = None

class UserProfileOut(BaseModel):
    user_id: int
    full_name: str
    email: str
    mobile_number: Optional[str] = None
    role: str
    department: str
    date_of_birth: Optional[date] = None
    user_status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True