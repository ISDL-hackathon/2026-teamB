import { useEffect, useState } from "react";
import { requestJson } from "./api";
import HomePage from "./components/HomePage";
import BulletinBoardPage from "./components/BulletinBoardPage";
import BulletinLoadingPage from "./components/BulletinLoadingPage";
import GameLoadingPage from "./components/GameLoadingPage";
import GameSelectPage from "./components/GameSelectPage";
import CpuBattlePage from "./components/CpuBattlePage";
import OnlineBattlePage from "./components/OnlineBattlePage";
import MahjongSupportPage from "./components/MahjongSupportPage";
import LoginArea from "./components/LoginArea";
import RoomLoadingPage from "./components/RoomLoadingPage";
import RoomPage from "./components/RoomPage";
import ShopPage from "./components/ShopPage";
import VillagePage from "./components/VillagePage";
import VillageSlotSelectPage from "./components/VillageSlotSelectPage";
import "./App.css";

function App() {
  const [mode, setMode] = useState("login");
  const [page, setPage] = useState("home");

  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerGrade, setRegisterGrade] = useState("U4");
  const [registerPassword, setRegisterPassword] = useState("");

  const [villageSlots, setVillageSlots] = useState([]);
  const [viewingRoomUserId, setViewingRoomUserId] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = JSON.parse(sessionStorage.getItem("isdlCurrentUser"));
      return savedUser?.session_token ? savedUser : null;
    } catch {
      return null;
    }
  });
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
    fetchVillageSlots();

    if (userId) {
      fetchRoom(userId);
    }
  };

  useEffect(() => {
    fetchRanking();
    fetchVillage();
  }, []);

  useEffect(() => {
    if (!currentUser?.session_token) return undefined;
    let stopped = false;

    const heartbeat = () => {
      requestJson("/session/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          session_token: currentUser.session_token,
        }),
      })
        .then((data) => {
          if (stopped || data.active) return;
          sessionStorage.removeItem("isdlCurrentUser");
          setCurrentUser(null);
          setRoom(null);
          setViewingRoomUserId(null);
          setPage("home");
          setMessage("ログインの有効期限が切れました。もう一度ログインしてください");
        })
        .catch(() => {});
    };

    heartbeat();
    const timer = window.setInterval(heartbeat, 15_000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [currentUser?.id, currentUser?.session_token]);

  useEffect(() => {
    if (currentUser?.session_token) {
      sessionStorage.setItem("isdlCurrentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

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
        sessionStorage.setItem("isdlCurrentUser", JSON.stringify(data.user));
        setMessage(
          data.added_point > 0
            ? `${data.user.name}でログインしました。本日初ログイン +${data.added_point}pt`
            : `${data.user.name}でログインしました。本日はログイン済みです`,
        );
        if (data.user.village_slot_id) {
          setPage("home");
        } else {
          setPage("selectVillageSlot");
        }
        refreshAll(data.user.id);
      })
      .catch((err) => setMessage(err.message));
  };

  const handleLogout = () => {
    if (!currentUser) return;

    requestJson("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        session_token: currentUser.session_token,
      }),
    }).finally(() => {
      sessionStorage.removeItem("isdlCurrentUser");
      setCurrentUser(null);
      setRoom(null);
      setViewingRoomUserId(null);
      setPage("home");
      setMessage("ログアウトしました");
    });
  };

  const fetchVillageSlots = () => {
    requestJson("/village/slots")
      .then(setVillageSlots)
      .catch((err) => setMessage(err.message));
  };

  const handleSelectVillageSlot = (slotId) => {
    if (!currentUser) return;

    requestJson("/village/position", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        slot_id: slotId,
      }),
    })
      .then((data) => {
        setCurrentUser((prev) => ({
          ...prev,
          village_slot_id: data.slot_id,
        }));
        fetchVillageSlots();
        setPage("home");
      })
      .catch((err) => setMessage(err.message));
  };

  const handleOpenReadonlyRoom = (userId) => {
    if (!currentUser) return;

    setViewingRoomUserId(userId);
    fetchRoom(userId);
    setPage("roomLoading");
  };

  const handleOpenMyRoom = () => {
    if (!currentUser) return;

    setViewingRoomUserId(null);
    fetchRoom(currentUser.id);
    setPage("roomLoading");
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
          total_point: (prev.total_point ?? prev.point) + data.added_point,
        }));
        refreshAll(currentUser.id);
      })
      .catch((err) => setMessage(err.message));
  };

  const handlePurchaseFurniture = (furnitureId) => {
    if (!currentUser) {
      return;
    }

    requestJson("/shop/furniture/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        furniture_id: furnitureId,
      }),
    })
      .then((data) => {
        setCurrentUser(data.user);
        fetchRanking();
        fetchVillage();
        fetchRoom(currentUser.id);
        setMessage(`${data.item.name} を購入しました -${data.item.price}pt`);
      })
      .catch((err) => setMessage(err.message));
  };

  const handleSaveRoomLayout = (roomState) => {
    if (!currentUser) {
      return;
    }

    const items = Array.isArray(roomState) ? roomState : roomState.items;
    const theme = Array.isArray(roomState) ? room?.room_theme : roomState.theme;

    requestJson(`/room/layout/${currentUser.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, theme }),
    })
      .then((data) => {
        setRoom((prev) =>
          prev
            ? {
                ...prev,
                room_layout: data.room_layout,
                room_theme: data.room_theme,
              }
            : prev,
        );
      })
      .catch((err) => setMessage(err.message));
  };

  return (
    <div className={`app${!currentUser ? " login-mode" : ""}`}>
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
          onOpenMyRoom={handleOpenMyRoom}
          ranking={ranking}
          setPage={setPage}
          village={village}
        />
      )}

      {currentUser && page === "selectVillageSlot" && (
        <VillageSlotSelectPage
          currentUser={currentUser}
          onSelectSlot={handleSelectVillageSlot}
          setPage={setPage}
          village={village}
          villageSlots={villageSlots}
        />
      )}

      {currentUser && page === "village" && (
        <VillagePage
          onPcClick={handleOpenReadonlyRoom}
          setPage={setPage}
          village={village}
          villageSlots={villageSlots}
        />
      )}

      {currentUser && page === "room" && (
        <RoomPage
          onOpenBulletinBoard={() => setPage("bulletinLoading")}
          onOpenGameSelect={() => setPage("gameLoading")}
          onSaveRoomLayout={handleSaveRoomLayout}
          readonly={viewingRoomUserId !== null}
          room={room}
          setPage={setPage}
        />
      )}

      {currentUser && page === "roomLoading" && (
        <RoomLoadingPage onComplete={() => setPage("room")} />
      )}

      {currentUser && page === "gameLoading" && (
        <GameLoadingPage onComplete={() => setPage("gameSelect")} />
      )}

      {currentUser && page === "gameSelect" && (
        <GameSelectPage setPage={setPage} />
      )}

      {currentUser && page === "cpuBattle" && (
        <CpuBattlePage currentUser={currentUser} setPage={setPage} />
      )}

      {currentUser && page === "onlineBattle" && (
        <OnlineBattlePage currentUser={currentUser} setCurrentUser={setCurrentUser} setPage={setPage} />
      )}

      {currentUser && page === "mahjongSupport" && (
        <MahjongSupportPage currentUser={currentUser} setCurrentUser={setCurrentUser} setPage={setPage} />
      )}

      {currentUser && page === "bulletinLoading" && (
        <BulletinLoadingPage onComplete={() => setPage("bulletin")} />
      )}

      {currentUser && page === "bulletin" && (
        <BulletinBoardPage currentUser={currentUser} setPage={setPage} />
      )}

      {currentUser && page === "shop" && (
        <ShopPage
          onPurchaseFurniture={handlePurchaseFurniture}
          room={room}
          setPage={setPage}
        />
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
