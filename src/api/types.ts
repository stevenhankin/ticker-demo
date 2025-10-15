export type SymbolRow = {
  symbol: string;
  price: number;
  ts: number; // epoch ms
};

export type Book = Record<string, SymbolRow>;

export type FinnhubTradeMsg = {
  type: 'trade';
  data: Array<{ p: number; s: string; t: number; v: number; c?: string[] }>;
};

export type FinnhubPingMsg = { type: 'ping' };
export type FinnhubOtherMsg = { type: string; [k: string]: unknown };
