import { useEffect, useRef, useState } from "react";
import { requestBulletinJson, requestJson } from "../api";
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
const stakeOptions = [
  { id: "free", label: "0pt" },
  { id: "10", label: "10pt" },
  { id: "50", label: "50pt" },
  { id: "all", label: "全額" },
];

const actionImages = {
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

const actionLabel = (action) => [...attackActions, ...defenseActions]
  .find((item) => item.id === action)?.label ?? "選択待ち";

function Life({ value }) {
  return <span className="battleLife">{"♥".repeat(value)}{"♡".repeat(MAX_LIFE - value)}</span>;
}

function OnlineBattlePage({ currentUser, setCurrentUser, setPage }) {
  const [match, setMatch] = useState(null);
  const [lobby, setLobby] = useState({ rooms: [], own_room: null, my_point: currentUser.point });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(ACTION_TIME_LIMIT);
  const [myVisual, setMyVisual] = useState({ action: "normal", key: 0 });
  const [opponentVisual, setOpponentVisual] = useState({ action: "normal", key: 0 });
  const actionLockedRef = useRef(false);

  useEffect(() => {
    if (match) return undefined;
    let stopped = false;
    const refreshLobby = async () => {
      try {
        const data = await requestJson(`/battle/rooms?user_id=${currentUser.id}`);
        if (!stopped) {
          setLobby(data);
          if (data.active_match) setMatch(data.active_match);
        }
      } catch (err) {
        if (!stopped) setError(err.message);
      }
    };
    refreshLobby();
    const timer = window.setInterval(refreshLobby, 1200);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [currentUser.id, match]);

  useEffect(() => {
    const point = match?.my_point ?? lobby?.my_point;
    const totalPoint = match?.my_total_point ?? lobby?.my_total_point;
    if (!Number.isFinite(point)) return;
    setCurrentUser((user) => user ? {
      ...user,
      point,
      total_point: Number.isFinite(totalPoint) ? totalPoint : user.total_point,
    } : user);
  }, [lobby?.my_point, lobby?.my_total_point, match?.my_point, match?.my_total_point, setCurrentUser]);

  useEffect(() => {
    if (!match?.id || match.status !== "active") return undefined;
    let stopped = false;
    const refresh = async () => {
      try {
        const data = await requestJson(`/battle/match/${match.id}?user_id=${currentUser.id}`);
        if (!stopped) setMatch(data.match);
      } catch (err) {
        if (!stopped) setError(err.message);
      }
    };
    const timer = window.setInterval(refresh, 900);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [currentUser.id, match?.id, match?.status]);

  useEffect(() => {
    if (!match?.last_my_action || !match?.last_opponent_action) return;
    setMyVisual(({ key }) => ({ action: match.last_my_action, key: key + 1 }));
    setOpponentVisual(({ key }) => ({ action: match.last_opponent_action, key: key + 1 }));
  }, [match?.turn, match?.last_my_action, match?.last_opponent_action]);

  useEffect(() => {
    if (myVisual.action === "normal") return undefined;
    const timer = window.setTimeout(() => {
      setMyVisual(({ key }) => ({ action: "normal", key: key + 1 }));
    }, ACTION_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [myVisual.action, myVisual.key]);

  useEffect(() => {
    if (opponentVisual.action === "normal") return undefined;
    const timer = window.setTimeout(() => {
      setOpponentVisual(({ key }) => ({ action: "normal", key: key + 1 }));
    }, ACTION_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [opponentVisual.action, opponentVisual.key]);

  const handleBack = async () => {
    if (match?.status === "active") {
      await requestJson("/battle/forfeit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id, match_id: match.id }),
      }).catch(() => {});
    } else if (!match && lobby.own_room) {
      await requestJson(`/battle/rooms/${lobby.own_room.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id }),
      }).catch(() => {});
    }
    setPage("gameSelect");
  };

  const handleCreateRoom = async (stakeType) => {
    if (submitting || lobby.own_room) return;
    setSubmitting(true);
    setError("");
    try {
      const created = await requestJson("/battle/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id, stake_type: stakeType }),
      });
      if (created.room_id) {
        const stakeLabel = stakeType === "all"
          ? `全額勝負（${created.stake_amount}pt）`
          : `${created.stake_amount}pt勝負`;
        void requestBulletinJson("/bulletin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser.id,
            content: `🎮 対戦ゲームの部屋 #${created.room_id} を作りました！\n${stakeLabel}\nゲームセレクトから参加できます。`,
            image_data: null,
          }),
        }).catch(() => {});
      }
      const data = await requestJson(`/battle/rooms?user_id=${currentUser.id}`);
      setLobby(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await requestJson(`/battle/rooms/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id }),
      });
      setMatch(data.match);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRoom = async () => {
    if (!lobby.own_room || submitting) return;
    setSubmitting(true);
    try {
      await requestJson(`/battle/rooms/${lobby.own_room.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id }),
      });
      const data = await requestJson(`/battle/rooms?user_id=${currentUser.id}`);
      setLobby(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (action) => {
    if (!match || match.my_submitted || submitting || actionLockedRef.current) return;
    actionLockedRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const data = await requestJson("/battle/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match_id: match.id, user_id: currentUser.id, action }),
      });
      setMatch(data.match);
    } catch (err) {
      actionLockedRef.current = false;
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!match || match.status !== "active" || match.my_submitted) return undefined;

    actionLockedRef.current = false;
    setRemainingSeconds(ACTION_TIME_LIMIT);
    const deadlineAt = Date.parse(match.selection_deadline) || (Date.now() + ACTION_TIME_LIMIT * 1000);
    const updateRemainingTime = () => {
      setRemainingSeconds(Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000)));
    };
    updateRemainingTime();
    const interval = window.setInterval(() => {
      updateRemainingTime();
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [match?.id, match?.turn, match?.status, match?.my_submitted, match?.selection_deadline]);

  if (!match) {
    return (
      <main className="cpuBattlePage">
        <section className="cpuBattleCabinet battleRoomLobby">
          <header className="battleRoomHeader">
            <button onClick={handleBack} type="button">← セレクト</button>
            <h2>対戦ルーム</h2>
            <strong>{lobby.my_point ?? currentUser.point}pt</strong>
          </header>

          {lobby.own_room ? (
            <div className="ownBattleRoom">
              <span>ROOM #{lobby.own_room.id}</span>
              <strong>
                {lobby.own_room.stake_type === "all"
                  ? `全額勝負（${lobby.own_room.stake_amount}pt）`
                  : `${lobby.own_room.stake_amount}pt 勝負`}
              </strong>
              <div className="matchmakingDots" aria-label="参加待ち"><i /><i /><i /></div>
              <p>対戦相手の参加を待っています</p>
              <button disabled={submitting} onClick={handleCancelRoom} type="button">部屋を閉じる</button>
            </div>
          ) : (
            <div className="battleRoomCreate">
              <h3>賭けポイントを選んで部屋を作る</h3>
              <div className="battleStakeButtons">
                {stakeOptions.map((stake) => (
                  <button
                    disabled={submitting || (
                      stake.id === "all"
                        ? (lobby.my_point ?? 0) <= 0
                        : (lobby.my_point ?? 0) < Number(stake.id === "free" ? 0 : stake.id)
                    )}
                    key={stake.id}
                    onClick={() => handleCreateRoom(stake.id)}
                    type="button"
                  >
                    {stake.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="battleRoomList">
            <h3>募集中の部屋</h3>
            {lobby.rooms?.length ? lobby.rooms.map((room) => (
              <div className="battleRoomCard" key={room.id}>
                <span>#{room.id}　{room.host_name}</span>
                <strong>{room.stake_type === "all" ? "全額 VS 全額" : `${room.stake_amount}pt`}</strong>
                <button
                  disabled={submitting || room.host_id === currentUser.id || (
                    room.stake_type === "all"
                      ? (lobby.my_point ?? 0) <= 0
                      : (lobby.my_point ?? 0) < room.stake_amount
                  )}
                  onClick={() => handleJoinRoom(room.id)}
                  type="button"
                >
                  参加
                </button>
              </div>
            )) : <p>現在、募集中の部屋はありません</p>}
          </div>
          {error && <p className="onlineBattleError">{error}</p>}
        </section>
      </main>
    );
  }

  const actions = match.my_role === "attack" ? attackActions : defenseActions;
  const finished = match.status === "finished";

  return (
    <main className="cpuBattlePage">
      <section className="cpuBattleCabinet">
        <header className="battleHeader">
          <button onClick={handleBack} type="button">← セレクト</button>
          <h2>TURN {match.turn}</h2>
          <span>{match.my_role === "attack" ? "あなたの攻撃" : "あなたの守り"}</span>
        </header>

        {!finished && (
          <p className={`battleTimer ${remainingSeconds <= 5 ? "isUrgent" : ""}`}>
            選択時間 {remainingSeconds}秒
            <small>時間切れは「ためる」</small>
          </p>
        )}

        <p className="battlePot">
          あなた {match.my_stake ?? match.stake_amount}pt
          <strong>POT {match.pot_amount ?? (match.stake_amount * 2)}pt</strong>
          相手 {match.opponent_stake ?? match.stake_amount}pt
        </p>

        <div className="battleFighters">
          <div className="battleFighter">
            <strong>{currentUser.name}</strong>
            <Life value={match.my_life} />
            <div className="battleCharacterVisual">
              <span className={`battleRoleMark playerRoleMark ${match.my_role === "attack" ? "isAttack" : "isDefense"}`}>
                {match.my_role === "attack" ? "攻" : "守"}
              </span>
              <img alt={currentUser.name} className="playerCharacterImage" key={`${finished ? "result" : myVisual.action}-${myVisual.key}`} src={finished ? (match.winner_id === currentUser.id ? cpuVictoryImg : cpuDefeatImg) : actionImages[myVisual.action]} />
              {!finished && myVisual.action === "critical_guard" && <img alt="クリティカル防御" className="playerGuardImage" src={criticalGuardImg} />}
            </div>
            <span>ゲージ {match.my_gauge}/{MAX_GAUGE}</span>
            <p className="fighterLog">{match.my_submitted ? "選択済み・相手を待っています" : actionLabel(match.last_my_action)}</p>
          </div>

          <div className="battleVersus">VS</div>

          <div className="battleFighter">
            <strong>{match.opponent.name}</strong>
            <Life value={match.opponent.life} />
            <div className="cpuFighterVisual">
              <span className={`battleRoleMark cpuRoleMark ${match.my_role === "attack" ? "isDefense" : "isAttack"}`}>
                {match.my_role === "attack" ? "守" : "攻"}
              </span>
              <img alt={match.opponent.name} className="cpuCharacterImage" key={`${finished ? "result" : opponentVisual.action}-${opponentVisual.key}`} src={finished ? (match.winner_id === currentUser.id ? cpuDefeatImg : cpuVictoryImg) : actionImages[opponentVisual.action]} />
              {!finished && opponentVisual.action === "critical_guard" && <img alt="クリティカル防御" className="cpuGuardImage" src={criticalGuardImg} />}
            </div>
            <span>ゲージ {match.opponent.gauge}/{MAX_GAUGE}</span>
            <p className="fighterLog">{match.opponent_submitted ? "選択済み" : actionLabel(match.last_opponent_action)}</p>
          </div>
        </div>

        <p className="onlineBattleResult">
          {finished
            ? `${match.winner_id === currentUser.id ? "YOU WIN!" : "YOU LOSE..."}${match.pot_amount ? `　${match.winner_id === currentUser.id ? `+${match.opponent_stake}` : `-${match.my_stake}`}pt` : ""}`
            : match.result_text}
        </p>
        {error && <p className="onlineBattleError">{error}</p>}

        {finished ? (
          <div className="battleResultActions">
            <button onClick={() => setPage("gameSelect")} type="button">ゲーム選択へ</button>
          </div>
        ) : (
          <div className="battleCommands">
            {actions.map((action) => {
              const disabled = submitting || match.my_submitted ||
                (action.id === "critical" && match.my_gauge < 3) ||
                (action.id === "critical_guard" && match.my_gauge < 2);
              return (
                <button disabled={disabled} key={action.id} onClick={() => handleAction(action.id)} type="button">
                  <strong>{action.label}</strong><span>{action.detail}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default OnlineBattlePage;
