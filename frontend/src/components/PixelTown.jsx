import charaImg from "../assets/chara.png";
import floor1Img from "../assets/room/floor1.png";
import "./PixelTown.css";

const SHOW_GRID = true;

const TOWN_COLS = 24;
const TOWN_ROWS = 16;

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

function PixelTown({ weather = "weatherRainy" }) {
  return (
    <div
      className={`pixelTown ${weather}`}
      aria-label="共用街"
      style={{
        backgroundImage: `url(${floor1Img})`,
        backgroundRepeat: "repeat",
        backgroundSize: "32px 32px",
      }}
    >
      {Array.from({ length: TOWN_COLS * TOWN_ROWS }, (_, index) => (
        <div key={index}>
          {index === 65 && (
            <img src={charaImg} className="townChara" alt="街のキャラクター" />
          )}
        </div>
      ))}

      {SHOW_GRID && <TownGridOverlay />}
    </div>
  );
}

export default PixelTown;