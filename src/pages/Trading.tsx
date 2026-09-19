import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore, executeMarketBuy, executeMarketSell, checkAndFillOrders } from '../store/useStore';
import { formatPrice, formatPercent, formatCurrency, generateId, formatDate } from '../utils/formatters';
import { generateCandles } from '../utils/marketEngine';
import { calculateSMA, calculateEMA, calculateRSI, calculateMACD, calculateBollingerBands } from '../utils/indicators';
import { CandlestickChart } from '../components/CandlestickChart';
import type { Timeframe, IndicatorType, Position, Trade, Order, Candle } from '../types';
import {
  ArrowUpRight, ArrowDownRight, DollarSign, Shield, Target, Percent,
  ChevronDown, X, Check, Search, Activity, Clock,
} from 'lucide-react';

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D'];
const INDICATORS: { key: IndicatorType; label: string }[] = [
  { key: 'sma', label: 'SMA (20)' },
  { key: 'ema', label: 'EMA (12)' },
  { key: 'rsi', label: 'RSI (14)' },
  { key: 'macd', label: 'MACD' },
  { key: 'bollinger', label: 'Bollinger' },
];

export function Trading() {
  const {
    coins, selectedCoinId, setSelectedCoinId, balance, setBalance,
    positions, addPosition, removePosition, updatePositionPrice,
    trades, addTrade, orders, addOrder, updateOrderStatus, removeOrder,
    simulatePrices,
  } = useStore();

  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [activeIndicators, setActiveIndicators] = useState<IndicatorType[]>(['sma']);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop_loss' | 'take_profit'>('market');
  const [orderPrice, setOrderPrice] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');
  const [showMobileOrder, setShowMobileOrder] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const selectedCoin = coins.find((c) => c.id === selectedCoinId) || coins[0];

  useEffect(() => {
    const newCandles = generateCandles(selectedCoin.price, timeframe, 150);
    setCandles(newCandles);
  }, [selectedCoinId, timeframe, selectedCoin.price]);

  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  useEffect(() => {
    const interval = setInterval(() => {
      simulatePrices();
      checkAndFillOrders();
      const state = useStore.getState();
      const updatedCoin = state.coins.find((c) => c.id === selectedCoinId);
      if (updatedCoin) {
        const newPrice = updatedCoin.price;
        positionsRef.current.forEach((p) => {
          if (p.coinId === selectedCoinId) {
            const pnl = (newPrice - p.entryPrice) * p.quantity * p.leverage;
            updatePositionPrice(p.id, newPrice);
          }
        });
        setCandles((prev) => {
          if (prev.length === 0) return prev;
          const last = { ...prev[prev.length - 1] };
          last.close = newPrice;
          last.high = Math.max(last.high, newPrice);
          last.low = Math.min(last.low, newPrice);
          return [...prev.slice(0, -1), last];
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedCoinId, simulatePrices, updatePositionPrice, setCandles, checkAndFillOrders]);

  const handlePlaceOrder = useCallback(() => {
    const qty = parseFloat(orderQuantity);
    if (!qty || qty <= 0) return;

    const price = orderType === 'market' ? selectedCoin.price : parseFloat(orderPrice);
    if (!price || price <= 0) return;

    if (orderSide === 'buy') {
      const cost = price * qty * leverage;
      if (balance < cost) return;
      const result = executeMarketBuy(selectedCoin.id, selectedCoin.symbol, price, qty, leverage, stopLoss ? parseFloat(stopLoss) : undefined, takeProfit ? parseFloat(takeProfit) : undefined);
      if (result.success) {
        addOrder({
          id: generateId(),
          coinId: selectedCoin.id,
          coinSymbol: selectedCoin.symbol,
          side: orderSide,
          type: orderType,
          price,
          quantity: qty,
          stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
          takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
          leverage,
          timestamp: Date.now(),
          status: 'filled',
        });
      }
    } else {
      const pos = positions.find((p) => p.coinId === selectedCoin.id);
      if (pos) {
        const result = executeMarketSell(pos.id, price);
        if (result.success) {
          addOrder({
            id: generateId(),
            coinId: selectedCoin.id,
            coinSymbol: selectedCoin.symbol,
            side: orderSide,
            type: 'market',
            price,
            quantity: pos.quantity,
            leverage,
            timestamp: Date.now(),
            status: 'filled',
          });
        }
      }
    }

    setOrderPrice('');
    setOrderQuantity('');
    setStopLoss('');
    setTakeProfit('');
  }, [orderQuantity, orderPrice, orderType, orderSide, selectedCoin, leverage, stopLoss, takeProfit, balance, positions, addOrder]);

  const estimatedCost = useMemo(() => {
    const qty = parseFloat(orderQuantity) || 0;
    const price = orderType === 'market' ? selectedCoin.price : (parseFloat(orderPrice) || 0);
    return price * qty * leverage;
  }, [orderQuantity, orderPrice, orderType, selectedCoin.price, leverage]);

  const fees = useMemo(() => estimatedCost * 0.001, [estimatedCost]);

  const potentialPnl = useMemo(() => {
    if (!parseFloat(orderQuantity) || !parseFloat(orderPrice) && orderType !== 'market') return null;
    const qty = parseFloat(orderQuantity);
    const entry = orderType === 'market' ? selectedCoin.price : parseFloat(orderPrice);
    if (orderSide === 'buy') {
      const tp = takeProfit ? parseFloat(takeProfit) : entry * 1.05;
      const sl = stopLoss ? parseFloat(stopLoss) : entry * 0.95;
      const profit = (tp - entry) * qty * leverage;
      const loss = (entry - sl) * qty * leverage;
      return { profit, loss, rr: loss > 0 ? profit / loss : 0 };
    }
    return null;
  }, [orderQuantity, orderPrice, orderType, selectedCoin.price, leverage, takeProfit, stopLoss, orderSide]);

  const filteredCoins = coins.filter((c) =>
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closePrices = candles.map((c) => c.close);
  const smaData = activeIndicators.includes('sma') ? calculateSMA(closePrices, 20) : [];
  const emaData = activeIndicators.includes('ema') ? calculateEMA(closePrices, 12) : [];
  const rsiData = activeIndicators.includes('rsi') ? calculateRSI(closePrices) : [];
  const macdData = activeIndicators.includes('macd') ? calculateMACD(closePrices) : { macd: [], signal: [], histogram: [] };
  const bollingerData = activeIndicators.includes('bollinger') ? calculateBollingerBands(closePrices) : { upper: [], middle: [], lower: [] };

  const indicators = useMemo(() => ({
    sma: activeIndicators.includes('sma') ? smaData : undefined,
    ema: activeIndicators.includes('ema') ? emaData : undefined,
    rsi: activeIndicators.includes('rsi') ? rsiData : undefined,
    macd: activeIndicators.includes('macd') ? macdData : undefined,
    bollinger: activeIndicators.includes('bollinger') ? bollingerData : undefined,
  }), [activeIndicators, smaData, emaData, rsiData, macdData, bollingerData]);

  const openOrders = orders.filter((o) => o.status === 'open');
  const filledOrders = orders.filter((o) => o.status === 'filled');

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
<h1 className="text-2xl font-bold text-text-primary tracking-tight">Trading Terminal</h1>
           <p className="text-text-secondary text-sm mt-1">Trade simulated crypto assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <SimulatedLabel />
          <button
            onClick={() => setShowMobileOrder(!showMobileOrder)}
            className="md:hidden px-3 py-2 bg-accent text-white rounded-lg text-sm"
          >
            {showMobileOrder ? 'Hide Order' : 'Order'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Coin Selector */}
        <div className="lg:col-span-2 space-y-2">
<div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="space-y-0.5 max-h-[500px] overflow-y-auto">
{filteredCoins.map((coin) => (
              <button
                key={coin.id}
                onClick={() => { setSelectedCoinId(coin.id); setSearchQuery(''); setShowMobileOrder(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selectedCoinId === coin.id
                    ? 'bg-accent/10 text-accent border border-accent/20 glow-accent'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-bg-hover border border-border-light flex items-center justify-center text-xs font-bold">
                  {coin.icon}
                </span>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-xs">{coin.symbol}</div>
                  <div className="text-[10px] text-text-secondary">{formatPrice(coin.price)}</div>
                </div>
                <div className={`text-[10px] font-semibold ${coin.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatPercent(coin.change24h)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Chart */}
        <div className="lg:col-span-7 space-y-2">
          <Card glow>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-text-primary tracking-tight">{selectedCoin.symbol}</span>
                <span className="text-text-secondary text-xs">{selectedCoin.name}</span>
                <span className={`text-sm font-semibold ${selectedCoin.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatPercent(selectedCoin.change24h)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-text-primary">{formatPrice(selectedCoin.price)}</span>
                {selectedCoin.price >= selectedCoin.prevPrice ? (
                  <ArrowUpRight size={18} className="text-profit" />
                ) : (
                  <ArrowDownRight size={18} className="text-loss" />
                )}
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1 mb-2">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                    timeframe === tf ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  }`}
                >
                  {tf}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                    showIndicatorPanel ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  }`}
                >
                  Indicators
                </button>
              </div>
            </div>

            {/* Indicators panel */}
            {showIndicatorPanel && (
              <div className="flex flex-wrap gap-1 mb-2">
{INDICATORS.map((ind) => (
                      <button
                        key={ind.key}
                        onClick={() => {
                          setActiveIndicators((prev) =>
                            prev.includes(ind.key) ? prev.filter((k) => k !== ind.key) : [...prev, ind.key]
                          );
                        }}
                        className={`px-2 py-1 rounded text-xs border transition-all duration-200 ${
                          activeIndicators.includes(ind.key)
                            ? 'bg-accent/10 text-accent border-accent/30'
                            : 'text-text-secondary border-border-light hover:bg-bg-hover'
                        }`}
                      >
                        {ind.label}
                      </button>
                    ))}
              </div>
            )}

            {/* Chart */}
            <div ref={chartContainerRef} style={{ height: 350 }} className="rounded-lg border border-border-light overflow-hidden">
              <CandlestickChart
                candles={candles}
                indicators={indicators}
                activeIndicators={activeIndicators}
              />
            </div>

            {/* RSI Panel */}
            {activeIndicators.includes('rsi') && (
              <div className="mt-2" style={{ height: 60 }}>
                <div className="bg-bg-panel border border-border-light rounded-lg p-2">
                  <CandlestickChart
                    candles={candles}
                    indicators={{ rsi: rsiData }}
                    activeIndicators={['rsi']}
                  />
                </div>
              </div>
            )}

            {/* MACD Panel */}
            {activeIndicators.includes('macd') && (
              <div className="mt-2" style={{ height: 60 }}>
                <div className="bg-bg-panel border border-border-light rounded-lg p-2">
                  <CandlestickChart
                    candles={candles}
                    indicators={{ macd: macdData }}
                    activeIndicators={['macd']}
                  />
                </div>
              </div>
            )}
          </Card>

{/* Bottom Tabs */}
          <Card>
            <div className="flex items-center gap-1 mb-3">
              {[
                { key: 'positions', label: 'Open Positions', count: positions.length },
                { key: 'orders', label: 'Open Orders', count: openOrders.length },
                { key: 'history', label: 'Trade History', count: trades.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.key ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {activeTab === 'positions' && (
              <div className="overflow-x-auto">
                {positions.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-text-secondary text-xs border-b border-border-light">
                        <th className="text-left py-2.5 font-medium">Asset</th>
                        <th className="text-right py-2.5 font-medium">Entry</th>
                        <th className="text-right py-2.5 font-medium">Current</th>
                        <th className="text-right py-2.5 font-medium">Qty</th>
                        <th className="text-right py-2.5 font-medium">PnL</th>
                        <th className="text-right py-2.5 font-medium">PnL %</th>
                        <th className="text-right py-2.5 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((p) => {
                        const coin = coins.find((c) => c.id === p.coinId);
                        return (
                          <tr key={p.id} className="table-row">
                            <td className="py-2.5 font-medium">{coin?.symbol || p.coinId}</td>
                            <td className="py-2.5 text-right text-text-primary">{formatPrice(p.entryPrice)}</td>
                            <td className="py-2.5 text-right text-text-primary">{formatPrice(p.currentPrice)}</td>
                            <td className="py-2.5 text-right">{p.quantity}</td>
                            <td className={`py-2.5 text-right font-semibold ${p.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                              {formatCurrency(p.pnl)}
                            </td>
                            <td className={`py-2.5 text-right font-semibold ${p.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                              {formatPercent(p.pnlPct)}
                            </td>
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => {
                                  const result = executeMarketSell(p.id, p.currentPrice);
                                  if (result.success) {
                                    const coin = coins.find((c) => c.id === p.coinId);
                                    addOrder({
                                      id: generateId(),
                                      coinId: p.coinId,
                                      coinSymbol: coin?.symbol || '',
                                      side: 'sell',
                                      type: 'market',
                                      price: p.currentPrice,
                                      quantity: p.quantity,
                                      leverage: p.leverage,
                                      timestamp: Date.now(),
                                      status: 'filled',
                                    });
                                  }
                                }}
                                className="px-2 py-1 text-xs bg-loss/10 text-loss rounded-lg font-semibold hover:bg-loss/20 transition-colors"
                              >
                                Close
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-text-secondary text-sm py-6">No open positions</div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                {openOrders.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-text-secondary text-xs border-b border-border-light">
                        <th className="text-left py-2.5 font-medium">Asset</th>
                        <th className="text-left py-2.5 font-medium">Side</th>
                        <th className="text-left py-2.5 font-medium">Type</th>
                        <th className="text-right py-2.5 font-medium">Price</th>
                        <th className="text-right py-2.5 font-medium">Qty</th>
                        <th className="text-right py-2.5 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openOrders.map((o) => (
                        <tr key={o.id} className="table-row">
                          <td className="py-2.5 font-medium">{o.coinSymbol}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${o.side === 'buy' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'}`}>
                              {o.side.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2.5 capitalize text-text-primary">{o.type.replace('_', ' ')}</td>
                          <td className="py-2.5 text-right text-text-primary">{formatPrice(o.price)}</td>
                          <td className="py-2.5 text-right">{o.quantity}</td>
                          <td className="py-2.5 text-right text-accent">{o.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-text-secondary text-sm py-6">No open orders</div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="overflow-x-auto max-h-60 overflow-y-auto">
                {trades.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-text-secondary text-xs border-b border-border-light">
                        <th className="text-left py-2.5 font-medium">Asset</th>
                        <th className="text-left py-2.5 font-medium">Side</th>
                        <th className="text-left py-2.5 font-medium">Type</th>
                        <th className="text-right py-2.5 font-medium">Entry</th>
                        <th className="text-right py-2.5 font-medium">Exit</th>
                        <th className="text-right py-2.5 font-medium">Qty</th>
                        <th className="text-right py-2.5 font-medium">Fees</th>
                        <th className="text-right py-2.5 font-medium">PnL</th>
                        <th className="text-left py-2.5 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.slice(0, 20).map((t) => (
                        <tr key={t.id} className="table-row">
                          <td className="py-2.5 font-medium text-text-primary">{t.coinSymbol}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${t.side === 'buy' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'}`}>
                              {t.side.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2.5 capitalize text-text-primary">{t.type.replace('_', ' ')}</td>
                          <td className="py-2.5 text-right text-text-primary">{formatPrice(t.entryPrice)}</td>
                          <td className="py-2.5 text-right text-text-primary">{formatPrice(t.exitPrice)}</td>
                          <td className="py-2.5 text-right">{t.quantity}</td>
                          <td className="py-2.5 text-right text-text-secondary">{formatCurrency(t.fees)}</td>
                          <td className={`py-2.5 text-right font-semibold ${t.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                            {formatCurrency(t.pnl)}
                          </td>
                          <td className="py-2.5 text-text-secondary">{formatDate(t.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-text-secondary text-sm py-6">No trade history yet</div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Order Panel */}
        <div className={`lg:col-span-3 ${showMobileOrder ? 'block' : 'hidden'} lg:block`}>
          <Card>
            <h3 className="section-title">Place Order</h3>

{/* Buy/Sell toggle */}
            <div className="grid grid-cols-2 gap-1 bg-bg-hover rounded-lg p-1">
              <button
                onClick={() => setOrderSide('buy')}
                className={`py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  orderSide === 'buy' ? 'bg-profit text-white shadow-lg shadow-profit/20' : 'text-text-muted'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderSide('sell')}
                className={`py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  orderSide === 'sell' ? 'bg-loss text-white shadow-lg shadow-loss/20' : 'text-text-muted'
                }`}
              >
                Sell
              </button>
            </div>

{/* Order type */}
            <div className="flex gap-1">
              {(['market', 'limit', 'stop_loss', 'take_profit'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-1.5 rounded text-xs font-semibold transition-all duration-200 ${
                    orderType === type ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:bg-bg-hover'
                  }`}
                >
                  {type === 'stop_loss' ? 'Stop Loss' : type === 'take_profit' ? 'Take Profit' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Price input */}
            {orderType !== 'market' && (
<div>
                  <label className="text-xs text-text-secondary block mb-1">Price (USDT)</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="number"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)}
                      placeholder={selectedCoin.price.toFixed(2)}
                      className="input-field"
                    />
                  </div>
                </div>
            )}

            {/* Quantity */}
<div>
                  <label className="text-xs text-text-secondary block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    placeholder="0.00"
                    step="0.0001"
                    className="input-field"
                  />
                </div>

            {/* Leverage */}
<div>
                  <label className="text-xs text-text-secondary block mb-1">Leverage: {leverage}x</label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={leverage}
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    className="w-full accent-accent"
                  />
                  <div className="flex justify-between text-[10px] text-text-secondary mt-0.5">
                    <span>1x</span><span>5x</span><span>10x</span><span>20x</span>
                  </div>
                </div>

            {/* Stop Loss / Take Profit */}
            {(orderType === 'market' || orderType === 'stop_loss' || orderType === 'take_profit') && (
              <>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Stop Loss (optional)</label>
                  <div className="relative">
                    <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="number"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      placeholder="0.00"
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Take Profit (optional)</label>
                  <div className="relative">
                    <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="number"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      placeholder="0.00"
                      className="input-field"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Order summary */}
            <div className="bg-bg-hover rounded-lg p-3 space-y-1.5 border border-border-light">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Estimated Cost</span>
                <span className="text-text-primary font-medium">{formatCurrency(estimatedCost)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Fees (0.1%)</span>
                <span className="text-text-primary font-medium">{formatCurrency(fees)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Available</span>
                <span className="text-text-primary font-medium">{formatCurrency(balance)}</span>
              </div>
              {potentialPnl && orderSide === 'buy' && (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Potential Profit</span>
                    <span className="text-profit font-medium">{formatCurrency(potentialPnl.profit)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Potential Loss</span>
                    <span className="text-loss font-medium">{formatCurrency(potentialPnl.loss)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Risk/Reward</span>
                    <span className="text-accent font-medium">1:{potentialPnl.rr.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Place order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!parseFloat(orderQuantity) || (orderType !== 'market' && !parseFloat(orderPrice))}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg ${
                orderSide === 'buy'
                  ? 'bg-profit hover:bg-profit/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-profit/20'
                  : 'bg-loss hover:bg-loss/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-loss/20'
              }`}
            >
              {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedCoin.symbol}
            </button>
          </Card>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
