import LivePriceChart from './views/LivePriceChart';
import { LiveTable } from './views/LiveTable';
import { useFinnhubLive } from './api/useFinnhubLive';
import { Grid } from '@mui/material';
import { useState } from 'react';
import type { SymbolRow } from './api/types';

const SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'TG'];

export default function App() {
  const { status, isError, rows, lastTs } = useFinnhubLive(SYMBOLS);
  const [selectedSymbol, setSelectedSymbol] = useState(SYMBOLS[0]);

  if (isError) {
    return <div>Failed to load seed.</div>;
  }

  const handleSelectedSymbol = (symbol: SymbolRow['symbol']) => {
    setSelectedSymbol(symbol);
  };

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
      <Grid size={{ xs: 12, lg: 6 }}>
        <LiveTable rows={rows} handleSelectedSymbol={handleSelectedSymbol} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <LivePriceChart
          symbol={selectedSymbol}
          liveFeed={{ status, rows, lastTs }}
        />
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
