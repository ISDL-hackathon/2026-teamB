import { useEffect } from "react";
import { requestJson } from "../api";
import PixelTown from "./PixelTown";

const weatherClassNames = {
  快晴: "weatherRainbow",
  晴れ: "weatherSunny",
  曇り: "weatherCloudy",
  雨: "weatherRainy",
  雷雨: "weatherStorm",
};

// 天気ごとの背景(ホームと揃える。GIFは public/weather/ に配置)
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

function VillagePage({ currentUser, setCurrentUser, setPage, village, villageSlots, onPcClick }) {
  useEffect(() => {
    requestJson("/quests/visit-village", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id }),
    })
      .then((data) => setCurrentUser((current) => ({ ...current, ...data.user })))
      .catch(() => {});
  }, [currentUser.id, setCurrentUser]);

  return (
    <div
      className="villageWeather"
      style={getWeatherBackground(village?.weather)}
    >
      <div className="pageHeader">
        <button className="secondaryButton" onClick={() => setPage("home")}>
          Home
        </button>
      </div>

      <div className="card villageCard">
        <h2>共有街</h2>
        {village ? (
          <>
            <PixelTown
              weather={weatherClassNames[village.weather] || "weatherStorm"}
              level={village.level}
              mode="view"
              slots={villageSlots}
              onPcClick={onPcClick}
            />

            <h3>
              Lv.{village.level}: {village.title}
            </h3>
            <p>{village.description}</p>
            <div className="statusGrid">
              <div>
                <span>全体ポイント</span>
                <strong className="pointValue">{village.total_point} pt</strong>
              </div>
              <div>
                <span>今日の活動人数</span>
                <strong>{village.active_users} 人</strong>
              </div>
              <div>
                <span>天気</span>
                <strong>{village.weather}</strong>
              </div>
            </div>
          </>
        ) : (
          <p>読み込み中...</p>
        )}
      </div>

      <div className="card">
        <h2>共有街の説明</h2>
        <p>
          共有街は、研究室メンバーの活動ポイントによって発展します。
          研究室に来る人が増えるほど街が育ち、今日の活動人数によって天気も変化します。
        </p>
      </div>
    </div>
  );
}

export default VillagePage;
