from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import (
    add_activity,
    add_login_point_if_first_today,
    cancel_battle_queue,
    cancel_battle_room,
    create_battle_room,
    create_login_session,
    create_user,
    create_bulletin_post,
    get_bulletin_posts,
    get_lunch_quest,
    create_lunch_quest_room,
    join_lunch_quest,
    complete_lunch_quest,
    get_daily_quest_status,
    complete_photo_quest,
    complete_daily_quest,
    get_battle_snapshot,
    toggle_bulletin_follow,
    toggle_bulletin_like,
    get_ranking,
    get_room_status,
    get_user_by_name,
    get_user_village_slot_id,
    get_village_slots,
    get_village_status,
    heartbeat_login_session,
    init_db,
    join_battle_room,
    list_battle_rooms,
    create_mahjong_room,
    cancel_mahjong_riichi,
    declare_mahjong_riichi,
    get_current_mahjong_room,
    finish_mahjong_room,
    get_mahjong_room,
    join_mahjong_room,
    join_mahjong_room_by_id,
    leave_mahjong_room,
    list_open_mahjong_rooms,
    roll_mahjong_dice,
    start_mahjong_room,
    submit_mahjong_hand,
    matchmake_battle,
    purchase_furniture,
    get_avatar_status,
    purchase_gacha_coin,
    pull_gacha,
    select_avatar,
    select_icon,
    save_room_layout,
    save_user_village_position,
    set_user_online,
    submit_battle_move,
    end_login_session,
    forfeit_battle,
    verify_password,
    get_weekly_activity,
)
from messages import (
    FURNITURE_ALREADY_OWNED,
    FURNITURE_LOCKED,
    FURNITURE_NOT_FOUND,
    LOGIN_SUCCESS,
    NOT_ENOUGH_POINT,
    POINT_ADDED,
    PURCHASE_FAILED,
    REGISTERED,
    USER_ALREADY_EXISTS,
    USER_NOT_FOUND,
    WRONG_PASSWORD,
)
from schemas import (
    ActivityRequest,
    BattleForfeitRequest,
    BattleMoveRequest,
    BattleRoomCreateRequest,
    BattleRoomUserRequest,
    BattleUserRequest,
    BulletinPostRequest,
    BulletinFollowRequest,
    BulletinLikeRequest,
    LunchQuestCompleteRequest,
    LunchQuestJoinRequest,
    PhotoQuestCompleteRequest,
    FurniturePurchaseRequest,
    GachaUserRequest,
    AvatarSelectRequest,
    IconSelectRequest,
    LoginRequest,
    LogoutRequest,
    SessionHeartbeatRequest,
    MahjongHandRequest,
    MahjongRiichiRequest,
    MahjongRoomCreateRequest,
    MahjongRoomJoinRequest,
    MahjongRoomUserRequest,
    RegisterRequest,
    RoomLayoutRequest,
    VillagePositionRequest,
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {"message": "FastAPI backend is running"}


@app.post("/battle/matchmake")
def battle_matchmake(request: BattleUserRequest):
    result = matchmake_battle(request.user_id)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.get("/battle/rooms")
def battle_rooms(user_id: int):
    result = list_battle_rooms(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    return result


@app.post("/battle/rooms")
def battle_room_create(request: BattleRoomCreateRequest):
    result = create_battle_room(request.user_id, request.stake_type)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.post("/battle/rooms/{room_id}/join")
def battle_room_join(room_id: int, request: BattleRoomUserRequest):
    result = join_battle_room(room_id, request.user_id)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.post("/battle/rooms/{room_id}/cancel")
def battle_room_cancel(room_id: int, request: BattleRoomUserRequest):
    if not cancel_battle_room(room_id, request.user_id):
        raise HTTPException(status_code=409, detail="この部屋はキャンセルできません")
    return {"ok": True}


@app.post("/battle/cancel")
def battle_cancel(request: BattleUserRequest):
    cancel_battle_queue(request.user_id)
    return {"ok": True}


@app.get("/battle/match/{match_id}")
def battle_match_status(match_id: int, user_id: int):
    match = get_battle_snapshot(match_id, user_id)
    if match is None:
        raise HTTPException(status_code=404, detail="対戦が見つかりません")
    return {"match": match}


@app.post("/battle/move")
def battle_move(request: BattleMoveRequest):
    result = submit_battle_move(request.match_id, request.user_id, request.action)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.post("/battle/forfeit")
def battle_forfeit(request: BattleForfeitRequest):
    if not forfeit_battle(request.match_id, request.user_id):
        raise HTTPException(status_code=404, detail="対戦が見つかりません")
    return {"ok": True}


@app.get("/mahjong/current")
def mahjong_current(user_id: int):
    return {"room": get_current_mahjong_room(user_id)}


@app.post("/mahjong/rooms")
def mahjong_room_create(request: MahjongRoomCreateRequest):
    result = create_mahjong_room(request.user_id, request.game_type, request.stake_amount, request.starting_score)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.get("/mahjong/rooms")
def mahjong_open_rooms():
    return list_open_mahjong_rooms()


@app.post("/mahjong/rooms/join")
def mahjong_room_join(request: MahjongRoomJoinRequest):
    result = join_mahjong_room(request.user_id, request.room_code)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.post("/mahjong/rooms/{room_id}/join")
def mahjong_room_join_by_id(room_id: int, request: MahjongRoomUserRequest):
    result = join_mahjong_room_by_id(request.user_id, room_id)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.post("/mahjong/rooms/{room_id}/leave")
def mahjong_room_leave(room_id: int, request: MahjongRoomUserRequest):
    result = leave_mahjong_room(room_id, request.user_id)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.get("/mahjong/rooms/{room_id}")
def mahjong_room_status(room_id: int, user_id: int):
    room = get_mahjong_room(room_id, user_id)
    if room is None:
        raise HTTPException(status_code=404, detail="麻雀部屋が見つかりません")
    return {"room": room}


@app.post("/mahjong/rooms/{room_id}/start")
def mahjong_room_start(room_id: int, request: MahjongRoomUserRequest):
    result = start_mahjong_room(room_id, request.user_id)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.post("/mahjong/rooms/{room_id}/dice")
def mahjong_dice(room_id: int, request: MahjongRoomUserRequest):
    if not roll_mahjong_dice(room_id, request.user_id):
        raise HTTPException(status_code=403, detail="サイコロを振れません")
    room = get_mahjong_room(room_id, request.user_id)
    return {"room": room}


@app.post("/mahjong/rooms/{room_id}/riichi")
def mahjong_riichi(room_id: int, request: MahjongRiichiRequest):
    result = declare_mahjong_riichi(room_id, request.user_id, request.target_user_id)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.post("/mahjong/rooms/{room_id}/riichi/cancel")
def mahjong_riichi_cancel(room_id: int, request: MahjongRiichiRequest):
    result = cancel_mahjong_riichi(room_id, request.user_id, request.target_user_id)
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.post("/mahjong/rooms/{room_id}/finish")
def mahjong_room_finish(room_id: int, request: MahjongRoomUserRequest):
    result = finish_mahjong_room(room_id, request.user_id)
    if result is None:
        raise HTTPException(status_code=403, detail="ゲームを終了できません")
    return result


@app.post("/mahjong/rooms/{room_id}/hand")
def mahjong_hand(room_id: int, request: MahjongHandRequest):
    result = submit_mahjong_hand(
        room_id,
        request.user_id,
        request.adjustments,
        request.dealer_continues,
        request.riichi_winner_id,
        request.note,
    )
    if result.get("error"):
        raise HTTPException(status_code=result["status"], detail=result["error"])
    return result


@app.post("/register")
def register(request: RegisterRequest):
    if get_user_by_name(request.name) is not None:
        raise HTTPException(status_code=400, detail=USER_ALREADY_EXISTS)

    user = create_user(
        name=request.name,
        grade=request.grade,
        password=request.password,
    )

    return {
        "message": REGISTERED,
        "user": user,
    }


@app.post("/login")
def login(request: LoginRequest):
    user = get_user_by_name(request.name)

    if user is None:
        raise HTTPException(status_code=401, detail=USER_NOT_FOUND)

    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail=WRONG_PASSWORD)

    session_token = create_login_session(user["id"])
    if session_token is None:
        raise HTTPException(status_code=409, detail="このアカウントは別の端末でログイン中です")

    added_point = add_login_point_if_first_today(user["id"])
    set_user_online(user["id"], True)

    return {
        "message": LOGIN_SUCCESS,
        "added_point": added_point,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "grade": user["grade"],
            "point": user["point"] + added_point,
            "total_point": user["total_point"] + added_point,
            "gacha_coins": user["gacha_coins"],
            "selected_avatar": user["selected_avatar"],
            "selected_icon": user["selected_icon"],
            "village_slot_id": get_user_village_slot_id(user["id"]),
            "session_token": session_token,
        },
    }


@app.post("/logout")
def logout(request: LogoutRequest):
    end_login_session(request.user_id, request.session_token)
    return {"ok": True}


@app.post("/session/heartbeat")
def session_heartbeat(request: SessionHeartbeatRequest):
    return {
        "active": heartbeat_login_session(request.user_id, request.session_token),
    }


@app.get("/ranking")
def ranking():
    return get_ranking()


@app.get("/bulletin/posts")
def bulletin_posts(viewer_id: int = 0):
    return get_bulletin_posts(viewer_id=viewer_id)


@app.post("/bulletin/posts")
def bulletin_post_create(request: BulletinPostRequest):
    content = request.content.strip()
    image_data = request.image_data
    if (not content and not image_data) or len(content) > 500:
        raise HTTPException(status_code=400, detail="本文または画像を入力してください")
    if image_data:
        allowed_prefixes = (
            "data:image/png;base64,",
            "data:image/jpeg;base64,",
            "data:image/gif;base64,",
            "data:image/webp;base64,",
        )
        if not image_data.startswith(allowed_prefixes) or len(image_data) > 2_800_000:
            raise HTTPException(status_code=400, detail="画像はPNG・JPEG・GIF・WebPの2MB以下にしてください")

    post = create_bulletin_post(request.user_id, content, image_data)
    if post is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    return post


@app.post("/bulletin/follow")
def bulletin_follow(request: BulletinFollowRequest):
    result = toggle_bulletin_follow(request.follower_id, request.followed_id)
    if result is None:
        raise HTTPException(status_code=400, detail="フォロー対象を確認してください")
    return result


@app.post("/bulletin/like")
def bulletin_like(request: BulletinLikeRequest):
    result = toggle_bulletin_like(request.user_id, request.post_id)
    if result is None:
        raise HTTPException(status_code=400, detail="自分の投稿にはいいねできません")
    return result


@app.get("/quests/lunch")
def lunch_quest_status(user_id: int):
    result = get_lunch_quest(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    return result


@app.post("/quests/lunch/rooms")
def lunch_quest_room_create(request: GachaUserRequest):
    result = create_lunch_quest_room(request.user_id)
    if result is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    if not result["ok"]:
        raise HTTPException(status_code=400, detail="本日はすでに別の昼飯グループへ参加しています")
    return result


@app.post("/quests/lunch/join")
def lunch_quest_join(request: LunchQuestJoinRequest):
    result = join_lunch_quest(request.user_id, request.room_id)
    if result is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    if not result["ok"]:
        details = {
            "already_joined": "本日はすでに別の昼飯グループへ参加しています",
            "room_not_found": "このグループには参加できません",
        }
        raise HTTPException(status_code=400, detail=details.get(result["reason"], "参加できません"))
    return result


@app.post("/quests/lunch/complete")
def lunch_quest_complete(request: LunchQuestCompleteRequest):
    allowed_prefixes = (
        "data:image/png;base64,",
        "data:image/jpeg;base64,",
        "data:image/gif;base64,",
        "data:image/webp;base64,",
    )
    if not request.image_data.startswith(allowed_prefixes) or len(request.image_data) > 2_800_000:
        raise HTTPException(status_code=400, detail="画像はPNG・JPEG・GIF・WebPの2MB以下にしてください")
    if len(request.content.strip()) > 500:
        raise HTTPException(status_code=400, detail="本文は500文字以内にしてください")
    result = complete_lunch_quest(request.user_id, request.room_id, request.content, request.image_data)
    if result["ok"]:
        return result
    details = {
        "not_participant": "先に昼飯クエストへ参加してください",
        "not_enough_members": "2人以上参加するとクエストを完了できます",
    }
    raise HTTPException(status_code=400, detail=details.get(result["reason"], "クエストを完了できません"))


@app.get("/quests/status/{user_id}")
def daily_quest_status(user_id: int):
    result = get_daily_quest_status(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    return result


@app.post("/quests/visit-village")
def visit_village_quest(request: GachaUserRequest):
    result = complete_daily_quest(request.user_id, "visit_village")
    if result is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    return result


@app.post("/quests/photo/complete")
def photo_quest_complete(request: PhotoQuestCompleteRequest):
    allowed_prefixes = (
        "data:image/png;base64,",
        "data:image/jpeg;base64,",
        "data:image/gif;base64,",
        "data:image/webp;base64,",
    )
    if not request.image_data.startswith(allowed_prefixes) or len(request.image_data) > 2_800_000:
        raise HTTPException(status_code=400, detail="画像はPNG・JPEG・GIF・WebPの2MB以下にしてください")
    if len(request.content.strip()) > 500:
        raise HTTPException(status_code=400, detail="本文は500文字以内にしてください")
    result = complete_photo_quest(request.user_id, request.content, request.image_data)
    if result is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    if not result["ok"]:
        raise HTTPException(status_code=400, detail="本日の写真クエストは達成済みです")
    return result




@app.post("/activity/checkin")
def checkin(request: ActivityRequest):
    point = 20

    add_activity(
        user_id=request.user_id,
        activity_type=request.activity_type,
        point=point,
    )

    return {
        "message": POINT_ADDED,
        "added_point": point,
    }


@app.post("/shop/furniture/purchase")
def furniture_purchase(request: FurniturePurchaseRequest):
    result = purchase_furniture(
        user_id=request.user_id,
        furniture_id=request.furniture_id,
    )

    if result["ok"]:
        return result

    errors = {
        "user_not_found": (404, USER_NOT_FOUND),
        "not_found": (404, FURNITURE_NOT_FOUND),
        "already_owned": (400, FURNITURE_ALREADY_OWNED),
        "not_enough_point": (400, NOT_ENOUGH_POINT),
        "locked": (400, FURNITURE_LOCKED),
    }
    status_code, detail = errors.get(result["reason"], (400, PURCHASE_FAILED))
    raise HTTPException(status_code=status_code, detail=detail)


@app.get("/gacha/status/{user_id}")
def gacha_status(user_id: int):
    status = get_avatar_status(user_id)
    if status is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    return status


@app.post("/shop/gacha-coins/purchase")
def gacha_coin_purchase(request: GachaUserRequest):
    result = purchase_gacha_coin(request.user_id)
    if result["ok"]:
        return result
    detail = USER_NOT_FOUND if result["reason"] == "user_not_found" else NOT_ENOUGH_POINT
    raise HTTPException(status_code=404 if result["reason"] == "user_not_found" else 400, detail=detail)


@app.post("/gacha/pull")
def gacha_pull(request: GachaUserRequest):
    result = pull_gacha(request.user_id)
    if result["ok"]:
        return result
    detail = USER_NOT_FOUND if result["reason"] == "user_not_found" else "ガチャコインがありません"
    raise HTTPException(status_code=404 if result["reason"] == "user_not_found" else 400, detail=detail)


@app.post("/gacha/avatar/select")
def gacha_avatar_select(request: AvatarSelectRequest):
    result = select_avatar(request.user_id, request.avatar_id)
    if result["ok"]:
        return result
    raise HTTPException(status_code=400, detail="未所持のアバターは選択できません")


@app.post("/gacha/icon/select")
def gacha_icon_select(request: IconSelectRequest):
    result = select_icon(request.user_id, request.icon_id)
    if result["ok"]:
        return result
    raise HTTPException(status_code=400, detail="未所持のアイコンは選択できません")


@app.get("/village/status")
def village_status():
    return get_village_status()

@app.get("/village/weekly_activity")
def village_weekly_activity():
    return get_weekly_activity()


@app.get("/village/slots")
def village_slots():
    return get_village_slots()


@app.post("/village/position")
def village_position(request: VillagePositionRequest):
    result = save_user_village_position(
        request.user_id,
        request.slot_id,
    )

    if not result["ok"]:
        raise HTTPException(status_code=400, detail=result["reason"])

    return result


@app.get("/room/status/{user_id}")
def room_status(user_id: int):
    room = get_room_status(user_id)

    if room is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)

    return room


@app.post("/room/layout/{user_id}")
def room_layout(user_id: int, request: RoomLayoutRequest):
    if get_room_status(user_id) is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)

    layout = save_room_layout(
        user_id,
        [item.dict(exclude_none=True) for item in request.items],
        request.theme,
    )

    return layout
