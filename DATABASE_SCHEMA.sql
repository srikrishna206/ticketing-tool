-- =====================================================
-- FLOWTRACK DATABASE SCHEMA
-- Complete schema for all tables in the system
-- Last Updated: October 2025
-- =====================================================

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- Main users table for user portal authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password reset functionality
CREATE TABLE password_reset (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    otp_code VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- User profile information
CREATE TABLE user_profile (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile_number VARCHAR(20),
    
    -- Role dropdown options
    role VARCHAR(50) CHECK (role IN (
        'Associate Developer',
        'Senior Developer',
        'Administration',
        'HR'
    )) NOT NULL,
    
    -- Department dropdown options
    department VARCHAR(50) CHECK (department IN (
        'HR',
        'Marketing',
        'Front End',
        'Back End',
        'Middle Ware',
        'AI/ML',
        'Flow Track',
        'DevOps',
        'Networking',
        'Testing'
    )) NOT NULL,
    
    date_of_birth DATE,
    
    -- Default status is Active
    user_status VARCHAR(20) DEFAULT 'Active' CHECK (user_status IN ('Active', 'Inactive')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User management table for admin portal
CREATE TABLE users_management (
    id SERIAL PRIMARY KEY,                           -- Auto-increment integer ID
    first_name VARCHAR(100) NOT NULL,                -- User's first name
    last_name VARCHAR(100) NOT NULL,                 -- User's last name
    email VARCHAR(255) UNIQUE NOT NULL,              -- Unique email address
    role VARCHAR(50) NOT NULL DEFAULT 'Developer',   -- Default role
    department VARCHAR(100) NOT NULL DEFAULT 'Engineering', -- Default department
    active BOOLEAN NOT NULL DEFAULT TRUE,            -- Active status
    language VARCHAR(50) NOT NULL DEFAULT 'English', -- Preferred language
    mobile_number VARCHAR(30),                       -- Optional mobile number
    date_format VARCHAR(30) NOT NULL DEFAULT 'YYYY-MM-DD',  -- Date format preference
    password_reset_needed BOOLEAN NOT NULL DEFAULT FALSE,   -- Whether user must reset password
    profile_file_name VARCHAR(255),                  -- Optional profile image file name
    profile_file_size BIGINT,                        -- Optional file size in bytes
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),   -- Created timestamp
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()    -- Last updated timestamp
);

-- Admin registrations table
CREATE TABLE admin_registrations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROJECT MANAGEMENT TABLES
-- =====================================================

-- Projects table for organizing work
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    project_key VARCHAR(50) NOT NULL UNIQUE,
    project_type VARCHAR(100) NOT NULL DEFAULT 'Software',
    leads TEXT,                                       -- Comma-separated list of user emails
    team_members TEXT,                                -- Comma-separated list of team member emails
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Epics within projects
CREATE TABLE epics (
    id SERIAL PRIMARY KEY,
    project_id INTEGER,                               -- Reference to projects table
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets/Issues for tracking work
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Open',
    priority VARCHAR(50) DEFAULT 'Medium',
    assignee VARCHAR(255),                           -- Assigned user email
    reporter VARCHAR(255),                           -- Email of user who created/assigned the ticket
    start_date DATE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ASSET MANAGEMENT TABLES
-- =====================================================

-- Main assets table for user portal
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    email_id VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    
    -- Foreign Key Constraint: email_id references users(email)
    CONSTRAINT fk_email FOREIGN KEY (email_id) REFERENCES users(email) ON DELETE CASCADE,
    
    -- Check constraints for asset_type and location
    CONSTRAINT asset_type_check CHECK (asset_type IN ('Laptop', 'Charger', 'NetworkIssue')),
    CONSTRAINT location_check CHECK (location IN ('WFH', 'WFO'))
);

-- Admin assets table for admin portal asset management
CREATE TABLE admin_assets (
    admin_asset_id SERIAL PRIMARY KEY,
    id INT NOT NULL,  -- Reference to the original asset record
    email_id VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    
    -- Admin actions (e.g., Edit, Delete, Save)
    actions VARCHAR(50) CHECK (actions IN ('Edit', 'Delete', 'Save')),
    
    -- Foreign Key Constraints
    CONSTRAINT fk_asset_id FOREIGN KEY (id) REFERENCES assets(id) ON DELETE CASCADE,
    CONSTRAINT fk_admin_email FOREIGN KEY (email_id) REFERENCES users(email) ON DELETE CASCADE,
    
    -- Reuse same checks for data consistency
    CONSTRAINT admin_asset_type_check CHECK (asset_type IN ('Laptop', 'Charger', 'NetworkIssue')),
    CONSTRAINT admin_location_check CHECK (location IN ('WFH', 'WFO'))
);

-- =====================================================
-- SUMMARY
-- =====================================================
-- Total Tables: 12
-- 
-- User Management: 5 tables
--   - users (authentication for user portal)
--   - password_reset (password recovery)
--   - user_profile (detailed user info for user portal)
--   - users_management (admin user management)
--   - admin_registrations (admin authentication)
--
-- Project Management: 5 tables
--   - projects (project organization)
--   - epics (epic/feature tracking - user portal)
--   - tickets (issue/task tracking - user portal)
--   - admin_epics (admin portal view of all epics)
--   - admin_tickets (admin portal view of all tickets)
--
-- Asset Management: 2 tables
--   - assets (user portal assets)
--   - admin_assets (admin portal asset management)
--
-- =====================================================
-- KEY RELATIONSHIPS
-- =====================================================
-- 
-- users.email <- assets.email_id (FK)
-- users.email <- admin_assets.email_id (FK)
-- users.id <- tickets.user_id (reference, no FK constraint)
-- users.id <- password_reset.user_id (FK)
-- assets.id <- admin_assets.id (FK)
-- projects.id <- epics.project_id (reference, no FK constraint)
-- epics.id <- admin_epics.epic_id (reference, no FK constraint)
-- tickets.id <- admin_tickets.ticket_id (reference, no FK constraint)
--
-- =====================================================
-- DATA FLOW
-- =====================================================
--
-- User Portal Asset Creation:
--   User creates asset -> assets table
--                      -> admin_assets table (can be synced via backend)
--
-- Admin Portal Asset Editing:
--   Admin edits asset -> admin_assets table
--                     -> assets table (bidirectional sync)
--
-- Project Assignment:
--   Admin creates project -> projects table
--   User creates epic -> epics table (linked to project)
--   User creates ticket -> tickets table (linked to user and epic)
--
-- Admin Boards Tracking:
--   User creates epic -> epics table + admin_epics table (with project_title, user_name)
--   User creates ticket -> tickets table + admin_tickets table (with project_title, user_name, reporter)
--   Admin portal fetches from admin_epics and admin_tickets to see ALL projects across all users
--
-- Ticket Assignment Flow:
--   - Assignee: The user to whom the ticket is assigned (task performer)
--   - Reporter: The user who created or assigned the ticket (task creator/assigner)
--
-- =====================================================

-- =====================================================
-- ADMIN BOARDS TABLES (New - for admin portal visibility)
-- =====================================================

-- Admin Epics Table
-- Stores all epics from all users/projects for admin portal
-- Includes project_title and user_name for easy tracking
CREATE TABLE admin_epics (
    admin_epic_id SERIAL PRIMARY KEY,
    epic_id INTEGER NOT NULL,                    -- Reference to epics.id
    project_id INTEGER,                          -- Reference to projects.id
    project_title VARCHAR(200),                  -- Project name for display
    user_name VARCHAR(255),                      -- User who created/owns this epic
    name VARCHAR(100) NOT NULL,                  -- Epic name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Tickets Table
-- Stores all tickets from all users/projects for admin portal
-- Includes project_title and user_name for easy tracking
CREATE TABLE admin_tickets (
    admin_ticket_id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,                  -- Reference to tickets.id
    epic_id INTEGER,                             -- Reference to epic
    project_id INTEGER,                          -- Reference to project
    project_title VARCHAR(200),                  -- Project name for display
    user_name VARCHAR(255),                      -- User who created/owns this ticket
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Open',
    priority VARCHAR(50) DEFAULT 'Medium',
    assignee VARCHAR(255),                       -- Assigned user email
    reporter VARCHAR(255),                       -- Email of user who created/assigned the ticket
    start_date DATE,                             -- Task start date
    due_date DATE,                               -- Task due date
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_admin_epics_epic_id ON admin_epics(epic_id);
CREATE INDEX idx_admin_epics_project_id ON admin_epics(project_id);
CREATE INDEX idx_admin_epics_user_name ON admin_epics(user_name);
CREATE INDEX idx_admin_tickets_ticket_id ON admin_tickets(ticket_id);
CREATE INDEX idx_admin_tickets_epic_id ON admin_tickets(epic_id);
CREATE INDEX idx_admin_tickets_project_id ON admin_tickets(project_id);
CREATE INDEX idx_admin_tickets_user_name ON admin_tickets(user_name);

-- Comments
COMMENT ON TABLE admin_epics IS 'Admin portal view of all epics from all users/projects';
COMMENT ON TABLE admin_tickets IS 'Admin portal view of all tickets from all users/projects';
COMMENT ON COLUMN admin_epics.project_title IS 'Project name for easy display without joins';
COMMENT ON COLUMN admin_epics.user_name IS 'User email who created/owns the epic';
COMMENT ON COLUMN admin_tickets.project_title IS 'Project name for easy display without joins';
COMMENT ON COLUMN admin_tickets.user_name IS 'User email who created/owns the ticket';

-- =====================================================

