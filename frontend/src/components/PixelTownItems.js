import deskTopImg from "../assets/town/desk_top.png";
import deskSideImg from "../assets/town/desk_side.png";
import wallBeigeImg from "../assets/town/wall_beige.png";
import lockerTopImg from "../assets/town/locker_top.png";

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

  // 壁(row=1, col=13〜21)
  { id: "wall-13-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 13, row: 1, z: 1 },
  { id: "wall-14-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 14, row: 1, z: 1 },
  { id: "wall-15-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 15, row: 1, z: 1 },
  { id: "wall-16-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 16, row: 1, z: 1 },
  { id: "wall-17-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 17, row: 1, z: 1 },
  { id: "wall-18-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 18, row: 1, z: 1 },
  { id: "wall-19-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 19, row: 1, z: 1 },
  { id: "wall-20-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 20, row: 1, z: 1 },
  { id: "wall-21-1", src: wallBeigeImg, alt: "壁", minLevel: 1, col: 21, row: 1, z: 1 },

  // 机1(col=1, row=3〜5)
  { id: "desk1-top-3", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 3, z: 5 },
  { id: "desk1-top-4", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 4, z: 5 },
  { id: "desk1-side-5", src: deskSideImg, alt: "机の脚", minLevel: 1, col: 1, row: 5, z: 5 },

  // 机2(col=1, row=7〜11)
  { id: "desk2-top-7", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 7, z: 5 },
  { id: "desk2-top-8", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 8, z: 5 },
  { id: "desk2-top-9", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 9, z: 5 },
  { id: "desk2-top-10", src: deskTopImg, alt: "机", minLevel: 1, col: 1, row: 10, z: 5 },
  { id: "desk2-side-11", src: deskSideImg, alt: "机の脚", minLevel: 1, col: 1, row: 11, z: 5 },

  // ロッカー(row=13, col=4〜21)
  { id: "locker-4-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 4, row: 13, z: 4 },
  { id: "locker-5-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 5, row: 13, z: 4 },
  { id: "locker-6-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 6, row: 13, z: 4 },
  { id: "locker-7-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 7, row: 13, z: 4 },
  { id: "locker-8-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 8, row: 13, z: 4 },
  { id: "locker-9-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 9, row: 13, z: 4 },
  { id: "locker-10-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 10, row: 13, z: 4 },
  { id: "locker-11-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 11, row: 13, z: 4 },
  { id: "locker-12-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 12, row: 13, z: 4 },
  { id: "locker-13-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 13, row: 13, z: 4 },
  { id: "locker-14-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 14, row: 13, z: 4 },
  { id: "locker-15-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 15, row: 13, z: 4 },
  { id: "locker-16-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 16, row: 13, z: 4 },
  { id: "locker-17-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 17, row: 13, z: 4 },
  { id: "locker-18-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 18, row: 13, z: 4 },
  { id: "locker-19-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 19, row: 13, z: 4 },
  { id: "locker-20-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 20, row: 13, z: 4 },
  { id: "locker-21-13", src: lockerTopImg, alt: "ロッカー", minLevel: 1, col: 21, row: 13, z: 4 },

  // === Lv.2 で追加する家具は、ここに minLevel: 2 で書いていく ===

  // === Lv.3 で追加する家具は、ここに minLevel: 3 で書いていく ===

  // === Lv.4 で追加する家具は、ここに minLevel: 4 で書いていく ===
];