-- =============================================================================
-- D1 DATABASE SCHEMA
-- =============================================================================
-- 
-- WHAT IS THIS FILE?
-- This is the SQL schema that creates your database tables.
-- 
-- HOW TO USE:
-- After creating your D1 database, run this schema:
--
--   npx wrangler d1 execute agency-db --file=db/schema.sql --remote
--
-- For local development:
--   npx wrangler d1 execute agency-db --file=db/schema.sql --local
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- USERS TABLE
-- -----------------------------------------------------------------------------
-- Example user table demonstrating common D1 patterns
CREATE TABLE IF NOT EXISTS users (
    -- Primary key: unique identifier for each user
    -- INTEGER PRIMARY KEY in SQLite auto-increments
    id INTEGER PRIMARY KEY,
    
    -- User's email - must be unique, cannot be null
    email TEXT NOT NULL UNIQUE,
    
    -- User's display name
    name TEXT NOT NULL,
    
    -- When the user was created
    -- DEFAULT: current timestamp in UTC
    created_at TEXT DEFAULT (datetime('now')),
    
    -- When the user was last updated
    updated_at TEXT DEFAULT (datetime('now'))
);

-- -----------------------------------------------------------------------------
-- POSTS TABLE
-- -----------------------------------------------------------------------------
-- Example blog posts table with foreign key relationship
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    
    -- Foreign key linking to users table
    user_id INTEGER NOT NULL,
    
    -- Post content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    
    -- Post status (draft, published, archived)
    status TEXT DEFAULT 'draft',
    
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------
-- Indexes speed up queries on frequently searched columns

-- Index for looking up posts by user
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

-- Index for looking up posts by status
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- Index for looking up users by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- SAMPLE DATA (optional - for testing)
-- -----------------------------------------------------------------------------
-- Uncomment these to add test data when running schema

-- INSERT OR IGNORE INTO users (email, name) VALUES 
--     ('alex@example.com', 'Alex'),
--     ('maria@example.com', 'Maria');

-- INSERT OR IGNORE INTO posts (user_id, title, content, status) VALUES 
--     (1, 'Hello World', 'This is my first post!', 'published'),
--     (1, 'Draft Post', 'Still working on this...', 'draft');
