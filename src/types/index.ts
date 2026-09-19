export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  prevPrice: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  category: string;
  rank: number;
  icon: string;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Position {
  id: string;
  coinId: string;
  side: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPct: number;
  leverage: number;
  stopLoss: number | null;
  takeProfit: number | null;
  timestamp: number;
}

export interface Trade {
  id: string;
  coinId: string;
  coinSymbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop_loss' | 'take_profit';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  fees: number;
  pnl: number;
  timestamp: number;
}

export interface Order {
  id: string;
  coinId: string;
  coinSymbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop_loss' | 'take_profit';
  price: number;
  quantity: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage: number;
  timestamp: number;
  status: 'open' | 'filled' | 'cancelled';
}

export interface WatchlistItem {
  coinId: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  content: string;
  quiz: QuizQuestion[];
  completed: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  instructions: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

export interface AppSettings {
  darkMode: boolean;
  currency: string;
  simulationSpeed: number;
  notifications: boolean;
  startingBalance: number;
}

export interface PortfolioState {
  balance: number;
  realizedPnl: number;
  totalTrades: number;
  winningTrades: number;
  totalProfit: number;
  totalLoss: number;
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D';

export type IndicatorType = 'sma' | 'ema' | 'rsi' | 'macd' | 'bollinger';
