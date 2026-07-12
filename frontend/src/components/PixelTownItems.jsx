import deskTopImg from "../assets/town/desk_top.png";
import deskSideImg from "../assets/town/desk_side.png";
import wallBeigeImg from "../assets/town/wall_beige.png";
import lockerTopImg from "../assets/town/locker_top.png";
import tatamiTopImg from "../assets/town/tatami_top.png";
import tatamiSideImg from "../assets/town/tatami_side.png";
import deskSqTlImg from "../assets/town/desk_sq_tl.png";
import deskSqTmImg from "../assets/town/desk_sq_tm.png";
import deskSqTrImg from "../assets/town/desk_sq_tr.png";
import deskSqBlImg from "../assets/town/desk_sq_bl.png";
import deskSqBmImg from "../assets/town/desk_sq_bm.png";
import deskSqBrImg from "../assets/town/desk_sq_br.png";
import deskSqSideLeftImg from "../assets/town/desk_sq_side_left.png";
import deskSqSideMidImg from "../assets/town/desk_sq_side_mid.png";
import deskSqSideRightImg from "../assets/town/desk_sq_side_right.png";
import glassVframeImg from "../assets/town/glass_vframe.png";
import glassHframeImg from "../assets/town/glass_hframe.png";
import glassPaneImg from "../assets/town/glass_pane.png";
import deskBrownLeftImg from "../assets/town/desk_brown_left.png";
import deskBrownMidImg from "../assets/town/desk_brown_mid.png";
import deskBrownRightImg from "../assets/town/desk_brown_right.png";
import navyTileImg from "../assets/town/navy_tile.png";
import plant_lv1Img from "../assets/town/plant_lv1.png";
import plant_lv2Img from "../assets/town/plant_lv2.png";
import dopaImg from "../assets/town/dopakun.png";
import deskLowWhitebrownImg from "../assets/town/desk_low_whitebrown.png";
import microwaveImg from "../assets/town/microwave.png";
import fridgeImg from "../assets/town/fridge.png";
import fridgeBrownImg from "../assets/town/fridge_brown.png";
import plant_lv3Img from "../assets/town/plant_lv3.png";
import plant_lv4Gif from "../assets/town/plant_lv4.gif";
import plant_lv5Gif from "../assets/town/plant_lv5.gif";
import deskFutureImg from "../assets/town/desk_future.png";
import deskFutureLongImg from "../assets/town/desk_future_long.png";
import deskTopFutureImg from "../assets/town/desk_top_future.png";
import deskSideFutureImg from "../assets/town/desk_side_future.png";
import glassPaneBlueImg from "../assets/town/glass_pane_blue.png";


// 白い縦長机(各机の col と、天面の行リスト・側面の行)
const WHITE_DESKS = [
  { key: "a", col: 1,  top: [2, 3, 4, 5, 6, 7, 8],                 side: 9  },
  { key: "b", col: 1,  top: [12, 13, 14, 15, 16, 17, 18],          side: 19 },
  { key: "c", col: 6,  top: [3, 4, 5, 6, 7],                       side: 8  },
  { key: "d", col: 7,  top: [3, 4, 5, 6, 7],                       side: 8  },
  { key: "e", col: 20, top: [10, 11, 12, 13, 14, 15, 16, 17, 18],  side: 19 },
];

const whiteDeskItems = WHITE_DESKS.flatMap(({ key, col, top, side }) => [
  // Lv1〜4:従来の白机
  ...top.map((row) => ({ id: `wdesk-${key}-top-${row}`, src: deskTopImg, alt: "机", minLevel: 1, maxLevel: 4, col, row, z: 5 })),
  { id: `wdesk-${key}-side-${side}`, src: deskSideImg, alt: "机の脚", minLevel: 1, maxLevel: 4, col, row: side, z: 5 },
  // Lv5:近未来版(タイル差し替え)
  ...top.map((row) => ({ id: `wdesk-${key}-top-${row}-f`, src: deskTopFutureImg, alt: "机", minLevel: 5, col, row, z: 5 })),
  { id: `wdesk-${key}-side-${side}-f`, src: deskSideFutureImg, alt: "机の脚", minLevel: 5, col, row: side, z: 5 },
]);

export const townItems = [
  // === Lv.1(初期段階)===

  // 壁(row=1, col=1〜9)
  { id: "wall-1-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 1, row: 1, z: 1 },
  { id: "wall-2-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 2, row: 1, z: 1 },
  { id: "wall-3-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 3, row: 1, z: 1 },
  { id: "wall-4-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 4, row: 1, z: 1 },
  { id: "wall-5-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 5, row: 1, z: 1 },
  { id: "wall-6-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 6, row: 1, z: 1 },
  { id: "wall-7-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 7, row: 1, z: 1 },
  { id: "wall-8-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 8, row: 1, z: 1 },
  { id: "wall-9-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 9, row: 1, z: 1 },

  // 壁(row=1, col=13〜20)
  { id: "wall-13-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 13, row: 1, z: 1 },
  { id: "wall-14-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 14, row: 1, z: 1 },
  { id: "wall-15-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 15, row: 1, z: 1 },
  { id: "wall-16-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 16, row: 1, z: 1 },
  { id: "wall-17-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 17, row: 1, z: 1 },
  { id: "wall-18-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 18, row: 1, z: 1 },
  { id: "wall-19-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 19, row: 1, z: 1 },
  { id: "wall-20-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 20, row: 1, z: 1 },

  // 畳の天面(col=15〜20, row=2〜4)
  { id: "tatami-15-2", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 15, row: 2, z: 2 },
  { id: "tatami-16-2", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 16, row: 2, z: 2 },
  { id: "tatami-17-2", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 17, row: 2, z: 2 },
  { id: "tatami-18-2", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 18, row: 2, z: 2 },
  { id: "tatami-19-2", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 19, row: 2, z: 2 },
  { id: "tatami-20-2", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 20, row: 2, z: 2 },
  { id: "tatami-15-3", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 15, row: 3, z: 2 },
  { id: "tatami-16-3", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 16, row: 3, z: 2 },
  { id: "tatami-17-3", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 17, row: 3, z: 2 },
  { id: "tatami-18-3", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 18, row: 3, z: 2 },
  { id: "tatami-19-3", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 19, row: 3, z: 2 },
  { id: "tatami-20-3", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 20, row: 3, z: 2 },
  { id: "tatami-15-4", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 15, row: 4, z: 2 },
  { id: "tatami-16-4", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 16, row: 4, z: 2 },
  { id: "tatami-17-4", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 17, row: 4, z: 2 },
  { id: "tatami-18-4", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 18, row: 4, z: 2 },
  { id: "tatami-19-4", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 19, row: 4, z: 2 },
  { id: "tatami-20-4", src: tatamiTopImg, alt: "畳", minLevel: 1, col: 20, row: 4, z: 2 },

// 茶色の横長机(col=16〜19, row=3、畳の上に乗せる)
  { id: "brown-desk-16-3", src: deskBrownLeftImg, alt: "茶机", minLevel: 1, col: 16, row: 3, z: 6 },
  { id: "brown-desk-17-3", src: deskBrownMidImg, alt: "茶机", minLevel: 1, col: 17, row: 3, z: 6 },
  { id: "brown-desk-18-3", src: deskBrownMidImg, alt: "茶机", minLevel: 1, col: 18, row: 3, z: 6 },
  { id: "brown-desk-19-3", src: deskBrownRightImg, alt: "茶机", minLevel: 1, col: 19, row: 3, z: 6 },

  // 畳の側面(col=15〜20, row=5)
  { id: "tatami-side-15-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 15, row: 5, z: 3 },
  { id: "tatami-side-16-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 16, row: 5, z: 3 },
  { id: "tatami-side-17-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 17, row: 5, z: 3 },
  { id: "tatami-side-18-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 18, row: 5, z: 3 },
  { id: "tatami-side-19-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 19, row: 5, z: 3 },
  { id: "tatami-side-20-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 20, row: 5, z: 3 },

  ...whiteDeskItems,

  // 9マス机1(左上 col=5, row=11)
  { id: "sqdesk1-tl", src: deskSqTlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 5, row: 11, z: 6 },
  { id: "sqdesk1-tm", src: deskSqTmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 6, row: 11, z: 6 },
  { id: "sqdesk1-tr", src: deskSqTrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 7, row: 11, z: 6 },
  { id: "sqdesk1-bl", src: deskSqBlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 5, row: 12, z: 6 },
  { id: "sqdesk1-bm", src: deskSqBmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 6, row: 12, z: 6 },
  { id: "sqdesk1-br", src: deskSqBrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 7, row: 12, z: 6 },
  { id: "sqdesk1-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 5, row: 13, z: 6 },
  { id: "sqdesk1-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 6, row: 13, z: 6 },
  { id: "sqdesk1-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 7, row: 13, z: 6 },

  // 9マス机2(左上 col=12, row=10)
  { id: "sqdesk2-tl", src: deskSqTlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 12, row: 10, z: 6 },
  { id: "sqdesk2-tm", src: deskSqTmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 13, row: 10, z: 6 },
  { id: "sqdesk2-tr", src: deskSqTrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 14, row: 10, z: 6 },
  { id: "sqdesk2-bl", src: deskSqBlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 12, row: 11, z: 6 },
  { id: "sqdesk2-bm", src: deskSqBmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 13, row: 11, z: 6 },
  { id: "sqdesk2-br", src: deskSqBrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 14, row: 11, z: 6 },
  { id: "sqdesk2-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 12, row: 12, z: 6 },
  { id: "sqdesk2-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 13, row: 12, z: 6 },
  { id: "sqdesk2-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 14, row: 12, z: 6 },

  // 9マス机3(左上 col=8, row=14)
  { id: "sqdesk3-tl", src: deskSqTlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 8, row: 14, z: 6 },
  { id: "sqdesk3-tm", src: deskSqTmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 9, row: 14, z: 6 },
  { id: "sqdesk3-tr", src: deskSqTrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 10, row: 14, z: 6 },
  { id: "sqdesk3-bl", src: deskSqBlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 8, row: 15, z: 6 },
  { id: "sqdesk3-bm", src: deskSqBmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 9, row: 15, z: 6 },
  { id: "sqdesk3-br", src: deskSqBrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 10, row: 15, z: 6 },
  { id: "sqdesk3-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 8, row: 16, z: 6 },
  { id: "sqdesk3-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 9, row: 16, z: 6 },
  { id: "sqdesk3-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 10, row: 16, z: 6 },

  // 9マス机4(左上 col=5, row=18)
  { id: "sqdesk4-tl", src: deskSqTlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 5, row: 18, z: 6 },
  { id: "sqdesk4-tm", src: deskSqTmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 6, row: 18, z: 6 },
  { id: "sqdesk4-tr", src: deskSqTrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 7, row: 18, z: 6 },
  { id: "sqdesk4-bl", src: deskSqBlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 5, row: 19, z: 6 },
  { id: "sqdesk4-bm", src: deskSqBmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 6, row: 19, z: 6 },
  { id: "sqdesk4-br", src: deskSqBrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 7, row: 19, z: 6 },
  { id: "sqdesk4-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 5, row: 20, z: 6 },
  { id: "sqdesk4-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 6, row: 20, z: 6 },
  { id: "sqdesk4-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 7, row: 20, z: 6 },

  // 9マス机5(左上 col=13, row=17)
  { id: "sqdesk5-tl", src: deskSqTlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 13, row: 17, z: 6 },
  { id: "sqdesk5-tm", src: deskSqTmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 14, row: 17, z: 6 },
  { id: "sqdesk5-tr", src: deskSqTrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 15, row: 17, z: 6 },
  { id: "sqdesk5-bl", src: deskSqBlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 13, row: 18, z: 6 },
  { id: "sqdesk5-bm", src: deskSqBmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 14, row: 18, z: 6 },
  { id: "sqdesk5-br", src: deskSqBrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 15, row: 18, z: 6 },
  { id: "sqdesk5-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 13, row: 19, z: 6 },
  { id: "sqdesk5-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 14, row: 19, z: 6 },
  { id: "sqdesk5-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 15, row: 19, z: 6 },

  // 横長机(col=15〜20, row=6上面 / row=7側面)
  { id: "rectdesk-15-6", src: deskSqTlImg, alt: "机", minLevel: 1, maxLevel: 3, col: 15, row: 6, z: 6 },
  { id: "rectdesk-16-6", src: deskSqTmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 16, row: 6, z: 6 },
  { id: "rectdesk-17-6", src: deskSqTmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 17, row: 6, z: 6 },
  { id: "rectdesk-18-6", src: deskSqTmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 18, row: 6, z: 6 },
  { id: "rectdesk-19-6", src: deskSqTmImg, alt: "机", minLevel: 1, maxLevel: 3, col: 19, row: 6, z: 6 },
  { id: "rectdesk-20-6", src: deskSqTrImg, alt: "机", minLevel: 1, maxLevel: 3, col: 20, row: 6, z: 6 },
  { id: "rectdesk-15-7", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 15, row: 7, z: 6 },
  { id: "rectdesk-16-7", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 16, row: 7, z: 6 },
  { id: "rectdesk-17-7", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 17, row: 7, z: 6 },
  { id: "rectdesk-18-7", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 18, row: 7, z: 6 },
  { id: "rectdesk-19-7", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 19, row: 7, z: 6 },
  { id: "rectdesk-20-7", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, maxLevel: 3, col: 20, row: 7, z: 6 },

  // ロッカー(col=1, row=22〜23)
  { id: "locker-1-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 1, row: 22, z: 4 },
  { id: "locker-1-23", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 1, row: 23, z: 4 },

  // ロッカー(row=22, col=5〜20)
  { id: "locker-5-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 5, row: 22, z: 4 },
  { id: "locker-6-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 6, row: 22, z: 4 },
  { id: "locker-7-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 7, row: 22, z: 4 },
  { id: "locker-8-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 8, row: 22, z: 4 },
  { id: "locker-9-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 9, row: 22, z: 4 },
  { id: "locker-10-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 10, row: 22, z: 4 },
  { id: "locker-11-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 11, row: 22, z: 4 },
  { id: "locker-12-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 12, row: 22, z: 4 },
  { id: "locker-13-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 13, row: 22, z: 4 },
  { id: "locker-14-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 14, row: 22, z: 4 },
  { id: "locker-15-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 15, row: 22, z: 4 },
  { id: "locker-16-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 16, row: 22, z: 4 },
  { id: "locker-17-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 17, row: 22, z: 4 },
  { id: "locker-18-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 18, row: 22, z: 4 },
  { id: "locker-19-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 19, row: 22, z: 4 },
  { id: "locker-20-22", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 20, row: 22, z: 4 },

  // ガラス面(上の横枠 row=9〜10, col=17〜20)
  { id: "glass-17-9", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 17, row: 9, z: 7 },
  { id: "glass-18-9", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 18, row: 9, z: 7 },
  { id: "glass-19-9", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 19, row: 9, z: 7 },
  { id: "glass-20-9", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 20, row: 9, z: 7 },
  { id: "glass-17-10", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 17, row: 10, z: 7 },
  { id: "glass-18-10", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 18, row: 10, z: 7 },
  { id: "glass-19-10", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 19, row: 10, z: 7 },
  { id: "glass-20-10", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 20, row: 10, z: 1 },

  // ガラス面(下の横枠 row=18〜19, col=17〜20)
  { id: "glass-17-18", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 17, row: 18, z: 7 },
  { id: "glass-18-18", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 18, row: 18, z: 7 },
  { id: "glass-19-18", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 19, row: 18, z: 7 },
  { id: "glass-20-18", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 20, row: 18, z: 7 },
  { id: "glass-17-19", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 17, row: 19, z: 7 },
  { id: "glass-18-19", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 18, row: 19, z: 7 },
  { id: "glass-19-19", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 19, row: 19, z: 7 },
  { id: "glass-20-19", src: glassPaneImg, alt: "ガラス", minLevel: 1, maxLevel: 3, col: 20, row: 19, z: 1 },

  // ガラス上の横枠(row=9〜10, col=17〜20)
  { id: "glass-htop-17-9", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 9, z: 9 },
  { id: "glass-htop-18-9", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 18, row: 9, z: 9 },
  { id: "glass-htop-19-9", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 19, row: 9, z: 9 },
  { id: "glass-htop-20-9", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 20, row: 9, z: 9 },
  { id: "glass-htop-17-10", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 10, z: 9 },
  { id: "glass-htop-18-10", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 18, row: 10, z: 9 },
  { id: "glass-htop-19-10", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 19, row: 10, z: 9 },
  { id: "glass-htop-20-10", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 20, row: 10, z: 2},

  // ガラス下の横枠(row=18〜19, col=17〜20)
  { id: "glass-hbot-17-18", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 18, z: 9 },
  { id: "glass-hbot-18-18", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 18, row: 18, z: 9 },
  { id: "glass-hbot-19-18", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 19, row: 18, z: 9 },
  { id: "glass-hbot-20-18", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 20, row: 18, z: 9 },
  { id: "glass-hbot-17-19", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 19, z: 9 },
  { id: "glass-hbot-18-19", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 18, row: 19, z: 9 },
  { id: "glass-hbot-19-19", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 19, row: 19, z: 9 },
  { id: "glass-hbot-20-19", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 20, row: 19, z: 9 },

  // ガラス左の縦枠(col=17, row=9〜19)
  { id: "glass-vleft-17-9", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 9, z: 9 },
  { id: "glass-vleft-17-10", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 10, z: 9 },
  { id: "glass-vleft-17-11", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 11, z: 9 },
  { id: "glass-vleft-17-12", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 12, z: 9 },
  { id: "glass-vleft-17-13", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 13, z: 9 },
  { id: "glass-vleft-17-14", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 14, z: 9 },
  { id: "glass-vleft-17-15", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 15, z: 9 },
  { id: "glass-vleft-17-16", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 16, z: 9 },
  { id: "glass-vleft-17-17", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 17, z: 9 },
  { id: "glass-vleft-17-18", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 18, z: 9 },
  { id: "glass-vleft-17-19", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 19, z: 9 },

  // 紺色マス(col=1, row=24)
  { id: "navy-1-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 1, row: 24, z: 1 },

  // 紺色マス(col=5〜20, row=23〜24)
  { id: "navy-5-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 5, row: 23, z: 1 },
  { id: "navy-6-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 6, row: 23, z: 1 },
  { id: "navy-7-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 7, row: 23, z: 1 },
  { id: "navy-8-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 8, row: 23, z: 1 },
  { id: "navy-9-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 9, row: 23, z: 1 },
  { id: "navy-10-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 10, row: 23, z: 1 },
  { id: "navy-11-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 11, row: 23, z: 1 },
  { id: "navy-12-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 12, row: 23, z: 1 },
  { id: "navy-13-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 13, row: 23, z: 1 },
  { id: "navy-14-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 14, row: 23, z: 1 },
  { id: "navy-15-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 15, row: 23, z: 1 },
  { id: "navy-16-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 16, row: 23, z: 1 },
  { id: "navy-17-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 17, row: 23, z: 1 },
  { id: "navy-18-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 18, row: 23, z: 1 },
  { id: "navy-19-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 19, row: 23, z: 1 },
  { id: "navy-20-23", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 20, row: 23, z: 1 },
  { id: "navy-5-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 5, row: 24, z: 1 },
  { id: "navy-6-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 6, row: 24, z: 1 },
  { id: "navy-7-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 7, row: 24, z: 1 },
  { id: "navy-8-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 8, row: 24, z: 1 },
  { id: "navy-9-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 9, row: 24, z: 1 },
  { id: "navy-10-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 10, row: 24, z: 1 },
  { id: "navy-11-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 11, row: 24, z: 1 },
  { id: "navy-12-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 12, row: 24, z: 1 },
  { id: "navy-13-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 13, row: 24, z: 1 },
  { id: "navy-14-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 14, row: 24, z: 1 },
  { id: "navy-15-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 15, row: 24, z: 1 },
  { id: "navy-16-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 16, row: 24, z: 1 },
  { id: "navy-17-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 17, row: 24, z: 1 },
  { id: "navy-18-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 18, row: 24, z: 1 },
  { id: "navy-19-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 19, row: 24, z: 1 },
  { id: "navy-20-24", src: navyTileImg, alt: "紺マス", minLevel: 1, col: 20, row: 24, z: 1 },

  // 観葉植物lv1(空の鉢)
  { id: "plant-4-22-lv1", src: plant_lv1Img, alt: "観葉植物", minLevel: 1, maxLevel: 3, col: 4, row: 22, z: 2 },
  { id: "plant-16-13-lv1", src: plant_lv1Img, alt: "観葉植物", minLevel: 1, maxLevel: 3, col: 16, row: 13, z: 2 },
  { id: "plant-16-15-lv1", src: plant_lv1Img, alt: "観葉植物", minLevel: 1, maxLevel: 3, col: 16, row: 15, z: 2 },
  

  // 土台
  { id: "desk-low-10-1", src: deskLowWhitebrownImg, alt: "机", minLevel: 1, col: 10, row: 1, z: 5 },
  { id: "fridge-12-1", src: fridgeImg, alt: "冷蔵庫", minLevel: 1, col: 12, row: 1, z: 5 },


  // === Lv.2 で追加する家具は、ここに minLevel: 2 で書いていく ===
  // 観葉植物lv2(芽が出た鉢。lv1の上に重ねる)
  { id: "plant-4-22-lv2", src: plant_lv2Img, alt: "観葉植物", minLevel: 2, maxLevel: 3, col: 4, row: 22, z: 3 },
  { id: "plant-16-13-lv2", src: plant_lv2Img, alt: "観葉植物", minLevel: 2, maxLevel: 3, col: 16, row: 13, z: 3 },
  { id: "plant-16-15-lv2", src: plant_lv2Img, alt: "観葉植物", minLevel: 2, maxLevel: 3, col: 16, row: 15, z: 3 },
 
  // 電子レンジ(机の上に重ねる)
  { id: "microwave-10-1", src: microwaveImg, alt: "電子レンジ", minLevel: 2, col: 10, row: 1, z: 6 },

  // 茶色の冷蔵庫
  { id: "fridge-brown-11-1", src: fridgeBrownImg, alt: "冷蔵庫", minLevel: 2, col: 11, row: 1, z: 5 },

  // ロボット(2×2エリアの中央に約8割サイズ)
  { id: "dopa-10-20", src: dopaImg, alt: "ロボット", minLevel: 2, col: 10.1, row: 20.1, colSpan: 1.8, rowSpan: 1.8, z: 5 },

  // === Lv.3 で追加する家具は、ここに minLevel: 3 で書いていく ===
  // 観葉植物lv3(茂った株。lv1・lv2の上に重ねる)
  
  { id: "plant-16-13-lv3", src: plant_lv3Img, alt: "観葉植物", minLevel: 3, maxLevel: 3, col: 16, row: 13, z: 4 },
  { id: "plant-16-15-lv3", src: plant_lv3Img, alt: "観葉植物", minLevel: 3, maxLevel: 3, col: 16, row: 15, z: 4 },
  { id: "plant-4-22-lv3", src: plant_lv3Img, alt: "観葉植物", minLevel: 3, maxLevel: 3, col: 4, row: 22, z: 4 },

  // === Lv.4 で追加する家具は、ここに minLevel: 4 で書いていく ===

  // 観葉植物 Lv4(育成ライト付き・縦2マス。Lv5で入れ替えるので maxLevel:4)
  { id: "plant-4-22-lv4", src: plant_lv4Gif, alt: "観葉植物", minLevel: 4, maxLevel: 4, col: 4, row: 21.1, rowSpan: 2, z: 5 },
  { id: "plant-16-13-lv4", src: plant_lv4Gif, alt: "観葉植物", minLevel: 4, maxLevel: 4, col: 16, row: 12, rowSpan: 2, z: 5 },
  { id: "plant-16-15-lv4", src: plant_lv4Gif, alt: "観葉植物", minLevel: 4, maxLevel: 4, col: 16, row: 14.1, rowSpan: 2, z: 5 },
  // === Lv.4:近未来机(9分割机を1枚版に置き換え・3×3マス)===
  { id: "sqdesk1-future", src: deskFutureImg, alt: "机", minLevel: 4, col: 5, row: 11, colSpan: 3, rowSpan: 3, z: 6 },
  { id: "sqdesk2-future", src: deskFutureImg, alt: "机", minLevel: 4, col: 12, row: 10, colSpan: 3, rowSpan: 3, z: 6 },
  { id: "sqdesk3-future", src: deskFutureImg, alt: "机", minLevel: 4, col: 8, row: 14, colSpan: 3, rowSpan: 3, z: 6 },
  { id: "sqdesk4-future", src: deskFutureImg, alt: "机", minLevel: 4, col: 5, row: 18, colSpan: 3, rowSpan: 3, z: 6 },
  { id: "sqdesk5-future", src: deskFutureImg, alt: "机", minLevel: 4, col: 13, row: 17, colSpan: 3, rowSpan: 3, z: 6 },
  // === Lv.4:横長の近未来机(6×2マス)===
  { id: "rectdesk-future", src: deskFutureLongImg, alt: "机", minLevel: 4, col: 15, row: 6, colSpan: 6, rowSpan: 2, z: 6 },
  // === Lv.4:青い半透明ガラスに置き換え ===
  { id: "glass-17-9-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 17, row: 9, z: 7 },
  { id: "glass-18-9-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 18, row: 9, z: 7 },
  { id: "glass-19-9-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 19, row: 9, z: 7 },
  { id: "glass-20-9-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 20, row: 9, z: 7 },
  { id: "glass-17-10-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 17, row: 10, z: 7 },
  { id: "glass-18-10-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 18, row: 10, z: 7 },
  { id: "glass-19-10-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 19, row: 10, z: 7 },
  { id: "glass-20-10-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 20, row: 10, z: 1 },
  { id: "glass-17-18-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 17, row: 18, z: 7 },
  { id: "glass-18-18-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 18, row: 18, z: 7 },
  { id: "glass-19-18-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 19, row: 18, z: 7 },
  { id: "glass-20-18-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 20, row: 18, z: 7 },
  { id: "glass-17-19-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 17, row: 19, z: 7 },
  { id: "glass-18-19-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 18, row: 19, z: 7 },
  { id: "glass-19-19-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 19, row: 19, z: 7 },
  { id: "glass-20-19-blue", src: glassPaneBlueImg, alt: "ガラス", minLevel: 4, col: 20, row: 19, z: 6 },

  // === Lv.5 で追加する家具は、ここに minLevel: 5 で書いていく ===
  // === Lv.5(最終形態:発光する栽培ドーム)===
  { id: "plant-4-22-lv5", src: plant_lv5Gif, alt: "観葉植物", minLevel: 5, col: 3.2, row: 21, colSpan: 2, rowSpan: 2, z: 5 },
  { id: "plant-16-13-lv5", src: plant_lv5Gif, alt: "観葉植物", minLevel: 5, col: 15.2, row: 12, colSpan: 2, rowSpan: 2, z: 5 },
  { id: "plant-16-15-lv5", src: plant_lv5Gif, alt: "観葉植物", minLevel: 5, col: 15.2, row: 14.2, colSpan: 2, rowSpan: 2, z: 5 },

  

];