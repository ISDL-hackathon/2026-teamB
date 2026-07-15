import { useEffect } from "react";
import loadBase from "../assets/game-load-base.gif";
import loadProgress from "../assets/game-load-progress.gif";
import "./GamePages.css";

function GameLoadingPage({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 5000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="gamePage" aria-label="ゲームを読み込み中">
      <div className="gameLoadingCanvas">
        <img alt="" className="gameLoadingBase" src={loadBase} />
        <img alt="読み込み中" className="gameLoadingProgress" src={loadProgress} />
      </div>
    </main>
  );
}

export default GameLoadingPage;
