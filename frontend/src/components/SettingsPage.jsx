import { useEffect, useState } from "react";
import { requestJson } from "../api";
import { getAvatarImage } from "./avatarAssets";

const text = {
  back: "\u2190 \u500b\u4eba\u30eb\u30fc\u30e0",
  title: "\u8a2d\u5b9a",
  character: "\u30ad\u30e3\u30e9\u30af\u30bf\u30fc",
  help: "\u500b\u4eba\u30eb\u30fc\u30e0\u306a\u3069\u3067\u4f7f\u7528\u3059\u308b\u30ad\u30e3\u30e9\u30af\u30bf\u30fc\u3092\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002",
  active: "\u4f7f\u7528\u4e2d",
  select: "\u3053\u306e\u30ad\u30e3\u30e9\u30af\u30bf\u30fc\u306b\u3059\u308b",
  changed: "\u30a2\u30d0\u30bf\u30fc\u3092\u5909\u66f4\u3057\u307e\u3057\u305f",
};

function SettingsPage({ currentUser, onAvatarChanged, setPage }) {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    requestJson(`/gacha/status/${currentUser.id}`)
      .then(setStatus)
      .catch((err) => setMessage(err.message));
  }, [currentUser.id]);

  const selectAvatar = (avatarId) => {
    requestJson("/gacha/avatar/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id, avatar_id: avatarId }),
    })
      .then((data) => {
        setStatus((current) => ({ ...current, selected_avatar: avatarId }));
        onAvatarChanged(data.user);
        setMessage(text.changed);
      })
      .catch((err) => setMessage(err.message));
  };

  return (
    <section className="card settingsPage">
      <div className="pageHeader">
        <button className="secondaryButton" onClick={() => setPage("room")} type="button">{text.back}</button>
      </div>
      <h2>{text.title}</h2>
      <h3>{text.character}</h3>
      <p>{text.help}</p>
      <div className="avatarCollectionGrid">
        {(status?.avatars ?? []).filter((avatar) => avatar.owned).map((avatar) => (
          <article className="avatarPrize" key={avatar.id}>
            <img alt={avatar.name} src={getAvatarImage(avatar.id)} />
            <strong>{avatar.name}</strong>
            <button disabled={status.selected_avatar === avatar.id} onClick={() => selectAvatar(avatar.id)} type="button">
              {status.selected_avatar === avatar.id ? text.active : text.select}
            </button>
          </article>
        ))}
      </div>
      {message && <p className="gachaResult">{message}</p>}
    </section>
  );
}

export default SettingsPage;
