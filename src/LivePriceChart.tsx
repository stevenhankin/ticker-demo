import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { Feed } from './useFinnhubLive';

// keep last N points to avoid unbounded growth
const MAX_POINTS = 300; // ~5 minutes at ~1/sec

type Point = [number, number]; // [tsMs, price]

export default function LivePriceChart({
  symbol = 'AAPL',
  liveFeed
}: {
  symbol?: string;
  liveFeed: Pick<Feed, 'rows' | 'lastTs' | 'status'>;
}) {
  const { rows, lastTs, status } = liveFeed;
  const [seriesData, setSeriesData] = useState<Point[]>([]);

  // append a point whenever we get a new tick time
  useEffect(() => {
    const r = rows.find((x) => x.symbol === symbol);
    if (!r) return;
    const updatedSeries = (prev: Point[]) => {
      const next: Point[] = [...prev, [r.ts, r.price]];
      return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
    };
    setSeriesData(updatedSeries);
  }, [lastTs, rows, symbol]);

  const options: Highcharts.Options = {
    chart: { animation: false },
    title: { text: `${symbol} – Live Price` },
    // time: { useUTC: false },
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
    legend: { enabled: false },
    credits: { enabled: false },
    accessibility: { enabled: false }
  };

  if (status !== 'open') {
    return (
      <div style={{ padding: 8 }}>
        Feed status: <b>{status}</b> (waiting for live data…)
      </div>
    );
  }

  return (
    <div style={{ minHeight: 320 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
