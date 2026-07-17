import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      app: { title: "ISDL Hackathon", subtitle: "Laboratory activity points" },
      language: { label: "Language", ja: "Japanese", en: "English" },
      auth: {
        login: "Log in", register: "Create account", name: "Name", password: "Password",
        grade: "Grade", noAccount: "Don't have an account?", hasAccount: "Already have an account?",
        faculty: "Faculty",
      },
      home: {
        loggedIn: "Logged in", activityPoints: "Your activity points", logout: "Log out",
        addPoints: "Add activity points", changeSeat: "Change seat", selectSeat: "Select a seat",
        today: "ISDL today", activeUsers: "Active users", people: "people", weather: "Weather",
        laboratory: "Laboratory", nextLevel: "Until the next laboratory level", maxLevel: "Maximum level",
        remaining: "{{count}} pt remaining", labMenu: "Go to the laboratory", roomMenu: "Go to My Room",
        shopMenu: "Go to the shop", gachaMenu: "Go to gacha", weeklyActivity: "This week's activity",
        ranking: "Ranking", weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      weather: { "快晴": "Clear", "晴れ": "Sunny", "曇り": "Cloudy", "雨": "Rain", "雷雨": "Thunderstorm" },
      shop: {
        recommended: "Recommended",
        featureUnlocked: "Unlocks a Feature",
        gachaCoin: "Gacha Coin",
        gachaCoinDescription: "A coin for one gacha pull",
      },
      villageTitle: {
        "ISDL研究都市": "ISDL Research City", "にぎやかな研究室": "Lively Laboratory",
        "活動中の研究室": "Active Laboratory", "少し明るい研究室": "Growing Laboratory",
        "静かな研究室": "Quiet Laboratory",
      },
    },
  },
  ja: {
    translation: {
      app: { title: "ISDL ハッカソン", subtitle: "研究室活動ポイント" },
      language: { label: "言語", ja: "日本語", en: "英語" },
      auth: {
        login: "ログイン", register: "ユーザー登録", name: "名前", password: "パスワード",
        grade: "学年", noAccount: "アカウントがない場合", hasAccount: "すでにアカウントがある場合",
        faculty: "教員",
      },
      home: {
        loggedIn: "ログイン中", activityPoints: "あなたの活動ポイント", logout: "ログアウト",
        addPoints: "活動ポイントを追加", changeSeat: "座席を変更する", selectSeat: "座席を選ぶ",
        today: "今日のISDL", activeUsers: "活動人数", people: "人", weather: "天気",
        laboratory: "研究室", nextLevel: "研究室レベルアップまで", maxLevel: "最大レベル",
        remaining: "あと {{count}} pt", labMenu: "研究室へ移動", roomMenu: "マイルームへ移動",
        shopMenu: "ショップへ移動", gachaMenu: "ガチャへ移動", weeklyActivity: "今週の活動量",
        ranking: "ランキング", weekdays: ["月", "火", "水", "木", "金", "土", "日"],
      },
      weather: { "快晴": "快晴", "晴れ": "晴れ", "曇り": "曇り", "雨": "雨", "雷雨": "雷雨" },
      shop: {
        recommended: "推奨",
        featureUnlocked: "機能解禁",
        gachaCoin: "ガチャコイン",
        gachaCoinDescription: "ガチャを1回回せるコイン",
      },
      villageTitle: {
        "ISDL研究都市": "ISDL研究都市", "にぎやかな研究室": "にぎやかな研究室",
        "活動中の研究室": "活動中の研究室", "少し明るい研究室": "少し明るい研究室",
        "静かな研究室": "静かな研究室",
      },
    },
  },
};

const savedLanguage = localStorage.getItem("isdlLanguage");

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage || "ja",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  localStorage.setItem("isdlLanguage", language);
  document.documentElement.lang = language;
});
document.documentElement.lang = i18n.language;

export default i18n;
