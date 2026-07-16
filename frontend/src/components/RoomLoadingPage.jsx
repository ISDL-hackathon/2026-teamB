import { useEffect } from "react";
import roomLoading from "../assets/room-loading.gif";
import "./RoomLoadingPage.css";

const LOADING_DURATION_MS = 3600;

function RoomLoadingPage({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, LOADING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") onComplete();
  };

  return (
    <main
      className="roomLoadingPage"
      aria-label="個人ルームへ入室中。クリックでスキップ"
      onClick={onComplete}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <img
        alt="個人ルームへ入室中"
        className="roomLoadingImage"
        src={roomLoading}
      />
    </main>
  );
}

export default RoomLoadingPage;
