import PixelRoom from "./PixelRoom";

function RoomPage({ onSaveRoomLayout, room, setPage }) {
  return (
    <>
      <div className="pageHeader">
        <button className="secondaryButton" onClick={() => setPage("home")}>
          ホームへ戻る
        </button>
      </div>

      <div className="card roomCard">
        <h2>個人ルーム</h2>
        {room ? (
          <>
            <PixelRoom
              level={room.room_level}
              onSaveLayout={onSaveRoomLayout}
              savedLayout={room.room_layout}
            />
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
                <span>ポイント</span>
                <strong>{room.user.point} pt</strong>
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
