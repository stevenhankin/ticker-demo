import LivePriceChart from './views/LivePriceChart';
import { LiveTable } from './views/LiveTable';
import { useFinnhubLive } from './api/useFinnhubLive';
import { Grid } from '@mui/material';

const SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'TG'];

export default function App() {
  const { status, isError, rows, lastTs } = useFinnhubLive(SYMBOLS);

  if (isError) {
    return <div>Failed to load seed.</div>;
  }

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <h1>Ticker Demo</h1>
      </Grid>
      <Grid size={12}>
        <h2>Finnhub Live Prices (Hybrid)</h2>
      </Grid>
      <Grid size={12}>
        Feed status: <b>{status}</b>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LivePriceChart
          symbol={SYMBOLS[0]}
          liveFeed={{ status, rows, lastTs }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LiveTable rows={rows} />
      </Grid>
      <Grid size={12}>
        <p>
          Seed via REST /quote; live via WebSocket trade stream. Batched per
          animation frame.
        </p>
      </Grid>
    </Grid>
  );
}
