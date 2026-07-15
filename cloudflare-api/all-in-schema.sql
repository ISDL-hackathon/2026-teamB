ALTER TABLE battle_matches ADD COLUMN player2_stake INTEGER NOT NULL DEFAULT 0;

DROP TRIGGER IF EXISTS battle_match_validate_room_before_insert;
DROP TRIGGER IF EXISTS battle_match_escrow_after_insert;
DROP TRIGGER IF EXISTS battle_reward_after_finish;

CREATE TRIGGER battle_match_validate_room_before_insert
BEFORE INSERT ON battle_matches
WHEN NEW.room_id IS NOT NULL AND (
  (SELECT COUNT(*) FROM battle_rooms WHERE id = NEW.room_id AND status = 'waiting') != 1
  OR (SELECT host_id FROM battle_rooms WHERE id = NEW.room_id) != NEW.player1_id
  OR NEW.player1_id = NEW.player2_id
  OR (SELECT stake_amount FROM battle_rooms WHERE id = NEW.room_id) != NEW.stake_amount
  OR NEW.player2_stake != CASE
    WHEN (SELECT stake_type FROM battle_rooms WHERE id = NEW.room_id) = 'all'
      THEN (SELECT point FROM users WHERE id = NEW.player2_id)
    ELSE NEW.stake_amount
  END
  OR NEW.player2_stake <= CASE
    WHEN (SELECT stake_type FROM battle_rooms WHERE id = NEW.room_id) = 'all' THEN 0
    ELSE -1
  END
)
BEGIN
  SELECT RAISE(ABORT, 'battle_room_unavailable');
END;

CREATE TRIGGER battle_match_escrow_after_insert
AFTER INSERT ON battle_matches
WHEN NEW.room_id IS NOT NULL
BEGIN
  UPDATE users
  SET point = point - NEW.player2_stake,
      total_point = total_point - NEW.player2_stake
  WHERE id = NEW.player2_id;
  UPDATE battle_rooms
  SET status = 'started', updated_at = NEW.created_at
  WHERE id = NEW.room_id AND status = 'waiting';
END;

CREATE TRIGGER battle_reward_after_finish
AFTER UPDATE OF status ON battle_matches
WHEN OLD.status = 'active' AND NEW.status = 'finished'
  AND NEW.winner_id IS NOT NULL AND NEW.points_settled = 0
BEGIN
  UPDATE users
  SET point = point + NEW.stake_amount + NEW.player2_stake,
      total_point = total_point + NEW.stake_amount + NEW.player2_stake
  WHERE id = NEW.winner_id;
  UPDATE battle_matches SET points_settled = 1 WHERE id = NEW.id;
END;
