import { useEffect } from "react";
import loadBase from "../assets/bulletin-load-base.gif";
import loadProgress from "../assets/bulletin-load-progress.gif";
import guideCharacter from "../assets/izumi.gif";
import "./BulletinLoadingPage.css";

const LOADING_DURATION_MS = 3000;

function BulletinLoadingPage({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, LOADING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="bulletinLoadingPage" aria-label="掲示板を読み込み中">
      <div className="bulletinLoadingCanvas">
        <img alt="" className="bulletinLoadingBase" src={loadBase} />
        <img alt="読み込み中" className="bulletinLoadingProgress" src={loadProgress} />
        <div className="bulletinLoadingGuide">
          <img alt="" className="bulletinLoadingGuideCharacter" src={guideCharacter} />
          <p>掲示板では、お知らせやイベント情報をみんなと共有できるよ！</p>
          <span aria-hidden="true">♥</span>
        </div>
      </div>
    </main>
  );
}

export default BulletinLoadingPage;
