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
    id: "fan",
    name: "Fan",
    price: 40,
    min_level: 1,
    category: "western",
    surface: "floor",
  },
  {
    id: "cactus",
    name: "Cactus",
    price: 30,
    min_level: 1,
    category: "western",
    surface: "floor",
  },
  {
    id: "flowering_cactus",
    name: "Flowering Cactus",
    price: 45,
    min_level: 2,
    category: "western",
    surface: "floor",
  },
  {
    id: "sofa",
    name: "Sofa",
    price: 120,
    min_level: 3,
    category: "western",
    surface: "floor",
  },
  {
    id: "sunflower",
    name: "Sunflower",
    price: 50,
    min_level: 2,
    category: "western",
    surface: "floor",
  },
  {
    id: "round_table",
    name: "丸テーブル",
    price: 50,
    min_level: 1,
    category: "lab",
    surface: "floor",
  },
  {
    id: "office_chair",
    name: "オフィスチェア",
    price: 35,
    min_level: 1,
    category: "lab",
    surface: "floor",
  },
  {
    id: "bulletin_board",
    name: "掲示板",
    price: 15,
    min_level: 1,
    category: "lab",
    surface: "wall",
  },
  {
    id: "quest_board",
    name: "クエストボード",
    price: 15,
    min_level: 1,
    category: "lab",
    surface: "floor",
  },
  {
    id: "game_cabinet",
    name: "ゲーム機",
    price: 15,
    min_level: 2,
    category: "lab",
    surface: "floor",
  },
  {
    id: "window",
    name: "窓",
    price: 30,
    min_level: 2,
    category: "western",
    surface: "wall",
  },
  {
    id: "clock",
    name: "時計",
    price: 30,
    min_level: 2,
    category: "western",
    surface: "wall",
  },
  {
    id: "stove",
    name: "ストーブ",
    price: 50,
    min_level: 2,
    category: "western",
    surface: "wall",
  },
  {
    id: "bookshelf",
    name: "本棚",
    price: 80,
    min_level: 3,
    category: "western",
    surface: "floor",
  },
  {
    id: "shelf",
    name: "棚",
    price: 100,
    min_level: 4,
    category: "western",
    surface: "floor",
  },
  {
    id: "bed",
    name: "ベッド",
    price: 150,
    min_level: 5,
    category: "western",
    surface: "floor",
  },
  {
    id: "retro_tv",
    name: "レトロテレビ",
    price: 80,
    min_level: 2,
    category: "western",
    surface: "floor",
  },
  { id: "japanese_futon", name: "和風の布団", price: 45, min_level: 3, category: "japanese", surface: "floor" },
  { id: "japanese_chair", name: "和風の座椅子", price: 35, min_level: 3, category: "japanese", surface: "floor" },
  { id: "japanese_cabinet", name: "和風の茶箪笥", price: 80, min_level: 3, category: "japanese", surface: "floor" },
  { id: "japanese_table", name: "和風の座卓", price: 50, min_level: 3, category: "japanese", surface: "floor" },
  { id: "palace_bookshelf", name: "宮殿風の本棚", price: 110, min_level: 6, category: "palace", surface: "floor" },
  { id: "palace_lamp", name: "宮殿風のランプ", price: 60, min_level: 6, category: "palace", surface: "floor" },
  { id: "palace_sofa", name: "宮殿風のソファ", price: 140, min_level: 6, category: "palace", surface: "floor" },
  { id: "palace_cabinet", name: "宮殿風の箪笥", price: 100, min_level: 6, category: "palace", surface: "floor" },
  { id: "palace_table", name: "宮殿風のテーブル", price: 90, min_level: 6, category: "palace", surface: "floor" },
  { id: "theme_western", name: "洋風セット", price: 50, min_level: 2, category: "theme", surface: "set" },
  { id: "theme_japanese", name: "和風セット", price: 75, min_level: 3, category: "theme", surface: "set" },
  { id: "theme_chinese", name: "中華風セット", price: 100, min_level: 4, category: "theme", surface: "set" },
  { id: "theme_indian", name: "インド風セット", price: 125, min_level: 5, category: "theme", surface: "set" },
  { id: "theme_palace", name: "宮殿風セット", price: 150, min_level: 6, category: "theme", surface: "set" },
];

const GACHA_COIN_PRICE = 10;
const AVATAR_CATALOG = {
  izumi: { id: "izumi", name: "いずみ", rarity: "ノーマル", kind: "avatar" },
  nagano: { id: "nagano", name: "ながの", rarity: "中当たり", kind: "avatar" },
  abe: { id: "abe", name: "あべ", rarity: "中当たり", kind: "avatar" },
  daiki: { id: "daiki", name: "だいき", rarity: "シークレット", kind: "avatar" },
  maie: { id: "maie", name: "まいえ", rarity: "大当たり", kind: "avatar" },
  giant_robot: { id: "giant_robot", name: "白い機体", rarity: "シークレット", kind: "avatar" },
};
const ICON_CATALOG = {
  hero: { id: "hero", name: "勇者", rarity: "ノーマル", kind: "icon" },
  icon1: { id: "icon1", name: "屋根のねずみ", rarity: "中当たり", kind: "icon" },
  icon2: { id: "icon2", name: "白猫アイコン", rarity: "中当たり", kind: "icon" },
  icon3: { id: "icon3", name: "イービィ", rarity: "中当たり", kind: "icon" },
  icon4: { id: "icon4", name: "もふもふ", rarity: "大当たり", kind: "icon" },
  icon5: { id: "icon5", name: "かっぱ", rarity: "中当たり", kind: "icon" },
};

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
  [1000, 6, "宮殿級ルーム", "最高級の内装も扱える、研究室を代表する個人ルームです。"],
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
    SELECT id, name, grade, password_hash, point, total_point,
           gacha_coins, selected_avatar, selected_icon
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
    SELECT id, name, grade, point, total_point,
           gacha_coins, selected_avatar, selected_icon
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
      vs.desk_direction,
      vs.seat_type,
      vs.label,
      vs.is_active,
      vs.sort_order,
      u.id AS user_id,
      u.name AS user_name,
      u.grade AS user_grade,
      u.is_online AS user_is_online,
      u.selected_avatar AS user_avatar,
      u.selected_icon AS user_icon
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
            is_online: Boolean(row.user_is_online),
            selected_avatar: row.user_avatar,
            selected_icon: row.user_icon,
          }
        : null;

    return {
      id: row.id,
      col: row.col,
      row: row.row,
      col_span: row.col_span,
      row_span: row.row_span,
      desk_direction: row.desk_direction,
      seat_type: row.seat_type,
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
  await env.DB.prepare(`
    UPDATE users SET is_online = 0
    WHERE id IN (
      SELECT user_id FROM login_sessions WHERE last_seen < ?
    )
  `).bind(cutoff).run();
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
  const active = Number(result.meta?.changes || 0) > 0;
  if (active) {
    await env.DB.prepare(
      "UPDATE users SET is_online = 1 WHERE id = ?",
    ).bind(userId).run();
  }
  return active;
}

async function endLoginSession(env, userId, sessionToken) {
  const result = await env.DB.prepare(`
    DELETE FROM login_sessions WHERE user_id = ? AND session_token = ?
  `).bind(userId, sessionToken).run();
  const ended = Number(result.meta?.changes || 0) > 0;
  if (ended) {
    await env.DB.prepare(
      "UPDATE users SET is_online = 0 WHERE id = ?",
    ).bind(userId).run();
  }
  return ended;
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

  if (winnerId) {
    await completeDailyQuest(env, match.player1_id, "play_together");
    await completeDailyQuest(env, match.player2_id, "play_together");
  }

  return { match: await battleSnapshot(env, match.id, userId) };
}

const DAILY_QUEST_REWARDS = {
  visit_village: 40,
  lab_photo: 10,
  "bulletin-post": 10,
  play_together: 20,
};

let userPresenceSchemaReady = false;
async function ensureUserPresenceSchema(env) {
  if (userPresenceSchemaReady) return;

  const columns = await env.DB.prepare("PRAGMA table_info(users)").all();
  const names = new Set((columns.results || []).map((column) => column.name));
  if (!names.has("is_online")) {
    await env.DB.prepare(
      "ALTER TABLE users ADD COLUMN is_online INTEGER NOT NULL DEFAULT 0",
    ).run();
  }

  const cutoff = new Date(Date.now() - LOGIN_SESSION_TTL_MS).toISOString();
  await env.DB.prepare(`
    UPDATE users
    SET is_online = CASE
      WHEN id IN (
        SELECT user_id FROM login_sessions WHERE last_seen >= ?
      ) THEN 1
      ELSE 0
    END
  `).bind(cutoff).run();

  userPresenceSchemaReady = true;
}

let gachaSchemaReady = false;
async function ensureGachaSchema(env) {
  if (gachaSchemaReady) return;
  const columns = await env.DB.prepare("PRAGMA table_info(users)").all();
  const names = new Set((columns.results || []).map((column) => column.name));
  if (!names.has("gacha_coins")) {
    await env.DB.prepare("ALTER TABLE users ADD COLUMN gacha_coins INTEGER NOT NULL DEFAULT 0").run();
  }
  if (!names.has("selected_avatar")) {
    await env.DB.prepare("ALTER TABLE users ADD COLUMN selected_avatar TEXT NOT NULL DEFAULT 'izumi'").run();
  }
  if (!names.has("selected_icon")) {
    await env.DB.prepare("ALTER TABLE users ADD COLUMN selected_icon TEXT NOT NULL DEFAULT 'hero'").run();
  }
  await env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS user_avatars (
        user_id INTEGER NOT NULL, avatar_id TEXT NOT NULL, acquired_at TEXT NOT NULL,
        PRIMARY KEY (user_id, avatar_id)
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS user_icons (
        user_id INTEGER NOT NULL, icon_id TEXT NOT NULL, acquired_at TEXT NOT NULL,
        PRIMARY KEY (user_id, icon_id)
      )
    `),
    env.DB.prepare(`
      INSERT OR IGNORE INTO user_avatars (user_id, avatar_id, acquired_at)
      SELECT id, 'izumi', ? FROM users
    `).bind(nowJstIso()),
    env.DB.prepare(`
      INSERT OR IGNORE INTO user_icons (user_id, icon_id, acquired_at)
      SELECT id, 'hero', ? FROM users
    `).bind(nowJstIso()),
  ]);
  gachaSchemaReady = true;
}

async function getGachaStatus(env, userId) {
  const user = await getUserById(env, userId);
  if (!user) return null;
  const avatars = await env.DB.prepare(
    "SELECT avatar_id FROM user_avatars WHERE user_id = ?",
  ).bind(userId).all();
  const icons = await env.DB.prepare(
    "SELECT icon_id FROM user_icons WHERE user_id = ?",
  ).bind(userId).all();
  const ownedAvatars = new Set((avatars.results || []).map((row) => row.avatar_id));
  const ownedIcons = new Set((icons.results || []).map((row) => row.icon_id));
  return {
    coins: user.gacha_coins,
    selected_avatar: user.selected_avatar,
    selected_icon: user.selected_icon,
    avatars: Object.values(AVATAR_CATALOG).map((avatar) => ({ ...avatar, owned: ownedAvatars.has(avatar.id) })),
    icons: Object.values(ICON_CATALOG).map((icon) => ({ ...icon, owned: ownedIcons.has(icon.id) })),
  };
}

async function purchaseGachaCoin(env, userId, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return { ok: false, reason: "invalid_quantity" };
  }
  const totalPrice = GACHA_COIN_PRICE * quantity;
  const user = await getUserById(env, userId);
  if (!user) return { ok: false, reason: "user_not_found" };
  if (user.point < totalPrice) return { ok: false, reason: "not_enough_point" };
  await env.DB.prepare(`
    UPDATE users SET point = point - ?, gacha_coins = gacha_coins + ? WHERE id = ?
  `).bind(totalPrice, quantity, userId).run();
  return {
    ok: true,
    price: totalPrice,
    unit_price: GACHA_COIN_PRICE,
    quantity,
    user: await getUserById(env, userId),
  };
}

function randomChoice(values) {
  return values[crypto.getRandomValues(new Uint32Array(1))[0] % values.length];
}

async function pullGacha(env, userId) {
  const user = await getUserById(env, userId);
  if (!user) return { ok: false, reason: "user_not_found" };
  if (user.gacha_coins < 1) return { ok: false, reason: "not_enough_coin" };
  const roll = crypto.getRandomValues(new Uint32Array(1))[0] % 100;
  let kind = "avatar";
  let prizeId;
  if (roll < 5) prizeId = randomChoice(["daiki", "giant_robot"]);
  else if (roll < 15) {
    prizeId = randomChoice(["maie", "icon4"]);
    if (prizeId === "icon4") kind = "icon";
  }
  else {
    prizeId = randomChoice(["icon1", "icon2", "icon3", "icon5", "nagano", "abe"]);
    if (prizeId.startsWith("icon")) kind = "icon";
  }
  const prize = kind === "icon" ? ICON_CATALOG[prizeId] : AVATAR_CATALOG[prizeId];
  const table = kind === "icon" ? "user_icons" : "user_avatars";
  const column = kind === "icon" ? "icon_id" : "avatar_id";
  const owned = await env.DB.prepare(
    `SELECT 1 FROM ${table} WHERE user_id = ? AND ${column} = ?`,
  ).bind(userId, prizeId).first();
  const statements = [
    env.DB.prepare("UPDATE users SET gacha_coins = gacha_coins - 1 WHERE id = ?").bind(userId),
  ];
  if (owned) {
    statements.push(env.DB.prepare("UPDATE users SET point = point + 5 WHERE id = ?").bind(userId));
  } else {
    statements.push(env.DB.prepare(
      `INSERT INTO ${table} (user_id, ${column}, acquired_at) VALUES (?, ?, ?)`,
    ).bind(userId, prizeId, nowJstIso()));
  }
  await env.DB.batch(statements);
  return {
    ok: true,
    avatar: prize,
    duplicate: Boolean(owned),
    duplicate_point: owned ? 5 : 0,
    user: await getUserById(env, userId),
    status: await getGachaStatus(env, userId),
  };
}

async function selectGachaItem(env, userId, kind, itemId) {
  const catalog = kind === "avatar" ? AVATAR_CATALOG : ICON_CATALOG;
  const table = kind === "avatar" ? "user_avatars" : "user_icons";
  const itemColumn = kind === "avatar" ? "avatar_id" : "icon_id";
  const selectedColumn = kind === "avatar" ? "selected_avatar" : "selected_icon";
  if (!catalog[itemId]) return { ok: false, reason: "not_found" };
  const owned = await env.DB.prepare(
    `SELECT 1 FROM ${table} WHERE user_id = ? AND ${itemColumn} = ?`,
  ).bind(userId, itemId).first();
  if (!owned) return { ok: false, reason: "not_owned" };
  await env.DB.prepare(`UPDATE users SET ${selectedColumn} = ? WHERE id = ?`).bind(itemId, userId).run();
  return { ok: true, user: await getUserById(env, userId) };
}

const MAHJONG_WINDS = ["東", "南", "西", "北"];

let mahjongSchemaReady = false;
async function ensureMahjongSchema(env) {
  if (mahjongSchemaReady) return;
  await env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS mahjong_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT, room_code TEXT NOT NULL UNIQUE,
        host_id INTEGER NOT NULL, game_type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'waiting',
        round_wind TEXT NOT NULL DEFAULT 'east', round_number INTEGER NOT NULL DEFAULT 1,
        honba INTEGER NOT NULL DEFAULT 0, riichi_sticks INTEGER NOT NULL DEFAULT 0,
        dealer_seat INTEGER NOT NULL DEFAULT 0, dice1 INTEGER NOT NULL DEFAULT 1,
        dice2 INTEGER NOT NULL DEFAULT 1, stake_amount INTEGER NOT NULL DEFAULT 0,
        starting_score INTEGER NOT NULL DEFAULT 25000, points_settled INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS mahjong_players (
        room_id INTEGER NOT NULL, user_id INTEGER NOT NULL, join_order INTEGER NOT NULL,
        seat_index INTEGER, score INTEGER NOT NULL DEFAULT 25000,
        riichi_declared INTEGER NOT NULL DEFAULT 0, app_point_reward INTEGER NOT NULL DEFAULT 0,
        joined_at TEXT NOT NULL, PRIMARY KEY (room_id, user_id), UNIQUE (room_id, seat_index)
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS mahjong_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT, room_id INTEGER NOT NULL,
        event_type TEXT NOT NULL, payload_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
      )
    `),
  ]);
  mahjongSchemaReady = true;
}

async function addMahjongEvent(env, roomId, eventType, payload = {}) {
  await env.DB.prepare(`
    INSERT INTO mahjong_events (room_id, event_type, payload_json, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(roomId, eventType, JSON.stringify(payload), nowJstIso()).run();
}

async function mahjongSnapshot(env, roomId, userId) {
  const room = await env.DB.prepare("SELECT * FROM mahjong_rooms WHERE id = ?").bind(roomId).first();
  if (!room) return null;
  const playerRows = await env.DB.prepare(`
    SELECT mp.user_id, u.name, mp.join_order, mp.seat_index, mp.score,
           mp.riichi_declared, mp.app_point_reward,
           u.point AS app_point, u.total_point AS app_total_point
    FROM mahjong_players mp JOIN users u ON u.id = mp.user_id
    WHERE mp.room_id = ? ORDER BY COALESCE(mp.seat_index, mp.join_order), mp.join_order
  `).bind(roomId).all();
  const players = playerRows.results || [];
  if (!players.some((player) => player.user_id === userId)) return null;
  for (const player of players) {
    if (player.seat_index == null) {
      player.wind = null;
      player.is_dealer = false;
    } else {
      player.wind = MAHJONG_WINDS[(player.seat_index - room.dealer_seat + 4) % 4];
      player.is_dealer = player.seat_index === room.dealer_seat;
    }
    player.riichi_declared = Boolean(player.riichi_declared);
  }
  const eventRows = await env.DB.prepare(`
    SELECT event_type, payload_json, created_at FROM mahjong_events
    WHERE room_id = ? ORDER BY id DESC LIMIT 12
  `).bind(roomId).all();
  const history = (eventRows.results || []).map((event) => {
    try { return { event_type: event.event_type, payload: JSON.parse(event.payload_json), created_at: event.created_at }; }
    catch { return { event_type: event.event_type, payload: {}, created_at: event.created_at }; }
  });
  const ranking = [...players].sort((a, b) => b.score - a.score || a.join_order - b.join_order);
  return {
    ...room,
    players,
    ranking,
    history,
    is_host: room.host_id === userId,
    current_user_id: userId,
    round_label: `${room.round_wind === "east" ? "東" : "南"}${room.round_number}局`,
  };
}

async function getCurrentMahjongRoom(env, userId) {
  const row = await env.DB.prepare(`
    SELECT r.id FROM mahjong_rooms r JOIN mahjong_players p ON p.room_id = r.id
    WHERE p.user_id = ? AND r.status IN ('waiting', 'playing') ORDER BY r.id DESC LIMIT 1
  `).bind(userId).first();
  return row ? mahjongSnapshot(env, row.id, userId) : null;
}

async function listMahjongRooms(env) {
  const rows = await env.DB.prepare(`
    SELECT r.id, r.host_id, u.name AS host_name, r.game_type, r.stake_amount,
           r.starting_score, r.created_at, COUNT(p.user_id) AS player_count
    FROM mahjong_rooms r JOIN users u ON u.id = r.host_id
    JOIN mahjong_players p ON p.room_id = r.id WHERE r.status = 'waiting'
    GROUP BY r.id HAVING COUNT(p.user_id) < 4 ORDER BY r.created_at DESC, r.id DESC
  `).all();
  return rows.results || [];
}

async function createMahjongRoom(env, body) {
  const userId = Number(body?.user_id);
  const gameType = body?.game_type;
  const stake = Number(body?.stake_amount || 0);
  const startingScore = Number(body?.starting_score || 25000);
  if (!["tonpu", "hanchan"].includes(gameType) || ![0, 10, 50].includes(stake) || ![25000, 35000].includes(startingScore)) {
    return { error: "部屋の設定が不正です", status: 400 };
  }
  if (await getCurrentMahjongRoom(env, userId)) return { error: "すでに参加中の麻雀部屋があります", status: 409 };
  const user = await getUserById(env, userId);
  if (!user) return { error: messages.USER_NOT_FOUND, status: 404 };
  if (user.point < stake) return { error: messages.NOT_ENOUGH_POINT, status: 400 };
  let code;
  for (let index = 0; index < 20; index += 1) {
    const candidate = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
    if (!(await env.DB.prepare("SELECT 1 FROM mahjong_rooms WHERE room_code = ?").bind(candidate).first())) { code = candidate; break; }
  }
  if (!code) return { error: "部屋番号を作成できませんでした", status: 500 };
  const now = nowJstIso();
  const dice = [1 + crypto.getRandomValues(new Uint32Array(1))[0] % 6, 1 + crypto.getRandomValues(new Uint32Array(1))[0] % 6];
  const created = await env.DB.prepare(`
    INSERT INTO mahjong_rooms
      (room_code, host_id, game_type, dice1, dice2, stake_amount, starting_score, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(code, userId, gameType, dice[0], dice[1], stake, startingScore, now, now).run();
  const roomId = created.meta.last_row_id;
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO mahjong_players (room_id, user_id, join_order, score, joined_at) VALUES (?, ?, 0, ?, ?)`).bind(roomId, userId, startingScore, now),
    env.DB.prepare("UPDATE users SET point = point - ?, total_point = total_point - ? WHERE id = ?").bind(stake, stake, userId),
  ]);
  await addMahjongEvent(env, roomId, "room_created", { user_id: userId });
  return { room: await mahjongSnapshot(env, roomId, userId) };
}

async function joinMahjongRoom(env, userId, roomId) {
  if (await getCurrentMahjongRoom(env, userId)) return { error: "すでに参加中の麻雀部屋があります", status: 409 };
  const room = await env.DB.prepare(`
    SELECT id, stake_amount, starting_score FROM mahjong_rooms WHERE id = ? AND status = 'waiting'
  `).bind(roomId).first();
  if (!room) return { error: "参加できる部屋が見つかりません", status: 404 };
  const user = await getUserById(env, userId);
  if (!user || user.point < room.stake_amount) return { error: messages.NOT_ENOUGH_POINT, status: 400 };
  const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM mahjong_players WHERE room_id = ?").bind(roomId).first();
  if (Number(count.count) >= 4) return { error: "この部屋は満員です", status: 409 };
  try {
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO mahjong_players (room_id, user_id, join_order, score, joined_at) VALUES (?, ?, ?, ?, ?)`).bind(roomId, userId, Number(count.count), room.starting_score, nowJstIso()),
      env.DB.prepare("UPDATE users SET point = point - ?, total_point = total_point - ? WHERE id = ?").bind(room.stake_amount, room.stake_amount, userId),
    ]);
  } catch {
    return { error: "この部屋には参加できません", status: 409 };
  }
  await addMahjongEvent(env, roomId, "player_joined", { user_id: userId });
  return { room: await mahjongSnapshot(env, roomId, userId) };
}

async function leaveMahjongRoom(env, roomId, userId) {
  const room = await env.DB.prepare("SELECT host_id, status, stake_amount FROM mahjong_rooms WHERE id = ?").bind(roomId).first();
  if (!room || room.status !== "waiting") return { error: "参加待ちの部屋からのみ退出できます", status: 403 };
  const member = await env.DB.prepare("SELECT 1 FROM mahjong_players WHERE room_id = ? AND user_id = ?").bind(roomId, userId).first();
  if (!member) return { error: "この部屋に参加していません", status: 404 };
  if (room.host_id === userId) {
    const players = await env.DB.prepare("SELECT user_id FROM mahjong_players WHERE room_id = ?").bind(roomId).all();
    const statements = [];
    for (const player of players.results || []) {
      statements.push(env.DB.prepare("UPDATE users SET point = point + ?, total_point = total_point + ? WHERE id = ?").bind(room.stake_amount, room.stake_amount, player.user_id));
    }
    statements.push(env.DB.prepare("DELETE FROM mahjong_events WHERE room_id = ?").bind(roomId));
    statements.push(env.DB.prepare("DELETE FROM mahjong_players WHERE room_id = ?").bind(roomId));
    statements.push(env.DB.prepare("DELETE FROM mahjong_rooms WHERE id = ?").bind(roomId));
    await env.DB.batch(statements);
    return { room: null, closed: true };
  }
  await env.DB.batch([
    env.DB.prepare("DELETE FROM mahjong_players WHERE room_id = ? AND user_id = ?").bind(roomId, userId),
    env.DB.prepare("UPDATE users SET point = point + ?, total_point = total_point + ? WHERE id = ?").bind(room.stake_amount, room.stake_amount, userId),
  ]);
  const remaining = await env.DB.prepare("SELECT user_id FROM mahjong_players WHERE room_id = ? ORDER BY join_order, user_id").bind(roomId).all();
  for (let index = 0; index < (remaining.results || []).length; index += 1) {
    await env.DB.prepare("UPDATE mahjong_players SET join_order = ? WHERE room_id = ? AND user_id = ?").bind(index, roomId, remaining.results[index].user_id).run();
  }
  return { room: null, closed: false };
}

async function startMahjongRoom(env, roomId, userId) {
  const room = await env.DB.prepare("SELECT host_id, status FROM mahjong_rooms WHERE id = ?").bind(roomId).first();
  if (!room || room.host_id !== userId || room.status !== "waiting") return { error: "対局を開始できません", status: 403 };
  const rows = await env.DB.prepare("SELECT user_id FROM mahjong_players WHERE room_id = ?").bind(roomId).all();
  const playerIds = (rows.results || []).map((row) => row.user_id);
  if (playerIds.length !== 4) return { error: "4人揃うまで開始できません", status: 400 };
  for (let index = playerIds.length - 1; index > 0; index -= 1) {
    const target = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
    [playerIds[index], playerIds[target]] = [playerIds[target], playerIds[index]];
  }
  for (let index = 0; index < playerIds.length; index += 1) {
    await env.DB.prepare("UPDATE mahjong_players SET seat_index = ? WHERE room_id = ? AND user_id = ?").bind(index, roomId, playerIds[index]).run();
  }
  const dice1 = 1 + crypto.getRandomValues(new Uint32Array(1))[0] % 6;
  const dice2 = 1 + crypto.getRandomValues(new Uint32Array(1))[0] % 6;
  await env.DB.prepare(`UPDATE mahjong_rooms SET status = 'playing', dealer_seat = 0, dice1 = ?, dice2 = ?, updated_at = ? WHERE id = ?`).bind(dice1, dice2, nowJstIso(), roomId).run();
  await addMahjongEvent(env, roomId, "game_started", { seat_order: playerIds });
  return { room: await mahjongSnapshot(env, roomId, userId) };
}

async function rollMahjongDice(env, roomId, userId) {
  const room = await env.DB.prepare("SELECT host_id, status FROM mahjong_rooms WHERE id = ?").bind(roomId).first();
  if (!room || room.host_id !== userId || room.status !== "playing") return { error: "サイコロを振れません", status: 403 };
  const dice1 = 1 + crypto.getRandomValues(new Uint32Array(1))[0] % 6;
  const dice2 = 1 + crypto.getRandomValues(new Uint32Array(1))[0] % 6;
  await env.DB.prepare("UPDATE mahjong_rooms SET dice1 = ?, dice2 = ?, updated_at = ? WHERE id = ?").bind(dice1, dice2, nowJstIso(), roomId).run();
  await addMahjongEvent(env, roomId, "dice", { dice1, dice2 });
  return { room: await mahjongSnapshot(env, roomId, userId) };
}

async function setMahjongRiichi(env, roomId, userId, targetUserId, cancel = false) {
  const room = await env.DB.prepare("SELECT host_id, status, riichi_sticks FROM mahjong_rooms WHERE id = ?").bind(roomId).first();
  if (!room || room.host_id !== userId || room.status !== "playing") return { error: "リーチを変更できません", status: 403 };
  const player = await env.DB.prepare("SELECT score, riichi_declared FROM mahjong_players WHERE room_id = ? AND user_id = ?").bind(roomId, targetUserId).first();
  if (!player) return { error: "プレイヤーが見つかりません", status: 404 };
  if (!cancel) {
    if (player.riichi_declared || player.score < 1000) return { error: "リーチできません", status: 400 };
    await env.DB.batch([
      env.DB.prepare("UPDATE mahjong_players SET score = score - 1000, riichi_declared = 1 WHERE room_id = ? AND user_id = ?").bind(roomId, targetUserId),
      env.DB.prepare("UPDATE mahjong_rooms SET riichi_sticks = riichi_sticks + 1, updated_at = ? WHERE id = ?").bind(nowJstIso(), roomId),
    ]);
    await addMahjongEvent(env, roomId, "riichi", { user_id: targetUserId });
  } else {
    if (!player.riichi_declared || room.riichi_sticks <= 0) return { error: "このプレイヤーはリーチしていません", status: 409 };
    await env.DB.batch([
      env.DB.prepare("UPDATE mahjong_players SET score = score + 1000, riichi_declared = 0 WHERE room_id = ? AND user_id = ?").bind(roomId, targetUserId),
      env.DB.prepare("UPDATE mahjong_rooms SET riichi_sticks = riichi_sticks - 1, updated_at = ? WHERE id = ?").bind(nowJstIso(), roomId),
    ]);
    await addMahjongEvent(env, roomId, "riichi_cancelled", { user_id: targetUserId });
  }
  return { room: await mahjongSnapshot(env, roomId, userId) };
}

async function settleMahjongPoints(env, roomId) {
  const room = await env.DB.prepare("SELECT stake_amount, points_settled, status FROM mahjong_rooms WHERE id = ?").bind(roomId).first();
  if (!room || room.status !== "finished" || room.points_settled) return;
  const rows = await env.DB.prepare("SELECT user_id, score FROM mahjong_players WHERE room_id = ?").bind(roomId).all();
  const players = rows.results || [];
  const pot = room.stake_amount * players.length;
  const positiveTotal = players.reduce((sum, player) => sum + Math.max(0, player.score), 0);
  const rewards = Object.fromEntries(players.map((player) => [player.user_id, 0]));
  let distributed = 0;
  const fractions = [];
  if (pot > 0 && positiveTotal > 0) {
    for (const player of players) {
      const numerator = pot * Math.max(0, player.score);
      const reward = Math.floor(numerator / positiveTotal);
      rewards[player.user_id] = reward;
      distributed += reward;
      fractions.push({ remainder: numerator % positiveTotal, score: player.score, userId: player.user_id });
    }
    fractions.sort((a, b) => b.remainder - a.remainder || b.score - a.score || a.userId - b.userId);
    for (let index = 0; index < pot - distributed; index += 1) rewards[fractions[index].userId] += 1;
  }
  const statements = [];
  for (const player of players) {
    statements.push(env.DB.prepare("UPDATE users SET point = point + ?, total_point = total_point + ? WHERE id = ?").bind(rewards[player.user_id], rewards[player.user_id], player.user_id));
    statements.push(env.DB.prepare("UPDATE mahjong_players SET app_point_reward = ? WHERE room_id = ? AND user_id = ?").bind(rewards[player.user_id], roomId, player.user_id));
  }
  statements.push(env.DB.prepare("UPDATE mahjong_rooms SET points_settled = 1 WHERE id = ?").bind(roomId));
  await env.DB.batch(statements);
  await addMahjongEvent(env, roomId, "point_distribution", { pot, rewards });
}

async function finishMahjongRoom(env, roomId, userId) {
  const changed = await env.DB.prepare(`
    UPDATE mahjong_rooms SET status = 'finished', updated_at = ?
    WHERE id = ? AND host_id = ? AND status = 'playing'
  `).bind(nowJstIso(), roomId, userId).run();
  if (!Number(changed.meta?.changes || 0)) return { error: "ゲームを終了できません", status: 403 };
  await addMahjongEvent(env, roomId, "game_finished", { reason: "manual" });
  await settleMahjongPoints(env, roomId);
  const players = await env.DB.prepare("SELECT user_id FROM mahjong_players WHERE room_id = ?").bind(roomId).all();
  for (const player of players.results || []) await completeDailyQuest(env, player.user_id, "play_together");
  return { room: await mahjongSnapshot(env, roomId, userId) };
}

async function submitMahjongHand(env, roomId, body) {
  const userId = Number(body?.user_id);
  const room = await env.DB.prepare("SELECT * FROM mahjong_rooms WHERE id = ?").bind(roomId).first();
  if (!room || room.host_id !== userId || room.status !== "playing") return { error: "局結果を登録できません", status: 403 };
  const rows = await env.DB.prepare("SELECT user_id FROM mahjong_players WHERE room_id = ?").bind(roomId).all();
  const playerIds = (rows.results || []).map((row) => row.user_id);
  const adjustments = {};
  for (const [key, value] of Object.entries(body?.adjustments || {})) adjustments[Number(key)] = Number(value);
  if (Object.keys(adjustments).some((key) => !playerIds.includes(Number(key))) || Object.values(adjustments).some((value) => !Number.isInteger(value)) || Object.values(adjustments).reduce((sum, value) => sum + value, 0) !== 0) {
    return { error: "点数変動の合計を0にしてください", status: 400 };
  }
  for (const playerId of playerIds) {
    await env.DB.prepare("UPDATE mahjong_players SET score = score + ? WHERE room_id = ? AND user_id = ?").bind(adjustments[playerId] || 0, roomId, playerId).run();
  }
  const winnerId = body?.riichi_winner_id == null ? null : Number(body.riichi_winner_id);
  if (winnerId != null) {
    if (!playerIds.includes(winnerId)) return { error: "供託の受取人が不正です", status: 400 };
    await env.DB.prepare("UPDATE mahjong_players SET score = score + ? WHERE room_id = ? AND user_id = ?").bind(room.riichi_sticks * 1000, roomId, winnerId).run();
  }
  const dealerContinues = Boolean(body?.dealer_continues);
  let nextStatus = "playing";
  let nextWind = room.round_wind;
  let nextRound = room.round_number;
  let nextDealer = room.dealer_seat;
  const nextHonba = dealerContinues ? room.honba + 1 : 0;
  if (!dealerContinues) {
    nextDealer = (room.dealer_seat + 1) % 4;
    nextRound += 1;
    if (nextRound > 4) {
      if (room.round_wind === "east" && room.game_type === "hanchan") { nextWind = "south"; nextRound = 1; }
      else nextStatus = "finished";
    }
  }
  const dice1 = 1 + crypto.getRandomValues(new Uint32Array(1))[0] % 6;
  const dice2 = 1 + crypto.getRandomValues(new Uint32Array(1))[0] % 6;
  await env.DB.batch([
    env.DB.prepare(`
      UPDATE mahjong_rooms SET status = ?, round_wind = ?, round_number = ?, dealer_seat = ?,
        honba = ?, riichi_sticks = ?, dice1 = ?, dice2 = ?, updated_at = ? WHERE id = ?
    `).bind(nextStatus, nextWind, nextRound, nextDealer, nextHonba, winnerId == null ? room.riichi_sticks : 0, dice1, dice2, nowJstIso(), roomId),
    env.DB.prepare("UPDATE mahjong_players SET riichi_declared = 0 WHERE room_id = ?").bind(roomId),
  ]);
  await addMahjongEvent(env, roomId, "hand_result", { adjustments, dealer_continues: dealerContinues, riichi_winner_id: winnerId, note: String(body?.note || "").slice(0, 100) });
  if (nextStatus === "finished") {
    await settleMahjongPoints(env, roomId);
    for (const playerId of playerIds) await completeDailyQuest(env, playerId, "play_together");
  }
  return { room: await mahjongSnapshot(env, roomId, userId) };
}

async function ensureQuestSchema(env) {
  await env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS daily_quest_completions (
        quest_id TEXT NOT NULL, quest_date TEXT NOT NULL, user_id INTEGER NOT NULL,
        reward INTEGER NOT NULL, completed_at TEXT NOT NULL,
        PRIMARY KEY (quest_id, quest_date, user_id)
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS lunch_quest_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT, quest_date TEXT NOT NULL,
        host_id INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'waiting',
        post_id INTEGER, created_at TEXT NOT NULL, completed_at TEXT
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS lunch_quest_members (
        room_id INTEGER NOT NULL, user_id INTEGER NOT NULL, joined_at TEXT NOT NULL,
        PRIMARY KEY (room_id, user_id)
      )
    `),
  ]);
  const columns = await env.DB.prepare("PRAGMA table_info(bulletin_posts)").all();
  const names = new Set((columns.results || []).map((column) => column.name));
  if (!names.has("image_data")) {
    await env.DB.prepare("ALTER TABLE bulletin_posts ADD COLUMN image_data TEXT").run();
  }
  if (!names.has("quest_type")) {
    await env.DB.prepare("ALTER TABLE bulletin_posts ADD COLUMN quest_type TEXT").run();
  }
}

async function completeDailyQuest(env, userId, questId) {
  await ensureQuestSchema(env);
  const reward = DAILY_QUEST_REWARDS[questId];
  if (reward == null || !(await getUserById(env, userId))) return null;
  const completedAt = nowJstIso();
  const questDate = completedAt.slice(0, 10);
  const inserted = await env.DB.prepare(`
    INSERT OR IGNORE INTO daily_quest_completions
      (quest_id, quest_date, user_id, reward, completed_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(questId, questDate, userId, reward, completedAt).run();
  const awarded = Number(inserted.meta?.changes || 0) > 0;
  if (awarded) await addActivity(env, userId, `quest_${questId}`, reward);
  return {
    ok: true,
    awarded,
    reward: awarded ? reward : 0,
    user: await getUserById(env, userId),
  };
}

async function getDailyQuestStatus(env, userId) {
  await ensureQuestSchema(env);
  if (!(await getUserById(env, userId))) return null;
  const result = await env.DB.prepare(`
    SELECT quest_id, reward, completed_at FROM daily_quest_completions
    WHERE user_id = ? AND quest_date = ? ORDER BY completed_at
  `).bind(userId, nowJstIso().slice(0, 10)).all();
  return { completed_quests: result.results || [] };
}

async function getLunchQuest(env, userId) {
  await ensureQuestSchema(env);
  if (!(await getUserById(env, userId))) return null;
  const questDate = nowJstIso().slice(0, 10);
  const roomRows = await env.DB.prepare(`
    SELECT r.id, r.host_id, r.status, r.post_id, r.created_at, r.completed_at,
           u.name AS host_name
    FROM lunch_quest_rooms r JOIN users u ON u.id = r.host_id
    WHERE r.quest_date = ?
    ORDER BY CASE r.status WHEN 'waiting' THEN 0 ELSE 1 END, r.id DESC
  `).bind(questDate).all();
  const rooms = [];
  let myRoomId = null;
  for (const room of roomRows.results || []) {
    const members = await env.DB.prepare(`
      SELECT u.id, u.name, u.grade FROM lunch_quest_members m
      JOIN users u ON u.id = m.user_id WHERE m.room_id = ? ORDER BY m.joined_at
    `).bind(room.id).all();
    room.participants = members.results || [];
    if (room.participants.some((player) => player.id === userId)) myRoomId = room.id;
    rooms.push(room);
  }
  return { quest_id: "lunch", quest_date: questDate, reward: 20, rooms, my_room_id: myRoomId };
}

async function createLunchQuestRoom(env, userId) {
  const status = await getLunchQuest(env, userId);
  if (!status) return null;
  if (status.my_room_id) return { ok: false, reason: "already_joined" };
  const now = nowJstIso();
  const created = await env.DB.prepare(`
    INSERT INTO lunch_quest_rooms (quest_date, host_id, created_at) VALUES (?, ?, ?)
  `).bind(now.slice(0, 10), userId, now).run();
  const roomId = created.meta.last_row_id;
  await env.DB.prepare(`
    INSERT INTO lunch_quest_members (room_id, user_id, joined_at) VALUES (?, ?, ?)
  `).bind(roomId, userId, now).run();
  return { ok: true, room_id: roomId, status: await getLunchQuest(env, userId) };
}

async function joinLunchQuest(env, userId, roomId) {
  const status = await getLunchQuest(env, userId);
  if (!status) return null;
  if (status.my_room_id) return { ok: false, reason: "already_joined" };
  const room = await env.DB.prepare(`
    SELECT id FROM lunch_quest_rooms WHERE id = ? AND quest_date = ? AND status = 'waiting'
  `).bind(roomId, nowJstIso().slice(0, 10)).first();
  if (!room) return { ok: false, reason: "room_not_found" };
  await env.DB.prepare(`
    INSERT INTO lunch_quest_members (room_id, user_id, joined_at) VALUES (?, ?, ?)
  `).bind(roomId, userId, nowJstIso()).run();
  return { ok: true, status: await getLunchQuest(env, userId) };
}

async function completeLunchQuest(env, body) {
  await ensureQuestSchema(env);
  const userId = Number(body?.user_id);
  const roomId = Number(body?.room_id);
  const member = await env.DB.prepare(`
    SELECT 1 FROM lunch_quest_rooms r JOIN lunch_quest_members m ON m.room_id = r.id
    WHERE r.id = ? AND r.quest_date = ? AND r.status = 'waiting' AND m.user_id = ?
  `).bind(roomId, nowJstIso().slice(0, 10), userId).first();
  if (!member) return { ok: false, reason: "not_participant" };
  const members = await env.DB.prepare(
    "SELECT user_id FROM lunch_quest_members WHERE room_id = ?",
  ).bind(roomId).all();
  if ((members.results || []).length < 2) return { ok: false, reason: "not_enough_members" };
  const now = nowJstIso();
  const content = String(body?.content || "").trim() || "みんなで昼飯クエストを達成しました！";
  const imageData = String(body?.image_data || "");
  const post = await env.DB.prepare(`
    INSERT INTO bulletin_posts (user_id, content, image_data, quest_type, created_at)
    VALUES (?, ?, ?, 'lunch', ?)
  `).bind(userId, content, imageData, now).run();
  for (const participant of members.results || []) {
    await addActivity(env, participant.user_id, "lunch_quest", 20);
  }
  await env.DB.prepare(`
    UPDATE lunch_quest_rooms SET status = 'completed', post_id = ?, completed_at = ? WHERE id = ?
  `).bind(post.meta.last_row_id, now, roomId).run();
  return {
    ok: true,
    awarded_user_ids: (members.results || []).map((item) => item.user_id),
    user: await getUserById(env, userId),
    status: await getLunchQuest(env, userId),
  };
}

async function completePhotoQuest(env, body) {
  const userId = Number(body?.user_id);
  await ensureQuestSchema(env);
  const already = await env.DB.prepare(`
    SELECT 1 FROM daily_quest_completions
    WHERE quest_id = 'lab_photo' AND quest_date = ? AND user_id = ?
  `).bind(nowJstIso().slice(0, 10), userId).first();
  if (already) return { ok: false, reason: "completed" };
  if (!(await getUserById(env, userId))) return null;
  const now = nowJstIso();
  const content = String(body?.content || "").trim() || "今日の研究室の風景を共有しました！";
  await env.DB.prepare(`
    INSERT INTO bulletin_posts (user_id, content, image_data, quest_type, created_at)
    VALUES (?, ?, ?, 'lab_photo', ?)
  `).bind(userId, content, String(body?.image_data || ""), now).run();
  const quest = await completeDailyQuest(env, userId, "lab_photo");
  return { ok: true, user: quest.user, status: await getDailyQuestStatus(env, userId) };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    await ensureUserPresenceSchema(env);
    await ensureGachaSchema(env);
    await ensureMahjongSchema(env);

    if (path === "/") {
      return json({ message: "Cloudflare Worker API is running" });
    }

    const gachaStatus = path.match(/^\/gacha\/status\/(\d+)$/);
    if (gachaStatus && request.method === "GET") {
      const result = await getGachaStatus(env, Number(gachaStatus[1]));
      if (!result) return json({ detail: messages.USER_NOT_FOUND }, 404);
      return json(result);
    }

    if (path === "/shop/gacha-coins/purchase" && request.method === "POST") {
      const body = await readJson(request);
      const quantity = body?.quantity == null ? 1 : Number(body.quantity);
      const result = await purchaseGachaCoin(env, Number(body?.user_id), quantity);
      if (!result.ok) {
        const detail = result.reason === "user_not_found"
          ? messages.USER_NOT_FOUND
          : result.reason === "invalid_quantity"
            ? "購入枚数は1〜99枚で指定してください"
            : messages.NOT_ENOUGH_POINT;
        return json({ detail }, result.reason === "user_not_found" ? 404 : 400);
      }
      return json(result);
    }

    if (path === "/gacha/pull" && request.method === "POST") {
      const body = await readJson(request);
      const result = await pullGacha(env, Number(body?.user_id));
      if (!result.ok) return json({ detail: result.reason === "user_not_found" ? messages.USER_NOT_FOUND : "ガチャコインがありません" }, result.reason === "user_not_found" ? 404 : 400);
      return json(result);
    }

    if (path === "/gacha/avatar/select" && request.method === "POST") {
      const body = await readJson(request);
      const result = await selectGachaItem(env, Number(body?.user_id), "avatar", body?.avatar_id);
      if (!result.ok) return json({ detail: "未所持のアバターは選択できません" }, 400);
      return json(result);
    }

    if (path === "/gacha/icon/select" && request.method === "POST") {
      const body = await readJson(request);
      const result = await selectGachaItem(env, Number(body?.user_id), "icon", body?.icon_id);
      if (!result.ok) return json({ detail: "未所持のアイコンは選択できません" }, 400);
      return json(result);
    }

    if (path === "/mahjong/current" && request.method === "GET") {
      return json({ room: await getCurrentMahjongRoom(env, Number(url.searchParams.get("user_id"))) });
    }

    if (path === "/mahjong/rooms" && request.method === "GET") {
      return json(await listMahjongRooms(env));
    }

    if (path === "/mahjong/rooms" && request.method === "POST") {
      const result = await createMahjongRoom(env, await readJson(request));
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const mahjongRoom = path.match(/^\/mahjong\/rooms\/(\d+)$/);
    if (mahjongRoom && request.method === "GET") {
      const room = await mahjongSnapshot(env, Number(mahjongRoom[1]), Number(url.searchParams.get("user_id")));
      if (!room) return json({ detail: "麻雀部屋が見つかりません" }, 404);
      return json({ room });
    }

    const mahjongJoin = path.match(/^\/mahjong\/rooms\/(\d+)\/join$/);
    if (mahjongJoin && request.method === "POST") {
      const body = await readJson(request);
      const result = await joinMahjongRoom(env, Number(body?.user_id), Number(mahjongJoin[1]));
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const mahjongLeave = path.match(/^\/mahjong\/rooms\/(\d+)\/leave$/);
    if (mahjongLeave && request.method === "POST") {
      const body = await readJson(request);
      const result = await leaveMahjongRoom(env, Number(mahjongLeave[1]), Number(body?.user_id));
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const mahjongStart = path.match(/^\/mahjong\/rooms\/(\d+)\/start$/);
    if (mahjongStart && request.method === "POST") {
      const body = await readJson(request);
      const result = await startMahjongRoom(env, Number(mahjongStart[1]), Number(body?.user_id));
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const mahjongDice = path.match(/^\/mahjong\/rooms\/(\d+)\/dice$/);
    if (mahjongDice && request.method === "POST") {
      const body = await readJson(request);
      const result = await rollMahjongDice(env, Number(mahjongDice[1]), Number(body?.user_id));
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const mahjongRiichi = path.match(/^\/mahjong\/rooms\/(\d+)\/riichi$/);
    if (mahjongRiichi && request.method === "POST") {
      const body = await readJson(request);
      const result = await setMahjongRiichi(env, Number(mahjongRiichi[1]), Number(body?.user_id), Number(body?.target_user_id));
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const mahjongRiichiCancel = path.match(/^\/mahjong\/rooms\/(\d+)\/riichi\/cancel$/);
    if (mahjongRiichiCancel && request.method === "POST") {
      const body = await readJson(request);
      const result = await setMahjongRiichi(env, Number(mahjongRiichiCancel[1]), Number(body?.user_id), Number(body?.target_user_id), true);
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const mahjongFinish = path.match(/^\/mahjong\/rooms\/(\d+)\/finish$/);
    if (mahjongFinish && request.method === "POST") {
      const body = await readJson(request);
      const result = await finishMahjongRoom(env, Number(mahjongFinish[1]), Number(body?.user_id));
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const mahjongHand = path.match(/^\/mahjong\/rooms\/(\d+)\/hand$/);
    if (mahjongHand && request.method === "POST") {
      const result = await submitMahjongHand(env, Number(mahjongHand[1]), await readJson(request));
      if (result.error) return json({ detail: result.error }, result.status);
      return json(result);
    }

    const questStatus = path.match(/^\/quests\/status\/(\d+)$/);
    if (questStatus && request.method === "GET") {
      const result = await getDailyQuestStatus(env, Number(questStatus[1]));
      if (!result) return json({ detail: messages.USER_NOT_FOUND }, 404);
      return json(result);
    }

    if (path === "/quests/visit-village" && request.method === "POST") {
      const body = await readJson(request);
      const result = await completeDailyQuest(env, Number(body?.user_id), "visit_village");
      if (!result) return json({ detail: messages.USER_NOT_FOUND }, 404);
      return json(result);
    }

    if (path === "/quests/lunch" && request.method === "GET") {
      const result = await getLunchQuest(env, Number(url.searchParams.get("user_id")));
      if (!result) return json({ detail: messages.USER_NOT_FOUND }, 404);
      return json(result);
    }

    if (path === "/quests/lunch/rooms" && request.method === "POST") {
      const body = await readJson(request);
      const result = await createLunchQuestRoom(env, Number(body?.user_id));
      if (!result) return json({ detail: messages.USER_NOT_FOUND }, 404);
      if (!result.ok) return json({ detail: "本日はすでに昼飯グループへ参加しています" }, 400);
      return json(result);
    }

    if (path === "/quests/lunch/join" && request.method === "POST") {
      const body = await readJson(request);
      const result = await joinLunchQuest(env, Number(body?.user_id), Number(body?.room_id));
      if (!result) return json({ detail: messages.USER_NOT_FOUND }, 404);
      if (!result.ok) return json({ detail: result.reason === "already_joined" ? "本日はすでに別のグループへ参加しています" : "このグループには参加できません" }, 400);
      return json(result);
    }

    if (path === "/quests/lunch/complete" && request.method === "POST") {
      const body = await readJson(request);
      const imageData = String(body?.image_data || "");
      if (!imageData.startsWith("data:image/") || imageData.length > 1500000) {
        return json({ detail: "画像は1MB以下のPNG・JPEG・GIF・WebPにしてください" }, 400);
      }
      const result = await completeLunchQuest(env, body);
      if (!result.ok) return json({ detail: result.reason === "not_enough_members" ? "2人以上参加すると完了できます" : "先に昼飯グループへ参加してください" }, 400);
      return json(result);
    }

    if (path === "/quests/photo/complete" && request.method === "POST") {
      const body = await readJson(request);
      const imageData = String(body?.image_data || "");
      if (!imageData.startsWith("data:image/") || imageData.length > 1500000) {
        return json({ detail: "画像は1MB以下のPNG・JPEG・GIF・WebPにしてください" }, 400);
      }
      const result = await completePhotoQuest(env, body);
      if (!result) return json({ detail: messages.USER_NOT_FOUND }, 404);
      if (!result.ok) return json({ detail: "本日の写真クエストは達成済みです" }, 400);
      return json(result);
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
        await completeDailyQuest(env, match.player1_id, "play_together");
        await completeDailyQuest(env, match.player2_id, "play_together");
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

      await ensureGachaSchema(env);

      const user = await getUserByName(env, body.name);
      const acquiredAt = nowJstIso();
      await env.DB.batch([
        env.DB.prepare(
          "INSERT OR IGNORE INTO user_avatars (user_id, avatar_id, acquired_at) VALUES (?, 'izumi', ?)",
        ).bind(user.id, acquiredAt),
        env.DB.prepare(
          "INSERT OR IGNORE INTO user_icons (user_id, icon_id, acquired_at) VALUES (?, 'hero', ?)",
        ).bind(user.id, acquiredAt),
      ]);

      return json({
        message: messages.REGISTERED,
        user: {
          id: user.id,
          name: user.name,
          grade: user.grade,
          point: user.point,
          total_point: user.total_point,
          gacha_coins: user.gacha_coins,
          selected_avatar: user.selected_avatar,
          selected_icon: user.selected_icon,
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
          gacha_coins: user.gacha_coins,
          selected_avatar: user.selected_avatar,
          selected_icon: user.selected_icon,
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
        SELECT id, name, grade, point, total_point, selected_avatar, selected_icon
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
