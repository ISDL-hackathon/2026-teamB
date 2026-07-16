const LOGIN_POINT = 10;
const CHECKIN_POINT = 20;
const LOGIN_SESSION_TTL_MS = 60_000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const messages = {
  USER_ALREADY_EXISTS: "このユーザー名はすでに使われています",
  USER_NOT_FOUND: "ユーザーが存在しません",
  WRONG_PASSWORD: "パスワードが違います",
  REGISTERED: "ユーザー登録しました",
  LOGIN_SUCCESS: "ログイン成功",
  POINT_ADDED: "ポイントを加算しました",
  FURNITURE_NOT_FOUND: "家具が見つかりません",
  FURNITURE_ALREADY_OWNED: "この家具は購入済みです",
  NOT_ENOUGH_POINT: "ポイントが足りません",
  FURNITURE_LOCKED: "まだ購入できない家具です",
  PURCHASE_FAILED: "購入できません",
};

const FURNITURE_CATALOG = [
  {
    id: "round_table",
    name: "Round Table",
    price: 50,
    min_level: 1,
    category: "lab",
    surface: "floor",
  },
  {
    id: "office_chair",
    name: "Office Chair",
    price: 35,
    min_level: 1,
    category: "lab",
    surface: "floor",
  },
  {
    id: "bulletin_board",
    name: "Bulletin Board",
    price: 50,
    min_level: 1,
    category: "lab",
    surface: "wall",
  },
  {
    id: "game_cabinet",
    name: "Game Cabinet",
    price: 100,
    min_level: 2,
    category: "lab",
    surface: "floor",
  },
  {
    id: "window",
    name: "Window",
    price: 30,
    min_level: 2,
    category: "western",
    surface: "wall",
  },
  {
    id: "clock",
    name: "Clock",
    price: 30,
    min_level: 2,
    category: "western",
    surface: "wall",
  },
  {
    id: "stove",
    name: "Stove",
    price: 50,
    min_level: 2,
    category: "western",
    surface: "wall",
  },
  {
    id: "bookshelf",
    name: "Bookshelf",
    price: 80,
    min_level: 3,
    category: "western",
    surface: "floor",
  },
  {
    id: "shelf",
    name: "Shelf",
    price: 100,
    min_level: 4,
    category: "western",
    surface: "floor",
  },
  {
    id: "bed",
    name: "Bed",
    price: 150,
    min_level: 5,
    category: "western",
    surface: "floor",
  },
  {
  id: "retro_tv",
  name: "Retro TV",
  price: 80,
  min_level: 2,
  category: "western",
  surface: "floor",
},
];

const VILLAGE_LEVELS = [
  [2000, 5, "ISDL研究都市", "研究室全体が活発に動いています。みんなの活動で街が大きく発展しました。"],
  [1000, 4, "にぎやかな研究室", "人が集まり、研究や交流も活発になってきました。"],
  [500, 3, "活動中の研究室", "研究室に人が集まり始め、設備も少しずつ充実してきました。"],
  [100, 2, "少し明るい研究室", "少しずつ人が来るようになり、研究室に活気が出てきました。"],
  [0, 1, "静かな研究室", "まだ人が少なく、研究室は少し寂しい状態です。"],
];

const WEATHER_BY_ACTIVE_USERS = [
  [8, "快晴"],
  [6, "晴れ"],
  [4, "曇り"],
  [2, "雨"],
  [0, "雷雨"],
];

const ROOM_LEVELS = [
  [600, 5, "研究室の主ルーム", "研究も交流も楽しめる、かなり豪華な個人ルームです。"],
  [300, 4, "快適作業ルーム", "作業環境が整い、集中しやすい部屋になってきました。"],
  [150, 3, "研究セット部屋", "本とPCが増えて、研究できる雰囲気が出てきました。"],
  [50, 2, "机と椅子の部屋", "最低限の作業スペースができました。"],
  [0, 1, "何もない部屋", "まだ何もない部屋です。研究室に来てポイントを集めましょう。"],
];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function nowJstIso() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19);
}

function todayJstPrefix() {
  return `${new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)}%`;
}

function toBase64(bytes) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = toBase64(saltBytes);
  const iterations = 100000;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations,
      hash: "SHA-256",
    },
    key,
    256,
  );

  const hash = toBase64(new Uint8Array(bits));
  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

async function verifyPassword(password, storedHash) {
  const parts = storedHash.split("$");

  if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256") {
    return false;
  }

  const [, iterationsText, salt, expectedHash] = parts;
  const iterations = Number(iterationsText);
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations,
      hash: "SHA-256",
    },
    key,
    256,
  );

  const actualHash = toBase64(new Uint8Array(bits));
  return actualHash === expectedHash;
}

function getRoomLevelFromPoint(point) {
  const matchedLevel = ROOM_LEVELS.find(
    ([threshold]) => Number(point) >= Number(threshold),
  );
  return Number(matchedLevel?.[1] ?? 1);
}

async function getUserByName(env, name) {
  return await env.DB.prepare(
    `
    SELECT id, name, grade, password_hash, point, total_point
    FROM users
    WHERE name = ?
    `,
  )
    .bind(name)
    .first();
}

async function getUserById(env, userId) {
  return await env.DB.prepare(
    `
    SELECT id, name, grade, point, total_point
    FROM users
    WHERE id = ?
    `,
  )
    .bind(userId)
    .first();
}

async function getUserVillageSlotId(env, userId) {
  const row = await env.DB.prepare(
    `
    SELECT slot_id
    FROM user_village_positions
    WHERE user_id = ?
    `,
  )
    .bind(userId)
    .first();

  return row ? row.slot_id : null;
}

async function addActivity(env, userId, activityType, point) {
  await env.DB.prepare(
    `
    INSERT INTO activities (user_id, activity_type, point, created_at)
    VALUES (?, ?, ?, ?)
    `,
  )
    .bind(userId, activityType, point, nowJstIso())
    .run();

  await env.DB.prepare(
    `
    UPDATE users
    SET point = point + ?,
        total_point = total_point + ?
    WHERE id = ?
    `,
  )
    .bind(point, point, userId)
    .run();
}

async function addLoginPointIfFirstToday(env, userId) {
  const row = await env.DB.prepare(
    `
    SELECT COUNT(*) AS count
    FROM activities
    WHERE user_id = ?
      AND activity_type = 'login'
      AND created_at LIKE ?
    `,
  )
    .bind(userId, todayJstPrefix())
    .first();

  if (row && row.count > 0) {
    return 0;
  }

  await addActivity(env, userId, "login", LOGIN_POINT);
  return LOGIN_POINT;
}

async function getRoomLayout(env, userId) {
  const row = await env.DB.prepare(
    `
    SELECT layout_json
    FROM room_layouts
    WHERE user_id = ?
    `,
  )
    .bind(userId)
    .first();

  if (!row) {
    return [];
  }

  try {
    return JSON.parse(row.layout_json);
  } catch {
    return [];
  }
}

async function getRoomTheme(env, userId) {
  const row = await env.DB.prepare(
    `
    SELECT theme_json
    FROM room_layouts
    WHERE user_id = ?
    `,
  )
    .bind(userId)
    .first();

  if (!row) {
    return {};
  }

  try {
    return JSON.parse(row.theme_json);
  } catch {
    return {};
  }
}

async function getOwnedFurnitureIds(env, userId) {
  const result = await env.DB.prepare(
    `
    SELECT furniture_id
    FROM user_furniture
    WHERE user_id = ?
    `,
  )
    .bind(userId)
    .all();

  const ownedIds = new Set(result.results.map((row) => row.furniture_id));

  const layout = await getRoomLayout(env, userId);
  for (const item of layout) {
    const furnitureId = item?.id;
    if (furnitureId && furnitureId !== "chara") {
      ownedIds.add(furnitureId);
    }
  }

  return Array.from(ownedIds).sort();
}

async function getFurnitureShopItems(env, userId, roomLevel) {
  const ownedIds = new Set(await getOwnedFurnitureIds(env, userId));

  return FURNITURE_CATALOG.map((item) => ({
    ...item,
    owned: ownedIds.has(item.id),
    unlocked: roomLevel >= item.min_level,
  }));
}

async function getRoomStatus(env, userId) {
  const user = await getUserById(env, userId);

  if (!user) {
    return null;
  }

  const point = user.total_point;
  const [, roomLevel, roomName, roomDescription] = ROOM_LEVELS.find(
    ([threshold]) => point >= threshold,
  );

  return {
    user,
    room_level: roomLevel,
    room_name: roomName,
    room_description: roomDescription,
    room_layout: await getRoomLayout(env, userId),
    room_theme: await getRoomTheme(env, userId),
    owned_furniture: await getOwnedFurnitureIds(env, userId),
    shop_items: await getFurnitureShopItems(env, userId, roomLevel),
  };
}

async function getVillageStatus(env) {
  const totalRow = await env.DB.prepare(
    `
    SELECT COALESCE(SUM(total_point), 0) AS total_point
    FROM users
    `,
  ).first();

  const activeRow = await env.DB.prepare(
    `
    SELECT COUNT(DISTINCT user_id) AS active_users
    FROM activities
    WHERE created_at LIKE ?
    `,
  )
    .bind(todayJstPrefix())
    .first();

  const totalPoint = totalRow.total_point;
  const activeUsers = activeRow.active_users;

  const [, level, title, description] = VILLAGE_LEVELS.find(
    ([threshold]) => totalPoint >= threshold,
  );

  const [, weather] = WEATHER_BY_ACTIVE_USERS.find(
    ([threshold]) => activeUsers >= threshold,
  );

  return {
    total_point: totalPoint,
    level,
    title,
    description,
    active_users: activeUsers,
    weather,
  };
}

async function getVillageSlots(env) {
  const result = await env.DB.prepare(
    `
    SELECT
      vs.id,
      vs.col,
      vs.row,
      vs.col_span,
      vs.row_span,
      vs.label,
      vs.is_active,
      vs.sort_order,
      u.id AS user_id,
      u.name AS user_name,
      u.grade AS user_grade
    FROM village_slots AS vs
    LEFT JOIN user_village_positions AS uvp
      ON uvp.slot_id = vs.id
    LEFT JOIN users AS u
      ON u.id = uvp.user_id
    WHERE vs.is_active = 1
    ORDER BY vs.sort_order, vs.id
    `,
  ).all();

  return result.results.map((row) => {
    const user =
      row.user_id !== null
        ? {
            id: row.user_id,
            name: row.user_name,
            grade: row.user_grade,
          }
        : null;

    return {
      id: row.id,
      col: row.col,
      row: row.row,
      col_span: row.col_span,
      row_span: row.row_span,
      label: row.label,
      occupied: user !== null,
      user,
    };
  });
}

async function saveUserVillagePosition(env, userId, slotId) {
  const user = await env.DB.prepare(
    `
    SELECT id
    FROM users
    WHERE id = ?
    `,
  )
    .bind(userId)
    .first();

  if (!user) {
    return { ok: false, reason: "user_not_found" };
  }

  const slot = await env.DB.prepare(
    `
    SELECT id
    FROM village_slots
    WHERE id = ?
      AND is_active = 1
    `,
  )
    .bind(slotId)
    .first();

  if (!slot) {
    return { ok: false, reason: "slot_not_found" };
  }

  const occupied = await env.DB.prepare(
    `
    SELECT user_id
    FROM user_village_positions
    WHERE slot_id = ?
    `,
  )
    .bind(slotId)
    .first();

  if (occupied && occupied.user_id !== userId) {
    return { ok: false, reason: "slot_taken" };
  }

  try {
    const now = nowJstIso();

    await env.DB.prepare(
      `
      INSERT INTO user_village_positions (
        user_id,
        slot_id,
        selected_at,
        updated_at
      )
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        slot_id = excluded.slot_id,
        updated_at = excluded.updated_at
      `,
    )
      .bind(userId, slotId, now, now)
      .run();

    return {
      ok: true,
      user_id: userId,
      slot_id: slotId,
    };
  } catch {
    return { ok: false, reason: "slot_taken" };
  }
}

async function purchaseFurniture(env, userId, furnitureId) {
  const item = FURNITURE_CATALOG.find(
    (catalogItem) => catalogItem.id === furnitureId,
  );

  if (!item) {
    return { ok: false, reason: "not_found" };
  }

  const user = await env.DB.prepare(
    `
    SELECT id, name, grade, point, total_point
    FROM users
    WHERE id = ?
    `,
  )
    .bind(userId)
    .first();

  if (!user) {
    return { ok: false, reason: "user_not_found" };
  }

  const owned = await env.DB.prepare(
    `
    SELECT 1
    FROM user_furniture
    WHERE user_id = ?
      AND furniture_id = ?
    `,
  )
    .bind(userId, furnitureId)
    .first();

  if (owned) {
    return { ok: false, reason: "already_owned" };
  }

  if (user.point < item.price) {
    return { ok: false, reason: "not_enough_point" };
  }

  if (getRoomLevelFromPoint(user.total_point) < item.min_level) {
    return { ok: false, reason: "locked" };
  }

  await env.DB.prepare(
    `
    UPDATE users
    SET point = point - ?
    WHERE id = ?
    `,
  )
    .bind(item.price, userId)
    .run();

  await env.DB.prepare(
    `
    INSERT INTO user_furniture (user_id, furniture_id, purchased_at)
    VALUES (?, ?, ?)
    `,
  )
    .bind(userId, furnitureId, nowJstIso())
    .run();

  return {
    ok: true,
    item,
    user: await getUserById(env, userId),
    owned_furniture: await getOwnedFurnitureIds(env, userId),
  };
}

async function saveRoomLayout(env, userId, items, theme = {}) {
  const layoutJson = JSON.stringify(items);
  const themeJson = JSON.stringify(theme || {});

  await env.DB.prepare(
    `
    INSERT INTO room_layouts (user_id, layout_json, theme_json, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      layout_json = excluded.layout_json,
      theme_json = excluded.theme_json,
      updated_at = excluded.updated_at
    `,
  )
    .bind(userId, layoutJson, themeJson, nowJstIso())
    .run();

  return {
    room_layout: await getRoomLayout(env, userId),
    room_theme: await getRoomTheme(env, userId),
  };
}

const BATTLE_MAX_LIFE = 3;
const BATTLE_MAX_GAUGE = 5;
const BATTLE_ACTION_TIME_LIMIT_MS = 15_000;
const BATTLE_STAKES = { free: 0, 10: 10, 50: 50 };

function resolveBattleAttack(attack, defense) {
  if (attack === "charge") return { damage: 0, text: "攻撃側は力をためた！" };
  if (attack === "critical") {
    return defense === "critical_guard"
      ? { damage: 0, text: "クリティカル防御成功！必殺技を防いだ！" }
      : { damage: 99, text: "クリティカルヒット！一撃必殺！" };
  }
  const avoided = (attack === "high" && defense === "crouch") ||
    (attack === "low" && defense === "jump");
  if (avoided) return { damage: 0, text: "防御成功！攻撃をかわした！" };
  if (defense === "critical_guard") {
    return { damage: 2, text: "クリティカル防御失敗！2ダメージ！" };
  }
  return { damage: 1, text: "攻撃命中！1ダメージ！" };
}

async function createLoginSession(env, userId) {
  const cutoff = new Date(Date.now() - LOGIN_SESSION_TTL_MS).toISOString();
  await env.DB.prepare("DELETE FROM login_sessions WHERE last_seen < ?")
    .bind(cutoff).run();

  const existing = await env.DB.prepare(
    "SELECT 1 FROM login_sessions WHERE user_id = ?",
  ).bind(userId).first();
  if (existing) return null;

  const sessionToken = crypto.randomUUID();
  const now = new Date().toISOString();
  try {
    await env.DB.prepare(`
      INSERT INTO login_sessions (user_id, session_token, last_seen, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(userId, sessionToken, now, now).run();
    return sessionToken;
  } catch {
    return null;
  }
}

async function heartbeatLoginSession(env, userId, sessionToken) {
  const result = await env.DB.prepare(`
    UPDATE login_sessions SET last_seen = ?
    WHERE user_id = ? AND session_token = ?
  `).bind(new Date().toISOString(), userId, sessionToken).run();
  return Number(result.meta?.changes || 0) > 0;
}

async function endLoginSession(env, userId, sessionToken) {
  await env.DB.prepare(`
    DELETE FROM login_sessions WHERE user_id = ? AND session_token = ?
  `).bind(userId, sessionToken).run();
}

async function getBattleMatch(env, matchId) {
  return env.DB.prepare(`
    SELECT m.*,
      p1.name AS player1_name, p2.name AS player2_name,
      p1.point AS player1_point, p2.point AS player2_point,
      p1.total_point AS player1_total_point,
      p2.total_point AS player2_total_point
    FROM battle_matches m
    JOIN users p1 ON p1.id = m.player1_id
    JOIN users p2 ON p2.id = m.player2_id
    WHERE m.id = ?
  `).bind(matchId).first();
}

async function getActiveBattleForUser(env, userId) {
  return env.DB.prepare(`
    SELECT id
    FROM battle_matches
    WHERE status = 'active' AND (player1_id = ? OR player2_id = ?)
    ORDER BY id DESC LIMIT 1
  `).bind(userId, userId).first();
}

async function battleSnapshot(env, matchId, userId) {
  const match = await getBattleMatch(env, matchId);
  if (!match || (match.player1_id !== userId && match.player2_id !== userId)) return null;

  const isPlayer1 = match.player1_id === userId;
  const moves = await env.DB.prepare(`
    SELECT user_id, action FROM battle_moves WHERE match_id = ? AND turn = ?
  `).bind(match.id, match.turn).all();
  const submittedIds = new Set((moves.results || []).map((move) => move.user_id));

  return {
    id: match.id,
    turn: match.turn,
    status: match.status,
    winner_id: match.winner_id,
    result_text: match.result_text,
    last_my_action: isPlayer1 ? match.last_player1_action : match.last_player2_action,
    last_opponent_action: isPlayer1 ? match.last_player2_action : match.last_player1_action,
    my_role: match.attacker_id === userId ? "attack" : "defense",
    my_life: isPlayer1 ? match.player1_life : match.player2_life,
    my_gauge: isPlayer1 ? match.player1_gauge : match.player2_gauge,
    opponent: {
      id: isPlayer1 ? match.player2_id : match.player1_id,
      name: isPlayer1 ? match.player2_name : match.player1_name,
      life: isPlayer1 ? match.player2_life : match.player1_life,
      gauge: isPlayer1 ? match.player2_gauge : match.player1_gauge,
    },
    my_submitted: submittedIds.has(userId),
    opponent_submitted: submittedIds.has(isPlayer1 ? match.player2_id : match.player1_id),
    stake_amount: match.stake_amount || 0,
    my_stake: isPlayer1 ? (match.stake_amount || 0) : (match.player2_stake || 0),
    opponent_stake: isPlayer1 ? (match.player2_stake || 0) : (match.stake_amount || 0),
    pot_amount: (match.stake_amount || 0) + (match.player2_stake || 0),
    points_settled: Boolean(match.points_settled),
    my_point: isPlayer1 ? match.player1_point : match.player2_point,
    my_total_point: isPlayer1 ? match.player1_total_point : match.player2_total_point,
    selection_deadline: new Date(
      Date.parse(match.updated_at) + BATTLE_ACTION_TIME_LIMIT_MS,
    ).toISOString(),
  };
}

async function listBattleRooms(env, userId) {
  const user = await getUserById(env, userId);
  if (!user) return null;
  const active = await getActiveBattleForUser(env, userId);
  const roomsResult = await env.DB.prepare(`
    SELECT r.id, r.host_id, u.name AS host_name, r.stake_type,
      r.stake_amount, r.created_at
    FROM battle_rooms r
    JOIN users u ON u.id = r.host_id
    WHERE r.status = 'waiting'
    ORDER BY r.created_at ASC, r.id ASC
  `).all();
  const rooms = roomsResult.results || [];
  return {
    rooms,
    own_room: rooms.find((room) => room.host_id === userId) || null,
    active_match: active ? await battleSnapshot(env, active.id, userId) : null,
    my_point: user.point,
    my_total_point: user.total_point,
  };
}

async function createBattleRoom(env, userId, stakeType) {
  if (![...Object.keys(BATTLE_STAKES), "all"].includes(stakeType)) {
    return { error: "賭けポイントが不正です", status: 400 };
  }
  const user = await getUserById(env, userId);
  if (!user) return { error: "ユーザーが存在しません", status: 404 };
  if (await getActiveBattleForUser(env, userId)) {
    return { error: "対戦中は部屋を作れません", status: 409 };
  }
  const ownRoom = await env.DB.prepare(
    "SELECT id FROM battle_rooms WHERE host_id = ? AND status = 'waiting'",
  ).bind(userId).first();
  if (ownRoom) return { error: "すでに部屋を作っています", status: 409 };

  const stakeAmount = stakeType === "all" ? user.point : BATTLE_STAKES[stakeType];
  if (stakeType === "all" && stakeAmount <= 0) {
    return { error: "全額勝負に使えるポイントがありません", status: 400 };
  }
  if (user.point < stakeAmount) return { error: "ポイントが足りません", status: 400 };

  const now = new Date().toISOString();
  try {
    const result = await env.DB.prepare(`
      INSERT INTO battle_rooms (host_id, stake_type, stake_amount, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(userId, stakeType, stakeAmount, now, now).run();
    return { room_id: result.meta.last_row_id, stake_amount: stakeAmount };
  } catch {
    return { error: "部屋を作成できませんでした", status: 409 };
  }
}

async function joinBattleRoom(env, roomId, userId) {
  const room = await env.DB.prepare(`
    SELECT id, host_id, stake_type, stake_amount, status FROM battle_rooms WHERE id = ?
  `).bind(roomId).first();
  if (!room || room.status !== "waiting") {
    return { error: "この部屋には参加できません", status: 409 };
  }
  if (room.host_id === userId) return { error: "自分の部屋には参加できません", status: 400 };
  const user = await getUserById(env, userId);
  if (!user) return { error: "ユーザーが存在しません", status: 404 };
  const player2Stake = room.stake_type === "all" ? user.point : room.stake_amount;
  if (room.stake_type === "all" && player2Stake <= 0) {
    return { error: "全額勝負に使えるポイントがありません", status: 400 };
  }
  if (user.point < player2Stake) {
    return { error: "この部屋に必要なポイントが足りません", status: 400 };
  }
  if (await getActiveBattleForUser(env, userId)) {
    return { error: "すでに対戦中です", status: 409 };
  }

  const now = new Date().toISOString();
  try {
    const result = await env.DB.prepare(`
      INSERT INTO battle_matches (
        room_id, player1_id, player2_id, attacker_id,
        stake_amount, player2_stake, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      room.id, room.host_id, userId, room.host_id,
      room.stake_amount, player2Stake, now, now,
    ).run();
    return { match: await battleSnapshot(env, result.meta.last_row_id, userId) };
  } catch {
    return { error: "ほかのユーザーが先に参加しました", status: 409 };
  }
}

async function cancelBattleRoom(env, roomId, userId) {
  const result = await env.DB.prepare(`
    UPDATE battle_rooms SET status = 'cancelled', updated_at = ?
    WHERE id = ? AND host_id = ? AND status = 'waiting'
  `).bind(new Date().toISOString(), roomId, userId).run();
  return Number(result.meta?.changes || 0) > 0;
}

async function autoChargeExpiredBattleTurn(env, matchId) {
  const match = await getBattleMatch(env, matchId);
  if (!match || match.status !== "active") return;
  if (Date.now() < Date.parse(match.updated_at) + BATTLE_ACTION_TIME_LIMIT_MS) return;

  const moves = await env.DB.prepare(`
    SELECT user_id FROM battle_moves WHERE match_id = ? AND turn = ?
  `).bind(match.id, match.turn).all();
  const submittedIds = new Set((moves.results || []).map((move) => move.user_id));
  const missingUserIds = [match.player1_id, match.player2_id]
    .filter((userId) => !submittedIds.has(userId));

  for (const missingUserId of missingUserIds) {
    await submitBattleMove(env, match.id, missingUserId, "charge");
  }
}

async function matchmakeBattle(env, userId) {
  const user = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (!user) return { error: "ユーザーが存在しません", status: 404 };

  const active = await getActiveBattleForUser(env, userId);
  if (active) return { match: await battleSnapshot(env, active.id, userId) };

  const queued = await env.DB.prepare("SELECT user_id FROM battle_queue WHERE user_id = ?")
    .bind(userId).first();
  if (!queued) {
    await env.DB.prepare("INSERT INTO battle_queue (user_id, joined_at) VALUES (?, ?)")
      .bind(userId, new Date().toISOString()).run();
  }

  const opponent = await env.DB.prepare(`
    SELECT q.user_id
    FROM battle_queue q
    WHERE q.user_id != ?
      AND NOT EXISTS (
        SELECT 1 FROM battle_matches m
        WHERE m.status = 'active' AND (m.player1_id = q.user_id OR m.player2_id = q.user_id)
      )
    ORDER BY q.joined_at ASC LIMIT 1
  `).bind(userId).first();

  if (!opponent) return { waiting: true };

  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM battle_queue WHERE user_id IN (?, ?)").bind(userId, opponent.user_id),
    env.DB.prepare(`
      INSERT INTO battle_matches (
        player1_id, player2_id, attacker_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?)
    `).bind(opponent.user_id, userId, opponent.user_id, now, now),
  ]);

  const match = await getActiveBattleForUser(env, userId);
  return { match: await battleSnapshot(env, match.id, userId) };
}

async function submitBattleMove(env, matchId, userId, action) {
  const match = await getBattleMatch(env, matchId);
  if (!match || match.status !== "active") return { error: "対戦が見つかりません", status: 404 };
  if (match.player1_id !== userId && match.player2_id !== userId) {
    return { error: "この対戦には参加していません", status: 403 };
  }

  const isAttacker = match.attacker_id === userId;
  const allowed = isAttacker
    ? ["charge", "high", "low", "critical"]
    : ["charge", "jump", "crouch", "critical_guard"];
  if (!allowed.includes(action)) return { error: "選択できない行動です", status: 400 };

  const isPlayer1 = match.player1_id === userId;
  const gauge = isPlayer1 ? match.player1_gauge : match.player2_gauge;
  if (action === "critical" && gauge < 3) return { error: "ゲージが足りません", status: 400 };
  if (action === "critical_guard" && gauge < 2) return { error: "ゲージが足りません", status: 400 };

  try {
    await env.DB.prepare(`
      INSERT INTO battle_moves (match_id, user_id, turn, action, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(match.id, userId, match.turn, action, new Date().toISOString()).run();
  } catch {
    return { match: await battleSnapshot(env, match.id, userId) };
  }

  const moves = await env.DB.prepare(`
    SELECT user_id, action FROM battle_moves WHERE match_id = ? AND turn = ?
  `).bind(match.id, match.turn).all();
  if ((moves.results || []).length < 2) {
    return { match: await battleSnapshot(env, match.id, userId) };
  }

  const moveMap = new Map(moves.results.map((move) => [move.user_id, move.action]));
  const p1Action = moveMap.get(match.player1_id);
  const p2Action = moveMap.get(match.player2_id);
  const attackAction = moveMap.get(match.attacker_id);
  const defenderId = match.attacker_id === match.player1_id ? match.player2_id : match.player1_id;
  const defenseAction = moveMap.get(defenderId);
  const result = resolveBattleAttack(attackAction, defenseAction);

  let p1Life = match.player1_life;
  let p2Life = match.player2_life;
  let p1Gauge = match.player1_gauge;
  let p2Gauge = match.player2_gauge;

  const applyGauge = (currentGauge, selectedAction) => {
    if (selectedAction === "charge") return Math.min(BATTLE_MAX_GAUGE, currentGauge + 1);
    if (selectedAction === "critical") return currentGauge - 3;
    if (selectedAction === "critical_guard") return currentGauge - 2;
    return currentGauge;
  };
  p1Gauge = applyGauge(p1Gauge, p1Action);
  p2Gauge = applyGauge(p2Gauge, p2Action);

  if (defenderId === match.player1_id) {
    p1Life = result.damage >= 99 ? 0 : Math.max(0, p1Life - result.damage);
  } else {
    p2Life = result.damage >= 99 ? 0 : Math.max(0, p2Life - result.damage);
  }

  const winnerId = p1Life <= 0 ? match.player2_id : p2Life <= 0 ? match.player1_id : null;
  const nextStatus = winnerId ? "finished" : "active";
  await env.DB.prepare(`
    UPDATE battle_matches SET
      player1_life = ?, player2_life = ?,
      player1_gauge = ?, player2_gauge = ?,
      attacker_id = ?, turn = ?, status = ?, winner_id = ?,
      last_player1_action = ?, last_player2_action = ?, result_text = ?, updated_at = ?
    WHERE id = ? AND turn = ?
  `).bind(
    p1Life, p2Life, p1Gauge, p2Gauge,
    defenderId, match.turn + 1, nextStatus, winnerId,
    p1Action, p2Action, result.text, new Date().toISOString(),
    match.id, match.turn,
  ).run();

  return { match: await battleSnapshot(env, match.id, userId) };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (path === "/") {
      return json({ message: "Cloudflare Worker API is running" });
    }

    if (path === "/battle/matchmake" && request.method === "POST") {
      const body = await readJson(request);
      const userId = Number(body?.user_id);
      if (!userId) return json({ detail: "ユーザーIDが必要です" }, 400);
      const result = await matchmakeBattle(env, userId);
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    if (path === "/battle/rooms" && request.method === "GET") {
      const userId = Number(url.searchParams.get("user_id"));
      const result = await listBattleRooms(env, userId);
      if (!result) return json({ detail: messages.USER_NOT_FOUND }, 404);
      return json(result);
    }

    if (path === "/battle/rooms" && request.method === "POST") {
      const body = await readJson(request);
      const result = await createBattleRoom(env, Number(body?.user_id), body?.stake_type);
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const battleRoomJoin = path.match(/^\/battle\/rooms\/(\d+)\/join$/);
    if (battleRoomJoin && request.method === "POST") {
      const body = await readJson(request);
      const result = await joinBattleRoom(
        env, Number(battleRoomJoin[1]), Number(body?.user_id),
      );
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const battleRoomCancel = path.match(/^\/battle\/rooms\/(\d+)\/cancel$/);
    if (battleRoomCancel && request.method === "POST") {
      const body = await readJson(request);
      const cancelled = await cancelBattleRoom(
        env, Number(battleRoomCancel[1]), Number(body?.user_id),
      );
      if (!cancelled) return json({ detail: "この部屋はキャンセルできません" }, 409);
      return json({ ok: true });
    }

    if (path === "/battle/cancel" && request.method === "POST") {
      const body = await readJson(request);
      const userId = Number(body?.user_id);
      if (!userId) return json({ detail: "ユーザーIDが必要です" }, 400);
      await env.DB.prepare("DELETE FROM battle_queue WHERE user_id = ?").bind(userId).run();
      return json({ ok: true });
    }

    if (path === "/battle/forfeit" && request.method === "POST") {
      const body = await readJson(request);
      const userId = Number(body?.user_id);
      const matchId = Number(body?.match_id);
      const match = await getBattleMatch(env, matchId);
      if (!match || (match.player1_id !== userId && match.player2_id !== userId)) {
        return json({ detail: "対戦が見つかりません" }, 404);
      }
      if (match.status === "active") {
        const winnerId = match.player1_id === userId ? match.player2_id : match.player1_id;
        await env.DB.prepare(`
          UPDATE battle_matches
          SET status = 'finished', winner_id = ?, result_text = '相手が退出しました', updated_at = ?
          WHERE id = ? AND status = 'active'
        `).bind(winnerId, new Date().toISOString(), matchId).run();
      }
      return json({ ok: true });
    }

    const battleMatch = path.match(/^\/battle\/match\/(\d+)$/);
    if (battleMatch && request.method === "GET") {
      const userId = Number(url.searchParams.get("user_id"));
      const matchId = Number(battleMatch[1]);
      await autoChargeExpiredBattleTurn(env, matchId);
      const match = await battleSnapshot(env, matchId, userId);
      if (!match) return json({ detail: "対戦が見つかりません" }, 404);
      return json({ match });
    }

    if (path === "/battle/move" && request.method === "POST") {
      const body = await readJson(request);
      const result = await submitBattleMove(
        env,
        Number(body?.match_id),
        Number(body?.user_id),
        body?.action,
      );
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    if (path === "/register" && request.method === "POST") {
      const body = await readJson(request);

      if (!body?.name || !body?.grade || !body?.password) {
        return json({ detail: "入力内容が不足しています" }, 400);
      }

      if (await getUserByName(env, body.name)) {
        return json({ detail: messages.USER_ALREADY_EXISTS }, 400);
      }

      const passwordHash = await hashPassword(body.password);

      await env.DB.prepare(
        `
        INSERT INTO users (name, grade, password_hash, point, total_point)
        VALUES (?, ?, ?, 0, 0)
        `,
      )
        .bind(body.name, body.grade, passwordHash)
        .run();

      const user = await getUserByName(env, body.name);

      return json({
        message: messages.REGISTERED,
        user: {
          id: user.id,
          name: user.name,
          grade: user.grade,
          point: user.point,
          total_point: user.total_point,
        },
      });
    }

    if (path === "/login" && request.method === "POST") {
      const body = await readJson(request);

      if (!body?.name || !body?.password) {
        return json({ detail: "名前とパスワードを入力してください" }, 400);
      }

      const user = await getUserByName(env, body.name);

      if (!user) {
        return json({ detail: messages.USER_NOT_FOUND }, 401);
      }

      if (!(await verifyPassword(body.password, user.password_hash))) {
        return json({ detail: messages.WRONG_PASSWORD }, 401);
      }

      const sessionToken = await createLoginSession(env, user.id);
      if (!sessionToken) {
        return json({ detail: "このアカウントは別の端末でログイン中です" }, 409);
      }

      const addedPoint = await addLoginPointIfFirstToday(env, user.id);

      return json({
        message: messages.LOGIN_SUCCESS,
        added_point: addedPoint,
        user: {
          id: user.id,
          name: user.name,
          grade: user.grade,
          point: user.point + addedPoint,
          total_point: user.total_point + addedPoint,
          village_slot_id: await getUserVillageSlotId(env, user.id),
          session_token: sessionToken,
        },
      });
    }

    if (path === "/session/heartbeat" && request.method === "POST") {
      const body = await readJson(request);
      const active = await heartbeatLoginSession(
        env,
        Number(body?.user_id),
        body?.session_token,
      );
      return json({ active });
    }

    if (path === "/logout" && request.method === "POST") {
      const body = await readJson(request);
      await endLoginSession(env, Number(body?.user_id), body?.session_token);
      return json({ ok: true });
    }

    if (path === "/ranking" && request.method === "GET") {
      const result = await env.DB.prepare(
        `
        SELECT id, name, grade, point, total_point
        FROM users
        ORDER BY total_point DESC
        `,
      ).all();

      return json(result.results);
    }

    if (path === "/activity/checkin" && request.method === "POST") {
      const body = await readJson(request);

      if (!body?.user_id || body.activity_type !== "checkin") {
        return json({ detail: "不正なリクエストです" }, 400);
      }

      await addActivity(env, body.user_id, "checkin", CHECKIN_POINT);

      return json({
        message: messages.POINT_ADDED,
        added_point: CHECKIN_POINT,
      });
    }

    if (path === "/shop/furniture/purchase" && request.method === "POST") {
      const body = await readJson(request);

      const result = await purchaseFurniture(
        env,
        body?.user_id,
        body?.furniture_id,
      );

      if (result.ok) {
        return json(result);
      }

      const errors = {
        user_not_found: [404, messages.USER_NOT_FOUND],
        not_found: [404, messages.FURNITURE_NOT_FOUND],
        already_owned: [400, messages.FURNITURE_ALREADY_OWNED],
        not_enough_point: [400, messages.NOT_ENOUGH_POINT],
        locked: [400, messages.FURNITURE_LOCKED],
      };

      const [status, detail] = errors[result.reason] || [
        400,
        messages.PURCHASE_FAILED,
      ];

      return json({ detail }, status);
    }

    if (path === "/village/status" && request.method === "GET") {
      return json(await getVillageStatus(env));
    }

    if (path === "/village/slots" && request.method === "GET") {
      return json(await getVillageSlots(env));
    }

    if (path === "/village/position" && request.method === "POST") {
      const body = await readJson(request);

      const result = await saveUserVillagePosition(
        env,
        body?.user_id,
        body?.slot_id,
      );

      if (!result.ok) {
        return json({ detail: result.reason }, 400);
      }

      return json(result);
    }

    const roomStatusMatch = path.match(/^\/room\/status\/(\d+)$/);
    if (roomStatusMatch && request.method === "GET") {
      const userId = Number(roomStatusMatch[1]);
      const room = await getRoomStatus(env, userId);

      if (!room) {
        return json({ detail: messages.USER_NOT_FOUND }, 404);
      }

      return json(room);
    }

    const roomLayoutMatch = path.match(/^\/room\/layout\/(\d+)$/);
    if (roomLayoutMatch && request.method === "POST") {
      const userId = Number(roomLayoutMatch[1]);
      const body = await readJson(request);

      const room = await getRoomStatus(env, userId);

      if (!room) {
        return json({ detail: messages.USER_NOT_FOUND }, 404);
      }

      if (!Array.isArray(body?.items)) {
        return json({ detail: "レイアウト情報が不正です" }, 400);
      }

      return json(await saveRoomLayout(env, userId, body.items, body.theme));
    }

    return json({ detail: "Not found" }, 404);
  },
};
