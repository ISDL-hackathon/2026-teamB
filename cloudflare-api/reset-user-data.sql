DELETE FROM mahjong_events;
DELETE FROM mahjong_players;
DELETE FROM mahjong_rooms;

DELETE FROM battle_moves;
DELETE FROM battle_matches;
DELETE FROM battle_queue;
DELETE FROM battle_rooms;

DELETE FROM bulletin_likes;
DELETE FROM bulletin_follows;
DELETE FROM lunch_quest_members;
DELETE FROM lunch_quest_rooms;
DELETE FROM daily_quest_completions;
DELETE FROM bulletin_posts;

DELETE FROM user_village_positions;
DELETE FROM room_layouts;
DELETE FROM user_furniture;
DELETE FROM user_avatars;
DELETE FROM user_icons;
DELETE FROM login_sessions;
DELETE FROM activities;

DELETE FROM users;

DELETE FROM sqlite_sequence
WHERE name IN (
  'users',
  'activities',
  'bulletin_posts',
  'lunch_quest_rooms',
  'battle_rooms',
  'battle_matches',
  'mahjong_rooms',
  'mahjong_events'
);
