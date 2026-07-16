import { useEffect, useRef, useState } from "react";
import { requestJson } from "../api";
import machineImage from "../assets/gacha/gatya512.png";
import knobAnimation from "../assets/gacha/kaiten.gif";
import jackpotAnimation from "../assets/gacha/gatya_ooatari.gif";
import middleHitAnimation from "../assets/gacha/gatya_tyuuatari.gif";
import secretAnimation from "../assets/gacha/putyun.gif";
import gachaCoinImage from "../assets/gacha/coin128.png";
import { getAvatarImage } from "./avatarAssets";
import { getIconImage } from "./iconAssets";

const KNOB_ANIMATION_MS = 4700;
const PRIZE_HOLD_MS = 2000;
const HIT_EFFECTS = {
  jackpot: { animation: jackpotAnimation, duration: 5580, prizeAt: 5580 },
  middle: { animation: middleHitAnimation, duration: 5010, prizeAt: 5010 },
  secret: { animation: secretAnimation, duration: 2170, prizeAt: 2170 },
};

const text = {
  home: "\u2190 \u30db\u30fc\u30e0",
  title: "\u30ac\u30c1\u30e3",
  coins: "\u6240\u6301\u30b3\u30a4\u30f3",
  buy: "\u30b3\u30a4\u30f3\u8cfc\u5165",
  machine: "\u30ac\u30c1\u30e3\u30de\u30b7\u30f3",
  spinning: "\u56de\u8ee2\u4e2d\u2026",
  pull: "1\u30b3\u30a4\u30f3\u3067\u56de\u3059",
  collection: "\u30a2\u30d0\u30bf\u30fc\u30b3\u30ec\u30af\u30b7\u30e7\u30f3",
  owned: "\u7372\u5f97\u6e08\u307f",
  locked: "\u672a\u7372\u5f97",
  skip: "\u30af\u30ea\u30c3\u30af\u3067\u30b9\u30ad\u30c3\u30d7",
};

function GachaPage({ currentUser, setCurrentUser, setPage }) {
  const [status, setStatus] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showingJackpot, setShowingJackpot] = useState(false);
  const [showingPrize, setShowingPrize] = useState(false);
  const [prizeAvatar, setPrizeAvatar] = useState(null);
  const [hitType, setHitType] = useState("jackpot");
  const [spinKey, setSpinKey] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const timersRef = useRef([]);
  const pendingResultRef = useRef(null);
  const skipRequestedRef = useRef(false);

  const clearAnimationTimers = () => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  };

  const schedule = (callback, delay) => {
    const timerId = window.setTimeout(callback, delay);
    timersRef.current.push(timerId);
  };

  const finishPull = (data) => {
    clearAnimationTimers();
    setStatus(data.status);
    setCurrentUser((current) => ({ ...current, ...data.user }));
    setResult(data.duplicate
      ? `${data.avatar.name}\u306f\u7372\u5f97\u6e08\u307f\uff01 5pt\u306b\u5909\u63db\u3057\u307e\u3057\u305f`
      : `${data.avatar.rarity}\u300c${data.avatar.name}\u300d\u3092\u7372\u5f97\uff01`);
    setShowingJackpot(false);
    setShowingPrize(false);
    setSpinning(false);
    pendingResultRef.current = null;
    skipRequestedRef.current = false;
  };

  const getHitType = (data) => data.avatar.id === "daiki"
    ? "secret"
    : data.avatar.kind === "icon" || data.duplicate ? "middle" : "jackpot";

  const getPrizeImage = (prize) => prize.kind === "icon"
    ? getIconImage(prize.id)
    : getAvatarImage(prize.id);

  const revealPrize = (data) => {
    setShowingJackpot(false);
    setPrizeAvatar(data.avatar);
    setShowingPrize(true);
  };

  const startHitEffect = (data) => {
    clearAnimationTimers();
    skipRequestedRef.current = false;
    const nextHitType = getHitType(data);
    const hitEffect = HIT_EFFECTS[nextHitType];
    setHitType(nextHitType);
    setPrizeAvatar(data.avatar);
    setShowingJackpot(true);
    setShowingPrize(false);
    schedule(() => revealPrize(data), hitEffect.prizeAt);
    schedule(() => finishPull(data), hitEffect.duration + PRIZE_HOLD_MS);
  };

  const skipHitEffect = (data) => {
    clearAnimationTimers();
    revealPrize(data);
    schedule(() => finishPull(data), PRIZE_HOLD_MS);
  };

  useEffect(() => {
    requestJson(`/gacha/status/${currentUser.id}`)
      .then(setStatus)
      .catch((err) => setError(err.message));
  }, [currentUser.id]);

  useEffect(() => () => clearAnimationTimers(), []);

  const skipAnimation = () => {
    if (!spinning) return;
    if (showingPrize) {
      if (pendingResultRef.current) finishPull(pendingResultRef.current);
      return;
    }
    if (showingJackpot) {
      if (pendingResultRef.current) skipHitEffect(pendingResultRef.current);
      return;
    }
    skipRequestedRef.current = true;
    if (pendingResultRef.current) startHitEffect(pendingResultRef.current);
  };

  const pull = () => {
    if (spinning || (status?.coins ?? 0) < 1) return;
    const animationStartedAt = performance.now();
    clearAnimationTimers();
    pendingResultRef.current = null;
    skipRequestedRef.current = false;
    setSpinning(true);
    setShowingJackpot(false);
    setShowingPrize(false);
    setPrizeAvatar(null);
    // GIFを毎回別URLとして読み込み、前回の途中フレームから再開されるのを防ぐ。
    setSpinKey(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
    setResult("");
    setError("");

    requestJson("/gacha/pull", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id }),
    })
      .then((data) => {
        pendingResultRef.current = data;
        if (skipRequestedRef.current) {
          startHitEffect(data);
          return;
        }

        const spinDelay = Math.max(0, KNOB_ANIMATION_MS - (performance.now() - animationStartedAt));
        schedule(() => startHitEffect(data), spinDelay);
      })
      .catch((err) => {
        clearAnimationTimers();
        pendingResultRef.current = null;
        skipRequestedRef.current = false;
        setError(err.message);
        setShowingJackpot(false);
        setShowingPrize(false);
        setSpinning(false);
      });
  };

  const buttonLabel = showingPrize
    ? "GET!"
    : showingJackpot
      ? hitType === "secret" ? "SECRET!" : hitType === "middle" ? "\u4e2d\u5f53\u305f\u308a\uff01" : "\u5927\u5f53\u305f\u308a\uff01"
      : spinning ? text.spinning : text.pull;

  return (
    <section className="gachaPage">
      {spinning && (
        <button className="gachaSkipOverlay" onClick={skipAnimation} type="button">
          {showingPrize
            ? "\u30af\u30ea\u30c3\u30af\u3067\u7d50\u679c\u3078"
            : showingJackpot
              ? "\u30af\u30ea\u30c3\u30af\u3067\u5f53\u305f\u308a\u6f14\u51fa\u3092\u30b9\u30ad\u30c3\u30d7"
              : "\u30af\u30ea\u30c3\u30af\u3067\u56de\u8ee2\u3092\u30b9\u30ad\u30c3\u30d7"}
        </button>
      )}
      <header className="gachaHeader">
        <button className="secondaryButton" onClick={() => setPage("home")} type="button">{text.home}</button>
        <div><h2>{text.title}</h2><p className="gachaCoinBalance"><img alt="" src={gachaCoinImage} />{text.coins}: {status?.coins ?? currentUser.gacha_coins ?? 0}</p></div>
        <button className="secondaryButton" onClick={() => setPage("shop")} type="button">{text.buy}</button>
      </header>
      <div className="gachaMachine">
        <img alt={text.machine} className="gachaMachineBase" src={machineImage} />
        {spinning && !showingJackpot && !showingPrize && <img alt="" className="gachaKnobAnimation" key={`spin-${spinKey}`} src={`${knobAnimation}?run=${spinKey}`} />}
        {showingJackpot && hitType !== "secret" && <img alt="" className="gachaJackpotAnimation" key={`${hitType}-${spinKey}`} src={`${HIT_EFFECTS[hitType].animation}?run=${spinKey}`} />}
        {showingJackpot && hitType === "secret" && <img alt="" className="gachaSecretAnimation" key={`secret-${spinKey}`} src={`${HIT_EFFECTS.secret.animation}?run=${spinKey}`} />}
        {showingPrize && prizeAvatar && (
          <img alt={prizeAvatar.name} className="gachaPrizeCharacter" key={`prize-${spinKey}`} src={`${getPrizeImage(prizeAvatar)}?run=${spinKey}`} />
        )}
      </div>
      <button className="gachaPullButton" disabled={spinning || (status?.coins ?? 0) < 1} onClick={pull} type="button">
        {buttonLabel}
      </button>
      {result && <p className="gachaResult">{result}</p>}
      {error && <p className="gachaError">{error}</p>}
      <div className="avatarCollection">
        <h3>{text.collection}</h3>
        <div className="avatarCollectionGrid">
          {(status?.avatars ?? []).map((avatar) => (
            <article className={!avatar.owned ? "avatarPrize avatarPrizeLocked" : "avatarPrize"} key={avatar.id}>
              <img alt={avatar.name} src={getAvatarImage(avatar.id)} />
              <strong>{avatar.owned ? avatar.name : "???"}</strong>
              <span>{avatar.rarity}</span>
              <span>{avatar.owned ? text.owned : text.locked}</span>
            </article>
          ))}
        </div>
      </div>
      <div className="avatarCollection">
        <h3>アイコンコレクション</h3>
        <div className="avatarCollectionGrid">
          {(status?.icons ?? []).map((icon) => (
            <article className={!icon.owned ? "avatarPrize avatarPrizeLocked" : "avatarPrize"} key={icon.id}>
              <img alt={icon.name} src={getIconImage(icon.id)} />
              <strong>{icon.owned ? icon.name : "???"}</strong>
              <span>{icon.rarity}</span>
              <span>{icon.owned ? text.owned : text.locked}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GachaPage;
