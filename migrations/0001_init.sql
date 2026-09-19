CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  preferred_name TEXT NOT NULL DEFAULT '',
  picture TEXT NOT NULL DEFAULT '',
  pregnancy_start_date TEXT,
  next_doctor_visit_date TEXT,
  due_date TEXT,
  weight_at_start_kg REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

CREATE TABLE IF NOT EXISTS mother_weight_logs (
  user_id TEXT NOT NULL,
  logged_on TEXT NOT NULL,
  weight_kg REAL NOT NULL,
  PRIMARY KEY (user_id, logged_on),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS mother_weight_logs_user_idx ON mother_weight_logs (user_id);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions (expires_at);

CREATE TABLE IF NOT EXISTS login_codes (
  code TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favourite_baby_names (
  user_id TEXT NOT NULL,
  name_id TEXT NOT NULL,
  PRIMARY KEY (user_id, name_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
