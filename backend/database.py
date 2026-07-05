import sqlite3
from datetime import datetime
from passlib.context import CryptContext

DB_NAME = "isdl.db"

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


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
        point INTEGER NOT NULL DEFAULT 0
    )
    """)

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

    conn.commit()
    conn.close()


def create_user(name: str, grade: str, password: str):
    conn = get_connection()
    cur = conn.cursor()

    password_hash = hash_password(password)

    cur.execute(
        """
        INSERT INTO users (name, grade, password_hash, point)
        VALUES (?, ?, ?, 0)
        """,
        (name, grade, password_hash)
    )

    conn.commit()

    user_id = cur.lastrowid
    conn.close()

    return {
        "id": user_id,
        "name": name,
        "grade": grade,
        "point": 0
    }


def get_user_by_name(name: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, name, grade, password_hash, point
        FROM users
        WHERE name = ?
        """,
        (name,)
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
    SELECT id, name, grade, point
    FROM users
    ORDER BY point DESC
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
        (user_id, activity_type, point, created_at)
    )

    cur.execute(
        """
        UPDATE users
        SET point = point + ?
        WHERE id = ?
        """,
        (point, user_id)
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
        (user_id, today + "%")
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
        (user_id, "login", point, created_at)
    )

    cur.execute(
        """
        UPDATE users
        SET point = point + ?
        WHERE id = ?
        """,
        (point, user_id)
    )

    conn.commit()
    conn.close()

    return point

def get_village_status():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COALESCE(SUM(point), 0) AS total_point FROM users")
    total_point = cur.fetchone()["total_point"]

    today = datetime.now().date().isoformat()

    cur.execute(
        """
        SELECT COUNT(DISTINCT user_id) AS active_users
        FROM activities
        WHERE created_at LIKE ?
        """,
        (today + "%",)
    )
    active_users = cur.fetchone()["active_users"]

    conn.close()

    if total_point >= 1000:
        level = 5
        title = "ISDL都市"
        description = "研究室が完全に活性化している．みんなの活動で街のように発展した！"
    elif total_point >= 600:
        level = 4
        title = "にぎやかな研究室"
        description = "人が集まり，研究も交流も活発になってきた．"
    elif total_point >= 300:
        level = 3
        title = "活動中の研究室"
        description = "研究室に人が集まり始め，設備も少しずつ充実してきた．"
    elif total_point >= 100:
        level = 2
        title = "少し明るい研究室"
        description = "少しずつ人が来るようになり，研究室に活気が出てきた．"
    else:
        level = 1
        title = "静かな研究室"
        description = "まだ人が少なく，研究室は少し寂しい状態．"

    if active_users >= 6:
        weather = "快晴"
        weather_icon = "🌈"
    elif active_users >= 4:
        weather = "晴れ"
        weather_icon = "☀️"
    elif active_users >= 2:
        weather = "曇り"
        weather_icon = "☁️"
    elif active_users == 1:
        weather = "雨"
        weather_icon = "🌧️"
    else:
        weather = "雷雨"
        weather_icon = "⛈️"

    return {
        "total_point": total_point,
        "level": level,
        "title": title,
        "description": description,
        "active_users": active_users,
        "weather": weather,
        "weather_icon": weather_icon,
    }


def get_room_status(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, name, grade, point
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    row = cur.fetchone()
    conn.close()

    if row is None:
        return None

    user = dict(row)
    point = user["point"]

    if point >= 600:
        room_level = 5
        room_name = "研究室の主ルーム"
        room_icon = "🏆"
        room_description = "研究も交流も極めた，かなり豪華な個人ルーム．"
    elif point >= 300:
        room_level = 4
        room_name = "快適作業ルーム"
        room_icon = "🖥️"
        room_description = "作業環境が整い，集中しやすい部屋になってきた．"
    elif point >= 150:
        room_level = 3
        room_name = "研究セット部屋"
        room_icon = "📚"
        room_description = "本やPCが増えて，研究できる雰囲気が出てきた．"
    elif point >= 50:
        room_level = 2
        room_name = "机と椅子の部屋"
        room_icon = "🪑"
        room_description = "最低限の作業スペースができた．"
    else:
        room_level = 1
        room_name = "何もない部屋"
        room_icon = "📦"
        room_description = "まだ何もない．研究室に来てポイントを集めよう．"

    return {
        "user": user,
        "room_level": room_level,
        "room_name": room_name,
        "room_icon": room_icon,
        "room_description": room_description,
    }