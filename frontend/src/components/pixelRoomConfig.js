import charaImg from "../assets/chara.png";
import wallImg from "../assets/room/wall.png";
import floorImg from "../assets/room/floor.png";
import bedImg from "../assets/furniture/bed_pink.png";
import bookshelfImg from "../assets/furniture/bookshelf.png";
import clockImg from "../assets/furniture/clock.png";
import shelfImg from "../assets/furniture/shelf.png";
import stoveImg from "../assets/furniture/suto-bu.png";
import windowImg from "../assets/furniture/window.png";

export const SHOW_GRID = false;

export const roomGrids = {
  wall: {
    cols: 12,
    rows: 3,
  },
  floor: {
    cols: 12,
    rows: 7,
  },
};

export const tileTextures = {
  wall: wallImg,
  floor: floorImg,
};

export const roomItems = [
  {
    id: "window",
    name: "Window",
    price: 30,
    surface: "wall",
    minLevel: 1,
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
    name: "Clock",
    price: 30,
    surface: "wall",
    minLevel: 1,
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
    name: "Stove",
    price: 50,
    surface: "wall",
    minLevel: 1,
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
    name: "Bookshelf",
    price: 80,
    surface: "floor",
    minLevel: 3,
    src: bookshelfImg,
    alt: "bookshelf",
    col: 2,
    row: 1,
    colSpan: 2,
    rowSpan: 3,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "shelf",
    name: "Shelf",
    price: 100,
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
    name: "Bed",
    price: 150,
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
    id: "chara",
    name: "Character",
    surface: "floor",
    minLevel: 1,
    src: charaImg,
    alt: "character",
    col: 6,
    row: 5,
    colSpan: 1.5,
    rowSpan: 1.5,
    z: 10,
    className: "roomChara",
    anchor: "bottomLeft",
    isFixed: true,
  },
];

function createTiles(surface, texture) {
  const grid = roomGrids[surface];

  return Array.from({ length: grid.cols * grid.rows }, (_, index) => ({
    id: `${surface}-${index}`,
    texture,
  }));
}

export const roomTiles = {
  wall: createTiles("wall", "wall"),
  floor: createTiles("floor", "floor"),
};
