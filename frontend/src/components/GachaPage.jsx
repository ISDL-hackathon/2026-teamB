import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { requestJson } from "../api";
import machineImage from "../assets/gacha/gatya512.png";
import knobAnimation from "../assets/gacha/kaiten.gif";
import jackpotAnimation from "../assets/gacha/gatya_ooatari.gif";
import middleHitAnimation from "../assets/gacha/gatya_tyuuatari.gif";
import secretAnimation from "../assets/gacha/putyun.gif";
import gachaCoinImage from "../assets/gacha/coin128.png";
import { getAvatarImage } from "./avatarAssets";
import { getIconImage } from "./iconAssets";
import { translateLegacyText } from "../pageTranslations";

const KNOB_ANIMATION_MS = 4700;
const PRIZE_HOLD_MS = 2000;
const HIT_EFFECTS = {
  jackpot: { animation: jackpotAnimation, duration: 5580, prizeAt: 5580 },
  middle: { animation: middleHitAnimation, duration: 5010, prizeAt: 5010 },
  secret: { animation: secretAnimation, duration: 2170, prizeAt: 2170 },
};

const RARITY_KEYS = { "ノーマル": "normal", "中当たり": "middle", "大当たり": "jackpot", "シークレット": "secret" };

function GachaPage({ currentUser, setCurrentUser, setPage }) {
  const { t, i18n } = useTranslation();
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
  const localizeError = (message) => i18n.resolvedLanguage === "en" ? translateLegacyText(message) : message;

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
    const name = t(`gacha.prizes.${data.avatar.id}`, { defaultValue: data.avatar.name });
    const rarity = t(`gacha.rarity.${RARITY_KEYS[data.avatar.rarity] ?? "normal"}`);
    setResult(data.duplicate ? t("gacha.duplicate", { name }) : t("gacha.acquired", { name, rarity }));
    setShowingJackpot(false);
    setShowingPrize(false);
    setSpinning(false);
    pendingResultRef.current = null;
    skipRequestedRef.current = false;
  };

  const getHitType = (data) => data.avatar.rarity === "シークレット"
    ? "secret"
    : data.avatar.rarity === "大当たり"
      ? "jackpot"
      : "middle";

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
      .catch((err) => setError(localizeError(err.message)));
  }, [currentUser.id]);

  useEffect(() => () => clearAnimationTimers(), []);

  const skipAnimation = () => {
    if (!spinning) return;
    if (showingJackpot && hitType === "secret") return;
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
        setError(localizeError(err.message));
        setShowingJackpot(false);
        setShowingPrize(false);
        setSpinning(false);
      });
  };

  const buttonLabel = showingPrize
    ? t("gacha.get")
    : showingJackpot
      ? hitType === "secret" ? "SECRET!" : hitType === "middle" ? t("gacha.middleHit") : t("gacha.jackpot")
      : spinning ? t("gacha.spinning") : t("gacha.pull");

  return (
    <section className="gachaPage" data-i18n-managed>
      {spinning && !(showingJackpot && hitType === "secret") && (
        <button
          className="gachaSkipOverlay"
          onClick={skipAnimation}
          type="button"
        >
          {showingPrize
            ? t("gacha.result")
            : showingJackpot
              ? t("gacha.skipEffect")
              : t("gacha.skipSpin")}
        </button>
      )}
      <header className="gachaHeader">
        <button className="secondaryButton" onClick={() => setPage("home")} type="button">{t("gacha.home")}</button>
        <div><h2>{t("gacha.title")}</h2><p className="gachaCoinBalance"><img alt="" src={gachaCoinImage} />{t("gacha.coins")}: {status?.coins ?? currentUser.gacha_coins ?? 0}</p></div>
        <button className="secondaryButton" onClick={() => setPage("shop")} type="button">{t("gacha.buyCoins")}</button>
      </header>
      <div className="gachaMachine">
        <img alt={t("gacha.machine")} className="gachaMachineBase" src={machineImage} />
        {spinning && !showingJackpot && !showingPrize && <img alt="" className="gachaKnobAnimation" key={`spin-${spinKey}`} src={`${knobAnimation}?run=${spinKey}`} />}
        {showingJackpot && hitType !== "secret" && <img alt="" className="gachaJackpotAnimation" key={`${hitType}-${spinKey}`} src={`${HIT_EFFECTS[hitType].animation}?run=${spinKey}`} />}
        {showingJackpot && hitType === "secret" && <img alt="" className="gachaSecretAnimation" key={`secret-${spinKey}`} src={`${HIT_EFFECTS.secret.animation}?run=${spinKey}`} />}
        {showingPrize && prizeAvatar && (
          <img alt={t(`gacha.prizes.${prizeAvatar.id}`, { defaultValue: prizeAvatar.name })} className="gachaPrizeCharacter" key={`prize-${spinKey}`} src={`${getPrizeImage(prizeAvatar)}?run=${spinKey}`} />
        )}
      </div>
      <button className="gachaPullButton" disabled={spinning || (status?.coins ?? 0) < 1} onClick={pull} type="button">
        {buttonLabel}
      </button>
      {result && <p className="gachaResult">{result}</p>}
      {error && <p className="gachaError">{error}</p>}
      <div className="avatarCollection">
        <h3>{t("gacha.avatarCollection")}</h3>
        <div className="avatarCollectionGrid">
          {(status?.avatars ?? []).map((avatar) => (
            <article className={!avatar.owned ? "avatarPrize avatarPrizeLocked" : "avatarPrize"} key={avatar.id}>
              <img alt={t(`gacha.prizes.${avatar.id}`, { defaultValue: avatar.name })} src={getAvatarImage(avatar.id)} />
              <strong>{avatar.owned ? t(`gacha.prizes.${avatar.id}`, { defaultValue: avatar.name }) : "???"}</strong>
              <span>{avatar.owned ? t("gacha.owned") : t("gacha.locked")}</span>
            </article>
          ))}
        </div>
      </div>
      <div className="avatarCollection">
        <h3>{t("gacha.iconCollection")}</h3>
        <div className="avatarCollectionGrid">
          {(status?.icons ?? []).map((icon) => (
            <article className={!icon.owned ? "avatarPrize avatarPrizeLocked" : "avatarPrize"} key={icon.id}>
              <img alt={t(`gacha.prizes.${icon.id}`, { defaultValue: icon.name })} src={getIconImage(icon.id)} />
              <strong>{icon.owned ? t(`gacha.prizes.${icon.id}`, { defaultValue: icon.name }) : "???"}</strong>
              <span>{icon.owned ? t("gacha.owned") : t("gacha.locked")}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GachaPage;
