import { useEffect, useMemo, useReducer, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { initialState, reducer } from './reducer';
import { fetchSeed } from './api';
import type {
  Book,
  FinnhubTradeMsg,
  FinnhubPingMsg,
  FinnhubOtherMsg
} from './types';

const token = import.meta.env?.VITE_FINNHUB_TOKEN;

const QUERY_KEY = ['book'];

export function useFinnhubLive(symbols: string[]) {
  const qc = useQueryClient();

  // 1) Get initial quotes (seed)
  const {
    data: seed,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['seed', ...symbols],
    queryFn: () => fetchSeed(symbols),
    staleTime: 10_000,
    refetchOnWindowFocus: false
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  // seed reducer & cache once
  useEffect(() => {
    if (!seed) return;
    dispatch({ type: 'SEED', rows: seed });
    qc.setQueryData<Book>(QUERY_KEY, seed);
    dispatch({ type: 'CONNECTION', status: 'connecting' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  // 2) Open WebSocket and stream trades
  const wsRef = useRef<WebSocket | null>(null);
  const queueRef = useRef<Array<{ symbol: string; price: number; ts: number }>>(
    []
  );
  const rafRef = useRef<number | null>(null);

  const flush = () => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      const batch = queueRef.current;
      queueRef.current = [];
      rafRef.current = null;
      if (batch.length) {
        dispatch({ type: 'APPLY_BATCH', ticks: batch });
        // keep React Query cache warm for other consumers
        qc.setQueryData<Book>(QUERY_KEY, (prev) => {
          const book = { ...(prev ?? {}) };
          for (const t of batch) {
            const prevRow = book[t.symbol];
            if (!prevRow || t.ts > prevRow.ts) {
              book[t.symbol] = { symbol: t.symbol, price: t.price, ts: t.ts };
            }
          }
          return book;
        });
      }
    });
  };

  useEffect(() => {
    if (!seed || !token || !symbols.length) return;

    const url = `wss://ws.finnhub.io?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      dispatch({ type: 'CONNECTION', status: 'open' });
      // subscribe to each symbol
      for (const s of symbols) {
        ws.send(JSON.stringify({ type: 'subscribe', symbol: s }));
      }
    };

    ws.onmessage = (evt) => {
      const msg: FinnhubTradeMsg | FinnhubPingMsg | FinnhubOtherMsg =
        JSON.parse(evt.data);
      if (isTradeMsg(msg)) {
        for (const t of msg.data) {
          queueRef.current.push({ symbol: t.s, price: t.p, ts: t.t });
        }
        flush();
      }
      // "ping" messages require no action
    };

    ws.onerror = () => dispatch({ type: 'CONNECTION', status: 'error' });
    ws.onclose = () => dispatch({ type: 'CONNECTION', status: 'closed' });

    return () => {
      try {
        for (const s of symbols)
          ws.send(JSON.stringify({ type: 'unsubscribe', symbol: s }));
      } catch (e) {
        console.error('WebSocket not open', e);
      }
      ws.close();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, token, symbols, qc]);

  // 3) Memoized rows for rendering
  const rows = useMemo(
    () =>
      Object.values(state.book).sort((a, b) =>
        a.symbol.localeCompare(b.symbol)
      ),
    [state.book]
  );

  return {
    status: state.status,
    isLoading,
    isError,
    rows,
    lastTs: state.lastTs,
    refetchSeed: refetch
  };
}

/**
 * Type Guard for FinnhubTradeMsg
 *
 * See https://www.finnhub.io/docs/api/websocket-trades
 */
const isTradeMsg = (msg: unknown): msg is FinnhubTradeMsg =>
  !!msg &&
  typeof msg === 'object' &&
  'type' in msg &&
  'data' in msg &&
  msg?.type === 'trade' &&
  Array.isArray(msg?.data);
