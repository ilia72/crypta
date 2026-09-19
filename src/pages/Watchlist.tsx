import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import { formatPrice, formatPercent } from '../utils/formatters';
import { Plus, Trash2, ArrowRightLeft } from 'lucide-react';

export function Watchlist() {
  const { coins, watchlist, toggleWatchlist, setSelectedCoinId, setActivePage } = useStore();

  const watchlistCoins = coins.filter((c) => watchlist.some((w) => w.coinId === c.id));

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Watchlist</h1>
          <p className="text-text-secondary text-sm mt-1">Track your favorite cryptocurrencies.</p>
        </div>
        <SimulatedLabel />
      </div>

      {/* Add coin */}
      <Card>
        <h3 className="section-title">Add to Watchlist</h3>
        <div className="flex flex-wrap gap-2">
          {coins
            .filter((c) => !watchlist.some((w) => w.coinId === c.id))
            .map((coin) => (
              <button
                key={coin.id}
                onClick={() => toggleWatchlist(coin.id)}
                className="flex items-center gap-2 px-3 py-1.5 bg-bg-hover border border-border-light rounded-lg text-sm hover:border-accent/50 hover:bg-bg-hover transition-all duration-200"
              >
                <span className="w-5 h-5 rounded-full bg-bg-panel border border-border-light flex items-center justify-center text-[10px] font-bold">
                  {coin.icon}
                </span>
                <span className="text-text-secondary">{coin.symbol}</span>
                <Plus size={12} className="text-accent" />
              </button>
            ))}
        </div>
      </Card>

      {/* Watchlist items */}
      {watchlistCoins.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlistCoins.map((coin) => (
            <Card key={coin.id} className="cursor-pointer hover:border-accent/30 transition-all duration-200" onClick={() => { setSelectedCoinId(coin.id); setActivePage('trade'); }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-bg-hover border border-border-light flex items-center justify-center text-sm font-bold text-accent">
                    {coin.icon}
                  </span>
                  <div>
                    <div className="font-semibold text-text-primary">{coin.symbol}</div>
                    <div className="text-xs text-text-secondary">{coin.name}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWatchlist(coin.id); }}
                  className="p-1 text-text-muted hover:text-loss transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xl font-bold text-text-primary">{formatPrice(coin.price)}</div>
                  <div className="text-xs text-text-secondary">24h Volume: {coin.volume24h.toLocaleString()}</div>
                </div>
                <div className={`text-lg font-bold ${coin.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatPercent(coin.change24h)}
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-text-secondary">
                <span>High: {formatPrice(coin.high24h)}</span>
                <span>Low: {formatPrice(coin.low24h)}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-secondary">
          <ArrowRightLeft size={40} className="mx-auto mb-3 opacity-30" />
          <p>Your watchlist is empty.</p>
          <p className="text-xs mt-1">Add coins above to start tracking them.</p>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
