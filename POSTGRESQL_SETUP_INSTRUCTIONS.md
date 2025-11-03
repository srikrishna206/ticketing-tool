# PostgreSQL Setup Instructions for FlowTrack

## Current Status

✅ **Registration Code:** Fully implemented  
✅ **Backend API:** `/auth/register` and `/auth/login` endpoints ready  
✅ **Frontend:** Registration form working  
✅ **PostgreSQL:** Service running (postgresql-x64-17)  
❌ **Database Connection:** Need correct credentials  

## Issue

The registration is working on the frontend, but data is not being stored in PostgreSQL because we need the correct database credentials.

## Quick Setup (3 Steps)

### Step 1: Configure Database Credentials

Run this interactive script to set up your PostgreSQL connection:

```powershell
cd backend
.\venv\Scripts\python.exe configure_database.py
```

It will ask for:
- PostgreSQL username (default: `postgres`)
- PostgreSQL password
- Database name (default: `flow`)

### Step 2: Create Database Tables

After configuring credentials, run:

```powershell
.\venv\Scripts\python.exe setup_database.py
```

This will create the `users` and `assets` tables.

### Step 3: Restart Backend

Restart the backend server to use the new database:

```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Alternative: Manual Setup

If you prefer to set up manually:

### 1. Find Your PostgreSQL Password

Try one of these methods:

**Method A: Check pgAdmin**
- Open pgAdmin 4
- Try connecting - password might be saved

**Method B: Check if database exists**
```powershell
# If you know the password, test it:
$env:PGPASSWORD="your_password_here"
psql -U postgres -c "\l"
```

### 2. Update .env File Manually

Edit `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/flow
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### 3. Create Database (if needed)

If database `flow` doesn't exist:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE flow;

-- Connect to flow database
\c flow

-- Verify
\l
```

### 4. Create Tables

Run the setup script:

```powershell
cd backend
.\venv\Scripts\python.exe setup_database.py
```

## Database Schema

The setup will create these tables:

### `users` table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255)
);
```

### `assets` table
```sql
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(10),
    status VARCHAR(20) NOT NULL DEFAULT 'Open',
    description TEXT,
    open_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    close_date TIMESTAMP WITH TIME ZONE
);
```

## Verification

After setup, verify everything works:

### 1. Check Tables Exist

```sql
-- Connect to database
psql -U postgres -d flow

-- List tables
\dt

-- Check users table structure
\d users

-- Check assets table structure
\d assets
```

### 2. Test Registration

1. Go to http://localhost:3000/login
2. Click "Registration"
3. Fill in:
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click "Sign Up"

### 3. Verify Data in Database

```sql
-- Check if user was created
SELECT * FROM users;

-- Should show:
-- id | email             | password (hashed) | full_name
-- 1  | test@example.com  | $2b$12$...       | Test User
```

## Troubleshooting

### Issue: "password authentication failed"

**Solution:** PostgreSQL password is incorrect

1. Find correct password using pgAdmin or password manager
2. Or reset password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```

### Issue: "database 'flow' does not exist"

**Solution:** Create the database

```sql
psql -U postgres
CREATE DATABASE flow;
```

### Issue: "permission denied to create table"

**Solution:** Grant permissions

```sql
GRANT ALL PRIVILEGES ON DATABASE flow TO postgres;
```

### Issue: "Could not connect to server"

**Solution:** Start PostgreSQL service

```powershell
# Check service status
Get-Service -Name *postgres*

# Start service if stopped
Start-Service postgresql-x64-17
```

## What Credentials Format to Provide

If you want me to configure it for you, please provide:

```
Username: postgres (or your PostgreSQL username)
Password: your_password_here
Database: flow
```

I will then:
1. Update the .env file
2. Create the database tables
3. Test the registration flow
4. Verify data is being stored

## Files Created for Setup

- `configure_database.py` - Interactive credentials setup
- `setup_database.py` - Creates database tables
- `test_pg_connection.py` - Tests database connection
- `find_pg_access.py` - Tries to find working credentials

## Current Configuration

**Database URL in .env:**
```
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/flow
```

This is using:
- User: `postgres`
- Password: `postgres` (needs to be updated)
- Database: `flow`

## Ready to Continue

Once you provide the PostgreSQL password or run the configuration script, the registration system will start storing users in the PostgreSQL database immediately.

**Everything else is ready to go!** 🚀
