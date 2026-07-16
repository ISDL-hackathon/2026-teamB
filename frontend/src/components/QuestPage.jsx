import { useEffect, useState } from "react";
import { requestJson } from "../api";
import questTileBackground from "../assets/quest-tile-bg.png";
import questClearStamp from "../assets/quest-clear-stamp.png";
import "./QuestPage.css";

const QUESTS = [
  {
    id: "lunch",
    title: "みんなで昼飯に行こう",
    description: "仲間と昼飯へ行き、代表者が写真を投稿しよう。",
    reward: 20,
    time: "11:30〜14:30",
    destination: "lunchQuest",
    category: "交流",
  },
  {
    id: "visit_village",
    title: "共用街に行こう",
    description: "共用街へ行って、今日の研究室の様子を見てみよう。",
    reward: 40,
    time: "1日1回",
    destination: "village",
    category: "デイリー",
  },
  {
    id: "lab_photo",
    title: "今日の研究室の風景",
    description: "研究室の今日の一枚を撮影して共有しよう。",
    reward: 10,
    time: "1日1回",
    destination: "photoQuest",
    category: "写真",
  },
  {
    id: "bulletin-post",
    title: "ISDLgramへ投稿",
    description: "今日の研究室の出来事をみんなに共有しよう。",
    reward: 10,
    time: "1日1回",
    destination: "bulletinLoading",
    category: "デイリー",
  },
  {
    id: "play_together",
    title: "みんなで遊ぼう",
    description: "オンライン対戦か麻雀を、研究室の仲間と最後まで遊ぼう。",
    reward: 20,
    time: "1日1回",
    destination: "gameLoading",
    category: "交流",
  },
];

function getLunchStatus() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes < 690) return "11:30から開催";
  if (minutes <= 870) return "開催中";
  return "本日は終了";
}

function QuestPage({ currentUser, setCurrentUser, setPage }) {
  const [completedQuests, setCompletedQuests] = useState(new Set());

  useEffect(() => {
    requestJson(`/quests/status/${currentUser.id}`)
      .then((data) => setCompletedQuests(new Set(data.completed_quests.map((quest) => quest.quest_id))))
      .catch(() => setCompletedQuests(new Set()));
  }, [currentUser.id]);

  const openQuest = (quest) => {
    if (quest.id !== "visit_village") {
      setPage(quest.destination);
      return;
    }
    requestJson("/quests/visit-village", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id }),
    })
      .then((data) => setCurrentUser((current) => ({ ...current, ...data.user })))
      .finally(() => setPage("village"));
  };

  return (
    <main className="questPage">
      <header className="questHeader">
        <button className="secondaryButton" onClick={() => setPage("room")} type="button">← 個人ルーム</button>
        <div>
          <span>ISDL QUEST BOARD</span>
          <h2>クエスト掲示板</h2>
        </div>
        <strong>自動更新</strong>
      </header>

      <section className="questGrid">
        {QUESTS.map((quest) => {
          const status = completedQuests.has(quest.id)
            ? "達成済み"
            : quest.id === "lunch" ? getLunchStatus() : "挑戦可能";
          return (
            <button
              className={completedQuests.has(quest.id) ? "questTile questTileCompleted" : "questTile"}
              key={quest.id}
              onClick={() => openQuest(quest)}
              style={{ backgroundImage: `url(${questTileBackground})` }}
              type="button"
            >
              <span className="questCategory">{quest.category}</span>
              <strong>{quest.title}</strong>
              <p>{quest.description}</p>
              <div className="questTileFooter">
                <span>{quest.time}</span>
                <b>{quest.reward > 0 ? `★ ${quest.reward}pt` : "★ 参加"}</b>
              </div>
              <em>{status}</em>
              {completedQuests.has(quest.id) && (
                <img alt="QUEST CLEAR" className="questClearStamp" src={questClearStamp} />
              )}
            </button>
          );
        })}
      </section>
      <p className="questNotice">クエストの達成判定とポイント報酬は順次追加されます。</p>
    </main>
  );
}

export default QuestPage;
