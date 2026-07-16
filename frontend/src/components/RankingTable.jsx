import iconBackground from "../assets/icons/icon-background.png";
import iconFrame from "../assets/icons/maru.png";
import crownIconFrame from "../assets/icons/maru-crown.png";
import { getIconImage } from "./iconAssets";

function RankingTable({ ranking }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Grade</th>
          <th>Total Points</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>
              <div className="rankingUser">
                <span className="rankingUserIcon" aria-hidden="true">
                  <img alt="" className="rankingUserIconBackground" src={iconBackground} />
                  <img alt="" className="rankingUserIconImage" src={getIconImage(user.selected_icon)} />
                  <img
                    alt=""
                    className="rankingUserIconFrame"
                    src={index === 0 ? crownIconFrame : iconFrame}
                  />
                </span>
                <span>{user.name}</span>
              </div>
            </td>
            <td>{user.grade}</td>
            <td className="pointValue">{user.total_point ?? user.point} pt</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RankingTable;
