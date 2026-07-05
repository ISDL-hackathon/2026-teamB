import charaImg from "../assets/chara.png";
import bedImg from "../assets/furniture/bed_pink.png";
import bookshelfImg from "../assets/furniture/bookshelf.png";
import shelfImg from "../assets/furniture/shelf.png";

const roomGrids = {
  wall: {
    cols: 12,
    rows: 3,
  },
  floor: {
    cols: 12,
    rows: 7,
  },
};

const roomItems = [
  {
    id: "bookshelf",
    surface: "floor",
    minLevel: 3,
    src: bookshelfImg,
    alt: "本棚",
    col: 1.1,
    row: 0.75,
    colSpan: 1.8,
    rowSpan: 2.6,
    z: 9,
    anchor: "bottom",
  },
  {
    id: "shelf",
    surface: "floor",
    minLevel: 4,
    src: shelfImg,
    alt: "棚",
    col: 8.4,
    row: 0.75,
    colSpan: 1.8,
    rowSpan: 2.6,
    z: 9,
    anchor: "bottom",
  },
  {
    id: "bed",
    surface: "floor",
    minLevel: 5,
    src: bedImg,
    alt: "ベッド",
    col: 7.4,
    row: 1,
    colSpan: 1.9,
    z: 8,
  },
  {
    id: "chara",
    surface: "floor",
    minLevel: 1,
    src: charaImg,
    alt: "自分のキャラクター",
    col: 5.2,
    row: 1.25,
    colSpan: 1.25,
    minWidth: 48,
    z: 7,
  },
];

function toGridStyle(item) {
  const grid = roomGrids[item.surface];
  const x = (item.col / grid.cols) * 100;
  const y = (item.row / grid.rows) * 100;
  const width = (item.colSpan / grid.cols) * 100;
  const height = item.rowSpan ? (item.rowSpan / grid.rows) * 100 : null;

  return {
    "--grid-x": `${x}%`,
    "--grid-y": `${y}%`,
    "--grid-w": `${width}%`,
    "--grid-h": height ? `${height}%` : "auto",
    "--min-w": item.minWidth ? `${item.minWidth}px` : "0px",
    "--z": item.z,
  };
}

function RoomItem({ item }) {
  return (
    <img
      src={item.src}
      className={`roomItem ${item.anchor === "bottom" ? "roomItemBottom" : ""}`}
      alt={item.alt}
      style={toGridStyle(item)}
    />
  );
}

function PixelRoom({ level }) {
  const visibleItems = roomItems.filter((item) => level >= item.minLevel);
  const wallItems = visibleItems.filter((item) => item.surface === "wall");
  const floorItems = visibleItems.filter((item) => item.surface === "floor");

  return (
    <div className="isoRoom" aria-label={`ルームレベル${level}`}>
      <div className="roomSurface roomWallSurface">
        {wallItems.map((item) => (
          <RoomItem item={item} key={item.id} />
        ))}
      </div>

      <div className="roomSurface roomFloorSurface" />

      <div className="roomSurface roomFloorItemsSurface">
        {floorItems.map((item) => (
          <RoomItem item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

export default PixelRoom;
