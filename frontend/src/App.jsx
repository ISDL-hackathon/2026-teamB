import { useEffect, useState } from "react";
//import PixelTown from "./components/PixelTown";
import PixelRoom from "./components/PixelRoom";
import "./App.css";

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
    fetch("http://127.0.0.1:8000/ranking")
      .then((res) => res.json())
      .then((data) => setRanking(data))
      .catch((err) => console.error(err));
  };

  const fetchVillage = () => {
    fetch("http://127.0.0.1:8000/village/status")
      .then((res) => res.json())
      .then((data) => setVillage(data))
      .catch((err) => console.error(err));
  };

  const fetchRoom = (userId) => {
    fetch(`http://127.0.0.1:8000/room/status/${userId}`)
      .then((res) => res.json())
      .then((data) => setRoom(data))
      .catch((err) => console.error(err));
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
    fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerName,
        grade: registerGrade,
        password: registerPassword,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail);
        }
        return data;
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
    fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: loginName,
        password: loginPassword,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail);
        }
        return data;
      })
      .then((data) => {
        setCurrentUser(data.user);

        if (data.added_point > 0) {
          setMessage(
            `${data.user.name}でログインしました。本日初ログイン +${data.added_point}pt`
          );
        } else {
          setMessage(`${data.user.name}でログインしました。本日はログイン済みです`);
        }

        setPage("home");
        fetchRoom(data.user.id);
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

    fetch("http://127.0.0.1:8000/activity/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUser.id,
        activity_type: "checkin",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message + ` +${data.added_point}pt`);

        setCurrentUser((prev) => ({
          ...prev,
          point: prev.point + data.added_point,
        }));

        refreshAll(currentUser.id);
      })
      .catch((err) => console.error(err));
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
    <div className="card">
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
              ユーザ登録
            </button>
          </p>
        </>
      ) : (
        <>
          <h2>ユーザ登録</h2>

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
      style={{
        backgroundImage:
          "linear-gradient(rgba(17, 19, 26, 0.65), rgba(17, 19, 26, 0.65)), url('/weather/rainy.gif')",
      }}
    >
      <div className="card homeUserCard">
        <div className="homeUserHeader">
          <div className="homeUserInfo">
            <p>
              ログイン中：{currentUser.name}（{currentUser.grade}）
            </p>
            <p>自分のポイント：{currentUser.point} pt</p>
          </div>

          <button className="logoutButtonCompact" onClick={handleLogout}>
            ログアウト
          </button>
        </div>

        <button onClick={handleCheckin}>ポイント増加ボタン</button>
      </div>

      <div className="menuGrid">
        <button onClick={() => setPage("village")}>共用街へ</button>
        <button onClick={() => setPage("room")}>個人ルームへ</button>
      </div>

      {village && (
        <div className="card">
          <h2>今日のISDL</h2>
          
          <p>今日の活動人数：{village.active_users}人</p>
          <p>
            共用街 Lv.{village.level}：{village.title}
          </p>
        </div>
      )}

      <h2>ランキング</h2>
      {renderRanking()}
    </div>
  );

  const renderVillage = () => (
    <>
      <div className="pageHeader">
        <button className="backButton" onClick={() => setPage("home")}>
          ← ホームへ
        </button>
      </div>

      <div className="card villageCard">
        <h2>共用街</h2>

        {village ? (
          <>
            
            <h3>
              Lv.{village.level}：{village.title}
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
              
            </div>
          </>
        ) : (
          <p>読み込み中...</p>
        )}
      </div>

      <div className="card">
        <h2>共用街の説明</h2>
        <p>
          共用街は，全員の活動ポイントによって発展していく．
          研究室に来る人が増えるほど街が発展し，今日の活動人数によって天気も変化する．
        </p>
      </div>
    </>
  );

  const renderRoom = () => (
    <>
      <div className="pageHeader">
        <button className="backButton" onClick={() => setPage("home")}>
          ← ホームへ
        </button>
      </div>

      <div className="card roomCard">
        <h2>個人ルーム</h2>

        {room ? (
          <>
            <PixelRoom level={room.room_level} />

            <h3>
              Lv.{room.room_level}：{room.room_name}
            </h3>
            <p>{room.room_description}</p>

            <div className="statusGrid">
              <div>
                <span>ユーザ</span>
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
      <h1>ISDLハッカソン</h1>
      <h2>研究室ポイント</h2>

      {!currentUser && renderLoginArea()}

      {currentUser && page === "home" && renderHome()}
      {currentUser && page === "village" && renderVillage()}
      {currentUser && page === "room" && renderRoom()}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;