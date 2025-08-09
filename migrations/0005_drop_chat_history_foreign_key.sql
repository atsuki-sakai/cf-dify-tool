-- Migration number: 0005 	 2025-08-09T00:00:00.000Z
-- Drop and recreate chat_history table without foreign key constraint
DROP TABLE IF EXISTS chat_history;

CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    customer_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);