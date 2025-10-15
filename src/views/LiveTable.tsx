import type { SymbolRow } from '../api/types';

export const LiveTable = ({ rows }: { rows: SymbolRow[] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.symbol}>
            <td>{r.symbol}</td>
            <td>{r.price.toFixed(2)}</td>
            <td>{new Date(r.ts).toLocaleTimeString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
