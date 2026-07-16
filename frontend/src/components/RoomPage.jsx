import PixelRoom from "./PixelRoom";
import { getAvatarImage } from "./avatarAssets";

const ROOM_LEVEL_THRESHOLDS = [0, 50, 150, 300, 600, 1000];

function getRoomLevelProgress(room) {
  if (!room) return null;
  const level = room.room_level ?? 1;
  const total = room.user?.total_point ?? 0;
  const base = ROOM_LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = ROOM_LEVEL_THRESHOLDS[level];
  if (next == null) return { isMax: true, ratio: 1, remaining: 0 };
  const ratio = Math.max(0, Math.min(1, (total - base) / Math.max(1, next - base)));
  return { isMax: false, ratio, remaining: Math.max(0, next - total) };
}

function RoomPage({ onOpenBulletinBoard, onOpenGameSelect, onOpenQuestBoard, onSaveRoomLayout, readonly = false, room, setPage }) {
  const roomProgress = getRoomLevelProgress(room);

  return (
    <>
      <div className="pageHeader roomPageHeader">
        <button
          className="secondaryButton"
          onClick={() => setPage(readonly ? "village" : "home")}
        >
          {readonly ? "研究室へ" : "ホームへ"}
        </button>
        {!readonly && (
          <button className="secondaryButton" onClick={() => setPage("shop")} type="button">
            ショップへ
          </button>
        )}
        {!readonly && (
          <button className="secondaryButton roomSettingsButton" onClick={() => setPage("settings")} type="button">
            設定
          </button>
        )}
      </div>

      <div className="card roomCard">
        <div className="roomTitleRow">
          <h2>個人ルーム</h2>
          {room && <span className="roomLevelBadge">Lv.{room.room_level}</span>}
        </div>
        {room && roomProgress && (
          <div className="roomLevelSummary">
            <div className="levelProgressHead">
              <span>
                <strong>{room.room_description}</strong>
                <small>累計 {room.user.total_point} pt</small>
              </span>
              <span className="levelRemaining">
                {roomProgress.isMax ? "最大レベル" : `あと ${roomProgress.remaining} pt`}
              </span>
            </div>
            <div className="levelBar">
              <div
                className="levelBarFill roomLevelBarFill"
                style={{ width: `${Math.round(roomProgress.ratio * 100)}%` }}
              />
            </div>
          </div>
        )}
        {room ? (
          <>
            <PixelRoom
              avatarSrc={getAvatarImage(room.user.selected_avatar)}
              level={room.room_level}
              onOpenBulletinBoard={onOpenBulletinBoard}
              onOpenGameSelect={onOpenGameSelect}
              onOpenQuestBoard={onOpenQuestBoard}
              onSaveLayout={onSaveRoomLayout}
              ownedItemIds={room.owned_furniture}
              readonly={readonly}
              savedLayout={room.room_layout}
              savedTheme={room.room_theme}
            />
            <div className="statusGrid">
              <div>
                <span>所持ポイント</span>
                <strong className="pointValue">{room.user.point} pt</strong>
              </div>
              <div>
                <span>累計ポイント</span>
                <strong className="pointValue">{room.user.total_point} pt</strong>
              </div>
            </div>
          </>
        ) : (
          <p>読み込み中...</p>
        )}
      </div>
    </>
  );
}

export default RoomPage;
