import LivePriceChart from './views/LivePriceChart';
import { LiveTable } from './views/LiveTable';
import { useFinnhubLive } from './api/useFinnhubLive';

const SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'TG'];

export default function App() {
  const { status, isLoading, isError, rows, lastTs } = useFinnhubLive(SYMBOLS);

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

      <LivePriceChart symbol={SYMBOLS[0]} liveFeed={{ status, rows, lastTs }} />

      <LiveTable rows={rows} />

      <p>
        Seed via REST /quote; live via WebSocket trade stream. Batched per
        animation frame.
      </p>
    </div>
  );
}
