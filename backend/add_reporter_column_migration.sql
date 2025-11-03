-- Migration: Add reporter column to tickets and admin_tickets tables
-- Date: 2025-10-28
-- Description: Adds reporter field to track who created/assigned each ticket

-- Add reporter column to tickets table
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS reporter VARCHAR(255);

-- Add reporter column to admin_tickets table
ALTER TABLE admin_tickets 
ADD COLUMN IF NOT EXISTS reporter VARCHAR(255);

-- Optional: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_tickets_reporter ON tickets(reporter);
CREATE INDEX IF NOT EXISTS idx_admin_tickets_reporter ON admin_tickets(reporter);

-- Success message
-- Reporter column added successfully to both tables

