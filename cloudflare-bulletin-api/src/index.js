const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function listPosts(env, viewerId) {
  const { results } = await env.DB.prepare(`
    SELECT p.id, p.user_id, p.content, p.image_key, p.created_at,
           u.name AS user_name, u.grade AS user_grade,
           EXISTS(
             SELECT 1 FROM bulletin_follows f
             WHERE f.follower_id = ? AND f.followed_id = p.user_id
           ) AS is_following,
           EXISTS(
             SELECT 1 FROM bulletin_likes l
             WHERE l.user_id = ? AND l.post_id = p.id
           ) AS is_liked,
           (SELECT COUNT(*) FROM bulletin_likes l WHERE l.post_id = p.id) AS like_count
    FROM bulletin_posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.id DESC
    LIMIT 100
  `).bind(viewerId, viewerId).all();

  return results.map((post) => ({
    ...post,
    is_following: Boolean(post.is_following),
    is_liked: Boolean(post.is_liked),
    image_data: null,
  }));
}

async function createPost(request, env) {
  const body = await readBody(request);
  const userId = Number(body?.user_id);
  const content = String(body?.content ?? "").trim();
  if (!Number.isInteger(userId) || !content || content.length > 500) {
    return json({ detail: "投稿は1〜500文字で入力してください" }, 400);
  }

  const user = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (!user) return json({ detail: "ユーザーが見つかりません" }, 404);

  const createdAt = new Date().toISOString().slice(0, 19);
  const result = await env.DB.prepare(
    "INSERT INTO bulletin_posts (user_id, content, image_key, created_at) VALUES (?, ?, NULL, ?)",
  ).bind(userId, content, createdAt).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS daily_quest_completions (
      quest_id TEXT NOT NULL,
      quest_date TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      reward INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT NOT NULL,
      PRIMARY KEY (quest_id, quest_date, user_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();
  const questDate = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const questResult = await env.DB.prepare(`
    INSERT OR IGNORE INTO daily_quest_completions
      (quest_id, quest_date, user_id, reward, completed_at)
    VALUES ('bulletin-post', ?, ?, 10, ?)
  `).bind(questDate, userId, createdAt).run();
  const questAwarded = Number(questResult.meta?.changes ?? 0) > 0;
  if (questAwarded) {
    await env.DB.batch([
      env.DB.prepare(
        "UPDATE users SET point = point + 10, total_point = total_point + 10 WHERE id = ?",
      ).bind(userId),
      env.DB.prepare(
        "INSERT INTO activities (user_id, activity_type, point, created_at) VALUES (?, 'quest_bulletin-post', 10, ?)",
      ).bind(userId, createdAt),
    ]);
  }
  const posts = await listPosts(env, userId);
  const post = posts.find((item) => item.id === result.meta.last_row_id);
  const updatedUser = await env.DB.prepare(
    "SELECT id, point, total_point FROM users WHERE id = ?",
  ).bind(userId).first();
  return json({
    ...post,
    quest_awarded: questAwarded,
    quest_reward: questAwarded ? 10 : 0,
    user: updatedUser,
  });
}

async function toggleFollow(request, env) {
  const body = await readBody(request);
  const followerId = Number(body?.follower_id);
  const followedId = Number(body?.followed_id);
  if (!Number.isInteger(followerId) || !Number.isInteger(followedId) || followerId === followedId) {
    return json({ detail: "フォロー対象を確認してください" }, 400);
  }

  const existing = await env.DB.prepare(
    "SELECT 1 FROM bulletin_follows WHERE follower_id = ? AND followed_id = ?",
  ).bind(followerId, followedId).first();
  if (existing) {
    await env.DB.prepare("DELETE FROM bulletin_follows WHERE follower_id = ? AND followed_id = ?")
      .bind(followerId, followedId).run();
    return json({ following: false });
  }

  await env.DB.prepare(
    "INSERT INTO bulletin_follows (follower_id, followed_id, created_at) VALUES (?, ?, ?)",
  ).bind(followerId, followedId, new Date().toISOString().slice(0, 19)).run();
  return json({ following: true });
}

async function toggleLike(request, env) {
  const body = await readBody(request);
  const userId = Number(body?.user_id);
  const postId = Number(body?.post_id);
  const post = await env.DB.prepare("SELECT user_id FROM bulletin_posts WHERE id = ?").bind(postId).first();
  if (!post || post.user_id === userId) {
    return json({ detail: "自分の投稿にはいいねできません" }, 400);
  }

  const existing = await env.DB.prepare(
    "SELECT 1 FROM bulletin_likes WHERE user_id = ? AND post_id = ?",
  ).bind(userId, postId).first();
  if (existing) {
    await env.DB.prepare("DELETE FROM bulletin_likes WHERE user_id = ? AND post_id = ?")
      .bind(userId, postId).run();
  } else {
    await env.DB.prepare(
      "INSERT INTO bulletin_likes (user_id, post_id, created_at) VALUES (?, ?, ?)",
    ).bind(userId, postId, new Date().toISOString().slice(0, 19)).run();
  }

  const count = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM bulletin_likes WHERE post_id = ?",
  ).bind(postId).first();
  return json({ liked: !existing, like_count: count.count });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    const url = new URL(request.url);
    const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/$/, "") : url.pathname;
    try {
      if (request.method === "GET" && pathname === "/") {
        return json({ message: "ISDL bulletin API is running" });
      }
      if (request.method === "GET" && pathname === "/bulletin/posts") {
        return json(await listPosts(env, Number(url.searchParams.get("viewer_id")) || 0));
      }
      if (request.method === "POST" && pathname === "/bulletin/posts") return createPost(request, env);
      if (request.method === "POST" && pathname === "/bulletin/follow") return toggleFollow(request, env);
      if (request.method === "POST" && pathname === "/bulletin/like") return toggleLike(request, env);
      return json({ detail: "Not found" }, 404);
    } catch (error) {
      return json({ detail: error instanceof Error ? error.message : "Internal error" }, 500);
    }
  },
};
