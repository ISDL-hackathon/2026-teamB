import { useEffect, useRef, useState } from "react";
import cpuNormalImg from "../assets/game/cpu-normal.gif";
import cpuChargeImg from "../assets/game/cpu-charge.gif";
import cpuHighImg from "../assets/game/cpu-high.gif";
import cpuLowImg from "../assets/game/cpu-low.gif";
import cpuJumpImg from "../assets/game/cpu-jump.gif";
import cpuCrouchImg from "../assets/game/cpu-crouch.gif";
import cpuCriticalImg from "../assets/game/cpu-critical.gif";
import cpuVictoryImg from "../assets/game/cpu-victory.gif";
import cpuDefeatImg from "../assets/game/cpu-defeat.gif";
import criticalGuardImg from "../assets/game/critical-guard.gif";
import "./CpuBattlePage.css";

const MAX_LIFE = 3;
const MAX_GAUGE = 5;
const ACTION_TIME_LIMIT = 15;
const ACTION_ANIMATION_MS = 1200 * 3;

const cpuActionImages = {
  normal: cpuNormalImg,
  charge: cpuChargeImg,
  high: cpuHighImg,
  low: cpuLowImg,
  jump: cpuJumpImg,
  crouch: cpuCrouchImg,
  critical: cpuCriticalImg,
  critical_guard: cpuNormalImg,
};

const attackActions = [
  { id: "charge", label: "ためる", detail: "ゲージ +1" },
  { id: "high", label: "上段攻撃", detail: "しゃがみで回避" },
  { id: "low", label: "下段攻撃", detail: "ジャンプで回避" },
  { id: "critical", label: "クリティカル", detail: "ゲージ3・一撃必殺" },
];

const defenseActions = [
  { id: "charge", label: "ためる", detail: "ゲージ +1" },
  { id: "jump", label: "ジャンプ", detail: "下段を回避" },
  { id: "crouch", label: "しゃがむ", detail: "上段を回避" },
  { id: "critical_guard", label: "クリティカル防御", detail: "ゲージ2・失敗時2倍" },
];

function chooseCpuAction(role, gauge) {
  const choices = role === "attack"
    ? attackActions.filter((action) => action.id !== "critical" || gauge >= 3)
    : defenseActions.filter((action) => action.id !== "critical_guard" || gauge >= 2);
  return choices[Math.floor(Math.random() * choices.length)].id;
}

function resolveAttack(attack, defense) {
  if (attack === "charge") return { damage: 0, text: "攻撃側は力をためた！" };
  if (attack === "critical") {
    return defense === "critical_guard"
      ? { damage: 0, text: "クリティカル防御成功！必殺技を防いだ！" }
      : { damage: 99, text: "クリティカルヒット！一撃必殺！" };
  }
  const avoided = (attack === "high" && defense === "crouch") ||
    (attack === "low" && defense === "jump");
  if (avoided) return { damage: 0, text: "防御成功！攻撃をかわした！" };
  if (defense === "critical_guard") {
    return { damage: 2, text: "クリティカル防御失敗！2ダメージ！" };
  }
  return { damage: 1, text: "攻撃命中！1ダメージ！" };
}

function Life({ value }) {
  return <span className="battleLife">{"♥".repeat(value)}{"♡".repeat(MAX_LIFE - value)}</span>;
}

function CpuBattlePage({ currentUser, setPage }) {
  const [playerLife, setPlayerLife] = useState(MAX_LIFE);
  const [cpuLife, setCpuLife] = useState(MAX_LIFE);
  const [playerGauge, setPlayerGauge] = useState(0);
  const [cpuGauge, setCpuGauge] = useState(0);
  const [playerRole, setPlayerRole] = useState("attack");
  const [turn, setTurn] = useState(1);
  const [log, setLog] = useState("あなたの攻撃からスタート！");
  const [playerLog, setPlayerLog] = useState("選択待ち");
  const [cpuLog, setCpuLog] = useState("選択待ち");
  const [winner, setWinner] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(ACTION_TIME_LIMIT);
  const [playerVisual, setPlayerVisual] = useState({ action: "normal", key: 0 });
  const [cpuVisual, setCpuVisual] = useState({ action: "normal", key: 0 });
  const actionLockedRef = useRef(false);

  useEffect(() => {
    if (playerVisual.action === "normal") return undefined;
    const timer = window.setTimeout(() => {
      setPlayerVisual(({ key }) => ({ action: "normal", key: key + 1 }));
    }, ACTION_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [playerVisual.action, playerVisual.key]);

  useEffect(() => {
    if (cpuVisual.action === "normal") return undefined;
    const timer = window.setTimeout(() => {
      setCpuVisual(({ key }) => ({ action: "normal", key: key + 1 }));
    }, ACTION_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [cpuVisual.action, cpuVisual.key]);

  const handleAction = (playerAction) => {
    if (winner || actionLockedRef.current) return;
    actionLockedRef.current = true;
    setPlayerVisual(({ key }) => ({ action: playerAction, key: key + 1 }));

    let nextPlayerLife = playerLife;
    let nextCpuLife = cpuLife;
    let nextPlayerGauge = playerGauge;
    let nextCpuGauge = cpuGauge;
    let resultText = "";

    if (playerRole === "attack") {
      const cpuAction = chooseCpuAction("defense", cpuGauge);
      setCpuVisual(({ key }) => ({ action: cpuAction, key: key + 1 }));
      if (playerAction === "charge") nextPlayerGauge = Math.min(MAX_GAUGE, playerGauge + 1);
      if (playerAction === "critical") nextPlayerGauge -= 3;
      if (cpuAction === "charge") nextCpuGauge = Math.min(MAX_GAUGE, cpuGauge + 1);
      if (cpuAction === "critical_guard") nextCpuGauge -= 2;
      const result = resolveAttack(playerAction, cpuAction);
      nextCpuLife = result.damage >= 99 ? 0 : Math.max(0, cpuLife - result.damage);
      setPlayerLog(attackActions.find((a) => a.id === playerAction).label);
      setCpuLog(`${defenseActions.find((a) => a.id === cpuAction).label}｜${result.text}`);
      resultText = `あなた: ${attackActions.find((a) => a.id === playerAction).label} / CPU: ${defenseActions.find((a) => a.id === cpuAction).label} — ${result.text}`;
    } else {
      const cpuAction = chooseCpuAction("attack", cpuGauge);
      setCpuVisual(({ key }) => ({ action: cpuAction, key: key + 1 }));
      if (playerAction === "charge") nextPlayerGauge = Math.min(MAX_GAUGE, playerGauge + 1);
      if (playerAction === "critical_guard") nextPlayerGauge -= 2;
      if (cpuAction === "charge") nextCpuGauge = Math.min(MAX_GAUGE, cpuGauge + 1);
      if (cpuAction === "critical") nextCpuGauge -= 3;
      const result = resolveAttack(cpuAction, playerAction);
      nextPlayerLife = result.damage >= 99 ? 0 : Math.max(0, playerLife - result.damage);
      setPlayerLog(`${defenseActions.find((a) => a.id === playerAction).label}｜${result.text}`);
      setCpuLog(attackActions.find((a) => a.id === cpuAction).label);
      resultText = `CPU: ${attackActions.find((a) => a.id === cpuAction).label} / あなた: ${defenseActions.find((a) => a.id === playerAction).label} — ${result.text}`;
    }

    setPlayerLife(nextPlayerLife);
    setCpuLife(nextCpuLife);
    setPlayerGauge(nextPlayerGauge);
    setCpuGauge(nextCpuGauge);
    setLog(resultText);

    if (nextCpuLife <= 0) setWinner("player");
    else if (nextPlayerLife <= 0) setWinner("cpu");
    else {
      setPlayerRole((role) => role === "attack" ? "defense" : "attack");
      setTurn((current) => current + 1);
    }
  };

  useEffect(() => {
    if (winner) return undefined;

    actionLockedRef.current = false;
    setRemainingSeconds(ACTION_TIME_LIMIT);
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemainingSeconds(Math.max(0, ACTION_TIME_LIMIT - elapsed));
    }, 250);
    const timeout = window.setTimeout(() => {
      setRemainingSeconds(0);
      handleAction("charge");
    }, ACTION_TIME_LIMIT * 1000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [turn, winner]);

  const resetGame = () => {
    setPlayerLife(MAX_LIFE);
    setCpuLife(MAX_LIFE);
    setPlayerGauge(0);
    setCpuGauge(0);
    setPlayerRole("attack");
    setTurn(1);
    setLog("あなたの攻撃からスタート！");
    setPlayerLog("選択待ち");
    setCpuLog("選択待ち");
    setWinner(null);
    setRemainingSeconds(ACTION_TIME_LIMIT);
    actionLockedRef.current = false;
    setPlayerVisual(({ key }) => ({ action: "normal", key: key + 1 }));
    setCpuVisual(({ key }) => ({ action: "normal", key: key + 1 }));
  };

  const actions = playerRole === "attack" ? attackActions : defenseActions;

  return (
    <main className="cpuBattlePage">
      <section className="cpuBattleCabinet">
        <header className="battleHeader">
          <button onClick={() => setPage("gameSelect")} type="button">← セレクト</button>
          <h2>TURN {turn}</h2>
          <span>{playerRole === "attack" ? "あなたの攻撃" : "あなたの守り"}</span>
        </header>

        {!winner && (
          <p className={`battleTimer ${remainingSeconds <= 5 ? "isUrgent" : ""}`}>
            選択時間 {remainingSeconds}秒
            <small>時間切れは「ためる」</small>
          </p>
        )}

        <div className="battleFighters">
          <div className="battleFighter">
            <strong>{currentUser?.name ?? "PLAYER"}</strong>
            <Life value={playerLife} />
            <div className="battleCharacterVisual">
              <span className={`battleRoleMark playerRoleMark ${playerRole === "attack" ? "isAttack" : "isDefense"}`}>
                {playerRole === "attack" ? "攻" : "守"}
              </span>
              <img
                alt="プレイヤー"
                className="playerCharacterImage"
                key={`${winner ?? playerVisual.action}-${playerVisual.key}`}
                src={winner ? (winner === "player" ? cpuVictoryImg : cpuDefeatImg) : cpuActionImages[playerVisual.action]}
              />
              {!winner && playerVisual.action === "critical_guard" && (
                <img alt="クリティカル防御" className="playerGuardImage" src={criticalGuardImg} />
              )}
            </div>
            <span>ゲージ {playerGauge}/{MAX_GAUGE}</span>
            <p className="fighterLog">{playerLog}</p>
          </div>
          <div className="battleVersus">VS</div>
          <div className="battleFighter">
            <strong>CPU</strong>
            <Life value={cpuLife} />
            <div className="cpuFighterVisual">
              <span className={`battleRoleMark cpuRoleMark ${playerRole === "attack" ? "isDefense" : "isAttack"}`}>
                {playerRole === "attack" ? "守" : "攻"}
              </span>
              <img
                alt="CPU"
                className="cpuCharacterImage"
                key={`${winner ?? cpuVisual.action}-${cpuVisual.key}`}
                src={winner ? (winner === "cpu" ? cpuVictoryImg : cpuDefeatImg) : cpuActionImages[cpuVisual.action]}
              />
              {!winner && cpuVisual.action === "critical_guard" && (
                <img alt="クリティカル防御" className="cpuGuardImage" src={criticalGuardImg} />
              )}
            </div>
            <span>ゲージ {cpuGauge}/{MAX_GAUGE}</span>
            <p className="fighterLog">{cpuLog}</p>
          </div>
        </div>

        {winner && <p className="battleLog">{winner === "player" ? "YOU WIN!" : "YOU LOSE..."}</p>}

        {winner ? (
          <div className="battleResultActions">
            <button onClick={resetGame} type="button">もう一度</button>
            <button onClick={() => setPage("gameSelect")} type="button">ゲーム選択へ</button>
          </div>
        ) : (
          <div className="battleCommands">
            {actions.map((action) => {
              const disabled = (action.id === "critical" && playerGauge < 3) ||
                (action.id === "critical_guard" && playerGauge < 2);
              return (
                <button disabled={disabled} key={action.id} onClick={() => handleAction(action.id)} type="button">
                  <strong>{action.label}</strong>
                  <span>{action.detail}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default CpuBattlePage;
