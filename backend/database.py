import json
import secrets
import sqlite3
from datetime import datetime, timedelta

from passlib.context import CryptContext


DB_NAME = "isdl.db"
LOGIN_POINT = 10
CHECKIN_POINT = 20

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

FURNITURE_CATALOG = [
    {"id": "fan", "name": "扇風機", "price": 40, "min_level": 1, "category": "western", "surface": "floor"},
    {"id": "cactus", "name": "サボテン", "price": 30, "min_level": 1, "category": "western", "surface": "floor"},
    {"id": "flowering_cactus", "name": "花付きサボテン", "price": 45, "min_level": 2, "category": "western", "surface": "floor"},
    {"id": "sofa", "name": "ソファ", "price": 120, "min_level": 3, "category": "western", "surface": "floor"},
    {"id": "sunflower", "name": "ひまわり", "price": 50, "min_level": 2, "category": "western", "surface": "floor"},
    {"id": "round_table", "name": "丸テーブル", "price": 50, "min_level": 1, "category": "lab", "surface": "floor"},
    {"id": "office_chair", "name": "オフィスチェア", "price": 35, "min_level": 1, "category": "lab", "surface": "floor"},
    {"id": "bulletin_board", "name": "掲示板", "price": 15, "min_level": 1, "category": "lab", "surface": "wall"},
    {"id": "quest_board", "name": "クエストボード", "price": 15, "min_level": 1, "category": "lab", "surface": "floor"},
    {"id": "game_cabinet", "name": "ゲーム機", "price": 15, "min_level": 2, "category": "lab", "surface": "floor"},
    {"id": "window", "name": "窓", "price": 30, "min_level": 2, "category": "western", "surface": "wall"},
    {"id": "clock", "name": "時計", "price": 30, "min_level": 2, "category": "western", "surface": "wall"},
    {"id": "stove", "name": "ストーブ", "price": 50, "min_level": 2, "category": "western", "surface": "wall"},
    {"id": "bookshelf", "name": "本棚", "price": 80, "min_level": 3, "category": "western", "surface": "floor"},
    {"id": "shelf", "name": "棚", "price": 100, "min_level": 4, "category": "western", "surface": "floor"},
    {"id": "bed", "name": "ベッド", "price": 150, "min_level": 5, "category": "western", "surface": "floor"},
    {"id": "retro_tv", "name": "レトロテレビ", "price": 80, "min_level": 2, "category": "western", "surface": "floor"},
]

GACHA_COIN_PRICE = 10
AVATAR_CATALOG = {
    "izumi": {"id": "izumi", "name": "いずみ", "rarity": "ノーマル"},
    "nagano": {"id": "nagano", "name": "ながの", "rarity": "中当たり"},
    "abe": {"id": "abe", "name": "あべ", "rarity": "中当たり"},
    "daiki": {"id": "daiki", "name": "だいき", "rarity": "シークレット"},
    "maie": {"id": "maie", "name": "まいえ", "rarity": "大当たり"},
    "giant_robot": {"id": "giant_robot", "name": "白い機体", "rarity": "シークレット"},
}

ICON_CATALOG = {
    "hero": {"id": "hero", "name": "勇者", "rarity": "ノーマル", "kind": "icon"},
    "icon1": {"id": "icon1", "name": "屋根のねずみ", "rarity": "中当たり", "kind": "icon"},
    "icon2": {"id": "icon2", "name": "白猫アイコン", "rarity": "中当たり", "kind": "icon"},
    "icon3": {"id": "icon3", "name": "イービィ", "rarity": "中当たり", "kind": "icon"},
    "icon4": {"id": "icon4", "name": "もふもふ", "rarity": "大当たり", "kind": "icon"},
    "icon5": {"id": "icon5", "name": "かっぱ", "rarity": "中当たり", "kind": "icon"},
}

VILLAGE_LEVELS = [
    (2000, 5, "ISDL研究都市", "研究室全体が活発に動いています。みんなの活動で街が大きく発展しました。"),
    (1000, 4, "にぎやかな研究室", "人が集まり、研究や交流も活発になってきました。"),
    (500, 3, "活動中の研究室", "研究室に人が集まり始め、設備も少しずつ充実してきました。"),
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


BATTLE_MAX_GAUGE = 5
BATTLE_ACTION_TIME_LIMIT_SECONDS = 15
LOGIN_SESSION_TTL_SECONDS = 60
BATTLE_STAKES = {"free": 0, "10": 10, "50": 50}


def _resolve_battle_attack(attack: str, defense: str):
    if attack == "charge":
        return {"damage": 0, "text": "攻撃側は力をためた！"}
    if attack == "critical":
        if defense == "critical_guard":
            return {"damage": 0, "text": "クリティカル防御成功！必殺技を防いだ！"}
        return {"damage": 99, "text": "クリティカルヒット！一撃必殺！"}
    avoided = (attack == "high" and defense == "crouch") or (
        attack == "low" and defense == "jump"
    )
    if avoided:
        return {"damage": 0, "text": "防御成功！攻撃をかわした！"}
    if defense == "critical_guard":
        return {"damage": 2, "text": "クリティカル防御失敗！2ダメージ！"}
    return {"damage": 1, "text": "攻撃命中！1ダメージ！"}


def _get_battle_match(cur, match_id: int):
    cur.execute(
        """
        SELECT m.*,
               p1.name AS player1_name, p2.name AS player2_name,
               p1.point AS player1_point, p2.point AS player2_point,
               p1.total_point AS player1_total_point,
               p2.total_point AS player2_total_point
        FROM battle_matches AS m
        JOIN users AS p1 ON p1.id = m.player1_id
        JOIN users AS p2 ON p2.id = m.player2_id
        WHERE m.id = ?
        """,
        (match_id,),
    )
    row = cur.fetchone()
    return dict(row) if row else None


def _battle_snapshot(cur, match_id: int, user_id: int):
    match = _get_battle_match(cur, match_id)
    if not match or user_id not in (match["player1_id"], match["player2_id"]):
        return None

    is_player1 = match["player1_id"] == user_id
    cur.execute(
        "SELECT user_id, action FROM battle_moves WHERE match_id = ? AND turn = ?",
        (match_id, match["turn"]),
    )
    submitted_ids = {row["user_id"] for row in cur.fetchall()}
    opponent_id = match["player2_id"] if is_player1 else match["player1_id"]

    return {
        "id": match["id"],
        "turn": match["turn"],
        "status": match["status"],
        "winner_id": match["winner_id"],
        "result_text": match["result_text"],
        "last_my_action": match["last_player1_action"] if is_player1 else match["last_player2_action"],
        "last_opponent_action": match["last_player2_action"] if is_player1 else match["last_player1_action"],
        "my_role": "attack" if match["attacker_id"] == user_id else "defense",
        "my_life": match["player1_life"] if is_player1 else match["player2_life"],
        "my_gauge": match["player1_gauge"] if is_player1 else match["player2_gauge"],
        "opponent": {
            "id": opponent_id,
            "name": match["player2_name"] if is_player1 else match["player1_name"],
            "life": match["player2_life"] if is_player1 else match["player1_life"],
            "gauge": match["player2_gauge"] if is_player1 else match["player1_gauge"],
        },
        "my_submitted": user_id in submitted_ids,
        "opponent_submitted": opponent_id in submitted_ids,
        "stake_amount": match.get("stake_amount", 0),
        "my_stake": (
            match.get("stake_amount", 0) if is_player1 else match.get("player2_stake", 0)
        ),
        "opponent_stake": (
            match.get("player2_stake", 0) if is_player1 else match.get("stake_amount", 0)
        ),
        "pot_amount": match.get("stake_amount", 0) + match.get("player2_stake", 0),
        "points_settled": bool(match.get("points_settled", 0)),
        "my_point": match["player1_point"] if is_player1 else match["player2_point"],
        "my_total_point": (
            match["player1_total_point"] if is_player1 else match["player2_total_point"]
        ),
        "selection_deadline": (
            datetime.fromisoformat(match["updated_at"])
            + timedelta(seconds=BATTLE_ACTION_TIME_LIMIT_SECONDS)
        ).isoformat(timespec="seconds"),
    }


def matchmake_battle(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if cur.fetchone() is None:
        conn.close()
        return {"error": "ユーザーが存在しません", "status": 404}

    cur.execute(
        """
        SELECT id FROM battle_matches
        WHERE status = 'active' AND (player1_id = ? OR player2_id = ?)
        ORDER BY id DESC LIMIT 1
        """,
        (user_id, user_id),
    )
    active = cur.fetchone()
    if active:
        result = {"match": _battle_snapshot(cur, active["id"], user_id)}
        conn.close()
        return result

    cur.execute("SELECT user_id FROM battle_queue WHERE user_id = ?", (user_id,))
    if cur.fetchone() is None:
        cur.execute(
            "INSERT INTO battle_queue (user_id, joined_at) VALUES (?, ?)",
            (user_id, get_now()),
        )

    cur.execute(
        """
        SELECT q.user_id FROM battle_queue AS q
        WHERE q.user_id != ?
          AND NOT EXISTS (
            SELECT 1 FROM battle_matches AS m
            WHERE m.status = 'active'
              AND (m.player1_id = q.user_id OR m.player2_id = q.user_id)
          )
        ORDER BY q.joined_at ASC LIMIT 1
        """,
        (user_id,),
    )
    opponent = cur.fetchone()
    if opponent is None:
        conn.commit()
        conn.close()
        return {"waiting": True}

    opponent_id = opponent["user_id"]
    now = get_now()
    cur.execute("DELETE FROM battle_queue WHERE user_id IN (?, ?)", (user_id, opponent_id))
    cur.execute(
        """
        INSERT INTO battle_matches (player1_id, player2_id, attacker_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (opponent_id, user_id, opponent_id, now, now),
    )
    match_id = cur.lastrowid
    conn.commit()
    result = {"match": _battle_snapshot(cur, match_id, user_id)}
    conn.close()
    return result


def list_battle_rooms(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT point, total_point FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if user is None:
        conn.close()
        return None

    cur.execute(
        """
        SELECT id FROM battle_matches
        WHERE status = 'active' AND (player1_id = ? OR player2_id = ?)
        ORDER BY id DESC LIMIT 1
        """,
        (user_id, user_id),
    )
    active = cur.fetchone()
    active_match = _battle_snapshot(cur, active["id"], user_id) if active else None

    cur.execute(
        """
        SELECT r.id, r.host_id, u.name AS host_name, r.stake_type, r.stake_amount,
               r.created_at
        FROM battle_rooms AS r
        JOIN users AS u ON u.id = r.host_id
        WHERE r.status = 'waiting'
        ORDER BY r.created_at ASC, r.id ASC
        """
    )
    rooms = [dict(row) for row in cur.fetchall()]
    own_room = next((room for room in rooms if room["host_id"] == user_id), None)
    conn.close()
    return {
        "rooms": rooms,
        "own_room": own_room,
        "active_match": active_match,
        "my_point": user["point"],
        "my_total_point": user["total_point"],
    }


def create_battle_room(user_id: int, stake_type: str):
    if stake_type not in (*BATTLE_STAKES.keys(), "all"):
        return {"error": "賭けポイントが不正です", "status": 400}

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("BEGIN IMMEDIATE")
    cur.execute("SELECT point FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if user is None:
        conn.close()
        return {"error": "ユーザーが存在しません", "status": 404}
    cur.execute(
        "SELECT 1 FROM battle_matches WHERE status = 'active' "
        "AND (player1_id = ? OR player2_id = ?)",
        (user_id, user_id),
    )
    if cur.fetchone() is not None:
        conn.close()
        return {"error": "対戦中は部屋を作れません", "status": 409}
    cur.execute(
        "SELECT 1 FROM battle_rooms WHERE host_id = ? AND status = 'waiting'",
        (user_id,),
    )
    if cur.fetchone() is not None:
        conn.close()
        return {"error": "すでに部屋を作っています", "status": 409}

    stake_amount = user["point"] if stake_type == "all" else BATTLE_STAKES[stake_type]
    if stake_type == "all" and stake_amount <= 0:
        conn.close()
        return {"error": "全額勝負に使えるポイントがありません", "status": 400}
    if user["point"] < stake_amount:
        conn.close()
        return {"error": "ポイントが足りません", "status": 400}

    now = get_now()
    try:
        cur.execute(
            """
            INSERT INTO battle_rooms (host_id, stake_type, stake_amount, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, stake_type, stake_amount, now, now),
        )
        room_id = cur.lastrowid
        conn.commit()
    except sqlite3.IntegrityError:
        conn.rollback()
        conn.close()
        return {"error": "部屋を作成できませんでした", "status": 409}
    conn.close()
    return {"room_id": room_id, "stake_amount": stake_amount}


def join_battle_room(room_id: int, user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("BEGIN IMMEDIATE")
    cur.execute(
        "SELECT id, host_id, stake_type, stake_amount, status FROM battle_rooms WHERE id = ?",
        (room_id,),
    )
    room = cur.fetchone()
    if room is None or room["status"] != "waiting":
        conn.close()
        return {"error": "この部屋には参加できません", "status": 409}
    if room["host_id"] == user_id:
        conn.close()
        return {"error": "自分の部屋には参加できません", "status": 400}
    cur.execute("SELECT point FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if user is None:
        conn.close()
        return {"error": "ユーザーが存在しません", "status": 404}
    player2_stake = user["point"] if room["stake_type"] == "all" else room["stake_amount"]
    if room["stake_type"] == "all" and player2_stake <= 0:
        conn.close()
        return {"error": "全額勝負に使えるポイントがありません", "status": 400}
    if user["point"] < player2_stake:
        conn.close()
        return {"error": "この部屋に必要なポイントが足りません", "status": 400}
    cur.execute(
        "SELECT 1 FROM battle_matches WHERE status = 'active' "
        "AND (player1_id = ? OR player2_id = ?)",
        (user_id, user_id),
    )
    if cur.fetchone() is not None:
        conn.close()
        return {"error": "すでに対戦中です", "status": 409}

    now = get_now()
    try:
        cur.execute(
            """
            INSERT INTO battle_matches (
                room_id, player1_id, player2_id, attacker_id,
                stake_amount, player2_stake, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                room["id"], room["host_id"], user_id, room["host_id"],
                room["stake_amount"], player2_stake, now, now,
            ),
        )
        match_id = cur.lastrowid
        conn.commit()
    except sqlite3.IntegrityError:
        conn.rollback()
        conn.close()
        return {"error": "ほかのユーザーが先に参加しました", "status": 409}

    result = {"match": _battle_snapshot(cur, match_id, user_id)}
    conn.close()
    return result


def cancel_battle_room(room_id: int, user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE battle_rooms SET status = 'cancelled', updated_at = ?
        WHERE id = ? AND host_id = ? AND status = 'waiting'
        """,
        (get_now(), room_id, user_id),
    )
    cancelled = cur.rowcount > 0
    conn.commit()
    conn.close()
    return cancelled


def get_battle_snapshot(match_id: int, user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    result = _battle_snapshot(cur, match_id, user_id)
    match = _get_battle_match(cur, match_id)
    missing_user_ids = []
    if match and match["status"] == "active":
        deadline = datetime.fromisoformat(match["updated_at"]) + timedelta(
            seconds=BATTLE_ACTION_TIME_LIMIT_SECONDS
        )
        if datetime.now() >= deadline:
            cur.execute(
                "SELECT user_id FROM battle_moves WHERE match_id = ? AND turn = ?",
                (match_id, match["turn"]),
            )
            submitted_ids = {row["user_id"] for row in cur.fetchall()}
            missing_user_ids = [
                player_id
                for player_id in (match["player1_id"], match["player2_id"])
                if player_id not in submitted_ids
            ]
    conn.close()

    for missing_user_id in missing_user_ids:
        submit_battle_move(match_id, missing_user_id, "charge")

    if missing_user_ids:
        conn = get_connection()
        result = _battle_snapshot(conn.cursor(), match_id, user_id)
        conn.close()
    return result


def submit_battle_move(match_id: int, user_id: int, action: str):
    conn = get_connection()
    cur = conn.cursor()
    match = _get_battle_match(cur, match_id)
    if not match or match["status"] != "active":
        conn.close()
        return {"error": "対戦が見つかりません", "status": 404}
    if user_id not in (match["player1_id"], match["player2_id"]):
        conn.close()
        return {"error": "この対戦には参加していません", "status": 403}

    is_attacker = match["attacker_id"] == user_id
    allowed = ("charge", "high", "low", "critical") if is_attacker else (
        "charge", "jump", "crouch", "critical_guard"
    )
    if action not in allowed:
        conn.close()
        return {"error": "選択できない行動です", "status": 400}

    is_player1 = match["player1_id"] == user_id
    gauge = match["player1_gauge"] if is_player1 else match["player2_gauge"]
    if action == "critical" and gauge < 3:
        conn.close()
        return {"error": "ゲージが足りません", "status": 400}
    if action == "critical_guard" and gauge < 2:
        conn.close()
        return {"error": "ゲージが足りません", "status": 400}

    try:
        cur.execute(
            """
            INSERT INTO battle_moves (match_id, user_id, turn, action, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (match_id, user_id, match["turn"], action, get_now()),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        result = {"match": _battle_snapshot(cur, match_id, user_id)}
        conn.close()
        return result

    cur.execute(
        "SELECT user_id, action FROM battle_moves WHERE match_id = ? AND turn = ?",
        (match_id, match["turn"]),
    )
    moves = cur.fetchall()
    if len(moves) < 2:
        result = {"match": _battle_snapshot(cur, match_id, user_id)}
        conn.close()
        return result

    move_map = {row["user_id"]: row["action"] for row in moves}
    p1_action = move_map[match["player1_id"]]
    p2_action = move_map[match["player2_id"]]
    attack_action = move_map[match["attacker_id"]]
    defender_id = match["player2_id"] if match["attacker_id"] == match["player1_id"] else match["player1_id"]
    defense_action = move_map[defender_id]
    battle_result = _resolve_battle_attack(attack_action, defense_action)

    def apply_gauge(current, selected):
        if selected == "charge":
            return min(BATTLE_MAX_GAUGE, current + 1)
        if selected == "critical":
            return current - 3
        if selected == "critical_guard":
            return current - 2
        return current

    p1_life, p2_life = match["player1_life"], match["player2_life"]
    p1_gauge = apply_gauge(match["player1_gauge"], p1_action)
    p2_gauge = apply_gauge(match["player2_gauge"], p2_action)
    damage = battle_result["damage"]
    if defender_id == match["player1_id"]:
        p1_life = 0 if damage >= 99 else max(0, p1_life - damage)
    else:
        p2_life = 0 if damage >= 99 else max(0, p2_life - damage)

    winner_id = match["player2_id"] if p1_life <= 0 else (
        match["player1_id"] if p2_life <= 0 else None
    )
    cur.execute(
        """
        UPDATE battle_matches SET
          player1_life = ?, player2_life = ?, player1_gauge = ?, player2_gauge = ?,
          attacker_id = ?, turn = ?, status = ?, winner_id = ?,
          last_player1_action = ?, last_player2_action = ?, result_text = ?, updated_at = ?
        WHERE id = ? AND turn = ?
        """,
        (
            p1_life, p2_life, p1_gauge, p2_gauge, defender_id, match["turn"] + 1,
            "finished" if winner_id else "active", winner_id, p1_action, p2_action,
            battle_result["text"], get_now(), match_id, match["turn"],
        ),
    )
    if winner_id:
        _complete_daily_quest(cur, match["player1_id"], "play_together")
        _complete_daily_quest(cur, match["player2_id"], "play_together")
    conn.commit()
    result = {"match": _battle_snapshot(cur, match_id, user_id)}
    conn.close()
    return result


def cancel_battle_queue(user_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM battle_queue WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()


def forfeit_battle(match_id: int, user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    match = _get_battle_match(cur, match_id)
    if not match or user_id not in (match["player1_id"], match["player2_id"]):
        conn.close()
        return False
    if match["status"] == "active":
        winner_id = match["player2_id"] if match["player1_id"] == user_id else match["player1_id"]
        cur.execute(
            """
            UPDATE battle_matches
            SET status = 'finished', winner_id = ?, result_text = '相手が退出しました', updated_at = ?
            WHERE id = ? AND status = 'active'
            """,
            (winner_id, get_now(), match_id),
        )
        conn.commit()
    conn.close()
    return True


MAHJONG_WINDS = ("東", "南", "西", "北")


def _mahjong_event(cur, room_id: int, event_type: str, payload=None):
    cur.execute(
        "INSERT INTO mahjong_events (room_id, event_type, payload_json, created_at) "
        "VALUES (?, ?, ?, ?)",
        (room_id, event_type, json.dumps(payload or {}, ensure_ascii=False), get_now()),
    )


def _mahjong_snapshot(cur, room_id: int, user_id: int):
    cur.execute("SELECT * FROM mahjong_rooms WHERE id = ?", (room_id,))
    room_row = cur.fetchone()
    if room_row is None:
        return None
    room = dict(room_row)
    cur.execute(
        """
        SELECT mp.user_id, u.name, mp.join_order, mp.seat_index, mp.score,
               mp.riichi_declared, mp.app_point_reward,
               u.point AS app_point, u.total_point AS app_total_point
        FROM mahjong_players mp
        JOIN users u ON u.id = mp.user_id
        WHERE mp.room_id = ?
        ORDER BY COALESCE(mp.seat_index, mp.join_order), mp.join_order
        """,
        (room_id,),
    )
    players = [dict(row) for row in cur.fetchall()]
    if user_id not in {player["user_id"] for player in players}:
        return None

    for player in players:
        if player["seat_index"] is None:
            player["wind"] = None
            player["is_dealer"] = False
        else:
            wind_index = (player["seat_index"] - room["dealer_seat"]) % 4
            player["wind"] = MAHJONG_WINDS[wind_index]
            player["is_dealer"] = player["seat_index"] == room["dealer_seat"]

    cur.execute(
        """
        SELECT event_type, payload_json, created_at
        FROM mahjong_events WHERE room_id = ?
        ORDER BY id DESC LIMIT 12
        """,
        (room_id,),
    )
    history = [
        {
            "event_type": row["event_type"],
            "payload": json.loads(row["payload_json"]),
            "created_at": row["created_at"],
        }
        for row in cur.fetchall()
    ]
    ranking = sorted(players, key=lambda player: (-player["score"], player["join_order"]))
    return {
        **room,
        "players": players,
        "ranking": ranking,
        "history": history,
        "is_host": room["host_id"] == user_id,
        "current_user_id": user_id,
        "round_label": f"{'東' if room['round_wind'] == 'east' else '南'}{room['round_number']}局",
    }


def get_mahjong_room(room_id: int, user_id: int):
    conn = get_connection()
    result = _mahjong_snapshot(conn.cursor(), room_id, user_id)
    conn.close()
    return result


def get_current_mahjong_room(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT r.id
        FROM mahjong_rooms r
        JOIN mahjong_players p ON p.room_id = r.id
        WHERE p.user_id = ? AND r.status IN ('waiting', 'playing')
        ORDER BY r.id DESC LIMIT 1
        """,
        (user_id,),
    )
    row = cur.fetchone()
    result = _mahjong_snapshot(cur, row["id"], user_id) if row else None
    conn.close()
    return result


def create_mahjong_room(user_id: int, game_type: str, stake_amount: int = 0, starting_score: int = 25000):
    if game_type not in ("tonpu", "hanchan"):
        return {"error": "対局形式が不正です", "status": 400}
    if stake_amount not in (0, 10, 50):
        return {"error": "参加ポイントが不正です", "status": 400}
    if starting_score not in (25000, 35000):
        return {"error": "開始点数が不正です", "status": 400}
    if get_current_mahjong_room(user_id):
        return {"error": "すでに参加中の麻雀部屋があります", "status": 409}

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, point FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if user is None:
        conn.close()
        return {"error": "ユーザーが存在しません", "status": 404}
    if user["point"] < stake_amount:
        conn.close()
        return {"error": "部屋作成に必要なポイントが足りません", "status": 400}
    room_code = None
    for _ in range(20):
        candidate = f"{secrets.randbelow(1_000_000):06d}"
        cur.execute("SELECT 1 FROM mahjong_rooms WHERE room_code = ?", (candidate,))
        if cur.fetchone() is None:
            room_code = candidate
            break
    if room_code is None:
        conn.close()
        return {"error": "部屋番号を作成できませんでした", "status": 500}

    now = get_now()
    dice1, dice2 = secrets.randbelow(6) + 1, secrets.randbelow(6) + 1
    cur.execute(
        """
        INSERT INTO mahjong_rooms (
            room_code, host_id, game_type, dice1, dice2, stake_amount, starting_score, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (room_code, user_id, game_type, dice1, dice2, stake_amount, starting_score, now, now),
    )
    room_id = cur.lastrowid
    cur.execute(
        """
        INSERT INTO mahjong_players (room_id, user_id, join_order, score, joined_at)
        VALUES (?, ?, 0, ?, ?)
        """,
        (room_id, user_id, starting_score, now),
    )
    cur.execute(
        "UPDATE users SET point = point - ?, total_point = total_point - ? WHERE id = ?",
        (stake_amount, stake_amount, user_id),
    )
    _mahjong_event(cur, room_id, "room_created", {"user_id": user_id})
    conn.commit()
    result = {"room": _mahjong_snapshot(cur, room_id, user_id)}
    conn.close()
    return result


def list_open_mahjong_rooms():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT r.id, r.host_id, u.name AS host_name, r.game_type, r.stake_amount, r.starting_score, r.created_at,
               COUNT(p.user_id) AS player_count
        FROM mahjong_rooms r
        JOIN users u ON u.id = r.host_id
        JOIN mahjong_players p ON p.room_id = r.id
        WHERE r.status = 'waiting'
        GROUP BY r.id, r.host_id, u.name, r.game_type, r.stake_amount, r.starting_score, r.created_at
        HAVING COUNT(p.user_id) < 4
        ORDER BY r.created_at DESC, r.id DESC
        """
    )
    result = [dict(row) for row in cur.fetchall()]
    conn.close()
    return result


def _join_mahjong_room(user_id: int, room_id=None, room_code=None):
    if get_current_mahjong_room(user_id):
        return {"error": "すでに参加中の麻雀部屋があります", "status": 409}
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("BEGIN IMMEDIATE")
    if room_id is not None:
        cur.execute(
            "SELECT id, stake_amount, starting_score FROM mahjong_rooms WHERE id = ? AND status = 'waiting'",
            (room_id,),
        )
    else:
        cur.execute(
            "SELECT id, stake_amount, starting_score FROM mahjong_rooms WHERE room_code = ? AND status = 'waiting'",
            (room_code.strip(),),
        )
    room = cur.fetchone()
    if room is None:
        conn.close()
        return {"error": "参加できる部屋が見つかりません", "status": 404}
    cur.execute("SELECT point FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if user is None or user["point"] < room["stake_amount"]:
        conn.close()
        return {"error": "参加に必要なポイントが足りません", "status": 400}
    cur.execute("SELECT COUNT(*) AS count FROM mahjong_players WHERE room_id = ?", (room["id"],))
    count = cur.fetchone()["count"]
    if count >= 4:
        conn.close()
        return {"error": "この部屋は満員です", "status": 409}
    try:
        cur.execute(
            """
            INSERT INTO mahjong_players (room_id, user_id, join_order, score, joined_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (room["id"], user_id, count, room["starting_score"], get_now()),
        )
        cur.execute(
            "UPDATE users SET point = point - ?, total_point = total_point - ? WHERE id = ?",
            (room["stake_amount"], room["stake_amount"], user_id),
        )
        _mahjong_event(cur, room["id"], "player_joined", {"user_id": user_id})
        conn.commit()
    except sqlite3.IntegrityError:
        conn.rollback()
        conn.close()
        return {"error": "この部屋には参加できません", "status": 409}
    result = {"room": _mahjong_snapshot(cur, room["id"], user_id)}
    conn.close()
    return result


def join_mahjong_room(user_id: int, room_code: str):
    return _join_mahjong_room(user_id, room_code=room_code)


def join_mahjong_room_by_id(user_id: int, room_id: int):
    return _join_mahjong_room(user_id, room_id=room_id)


def leave_mahjong_room(room_id: int, user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("BEGIN IMMEDIATE")
    cur.execute(
        "SELECT host_id, status, stake_amount FROM mahjong_rooms WHERE id = ?",
        (room_id,),
    )
    room = cur.fetchone()
    if room is None or room["status"] != "waiting":
        conn.close()
        return {"error": "参加待ちの部屋からのみ退出できます", "status": 403}
    cur.execute(
        "SELECT 1 FROM mahjong_players WHERE room_id = ? AND user_id = ?",
        (room_id, user_id),
    )
    if cur.fetchone() is None:
        conn.close()
        return {"error": "この部屋に参加していません", "status": 404}

    if room["host_id"] == user_id:
        cur.execute("SELECT user_id FROM mahjong_players WHERE room_id = ?", (room_id,))
        player_ids = [row["user_id"] for row in cur.fetchall()]
        for player_id in player_ids:
            cur.execute(
                "UPDATE users SET point = point + ?, total_point = total_point + ? WHERE id = ?",
                (room["stake_amount"], room["stake_amount"], player_id),
            )
        cur.execute("DELETE FROM mahjong_events WHERE room_id = ?", (room_id,))
        cur.execute("DELETE FROM mahjong_players WHERE room_id = ?", (room_id,))
        cur.execute("DELETE FROM mahjong_rooms WHERE id = ?", (room_id,))
    else:
        cur.execute(
            "DELETE FROM mahjong_players WHERE room_id = ? AND user_id = ?",
            (room_id, user_id),
        )
        cur.execute(
            "UPDATE users SET point = point + ?, total_point = total_point + ? WHERE id = ?",
            (room["stake_amount"], room["stake_amount"], user_id),
        )
        cur.execute(
            "SELECT user_id FROM mahjong_players WHERE room_id = ? ORDER BY join_order, user_id",
            (room_id,),
        )
        for join_order, row in enumerate(cur.fetchall()):
            cur.execute(
                "UPDATE mahjong_players SET join_order = ? WHERE room_id = ? AND user_id = ?",
                (join_order, room_id, row["user_id"]),
            )
    conn.commit()
    conn.close()
    return {"room": None, "closed": room["host_id"] == user_id}


def start_mahjong_room(room_id: int, user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT host_id, status FROM mahjong_rooms WHERE id = ?", (room_id,))
    room = cur.fetchone()
    if room is None or room["host_id"] != user_id or room["status"] != "waiting":
        conn.close()
        return {"error": "対局を開始できません", "status": 403}
    cur.execute("SELECT user_id FROM mahjong_players WHERE room_id = ?", (room_id,))
    player_ids = [row["user_id"] for row in cur.fetchall()]
    if len(player_ids) != 4:
        conn.close()
        return {"error": "4人揃うまで開始できません", "status": 400}
    secrets.SystemRandom().shuffle(player_ids)
    for seat_index, player_id in enumerate(player_ids):
        cur.execute(
            "UPDATE mahjong_players SET seat_index = ? WHERE room_id = ? AND user_id = ?",
            (seat_index, room_id, player_id),
        )
    dice1, dice2 = secrets.randbelow(6) + 1, secrets.randbelow(6) + 1
    cur.execute(
        """
        UPDATE mahjong_rooms SET status = 'playing', dealer_seat = 0,
          dice1 = ?, dice2 = ?, updated_at = ? WHERE id = ?
        """,
        (dice1, dice2, get_now(), room_id),
    )
    _mahjong_event(cur, room_id, "game_started", {"seat_order": player_ids})
    conn.commit()
    result = {"room": _mahjong_snapshot(cur, room_id, user_id)}
    conn.close()
    return result


def roll_mahjong_dice(room_id: int, user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT host_id, status FROM mahjong_rooms WHERE id = ?", (room_id,))
    room = cur.fetchone()
    if room is None or room["host_id"] != user_id or room["status"] != "playing":
        conn.close()
        return False
    dice1, dice2 = secrets.randbelow(6) + 1, secrets.randbelow(6) + 1
    cur.execute(
        "UPDATE mahjong_rooms SET dice1 = ?, dice2 = ?, updated_at = ? WHERE id = ?",
        (dice1, dice2, get_now(), room_id),
    )
    _mahjong_event(cur, room_id, "dice", {"dice1": dice1, "dice2": dice2})
    conn.commit()
    conn.close()
    return True


def declare_mahjong_riichi(room_id: int, user_id: int, target_user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("BEGIN IMMEDIATE")
    cur.execute("SELECT host_id, status FROM mahjong_rooms WHERE id = ?", (room_id,))
    room = cur.fetchone()
    if room is None or room["status"] != "playing" or user_id != room["host_id"]:
        conn.close()
        return {"error": "リーチを登録できません", "status": 403}
    cur.execute(
        "SELECT score, riichi_declared FROM mahjong_players WHERE room_id = ? AND user_id = ?",
        (room_id, target_user_id),
    )
    player = cur.fetchone()
    if player is None or player["score"] < 1000:
        conn.close()
        return {"error": "リーチに必要な点数がありません", "status": 400}
    if player["riichi_declared"]:
        conn.close()
        return {"error": "この局ではすでにリーチしています", "status": 409}
    cur.execute(
        """
        UPDATE mahjong_players
        SET score = score - 1000, riichi_declared = 1
        WHERE room_id = ? AND user_id = ?
        """,
        (room_id, target_user_id),
    )
    cur.execute(
        "UPDATE mahjong_rooms SET riichi_sticks = riichi_sticks + 1, updated_at = ? WHERE id = ?",
        (get_now(), room_id),
    )
    _mahjong_event(cur, room_id, "riichi", {"user_id": target_user_id})
    conn.commit()
    result = {"room": _mahjong_snapshot(cur, room_id, user_id)}
    conn.close()
    return result


def cancel_mahjong_riichi(room_id: int, user_id: int, target_user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("BEGIN IMMEDIATE")
    cur.execute(
        "SELECT host_id, status, riichi_sticks FROM mahjong_rooms WHERE id = ?",
        (room_id,),
    )
    room = cur.fetchone()
    if room is None or room["status"] != "playing" or user_id != room["host_id"]:
        conn.close()
        return {"error": "リーチを解除できません", "status": 403}
    cur.execute(
        "SELECT riichi_declared FROM mahjong_players WHERE room_id = ? AND user_id = ?",
        (room_id, target_user_id),
    )
    player = cur.fetchone()
    if player is None or not player["riichi_declared"] or room["riichi_sticks"] <= 0:
        conn.close()
        return {"error": "このプレイヤーはリーチしていません", "status": 409}
    cur.execute(
        """
        UPDATE mahjong_players
        SET score = score + 1000, riichi_declared = 0
        WHERE room_id = ? AND user_id = ?
        """,
        (room_id, target_user_id),
    )
    cur.execute(
        "UPDATE mahjong_rooms SET riichi_sticks = riichi_sticks - 1, updated_at = ? WHERE id = ?",
        (get_now(), room_id),
    )
    _mahjong_event(cur, room_id, "riichi_cancelled", {"user_id": target_user_id})
    conn.commit()
    result = {"room": _mahjong_snapshot(cur, room_id, user_id)}
    conn.close()
    return result


def _settle_mahjong_points(cur, room_id: int):
    cur.execute(
        "SELECT stake_amount, points_settled, status FROM mahjong_rooms WHERE id = ?",
        (room_id,),
    )
    room = cur.fetchone()
    if room is None or room["status"] != "finished" or room["points_settled"]:
        return
    cur.execute(
        "SELECT user_id, score FROM mahjong_players WHERE room_id = ?",
        (room_id,),
    )
    players = [dict(row) for row in cur.fetchall()]
    pot = room["stake_amount"] * len(players)
    positive_total = sum(max(0, player["score"]) for player in players)
    rewards = {player["user_id"]: 0 for player in players}
    if pot > 0 and positive_total > 0:
        fractions = []
        distributed = 0
        for player in players:
            numerator = pot * max(0, player["score"])
            reward = numerator // positive_total
            rewards[player["user_id"]] = reward
            distributed += reward
            fractions.append((numerator % positive_total, player["score"], -player["user_id"], player["user_id"]))
        fractions.sort(reverse=True)
        for index in range(pot - distributed):
            rewards[fractions[index][3]] += 1

    for player in players:
        reward = rewards[player["user_id"]]
        cur.execute(
            "UPDATE users SET point = point + ?, total_point = total_point + ? WHERE id = ?",
            (reward, reward, player["user_id"]),
        )
        cur.execute(
            "UPDATE mahjong_players SET app_point_reward = ? WHERE room_id = ? AND user_id = ?",
            (reward, room_id, player["user_id"]),
        )
    cur.execute("UPDATE mahjong_rooms SET points_settled = 1 WHERE id = ?", (room_id,))
    _mahjong_event(cur, room_id, "point_distribution", {"pot": pot, "rewards": rewards})


def finish_mahjong_room(room_id: int, user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE mahjong_rooms SET status = 'finished', updated_at = ?
        WHERE id = ? AND host_id = ? AND status = 'playing'
        """,
        (get_now(), room_id, user_id),
    )
    finished = cur.rowcount > 0
    if finished:
        _mahjong_event(cur, room_id, "game_finished", {"reason": "manual"})
        _settle_mahjong_points(cur, room_id)
        cur.execute("SELECT user_id FROM mahjong_players WHERE room_id = ?", (room_id,))
        for player in cur.fetchall():
            _complete_daily_quest(cur, player["user_id"], "play_together")
    conn.commit()
    result = {"room": _mahjong_snapshot(cur, room_id, user_id)} if finished else None
    conn.close()
    return result


def submit_mahjong_hand(
    room_id: int,
    user_id: int,
    adjustments: dict,
    dealer_continues: bool,
    riichi_winner_id=None,
    note: str = "",
):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("BEGIN IMMEDIATE")
    cur.execute("SELECT * FROM mahjong_rooms WHERE id = ?", (room_id,))
    room = cur.fetchone()
    if room is None or room["host_id"] != user_id or room["status"] != "playing":
        conn.close()
        return {"error": "局結果を登録できません", "status": 403}
    cur.execute("SELECT user_id FROM mahjong_players WHERE room_id = ?", (room_id,))
    player_ids = {row["user_id"] for row in cur.fetchall()}
    try:
        normalized = {int(key): int(value) for key, value in adjustments.items()}
    except (TypeError, ValueError):
        conn.close()
        return {"error": "点数入力が不正です", "status": 400}
    if not set(normalized).issubset(player_ids) or sum(normalized.values()) != 0:
        conn.close()
        return {"error": "点数変動の合計を0にしてください", "status": 400}
    for player_id in player_ids:
        cur.execute(
            "UPDATE mahjong_players SET score = score + ? WHERE room_id = ? AND user_id = ?",
            (normalized.get(player_id, 0), room_id, player_id),
        )
    if riichi_winner_id is not None:
        if riichi_winner_id not in player_ids:
            conn.close()
            return {"error": "供託の受取人が不正です", "status": 400}
        cur.execute(
            "UPDATE mahjong_players SET score = score + ? WHERE room_id = ? AND user_id = ?",
            (room["riichi_sticks"] * 1000, room_id, riichi_winner_id),
        )

    next_status = "playing"
    next_wind = room["round_wind"]
    next_round = room["round_number"]
    next_dealer = room["dealer_seat"]
    next_honba = room["honba"] + 1 if dealer_continues else 0
    if not dealer_continues:
        next_dealer = (room["dealer_seat"] + 1) % 4
        next_round += 1
        if next_round > 4:
            if room["round_wind"] == "east" and room["game_type"] == "hanchan":
                next_wind, next_round = "south", 1
            else:
                next_status = "finished"
    dice1, dice2 = secrets.randbelow(6) + 1, secrets.randbelow(6) + 1
    payload = {
        "adjustments": normalized,
        "dealer_continues": dealer_continues,
        "riichi_winner_id": riichi_winner_id,
        "note": note.strip()[:100],
    }
    cur.execute(
        """
        UPDATE mahjong_rooms SET status = ?, round_wind = ?, round_number = ?,
          dealer_seat = ?, honba = ?, riichi_sticks = ?, dice1 = ?, dice2 = ?, updated_at = ?
        WHERE id = ?
        """,
        (
            next_status, next_wind, next_round, next_dealer, next_honba,
            0 if riichi_winner_id is not None else room["riichi_sticks"],
            dice1, dice2, get_now(), room_id,
        ),
    )
    cur.execute(
        "UPDATE mahjong_players SET riichi_declared = 0 WHERE room_id = ?",
        (room_id,),
    )
    if next_status == "finished":
        _settle_mahjong_points(cur, room_id)
    _mahjong_event(cur, room_id, "hand_result", payload)
    conn.commit()
    result = {"room": _mahjong_snapshot(cur, room_id, user_id)}
    conn.close()
    return result

def seed_village_slots(cur):
    slots = [
        ("pc1", 1, 3, "left", "chair", "机1", 1),
	    ("pc2", 1, 5, "left", "chair", "机1", 2),
	    ("pc3", 1, 8, "left", "chair", "机1", 3),
	    ("pc4", 6, 4, "right", "chair", "机2", 4),
	    ("pc5", 6, 7, "right", "chair", "机2", 5),
	    ("pc6", 7, 4, "left", "chair", "机2", 6),
	    ("pc7", 1, 6, "left", "chair", "机2", 7),
	    ("pc8", 17, 3, "down", "fl_chair", "机3", 8),
	    ("pc9", 19, 3, "down", "chair", "机3", 9),
	    ("pc10", 18, 6, "down", "chair", "机4", 10),
	    ("pc11", 16, 6, "up", "chair", "机4", 11),
	    ("pc12", 1, 12, "left", "chair", "机5", 12),
	    ("pc13", 1, 14, "left", "chair", "机5", 13),
	    ("pc14", 1, 16, "left", "chair", "机5", 14),
	    ("pc15", 1, 18, "left", "chair", "机5", 15),
	    ("pc16", 6, 10.8, "down", "chair", "机6", 16),
	    ("pc17", 7, 11.5, "left", "chair", "机6", 17),
	    ("pc18", 6, 12.2, "up", "chair", "机6", 18),
        ("pc19", 13, 9.8, "down", "chair", "机7", 19),
	    ("pc20", 14, 10.5, "left", "chair", "机7", 20),
	    ("pc21", 13, 11.2, "up", "chair", "机7", 21),
        ("pc22", 12, 10.5, "right", "chair", "机7", 22),
        ("pc23", 9, 13.8, "down", "chair", "机8", 23),
	    ("pc24", 10, 14.5, "left", "chair", "机8", 24),
	    ("pc25", 9, 15.2, "up", "chair", "机8", 25),
        ("pc26", 8, 14.5, "right", "chair", "机8", 26),
        ("pc27", 6, 17.8, "down", "chair", "机9", 27),
	    ("pc28", 7, 18.5, "left", "chair", "机9", 28),
	    ("pc29", 6, 19.2, "up", "chair", "机9", 29),
        ("pc30", 5, 18.5, "right", "chair", "机9", 30),
        ("pc31", 14, 16.8, "down", "chair", "机10", 31),
	    ("pc32", 15, 17.5, "left", "chair", "机10", 32),
	    ("pc33", 14, 18.2, "up", "chair", "机10", 33),
        ("pc34", 13, 17.5, "right", "chair", "机10", 34),
        ("pc35", 20, 11, "right", "chair", "机11", 35),
	    ("pc36", 20, 13, "right", "chair", "机11", 36),
	    ("pc37", 20, 16, "right", "chair", "机11", 37),
        ("pc38", 20, 18, "right", "chair", "机11", 38),

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
        total_point INTEGER NOT NULL DEFAULT 0,
        is_online INTEGER NOT NULL DEFAULT 0
    )
    """)

    cur.execute("PRAGMA table_info(users)")
    user_columns = {row["name"] for row in cur.fetchall()}
    if "total_point" not in user_columns:
        cur.execute("ALTER TABLE users ADD COLUMN total_point INTEGER NOT NULL DEFAULT 0")
        cur.execute("UPDATE users SET total_point = point WHERE total_point = 0")

    if "is_online" not in user_columns:
        cur.execute("ALTER TABLE users ADD COLUMN is_online INTEGER NOT NULL DEFAULT 0")

    if "gacha_coins" not in user_columns:
        cur.execute("ALTER TABLE users ADD COLUMN gacha_coins INTEGER NOT NULL DEFAULT 0")

    if "selected_avatar" not in user_columns:
        cur.execute("ALTER TABLE users ADD COLUMN selected_avatar TEXT NOT NULL DEFAULT 'izumi'")

    if "selected_icon" not in user_columns:
        cur.execute("ALTER TABLE users ADD COLUMN selected_icon TEXT NOT NULL DEFAULT 'hero'")

    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_avatars (
        user_id INTEGER NOT NULL,
        avatar_id TEXT NOT NULL,
        acquired_at TEXT NOT NULL,
        PRIMARY KEY (user_id, avatar_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    INSERT OR IGNORE INTO user_avatars (user_id, avatar_id, acquired_at)
    SELECT id, 'izumi', ? FROM users
    """, (get_now(),))

    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_icons (
        user_id INTEGER NOT NULL,
        icon_id TEXT NOT NULL,
        acquired_at TEXT NOT NULL,
        PRIMARY KEY (user_id, icon_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    INSERT OR IGNORE INTO user_icons (user_id, icon_id, acquired_at)
    SELECT id, 'hero', ? FROM users
    """, (get_now(),))

    cur.execute("""
    CREATE TABLE IF NOT EXISTS login_sessions (
        user_id INTEGER PRIMARY KEY,
        session_token TEXT NOT NULL UNIQUE,
        last_seen TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
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

    cur.execute("""
    CREATE TABLE IF NOT EXISTS room_layouts (
        user_id INTEGER PRIMARY KEY,
        layout_json TEXT NOT NULL,
        theme_json TEXT NOT NULL DEFAULT '{}',
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("PRAGMA table_info(room_layouts)")
    room_layout_columns = {row["name"] for row in cur.fetchall()}
    if "theme_json" not in room_layout_columns:
        cur.execute("ALTER TABLE room_layouts ADD COLUMN theme_json TEXT NOT NULL DEFAULT '{}'")

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
    CREATE TABLE IF NOT EXISTS bulletin_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        image_data TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("PRAGMA table_info(bulletin_posts)")
    bulletin_post_columns = {row["name"] for row in cur.fetchall()}
    if "image_data" not in bulletin_post_columns:
        cur.execute("ALTER TABLE bulletin_posts ADD COLUMN image_data TEXT")
    if "quest_type" not in bulletin_post_columns:
        cur.execute("ALTER TABLE bulletin_posts ADD COLUMN quest_type TEXT")

    cur.execute("""
    CREATE TABLE IF NOT EXISTS quest_participants (
        quest_id TEXT NOT NULL,
        quest_date TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        joined_at TEXT NOT NULL,
        PRIMARY KEY (quest_id, quest_date, user_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS quest_completions (
        quest_id TEXT NOT NULL,
        quest_date TEXT NOT NULL,
        post_id INTEGER NOT NULL,
        completed_by INTEGER NOT NULL,
        completed_at TEXT NOT NULL,
        PRIMARY KEY (quest_id, quest_date),
        FOREIGN KEY (post_id) REFERENCES bulletin_posts(id),
        FOREIGN KEY (completed_by) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS daily_quest_completions (
        quest_id TEXT NOT NULL,
        quest_date TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        reward INTEGER NOT NULL,
        completed_at TEXT NOT NULL,
        PRIMARY KEY (quest_id, quest_date, user_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS lunch_quest_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quest_date TEXT NOT NULL,
        host_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'waiting',
        post_id INTEGER,
        created_at TEXT NOT NULL,
        completed_at TEXT,
        FOREIGN KEY (host_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES bulletin_posts(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS lunch_quest_members (
        room_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        joined_at TEXT NOT NULL,
        PRIMARY KEY (room_id, user_id),
        FOREIGN KEY (room_id) REFERENCES lunch_quest_rooms(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS bulletin_follows (
        follower_id INTEGER NOT NULL,
        followed_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (follower_id, followed_id),
        FOREIGN KEY (follower_id) REFERENCES users(id),
        FOREIGN KEY (followed_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS bulletin_likes (
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES bulletin_posts(id)
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

    cur.execute("""
    CREATE TABLE IF NOT EXISTS battle_queue (
        user_id INTEGER PRIMARY KEY,
        joined_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS battle_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        host_id INTEGER NOT NULL,
        stake_type TEXT NOT NULL,
        stake_amount INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'waiting',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (host_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS battle_matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER,
        player1_id INTEGER NOT NULL,
        player2_id INTEGER NOT NULL,
        player1_life INTEGER NOT NULL DEFAULT 3,
        player2_life INTEGER NOT NULL DEFAULT 3,
        player1_gauge INTEGER NOT NULL DEFAULT 0,
        player2_gauge INTEGER NOT NULL DEFAULT 0,
        attacker_id INTEGER NOT NULL,
        turn INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL DEFAULT 'active',
        winner_id INTEGER,
        last_player1_action TEXT,
        last_player2_action TEXT,
        result_text TEXT NOT NULL DEFAULT '対戦開始！',
        stake_amount INTEGER NOT NULL DEFAULT 0,
        player2_stake INTEGER NOT NULL DEFAULT 0,
        points_settled INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (room_id) REFERENCES battle_rooms(id),
        FOREIGN KEY (player1_id) REFERENCES users(id),
        FOREIGN KEY (player2_id) REFERENCES users(id),
        FOREIGN KEY (winner_id) REFERENCES users(id)
    )
    """)

    cur.execute("PRAGMA table_info(battle_matches)")
    battle_match_columns = {row["name"] for row in cur.fetchall()}
    if "room_id" not in battle_match_columns:
        cur.execute("ALTER TABLE battle_matches ADD COLUMN room_id INTEGER")
    if "stake_amount" not in battle_match_columns:
        cur.execute(
            "ALTER TABLE battle_matches ADD COLUMN stake_amount INTEGER NOT NULL DEFAULT 0"
        )
    if "player2_stake" not in battle_match_columns:
        cur.execute(
            "ALTER TABLE battle_matches ADD COLUMN player2_stake INTEGER NOT NULL DEFAULT 0"
        )
    if "points_settled" not in battle_match_columns:
        cur.execute(
            "ALTER TABLE battle_matches ADD COLUMN points_settled INTEGER NOT NULL DEFAULT 0"
        )

    cur.execute("""
    CREATE TABLE IF NOT EXISTS battle_moves (
        match_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        turn INTEGER NOT NULL,
        action TEXT NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (match_id, user_id, turn),
        FOREIGN KEY (match_id) REFERENCES battle_matches(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    cur.execute("""
    CREATE INDEX IF NOT EXISTS idx_battle_matches_players_status
    ON battle_matches(status, player1_id, player2_id)
    """)
    cur.execute("""
    CREATE INDEX IF NOT EXISTS idx_battle_moves_match_turn
    ON battle_moves(match_id, turn)
    """)
    cur.execute("""
    CREATE UNIQUE INDEX IF NOT EXISTS idx_battle_rooms_waiting_host
    ON battle_rooms(host_id) WHERE status = 'waiting'
    """)
    cur.execute("""
    CREATE UNIQUE INDEX IF NOT EXISTS idx_battle_matches_room
    ON battle_matches(room_id) WHERE room_id IS NOT NULL
    """)

    cur.execute("""
    CREATE TRIGGER IF NOT EXISTS battle_room_validate_before_insert
    BEFORE INSERT ON battle_rooms
    WHEN (SELECT point FROM users WHERE id = NEW.host_id) < NEW.stake_amount
    BEGIN
      SELECT RAISE(ABORT, 'not_enough_point');
    END
    """)
    cur.execute("""
    CREATE TRIGGER IF NOT EXISTS battle_room_escrow_after_insert
    AFTER INSERT ON battle_rooms
    BEGIN
      UPDATE users
      SET point = point - NEW.stake_amount,
          total_point = total_point - NEW.stake_amount
      WHERE id = NEW.host_id;
    END
    """)
    cur.execute("""
    CREATE TRIGGER IF NOT EXISTS battle_room_refund_after_cancel
    AFTER UPDATE OF status ON battle_rooms
    WHEN OLD.status = 'waiting' AND NEW.status = 'cancelled'
    BEGIN
      UPDATE users
      SET point = point + OLD.stake_amount,
          total_point = total_point + OLD.stake_amount
      WHERE id = OLD.host_id;
    END
    """)
    cur.execute("DROP TRIGGER IF EXISTS battle_match_validate_room_before_insert")
    cur.execute("DROP TRIGGER IF EXISTS battle_match_escrow_after_insert")
    cur.execute("DROP TRIGGER IF EXISTS battle_reward_after_finish")
    cur.execute("""
    CREATE TRIGGER IF NOT EXISTS battle_match_validate_room_before_insert
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
    END
    """)
    cur.execute("""
    CREATE TRIGGER IF NOT EXISTS battle_match_escrow_after_insert
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
    END
    """)
    cur.execute("""
    CREATE TRIGGER IF NOT EXISTS battle_reward_after_finish
    AFTER UPDATE OF status ON battle_matches
    WHEN OLD.status = 'active' AND NEW.status = 'finished'
      AND NEW.winner_id IS NOT NULL AND NEW.points_settled = 0
    BEGIN
      UPDATE users
      SET point = point + NEW.stake_amount + NEW.player2_stake,
          total_point = total_point + NEW.stake_amount + NEW.player2_stake
      WHERE id = NEW.winner_id;
      UPDATE battle_matches SET points_settled = 1 WHERE id = NEW.id;
    END
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS mahjong_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_code TEXT NOT NULL UNIQUE,
        host_id INTEGER NOT NULL,
        game_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'waiting',
        round_wind TEXT NOT NULL DEFAULT 'east',
        round_number INTEGER NOT NULL DEFAULT 1,
        honba INTEGER NOT NULL DEFAULT 0,
        riichi_sticks INTEGER NOT NULL DEFAULT 0,
        dealer_seat INTEGER NOT NULL DEFAULT 0,
        dice1 INTEGER NOT NULL DEFAULT 1,
        dice2 INTEGER NOT NULL DEFAULT 1,
        stake_amount INTEGER NOT NULL DEFAULT 0,
        starting_score INTEGER NOT NULL DEFAULT 25000,
        points_settled INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (host_id) REFERENCES users(id)
    )
    """)
    cur.execute("PRAGMA table_info(mahjong_rooms)")
    mahjong_room_columns = {row["name"] for row in cur.fetchall()}
    if "stake_amount" not in mahjong_room_columns:
        cur.execute(
            "ALTER TABLE mahjong_rooms ADD COLUMN stake_amount INTEGER NOT NULL DEFAULT 0"
        )
    if "points_settled" not in mahjong_room_columns:
        cur.execute(
            "ALTER TABLE mahjong_rooms ADD COLUMN points_settled INTEGER NOT NULL DEFAULT 0"
        )
    if "starting_score" not in mahjong_room_columns:
        cur.execute(
            "ALTER TABLE mahjong_rooms ADD COLUMN starting_score INTEGER NOT NULL DEFAULT 25000"
        )
    cur.execute("""
    CREATE TABLE IF NOT EXISTS mahjong_players (
        room_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        join_order INTEGER NOT NULL,
        seat_index INTEGER,
        score INTEGER NOT NULL DEFAULT 25000,
        riichi_declared INTEGER NOT NULL DEFAULT 0,
        app_point_reward INTEGER NOT NULL DEFAULT 0,
        joined_at TEXT NOT NULL,
        PRIMARY KEY (room_id, user_id),
        UNIQUE (room_id, seat_index),
        FOREIGN KEY (room_id) REFERENCES mahjong_rooms(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)
    cur.execute("PRAGMA table_info(mahjong_players)")
    mahjong_player_columns = {row["name"] for row in cur.fetchall()}
    if "riichi_declared" not in mahjong_player_columns:
        cur.execute(
            "ALTER TABLE mahjong_players ADD COLUMN riichi_declared INTEGER NOT NULL DEFAULT 0"
        )
    if "app_point_reward" not in mahjong_player_columns:
        cur.execute(
            "ALTER TABLE mahjong_players ADD COLUMN app_point_reward INTEGER NOT NULL DEFAULT 0"
        )
    cur.execute("""
    CREATE TABLE IF NOT EXISTS mahjong_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        payload_json TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL,
        FOREIGN KEY (room_id) REFERENCES mahjong_rooms(id)
    )
    """)
    cur.execute("""
    CREATE INDEX IF NOT EXISTS idx_mahjong_rooms_status
    ON mahjong_rooms(status, updated_at)
    """)
    cur.execute("""
    CREATE INDEX IF NOT EXISTS idx_mahjong_events_room
    ON mahjong_events(room_id, id)
    """)

    seed_village_slots(cur)
    conn.commit()
    conn.close()    


def get_bulletin_posts(limit: int = 100, viewer_id: int = 0):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT bulletin_posts.id, bulletin_posts.content, bulletin_posts.image_data,
               bulletin_posts.quest_type,
               bulletin_posts.created_at, users.id AS user_id,
               users.name AS user_name, users.grade AS user_grade,
               users.selected_icon AS user_icon,
               EXISTS(
                   SELECT 1 FROM bulletin_follows
                   WHERE follower_id = ? AND followed_id = bulletin_posts.user_id
               ) AS is_following,
               EXISTS(
                   SELECT 1 FROM bulletin_likes
                   WHERE user_id = ? AND post_id = bulletin_posts.id
               ) AS is_liked,
               (SELECT COUNT(*) FROM bulletin_likes WHERE post_id = bulletin_posts.id) AS like_count
        FROM bulletin_posts
        JOIN users ON users.id = bulletin_posts.user_id
        ORDER BY bulletin_posts.id DESC
        LIMIT ?
        """,
        (viewer_id, viewer_id, limit),
    )
    posts = [dict(row) for row in cur.fetchall()]
    conn.close()
    return posts


def create_bulletin_post(user_id: int, content: str, image_data=None):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if cur.fetchone() is None:
        conn.close()
        return None

    created_at = get_now()
    cur.execute(
        "INSERT INTO bulletin_posts (user_id, content, image_data, created_at) VALUES (?, ?, ?, ?)",
        (user_id, content, image_data, created_at),
    )
    post_id = cur.lastrowid
    quest_awarded = _complete_daily_quest(cur, user_id, "bulletin-post")
    conn.commit()
    conn.close()
    post = next((post for post in get_bulletin_posts(viewer_id=user_id) if post["id"] == post_id), None)
    if post is not None:
        post["quest_awarded"] = quest_awarded
        post["quest_reward"] = DAILY_QUEST_REWARDS["bulletin-post"] if quest_awarded else 0
        post["user"] = get_user_by_id(user_id)
    return post


def get_lunch_quest(user_id: int):
    quest_date = get_now()[:10]
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if cur.fetchone() is None:
        conn.close()
        return None
    cur.execute(
        """
        SELECT r.id, r.host_id, r.status, r.post_id, r.created_at, r.completed_at,
               u.name AS host_name
        FROM lunch_quest_rooms r
        JOIN users u ON u.id = r.host_id
        WHERE r.quest_date = ?
        ORDER BY CASE r.status WHEN 'waiting' THEN 0 ELSE 1 END, r.id DESC
        """,
        (quest_date,),
    )
    rooms = []
    my_room_id = None
    for room_row in cur.fetchall():
        room = dict(room_row)
        cur.execute(
            """
            SELECT u.id, u.name, u.grade, u.selected_icon
            FROM lunch_quest_members m
            JOIN users u ON u.id = m.user_id
            WHERE m.room_id = ? ORDER BY m.joined_at
            """,
            (room["id"],),
        )
        room["participants"] = [dict(row) for row in cur.fetchall()]
        if any(player["id"] == user_id for player in room["participants"]):
            my_room_id = room["id"]
        rooms.append(room)
    conn.close()
    return {
        "quest_id": "lunch",
        "quest_date": quest_date,
        "reward": 20,
        "rooms": rooms,
        "my_room_id": my_room_id,
    }


def create_lunch_quest_room(user_id: int):
    quest_date = get_now()[:10]
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if cur.fetchone() is None:
        conn.close()
        return None
    cur.execute("""
        SELECT 1 FROM lunch_quest_members m
        JOIN lunch_quest_rooms r ON r.id = m.room_id
        WHERE r.quest_date = ? AND m.user_id = ?
    """, (quest_date, user_id))
    if cur.fetchone() is not None:
        conn.close()
        return {"ok": False, "reason": "already_joined"}
    now = get_now()
    cur.execute(
        "INSERT INTO lunch_quest_rooms (quest_date, host_id, created_at) VALUES (?, ?, ?)",
        (quest_date, user_id, now),
    )
    room_id = cur.lastrowid
    cur.execute("INSERT INTO lunch_quest_members (room_id, user_id, joined_at) VALUES (?, ?, ?)", (room_id, user_id, now))
    conn.commit()
    conn.close()
    return {"ok": True, "room_id": room_id, "status": get_lunch_quest(user_id)}


def join_lunch_quest(user_id: int, room_id: int):
    quest_date = get_now()[:10]
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if cur.fetchone() is None:
        conn.close()
        return None
    cur.execute("""
        SELECT 1 FROM lunch_quest_members m
        JOIN lunch_quest_rooms r ON r.id = m.room_id
        WHERE r.quest_date = ? AND m.user_id = ?
    """, (quest_date, user_id))
    if cur.fetchone() is not None:
        conn.close()
        return {"ok": False, "reason": "already_joined"}
    cur.execute(
        "SELECT 1 FROM lunch_quest_rooms WHERE id = ? AND quest_date = ? AND status = 'waiting'",
        (room_id, quest_date),
    )
    if cur.fetchone() is None:
        conn.close()
        return {"ok": False, "reason": "room_not_found"}
    cur.execute("INSERT INTO lunch_quest_members (room_id, user_id, joined_at) VALUES (?, ?, ?)", (room_id, user_id, get_now()))
    conn.commit()
    conn.close()
    return {"ok": True, "status": get_lunch_quest(user_id)}


def complete_lunch_quest(user_id: int, room_id: int, content: str, image_data: str):
    quest_date = get_now()[:10]
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT 1 FROM lunch_quest_rooms r
        JOIN lunch_quest_members m ON m.room_id = r.id
        WHERE r.id = ? AND r.quest_date = ? AND r.status = 'waiting' AND m.user_id = ?
        """,
        (room_id, quest_date, user_id),
    )
    if cur.fetchone() is None:
        conn.close()
        return {"ok": False, "reason": "not_participant"}
    cur.execute("SELECT user_id FROM lunch_quest_members WHERE room_id = ?", (room_id,))
    participant_ids = [row["user_id"] for row in cur.fetchall()]
    if len(participant_ids) < 2:
        conn.close()
        return {"ok": False, "reason": "not_enough_members"}

    created_at = get_now()
    post_content = content.strip() or "みんなで昼飯クエストを達成しました！"
    cur.execute(
        "INSERT INTO bulletin_posts (user_id, content, image_data, quest_type, created_at) VALUES (?, ?, ?, 'lunch', ?)",
        (user_id, post_content, image_data, created_at),
    )
    post_id = cur.lastrowid
    for participant_id in participant_ids:
        cur.execute(
            "UPDATE users SET point = point + 20, total_point = total_point + 20 WHERE id = ?",
            (participant_id,),
        )
        cur.execute(
            "INSERT INTO activities (user_id, activity_type, point, created_at) VALUES (?, 'lunch_quest', 20, ?)",
            (participant_id, created_at),
        )
    cur.execute("UPDATE lunch_quest_rooms SET status = 'completed', post_id = ?, completed_at = ? WHERE id = ?", (post_id, created_at, room_id))
    conn.commit()
    conn.close()
    post = next((item for item in get_bulletin_posts(viewer_id=user_id) if item["id"] == post_id), None)
    return {
        "ok": True,
        "post": post,
        "awarded_user_ids": participant_ids,
        "user": get_user_by_id(user_id),
        "status": get_lunch_quest(user_id),
    }


DAILY_QUEST_REWARDS = {
    "visit_village": 40,
    "lab_photo": 10,
    "bulletin-post": 10,
    "play_together": 20,
}


def _complete_daily_quest(cur, user_id: int, quest_id: str):
    reward = DAILY_QUEST_REWARDS.get(quest_id)
    if reward is None:
        return False
    completed_at = get_now()
    quest_date = completed_at[:10]
    cur.execute(
        """
        INSERT OR IGNORE INTO daily_quest_completions
            (quest_id, quest_date, user_id, reward, completed_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (quest_id, quest_date, user_id, reward, completed_at),
    )
    awarded = cur.rowcount > 0
    if awarded and reward > 0:
        cur.execute(
            "UPDATE users SET point = point + ?, total_point = total_point + ? WHERE id = ?",
            (reward, reward, user_id),
        )
        cur.execute(
            "INSERT INTO activities (user_id, activity_type, point, created_at) VALUES (?, ?, ?, ?)",
            (user_id, f"quest_{quest_id}", reward, completed_at),
        )
    return awarded


def complete_daily_quest(user_id: int, quest_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if cur.fetchone() is None:
        conn.close()
        return None
    awarded = _complete_daily_quest(cur, user_id, quest_id)
    conn.commit()
    conn.close()
    return {
        "ok": True,
        "awarded": awarded,
        "reward": DAILY_QUEST_REWARDS.get(quest_id, 0) if awarded else 0,
        "user": get_user_by_id(user_id),
    }


def get_daily_quest_status(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if cur.fetchone() is None:
        conn.close()
        return None
    cur.execute(
        "SELECT quest_id, reward, completed_at FROM daily_quest_completions WHERE user_id = ? AND quest_date = ?",
        (user_id, get_now()[:10]),
    )
    completed = [dict(row) for row in cur.fetchall()]
    conn.close()
    return {"completed_quests": completed}


def complete_photo_quest(user_id: int, content: str, image_data: str):
    quest_date = get_now()[:10]
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if cur.fetchone() is None:
        conn.close()
        return None
    cur.execute(
        "SELECT 1 FROM daily_quest_completions WHERE quest_id = 'lab_photo' AND quest_date = ? AND user_id = ?",
        (quest_date, user_id),
    )
    if cur.fetchone() is not None:
        conn.close()
        return {"ok": False, "reason": "completed"}

    created_at = get_now()
    post_content = content.strip() or "今日の研究室の風景を共有しました！"
    cur.execute(
        "INSERT INTO bulletin_posts (user_id, content, image_data, quest_type, created_at) VALUES (?, ?, ?, 'lab_photo', ?)",
        (user_id, post_content, image_data, created_at),
    )
    post_id = cur.lastrowid
    _complete_daily_quest(cur, user_id, "lab_photo")
    conn.commit()
    conn.close()
    post = next((item for item in get_bulletin_posts(viewer_id=user_id) if item["id"] == post_id), None)
    return {
        "ok": True,
        "post": post,
        "user": get_user_by_id(user_id),
        "status": get_daily_quest_status(user_id),
    }


def toggle_bulletin_follow(follower_id: int, followed_id: int):
    if follower_id == followed_id:
        return None

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id IN (?, ?)", (follower_id, followed_id))
    if len(cur.fetchall()) != 2:
        conn.close()
        return None

    cur.execute(
        "SELECT 1 FROM bulletin_follows WHERE follower_id = ? AND followed_id = ?",
        (follower_id, followed_id),
    )
    following = cur.fetchone() is None
    if following:
        cur.execute(
            "INSERT INTO bulletin_follows (follower_id, followed_id, created_at) VALUES (?, ?, ?)",
            (follower_id, followed_id, get_now()),
        )
    else:
        cur.execute(
            "DELETE FROM bulletin_follows WHERE follower_id = ? AND followed_id = ?",
            (follower_id, followed_id),
        )
    conn.commit()
    conn.close()
    return {"following": following}


def toggle_bulletin_like(user_id: int, post_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    user_exists = cur.fetchone() is not None
    cur.execute("SELECT user_id FROM bulletin_posts WHERE id = ?", (post_id,))
    post = cur.fetchone()
    if not user_exists or post is None or post["user_id"] == user_id:
        conn.close()
        return None

    cur.execute(
        "SELECT 1 FROM bulletin_likes WHERE user_id = ? AND post_id = ?",
        (user_id, post_id),
    )
    liked = cur.fetchone() is None
    if liked:
        cur.execute(
            "INSERT INTO bulletin_likes (user_id, post_id, created_at) VALUES (?, ?, ?)",
            (user_id, post_id, get_now()),
        )
    else:
        cur.execute(
            "DELETE FROM bulletin_likes WHERE user_id = ? AND post_id = ?",
            (user_id, post_id),
        )
    cur.execute("SELECT COUNT(*) AS count FROM bulletin_likes WHERE post_id = ?", (post_id,))
    like_count = cur.fetchone()["count"]
    conn.commit()
    conn.close()
    return {"liked": liked, "like_count": like_count}


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

    user_id = cur.lastrowid
    cur.execute(
        "INSERT INTO user_avatars (user_id, avatar_id, acquired_at) VALUES (?, 'izumi', ?)",
        (user_id, get_now()),
    )
    cur.execute(
        "INSERT INTO user_icons (user_id, icon_id, acquired_at) VALUES (?, 'hero', ?)",
        (user_id, get_now()),
    )
    conn.commit()
    conn.close()

    return {
        "id": user_id,
        "name": name,
        "grade": grade,
        "point": 0,
        "total_point": 0,
        "gacha_coins": 0,
        "selected_avatar": "izumi",
        "selected_icon": "hero",
    }


def get_user_by_name(name: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, name, grade, password_hash, point, total_point,
               gacha_coins, selected_avatar, selected_icon
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
        SELECT id, name, grade, point, total_point, gacha_coins, selected_avatar, selected_icon
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )

    row = cur.fetchone()
    conn.close()
    return dict(row) if row is not None else None


def set_user_online(user_id: int, is_online: bool):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE users
        SET is_online = ?
        WHERE id = ?
        """,
        (1 if is_online else 0, user_id),
    )

    conn.commit()
    conn.close()


def create_login_session(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cutoff = (datetime.now() - timedelta(seconds=LOGIN_SESSION_TTL_SECONDS)).isoformat(
        timespec="seconds"
    )
    now = get_now()

    cur.execute("BEGIN IMMEDIATE")
    cur.execute(
        "UPDATE users SET is_online = 0 WHERE id IN "
        "(SELECT user_id FROM login_sessions WHERE last_seen < ?)",
        (cutoff,),
    )
    cur.execute("DELETE FROM login_sessions WHERE last_seen < ?", (cutoff,))
    cur.execute("SELECT 1 FROM login_sessions WHERE user_id = ?", (user_id,))
    if cur.fetchone() is not None:
        conn.commit()
        conn.close()
        return None

    session_token = secrets.token_urlsafe(32)
    cur.execute(
        "INSERT INTO login_sessions (user_id, session_token, last_seen, created_at) "
        "VALUES (?, ?, ?, ?)",
        (user_id, session_token, now, now),
    )
    conn.commit()
    conn.close()
    return session_token


def heartbeat_login_session(user_id: int, session_token: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE login_sessions SET last_seen = ? WHERE user_id = ? AND session_token = ?",
        (get_now(), user_id, session_token),
    )
    active = cur.rowcount > 0
    if active:
        cur.execute("UPDATE users SET is_online = 1 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return active


def end_login_session(user_id: int, session_token: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "DELETE FROM login_sessions WHERE user_id = ? AND session_token = ?",
        (user_id, session_token),
    )
    ended = cur.rowcount > 0
    if ended:
        cur.execute("UPDATE users SET is_online = 0 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return ended


def get_ranking():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    SELECT id, name, grade, point, total_point, selected_avatar, selected_icon
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
    cur.execute("SELECT COUNT(*) AS total_users FROM users")
    total_users = cur.fetchone()["total_users"]

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
        "total_users": total_users, 
    }

def get_weekly_activity():
    from datetime import date, timedelta

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) AS total_users FROM users")
    total_users = cur.fetchone()["total_users"]

    today = date.today()
    monday = today - timedelta(days=today.weekday())

    days = []
    for i in range(7):
        day = monday + timedelta(days=i)
        day_str = day.isoformat()

        cur.execute(
            """
            SELECT COUNT(DISTINCT user_id) AS active_users
            FROM activities
            WHERE created_at LIKE ?
            """,
            (f"{day_str}%",),
        )
        active_users = cur.fetchone()["active_users"]
        ratio = active_users / total_users if total_users > 0 else 0

        days.append({
            "date": day_str,
            "weekday": day.weekday(),
            "active_users": active_users,
            "ratio": round(ratio, 3),
        })

    conn.close()
    return {
        "total_users": total_users,
        "days": days,
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
        "room_theme": get_room_theme(user_id),
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


def get_room_theme(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT theme_json
        FROM room_layouts
        WHERE user_id = ?
        """,
        (user_id,),
    )

    row = cur.fetchone()
    conn.close()

    if row is None:
        return {}

    return json.loads(row["theme_json"])


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


def get_avatar_status(user_id: int):
    user = get_user_by_id(user_id)
    if user is None:
        return None

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT avatar_id FROM user_avatars WHERE user_id = ? ORDER BY acquired_at, avatar_id",
        (user_id,),
    )
    owned_ids = [row["avatar_id"] for row in cur.fetchall()]
    cur.execute(
        "SELECT icon_id FROM user_icons WHERE user_id = ? ORDER BY acquired_at, icon_id",
        (user_id,),
    )
    owned_icon_ids = [row["icon_id"] for row in cur.fetchall()]
    conn.close()
    return {
        "coins": user["gacha_coins"],
        "selected_avatar": user["selected_avatar"],
        "selected_icon": user["selected_icon"],
        "avatars": [
            {**avatar, "owned": avatar_id in owned_ids}
            for avatar_id, avatar in AVATAR_CATALOG.items()
        ],
        "icons": [
            {**icon, "owned": icon_id in owned_icon_ids}
            for icon_id, icon in ICON_CATALOG.items()
        ],
    }


def purchase_gacha_coin(user_id: int, quantity: int = 1):
    if quantity < 1 or quantity > 99:
        return {"ok": False, "reason": "invalid_quantity"}
    total_price = GACHA_COIN_PRICE * quantity
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT point FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if user is None:
        conn.close()
        return {"ok": False, "reason": "user_not_found"}
    if user["point"] < total_price:
        conn.close()
        return {"ok": False, "reason": "not_enough_point"}

    cur.execute(
        "UPDATE users SET point = point - ?, gacha_coins = gacha_coins + ? WHERE id = ?",
        (total_price, quantity, user_id),
    )
    conn.commit()
    conn.close()
    return {
        "ok": True,
        "price": total_price,
        "unit_price": GACHA_COIN_PRICE,
        "quantity": quantity,
        "user": get_user_by_id(user_id),
    }


def pull_gacha(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT gacha_coins FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    if user is None:
        conn.close()
        return {"ok": False, "reason": "user_not_found"}
    if user["gacha_coins"] < 1:
        conn.close()
        return {"ok": False, "reason": "not_enough_coin"}

    rarity_roll = secrets.randbelow(100)
    prize_kind = "avatar"
    if rarity_roll < 5:
        avatar_id = secrets.choice(("daiki", "giant_robot"))
    elif rarity_roll < 15:
        avatar_id = secrets.choice(("maie", "icon4"))
        prize_kind = "icon" if avatar_id == "icon4" else "avatar"
    else:
        avatar_id = secrets.choice(("icon1", "icon2", "icon3", "icon5", "nagano", "abe"))
        prize_kind = "icon" if avatar_id.startswith("icon") else "avatar"
    avatar = ICON_CATALOG[avatar_id] if prize_kind == "icon" else {**AVATAR_CATALOG[avatar_id], "kind": "avatar"}
    owned_table = "user_icons" if prize_kind == "icon" else "user_avatars"
    owned_column = "icon_id" if prize_kind == "icon" else "avatar_id"
    cur.execute(f"SELECT 1 FROM {owned_table} WHERE user_id = ? AND {owned_column} = ?", (user_id, avatar["id"]))
    duplicate = cur.fetchone() is not None
    cur.execute("UPDATE users SET gacha_coins = gacha_coins - 1 WHERE id = ?", (user_id,))
    if duplicate:
        cur.execute("UPDATE users SET point = point + 5 WHERE id = ?", (user_id,))
    else:
        cur.execute(
            f"INSERT INTO {owned_table} (user_id, {owned_column}, acquired_at) VALUES (?, ?, ?)",
            (user_id, avatar["id"], get_now()),
        )
    conn.commit()
    conn.close()
    return {
        "ok": True,
        "avatar": avatar,
        "duplicate": duplicate,
        "duplicate_point": 5 if duplicate else 0,
        "user": get_user_by_id(user_id),
        "status": get_avatar_status(user_id),
    }


def select_avatar(user_id: int, avatar_id: str):
    if avatar_id not in AVATAR_CATALOG:
        return {"ok": False, "reason": "not_found"}
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT 1 FROM user_avatars WHERE user_id = ? AND avatar_id = ?",
        (user_id, avatar_id),
    )
    if cur.fetchone() is None:
        conn.close()
        return {"ok": False, "reason": "not_owned"}
    cur.execute("UPDATE users SET selected_avatar = ? WHERE id = ?", (avatar_id, user_id))
    conn.commit()
    conn.close()
    return {"ok": True, "user": get_user_by_id(user_id)}


def select_icon(user_id: int, icon_id: str):
    if icon_id not in ICON_CATALOG:
        return {"ok": False, "reason": "not_found"}
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT 1 FROM user_icons WHERE user_id = ? AND icon_id = ?",
        (user_id, icon_id),
    )
    if cur.fetchone() is None:
        conn.close()
        return {"ok": False, "reason": "not_owned"}
    cur.execute("UPDATE users SET selected_icon = ? WHERE id = ?", (icon_id, user_id))
    conn.commit()
    conn.close()
    return {"ok": True, "user": get_user_by_id(user_id)}


def save_room_layout(user_id: int, items, theme=None):
    conn = get_connection()
    cur = conn.cursor()
    layout_json = json.dumps(items, ensure_ascii=False)
    theme_json = json.dumps(theme or {}, ensure_ascii=False)

    cur.execute(
        """
        INSERT INTO room_layouts (user_id, layout_json, theme_json, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            layout_json = excluded.layout_json,
            theme_json = excluded.theme_json,
            updated_at = excluded.updated_at
        """,
        (user_id, layout_json, theme_json, get_now()),
    )

    conn.commit()
    conn.close()
    return {
        "room_layout": get_room_layout(user_id),
        "room_theme": get_room_theme(user_id),
    }

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
            u.grade AS user_grade,
            u.is_online AS user_is_online
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
                "is_online": bool(row["user_is_online"]),
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

