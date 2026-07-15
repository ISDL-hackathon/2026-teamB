CREATE TABLE IF NOT EXISTS battle_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  host_id INTEGER NOT NULL,
  stake_type TEXT NOT NULL,
  stake_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'waiting',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (host_id) REFERENCES users(id)
);

ALTER TABLE battle_matches ADD COLUMN room_id INTEGER REFERENCES battle_rooms(id);
ALTER TABLE battle_matches ADD COLUMN stake_amount INTEGER NOT NULL DEFAULT 0;
ALTER TABLE battle_matches ADD COLUMN points_settled INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_battle_rooms_waiting_host
ON battle_rooms(host_id) WHERE status = 'waiting';

CREATE UNIQUE INDEX IF NOT EXISTS idx_battle_matches_room
ON battle_matches(room_id) WHERE room_id IS NOT NULL;

CREATE TRIGGER IF NOT EXISTS battle_room_validate_before_insert
BEFORE INSERT ON battle_rooms
WHEN (SELECT point FROM users WHERE id = NEW.host_id) < NEW.stake_amount
BEGIN
  SELECT RAISE(ABORT, 'not_enough_point');
END;

CREATE TRIGGER IF NOT EXISTS battle_room_escrow_after_insert
AFTER INSERT ON battle_rooms
BEGIN
  UPDATE users
  SET point = point - NEW.stake_amount,
      total_point = total_point - NEW.stake_amount
  WHERE id = NEW.host_id;
END;

CREATE TRIGGER IF NOT EXISTS battle_room_refund_after_cancel
AFTER UPDATE OF status ON battle_rooms
WHEN OLD.status = 'waiting' AND NEW.status = 'cancelled'
BEGIN
  UPDATE users
  SET point = point + OLD.stake_amount,
      total_point = total_point + OLD.stake_amount
  WHERE id = OLD.host_id;
END;

CREATE TRIGGER IF NOT EXISTS battle_match_validate_room_before_insert
BEFORE INSERT ON battle_matches
WHEN NEW.room_id IS NOT NULL AND (
  (SELECT COUNT(*) FROM battle_rooms WHERE id = NEW.room_id AND status = 'waiting') != 1
  OR (SELECT host_id FROM battle_rooms WHERE id = NEW.room_id) != NEW.player1_id
  OR NEW.player1_id = NEW.player2_id
  OR (SELECT stake_amount FROM battle_rooms WHERE id = NEW.room_id) != NEW.stake_amount
  OR (SELECT point FROM users WHERE id = NEW.player2_id) < NEW.stake_amount
)
BEGIN
  SELECT RAISE(ABORT, 'battle_room_unavailable');
END;

CREATE TRIGGER IF NOT EXISTS battle_match_escrow_after_insert
AFTER INSERT ON battle_matches
WHEN NEW.room_id IS NOT NULL
BEGIN
  UPDATE users
  SET point = point - NEW.stake_amount,
      total_point = total_point - NEW.stake_amount
  WHERE id = NEW.player2_id;
  UPDATE battle_rooms
  SET status = 'started', updated_at = NEW.created_at
  WHERE id = NEW.room_id AND status = 'waiting';
END;

CREATE TRIGGER IF NOT EXISTS battle_reward_after_finish
AFTER UPDATE OF status ON battle_matches
WHEN OLD.status = 'active' AND NEW.status = 'finished'
  AND NEW.winner_id IS NOT NULL AND NEW.points_settled = 0
BEGIN
  UPDATE users
  SET point = point + (NEW.stake_amount * 2),
      total_point = total_point + (NEW.stake_amount * 2)
  WHERE id = NEW.winner_id;
  UPDATE battle_matches SET points_settled = 1 WHERE id = NEW.id;
END;
