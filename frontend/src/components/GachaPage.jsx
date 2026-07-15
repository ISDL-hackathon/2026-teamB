import { useEffect, useState } from "react";
import { requestJson } from "../api";
import machineImage from "../assets/gacha/gatya512.png";
import machineOpenImage from "../assets/gacha/gatya512_aki.png";
import knobAnimation from "../assets/gacha/kaiten.gif";
import gachaCoinImage from "../assets/gacha/coin128.png";
import { getAvatarImage } from "./avatarAssets";

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
};

function GachaPage({ currentUser, setCurrentUser, setPage }) {
  const [status, setStatus] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    requestJson(`/gacha/status/${currentUser.id}`)
      .then(setStatus)
      .catch((err) => setError(err.message));
  }, [currentUser.id]);

  const pull = () => {
    if (spinning || (status?.coins ?? 0) < 1) return;
    setSpinning(true);
    setSpinKey((key) => key + 1);
    setResult("");
    setError("");

    requestJson("/gacha/pull", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id }),
    })
      .then((data) => {
        window.setTimeout(() => {
          setStatus(data.status);
          setCurrentUser((current) => ({ ...current, ...data.user }));
          setResult(data.duplicate
            ? `${data.avatar.name}\u306f\u7372\u5f97\u6e08\u307f\uff01 5pt\u306b\u5909\u63db\u3057\u307e\u3057\u305f`
            : `${data.avatar.rarity}\u300c${data.avatar.name}\u300d\u3092\u7372\u5f97\uff01`);
          setSpinning(false);
        }, 4400);
      })
      .catch((err) => {
        setError(err.message);
        setSpinning(false);
      });
  };

  return (
    <section className="gachaPage">
      <header className="gachaHeader">
        <button className="secondaryButton" onClick={() => setPage("home")} type="button">{text.home}</button>
        <div><h2>{text.title}</h2><p className="gachaCoinBalance"><img alt="" src={gachaCoinImage} />{text.coins}: {status?.coins ?? currentUser.gacha_coins ?? 0}</p></div>
        <button className="secondaryButton" onClick={() => setPage("shop")} type="button">{text.buy}</button>
      </header>
      <div className="gachaMachine">
        <img alt={text.machine} className="gachaMachineBase" src={spinning ? machineOpenImage : machineImage} />
        {spinning && <img alt="" className="gachaKnobAnimation" key={spinKey} src={knobAnimation} />}
      </div>
      <button className="gachaPullButton" disabled={spinning || (status?.coins ?? 0) < 1} onClick={pull} type="button">
        {spinning ? text.spinning : text.pull}
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
    </section>
  );
}

export default GachaPage;
