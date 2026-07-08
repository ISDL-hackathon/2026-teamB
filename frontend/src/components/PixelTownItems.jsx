import deskTopImg from "../assets/town/desk_top.png";
import deskSideImg from "../assets/town/desk_side.png";
import wallBeigeImg from "../assets/town/wall_beige.png";
import lockerTopImg from "../assets/town/locker_top.png";
import tatamiTopImg from "../assets/town/tatami_top.png";
import tatamiSideImg from "../assets/town/tatami_side.png";
import deskBrownLeftImg from "../assets/town/desk_brown_left.png";
import deskBrownMidImg from "../assets/town/desk_brown_mid.png";
import deskBrownRightImg from "../assets/town/desk_brown_right.png";
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

  // 机1(col=1, row=2〜5 天面、row=6 脚)
  { id: "desk1-top-2", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 2, z: 5 },
  { id: "desk1-top-3", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 3, z: 5 },
  { id: "desk1-top-4", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 4, z: 5 },
  { id: "desk1-top-5", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 5, z: 5 },
  { id: "desk1-side-6", src: deskSideImg, alt: "机の脚", minLevel: 1, col: 1, row: 6, z: 5 },

  // 机2(col=1, row=8〜12 天面、row=13 脚)
  { id: "desk2-top-8", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 8, z: 5 },
  { id: "desk2-top-9", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 9, z: 5 },
  { id: "desk2-top-10", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 10, z: 5 },
  { id: "desk2-top-11", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 11, z: 5 },
  { id: "desk2-top-12", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 12, z: 5 },
  { id: "desk2-side-13", src: deskSideImg, alt: "机の脚", minLevel: 1, col: 1, row: 13, z: 5 },

  // 白い長机A(col=6, row=2〜4天面 / row=5脚)
  { id: "wdesk-a-top-2", src: deskTopImg, alt: "机", minLevel: 1, col: 6, row: 2, z: 5 },
  { id: "wdesk-a-top-3", src: deskTopImg, alt: "机", minLevel: 1, col: 6, row: 3, z: 5 },
  { id: "wdesk-a-top-4", src: deskTopImg, alt: "机", minLevel: 1, col: 6, row: 4, z: 5 },
  { id: "wdesk-a-side-5", src: deskSideImg, alt: "机の脚", minLevel: 1, col: 6, row: 5, z: 5 },

  // 白い長机B(col=7, row=2〜4天面 / row=5脚)
  { id: "wdesk-b-top-2", src: deskTopImg, alt: "机", minLevel: 1, col: 7, row: 2, z: 5 },
  { id: "wdesk-b-top-3", src: deskTopImg, alt: "机", minLevel: 1, col: 7, row: 3, z: 5 },
  { id: "wdesk-b-top-4", src: deskTopImg, alt: "机", minLevel: 1, col: 7, row: 4, z: 5 },
  { id: "wdesk-b-side-5", src: deskSideImg, alt: "机の脚", minLevel: 1, col: 7, row: 5, z: 5 },
  // 白い長机C(col=20, row=9〜12天面 / row=13脚)
  { id: "wdesk-c-top-8", src: deskTopImg, alt: "机", minLevel: 1, col: 20, row: 8, z: 8 },
  { id: "wdesk-c-top-9", src: deskTopImg, alt: "机", minLevel: 1, col: 20, row: 9, z: 5 },
  { id: "wdesk-c-top-10", src: deskTopImg, alt: "机", minLevel: 1, col: 20, row: 10, z: 5 },
  { id: "wdesk-c-top-11", src: deskTopImg, alt: "机", minLevel: 1, col: 20, row: 11, z: 5 },
  { id: "wdesk-c-top-12", src: deskTopImg, alt: "机", minLevel: 1, col: 20, row: 12, z: 5 },
  { id: "wdesk-c-side-13", src: deskSideImg, alt: "机の脚", minLevel: 1, col: 20, row: 13, z: 5 },

  // ロッカー(row=16, col=1)
  { id: "locker-1-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 1, row: 16, z: 4 },

  // ロッカー(row=16, col=5〜20)
  { id: "locker-5-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 5, row: 16, z: 4 },
  { id: "locker-6-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 6, row: 16, z: 4 },
  { id: "locker-7-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 7, row: 16, z: 4 },
  { id: "locker-8-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 8, row: 16, z: 4 },
  { id: "locker-9-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 9, row: 16, z: 4 },
  { id: "locker-10-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 10, row: 16, z: 4 },
  { id: "locker-11-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 11, row: 16, z: 4 },
  { id: "locker-12-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 12, row: 16, z: 4 },
  { id: "locker-13-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 13, row: 16, z: 4 },
  { id: "locker-14-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 14, row: 16, z: 4 },
  { id: "locker-15-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 15, row: 16, z: 4 },
  { id: "locker-16-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 16, row: 16, z: 4 },
  { id: "locker-17-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 17, row: 16, z: 4 },
  { id: "locker-18-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 18, row: 16, z: 4 },
  { id: "locker-19-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 19, row: 16, z: 4 },
  { id: "locker-20-16", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 20, row: 16, z: 4 },

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

  // 畳の側面(col=15〜20, row=5)
  { id: "tatami-side-15-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 15, row: 5, z: 3 },
  { id: "tatami-side-16-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 16, row: 5, z: 3 },
  { id: "tatami-side-17-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 17, row: 5, z: 3 },
  { id: "tatami-side-18-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 18, row: 5, z: 3 },
  { id: "tatami-side-19-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 19, row: 5, z: 3 },
  { id: "tatami-side-20-5", src: tatamiSideImg, alt: "畳の側面", minLevel: 1, col: 20, row: 5, z: 3 },

  // 茶色の横長机(col=16〜19, row=3)。端と中央でパーツを分けて継ぎ目を消す
  { id: "brown-desk-16-3", src: deskBrownLeftImg, alt: "茶机", minLevel: 1, col: 16, row: 3, z: 6 },
  { id: "brown-desk-17-3", src: deskBrownMidImg, alt: "茶机", minLevel: 1, col: 17, row: 3, z: 6 },
  { id: "brown-desk-18-3", src: deskBrownMidImg, alt: "茶机", minLevel: 1, col: 18, row: 3, z: 6 },
  { id: "brown-desk-19-3", src: deskBrownRightImg, alt: "茶机", minLevel: 1, col: 19, row: 3, z: 6 },

  // 四角机1(左上 col=4, row=7)
  { id: "sqdesk1-tl", src: deskSqTlImg, alt: "机", minLevel: 1, col: 4, row: 7, z: 6 },
  { id: "sqdesk1-tm", src: deskSqTmImg, alt: "机", minLevel: 1, col: 5, row: 7, z: 6 },
  { id: "sqdesk1-tr", src: deskSqTrImg, alt: "机", minLevel: 1, col: 6, row: 7, z: 6 },
  { id: "sqdesk1-bl", src: deskSqBlImg, alt: "机", minLevel: 1, col: 4, row: 8, z: 6 },
  { id: "sqdesk1-bm", src: deskSqBmImg, alt: "机", minLevel: 1, col: 5, row: 8, z: 6 },
  { id: "sqdesk1-br", src: deskSqBrImg, alt: "机", minLevel: 1, col: 6, row: 8, z: 6 },
  { id: "sqdesk1-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, col: 4, row: 9, z: 6 },
  { id: "sqdesk1-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, col: 5, row: 9, z: 6 },
  { id: "sqdesk1-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, col: 6, row: 9, z: 6 },

  // 四角机2(左上 col=8, row=9)
  { id: "sqdesk2-tl", src: deskSqTlImg, alt: "机", minLevel: 1, col: 8, row: 9, z: 6 },
  { id: "sqdesk2-tm", src: deskSqTmImg, alt: "机", minLevel: 1, col: 9, row: 9, z: 6 },
  { id: "sqdesk2-tr", src: deskSqTrImg, alt: "机", minLevel: 1, col: 10, row: 9, z: 6 },
  { id: "sqdesk2-bl", src: deskSqBlImg, alt: "机", minLevel: 1, col: 8, row: 10, z: 6 },
  { id: "sqdesk2-bm", src: deskSqBmImg, alt: "机", minLevel: 1, col: 9, row: 10, z: 6 },
  { id: "sqdesk2-br", src: deskSqBrImg, alt: "机", minLevel: 1, col: 10, row: 10, z: 6 },
  { id: "sqdesk2-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, col: 8, row: 11, z: 6 },
  { id: "sqdesk2-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, col: 9, row: 11, z: 6 },
  { id: "sqdesk2-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, col: 10, row: 11, z: 6 },

  // 四角机3(左上 col=5, row=12)
  { id: "sqdesk3-tl", src: deskSqTlImg, alt: "机", minLevel: 1, col: 5, row: 12, z: 6 },
  { id: "sqdesk3-tm", src: deskSqTmImg, alt: "机", minLevel: 1, col: 6, row: 12, z: 6 },
  { id: "sqdesk3-tr", src: deskSqTrImg, alt: "机", minLevel: 1, col: 7, row: 12, z: 6 },
  { id: "sqdesk3-bl", src: deskSqBlImg, alt: "机", minLevel: 1, col: 5, row: 13, z: 6 },
  { id: "sqdesk3-bm", src: deskSqBmImg, alt: "机", minLevel: 1, col: 6, row: 13, z: 6 },
  { id: "sqdesk3-br", src: deskSqBrImg, alt: "机", minLevel: 1, col: 7, row: 13, z: 6 },
  { id: "sqdesk3-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, col: 5, row: 14, z: 6 },
  { id: "sqdesk3-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, col: 6, row: 14, z: 6 },
  { id: "sqdesk3-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, col: 7, row: 14, z: 6 },

  // 四角机4(左上 col=12, row=11)
  { id: "sqdesk4-tl", src: deskSqTlImg, alt: "机", minLevel: 1, col: 12, row: 11, z: 6 },
  { id: "sqdesk4-tm", src: deskSqTmImg, alt: "机", minLevel: 1, col: 13, row: 11, z: 6 },
  { id: "sqdesk4-tr", src: deskSqTrImg, alt: "机", minLevel: 1, col: 14, row: 11, z: 6 },
  { id: "sqdesk4-bl", src: deskSqBlImg, alt: "机", minLevel: 1, col: 12, row: 12, z: 6 },
  { id: "sqdesk4-bm", src: deskSqBmImg, alt: "机", minLevel: 1, col: 13, row: 12, z: 6 },
  { id: "sqdesk4-br", src: deskSqBrImg, alt: "机", minLevel: 1, col: 14, row: 12, z: 6 },
  { id: "sqdesk4-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, col: 12, row: 13, z: 6 },
  { id: "sqdesk4-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, col: 13, row: 13, z: 6 },
  { id: "sqdesk4-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, col: 14, row: 13, z: 6 },

  // 四角机5(左上 col=12, row=6)
  { id: "sqdesk5-tl", src: deskSqTlImg, alt: "机", minLevel: 1, col: 12, row: 6, z: 6 },
  { id: "sqdesk5-tm", src: deskSqTmImg, alt: "机", minLevel: 1, col: 13, row: 6, z: 6 },
  { id: "sqdesk5-tr", src: deskSqTrImg, alt: "机", minLevel: 1, col: 14, row: 6, z: 6 },
  { id: "sqdesk5-bl", src: deskSqBlImg, alt: "机", minLevel: 1, col: 12, row: 7, z: 6 },
  { id: "sqdesk5-bm", src: deskSqBmImg, alt: "机", minLevel: 1, col: 13, row: 7, z: 6 },
  { id: "sqdesk5-br", src: deskSqBrImg, alt: "机", minLevel: 1, col: 14, row: 7, z: 6 },
  { id: "sqdesk5-sl", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, col: 12, row: 8, z: 6 },
  { id: "sqdesk5-sm", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, col: 13, row: 8, z: 6 },
  { id: "sqdesk5-sr", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, col: 14, row: 8, z: 6 },

  // 横長机(col=17〜20, row=6上面 / row=7側面)
  { id: "rectdesk-17-6", src: deskSqTlImg, alt: "机", minLevel: 1, col: 17, row: 6, z: 6 },
  { id: "rectdesk-18-6", src: deskSqTmImg, alt: "机", minLevel: 1, col: 18, row: 6, z: 6 },
  { id: "rectdesk-19-6", src: deskSqTmImg, alt: "机", minLevel: 1, col: 19, row: 6, z: 6 },
  { id: "rectdesk-20-6", src: deskSqTrImg, alt: "机", minLevel: 1, col: 20, row: 6, z: 6 },
  { id: "rectdesk-17-7", src: deskSqSideLeftImg, alt: "机の脚", minLevel: 1, col: 17, row: 7, z: 6 },
  { id: "rectdesk-18-7", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, col: 18, row: 7, z: 6 },
  { id: "rectdesk-19-7", src: deskSqSideMidImg, alt: "机の脚", minLevel: 1, col: 19, row: 7, z: 6 },
  { id: "rectdesk-20-7", src: deskSqSideRightImg, alt: "机の脚", minLevel: 1, col: 20, row: 7, z: 6 },

 // ガラス面(上の横枠の位置 row=7〜8, col=17〜20)
  { id: "glass-17-7", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 17, row: 7, z: 7 },
  { id: "glass-18-7", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 18, row: 7, z: 7 },
  { id: "glass-19-7", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 19, row: 7, z: 7 },
  { id: "glass-20-7", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 20, row: 7, z: 7 },
  { id: "glass-17-8", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 17, row: 8, z: 7 },
  { id: "glass-18-8", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 18, row: 8, z: 7 },
  { id: "glass-19-8", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 19, row: 8, z: 7 },
  { id: "glass-20-8", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 20, row: 8, z: 7 },

  // ガラス面(下の横枠の位置 row=13〜14, col=17〜20)
  { id: "glass-17-13", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 17, row: 13, z: 7 },
  { id: "glass-18-13", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 18, row: 13, z: 7 },
  { id: "glass-19-13", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 19, row: 13, z: 7 },
  { id: "glass-20-13", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 20, row: 13, z: 7 },
  { id: "glass-17-14", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 17, row: 14, z: 7 },
  { id: "glass-18-14", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 18, row: 14, z: 7 },
  { id: "glass-19-14", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 19, row: 14, z: 7 },
  { id: "glass-20-14", src: glassPaneImg, alt: "ガラス", minLevel: 1, col: 20, row: 14, z: 7 },

  // 上の横枠(row=7〜8, col=17〜20)
  { id: "glass-htop-17-7", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 7, z: 9 },
  { id: "glass-htop-18-7", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 18, row: 7, z: 9 },
  { id: "glass-htop-19-7", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 19, row: 7, z: 9 },
  { id: "glass-htop-20-7", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 20, row: 7, z: 9 },
  { id: "glass-htop-17-8", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 8, z: 9 },
  { id: "glass-htop-18-8", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 18, row: 8, z: 9 },
  { id: "glass-htop-19-8", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 19, row: 8, z: 9 },
  { id: "glass-htop-20-8", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 20, row: 8, z: 9 },

  // 下の横枠(row=13〜14, col=17〜20)
  { id: "glass-hbot-17-13", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 13, z: 9 },
  { id: "glass-hbot-18-13", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 18, row: 13, z: 9 },
  { id: "glass-hbot-19-13", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 19, row: 13, z: 9 },
  { id: "glass-hbot-20-13", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 20, row: 13, z: 9 },
  { id: "glass-hbot-17-14", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 14, z: 9 },
  { id: "glass-hbot-18-14", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 18, row: 14, z: 9 },
  { id: "glass-hbot-19-14", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 19, row: 14, z: 9 },
  { id: "glass-hbot-20-14", src: glassHframeImg, alt: "ガラス枠", minLevel: 1, col: 20, row: 14, z: 9 },

  // 左の縦枠(col=17, row=8〜14)
  { id: "glass-vleft-17-7", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 7, z: 10 },
  { id: "glass-vleft-17-8", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 8, z: 9 },
  { id: "glass-vleft-17-9", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 9, z: 9 },
  { id: "glass-vleft-17-10", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 10, z: 9 },
  { id: "glass-vleft-17-11", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 11, z: 9 },
  { id: "glass-vleft-17-12", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 12, z: 9 },
  { id: "glass-vleft-17-13", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 13, z: 9 },
  { id: "glass-vleft-17-14", src: glassVframeImg, alt: "ガラス枠", minLevel: 1, col: 17, row: 14, z: 9 },


  // === Lv.2 で追加する家具は、ここに minLevel: 2 で書いていく ===

  // === Lv.3 で追加する家具は、ここに minLevel: 3 で書いていく ===

  // === Lv.4 で追加する家具は、ここに minLevel: 4 で書いていく ===
];