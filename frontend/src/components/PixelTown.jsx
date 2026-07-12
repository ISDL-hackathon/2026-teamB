import { Fragment } from "react";
import charaImg from "../assets/izumi.gif";
import floorGreyImg from "../assets/town/floor_grey.png";
import ventImg from "../assets/town/vent.png";
import { townItems } from "./PixeltownItems";
import "./PixelTown.css";
import { pcImages, seatImages, charaImages } from "./villageSlotAssets";

const SHOW_GRID = false;

const TOWN_COLS = 20;
const TOWN_ROWS = 24;

// 換気扇を何マスおきに置くか
const VENT_INTERVAL_COL = 2.5;
const VENT_INTERVAL_ROW = 2.5;

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

// 座席向き毎に座標計算
const SEAT_OFFSETS_BY_DESK_DIRECTION = {
  left: { col: 1, row: 0 },
  right: { col: -1, row: 0 },
  up: { col: 0, row: 1 },
  down: { col: 0, row: -1 },
};

function getSeatPosition(slot) {
  const direction = slot.desk_direction ?? "down";
  const offset = SEAT_OFFSETS_BY_DESK_DIRECTION[direction] ??
    SEAT_OFFSETS_BY_DESK_DIRECTION.down;

  return {
    col: slot.col + offset.col,
    row: slot.row + offset.row,
  };
}

// 画像方向を決める
function getDirection(slot) {
  return slot.desk_direction ?? "down";
}


function PixelTown({ 
  weather = "weatherRainy", 
  level = 1, 
  mode = "view",
  slots = [],
  onSlotSelect,
  onPcClick,
  }) {
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

      {/* 家具レイヤー(壁・机・ロッカーなど、レベルで絞り込み) */}
      {visibleItems.map((item) => (
        <img
          key={item.id}
          src={item.src}
          className="townItem"
          alt={item.alt}
          style={getItemStyle(item)}
        />
      ))}

      {slots.map((slot) => {
        const occupied = Boolean(slot.user);
        const isSelectMode = mode === "select";
        const direction = getDirection(slot);
        const seatType = slot.seat_type ?? "chair";
        const seatPosition = getSeatPosition(slot);
        const shouldShowPc = occupied || isSelectMode;

        const pcImg = pcImages[direction] ?? pcImages.down;
        const seatImg =
          seatImages[seatType]?.[direction] ?? seatImages.chair.down;
        
        const charaImgForSeat =
          charaImages[seatType]?.[direction] ??
          charaImages.chair?.[direction] ??
          charaImg;
        
        return (
          <Fragment key={slot.id}>
          <button
            key={slot.id}
            className={`townSlot ${
              occupied ? "townSlotOccupied" : "townSlotEmpty"
            } ${isSelectMode && !occupied ? "townSlotPcPreview" : ""}`}
            style={getItemStyle({
              col: slot.col,
              row: slot.row,
              z: 40,
            })}
            disabled={isSelectMode && occupied}
            onClick={() => {
              if (isSelectMode) {
                if (!occupied) {
                  onSlotSelect?.(slot.id);
                }
                return;
              }

              if (occupied) {
                onPcClick?.(slot.user.id);
              }
            }}
            type="button"
            title={occupied ? `${slot.user.name} のPC` : slot.label}
          >
            {shouldShowPc && (
              <img
                src={pcImg}
                alt=""
                className={`townPersonalPc ${
                  occupied ? "townPersonalPcOccupied" : "townPersonalPcPreview"
                }`}
              />
            )}
          </button>

          {occupied && (
            <>
              <img
                src={seatImg}
                alt=""
                className="townPersonalSeat"
                style={getItemStyle({
                  col: seatPosition.col,
                  row: seatPosition.row,
                  colSpan: 1,
                  rowSpan: 1,
                  z: 40,
                })}
              />

              <img
                src={charaImgForSeat}
                alt=""
                className={`townPersonalChara townPersonalChara-${direction}`}
                style={getItemStyle({
                  col: seatPosition.col,
                  row: seatPosition.row,
                  z: 45,
                })}
              />
            </>
          )}
          </Fragment>
        );
      })}

      {/* キャラクター */}
      <img
        src={charaImg}
        className="townChara"
        alt="街のキャラクター"
        style={{
          ...getItemStyle({ col: 11, row: 7 }),
          transform: "translateY(-10px) scale(2.5)",
          transformOrigin: "center bottom",
        }}
      />

      {SHOW_GRID && <TownGridOverlay />}
    </div>
  );
}

export default PixelTown;
