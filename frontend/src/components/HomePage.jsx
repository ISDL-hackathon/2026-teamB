import iconBase from "../assets/icons/maru.png";
import iconBackground from "../assets/icons/icon-background.png";
import RankingTable from "./RankingTable";
import { getIconImage } from "./iconAssets";

const weatherBackgrounds = {
  快晴: { overlay: "linear-gradient(rgba(255, 188, 94, 0.10), rgba(41, 128, 185, 0.14))", image: "url('/weather/clear.gif')" },
  晴れ: { overlay: "linear-gradient(rgba(255, 216, 119, 0.08), rgba(38, 98, 145, 0.14))", image: "url('/weather/sunny.gif')" },
  曇り: { overlay: "linear-gradient(rgba(35, 43, 56, 0.14), rgba(18, 22, 31, 0.22))", image: "url('/weather/cloudy.gif')" },
  雨:   { overlay: "linear-gradient(rgba(17, 19, 26, 0.5), rgba(17, 19, 26, 0.72))", image: "url('/weather/rainy.gif')" },
  雷雨: { overlay: "linear-gradient(rgba(17, 19, 26, 0.48), rgba(17, 19, 26, 0.68))", image: "url('/weather/kaminari_2.gif')" },
};

// ★ここは database.py のレベル閾値に合わせてください(各レベルの開始pt)
//   Lv1=0, Lv2=100, Lv3=300, Lv4=600, Lv5=1000 の例。Lv5の値は要確認。
const LEVEL_THRESHOLDS = [0, 100, 500, 1000, 2000];

function getWeatherBackground(weather) {
  const background = weatherBackgrounds[weather] || weatherBackgrounds.雷雨;
  return { backgroundImage: `${background.overlay}, ${background.image}` };
}

// 街レベルの進捗を計算
function getLevelProgress(village) {
  if (!village) return null;
  const level = village.level ?? 1;
  // ★街の合計ポイントのフィールド名。違えば変更(例: village.point / village.total_points)
  const total = village.total_point ?? 0;
  const base = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level]; // 次レベルの開始pt(無ければ最大)
  if (next == null) {
    return { isMax: true, ratio: 1, remaining: 0, total };
  }
  const span = Math.max(1, next - base);
  const ratio = Math.max(0, Math.min(1, (total - base) / span));
  const remaining = Math.max(0, next - total);
  return { isMax: false, ratio, remaining, next, total };
}

function UserIcon({ icon }) {
  return (
    <div className="userIcon" aria-hidden="true">
      <img alt="" className="userIconBackground" src={iconBackground} />
      <img alt="" className="userIconImage" src={icon} />
      <img alt="" className="userIconBase" src={iconBase} />
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
}) {
  const progress = getLevelProgress(village);

  return (
    <div className="homeWeather" style={getWeatherBackground(village?.weather)}>
      <div className="homeTopGrid">
        {/* 主役:ユーザーカード(ヒーロー) */}
        <div className="card homeUserCard">
          <div className="homeUserHeader">
            <div className="homeUserProfile">
              <UserIcon icon={getIconImage(currentUser.selected_icon)} />
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

        {/* 今日のISDL + 街レベル進捗 */}
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

            {/* 街レベルアップまでの進捗バー */}
            {progress && (
              <div className="levelProgress">
                <div className="levelProgressHead">
                  <span className="statLabel">共有街レベルアップまで</span>
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
        <button onClick={() => setPage("villageLoading")}>共有街へ</button>
        <button onClick={onOpenMyRoom}>個人ルームへ</button>
        <button onClick={() => setPage("shop")}>Shop</button>
        <button onClick={() => setPage("gacha")}>{"\u30ac\u30c1\u30e3"}</button>
      </div>

      <section className="rankingSection">
        <h2>ランキング</h2>
        <RankingTable ranking={ranking} />
      </section>
    </div>
  );
}

export default HomePage;
