import charaIcon from "../assets/chara.png";
import iconBase from "../assets/icons/maru.png";
import RankingTable from "./RankingTable";

const weatherBackgrounds = {
  快晴: {
    overlay: "linear-gradient(rgba(255, 188, 94, 0.18), rgba(41, 128, 185, 0.38))",
    image: "linear-gradient(135deg, #78c8ff 0%, #f8d87a 100%)",
  },
  晴れ: {
    overlay: "linear-gradient(rgba(255, 216, 119, 0.16), rgba(38, 98, 145, 0.42))",
    image: "linear-gradient(135deg, #6fb8f7 0%, #bfe7ff 52%, #ffe08a 100%)",
  },
  曇り: {
    overlay: "linear-gradient(rgba(35, 43, 56, 0.32), rgba(18, 22, 31, 0.58))",
    image: "linear-gradient(135deg, #6f7f91 0%, #b9c0c8 48%, #526273 100%)",
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
              <strong>{currentUser.point} pt</strong>
            </div>
          </div>
          <button className="secondaryButton compactButton" onClick={onLogout}>
            ログアウト
          </button>
        </div>
        <button onClick={onCheckin}>活動ポイントを追加</button>
      </div>

      <div className="menuGrid">
        <button onClick={() => setPage("village")}>共有街へ</button>
        <button onClick={() => setPage("room")}>個人ルームへ</button>
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
