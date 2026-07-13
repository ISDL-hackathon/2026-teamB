CREATE TABLE IF NOT EXISTS login_sessions (
  user_id INTEGER PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  last_seen TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_login_sessions_last_seen
ON login_sessions(last_seen);
