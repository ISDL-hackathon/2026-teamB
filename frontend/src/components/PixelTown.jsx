import charaImg from "../assets/chara.png";

function PixelTown({ weather = "weatherRainy" }) {
  return (
    <div className={`pixelTown ${weather}`} aria-label="共用街">
      {Array.from({ length: 120 }, (_, index) => {
        const isWater = index % 12 === 10 || index % 12 === 11;
        const isPath = Math.floor(index / 12) === 5 || index % 12 === 5;
        const className = isWater ? "water" : isPath ? "path" : "grass";

        return (
          <div className={className} key={index}>
            {index === 65 && (
              <img src={charaImg} className="townChara" alt="街のキャラクター" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PixelTown;
