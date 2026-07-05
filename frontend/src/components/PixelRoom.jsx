import charaImg from "../assets/chara.png";

const furnitureByLevel = {
  1: [],
  2: ["desk"],
  3: ["desk", "bookshelf"],
  4: ["desk", "bookshelf", "pc", "plant"],
  5: ["desk", "bookshelf", "pc", "plant", "rug", "shelf"],
};

function PixelRoom({ level }) {
  const furniture = furnitureByLevel[level] ?? furnitureByLevel[1];

  return (
    <div className="isoRoom">
      <div className="roomBackWall">
        {furniture.includes("bookshelf") && <div className="pixelBookshelf" />}
        {furniture.includes("shelf") && <div className="pixelShelf" />}
        <div className="pixelWindow" />
      </div>

      <div className="roomLeftWall" />
      <div className="roomRightWall" />

      <div className="roomFloorArea">
        {furniture.includes("rug") && <div className="pixelRug" />}

        {furniture.includes("desk") && (
          <div className="pixelDesk">
            {furniture.includes("pc") && <div className="pixelPc" />}
          </div>
        )}

        {furniture.includes("plant") && <div className="pixelPlant" />}

        <img src={charaImg} className="isoChara" alt="自分" />
      </div>
    </div>
  );
}

export default PixelRoom;