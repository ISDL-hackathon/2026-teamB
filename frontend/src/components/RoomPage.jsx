import PixelRoom from "./PixelRoom";
function RoomPage({ onOpenBulletinBoard, onOpenGameSelect, onSaveRoomLayout, readonly = false, room, setPage }) {
  return (
    <>
      <div className="pageHeader">
        <button
          className="secondaryButton"
          onClick={() => setPage(readonly ? "village" : "home")}
        >
          {readonly ? "共有街へ" : "ホームへ"}
        </button>
      </div>

      <div className="card roomCard">
        <h2>個人ルーム</h2>
        {room ? (
          <>
            <PixelRoom
              level={room.room_level}
              onOpenBulletinBoard={onOpenBulletinBoard}
              onOpenGameSelect={onOpenGameSelect}
              onSaveLayout={onSaveRoomLayout}
              ownedItemIds={room.owned_furniture}
              readonly={readonly}
              savedLayout={room.room_layout}
              savedTheme={room.room_theme}
            />
            {!readonly && (
              <button onClick={() => setPage("shop")} type="button">
                ショップへ
              </button>
            )}
            <h3>
              Lv.{room.room_level}: {room.room_name}
            </h3>
            <p>{room.room_description}</p>
            <div className="statusGrid">
              <div>
                <span>ユーザー</span>
                <strong>{room.user.name}</strong>
              </div>
              <div>
                <span>学年</span>
                <strong>{room.user.grade}</strong>
              </div>
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
