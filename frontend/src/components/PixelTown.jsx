import { Fragment, useEffect, useRef, useState } from "react";
import charaImg from "../assets/izumi.gif";
import floorGreyImg from "../assets/town/floor_grey.png";
import ventImg from "../assets/town/vent.png";
import { townItems } from "./PixeltownItems";
import "./PixelTown.css";
import { pcImages, seatImages, charaImages } from "./villageSlotAssets";

const SHOW_GRID = false;

const TOWN_COLS = 20;
const TOWN_ROWS = 24;

const TILE = 32;
const BORDER = 6; // .town の border 幅(片側)
// 街全体の実寸(枠込み)。scale の基準に使う
const TOWN_WIDTH = TOWN_COLS * TILE + BORDER * 2; // 640 + 12 = 652
const TOWN_HEIGHT = TOWN_ROWS * TILE + BORDER * 2; // 768 + 12 = 780

// 換気扇を何マスおきに置くか
const VENT_INTERVAL_COL = 2.5;
const VENT_INTERVAL_ROW = 2.5;

// このスロットのPCだけ、モニターとの兼ね合いでzを下げる
const LOWERED_Z_PC_IDS = new Set(["pc16", "pc23", "pc31"]);

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
  const visibleItems = townItems.filter(
    (item) =>
      level >= item.minLevel &&
      (item.maxLevel == null || level <= item.maxLevel),
  );

  // 画面幅に合わせて街全体を縮小(はみ出し防止)
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const avail = wrapRef.current?.clientWidth ?? TOWN_WIDTH;
      // 収まるなら等倍(1)、狭ければ画面幅に合わせて縮小
      setScale(Math.min(1, avail / TOWN_WIDTH));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="townWrap" ref={wrapRef}>
      <div
        className="townScale"
        style={{
          width: TOWN_WIDTH * scale,
          height: TOWN_HEIGHT * scale,
        }}
      >
        <div
          className={`pixelTown ${weather}`}
          aria-label="共用街"
          style={{
            backgroundImage: `url(${floorGreyImg})`,
            backgroundRepeat: "repeat",
            backgroundSize: "32px 32px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
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
            const isOnline = Boolean(slot.user?.is_online);
            const shouldShowPc = occupied || isSelectMode;

            const pcImg = pcImages[direction] ?? pcImages.down;
            const seatImg =
              seatImages[seatType]?.[direction] ?? seatImages.chair.down;

            const charaImgForSeat =
              charaImages[seatType]?.[direction] ??
              charaImages.chair?.[direction] ??
              charaImg;

            const pcZ = LOWERED_Z_PC_IDS.has(slot.id) ? 40 : 47;

            return (
              <Fragment key={slot.id}>
                <button
                  key={slot.id}
                  className={`townSlot ${
                    occupied ? "townSlotOccupied" : "townSlotEmpty"
                  } ${isSelectMode && !occupied ? "townSlotPcPreview" : ""} ${
                    isSelectMode && occupied ? "townSlotOccupiedPreview" : ""
                  }`}
                  style={getItemStyle({
                    col: slot.col,
                    row: slot.row,
                    z: pcZ,
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

                {occupied &&
                  (isOnline ? (
                    <>
                      <img
                        src={charaImgForSeat}
                        alt=""
                        className={`townPersonalChara townPersonalChara-${direction}`}
                        style={getItemStyle({
                          col: seatPosition.col + 0.05,
                          row: seatPosition.row + 0.2,
                          z: 45,
                        })}
                      />
                      <span
                        className="townUserName"
                        style={getItemStyle({
                          col: seatPosition.col,
                          row: seatPosition.row,
                          z: 60,
                        })}
                      >
                        {slot.user.name}
                      </span>
                    </>
                  ) : (
                    <img
                      src={seatImg}
                      alt=""
                      className="townPersonalSeat"
                      style={getItemStyle({
                        col: seatPosition.col,
                        row: seatPosition.row,
                        colSpan: 1,
                        rowSpan: 1.2,
                        z: 40,
                      })}
                    />
                  ))}
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
      </div>
    </div>
  );
}

export default PixelTown;