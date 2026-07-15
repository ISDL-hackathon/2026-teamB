import { useEffect, useState } from "react";
import { requestBulletinJson, requestJson } from "../api";
import "./MahjongSupportPage.css";

const eventLabels = {
  room_created: "部屋を作成",
  player_joined: "プレイヤー参加",
  game_started: "対局開始",
  dice: "サイコロ",
  riichi: "リーチ",
  riichi_cancelled: "リーチ解除",
  hand_result: "局結果を確定",
  game_finished: "ゲーム終了",
  point_distribution: "アプリポイントを分配",
};

const seatPositions = ["east", "north", "west", "south"];
const fuCandidates = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
const hanCandidates = Array.from({ length: 13 }, (_, index) => index + 1);

const ceilHundred = (score) => Math.ceil(score / 100) * 100;

function buildScoreCandidates(honba = 0) {
  const scores = new Set([0, 1000, 1500, 3000]);
  const honbaTsumo = honba * 100;
  const honbaTotal = honba * 300;

  const addPayments = (basePoint) => {
    const childPayment = ceilHundred(basePoint);
    const dealerPayment = ceilHundred(basePoint * 2);
    const childRon = ceilHundred(basePoint * 4);
    const dealerRon = ceilHundred(basePoint * 6);
    const childTsumoTotal = childPayment * 2 + dealerPayment;
    const dealerTsumoTotal = dealerPayment * 3;

    scores.add(childPayment + honbaTsumo);
    scores.add(dealerPayment + honbaTsumo);
    scores.add(childRon + honbaTotal);
    scores.add(dealerRon + honbaTotal);
    scores.add(childTsumoTotal + honbaTotal);
    scores.add(dealerTsumoTotal + honbaTotal);
  };

  for (const fu of [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]) {
    for (let han = fu <= 25 ? 2 : 1; han <= 4; han += 1) {
      addPayments(Math.min(fu * (2 ** (han + 2)), 2000));
    }
  }

  [2000, 3000, 4000, 6000, 8000].forEach(addPayments);
  return [...scores].sort((left, right) => left - right);
}

function calculateMahjongScore(fu, han, honba = 0) {
  let basePoint;
  if (han >= 13) basePoint = 8000;
  else if (han >= 11) basePoint = 6000;
  else if (han >= 8) basePoint = 4000;
  else if (han >= 6) basePoint = 3000;
  else if (han >= 5) basePoint = 2000;
  else basePoint = Math.min(fu * (2 ** (han + 2)), 2000);

  const childPayment = ceilHundred(basePoint) + honba * 100;
  const dealerPayment = ceilHundred(basePoint * 2) + honba * 100;
  return {
    childRon: ceilHundred(basePoint * 4) + honba * 300,
    dealerRon: ceilHundred(basePoint * 6) + honba * 300,
    childTsumoFromChild: childPayment,
    childTsumoFromDealer: dealerPayment,
    dealerTsumoEach: dealerPayment,
  };
}

function MahjongSupportPage({ currentUser, setCurrentUser, setPage }) {
  const [room, setRoom] = useState(null);
  const [openRooms, setOpenRooms] = useState([]);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [startingScore, setStartingScore] = useState(25000);
  const [adjustments, setAdjustments] = useState({});
  const [adjustmentSigns, setAdjustmentSigns] = useState({});
  const [calculatorFu, setCalculatorFu] = useState(30);
  const [calculatorHan, setCalculatorHan] = useState(1);
  const [note, setNote] = useState("");
  const [winnerId, setWinnerId] = useState("");
  const [winType, setWinType] = useState("ron");
  const [discarderId, setDiscarderId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    requestJson(`/mahjong/current?user_id=${currentUser.id}`)
      .then((data) => setRoom(data.room))
      .catch((err) => setError(err.message));
  }, [currentUser.id]);

  useEffect(() => {
    if (room) return undefined;
    let stopped = false;
    const refreshRooms = () => {
      requestJson("/mahjong/rooms")
        .then((data) => {
          if (!stopped) setOpenRooms(data);
        })
        .catch((err) => {
          if (!stopped) setError(err.message);
        });
    };
    refreshRooms();
    const timer = window.setInterval(refreshRooms, 1200);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [room]);

  useEffect(() => {
    if (!room?.id || room.status === "finished") return undefined;
    let stopped = false;
    const refresh = () => {
      requestJson(`/mahjong/rooms/${room.id}?user_id=${currentUser.id}`)
        .then((data) => {
          if (!stopped) setRoom(data.room);
        })
        .catch(() => {
          requestJson(`/mahjong/current?user_id=${currentUser.id}`)
            .then((data) => {
              if (stopped) return;
              if (!data.room && room.status === "waiting") {
                setCurrentUser((user) => user ? {
                  ...user,
                  point: user.point + room.stake_amount,
                  total_point: user.total_point + room.stake_amount,
                } : user);
                setError("部屋主が部屋を解散しました。参加ポイントは返却されました。");
              }
              setRoom(data.room);
            })
            .catch((err) => {
              if (!stopped) setError(err.message);
            });
        });
    };
    const timer = window.setInterval(refresh, 1000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [currentUser.id, room?.id, room?.status]);

  useEffect(() => {
    if (!room?.players) return;
    setAdjustments(Object.fromEntries(room.players.map((player) => [player.user_id, 0])));
    setAdjustmentSigns(Object.fromEntries(room.players.map((player) => [player.user_id, "-"])));
    setNote("");
    setWinnerId("");
    setWinType("ron");
    setDiscarderId("");
  }, [room?.round_wind, room?.round_number, room?.honba, room?.players?.length]);

  useEffect(() => {
    const me = room?.players?.find((player) => player.user_id === currentUser.id);
    if (!me || !Number.isFinite(me.app_point)) return;
    setCurrentUser((user) => user ? {
      ...user,
      point: me.app_point,
      total_point: me.app_total_point,
    } : user);
  }, [currentUser.id, room?.players, setCurrentUser]);

  const post = async (path, body) => {
    if (busy) return null;
    setBusy(true);
    setError("");
    try {
      const data = await requestJson(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (data.room) setRoom(data.room);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy(false);
    }
  };

  const createRoom = async (gameType) => {
    const data = await post("/mahjong/rooms", {
      user_id: currentUser.id,
      game_type: gameType,
      stake_amount: stakeAmount,
      starting_score: startingScore,
    });
    if (!data?.room) return;
    const gameLabel = gameType === "tonpu" ? "東風戦" : "半荘戦";
    void requestBulletinJson("/bulletin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        content: `🀄 麻雀サポートの部屋を作りました！\n${gameLabel}・${startingScore.toLocaleString()}点開始・参加料${stakeAmount}pt\nゲームセレクトから参加できます。`,
        image_data: null,
      }),
    }).catch(() => {});
  };

  const joinRoom = (roomId) => post(`/mahjong/rooms/${roomId}/join`, {
    user_id: currentUser.id,
  });

  const leaveWaitingRoom = async () => {
    const isHost = room.is_host;
    const message = isHost
      ? "この部屋を解散しますか？参加者のポイントは返却されます。"
      : "この部屋から退出しますか？参加ポイントは返却されます。";
    if (!window.confirm(message)) return;
    const leftRoom = room;
    const data = await post(`/mahjong/rooms/${room.id}/leave`, { user_id: currentUser.id });
    if (!data) return;
    setRoom(null);
    setCurrentUser((user) => user ? {
      ...user,
      point: user.point + leftRoom.stake_amount,
      total_point: user.total_point + leftRoom.stake_amount,
    } : user);
  };

  const startGame = () => post(`/mahjong/rooms/${room.id}/start`, { user_id: currentUser.id });
  const rollDice = () => post(`/mahjong/rooms/${room.id}/dice`, { user_id: currentUser.id });
  const declareRiichi = (targetUserId) => post(`/mahjong/rooms/${room.id}/riichi`, {
    user_id: currentUser.id,
    target_user_id: targetUserId,
  });
  const cancelRiichi = (targetUserId) => post(`/mahjong/rooms/${room.id}/riichi/cancel`, {
    user_id: currentUser.id,
    target_user_id: targetUserId,
  });
  const finishGame = () => {
    if (!window.confirm("現在の点数でゲームを終了しますか？")) return;
    post(`/mahjong/rooms/${room.id}/finish`, { user_id: currentUser.id });
  };

  const submitHand = (dealerContinues) => {
    const finalAdjustments = winnerId ? buildAutomaticAdjustments() : adjustments;
    if (!finalAdjustments) {
      setError("和了者と放銃者を確認してください");
      return null;
    }
    return post(`/mahjong/rooms/${room.id}/hand`, {
      user_id: currentUser.id,
      adjustments: finalAdjustments,
      dealer_continues: dealerContinues,
      riichi_winner_id: winnerId ? Number(winnerId) : null,
      note: note || (winnerId ? `${winType === "ron" ? "ロン" : "ツモ"} ${calculatorFu}符${calculatorHan}翻` : ""),
    });
  };

  if (!room) {
    return (
      <main className="mahjongPage">
        <section className="mahjongPanel mahjongEntrance">
          <header><button onClick={() => setPage("gameSelect")} type="button">← 戻る</button><h2>麻雀サポート</h2></header>
          <p>現実の牌で遊びながら、席・サイコロ・点数・局進行を管理します。</p>
          <div className="mahjongStakeSelect">
            <strong>参加ポイント</strong>
            {[0, 10, 50].map((amount) => (
              <button className={stakeAmount === amount ? "isSelected" : ""} disabled={busy || currentUser.point < amount} key={amount} onClick={() => setStakeAmount(amount)} type="button">{amount}pt</button>
            ))}
          </div>
          <div className="mahjongStartingScoreSelect">
            <strong>開始点数</strong>
            {[25000, 35000].map((score) => (
              <button className={startingScore === score ? "isSelected" : ""} disabled={busy} key={score} onClick={() => setStartingScore(score)} type="button">{score.toLocaleString()}点</button>
            ))}
          </div>
          <div className="mahjongCreateButtons">
            <button disabled={busy} onClick={() => createRoom("tonpu")} type="button">東風戦の部屋を作る</button>
            <button disabled={busy} onClick={() => createRoom("hanchan")} type="button">半荘戦の部屋を作る</button>
          </div>
          <div className="mahjongOpenRooms">
            <h3>募集中の部屋</h3>
            {openRooms.length ? openRooms.map((openRoom) => (
              <div className="mahjongOpenRoom" key={openRoom.id}>
                <span>{openRoom.host_name}の部屋</span>
                <small>{openRoom.game_type === "tonpu" ? "東風戦" : "半荘戦"}・{openRoom.player_count}/4人・{(openRoom.starting_score ?? 25000).toLocaleString()}点開始・{openRoom.stake_amount}pt</small>
                <button disabled={busy || openRoom.host_id === currentUser.id || currentUser.point < openRoom.stake_amount} onClick={() => joinRoom(openRoom.id)} type="button">参加</button>
              </div>
            )) : <p>現在、募集中の部屋はありません</p>}
          </div>
          {error && <p className="mahjongError">{error}</p>}
        </section>
      </main>
    );
  }

  if (room.status === "waiting") {
    return (
      <main className="mahjongPage">
        <section className="mahjongPanel mahjongWaiting">
          <header><button onClick={() => setPage("gameSelect")} type="button">← 戻る</button><h2>参加待ち</h2></header>
          <p>{room.game_type === "tonpu" ? "東風戦" : "半荘戦"}・{(room.starting_score ?? 25000).toLocaleString()}点開始・参加料{room.stake_amount}pt・4人揃ったら席順を抽選します</p>
          <div className="mahjongWaitingPlayers">
            {[0, 1, 2, 3].map((index) => <div key={index}>{room.players[index]?.name ?? "参加待ち..."}</div>)}
          </div>
          {room.is_host && <button disabled={busy || room.players.length !== 4} onClick={startGame} type="button">席順を決めて開始</button>}
          {!room.is_host && <p>部屋主が開始するまで待ってください</p>}
          <button className="mahjongLeaveWaiting" disabled={busy} onClick={leaveWaitingRoom} type="button">{room.is_host ? "部屋を解散して作り直す" : "部屋から退出"}</button>
          {error && <p className="mahjongError">{error}</p>}
        </section>
      </main>
    );
  }

  const scoreCandidates = buildScoreCandidates(room.honba);
  const calculatedScore = calculateMahjongScore(calculatorFu, calculatorHan, room.honba);

  const changeAdjustmentSign = (userId, sign) => {
    setAdjustmentSigns((signs) => ({ ...signs, [userId]: sign }));
    setAdjustments((values) => ({
      ...values,
      [userId]: Math.abs(values[userId] ?? 0) * (sign === "-" ? -1 : 1),
    }));
  };

  const changeAdjustmentAmount = (userId, amount) => {
    const sign = adjustmentSigns[userId] ?? "-";
    setAdjustments((values) => ({
      ...values,
      [userId]: amount * (sign === "-" ? -1 : 1),
    }));
  };

  const buildAutomaticAdjustments = () => {
    const winner = room.players.find((player) => player.user_id === Number(winnerId));
    if (!winner) return null;

    const nextAdjustments = Object.fromEntries(room.players.map((player) => [player.user_id, 0]));
    if (winType === "ron") {
      const discarder = room.players.find((player) => player.user_id === Number(discarderId));
      if (!discarder || discarder.user_id === winner.user_id) return null;
      const score = winner.is_dealer ? calculatedScore.dealerRon : calculatedScore.childRon;
      nextAdjustments[winner.user_id] = score;
      nextAdjustments[discarder.user_id] = -score;
    } else if (winner.is_dealer) {
      room.players.forEach((player) => {
        if (player.user_id !== winner.user_id) nextAdjustments[player.user_id] = -calculatedScore.dealerTsumoEach;
      });
      nextAdjustments[winner.user_id] = calculatedScore.dealerTsumoEach * 3;
    } else {
      room.players.forEach((player) => {
        if (player.user_id === winner.user_id) return;
        nextAdjustments[player.user_id] = -(player.is_dealer
          ? calculatedScore.childTsumoFromDealer
          : calculatedScore.childTsumoFromChild);
      });
      nextAdjustments[winner.user_id] = -Object.values(nextAdjustments).reduce((sum, score) => sum + score, 0);
    }
    return nextAdjustments;
  };

  const automaticAdjustments = winnerId ? buildAutomaticAdjustments() : null;
  const selectedWinner = room.players.find((player) => player.user_id === Number(winnerId));
  const effectiveAdjustments = automaticAdjustments ?? adjustments;
  const adjustmentTotal = Object.values(effectiveAdjustments).reduce((sum, value) => sum + Number(value || 0), 0);

  return (
    <main className="mahjongPage">
      <section className="mahjongPanel">
        <header className="mahjongHeader">
          <button onClick={() => setPage("gameSelect")} type="button">← 戻る</button>
          <div><h2>{room.status === "finished" ? "対局終了" : room.round_label}</h2><span>{room.honba}本場・供託{room.riichi_sticks}本</span></div>
          <div className="mahjongHeaderActions">
            <strong>{room.game_type === "tonpu" ? "東風戦" : "半荘戦"}</strong>
            {room.is_host && room.status === "playing" && <button disabled={busy} onClick={finishGame} type="button">ゲーム終了</button>}
          </div>
        </header>

        <div className="mahjongPlayers">
          <div className="mahjongTableCenter">
            {room.status !== "finished" ? (
              <div className="mahjongDice">
                <div className="mahjongDiceFaces">
                  <span className="die">{room.dice1}</span>
                  <span className="die">{room.dice2}</span>
                </div>
                <strong>合計 {room.dice1 + room.dice2}</strong>
                {room.is_host && <button disabled={busy} onClick={rollDice} type="button">振り直す</button>}
              </div>
            ) : <strong>対局終了</strong>}
          </div>
          {room.players.map((player) => (
            <article className={`mahjongSeat mahjongSeat-${seatPositions[player.seat_index] ?? "unknown"} ${player.is_dealer ? "isDealer" : ""} ${player.user_id === currentUser.id ? "isMe" : ""}`} key={player.user_id}>
              <span className="mahjongWind">{player.wind}</span>
              <div><strong>{player.name}</strong><b>{player.score.toLocaleString()}点</b></div>
              {player.riichi_declared ? <span className="mahjongRiichiState"><em className="mahjongRiichiBadge">リーチ中</em>{room.is_host && <button disabled={busy} onClick={() => cancelRiichi(player.user_id)} type="button">解除</button>}</span> : (
                room.status === "playing" && room.is_host && (
                  <button disabled={busy || player.score < 1000} onClick={() => declareRiichi(player.user_id)} type="button">リーチ</button>
                )
              )}
            </article>
          ))}
        </div>

        {room.status === "finished" ? (
          <div className="mahjongRanking">
            <h3>最終順位</h3>
            <small>POT {room.stake_amount * room.players.length}ptを麻雀点の割合で分配</small>
            {room.ranking.map((player, index) => <p key={player.user_id}><strong>{index + 1}位</strong><span>{player.name}<small>配分 {player.app_point_reward}pt（収支 {player.app_point_reward - room.stake_amount >= 0 ? "+" : ""}{player.app_point_reward - room.stake_amount}pt）</small></span><b>{player.score.toLocaleString()}点</b></p>)}
          </div>
        ) : room.is_host ? (
          <div className="mahjongHandInput">
            <h3>局結果を入力</h3>
            <p>左で＋／－、右で点数を選択（合計0）</p>
            <div className="mahjongScoreCalculator">
              <strong>符・翻 点数早見</strong>
              <div className="mahjongScoreCalculatorSelects">
                <label>
                  <span>符</span>
                  <select onChange={(event) => {
                    const nextFu = Number(event.target.value);
                    setCalculatorFu(nextFu);
                    if (nextFu <= 25 && calculatorHan === 1) setCalculatorHan(2);
                  }} value={calculatorFu}>
                    {fuCandidates.map((fu) => <option key={fu} value={fu}>{fu}符</option>)}
                  </select>
                </label>
                <label>
                  <span>翻</span>
                  <select onChange={(event) => setCalculatorHan(Number(event.target.value))} value={calculatorHan}>
                    {hanCandidates.filter((han) => calculatorFu > 25 || han >= 2).map((han) => <option key={han} value={han}>{han}翻</option>)}
                  </select>
                </label>
              </div>
              <div className="mahjongWinSelectors">
                <label>
                  <span>和了者</span>
                  <select onChange={(event) => {
                    setWinnerId(event.target.value);
                    if (event.target.value === discarderId) setDiscarderId("");
                  }} value={winnerId}>
                    <option value="">和了なし（手動入力）</option>
                    {room.players.map((player) => <option key={player.user_id} value={player.user_id}>{player.wind}・{player.name}</option>)}
                  </select>
                </label>
                <label>
                  <span>和了方法</span>
                  <select disabled={!winnerId} onChange={(event) => {
                    setWinType(event.target.value);
                    if (event.target.value === "tsumo") setDiscarderId("");
                  }} value={winType}>
                    <option value="ron">ロン</option>
                    <option value="tsumo">ツモ</option>
                  </select>
                </label>
                {winType === "ron" && winnerId && (
                  <label>
                    <span>放銃者</span>
                    <select onChange={(event) => setDiscarderId(event.target.value)} value={discarderId}>
                      <option value="">選択してください</option>
                      {room.players.filter((player) => player.user_id !== Number(winnerId)).map((player) => <option key={player.user_id} value={player.user_id}>{player.wind}・{player.name}</option>)}
                    </select>
                  </label>
                )}
              </div>
              <div className="mahjongCalculatedScores">
                <p><b>親</b><span>ロン {calculatedScore.dealerRon.toLocaleString()}点</span><span>ツモ 各{calculatedScore.dealerTsumoEach.toLocaleString()}点</span></p>
                <p><b>子</b><span>ロン {calculatedScore.childRon.toLocaleString()}点</span><span>ツモ 子各{calculatedScore.childTsumoFromChild.toLocaleString()}／親{calculatedScore.childTsumoFromDealer.toLocaleString()}点</span></p>
              </div>
              <small className="mahjongHonbaBonus">
                {room.honba > 0
                  ? `${room.honba}本場：ロン＋${(room.honba * 300).toLocaleString()}点／ツモ各＋${(room.honba * 100).toLocaleString()}点（上の点数に加算済み）`
                  : "0本場：上乗せなし"}
              </small>
            </div>
            {winnerId && automaticAdjustments && (
              <div className="mahjongAutomaticPreview">
                <strong>自動計算結果</strong>
                {room.players.map((player) => (
                  <span className={automaticAdjustments[player.user_id] >= 0 ? "isPlus" : "isMinus"} key={player.user_id}>
                    {player.wind}・{player.name}<b>{automaticAdjustments[player.user_id] >= 0 ? "+" : ""}{automaticAdjustments[player.user_id].toLocaleString()}点</b>
                  </span>
                ))}
              </div>
            )}
            {!winnerId && room.players.map((player) => (
              <label key={player.user_id}>
                <span>{player.wind}・{player.name}</span>
                <span className="mahjongAdjustmentControl">
                  <select
                    aria-label={`${player.name}の増減`}
                    className={adjustmentSigns[player.user_id] !== "+" ? "isNegative" : "isPositive"}
                    onChange={(event) => changeAdjustmentSign(player.user_id, event.target.value)}
                    value={adjustmentSigns[player.user_id] ?? "-"}
                  >
                    <option value="+">＋</option>
                    <option value="-">－</option>
                  </select>
                  <select
                    aria-label={`${player.name}の点数変化`}
                    onChange={(event) => changeAdjustmentAmount(player.user_id, Number(event.target.value))}
                    value={Math.abs(adjustments[player.user_id] ?? 0)}
                  >
                    {scoreCandidates.map((score) => <option key={score} value={score}>{score.toLocaleString()}点</option>)}
                  </select>
                </span>
              </label>
            ))}
            <p className={adjustmentTotal === 0 ? "mahjongTotalOk" : "mahjongTotalError"}>入力合計：{adjustmentTotal.toLocaleString()}点</p>
            <p className="mahjongRiichiRecipient">供託：{winnerId ? `${room.players.find((player) => player.user_id === Number(winnerId))?.name ?? "和了者"}が受け取り` : "和了なしのため持ち越し"}</p>
            <label><span>メモ</span><input maxLength={100} onChange={(event) => setNote(event.target.value)} placeholder="例：ロン 7700" value={note} /></label>
            {selectedWinner ? (
              <button
                className="mahjongSingleConfirm"
                disabled={busy || adjustmentTotal !== 0 || !automaticAdjustments}
                onClick={() => submitHand(selectedWinner.is_dealer)}
                type="button"
              >
                確定（{selectedWinner.is_dealer ? "親の和了・連荘" : "子の和了・親流れ"}）
              </button>
            ) : (
              <div className="mahjongHandButtons">
                <button disabled={busy || adjustmentTotal !== 0} onClick={() => submitHand(true)} type="button">流局：親テンパイ（連荘）</button>
                <button disabled={busy || adjustmentTotal !== 0} onClick={() => submitHand(false)} type="button">流局：親ノーテン（親流れ）</button>
              </div>
            )}
          </div>
        ) : <p className="mahjongObserver">部屋主が局結果を入力しています</p>}

        <details className="mahjongHistory"><summary>進行履歴</summary>{room.history.map((event, index) => <p key={`${event.created_at}-${index}`}>{eventLabels[event.event_type] ?? event.event_type}{event.payload.note ? `：${event.payload.note}` : ""}</p>)}</details>
        {error && <p className="mahjongError">{error}</p>}
      </section>
    </main>
  );
}

export default MahjongSupportPage;
