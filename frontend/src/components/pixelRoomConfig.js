import charaImg from "../assets/izumi.gif";
import wallImg from "../assets/room/wall.png";
import wallLv1Img from "../assets/room/wall_lv1.png";
import floorImg from "../assets/room/floor.png";
import floorTileImg from "../assets/room/floor1.png";
import floorGreyImg from "../assets/room/floor_grey_2.png";
import japaneseFloorVerticalImg from "../assets/room/japanese/floor-vertical.png";
import japaneseFloorHorizontalImg from "../assets/room/japanese/floor-horizontal.png";
import japaneseWallMainImg from "../assets/room/japanese/wall-main.png";
import japaneseWallAccentImg from "../assets/room/japanese/wall-accent.png";
import chineseFloorOrnateImg from "../assets/room/chinese/floor-ornate.png";
import chineseFloorSimpleImg from "../assets/room/chinese/floor-simple.png";
import chineseWallMainImg from "../assets/room/chinese/wall-main.png";
import chineseWallAccentImg from "../assets/room/chinese/wall-accent.png";
import palaceFloorLightImg from "../assets/room/palace/floor-light.png";
import palaceFloorRedImg from "../assets/room/palace/floor-red.png";
import palaceWallMainImg from "../assets/room/palace/wall-main.png";
import palaceWallAccentImg from "../assets/room/palace/wall-accent.png";
import indianFloorGreenImg from "../assets/room/indian/floor-green.png";
import indianFloorOrangeImg from "../assets/room/indian/floor-orange.png";
import indianWallMainImg from "../assets/room/indian/wall-main.png";
import indianWallAccentImg from "../assets/room/indian/wall-accent.png";
import bedImg from "../assets/furniture/bed_pink.png";
import bookshelfImg from "../assets/furniture/bookshelf.png";
import clockImg from "../assets/furniture/clock.png";
import fanImg from "../assets/furniture/fan.png";
import bulletinBoardImg from "../assets/furniture/keijibann.png";
import gameCabinetImg from "../assets/furniture/game-cabinet.png";
import questBoardImg from "../assets/furniture/quest-board.png";
import officeChairImg from "../assets/furniture/office_chair.png";
import roundTableImg from "../assets/furniture/round_table.png";
import cactusImg from "../assets/furniture/saboten.png";
import floweringCactusImg from "../assets/furniture/sabowithflower.png";
import shelfImg from "../assets/furniture/shelf.png";
import sofaImg from "../assets/furniture/sofa.png";
import sunflowerImg from "../assets/furniture/sunflower.png";
import stoveImg from "../assets/furniture/suto-bu.png";
import windowImg from "../assets/furniture/window.png";
import retroTVImg from "../assets/furniture/retro_tv.png";

export const SHOW_GRID = false;

export const roomGrids = {
  wall: {
    cols: 12,
    rows: 4,
  },
  floor: {
    cols: 12,
    rows: 8,
  },
};

export const tileTextures = {
  labWall: wallLv1Img,
  westernWall: wallImg,
  japaneseWall: [
    japaneseWallMainImg,
    japaneseWallMainImg,
    japaneseWallAccentImg,
    japaneseWallMainImg,
  ],
  chineseWall: [
    chineseWallMainImg,
    chineseWallMainImg,
    chineseWallAccentImg,
    chineseWallMainImg,
  ],
  palaceWall: [
    palaceWallMainImg,
    palaceWallMainImg,
    palaceWallAccentImg,
    palaceWallMainImg,
  ],
  indianWall: [
    indianWallMainImg,
    indianWallMainImg,
    indianWallAccentImg,
    indianWallMainImg,
  ],
  labFloor: floorGreyImg,
  westernFloor: floorImg,
  tileFloor: floorTileImg,
  japaneseFloor: [
    japaneseFloorVerticalImg,
    japaneseFloorHorizontalImg,
    japaneseFloorVerticalImg,
    japaneseFloorHorizontalImg,
    japaneseFloorVerticalImg,
    japaneseFloorHorizontalImg,
    japaneseFloorVerticalImg,
    japaneseFloorHorizontalImg,
    japaneseFloorHorizontalImg,
    japaneseFloorVerticalImg,
    japaneseFloorHorizontalImg,
    japaneseFloorVerticalImg,
    japaneseFloorHorizontalImg,
    japaneseFloorVerticalImg,
    japaneseFloorHorizontalImg,
    japaneseFloorVerticalImg,
  ],
  chineseFloor: [
    chineseFloorOrnateImg,
    chineseFloorSimpleImg,
    chineseFloorOrnateImg,
    chineseFloorSimpleImg,
    chineseFloorSimpleImg,
    chineseFloorOrnateImg,
    chineseFloorSimpleImg,
    chineseFloorOrnateImg,
    chineseFloorOrnateImg,
    chineseFloorSimpleImg,
    chineseFloorOrnateImg,
    chineseFloorSimpleImg,
    chineseFloorSimpleImg,
    chineseFloorOrnateImg,
    chineseFloorSimpleImg,
    chineseFloorOrnateImg,
  ],
  palaceFloor: [
    palaceFloorLightImg,
    palaceFloorRedImg,
    palaceFloorLightImg,
    palaceFloorRedImg,
    palaceFloorRedImg,
    palaceFloorLightImg,
    palaceFloorRedImg,
    palaceFloorLightImg,
    palaceFloorLightImg,
    palaceFloorRedImg,
    palaceFloorLightImg,
    palaceFloorRedImg,
    palaceFloorRedImg,
    palaceFloorLightImg,
    palaceFloorRedImg,
    palaceFloorLightImg,
  ],
  indianFloor: [
    indianFloorGreenImg,
    indianFloorOrangeImg,
    indianFloorGreenImg,
    indianFloorOrangeImg,
    indianFloorOrangeImg,
    indianFloorGreenImg,
    indianFloorOrangeImg,
    indianFloorGreenImg,
    indianFloorGreenImg,
    indianFloorOrangeImg,
    indianFloorGreenImg,
    indianFloorOrangeImg,
    indianFloorOrangeImg,
    indianFloorGreenImg,
    indianFloorOrangeImg,
    indianFloorGreenImg,
  ],
};

export const defaultRoomTheme = {
  wall: "labWall",
  floor: "labFloor",
};

export const wallFrameColors = {
  labWall: "#7a766c",
  westernWall: "#604b38",
  japaneseWall: "#3d2c1f",
  chineseWall: "#6f211b",
  palaceWall: "#725334",
  indianWall: "#59432f",
};

export const floorFrameColors = {
  labFloor: "#4f4f4f",
  westernFloor: "#513d2b",
  tileFloor: "#5f6264",
  japaneseFloor: "#41452f",
  chineseFloor: "#571f18",
  palaceFloor: "#8b6132",
  indianFloor: "#315c62",
};

export const wallTextureOptions = [
  { id: "labWall", name: "研究室", minLevel: 1 },
  { id: "westernWall", name: "洋風", minLevel: 2, purchaseId: "theme_western" },
  { id: "japaneseWall", name: "和風", minLevel: 3, purchaseId: "theme_japanese" },
  { id: "chineseWall", name: "中華風", minLevel: 4, purchaseId: "theme_chinese" },
  { id: "indianWall", name: "インド風", minLevel: 5, purchaseId: "theme_indian" },
  { id: "palaceWall", name: "宮殿風", minLevel: 6, purchaseId: "theme_palace" },
];

export const floorTextureOptions = [
  { id: "labFloor", name: "研究室", minLevel: 1 },
  { id: "westernFloor", name: "洋風", minLevel: 2, purchaseId: "theme_western" },
  { id: "tileFloor", name: "タイル", minLevel: 2 },
  { id: "japaneseFloor", name: "和風（畳）", minLevel: 3, purchaseId: "theme_japanese" },
  { id: "chineseFloor", name: "中華風", minLevel: 4, purchaseId: "theme_chinese" },
  { id: "indianFloor", name: "インド風", minLevel: 5, purchaseId: "theme_indian" },
  { id: "palaceFloor", name: "宮殿風", minLevel: 6, purchaseId: "theme_palace" },
];

export const roomThemePackages = [
  { id: "theme_western", name: "洋風セット", wall: "westernWall", floor: "westernFloor", price: 50, minLevel: 2 },
  { id: "theme_japanese", name: "和風セット", wall: "japaneseWall", floor: "japaneseFloor", price: 75, minLevel: 3 },
  { id: "theme_chinese", name: "中華風セット", wall: "chineseWall", floor: "chineseFloor", price: 100, minLevel: 4 },
  { id: "theme_indian", name: "インド風セット", wall: "indianWall", floor: "indianFloor", price: 125, minLevel: 5 },
  { id: "theme_palace", name: "宮殿風セット", wall: "palaceWall", floor: "palaceFloor", price: 150, minLevel: 6 },
];

export const roomItems = [
  {
    id: "round_table",
    name: "丸テーブル",
    price: 50,
    category: "lab",
    surface: "floor",
    minLevel: 1,
    src: roundTableImg,
    alt: "round table",
    col: 5,
    row: 5,
    colSpan: 3,
    rowSpan: 2,
    z: 7,
    anchor: "bottomLeft",
  },
  {
    id: "office_chair",
    name: "オフィスチェア",
    price: 35,
    category: "lab",
    surface: "floor",
    minLevel: 1,
    src: officeChairImg,
    alt: "office chair",
    col: 4,
    row: 4,
    colSpan: 1.5,
    rowSpan: 2.5,
    z: 6,
    anchor: "bottomLeft",
  },
  {
    id: "bulletin_board",
    name: "掲示板",
    price: 50,
    category: "lab",
    surface: "wall",
    minLevel: 1,
    src: bulletinBoardImg,
    alt: "bulletin board",
    col: 2,
    row: 1,
    colSpan: 3,
    rowSpan: 3,
    z: 7,
    anchor: "bottomLeft",
  },
  {
    id: "quest_board",
    name: "クエストボード",
    price: 50,
    category: "lab",
    surface: "floor",
    minLevel: 1,
    src: questBoardImg,
    alt: "quest board",
    col: 7,
    row: 8,
    colSpan: 3,
    rowSpan: 4,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "window",
    name: "窓",
    price: 30,
    category: "western",
    surface: "wall",
    minLevel: 2,
    src: windowImg,
    alt: "window",
    col: 8,
    row: 2,
    colSpan: 2,
    rowSpan: 2,
    z: 6,
    anchor: "bottomLeft",
  },
  {
    id: "clock",
    name: "時計",
    price: 30,
    category: "western",
    surface: "wall",
    minLevel: 2,
    src: clockImg,
    alt: "clock",
    col: 11,
    row: 1,
    colSpan: 1,
    rowSpan: 1,
    z: 7,
    anchor: "bottomLeft",
  },
  {
    id: "stove",
    name: "ストーブ",
    price: 50,
    category: "western",
    surface: "wall",
    minLevel: 2,
    src: stoveImg,
    alt: "stove",
    col: 5,
    row: 3,
    colSpan: 2,
    rowSpan: 3,
    z: 7,
    anchor: "bottomLeft",
  },
  {
    id: "bookshelf",
    name: "本棚",
    price: 80,
    category: "western",
    surface: "floor",
    minLevel: 3,
    src: bookshelfImg,
    alt: "bookshelf",
    col: 2,
    row: 1,
    colSpan: 2,
    rowSpan: 3,
    z: 8,
    className: "roomBookshelf",
    anchor: "bottomLeft",
  },
  {
    id: "shelf",
    name: "棚",
    price: 100,
    category: "western",
    surface: "floor",
    minLevel: 4,
    src: shelfImg,
    alt: "shelf",
    col: 6,
    row: 1,
    colSpan: 2,
    rowSpan: 3,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "bed",
    name: "ベッド",
    price: 150,
    category: "western",
    surface: "floor",
    minLevel: 5,
    src: bedImg,
    alt: "bed",
    col: 8,
    row: 3,
    colSpan: 2,
    rowSpan: 2,
    z: 7,
    anchor: "bottomLeft",
  },

  {
  id: "retro_tv",
  name: "レトロテレビ",
  price: 80,
  category: "western",
  surface: "floor",
  minLevel: 2,
  src: retroTVImg,
  alt: "retro television",
  col: 7,
  row: 4,
  colSpan: 1,
  rowSpan: 1,
  z: 8,
  anchor: "bottomLeft",
},

  {
    id: "game_cabinet",
    name: "ゲーム機",
    price: 100,
    category: "lab",
    surface: "floor",
    minLevel: 2,
    src: gameCabinetImg,
    alt: "game cabinet",
    col: 9,
    row: 4,
    colSpan: 2,
    rowSpan: 3,
    z: 9,
    anchor: "bottomLeft",
  },
  {
    id: "fan",
    name: "Fan",
    price: 40,
    category: "western",
    surface: "floor",
    minLevel: 1,
    src: fanImg,
    alt: "electric fan",
    col: 10,
    row: 5,
    colSpan: 1,
    rowSpan: 1,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "cactus",
    name: "Cactus",
    price: 30,
    category: "western",
    surface: "floor",
    minLevel: 1,
    src: cactusImg,
    alt: "cactus",
    col: 2,
    row: 6,
    colSpan: 1,
    rowSpan: 1.3,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "flowering_cactus",
    name: "Flowering Cactus",
    price: 45,
    category: "western",
    surface: "floor",
    minLevel: 2,
    src: floweringCactusImg,
    alt: "flowering cactus",
    col: 3,
    row: 6,
    colSpan: 1,
    rowSpan: 1.3,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "sofa",
    name: "Sofa",
    price: 120,
    category: "western",
    surface: "floor",
    minLevel: 3,
    src: sofaImg,
    alt: "sofa",
    col: 5,
    row: 5,
    colSpan: 2,
    rowSpan: 1.5,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "sunflower",
    name: "Sunflower",
    price: 50,
    category: "western",
    surface: "floor",
    minLevel: 2,
    src: sunflowerImg,
    alt: "sunflower",
    col: 11,
    row: 5,
    colSpan: 1,
    rowSpan: 1.3,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "chara",
    name: "キャラクター",
    surface: "floor",
    minLevel: 1,
    src: charaImg,
    alt: "character",
    col: 6,
    row: 6,
    colSpan: 1.5,
    rowSpan: 1.5,
    z: 10,
    className: "roomChara",
    anchor: "bottomLeft",
    isFixed: true,
  },
  
];

