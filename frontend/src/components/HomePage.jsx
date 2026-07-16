import charaIcon from "../assets/chara.png";
import iconBase from "../assets/icons/maru.png";
import RankingTable from "./RankingTable";

import treeStage1 from "../assets/tree/tree_stage_1.png";
import treeStage2 from "../assets/tree/tree_stage_2.png";
import treeStage3 from "../assets/tree/tree_stage_3.png";
import treeStage4 from "../assets/tree/tree_stage_4.png";
import treeStage5 from "../assets/tree/tree_stage_5.png";
import treeStage6 from "../assets/tree/tree_stage_6.png";

const TREE_STAGES = [treeStage1, treeStage2, treeStage3, treeStage4, treeStage5, treeStage6];
const WEEKDAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

// 割合(0〜1)を6段階(0〜5)の画像に変換
function getTreeStage(ratio) {
  const index = Math.min(5, Math.floor((ratio ?? 0) * 6));
  return TREE_STAGES[index];
}

const weatherBackgrounds = {
  快晴: { overlay: "linear-gradient(rgba(255, 188, 94, 0.10), rgba(41, 128, 185, 0.14))", image: "url('/weather/clear.gif')" },
  晴れ: { overlay: "linear-gradient(rgba(255, 216, 119, 0.08), rgba(38, 98, 145, 0.14))", image: "url('/weather/sunny.gif')" },
  曇り: { overlay: "linear-gradient(rgba(35, 43, 56, 0.14), rgba(18, 22, 31, 0.22))", image: "url('/weather/cloudy.gif')" },
  雨:   { overlay: "linear-gradient(rgba(17, 19, 26, 0.5), rgba(17, 19, 26, 0.72))", image: "url('/weather/rainy.gif')" },
  雷雨: { overlay: "linear-gradient(rgba(17, 19, 26, 0.48), rgba(17, 19, 26, 0.68))", image: "url('/weather/kaminari_2.gif')" },
};

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000]; // ★要確認:database.pyのVILLAGE_LEVELSに合わせる

function getWeatherBackground(weather) {
  const background = weatherBackgrounds[weather] || weatherBackgrounds.雷雨;
  return { backgroundImage: `${background.overlay}, ${background.image}` };
}

function getLevelProgress(village) {
  if (!village) return null;
  const level = village.level ?? 1;
  const total = village.total_point ?? 0;
  const base = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level];
  if (next == null) return { isMax: true, ratio: 1, remaining: 0, total };
  const span = Math.max(1, next - base);
  const ratio = Math.max(0, Math.min(1, (total - base) / span));
  const remaining = Math.max(0, next - total);
  return { isMax: false, ratio, remaining, next, total };
}

function UserIcon({ icon = charaIcon }) {
  return (
    <div className="userIcon" aria-hidden="true">
      <img alt="" className="userIconBase" src={iconBase} />
      <img alt="" className="userIconImage" src={icon} />
    </div>
  );
}

function HomePage({
  currentUser,
  onCheckin,
  onLogout,
  onOpenMyRoom,
  ranking,
  setPage,
  village,
  weeklyActivity,
}) {
  const progress = getLevelProgress(village);
  const todayIndex = (new Date().getDay() + 6) % 7; // 0=月 ... 6=日 に変換

  return (
    <div className="homeWeather" style={getWeatherBackground(village?.weather)}>
      <div className="homeTopGrid">
        <div className="card homeUserCard">
          <div className="homeUserHeader">
            <div className="homeUserProfile">
              <UserIcon />
              <div className="homeUserInfo">
                <span className="eyebrow">ログイン中</span>
                <p>
                  {currentUser.name} / {currentUser.grade}
                </p>
                <strong className="pointValue">{currentUser.point} pt</strong>
                <span className="pointCaption">あなたの活動ポイント</span>
              </div>
            </div>
            <button className="secondaryButton compactButton" onClick={onLogout}>
              ログアウト
            </button>
          </div>
          <button onClick={onCheckin}>活動ポイントを追加</button>
        </div>

        {village && (
          <div className="card villageSummary">
            <h2>今日のISDL</h2>
            <div className="statGrid">
              <div className="statBlock">
                <span className="statLabel">活動人数</span>
                <span className="statValue">{village.active_users}<small>人</small></span>
              </div>
              <div className="statBlock">
                <span className="statLabel">天気</span>
                <span className="statValue">{village.weather}</span>
              </div>
              <div className="statBlock">
                <span className="statLabel">共有街</span>
                <span className="statValue">Lv.{village.level}</span>
                <span className="statSub">{village.title}</span>
              </div>
            </div>

            {progress && (
              <div className="levelProgress">
                <div className="levelProgressHead">
                  <span className="statLabel">次のレベルまで</span>
                  <span className="levelRemaining">
                    {progress.isMax ? "最大レベル" : `あと ${progress.remaining} pt`}
                  </span>
                </div>
                <div className="levelBar">
                  <div
                    className="levelBarFill"
                    style={{ width: `${Math.round(progress.ratio * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="menuGrid">
        <button onClick={() => setPage("village")}>共有街へ</button>
        <button onClick={onOpenMyRoom}>個人ルームへ</button>
        <button onClick={() => setPage("shop")}>Shop</button>
      </div>

      {/* 週間活動(木の成長で表現) */}
      {weeklyActivity && (
        <div className="card weeklyActivityCard">
          <h2>今週の活動率</h2>
          <div className="weeklyTreeRow">
            {weeklyActivity.days.map((day, i) => (
              <div
                key={day.date}
                className={`weeklyTreeItem ${i === todayIndex ? "weeklyTreeItemToday" : ""}`}
              >
                <div className="weeklyTreeImageWrap">
                  <img src={getTreeStage(day.ratio)} alt="" className="weeklyTreeImage" />
                </div>
                <span className="weeklyTreeLabel">{WEEKDAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="rankingSection">
        <h2>ランキング</h2>
        <RankingTable ranking={ranking} />
      </section>
    </div>
  );
}

export default HomePage;