from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import (
    init_db,
    create_user,
    get_user_by_name,
    verify_password,
    get_ranking,
    add_activity,
    get_village_status,
    get_room_status,
    add_login_point_if_first_today,
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
    activity_type: str


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


@app.get("/village/status")
def village_status():
    return get_village_status()


@app.get("/room/status/{user_id}")
def room_status(user_id: int):
    room = get_room_status(user_id)

    if room is None:
        raise HTTPException(status_code=404, detail="ユーザーが存在しません")

    return room
