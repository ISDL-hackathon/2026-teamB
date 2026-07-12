import json
import sqlite3
from datetime import datetime

from passlib.context import CryptContext


DB_NAME = "isdl.db"
LOGIN_POINT = 10
CHECKIN_POINT = 20

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

FURNITURE_CATALOG = [
    {"id": "window", "name": "Window", "price": 30, "min_level": 1},
    {"id": "clock", "name": "Clock", "price": 30, "min_level": 1},
    {"id": "stove", "name": "Stove", "price": 50, "min_level": 1},
    {"id": "bookshelf", "name": "Bookshelf", "price": 80, "min_level": 3},
    {"id": "shelf", "name": "Shelf", "price": 100, "min_level": 4},
    {"id": "bed", "name": "Bed", "price": 150, "min_level": 5},
]

VILLAGE_LEVELS = [
    (1000, 5, "ISDL都市", "研究室が完全に活性化しています。みんなの活動で街が大きく発展しました。"),
    (600, 4, "にぎやかな研究室", "人が集まり、研究や交流も活発になってきました。"),
    (300, 3, "活動中の研究室", "研究室に人が集まり始め、設備も少しずつ充実してきました。"),
    (100, 2, "少し明るい研究室", "少しずつ人が来るようになり、研究室に活気が出てきました。"),
    (0, 1, "静かな研究室", "まだ人が少なく、研究室は少し寂しい状態です。"),
]

WEATHER_BY_ACTIVE_USERS = [
    (8, "快晴"),
    (6, "晴れ"),
    (4, "曇り"),
    (2, "雨"),
    (0, "雷雨"),
]

ROOM_LEVELS = [
    (600, 5, "研究室の主ルーム", "研究も交流も楽しめる、かなり豪華な個人ルームです。"),
    (300, 4, "快適作業ルーム", "作業環境が整い、集中しやすい部屋になってきました。"),
    (150, 3, "研究セット部屋", "本とPCが増えて、研究できる雰囲気が出てきました。"),
    (50, 2, "机と椅子の部屋", "最低限の作業スペースができました。"),
    (0, 1, "何もない部屋", "まだ何もない部屋です。研究室に来てポイントを集めましょう。"),
]


def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def get_now():
    return datetime.now().isoformat(timespec="seconds")


def get_today_prefix():
    return f"{datetime.now().date().isoformat()}%"


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str):
    return pwd_context.verify(plain_password, password_hash)

def seed_village_slots(cur):
    slots = [
        ("pc1", 1, 2, "left", "chair", "机1奥", 1),
        ("pc2", 1, 7, "left", "chair", "机1手前", 2),
        ("pc3", 3, 6, "right", "chair", "机2左奥", 3),
        ("pc4", 6, 7, "left", "chair", "机2右手前", 4),
        ("pc5", 2, 18, "down", "fl_chair", "机3手前右", 5),
        ("pc6", 10, 5, "up", "chair", "机6奥左", 6),
    ]

    for slot in slots:
        cur.execute(
            """
            INSERT INTO village_slots
                (id, col, row, desk_direction, seat_type, label, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                col = excluded.col,
                row = excluded.row,
                desk_direction = excluded.desk_direction,
                seat_type = excluded.seat_type,
                label = excluded.label,
                sort_order = excluded.sort_order
            """,
            slot,
        )


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

    cur.execute("""
    CREATE TABLE IF NOT EXISTS village_slots (
    id TEXT PRIMARY KEY,
    col INTEGER NOT NULL,
    row INTEGER NOT NULL,
    desk_direction TEXT NOT NULL DEFAULT 'down',
    seat_type TEXT NOT NULL DEFAULT 'chair',
    label TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
    )
    """)

    cur.execute("PRAGMA table_info(village_slots)")
    slot_columns = {row["name"] for row in cur.fetchall()}

    if "desk_direction" not in slot_columns:
        cur.execute(
            "ALTER TABLE village_slots ADD COLUMN desk_direction TEXT NOT NULL DEFAULT 'down'"
        )

    if "seat_type" not in slot_columns:
        cur.execute(
            "ALTER TABLE village_slots ADD COLUMN seat_type TEXT NOT NULL DEFAULT 'chair'"
        )
    
    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_village_positions (
    user_id INTEGER PRIMARY KEY,
    slot_id TEXT NOT NULL UNIQUE,
    selected_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (slot_id) REFERENCES village_slots(id)
    )
    """)

    seed_village_slots(cur)
    conn.commit()
    conn.close()    


def create_user(name: str, grade: str, password: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO users (name, grade, password_hash, point, total_point)
        VALUES (?, ?, ?, 0, 0)
        """,
        (name, grade, hash_password(password)),
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
    return dict(row) if row is not None else None


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
    return dict(row) if row is not None else None


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

    cur.execute(
        """
        INSERT INTO activities (user_id, activity_type, point, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (user_id, activity_type, point, get_now()),
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

    cur.execute(
        """
        SELECT COUNT(*) AS count
        FROM activities
        WHERE user_id = ?
        AND activity_type = 'login'
        AND created_at LIKE ?
        """,
        (user_id, get_today_prefix()),
    )

    if cur.fetchone()["count"] > 0:
        conn.close()
        return 0

    cur.execute(
        """
        INSERT INTO activities (user_id, activity_type, point, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (user_id, "login", LOGIN_POINT, get_now()),
    )

    cur.execute(
        """
        UPDATE users
        SET point = point + ?,
            total_point = total_point + ?
        WHERE id = ?
        """,
        (LOGIN_POINT, LOGIN_POINT, user_id),
    )

    conn.commit()
    conn.close()
    return LOGIN_POINT


def get_room_level_from_point(point: int):
    return next(level for threshold, level, _, _ in ROOM_LEVELS if point >= threshold)


def get_village_status():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COALESCE(SUM(total_point), 0) AS total_point FROM users")
    total_point = cur.fetchone()["total_point"]

    cur.execute(
        """
        SELECT COUNT(DISTINCT user_id) AS active_users
        FROM activities
        WHERE created_at LIKE ?
        """,
        (get_today_prefix(),),
    )
    active_users = cur.fetchone()["active_users"]
    conn.close()

    _, level, title, description = next(
        status for status in VILLAGE_LEVELS if total_point >= status[0]
    )
    weather = next(
        weather for threshold, weather in WEATHER_BY_ACTIVE_USERS if active_users >= threshold
    )

    return {
        "total_point": total_point,
        "level": level,
        "title": title,
        "description": description,
        "active_users": active_users,
        "weather": weather,
    }


def get_room_status(user_id: int):
    user = get_user_by_id(user_id)

    if user is None:
        return None

    point = user["total_point"]
    _, room_level, room_name, room_description = next(
        status for status in ROOM_LEVELS if point >= status[0]
    )

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
        (user_id, furniture_id, get_now()),
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
    layout_json = json.dumps(items, ensure_ascii=False)

    cur.execute(
        """
        INSERT INTO room_layouts (user_id, layout_json, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            layout_json = excluded.layout_json,
            updated_at = excluded.updated_at
        """,
        (user_id, layout_json, get_now()),
    )

    conn.commit()
    conn.close()
    return get_room_layout(user_id)

def get_village_slots():
    # スロット一覧とそこを使っているユーザ情報を返す
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT
            vs.id,
            vs.col,
            vs.row,
            vs.desk_direction,
            vs.seat_type,
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
        """
    )

    slots = []
    for row in cur.fetchall():
        user = None
        if row["user_id"] is not None:
            user = {
                "id": row["user_id"],
                "name": row["user_name"],
                "grade": row["user_grade"],
            }

        slots.append(
            {
                "id": row["id"],
                "col": row["col"],
                "row": row["row"],
                "desk_direction": row["desk_direction"],
                "seat_type": row["seat_type"],
                "label": row["label"],
                "occupied": user is not None,
                "user": user,
            }
        )

    conn.close()
    return slots

def get_user_village_slot_id(user_id: int):
    # ログイン時にそのユーザが場所を選択済みかどうか確認する
    
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT slot_id
        FROM user_village_positions
        WHERE user_id = ?
        """,
        (user_id,),
    )

    row = cur.fetchone()
    conn.close()

    if row is None:
        return None

    return row["slot_id"]

def save_user_village_position(user_id: int, slot_id: str):
    # ユーザの選択した場所を保存する

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )
    if cur.fetchone() is None:
        conn.close()
        return {"ok": False, "reason": "user_not_found"}

    cur.execute(
        """
        SELECT id
        FROM village_slots
        WHERE id = ?
        AND is_active = 1
        """,
        (slot_id,),
    )
    if cur.fetchone() is None:
        conn.close()
        return {"ok": False, "reason": "slot_not_found"}

    cur.execute(
        """
        SELECT user_id
        FROM user_village_positions
        WHERE slot_id = ?
        """,
        (slot_id,),
    )
    occupied = cur.fetchone()
    if occupied is not None and occupied["user_id"] != user_id:
        conn.close()
        return {"ok": False, "reason": "slot_taken"}

    now = datetime.now().isoformat(timespec="seconds")

    try:
        cur.execute(
            """
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
            """,
            (user_id, slot_id, now, now),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.rollback()
        conn.close()
        return {"ok": False, "reason": "slot_taken"}

    conn.close()
    return {
        "ok": True,
        "user_id": user_id,
        "slot_id": slot_id,
    }
