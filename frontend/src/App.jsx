import { useEffect, useState } from "react";
import PixelRoom from "./components/PixelRoom";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000";

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
    image: "url('/weather/kaminari.gif')",
  },
};

function getWeatherBackground(weather) {
  const background = weatherBackgrounds[weather] || weatherBackgrounds.雷雨;

  return {
    backgroundImage: `${background.overlay}, ${background.image}`,
  };
}

async function requestJson(path, options) {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "通信に失敗しました");
  }

  return data;
}

function App() {
  const [mode, setMode] = useState("login");
  const [page, setPage] = useState("home");

  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerGrade, setRegisterGrade] = useState("U4");
  const [registerPassword, setRegisterPassword] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [village, setVillage] = useState(null);
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");

  const fetchRanking = () => {
    requestJson("/ranking")
      .then(setRanking)
      .catch((err) => setMessage(err.message));
  };

  const fetchVillage = () => {
    requestJson("/village/status")
      .then(setVillage)
      .catch((err) => setMessage(err.message));
  };

  const fetchRoom = (userId) => {
    requestJson(`/room/status/${userId}`)
      .then(setRoom)
      .catch((err) => setMessage(err.message));
  };

  const refreshAll = (userId = currentUser?.id) => {
    fetchRanking();
    fetchVillage();

    if (userId) {
      fetchRoom(userId);
    }
  };

  useEffect(() => {
    fetchRanking();
    fetchVillage();
  }, []);

  const handleRegister = () => {
    if (!registerName.trim() || !registerPassword.trim()) {
      setMessage("名前とパスワードを入力してください");
      return;
    }

    requestJson("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: registerName.trim(),
        grade: registerGrade,
        password: registerPassword,
      }),
    })
      .then((data) => {
        setMessage(data.message);
        setMode("login");
        setRegisterName("");
        setRegisterPassword("");
        refreshAll();
      })
      .catch((err) => setMessage(err.message));
  };

  const handleLogin = () => {
    if (!loginName.trim() || !loginPassword.trim()) {
      setMessage("名前とパスワードを入力してください");
      return;
    }

    requestJson("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: loginName.trim(),
        password: loginPassword,
      }),
    })
      .then((data) => {
        setCurrentUser(data.user);
        setMessage(
          data.added_point > 0
            ? `${data.user.name}でログインしました。本日初ログイン +${data.added_point}pt`
            : `${data.user.name}でログインしました。本日はログイン済みです`
        );
        setPage("home");
        refreshAll(data.user.id);
      })
      .catch((err) => setMessage(err.message));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRoom(null);
    setPage("home");
    setMessage("ログアウトしました");
  };

  const handleCheckin = () => {
    if (!currentUser) {
      setMessage("ログインしてください");
      return;
    }

    requestJson("/activity/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        activity_type: "checkin",
      }),
    })
      .then((data) => {
        setMessage(`${data.message} +${data.added_point}pt`);
        setCurrentUser((prev) => ({
          ...prev,
          point: prev.point + data.added_point,
        }));
        refreshAll(currentUser.id);
      })
      .catch((err) => setMessage(err.message));
  };

  const renderRanking = () => (
    <table>
      <thead>
        <tr>
          <th>順位</th>
          <th>名前</th>
          <th>学年</th>
          <th>ポイント</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.grade}</td>
            <td>{user.point} pt</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderLoginArea = () => (
    <div className="card authCard">
      {mode === "login" ? (
        <>
          <h2>ログイン</h2>
          <input
            type="text"
            placeholder="名前"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={handleLogin}>ログイン</button>
          <p>
            アカウントがない場合は{" "}
            <button className="linkButton" onClick={() => setMode("register")}>
              ユーザー登録
            </button>
          </p>
        </>
      ) : (
        <>
          <h2>ユーザー登録</h2>
          <input
            type="text"
            placeholder="名前"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
          />
          <select
            value={registerGrade}
            onChange={(e) => setRegisterGrade(e.target.value)}
          >
            <option value="U4">U4</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
            <option value="教員">教員</option>
          </select>
          <input
            type="password"
            placeholder="パスワード"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <button onClick={handleRegister}>登録</button>
          <p>
            すでにアカウントがある場合は{" "}
            <button className="linkButton" onClick={() => setMode("login")}>
              ログイン
            </button>
          </p>
        </>
      )}
    </div>
  );

  const renderHome = () => (
    <div
      className="homeWeather"
      style={getWeatherBackground(village?.weather)}
    >
      <div className="card homeUserCard">
        <div className="homeUserHeader">
          <div className="homeUserInfo">
            <span className="eyebrow">ログイン中</span>
            <p>
              {currentUser.name} / {currentUser.grade}
            </p>
            <strong>{currentUser.point} pt</strong>
          </div>
          <button className="secondaryButton compactButton" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
        <button onClick={handleCheckin}>活動ポイントを追加</button>
      </div>

      <div className="menuGrid">
        <button onClick={() => setPage("village")}>共用街へ</button>
        <button onClick={() => setPage("room")}>個人ルームへ</button>
      </div>

      {village && (
        <div className="card villageSummary">
          <h2>今日のISDL</h2>
          <p>今日の活動人数: {village.active_users}人</p>
          <p>天気: {village.weather}</p>
          <p>
            共用街 Lv.{village.level}: {village.title}
          </p>
        </div>
      )}

      <section className="rankingSection">
        <h2>ランキング</h2>
        {renderRanking()}
      </section>
    </div>
  );

  const renderVillage = () => (
    <>
      <div className="pageHeader">
        <button className="secondaryButton" onClick={() => setPage("home")}>
          ホームへ戻る
        </button>
      </div>

      <div className="card villageCard">
        <h2>共用街</h2>
        {village ? (
          <>
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
        <h2>共用街の説明</h2>
        <p>
          共用街は、研究室メンバーの活動ポイントによって発展します。
          研究室に来る人が増えるほど街が育ち、今日の活動人数によって天気も変化します。
        </p>
      </div>
    </>
  );

  const renderRoom = () => (
    <>
      <div className="pageHeader">
        <button className="secondaryButton" onClick={() => setPage("home")}>
          ホームへ戻る
        </button>
      </div>

      <div className="card roomCard">
        <h2>個人ルーム</h2>
        {room ? (
          <>
            <PixelRoom level={room.room_level} />
            <h3>
              Lv.{room.room_level}: {room.room_name}
            </h3>
            <p>{room.room_description}</p>
            <div className="statusGrid">
              <div>
                <span>ユーザー</span>
                <strong>{room.user.name}</strong>
              </div>
              <div>
                <span>学年</span>
                <strong>{room.user.grade}</strong>
              </div>
              <div>
                <span>ポイント</span>
                <strong>{room.user.point} pt</strong>
              </div>
            </div>
          </>
        ) : (
          <p>読み込み中...</p>
        )}
      </div>
    </>
  );

  return (
    <div className="app">
      <header className="appHeader">
        <h1>ISDL ハッカソン</h1>
        <p>研究室活動ポイント</p>
      </header>

      {!currentUser && renderLoginArea()}
      {currentUser && page === "home" && renderHome()}
      {currentUser && page === "village" && renderVillage()}
      {currentUser && page === "room" && renderRoom()}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
