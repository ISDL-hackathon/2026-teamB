import charaImg from "../assets/chara.png";
import floorGreyImg from "../assets/town/floor_grey.png";
import ventImg from "../assets/town/vent.png";
import deskTopImg from "../assets/town/desk_top.png";
import deskSideImg from "../assets/town/desk_side.png";
import wallBeigeImg from "../assets/town/wall_beige.png";
import "./PixelTown.css";

const SHOW_GRID = true;

const TOWN_COLS = 21;
const TOWN_ROWS = 13;

// 換気扇を何マスおきに置くか
const VENT_INTERVAL_COL = 4;
const VENT_INTERVAL_ROW = 3;

// 家具の配置リスト
const townItems = [
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
];

// 換気扇を等間隔で自動生成する
function createVents() {
  const vents = [];
  for (let row = 1; row <= TOWN_ROWS; row += VENT_INTERVAL_ROW) {
    for (let col = 1; col <= TOWN_COLS; col += VENT_INTERVAL_COL) {
      vents.push({
        col,
        row,
        colSpan: 0.66,
        rowSpan: 0.66,
        key: `vent-${col}-${row}`,
      });
    }
  }
  return vents;
}

// マス目の位置を、画面上の%位置に変換する
function getItemStyle(item) {
  const colSpan = item.colSpan ?? 1;
  const rowSpan = item.rowSpan ?? 1;
  return {
    position: "absolute",
    left: `${((item.col - 1) / TOWN_COLS) * 100}%`,
    top: `${((item.row - 1) / TOWN_ROWS) * 100}%`,
    width: `${(colSpan / TOWN_COLS) * 100}%`,
    height: `${(rowSpan / TOWN_ROWS) * 100}%`,
    zIndex: item.z ?? 1,
  };
}

function TownGridOverlay() {
  return (
    <div
      className="townGridOverlay"
      style={{
        gridTemplateColumns: `repeat(${TOWN_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${TOWN_ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: TOWN_COLS * TOWN_ROWS }, (_, index) => {
        const isTopRow = index < TOWN_COLS;
        const isLeftColumn = index % TOWN_COLS === 0;
        return (
          <div
            className={`townGridCell ${isTopRow ? "townGridCellTop" : ""} ${
              isLeftColumn ? "townGridCellLeft" : ""
            }`}
            key={`town-grid-${index}`}
          />
        );
      })}
    </div>
  );
}

function PixelTown({ weather = "weatherRainy", level = 1 }) {
  const vents = createVents();
  const visibleItems = townItems.filter((item) => level >= item.minLevel);

  return (
    <div
      className={`pixelTown ${weather}`}
      aria-label="共用街"
      style={{
        backgroundImage: `url(${floorGreyImg})`,
        backgroundRepeat: "repeat",
        backgroundSize: "32px 32px",
      }}
    >
      {/* 換気扇レイヤー(等間隔で自動配置) */}
      {vents.map((vent) => (
        <img
          key={vent.key}
          src={ventImg}
          className="townVent"
          alt="換気扇"
          style={getItemStyle(vent)}
        />
      ))}

      {/* 家具レイヤー(壁・机など、レベルで絞り込み) */}
      {visibleItems.map((item) => (
        <img
          key={item.id}
          src={item.src}
          className="townItem"
          alt={item.alt}
          style={getItemStyle(item)}
        />
      ))}

      {/* キャラクター */}
      <img
        src={charaImg}
        className="townChara"
        alt="街のキャラクター"
        style={getItemStyle({ col: 11, row: 7 })}
      />

      {SHOW_GRID && <TownGridOverlay />}
    </div>
  );
}

export default PixelTown;