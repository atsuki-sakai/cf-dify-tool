-- Migration number: 0006 	 2025-08-09T11:05:00.000Z
-- Drop foreign key constraint from reservations table
CREATE TABLE reservations_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    service_name TEXT NOT NULL,
    reservation_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO reservations_new (id, customer_id, customer_name, service_name, reservation_date, status, notes, created_at, updated_at)
SELECT id, customer_id, customer_name, service_name, reservation_date, status, notes, created_at, updated_at
FROM reservations;

DROP TABLE reservations;
ALTER TABLE reservations_new RENAME TO reservations;