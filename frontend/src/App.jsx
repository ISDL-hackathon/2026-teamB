import { useEffect, useState } from "react";
import { requestJson } from "./api";
import HomePage from "./components/HomePage";
import LoginArea from "./components/LoginArea";
import RoomPage from "./components/RoomPage";
import VillagePage from "./components/VillagePage";
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
            : `${data.user.name}でログインしました。本日はログイン済みです`,
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

  const handleSaveRoomLayout = (layout) => {
    if (!currentUser) {
      return;
    }

    requestJson(`/room/layout/${currentUser.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: layout }),
    })
      .then((data) => {
        setRoom((prev) =>
          prev ? { ...prev, room_layout: data.room_layout } : prev,
        );
      })
      .catch((err) => setMessage(err.message));
  };

  return (
    <div className="app">
      <header className="appHeader">
        <h1>ISDL ハッカソン</h1>
        <p>研究室活動ポイント</p>
      </header>

      {!currentUser && (
        <LoginArea
          loginName={loginName}
          loginPassword={loginPassword}
          mode={mode}
          onLogin={handleLogin}
          onRegister={handleRegister}
          registerGrade={registerGrade}
          registerName={registerName}
          registerPassword={registerPassword}
          setLoginName={setLoginName}
          setLoginPassword={setLoginPassword}
          setMode={setMode}
          setRegisterGrade={setRegisterGrade}
          setRegisterName={setRegisterName}
          setRegisterPassword={setRegisterPassword}
        />
      )}

      {currentUser && page === "home" && (
        <HomePage
          currentUser={currentUser}
          onCheckin={handleCheckin}
          onLogout={handleLogout}
          ranking={ranking}
          setPage={setPage}
          village={village}
        />
      )}

      {currentUser && page === "village" && (
        <VillagePage setPage={setPage} village={village} />
      )}

      {currentUser && page === "room" && (
        <RoomPage
          onSaveRoomLayout={handleSaveRoomLayout}
          room={room}
          setPage={setPage}
        />
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
