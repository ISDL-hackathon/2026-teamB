import PixelTown from "./PixelTown";

const weatherClassNames = {
  快晴: "weatherRainbow",
  晴れ: "weatherSunny",
  曇り: "weatherCloudy",
  雨: "weatherRainy",
  雷雨: "weatherStorm",
};

function VillagePage({ setPage, village }) {
  return (
    <>
      <div className="pageHeader">
        <button className="secondaryButton" onClick={() => setPage("home")}>
          ホームへ戻る
        </button>
      </div>

      <div className="card villageCard">
        <h2>共有街</h2>
        {village ? (
          <>
            <PixelTown weather={weatherClassNames[village.weather] || "weatherStorm"} />

            <h3>
              Lv.{village.level}: {village.title}
            </h3>
            <p>{village.description}</p>
            <div className="statusGrid">
              <div>
                <span>全体ポイント</span>
                <strong>{village.total_point} pt</strong>
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
    </>
  );
}

export default VillagePage;
