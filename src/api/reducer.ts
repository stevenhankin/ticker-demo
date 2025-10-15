import type { Book } from './types';

export type State = {
  status: 'idle' | 'connecting' | 'open' | 'closed' | 'error';
  book: Book;
  lastTs: number;
};

export type Action =
  | { type: 'CONNECTION'; status: State['status'] }
  | { type: 'SEED'; rows: Book }
  | {
      type: 'APPLY_BATCH';
      ticks: Array<{ symbol: string; price: number; ts: number }>;
    }
  | { type: 'RESET' };

export const initialState: State = { status: 'idle', book: {}, lastTs: 0 };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CONNECTION':
      return { ...state, status: action.status };
    case 'RESET':
      return initialState;
    case 'SEED': {
      return { ...state, book: action.rows };
    }
    case 'APPLY_BATCH': {
      if (!action.ticks.length) return state;
      const book = { ...state.book };
      let lastTs = state.lastTs;
      for (const t of action.ticks) {
        const prev = book[t.symbol];
        if (!prev || t.ts > prev.ts) {
          book[t.symbol] = { symbol: t.symbol, price: t.price, ts: t.ts };
        }
        if (t.ts > lastTs) lastTs = t.ts;
      }
      return { ...state, book, lastTs };
    }
    default:
      return state;
  }
}
