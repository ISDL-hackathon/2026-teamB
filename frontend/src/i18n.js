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
        firstLogin: "{{name}} logged in. First login today: +{{points}} pt",
        alreadyLoggedIn: "{{name}} logged in. Already logged in today.",
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
        categories: { lab: "Laboratory Furniture", western: "Western Furniture", japanese: "Japanese Furniture", palace: "Palace Furniture" },
        surfaces: { floor: "Floor", wall: "Wall" },
        items: {
          japanese_futon: "Japanese Futon", japanese_chair: "Zaisu Chair",
          japanese_cabinet: "Japanese Tea Cabinet", japanese_table: "Japanese Low Table",
          palace_bookshelf: "Palace Bookshelf", palace_lamp: "Palace Lamp",
          palace_sofa: "Palace Sofa", palace_cabinet: "Palace Cabinet", palace_table: "Palace Table",
          theme_japanese: "Japanese Set", theme_palace: "Palace Set",
        },
      },
      gacha: {
        home: "← Home", title: "Gacha", coins: "Coins", buyCoins: "Buy Coins",
        machine: "Gacha Machine", spinning: "Spinning...", pull: "Pull for 1 Coin",
        avatarCollection: "Avatar Collection", iconCollection: "Icon Collection",
        owned: "Owned", locked: "Not acquired", get: "GET!", middleHit: "Winner!", jackpot: "Jackpot!",
        result: "Click to see the result", skipEffect: "Click to skip the prize animation",
        skipSpin: "Click to skip spinning", duplicate: "{{name}} was already owned and was converted into 5 pt!",
        acquired: "Acquired {{rarity}} “{{name}}”!",
        rarity: { normal: "Normal", middle: "Rare", jackpot: "Super Rare", secret: "Secret" },
        prizes: {
          izumi: "Izumi", nagano: "Nagano", abe: "Abe", daiki: "Daiki", maie: "Maie",
          giant_robot: "White Machine", hero: "Hero", icon1: "Rooftop Mouse",
          icon2: "White Cat", icon3: "Eevee", icon4: "Fluffy", icon5: "Kappa",
        },
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
        firstLogin: "{{name}}でログインしました。本日初ログイン +{{points}}pt",
        alreadyLoggedIn: "{{name}}でログインしました。本日はログイン済みです。",
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
        categories: { lab: "研究室家具", western: "洋風家具", japanese: "和風家具", palace: "宮殿風家具" },
        surfaces: { floor: "床置き", wall: "壁掛け" },
        items: {
          japanese_futon: "和風の布団", japanese_chair: "和風の座椅子",
          japanese_cabinet: "和風の茶箪笥", japanese_table: "和風の座卓",
          palace_bookshelf: "宮殿風の本棚", palace_lamp: "宮殿風のランプ",
          palace_sofa: "宮殿風のソファ", palace_cabinet: "宮殿風の箪笥", palace_table: "宮殿風のテーブル",
          theme_japanese: "和風セット", theme_palace: "宮殿風セット",
        },
      },
      gacha: {
        home: "← ホーム", title: "ガチャ", coins: "所持コイン", buyCoins: "コイン購入",
        machine: "ガチャマシン", spinning: "回転中…", pull: "1コインで回す",
        avatarCollection: "アバターコレクション", iconCollection: "アイコンコレクション",
        owned: "獲得済み", locked: "未獲得", get: "GET!", middleHit: "中当たり！", jackpot: "大当たり！",
        result: "クリックで結果へ", skipEffect: "クリックで当たり演出をスキップ",
        skipSpin: "クリックで回転をスキップ", duplicate: "{{name}}は獲得済み！ 5ptに変換しました",
        acquired: "{{rarity}}「{{name}}」を獲得！",
        rarity: { normal: "ノーマル", middle: "中当たり", jackpot: "大当たり", secret: "シークレット" },
        prizes: {
          izumi: "いずみ", nagano: "ながの", abe: "あべ", daiki: "だいき", maie: "まいえ",
          giant_robot: "白い機体", hero: "勇者", icon1: "屋根のねずみ",
          icon2: "白猫アイコン", icon3: "イービィ", icon4: "もふもふ", icon5: "かっぱ",
        },
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
