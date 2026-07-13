CREATE TABLE IF NOT EXISTS battle_queue (
  user_id INTEGER PRIMARY KEY,
  joined_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS battle_matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player1_id INTEGER NOT NULL,
  player2_id INTEGER NOT NULL,
  player1_life INTEGER NOT NULL DEFAULT 3,
  player2_life INTEGER NOT NULL DEFAULT 3,
  player1_gauge INTEGER NOT NULL DEFAULT 0,
  player2_gauge INTEGER NOT NULL DEFAULT 0,
  attacker_id INTEGER NOT NULL,
  turn INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  winner_id INTEGER,
  last_player1_action TEXT,
  last_player2_action TEXT,
  result_text TEXT NOT NULL DEFAULT '対戦開始！',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (player1_id) REFERENCES users(id),
  FOREIGN KEY (player2_id) REFERENCES users(id),
  FOREIGN KEY (winner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS battle_moves (
  match_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  turn INTEGER NOT NULL,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (match_id, user_id, turn),
  FOREIGN KEY (match_id) REFERENCES battle_matches(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_battle_matches_players_status
ON battle_matches(status, player1_id, player2_id);

CREATE INDEX IF NOT EXISTS idx_battle_moves_match_turn
ON battle_moves(match_id, turn);
