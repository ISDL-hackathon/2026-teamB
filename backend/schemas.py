from typing import List, Literal, Optional

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


class FurniturePurchaseRequest(BaseModel):
    user_id: int
    furniture_id: str
