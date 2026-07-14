import { useState } from "react";
import selectBase from "../assets/game-select-base.png";
import "./GamePages.css";

function GameSelectPage({ setPage }) {
  const [screen, setScreen] = useState("games");

  return (
    <main className="gamePage">
      <div className="gameSelectCanvas">
        <img alt="ゲーム選択画面" src={selectBase} />
        <div className="gameSelectPanel">
          {screen === "games" ? (
            <>
              <button className="gameMenuButton" onClick={() => setScreen("modes")} type="button">
                <strong>対戦ゲーム</strong>
                <span>攻守交替バトル</span>
              </button>
              <button className="gameMenuButton" onClick={() => setPage("mahjongSupport")} type="button">
                <strong>麻雀サポート</strong>
                <span>現実の対局を点数・サイコロで補助</span>
              </button>
            </>
          ) : (
            <>
              <h3>モードをえらんでね</h3>
              <button className="gameMenuButton" onClick={() => setPage("cpuBattle")} type="button">
                <strong>CPU戦</strong>
                <span>ひとりであそぶ</span>
              </button>
              <button className="gameMenuButton" onClick={() => setPage("onlineBattle")} type="button">
                <strong>対人戦</strong>
                <span>ログインユーザーとあそぶ</span>
              </button>
            </>
          )}
        </div>
        <button
          aria-label="個人ルームへ戻る"
          className="gameSelectHitArea gameSelectBack"
          onClick={() => screen === "games" ? setPage("room") : setScreen("games")}
          type="button"
        />
        <button
          aria-label="ゲームをスタート"
          className="gameSelectHitArea gameSelectStart"
          onClick={() => screen === "games" ? setScreen("modes") : setPage("onlineBattle")}
          type="button"
        />
      </div>
    </main>
  );
}

export default GameSelectPage;
