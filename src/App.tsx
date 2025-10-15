import { useFinnhubLive } from './useFinnhubLive';

const SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'TG'];

export default function App() {
  const { status, isLoading, isError, rows } = useFinnhubLive(SYMBOLS);

  if (isLoading) {
    return <div>Loading initial quotes…</div>;
  }

  if (isError) {
    return <div>Failed to load seed.</div>;
  }

  return (
    <div>
      <h1>Ticker Demo</h1>
      <h2>Finnhub Live Prices (Hybrid)</h2>
      <div>
        Feed status: <b>{status}</b>
      </div>
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
      <p>
        Seed via REST /quote; live via WebSocket trade stream. Batched per
        animation frame.
      </p>
    </div>
  );
}
