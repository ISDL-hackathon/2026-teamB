import json
import sqlite3
from datetime import datetime

from passlib.context import CryptContext

DB_NAME = "isdl.db"

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

FURNITURE_CATALOG = [
    {"id": "window", "name": "Window", "price": 30, "min_level": 1},
    {"id": "clock", "name": "Clock", "price": 30, "min_level": 1},
    {"id": "stove", "name": "Stove", "price": 50, "min_level": 1},
    {"id": "bookshelf", "name": "Bookshelf", "price": 80, "min_level": 3},
    {"id": "shelf", "name": "Shelf", "price": 100, "min_level": 4},
    {"id": "bed", "name": "Bed", "price": 150, "min_level": 5},
]


def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str):
    return pwd_context.verify(plain_password, password_hash)


def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        grade TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        point INTEGER NOT NULL DEFAULT 0,
        total_point INTEGER NOT NULL DEFAULT 0
    )
    """)

    cur.execute("PRAGMA table_info(users)")
    user_columns = {row["name"] for row in cur.fetchall()}
    if "total_point" not in user_columns:
        cur.execute("ALTER TABLE users ADD COLUMN total_point INTEGER NOT NULL DEFAULT 0")
        cur.execute("UPDATE users SET total_point = point WHERE total_point = 0")

    cur.execute("""
    CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_type TEXT NOT NULL,
        point INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS room_layouts (
        user_id INTEGER PRIMARY KEY,
        layout_json TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_furniture (
        user_id INTEGER NOT NULL,
        furniture_id TEXT NOT NULL,
        purchased_at TEXT NOT NULL,
        PRIMARY KEY (user_id, furniture_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    conn.commit()
    conn.close()


def create_user(name: str, grade: str, password: str):
    conn = get_connection()
    cur = conn.cursor()
    password_hash = hash_password(password)

    cur.execute(
        """
        INSERT INTO users (name, grade, password_hash, point, total_point)
        VALUES (?, ?, ?, 0, 0)
        """,
        (name, grade, password_hash),
    )

    conn.commit()
    user_id = cur.lastrowid
    conn.close()

    return {
        "id": user_id,
        "name": name,
        "grade": grade,
        "point": 0,
        "total_point": 0,
    }


def get_user_by_name(name: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, name, grade, password_hash, point, total_point
        FROM users
        WHERE name = ?
        """,
        (name,),
    )

    row = cur.fetchone()
    conn.close()

    if row is None:
        return None

    return dict(row)


def get_ranking():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    SELECT id, name, grade, point, total_point
    FROM users
    ORDER BY total_point DESC
    """)

    users = [dict(row) for row in cur.fetchall()]
    conn.close()
    return users


def add_activity(user_id: int, activity_type: str, point: int):
    conn = get_connection()
    cur = conn.cursor()
    created_at = datetime.now().isoformat(timespec="seconds")

    cur.execute(
        """
        INSERT INTO activities (user_id, activity_type, point, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (user_id, activity_type, point, created_at),
    )

    cur.execute(
        """
        UPDATE users
        SET point = point + ?,
            total_point = total_point + ?
        WHERE id = ?
        """,
        (point, point, user_id),
    )

    conn.commit()
    conn.close()


def add_login_point_if_first_today(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    today = datetime.now().date().isoformat()

    cur.execute(
        """
        SELECT COUNT(*) AS count
        FROM activities
        WHERE user_id = ?
          AND activity_type = 'login'
          AND created_at LIKE ?
        """,
        (user_id, today + "%"),
    )

    already_logged_in = cur.fetchone()["count"] > 0

    if already_logged_in:
        conn.close()
        return 0

    point = 10
    created_at = datetime.now().isoformat(timespec="seconds")

    cur.execute(
        """
        INSERT INTO activities (user_id, activity_type, point, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (user_id, "login", point, created_at),
    )

    cur.execute(
        """
        UPDATE users
        SET point = point + ?,
            total_point = total_point + ?
        WHERE id = ?
        """,
        (point, point, user_id),
    )

    conn.commit()
    conn.close()
    return point


def get_room_level_from_point(point: int):
    if point >= 600:
        return 5
    if point >= 300:
        return 4
    if point >= 150:
        return 3
    if point >= 50:
        return 2
    return 1


def get_village_status():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COALESCE(SUM(total_point), 0) AS total_point FROM users")
    total_point = cur.fetchone()["total_point"]
    today = datetime.now().date().isoformat()

    cur.execute(
        """
        SELECT COUNT(DISTINCT user_id) AS active_users
        FROM activities
        WHERE created_at LIKE ?
        """,
        (today + "%",),
    )
    active_users = cur.fetchone()["active_users"]
    conn.close()

    if total_point >= 1000:
        level = 5
        title = "ISDL都市"
        description = "研究室が完全に活性化しています。みんなの活動で街が大きく発展しました。"
    elif total_point >= 600:
        level = 4
        title = "にぎやかな研究室"
        description = "人が集まり、研究も交流も活発になってきました。"
    elif total_point >= 300:
        level = 3
        title = "活動中の研究室"
        description = "研究室に人が集まり始め、設備も少しずつ充実してきました。"
    elif total_point >= 100:
        level = 2
        title = "少し明るい研究室"
        description = "少しずつ人が来るようになり、研究室に活気が出てきました。"
    else:
        level = 1
        title = "静かな研究室"
        description = "まだ人が少なく、研究室は少し寂しい状態です。"

    if active_users >= 8:
        weather = "快晴"
    elif active_users >= 6:
        weather = "晴れ"
    elif active_users >= 4:
        weather = "曇り"
    elif active_users >= 2:
        weather = "雨"
    else:
        weather = "雷雨"

    return {
        "total_point": total_point,
        "level": level,
        "title": title,
        "description": description,
        "active_users": active_users,
        "weather": weather,
    }


def get_room_status(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, name, grade, point, total_point
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )

    row = cur.fetchone()
    conn.close()

    if row is None:
        return None

    user = dict(row)
    point = user["total_point"]

    if point >= 600:
        room_level = 5
        room_name = "研究室の主ルーム"
        room_description = "研究も交流も楽しめる、かなり豪華な個人ルームです。"
    elif point >= 300:
        room_level = 4
        room_name = "快適作業ルーム"
        room_description = "作業環境が整い、集中しやすい部屋になってきました。"
    elif point >= 150:
        room_level = 3
        room_name = "研究セット部屋"
        room_description = "本とPCが増えて、研究できる雰囲気が出てきました。"
    elif point >= 50:
        room_level = 2
        room_name = "机と椅子の部屋"
        room_description = "最低限の作業スペースができました。"
    else:
        room_level = 1
        room_name = "何もない部屋"
        room_description = "まだ何もない部屋です。研究室に来てポイントを集めましょう。"

    return {
        "user": user,
        "room_level": room_level,
        "room_name": room_name,
        "room_description": room_description,
        "room_layout": get_room_layout(user_id),
        "owned_furniture": get_owned_furniture_ids(user_id),
        "shop_items": get_furniture_shop_items(user_id, room_level),
    }


def get_room_layout(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT layout_json
        FROM room_layouts
        WHERE user_id = ?
        """,
        (user_id,),
    )

    row = cur.fetchone()
    conn.close()

    if row is None:
        return []

    return json.loads(row["layout_json"])


def get_owned_furniture_ids(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT furniture_id
        FROM user_furniture
        WHERE user_id = ?
        """,
        (user_id,),
    )

    owned_ids = {row["furniture_id"] for row in cur.fetchall()}
    conn.close()

    for item in get_room_layout(user_id):
        furniture_id = item.get("id")
        if furniture_id and furniture_id != "chara":
            owned_ids.add(furniture_id)

    return sorted(owned_ids)


def get_furniture_shop_items(user_id: int, room_level: int):
    owned_ids = set(get_owned_furniture_ids(user_id))

    return [
        {
            **item,
            "owned": item["id"] in owned_ids,
            "unlocked": room_level >= item["min_level"],
        }
        for item in FURNITURE_CATALOG
    ]


def get_user_by_id(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, name, grade, point, total_point
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )

    row = cur.fetchone()
    conn.close()

    if row is None:
        return None

    return dict(row)


def purchase_furniture(user_id: int, furniture_id: str):
    item = next(
        (catalog_item for catalog_item in FURNITURE_CATALOG if catalog_item["id"] == furniture_id),
        None,
    )

    if item is None:
        return {"ok": False, "reason": "not_found"}

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, name, grade, point, total_point
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )
    user = cur.fetchone()

    if user is None:
        conn.close()
        return {"ok": False, "reason": "user_not_found"}

    cur.execute(
        """
        SELECT 1
        FROM user_furniture
        WHERE user_id = ? AND furniture_id = ?
        """,
        (user_id, furniture_id),
    )

    if cur.fetchone() is not None:
        conn.close()
        return {"ok": False, "reason": "already_owned"}

    if user["point"] < item["price"]:
        conn.close()
        return {"ok": False, "reason": "not_enough_point"}

    if get_room_level_from_point(user["total_point"]) < item["min_level"]:
        conn.close()
        return {"ok": False, "reason": "locked"}

    purchased_at = datetime.now().isoformat(timespec="seconds")

    cur.execute(
        """
        UPDATE users
        SET point = point - ?
        WHERE id = ?
        """,
        (item["price"], user_id),
    )

    cur.execute(
        """
        INSERT INTO user_furniture (user_id, furniture_id, purchased_at)
        VALUES (?, ?, ?)
        """,
        (user_id, furniture_id, purchased_at),
    )

    conn.commit()
    conn.close()

    return {
        "ok": True,
        "item": item,
        "user": get_user_by_id(user_id),
        "owned_furniture": get_owned_furniture_ids(user_id),
    }


def save_room_layout(user_id: int, items):
    conn = get_connection()
    cur = conn.cursor()
    updated_at = datetime.now().isoformat(timespec="seconds")
    layout_json = json.dumps(items, ensure_ascii=False)

    cur.execute(
        """
        INSERT INTO room_layouts (user_id, layout_json, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            layout_json = excluded.layout_json,
            updated_at = excluded.updated_at
        """,
        (user_id, layout_json, updated_at),
    )

    conn.commit()
    conn.close()
    return get_room_layout(user_id)
