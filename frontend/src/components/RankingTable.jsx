function RankingTable({ ranking }) {
  return (
    <table>
      <thead>
        <tr>
          <th>順位</th>
          <th>名前</th>
          <th>学年</th>
          <th>ポイント</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.grade}</td>
            <td>{user.point} pt</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RankingTable;
