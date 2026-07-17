import { useTranslation } from "react-i18next";
import iconBase from "../assets/icons/maru.png";
import crownIconBase from "../assets/icons/maru-crown.png";
import iconBackground from "../assets/icons/icon-background.png";
import gachaButtonImage from "../assets/gacha_btn.png";
import labButtonImage from "../assets/lab_btn.png";
import myRoomButtonImage from "../assets/myroom_btn.png";
import shopButtonImage from "../assets/shop_btn.png";
import englishGachaButtonImage from "../assets/eng_gacha_btn.png";
import englishLabButtonImage from "../assets/eng_lab_btn.png";
import englishMyRoomButtonImage from "../assets/eng_myroom_btn.png";
import englishShopButtonImage from "../assets/eng_shop_btn.png";
import RankingTable from "./RankingTable";
import { getIconImage } from "./iconAssets";
import treeStage1 from "../assets/tree/tree_stage_1.png";
import treeStage2 from "../assets/tree/tree_stage_2.png";
import treeStage3 from "../assets/tree/tree_stage_3.png";
import treeStage4 from "../assets/tree/tree_stage_4.png";
import treeStage5 from "../assets/tree/tree_stage_5.png";
import treeStage6 from "../assets/tree/tree_stage_6.png";

const TREE_STAGES = [treeStage1, treeStage2, treeStage3, treeStage4, treeStage5, treeStage6];
const LEVEL_THRESHOLDS = [0, 100, 500, 1000, 2000];
const WEATHER_IMAGES = {
  "快晴": "clear.gif", "晴れ": "sunny.gif", "曇り": "cloudy.gif",
  "雨": "rainy.gif", "雷雨": "kaminari_2.gif",
};

function getTreeStage(ratio) {
  return TREE_STAGES[Math.min(5, Math.floor((ratio ?? 0) * 6))];
}

function getWeatherBackground(weather) {
  const image = WEATHER_IMAGES[weather] || "kaminari_2.gif";
  const dark = weather === "雨" || weather === "雷雨";
  const overlay = dark ? "linear-gradient(rgba(17,19,26,.5),rgba(17,19,26,.7))" : "linear-gradient(rgba(255,216,119,.08),rgba(38,98,145,.14))";
  return { backgroundImage: `${overlay}, url('/weather/${image}')` };
}

function getLevelProgress(village) {
  if (!village) return null;
  const level = village.level ?? 1;
  const total = village.total_point ?? 0;
  const base = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level];
  if (next == null) return { isMax: true, ratio: 1, remaining: 0 };
  return { isMax: false, ratio: Math.max(0, Math.min(1, (total - base) / Math.max(1, next - base))), remaining: Math.max(0, next - total) };
}

function UserIcon({ icon, isRankOne }) {
  return <div className="userIcon" aria-hidden="true">
    <img alt="" className="userIconBackground" src={iconBackground} />
    <img alt="" className="userIconImage" src={icon} />
    <img alt="" className="userIconBase" src={isRankOne ? crownIconBase : iconBase} />
  </div>;
}

function HomePage({ currentUser, onCheckin, onLogout, onOpenMyRoom, ranking, setPage, village, weeklyActivity }) {
  const { t, i18n } = useTranslation();
  const progress = getLevelProgress(village);
  const todayIndex = (new Date().getDay() + 6) % 7;
  const weekdays = t("home.weekdays", { returnObjects: true });
  const setLanguage = (language) => i18n.changeLanguage(language);
  const isEnglish = i18n.resolvedLanguage === "en";

  return <div className="homeWeather" data-i18n-managed style={getWeatherBackground(village?.weather)}>
    <div className="languageSwitcher" role="group" aria-label={t("language.label")}>
      <span>{t("language.label")}</span>
      <button className={i18n.language === "ja" ? "active" : ""} onClick={() => setLanguage("ja")} type="button">日本語</button>
      <button className={i18n.language === "en" ? "active" : ""} onClick={() => setLanguage("en")} type="button">English</button>
    </div>
    <div className="homeTopGrid">
      <div className="card homeUserCard">
        <div className="homeUserHeader"><div className="homeUserProfile">
          <UserIcon icon={getIconImage(currentUser.selected_icon)} isRankOne={Number(ranking[0]?.id) === Number(currentUser.id)} />
          <div className="homeUserInfo"><span className="eyebrow">{t("home.loggedIn")}</span><p>{currentUser.name} / {currentUser.grade}</p>
            <strong className="pointValue">{currentUser.point} pt</strong><span className="pointCaption">{t("home.activityPoints")}</span></div>
        </div><button className="secondaryButton compactButton" onClick={onLogout}>{t("home.logout")}</button></div>
        <button onClick={onCheckin}>{t("home.addPoints")}</button>
        <button className="secondaryButton" onClick={() => setPage("selectVillageSlot")} type="button">{t(currentUser.village_slot_id ? "home.changeSeat" : "home.selectSeat")}</button>
      </div>
      {village && <div className="card villageSummary"><h2>{t("home.today")}</h2><div className="statGrid">
        <div className="statBlock"><span className="statLabel">{t("home.activeUsers")}</span><span className="statValue">{village.active_users}<small>{t("home.people")}</small></span></div>
        <div className="statBlock"><span className="statLabel">{t("home.weather")}</span><span className="statValue">{t(`weather.${village.weather}`, { defaultValue: village.weather })}</span></div>
        <div className="statBlock"><span className="statLabel">{t("home.laboratory")}</span><span className="statValue">Lv.{village.level}</span><span className="statSub">{t(`villageTitle.${village.title}`, { defaultValue: village.title })}</span></div>
      </div>{progress && <div className="levelProgress"><div className="levelProgressHead"><span className="statLabel">{t("home.nextLevel")}</span>
        <span className="levelRemaining">{progress.isMax ? t("home.maxLevel") : t("home.remaining", { count: progress.remaining })}</span></div>
        <div className="levelBar"><div className="levelBarFill" style={{ width: `${Math.round(progress.ratio * 100)}%` }} /></div></div>}</div>}
    </div>
    <div className="menuGrid">
      <button aria-label={t("home.labMenu")} className="homeMenuButton" onClick={() => setPage("villageLoading")} type="button"><img alt="" src={isEnglish ? englishLabButtonImage : labButtonImage} /></button>
      <button aria-label={t("home.roomMenu")} className="homeMenuButton" onClick={onOpenMyRoom} type="button"><img alt="" src={isEnglish ? englishMyRoomButtonImage : myRoomButtonImage} /></button>
      <button aria-label={t("home.shopMenu")} className="homeMenuButton" onClick={() => setPage("shop")} type="button"><img alt="" src={isEnglish ? englishShopButtonImage : shopButtonImage} /></button>
      <button aria-label={t("home.gachaMenu")} className="homeMenuButton" onClick={() => setPage("gacha")} type="button"><img alt="" src={isEnglish ? englishGachaButtonImage : gachaButtonImage} /></button>
    </div>
    {weeklyActivity && <div className="card weeklyActivityCard"><h2>{t("home.weeklyActivity")}</h2><div className="weeklyTreeRow">
      {weeklyActivity.days.map((day, i) => <div key={day.date} className={`weeklyTreeItem ${i === todayIndex ? "weeklyTreeItemToday" : ""}`}>
        <div className="weeklyTreeImageWrap"><img src={getTreeStage(day.ratio)} alt="" className="weeklyTreeImage" /></div><span className="weeklyTreeLabel">{weekdays[i]}</span></div>)}
    </div></div>}
    <section className="rankingSection"><h2>{t("home.ranking")}</h2><RankingTable ranking={ranking} /></section>
  </div>;
}

export default HomePage;
