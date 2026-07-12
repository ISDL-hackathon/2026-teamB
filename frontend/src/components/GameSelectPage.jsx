import { useState } from "react";
import selectBase from "../assets/game-select-base.png";
import "./GamePages.css";

function GameSelectPage({ setPage }) {
  const [message, setMessage] = useState("");

  return (
    <main className="gamePage">
      <div className="gameSelectCanvas">
        <img alt="ゲーム選択画面" src={selectBase} />
        {message && <p className="gameSelectMessage">{message}</p>}
        <button
          aria-label="個人ルームへ戻る"
          className="gameSelectHitArea gameSelectBack"
          onClick={() => setPage("room")}
          type="button"
        />
        <button
          aria-label="ゲームをスタート"
          className="gameSelectHitArea gameSelectStart"
          onClick={() => setMessage("ゲームは準備中です")}
          type="button"
        />
      </div>
    </main>
  );
}

export default GameSelectPage;
