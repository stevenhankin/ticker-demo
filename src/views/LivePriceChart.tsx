import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import type { Feed } from '../api/useFinnhubLive';

// keep last N points to avoid unbounded growth
const MAX_POINTS = 300; // ~5 minutes at ~1/sec

type Point = [number, number]; // [tsMs, price]

/**
 * Live chart for the first symbol
 */
export default function LivePriceChart({
  symbol = 'AAPL',
  liveFeed
}: {
  symbol?: string;
  liveFeed: Pick<Feed, 'rows' | 'lastTs' | 'status'>;
}) {
  const { rows, lastTs, status } = liveFeed;
  const [seriesData, setSeriesData] = useState<Point[]>([]);
  const [prevSymbol, setPrevSymbol] = useState(symbol);

  // append a point whenever we get a new tick time
  useEffect(() => {
    if (prevSymbol !== symbol) {
      // reset if symbol changed
      setSeriesData([]);
      setPrevSymbol(symbol);
    } else {
      // only track the selected symbol
      const r = rows.find((x) => x.symbol === symbol);
      if (!r) return;
      const updatedSeries = (prev: Point[]) => {
        const next: Point[] = [...prev, [r.ts, r.price]];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      };
      setSeriesData(updatedSeries);
    }
  }, [lastTs, prevSymbol, rows, symbol]);

  const options: Highcharts.Options = {
    title: { text: `${symbol} - Live Price` },
    xAxis: { type: 'datetime' },
    yAxis: { title: { text: 'Price' } },
    series: [
      {
        type: 'line',
        name: symbol,
        data: seriesData,
        tooltip: { valueDecimals: 2 }
      }
    ],
    accessibility: {
      enabled: true
    }
  };

  if (status !== 'open') {
    return (
      <div style={{ padding: 8 }}>
        Feed status: <b>{status}</b> (waiting for live data…)
      </div>
    );
  }

  return (
    <div style={{ minHeight: 320, borderRadius: 8, overflow: 'hidden' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
