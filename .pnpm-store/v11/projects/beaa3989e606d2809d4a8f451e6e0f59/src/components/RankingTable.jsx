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
            <td>{user.name}</td>
            <td>{user.grade}</td>
            <td className="pointValue">{user.total_point ?? user.point} pt</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RankingTable;
