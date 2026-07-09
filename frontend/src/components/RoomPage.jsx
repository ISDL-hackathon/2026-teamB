import PixelRoom from "./PixelRoom";
function RoomPage({ onSaveRoomLayout, readonly = false, room, setPage }) {
  return (
    <>
      <div className="pageHeader">
        <button
          className="secondaryButton"
          onClick={() => setPage(readonly ? "village" : "home")}
        >
          {readonly ? "共有街へ" : "Home"}
        </button>
      </div>

      <div className="card roomCard">
        <h2>Personal Room</h2>
        {room ? (
          <>
            <PixelRoom
              level={room.room_level}
              onSaveLayout={onSaveRoomLayout}
              ownedItemIds={room.owned_furniture}
              readonly={readonly}
              savedLayout={room.room_layout}
            />
            {!readonly && (
              <button onClick={() => setPage("shop")} type="button">
                Shop
              </button>
            )}
            <h3>
              Lv.{room.room_level}: {room.room_name}
            </h3>
            <p>{room.room_description}</p>
            <div className="statusGrid">
              <div>
                <span>User</span>
                <strong>{room.user.name}</strong>
              </div>
              <div>
                <span>Grade</span>
                <strong>{room.user.grade}</strong>
              </div>
              <div>
                <span>Current Points</span>
                <strong>{room.user.point} pt</strong>
              </div>
              <div>
                <span>Total Points</span>
                <strong>{room.user.total_point} pt</strong>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default RoomPage;
