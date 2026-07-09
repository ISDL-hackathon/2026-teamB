from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal, Optional

from database import (
    init_db,
    create_user,
    get_user_by_name,
    verify_password,
    get_village_slots,
    get_user_village_slot_id,
    save_user_village_position,
    get_ranking,
    add_activity,
    get_village_status,
    get_room_status,
    save_room_layout,
    add_login_point_if_first_today,
    purchase_furniture,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterRequest(BaseModel):
    name: str
    grade: str
    password: str


class LoginRequest(BaseModel):
    name: str
    password: str


class ActivityRequest(BaseModel):
    user_id: int
    activity_type: Literal["checkin"]


class RoomLayoutItem(BaseModel):
    id: str
    surface: str
    col: float
    row: float
    colSpan: Optional[float] = None
    rowSpan: Optional[float] = None
    z: Optional[int] = None
    anchor: Optional[str] = None


class RoomLayoutRequest(BaseModel):
    items: List[RoomLayoutItem]


class FurniturePurchaseRequest(BaseModel):
    user_id: int
    furniture_id: str


class VillagePositionRequest(BaseModel):
    user_id: int
    slot_id: str


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {"message": "FastAPI backend is running"}


@app.post("/register")
def register(request: RegisterRequest):
    existing_user = get_user_by_name(request.name)

    if existing_user is not None:
        raise HTTPException(status_code=400, detail="このユーザー名はすでに使われています")

    user = create_user(
        name=request.name,
        grade=request.grade,
        password=request.password,
    )

    return {
        "message": "ユーザー登録しました",
        "user": user,
    }


@app.post("/login")
def login(request: LoginRequest):
    user = get_user_by_name(request.name)

    if user is None:
        raise HTTPException(status_code=401, detail="ユーザーが存在しません")

    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="パスワードが違います")

    added_point = add_login_point_if_first_today(user["id"])

    return {
        "message": "ログイン成功",
        "added_point": added_point,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "grade": user["grade"],
            "point": user["point"] + added_point,
            "total_point": user["total_point"] + added_point,
            "village_slot_id": get_user_village_slot_id(user["id"]),
        },
    }


@app.get("/ranking")
def ranking():
    return get_ranking()


@app.post("/activity/checkin")
def checkin(request: ActivityRequest):
    point = 20

    add_activity(
        user_id=request.user_id,
        activity_type=request.activity_type,
        point=point,
    )

    return {
        "message": "ポイントを加算しました",
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

    if result["reason"] == "user_not_found":
        raise HTTPException(status_code=404, detail="繝ｦ繝ｼ繧ｶ繝ｼ縺悟ｭ伜惠縺励∪縺帙ｓ")

    if result["reason"] == "not_found":
        raise HTTPException(status_code=404, detail="家具が見つかりません")

    if result["reason"] == "already_owned":
        raise HTTPException(status_code=400, detail="この家具は購入済みです")

    if result["reason"] == "not_enough_point":
        raise HTTPException(status_code=400, detail="ポイントが足りません")

    if result["reason"] == "locked":
        raise HTTPException(status_code=400, detail="まだ購入できない家具です")

    raise HTTPException(status_code=400, detail="購入できません")


@app.get("/village/status")
def village_status():
    return get_village_status()


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
        raise HTTPException(status_code=404, detail="ユーザーが存在しません")

    return room


@app.post("/room/layout/{user_id}")
def room_layout(user_id: int, request: RoomLayoutRequest):
    room = get_room_status(user_id)

    if room is None:
        raise HTTPException(status_code=404, detail="繝ｦ繝ｼ繧ｶ繝ｼ縺悟ｭ伜惠縺励∪縺帙ｓ")

    layout = save_room_layout(
        user_id,
        [item.dict(exclude_none=True) for item in request.items],
    )

    return {"room_layout": layout}
