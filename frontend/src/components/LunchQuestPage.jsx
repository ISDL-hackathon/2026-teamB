import { useEffect, useState } from "react";
import { requestJson } from "../api";
import { getIconImage } from "./iconAssets";
import "./LunchQuestPage.css";

function LunchQuestPage({ currentUser, setCurrentUser, setPage }) {
  const [status, setStatus] = useState(null);
  const [content, setContent] = useState("");
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    requestJson(`/quests/lunch?user_id=${currentUser.id}`).then(setStatus).catch((err) => setError(err.message));
  }, [currentUser.id]);

  const runAction = (path, body) => {
    setBusy(true);
    setError("");
    return requestJson(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((data) => setStatus(data.status))
      .catch((err) => setError(err.message))
      .finally(() => setBusy(false));
  };

  const createRoom = () => runAction("/quests/lunch/rooms", { user_id: currentUser.id });
  const joinRoom = (roomId) => runAction("/quests/lunch/join", { user_id: currentUser.id, room_id: roomId });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/gif", "image/webp"].includes(file.type) || file.size > 1024 * 1024) {
      setError("画像はPNG・JPEG・GIF・WebPの1MB以下にしてください");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setImageData(reader.result); setError(""); };
    reader.readAsDataURL(file);
  };

  const completeQuest = (event) => {
    event.preventDefault();
    if (!imageData || !status?.my_room_id || busy) return;
    setBusy(true);
    setError("");
    requestJson("/quests/lunch/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        room_id: status.my_room_id,
        content: content.trim(),
        image_data: imageData,
      }),
    })
      .then((data) => {
        setCurrentUser((current) => ({ ...current, ...data.user }));
        setPage("bulletin");
      })
      .catch((err) => setError(err.message))
      .finally(() => setBusy(false));
  };

  const myRoom = status?.rooms.find((room) => room.id === status.my_room_id);

  return (
    <main className="lunchQuestPage">
      <header className="lunchQuestHeader">
        <button className="secondaryButton" onClick={() => setPage("quests")} type="button">← クエスト一覧</button>
        <div><span>LUNCH QUEST</span><h2>みんなで昼飯に行こう</h2></div>
        <b>報酬 20pt</b>
      </header>

      <section className="lunchQuestDescription">
        <p>一緒に行く人のグループを作るか、募集中のグループへ参加しよう。</p>
        <span>2人以上で写真を投稿すると、グループ全員へ20pt</span>
      </section>

      <section className="lunchQuestParticipants">
        <div className="lunchQuestSectionTitle">
          <h3>本日の昼飯グループ</h3>
          {!status?.my_room_id && <button disabled={busy} onClick={createRoom} type="button">＋ グループを作る</button>}
        </div>
        <div className="lunchRoomList">
          {(status?.rooms ?? []).map((room) => (
            <article className={room.id === status.my_room_id ? "lunchRoomCard lunchRoomCardMine" : "lunchRoomCard"} key={room.id}>
              <header>
                <strong>グループ #{room.id}・{room.host_name}</strong>
                <span className={room.status === "completed" ? "isCompleted" : "isWaiting"}>
                  {room.status === "completed" ? "達成済み" : "参加募集中"}
                </span>
              </header>
              <div className="lunchParticipantGrid">
                {room.participants.map((participant) => (
                  <div className="lunchParticipant" key={participant.id}>
                    <img alt="" src={getIconImage(participant.selected_icon)} />
                    <strong>{participant.name}</strong>
                    <span>{participant.grade}</span>
                  </div>
                ))}
              </div>
              {!status.my_room_id && room.status === "waiting" && (
                <button disabled={busy} onClick={() => joinRoom(room.id)} type="button">このグループに参加</button>
              )}
              {room.id === status.my_room_id && <em>あなたのグループ</em>}
            </article>
          ))}
          {status && status.rooms.length === 0 && <p>まだグループはありません。最初のグループを作ってみよう。</p>}
        </div>
      </section>

      {myRoom?.status === "completed" ? (
        <section className="lunchQuestCompleted">
          <strong>QUEST COMPLETE!</strong>
          <p>あなたのグループは本日の昼飯クエストを達成済みです。</p>
          <button onClick={() => setPage("bulletin")} type="button">ISDLgramで投稿を見る</button>
        </section>
      ) : myRoom ? (
        <form className="lunchQuestPostForm" onSubmit={completeQuest}>
          <h3>グループのクエスト完了を投稿</h3>
          <p>参加者が2人以上になると投稿できます。</p>
          <textarea maxLength={500} onChange={(event) => setContent(event.target.value)} placeholder="今日の昼飯についてひとこと（任意）" value={content} />
          <label className="lunchQuestImagePicker">
            <span>{imageData ? "写真を選択済み" : "昼飯の写真を選ぶ"}</span>
            <input accept="image/png,image/jpeg,image/gif,image/webp" onChange={handleImageChange} type="file" />
          </label>
          {imageData && <img alt="投稿プレビュー" className="lunchQuestPreview" src={imageData} />}
          <button disabled={!imageData || myRoom.participants.length < 2 || busy} type="submit">
            {busy ? "投稿中…" : "ISDLgramへ投稿して完了"}
          </button>
        </form>
      ) : (
        <p className="lunchQuestJoinGuide">グループを作成するか、募集中のグループへ参加してください。</p>
      )}
      {error && <p className="lunchQuestError">{error}</p>}
    </main>
  );
}

export default LunchQuestPage;
