CREATE TABLE IF NOT EXISTS baby_movement_logs (
  user_id TEXT PRIMARY KEY,
  counts_json TEXT NOT NULL CHECK (json_valid(counts_json)),
  saved_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
