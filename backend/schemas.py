from typing import Dict, List, Literal, Optional

from pydantic import BaseModel


class RegisterRequest(BaseModel):
    name: str
    grade: str
    password: str


class LoginRequest(BaseModel):
    name: str
    password: str


class LogoutRequest(BaseModel):
    user_id: int
    session_token: str


class SessionHeartbeatRequest(BaseModel):
    user_id: int
    session_token: str


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


class GachaUserRequest(BaseModel):
    user_id: int


class GachaCoinPurchaseRequest(BaseModel):
    user_id: int
    quantity: int = 1


class AvatarSelectRequest(BaseModel):
    user_id: int
    avatar_id: str


class IconSelectRequest(BaseModel):
    user_id: int
    icon_id: str


class BulletinPostRequest(BaseModel):
    user_id: int
    content: str
    image_data: Optional[str] = None


class LunchQuestCompleteRequest(BaseModel):
    user_id: int
    room_id: int
    content: str = ""
    image_data: str


class LunchQuestJoinRequest(BaseModel):
    user_id: int
    room_id: int


class PhotoQuestCompleteRequest(BaseModel):
    user_id: int
    content: str = ""
    image_data: str


class BulletinFollowRequest(BaseModel):
    follower_id: int
    followed_id: int


class BulletinLikeRequest(BaseModel):
    user_id: int
    post_id: int


class VillagePositionRequest(BaseModel):
    user_id: int
    slot_id: str


class BattleUserRequest(BaseModel):
    user_id: int


class BattleRoomCreateRequest(BaseModel):
    user_id: int
    stake_type: Literal["free", "10", "50", "all"]


class BattleRoomUserRequest(BaseModel):
    user_id: int


class BattleMoveRequest(BaseModel):
    match_id: int
    user_id: int
    action: str


class BattleForfeitRequest(BaseModel):
    match_id: int
    user_id: int


class MahjongRoomCreateRequest(BaseModel):
    user_id: int
    game_type: Literal["tonpu", "hanchan"]
    stake_amount: Literal[0, 10, 50]
    starting_score: Literal[25000, 35000] = 25000


class MahjongRoomJoinRequest(BaseModel):
    user_id: int
    room_code: str


class MahjongRoomUserRequest(BaseModel):
    user_id: int


class MahjongRiichiRequest(BaseModel):
    user_id: int
    target_user_id: int


class MahjongHandRequest(BaseModel):
    user_id: int
    adjustments: Dict[str, int]
    dealer_continues: bool
    riichi_winner_id: Optional[int] = None
    note: str = ""
