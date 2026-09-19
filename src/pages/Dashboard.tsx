import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import { formatPrice, formatPercent, formatCurrency, formatNumber } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Search, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext';

export function Dashboard() {
  const { coins, positions, trades, watchlist, balance, simulatePrices } = useStore();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const watchlistCoins = coins.filter((c) => watchlist.some((w) => w.coinId === c.id));
  const topMovers = [...coins].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 5);
  const searchResults = coins.filter((c) =>
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const totalPositionValue = positions.reduce((sum, p) => sum + p.currentPrice * p.quantity * p.leverage, 0);
  const unrealizedPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const totalPnl = unrealizedPnl;
  const todayPnl = trades.filter((t) => Date.now() - t.timestamp < 86400000).reduce((sum, t) => sum + t.pnl, 0);
  const totalValue = balance + totalPositionValue;

  const allocationData = positions.length > 0
    ? positions.map((p) => {
        const coin = coins.find((c) => c.id === p.coinId);
        const value = p.currentPrice * p.quantity * p.leverage;
        return {
          name: coin?.symbol || p.coinId,
          value,
          color: ['#58a6ff', '#3fb950', '#f85149', '#d4a72c', '#a371f7', '#ec4899', '#06b6d4', '#f97316'][positions.indexOf(p) % 8],
        };
      })
    : [];

  const marketCapTotal = coins.reduce((sum, c) => sum + c.marketCap, 0);
  const totalVolume = coins.reduce((sum, c) => sum + c.volume24h, 0);
  const btcDominance = coins[0] ? (coins[0].marketCap / marketCapTotal) * 100 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      simulatePrices();
    }, 3000);
    return () => clearInterval(interval);
  }, [simulatePrices]);

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{t.dashboard}</h1>
          <p className="text-text-secondary text-sm mt-1">{t.welcomeBack}</p>
        </div>
        <SimulatedLabel />
      </div>

      {/* Search */}
      <div className="relative max-w-md hidden md:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder={t.searchCoins}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchResults.length > 0) {
              navigate('/trade');
            }
          }}
          className="input-field"
        />
        {searchQuery && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-bg-panel border border-border-light rounded-lg mt-1 max-h-48 overflow-y-auto z-10 shadow-card">
            {searchResults.map((coin) => (
              <div
                key={coin.id}
                onClick={() => { setSearchQuery(''); navigate('/trade'); }}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-bg-hover cursor-pointer transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-bg-hover border border-border-light flex items-center justify-center text-xs font-bold text-accent">{coin.icon}</span>
                <span className="text-sm font-medium text-text-primary">{coin.symbol}</span>
                <span className="text-xs text-text-secondary">{formatPrice(coin.price)}</span>
                <span className={`text-xs ml-auto font-medium ${coin.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>{formatPercent(coin.change24h)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glow>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <Wallet size={14} /> {t.portfolioValue}
          </div>
          <div className="text-xl font-bold text-text-primary tracking-tight">{formatCurrency(totalValue)}</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <Wallet size={14} /> {t.availableBalance}
          </div>
          <div className="text-xl font-bold text-text-primary tracking-tight">{formatCurrency(balance)}</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            {totalPnl >= 0 ? <TrendingUp size={14} className="text-profit" /> : <TrendingDown size={14} className="text-loss" />}
            {t.totalPnl}
          </div>
          <div className={`text-xl font-bold tracking-tight ${totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(totalPnl)}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            {todayPnl >= 0 ? <ArrowUpRight size={14} className="text-profit" /> : <ArrowDownRight size={14} className="text-loss" />}
            {t.todayPnl}
          </div>
          <div className={`text-xl font-bold tracking-tight ${todayPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(todayPnl)}
          </div>
        </Card>
      </div>

      {/* Market Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <Activity size={14} /> {t.marketCap}
          </div>
          <div className="text-xl font-bold text-text-primary tracking-tight">{formatNumber(marketCapTotal)}</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <Activity size={14} /> {t.volume24h}
          </div>
          <div className="text-xl font-bold text-text-primary tracking-tight">{formatNumber(totalVolume)}</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <Activity size={14} /> {t.btcDominance}
          </div>
          <div className="text-xl font-bold text-text-primary tracking-tight">{btcDominance.toFixed(1)}%</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <Activity size={14} /> {t.openPositions}
          </div>
          <div className="text-xl font-bold text-text-primary tracking-tight">{positions.length}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Portfolio Allocation */}
        <Card>
          <h3 className="section-title">{t.allocation}</h3>
          {allocationData.length > 0 ? (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} stroke="none">
                      {allocationData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1.5">
                {allocationData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-text-secondary">{item.name}</span>
                    </div>
                    <span className="text-text-primary font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-secondary text-sm">
              {t.noPositions}
            </div>
          )}
        </Card>

        {/* Open Positions */}
        <Card>
          <h3 className="section-title">{t.openPositions}</h3>
          {positions.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {positions.map((p) => {
                const coin = coins.find((c) => c.id === p.coinId);
                return (
                  <div key={p.id} className="flex items-center justify-between bg-bg-hover rounded-lg p-2.5 border border-border-light/50">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{coin?.symbol || p.coinId}</div>
                      <div className="text-xs text-text-secondary">{formatPrice(p.entryPrice)} × {p.quantity}</div>
                    </div>
                    <div className={`text-sm font-semibold ${p.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatPercent(p.pnlPct)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-secondary text-sm">
              No open positions.
            </div>
          )}
        </Card>

        {/* Market Overview */}
        <Card>
<h3 className="section-title">{t.marketOverview}</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {topMovers.map((coin) => (
              <div key={coin.id} className="flex items-center justify-between bg-bg-hover rounded-lg p-2.5 border border-border-light/50">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-bg-panel border border-border-light flex items-center justify-center text-xs font-bold text-accent">
                    {coin.icon}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{coin.symbol}</div>
                    <div className="text-xs text-text-secondary">{formatPrice(coin.price)}</div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${coin.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatPercent(coin.change24h)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Watchlist & Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="section-title">{t.watchlistTitle}</h3>
          {watchlistCoins.length > 0 ? (
            <div className="space-y-2">
              {watchlistCoins.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between bg-bg-hover rounded-lg p-2.5 border border-border-light/50">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-bg-panel border border-border-light flex items-center justify-center text-xs font-bold text-accent">
                      {coin.icon}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{coin.symbol}</div>
                      <div className="text-xs text-text-secondary">{coin.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-text-primary">{formatPrice(coin.price)}</div>
                    <div className={`text-xs font-medium ${coin.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatPercent(coin.change24h)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-text-secondary text-sm">
              {t.noWatchlist}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="section-title">{t.recentTrades}</h3>
          {trades.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {trades.slice(0, 10).map((t) => {
                const coin = coins.find((c) => c.id === t.coinId);
                return (
                  <div key={t.id} className="flex items-center justify-between bg-bg-hover rounded-lg p-2.5 border border-border-light/50">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.side === 'buy' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'}`}>
                        {t.side.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-text-primary">{coin?.symbol || t.coinSymbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-primary">{formatPrice(t.exitPrice)}</div>
                      <div className={`text-xs font-medium ${t.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {formatCurrency(t.pnl)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-text-secondary text-sm">
              {t.noTrades}
            </div>
          )}
        </Card>
      </div>

      {/* Market Table */}
      <Card>
        <h3 className="section-title">{t.marketOverview}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-secondary text-xs border-b border-border-light">
                <th className="text-left py-2.5 font-medium">{t.asset}</th>
                <th className="text-right py-2.5 font-medium">{t.price}</th>
                <th className="text-right py-2.5 font-medium">24h %</th>
                <th className="text-right py-2.5 font-medium">7d %</th>
                <th className="text-right py-2.5 font-medium">{t.volume}</th>
                <th className="text-right py-2.5 font-medium">{t.marketCap}</th>
              </tr>
            </thead>
            <tbody>
              {coins.slice(0, 10).map((coin) => (
                <tr key={coin.id} className="table-row cursor-pointer" onClick={() => navigate('/trade')}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-bg-hover border border-border-light flex items-center justify-center text-xs font-bold text-accent">
                        {coin.icon}
                      </span>
                      <div>
                        <div className="font-medium text-text-primary text-sm">{coin.symbol}</div>
                        <div className="text-xs text-text-secondary">{coin.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-text-primary font-medium">{formatPrice(coin.price)}</td>
                  <td className={`py-3 font-semibold ${coin.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {formatPercent(coin.change24h)}
                  </td>
                  <td className={`py-3 font-semibold ${coin.change7d >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {formatPercent(coin.change7d)}
                  </td>
                  <td className="py-3 text-text-secondary">{formatNumber(coin.volume24h)}</td>
                  <td className="py-3 text-text-secondary">{formatNumber(coin.marketCap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Disclaimer />
    </div>
  );
}
