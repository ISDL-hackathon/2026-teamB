import { useEffect } from "react";
import loadBase from "../assets/bulletin-load-base.gif";
import loadProgress from "../assets/bulletin-load-progress.gif";
import { getAvatarImage } from "./avatarAssets";
import "./BulletinLoadingPage.css";

const LOADING_DURATION_MS = 5000;

function BulletinLoadingPage({ currentUser, onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, LOADING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") onComplete();
  };

  return (
    <main
      className="bulletinLoadingPage"
      aria-label="掲示板を読み込み中。クリックでスキップ"
      onClick={onComplete}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="bulletinLoadingCanvas">
        <img alt="" className="bulletinLoadingBase" src={loadBase} />
        <img alt="読み込み中" className="bulletinLoadingProgress" src={loadProgress} />
        <div className="bulletinLoadingGuide">
          <img alt="" className="bulletinLoadingGuideCharacter" src={getAvatarImage(currentUser.selected_avatar)} />
          <p>掲示板では、お知らせやイベント情報をみんなと共有できるよ！</p>
          <span aria-hidden="true">♥</span>
        </div>
      </div>
    </main>
  );
}

export default BulletinLoadingPage;
