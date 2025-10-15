const token = import.meta.env?.VITE_FINNHUB_TOKEN;

if (!token) {
  console.warn('Finnhub token missing. Set VITE_FINNHUB_TOKEN in .env file.');
}

const base = 'https://finnhub.io/api/v1';

export async function fetchQuote(symbol: string) {
  const url = `${base}/quote?symbol=${encodeURIComponent(
    symbol
  )}&token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`quote fetch failed: ${symbol}`);
  // shape: { c,h,l,o,pc,t }
  const j = await res.json();
  return {
    symbol,
    price: Number(j.c ?? 0),
    ts: (Number(j.t ?? 0) || Date.now()) * 1000 // API returns seconds
  };
}

export async function fetchSeed(symbols: string[]) {
  const rows = await Promise.all(symbols.map(fetchQuote));
  const book = rows.reduce<
    Record<string, { symbol: string; price: number; ts: number }>
  >((acc, r) => ((acc[r.symbol] = r), acc), {});
  return book;
}
