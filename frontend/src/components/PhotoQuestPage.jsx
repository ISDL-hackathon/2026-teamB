import { useEffect, useState } from "react";
import { requestJson } from "../api";
import "./LunchQuestPage.css";

function PhotoQuestPage({ currentUser, setCurrentUser, setPage }) {
  const [content, setContent] = useState("");
  const [imageData, setImageData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    requestJson(`/quests/status/${currentUser.id}`)
      .then((data) => setCompleted(data.completed_quests.some((quest) => quest.quest_id === "lab_photo")))
      .catch((err) => setError(err.message));
  }, [currentUser.id]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/gif", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setError("画像はPNG・JPEG・GIF・WebPの2MB以下にしてください");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setImageData(reader.result); setError(""); };
    reader.readAsDataURL(file);
  };

  const submitPhoto = (event) => {
    event.preventDefault();
    if (!imageData || busy) return;
    setBusy(true);
    requestJson("/quests/photo/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id, content: content.trim(), image_data: imageData }),
    })
      .then((data) => {
        setCurrentUser((current) => ({ ...current, ...data.user }));
        setPage("bulletin");
      })
      .catch((err) => setError(err.message))
      .finally(() => setBusy(false));
  };

  return (
    <main className="lunchQuestPage">
      <header className="lunchQuestHeader">
        <button className="secondaryButton" onClick={() => setPage("quests")} type="button">← クエスト一覧</button>
        <div><span>PHOTO QUEST</span><h2>今日の研究室の風景</h2></div>
        <b>報酬 10pt</b>
      </header>
      <section className="lunchQuestDescription">
        <p>研究室で見つけた今日の一枚を撮影しよう。</p>
        <span>写真をISDLgramへ投稿するとクエスト達成です。</span>
      </section>
      {completed ? (
        <section className="lunchQuestCompleted">
          <strong>QUEST COMPLETE!</strong>
          <p>本日の写真クエストは達成済みです。</p>
          <button onClick={() => setPage("bulletin")} type="button">ISDLgramで投稿を見る</button>
        </section>
      ) : (
        <form className="lunchQuestPostForm" onSubmit={submitPhoto}>
          <h3>研究室の写真を投稿</h3>
          <textarea maxLength={500} onChange={(event) => setContent(event.target.value)} placeholder="写真についてひとこと（任意）" value={content} />
          <label className="lunchQuestImagePicker">
            <span>{imageData ? "写真を選択済み" : "研究室の写真を選ぶ"}</span>
            <input accept="image/png,image/jpeg,image/gif,image/webp" onChange={handleImageChange} type="file" />
          </label>
          {imageData && <img alt="投稿プレビュー" className="lunchQuestPreview" src={imageData} />}
          <button disabled={!imageData || busy} type="submit">{busy ? "投稿中…" : "ISDLgramへ投稿して完了"}</button>
        </form>
      )}
      {error && <p className="lunchQuestError">{error}</p>}
    </main>
  );
}

export default PhotoQuestPage;
