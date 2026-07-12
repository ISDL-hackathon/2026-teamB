const LOGIN_POINT = 10;
const CHECKIN_POINT = 20;

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
];

const VILLAGE_LEVELS = [
  [1000, 5, "ISDL研究都市", "研究室全体が活発に動いています。みんなの活動で街が大きく発展しました。"],
  [600, 4, "にぎやかな研究室", "人が集まり、研究や交流も活発になってきました。"],
  [300, 3, "活動中の研究室", "研究室に人が集まり始め、設備も少しずつ充実してきました。"],
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
  return ROOM_LEVELS.find(([threshold]) => point >= threshold)[1];
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
        },
      });
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
