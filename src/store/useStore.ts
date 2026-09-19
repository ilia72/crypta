import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CoinData, Position, Trade, Order, WatchlistItem, Lesson,
  Challenge, Badge, AppSettings,
} from '../types';
import { COINS, LESSONS, CHALLENGES, BADGES } from '../data';
import { generateId } from '../utils/formatters';

const DEFAULT_BALANCE = 10000;
const FEE_RATE = 0.001;

export interface AppState {
  coins: CoinData[];
  updateCoinPrice: (id: string, price: number) => void;
  updateCoins: (coins: CoinData[]) => void;
  simulatePrices: () => void;

  balance: number;
  initialBalance: number;
  positions: Position[];
  trades: Trade[];
  orders: Order[];
  realizedPnl: number;
  totalTrades: number;
  winningTrades: number;
  totalProfit: number;
  totalLoss: number;
  setBalance: (b: number) => void;
  addPosition: (pos: Position) => void;
  removePosition: (id: string) => void;
  updatePositionPrice: (id: string, price: number) => void;
  addTrade: (trade: Trade) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  removeOrder: (id: string) => void;
  updatePortfolioStats: () => void;

  watchlist: WatchlistItem[];
  toggleWatchlist: (coinId: string) => boolean;
  isWatchlisted: (coinId: string) => boolean;

  lessons: Lesson[];
  toggleLesson: (id: string) => void;
  completedLessonCount: () => number;

  challenges: Challenge[];
  completeChallenge: (id: string) => void;
  completedChallengeCount: () => number;

  badges: Badge[];
  checkBadges: () => void;

  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;

  activePage: string;
  setActivePage: (page: string) => void;
  selectedCoinId: string;
  setSelectedCoinId: (id: string) => void;
  resetAccount: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      coins: COINS,
      updateCoinPrice: (id, price) => {
        set((state) => ({
          coins: state.coins.map((c) =>
            c.id === id ? { ...c, prevPrice: c.price, price } : c
          ),
        }));
      },
      updateCoins: (coins) => set({ coins }),
      simulatePrices: () => {
        const state = get();
        const updatedCoins = state.coins.map((coin) => {
          const volatility = coin.price * 0.002;
          const drift = (Math.random() - 0.48) * volatility;
          const spike = Math.random() < 0.03 ? (Math.random() - 0.5) * volatility * 5 : 0;
          const newPrice = Math.max(coin.price + drift + spike, coin.price * 0.01);
          const change24h = ((newPrice - coin.prevPrice) / coin.prevPrice) * 100;
          const change7d = ((newPrice - coin.price * 0.95) / (coin.price * 0.95)) * 100;
          const high24h = Math.max(coin.high24h, newPrice);
          const low24h = Math.min(coin.low24h, newPrice);
          const volume24h = coin.volume24h * (0.9 + Math.random() * 0.2);
          return {
            ...coin,
            prevPrice: coin.price,
            price: newPrice,
            change24h,
            change7d,
            high24h,
            low24h,
            volume24h,
          };
        });
        set({ coins: updatedCoins });
      },

      balance: DEFAULT_BALANCE,
      initialBalance: DEFAULT_BALANCE,
      positions: [],
      trades: [],
      orders: [],
      realizedPnl: 0,
      totalTrades: 0,
      winningTrades: 0,
      totalProfit: 0,
      totalLoss: 0,

      setBalance: (b) => set({ balance: b }),

      addPosition: (pos) => set((state) => ({ positions: [...state.positions, pos] })),
      removePosition: (id) => set((state) => ({
        positions: state.positions.filter((p) => p.id !== id),
      })),
      updatePositionPrice: (id, price) => set((state) => ({
        positions: state.positions.map((p) =>
          p.id === id ? { ...p, currentPrice: price, pnl: (price - p.entryPrice) * p.quantity * p.leverage, pnlPct: ((price - p.entryPrice) / p.entryPrice) * 100 } : p
        ),
      })),

      addTrade: (trade) => set((state) => ({
        trades: [trade, ...state.trades],
        realizedPnl: state.realizedPnl + trade.pnl,
        totalTrades: state.totalTrades + 1,
        winningTrades: trade.pnl > 0 ? state.winningTrades + 1 : state.winningTrades,
        totalProfit: trade.pnl > 0 ? state.totalProfit + trade.pnl : state.totalProfit,
        totalLoss: trade.pnl < 0 ? state.totalLoss + Math.abs(trade.pnl) : state.totalLoss,
      })),

      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      })),
      removeOrder: (id) => set((state) => ({ orders: state.orders.filter((o) => o.id !== id) })),

      updatePortfolioStats: () => {
        const { trades, positions, realizedPnl } = get();
        const winning = trades.filter((t) => t.pnl > 0).length;
        const profit = trades.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
        const loss = trades.filter((t) => t.pnl < 0).reduce((s, t) => s + Math.abs(t.pnl), 0);
        set({
          totalTrades: trades.length,
          winningTrades: winning,
          totalProfit: profit,
          totalLoss: loss,
          realizedPnl,
        });
      },

      watchlist: [{ coinId: 'bitcoin' }, { coinId: 'ethereum' }, { coinId: 'solana' }],
      toggleWatchlist: (coinId) => {
        const state = get();
        const exists = state.watchlist.some((w) => w.coinId === coinId);
        const newWatchlist = exists
          ? state.watchlist.filter((w) => w.coinId !== coinId)
          : [...state.watchlist, { coinId }];
        set({ watchlist: newWatchlist });
        return !exists;
      },
      isWatchlisted: (coinId) => get().watchlist.some((w) => w.coinId === coinId),

      lessons: LESSONS,
      toggleLesson: (id) => set((state) => ({
        lessons: state.lessons.map((l) => (l.id === id ? { ...l, completed: !l.completed } : l)),
      })),
      completedLessonCount: () => get().lessons.filter((l) => l.completed).length,

      challenges: CHALLENGES,
      completeChallenge: (id) => set((state) => ({
        challenges: state.challenges.map((c) => (c.id === id ? { ...c, completed: true } : c)),
      })),
      completedChallengeCount: () => get().challenges.filter((c) => c.completed).length,

      badges: BADGES,
      checkBadges: () => {
        const state = get();
        const newBadges = [...state.badges];
        if (state.trades.length >= 1) newBadges[0] = { ...newBadges[0], earned: true };
        if (state.completedLessonCount() >= 5) newBadges[1] = { ...newBadges[1], earned: true };
        if (state.completedLessonCount() >= LESSONS.length) newBadges[2] = { ...newBadges[2], earned: true };
        if (state.completedChallengeCount() >= 3) newBadges[3] = { ...newBadges[3], earned: true };
        const uniqueCoins = new Set(state.positions.map((p) => p.coinId));
        if (uniqueCoins.size >= 4) newBadges[4] = { ...newBadges[4], earned: true };
        const slTrades = state.trades.filter((t) => t.type === 'stop_loss').length;
        if (slTrades >= 5) newBadges[5] = { ...newBadges[5], earned: true };
        set({ badges: newBadges });
      },

      settings: {
        darkMode: true,
        currency: 'USDT',
        simulationSpeed: 1,
        notifications: true,
        startingBalance: DEFAULT_BALANCE,
      },
      updateSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),

      activePage: 'dashboard',
      setActivePage: (page) => set({ activePage: page }),
      selectedCoinId: 'bitcoin',
      setSelectedCoinId: (id) => set({ selectedCoinId: id }),

      resetAccount: () => {
        localStorage.removeItem('crypta-store');
        set({
          balance: DEFAULT_BALANCE,
          initialBalance: DEFAULT_BALANCE,
          positions: [],
          trades: [],
          orders: [],
          realizedPnl: 0,
          totalTrades: 0,
          winningTrades: 0,
          totalProfit: 0,
          totalLoss: 0,
          lessons: LESSONS.map((l) => ({ ...l, completed: false })),
          challenges: CHALLENGES.map((c) => ({ ...c, completed: false })),
          badges: BADGES.map((b) => ({ ...b, earned: false })),
          watchlist: [{ coinId: 'bitcoin' }, { coinId: 'ethereum' }, { coinId: 'solana' }],
        });
      },
    }),
    { name: 'crypta-store' }
  )
);

export function executeMarketBuy(
  coinId: string,
  coinSymbol: string,
  price: number,
  quantity: number,
  leverage: number,
  stopLoss?: number,
  takeProfit?: number
) {
  const state = useStore.getState();
  const cost = price * quantity * leverage;
  const fees = cost * FEE_RATE;

  if (state.balance < cost + fees) return { success: false, error: 'Insufficient balance' };

  const newBalance = state.balance - cost - fees;
  const pos: Position = {
    id: generateId(),
    coinId,
    side: 'long',
    entryPrice: price,
    currentPrice: price,
    quantity,
    pnl: 0,
    pnlPct: 0,
    leverage,
    stopLoss: stopLoss || null,
    takeProfit: takeProfit || null,
    timestamp: Date.now(),
  };

  const trade: Trade = {
    id: generateId(),
    coinId,
    coinSymbol,
    side: 'buy',
    type: 'market',
    entryPrice: price,
    exitPrice: price,
    quantity,
    fees,
    pnl: -fees,
    timestamp: Date.now(),
  };

  useStore.setState({
    balance: newBalance,
    positions: [...state.positions, pos],
    trades: [trade, ...state.trades],
    realizedPnl: state.realizedPnl - fees,
    totalTrades: state.totalTrades + 1,
    totalLoss: state.totalLoss + fees,
  });

  return { success: true, position: pos, trade };
}

export function executeMarketSell(
  positionId: string,
  price: number
) {
  const state = useStore.getState();
  const pos = state.positions.find((p) => p.id === positionId);
  if (!pos) return { success: false, error: 'Position not found' };

  const revenue = price * pos.quantity * pos.leverage;
  const fees = revenue * FEE_RATE;
  const pnl = (price - pos.entryPrice) * pos.quantity * pos.leverage;
  const netPnl = pnl - fees;

  const trade: Trade = {
    id: generateId(),
    coinId: pos.coinId,
    coinSymbol: state.coins.find((c) => c.id === pos.coinId)?.symbol || '',
    side: 'sell',
    type: 'market',
    entryPrice: pos.entryPrice,
    exitPrice: price,
    quantity: pos.quantity,
    fees,
    pnl: netPnl,
    timestamp: Date.now(),
  };

  const newBalance = state.balance + revenue - fees;

  useStore.setState({
    balance: newBalance,
    positions: state.positions.filter((p) => p.id !== positionId),
    trades: [trade, ...state.trades],
    realizedPnl: state.realizedPnl + netPnl,
    totalTrades: state.totalTrades + 1,
    winningTrades: netPnl > 0 ? state.winningTrades + 1 : state.winningTrades,
    totalProfit: netPnl > 0 ? state.totalProfit + netPnl : state.totalProfit,
    totalLoss: netPnl < 0 ? state.totalLoss + Math.abs(netPnl) : state.totalLoss,
  });

  return { success: true, trade };
}

export function checkAndFillOrders() {
  const state = useStore.getState();
  const updatedOrders = [...state.orders];
  let balanceChanged = false;
  let newTrades: Trade[] = [];
  let newPositions: Position[] = [];
  let filledOrderIds: string[] = [];

  state.orders.forEach((order) => {
    if (order.status !== 'open') return;
    const coin = state.coins.find((c) => c.id === order.coinId);
    if (!coin) return;
    const currentPrice = coin.price;

    let shouldFill = false;
    if (order.type === 'limit') {
      if (order.side === 'buy' && currentPrice <= order.price) shouldFill = true;
      if (order.side === 'sell' && currentPrice >= order.price) shouldFill = true;
    } else if (order.type === 'stop_loss') {
      const pos = state.positions.find((p) => p.id === order.coinId);
      if (pos && order.side === 'sell' && currentPrice <= order.price) shouldFill = true;
    } else if (order.type === 'take_profit') {
      const pos = state.positions.find((p) => p.id === order.coinId);
      if (pos && order.side === 'sell' && currentPrice >= order.price) shouldFill = true;
    }

    if (shouldFill) {
      const cost = order.price * order.quantity * order.leverage;
      const fees = cost * FEE_RATE;

      if (order.side === 'buy') {
        if (state.balance >= cost + fees) {
          const pos: Position = {
            id: generateId(),
            coinId: order.coinId,
            side: 'long',
            entryPrice: order.price,
            currentPrice: currentPrice,
            quantity: order.quantity,
            pnl: 0,
            pnlPct: 0,
            leverage: order.leverage,
            stopLoss: order.stopLoss || null,
            takeProfit: order.takeProfit || null,
            timestamp: Date.now(),
          };
          newPositions.push(pos);
          const trade: Trade = {
            id: generateId(),
            coinId: order.coinId,
            coinSymbol: order.coinSymbol,
            side: 'buy',
            type: order.type,
            entryPrice: order.price,
            exitPrice: currentPrice,
            quantity: order.quantity,
            fees,
            pnl: -fees,
            timestamp: Date.now(),
          };
          newTrades.push(trade);
          balanceChanged = true;
        }
      } else {
        const pos = state.positions.find((p) => p.coinId === order.coinId);
        if (pos) {
          const revenue = order.price * pos.quantity * pos.leverage;
          const pnl = (order.price - pos.entryPrice) * pos.quantity * pos.leverage;
          const netPnl = pnl - fees;
          const trade: Trade = {
            id: generateId(),
            coinId: pos.coinId,
            coinSymbol: order.coinSymbol,
            side: 'sell',
            type: order.type,
            entryPrice: pos.entryPrice,
            exitPrice: order.price,
            quantity: pos.quantity,
            fees,
            pnl: netPnl,
            timestamp: Date.now(),
          };
          newTrades.push(trade);
          newPositions.push({ ...pos, currentPrice: order.price, pnl: netPnl, pnlPct: ((order.price - pos.entryPrice) / pos.entryPrice) * 100 });
          balanceChanged = true;
        }
      }
      filledOrderIds.push(order.id);
    }
  });

  if (balanceChanged || newTrades.length > 0) {
    useStore.setState({
      orders: state.orders.map((o) => filledOrderIds.includes(o.id) ? { ...o, status: 'filled' as const } : o),
      positions: [...state.positions.filter((p) => !newPositions.find((np) => np.id === p.id)), ...newPositions],
      trades: [...newTrades, ...state.trades],
    });
  }

  return { filledOrderIds };
}
