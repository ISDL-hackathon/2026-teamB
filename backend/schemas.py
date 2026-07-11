from typing import Dict, List, Literal, Optional

from pydantic import BaseModel


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
    theme: Optional[Dict[str, str]] = None


class FurniturePurchaseRequest(BaseModel):
    user_id: int
    furniture_id: str


class BulletinPostRequest(BaseModel):
    user_id: int
    content: str
    image_data: Optional[str] = None


class BulletinFollowRequest(BaseModel):
    follower_id: int
    followed_id: int


class BulletinLikeRequest(BaseModel):
    user_id: int
    post_id: int


class VillagePositionRequest(BaseModel):
    user_id: int
    slot_id: str
