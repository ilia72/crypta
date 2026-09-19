import type { CoinData, Candle, Timeframe } from '../types';

export function generateCandles(
  basePrice: number,
  timeframe: Timeframe,
  count: number = 100
): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice;
  const intervalMs: Record<Timeframe, number> = {
    '1m': 60000, '5m': 300000, '15m': 900000,
    '1h': 3600000, '4h': 14400000, '1D': 86400000,
  };
  const interval = intervalMs[timeframe];
  let volatility = basePrice * 0.005;
  const now = Date.now();

  for (let i = count; i > 0; i--) {
    const drift = (Math.random() - 0.48) * volatility;
    const spike = Math.random() < 0.05 ? (Math.random() - 0.5) * volatility * 4 : 0;
    const open = price;
    const close = Math.max(price + drift + spike, basePrice * 0.1);
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = (Math.random() * 0.8 + 0.2) * 1000;

    candles.push({
      time: now - i * interval,
      open, high, low, close, volume,
    });
    price = close;
    volatility = basePrice * (0.003 + Math.random() * 0.004);
  }
  return candles;
}

export function simulateNextPrice(coin: CoinData): { price: number; change: number } {
  const volatility = coin.price * 0.002;
  const drift = (Math.random() - 0.48) * volatility;
  const spike = Math.random() < 0.03 ? (Math.random() - 0.5) * volatility * 5 : 0;
  const newPrice = Math.max(coin.price + drift + spike, coin.price * 0.01);
  const change = ((newPrice - coin.price) / coin.price) * 100;
  return { price: newPrice, change };
}

export function simulateAllCoins(coins: CoinData[]): CoinData[] {
  return coins.map((coin) => {
    const { price } = simulateNextPrice(coin);
    const change24h = ((price - coin.prevPrice) / coin.prevPrice) * 100;
    const change7d = ((price - coin.price * 0.95) / (coin.price * 0.95)) * 100;
    const high24h = Math.max(coin.high24h, price);
    const low24h = Math.min(coin.low24h, price);
    const volume24h = coin.volume24h * (0.9 + Math.random() * 0.2);
    return {
      ...coin,
      prevPrice: coin.price,
      price,
      change24h,
      change7d,
      high24h,
      low24h,
      volume24h,
    };
  });
}

export function generateNewsEvents(coins: CoinData[]): Array<{ id: string; title: string; coin: string; time: number; type: 'bullish' | 'bearish' | 'neutral' }> {
  const events: Array<{ id: string; title: string; coin: string; time: number; type: 'bullish' | 'bearish' | 'neutral' }> = [];
  const templates = [
    { type: 'bullish' as const, prefix: 'Whale accumulation detected for', suffix: ' — large buy orders observed' },
    { type: 'bearish' as const, prefix: 'Sell pressure increasing on', suffix: ' — exchange outflows rise' },
    { type: 'neutral' as const, prefix: 'Trading volume spike on', suffix: ' — market activity heats up' },
    { type: 'bullish' as const, prefix: 'New partnership announced for', suffix: ' — ecosystem expands' },
    { type: 'bearish' as const, prefix: 'Regulatory concerns affect', suffix: ' — price under pressure' },
    { type: 'bullish' as const, prefix: 'Network upgrade boosts', suffix: ' — technical improvements live' },
    { type: 'neutral' as const, prefix: 'Market analysis:', suffix: ' consolidating in current range' },
    { type: 'bullish' as const, prefix: 'Institutional interest growing for', suffix: ' — custody solutions expanding' },
  ];

  const selected = coins.slice(0, 8);
  for (let i = 0; i < 12; i++) {
    const coin = selected[i % selected.length];
    const template = templates[i % templates.length];
    events.push({
      id: `evt-${i}`,
      title: `${template.prefix} ${coin.symbol}${template.suffix}`,
      coin: coin.symbol,
      time: Date.now() - i * 3600000 * Math.random() * 6,
      type: template.type,
    });
  }
  return events.sort((a, b) => b.time - a.time);
}

export function generatePerformanceData(trades: Array<{ pnl: number; timestamp: number }>) {
  return trades.slice(0, 30).map((t, i) => ({
    name: `#${i + 1}`,
    pnl: t.pnl,
    time: t.timestamp,
  }));
}
