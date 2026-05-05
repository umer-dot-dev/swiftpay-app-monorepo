-- Migration: Fix transactions type CHECK constraint to include 'recharge'
-- SQLite doesn't support ALTER TABLE DROP CONSTRAINT, so we recreate the table

-- Step 1: Rename existing table
ALTER TABLE transactions RENAME TO transactions_old;

-- Step 2: Create new table with correct CHECK constraint
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    sender_id TEXT,
    receiver_id TEXT,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('transfer', 'receive', 'bill_payment', 'top_up', 'recharge')) NOT NULL,
    status TEXT DEFAULT 'completed',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
);

-- Step 3: Copy data across
INSERT INTO transactions SELECT * FROM transactions_old;

-- Step 4: Drop old table
DROP TABLE transactions_old;
