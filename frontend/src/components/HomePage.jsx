import charaIcon from "../assets/chara.png";
import iconBase from "../assets/icons/maru.png";
import RankingTable from "./RankingTable";

const weatherBackgrounds = {
  快晴: {
    overlay: "linear-gradient(rgba(255, 188, 94, 0.10), rgba(41, 128, 185, 0.14))",
    image: "url('/weather/clear.gif')",
  },
  晴れ: {
    overlay: "linear-gradient(rgba(255, 216, 119, 0.08), rgba(38, 98, 145, 0.14))",
    image: "url('/weather/sunny.gif')",
  },
  曇り: {
    overlay: "linear-gradient(rgba(35, 43, 56, 0.14), rgba(18, 22, 31, 0.22))",
    image: "url('/weather/cloudy.gif')",
  },
  雨: {
    overlay: "linear-gradient(rgba(17, 19, 26, 0.5), rgba(17, 19, 26, 0.72))",
    image: "url('/weather/rainy.gif')",
  },
  雷雨: {
    overlay: "linear-gradient(rgba(17, 19, 26, 0.48), rgba(17, 19, 26, 0.68))",
    image: "url('/weather/kaminari_2.gif')",
  },
};

function getWeatherBackground(weather) {
  const background = weatherBackgrounds[weather] || weatherBackgrounds.雷雨;

  return {
    backgroundImage: `${background.overlay}, ${background.image}`,
  };
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
}) {
  return (
    <div
      className="homeWeather"
      style={getWeatherBackground(village?.weather)}
    >
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
            </div>
          </div>
          <button className="secondaryButton compactButton" onClick={onLogout}>
            ログアウト
          </button>
        </div>
        <button onClick={onCheckin}>活動ポイントを追加</button>
      </div>

      <div className="menuGrid">
        <button onClick={() => setPage("villageLoading")}>共有街へ</button>
        <button onClick={onOpenMyRoom}>個人ルームへ</button>
        <button onClick={() => setPage("shop")}>Shop</button>
        <button onClick={() => setPage("gacha")}>{"\u30ac\u30c1\u30e3"}</button>
      </div>

      {village && (
        <div className="card villageSummary">
          <h2>今日のISDL</h2>
          <p>今日の活動人数: {village.active_users}人</p>
          <p>天気: {village.weather}</p>
          <p>
            共有街 Lv.{village.level}: {village.title}
          </p>
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
