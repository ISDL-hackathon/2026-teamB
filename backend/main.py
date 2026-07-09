from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import (
    add_activity,
    add_login_point_if_first_today,
    create_user,
    get_ranking,
    get_room_status,
    get_user_by_name,
    get_village_status,
    init_db,
    purchase_furniture,
    save_room_layout,
    verify_password,
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
    FurniturePurchaseRequest,
    LoginRequest,
    RegisterRequest,
    RoomLayoutRequest,
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

    added_point = add_login_point_if_first_today(user["id"])

    return {
        "message": LOGIN_SUCCESS,
        "added_point": added_point,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "grade": user["grade"],
            "point": user["point"] + added_point,
            "total_point": user["total_point"] + added_point,
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


@app.get("/village/status")
def village_status():
    return get_village_status()


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
    )

    return {"room_layout": layout}
