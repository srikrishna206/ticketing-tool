# PostgreSQL Database Setup Guide

## Current Status

✅ **PostgreSQL Service:** Running (postgresql-x64-17)  
❌ **Database Connection:** Failed (incorrect credentials)  
📋 **Required Database Name:** `flow`

## What I Need From You

To complete the registration system setup and store data in PostgreSQL, I need the correct database credentials:

### Option 1: Provide Credentials
Please provide:
1. **PostgreSQL Username** (default is usually `postgres`)
2. **PostgreSQL Password** (the one you set during installation)
3. **Confirm the database name is:** `flow`

### Option 2: Find Your PostgreSQL Password

If you forgot your PostgreSQL password, here are ways to find or reset it:

#### Method 1: Check pgAdmin
1. Open pgAdmin 4 (if installed)
2. Try connecting to the server
3. The password might be saved in pgAdmin

#### Method 2: Check Connection String
Look for PostgreSQL connection strings in:
- Environment variables
- Other project configuration files
- `.pgpass` file in your user directory

#### Method 3: Reset PostgreSQL Password
1. Open Command Prompt as Administrator
2. Run:
   ```cmd
   psql -U postgres
   ```
3. If it asks for password and you don't know it, you'll need to reset it using `pg_hba.conf`

### Option 3: Provide Alternative Access Method

If you have:
- **pgAdmin** installed: You can manually create the tables using the SQL script I'll provide
- **Another tool** (DBeaver, DataGrip, etc.): I can provide SQL scripts
- **Direct database access**: I can guide you through manual setup

## What Happens After You Provide Credentials

Once you provide the correct PostgreSQL credentials, I will:

1. ✅ Update the `.env` file with correct credentials
2. ✅ Create the database tables (`users`, `assets`)
3. ✅ Test the registration system end-to-end
4. ✅ Verify data is being stored in PostgreSQL

## Quick Test

To test if you can connect, try running this in PowerShell (replace `YOUR_PASSWORD`):

```powershell
$env:PGPASSWORD="YOUR_PASSWORD"
psql -U postgres -d flow -c "SELECT version();"
```

If successful, you'll see the PostgreSQL version.

## Database Schema to Be Created

Once connected, I will create these tables:

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

## Next Steps

**Please provide ONE of the following:**

1. ✅ **PostgreSQL Password** for user `postgres`
2. ✅ **Alternative Username/Password** if not using `postgres` user
3. ✅ **Tell me to use a different approach** (like creating tables manually)

Once I have this information, I can complete the setup in minutes!
