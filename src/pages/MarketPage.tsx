import { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import { formatPrice, formatPercent, formatNumber } from '../utils/formatters';
import { Search, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ['All', 'Large Cap', 'DeFi', 'Layer 1', 'Layer 2', 'Stablecoins'];

export function MarketPage() {
  const { coins, setSelectedCoinId, setActivePage } = useStore();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let data = [...coins];
    if (category !== 'All') data = data.filter((c) => c.category === category);
    if (search) {
      data = data.filter((c) =>
        c.symbol.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'rank': cmp = a.rank - b.rank; break;
        case 'price': cmp = a.price - b.price; break;
        case 'change24h': cmp = a.change24h - b.change24h; break;
        case 'volume24h': cmp = a.volume24h - b.volume24h; break;
        case 'marketCap': cmp = a.marketCap - b.marketCap; break;
        default: cmp = a.rank - b.rank;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [coins, category, search, sortBy, sortDir]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Markets</h1>
          <p className="text-text-secondary text-sm mt-1">Explore all available cryptocurrencies.</p>
        </div>
        <SimulatedLabel />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                category === cat
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-text-secondary bg-bg-hover hover:bg-border-light hover:text-text-primary border border-border-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-secondary text-xs border-b border-border-light">
                {[
                  { field: 'rank', label: 'Rank' },
                  { field: 'name', label: 'Asset' },
                  { field: 'price', label: 'Price' },
                  { field: 'change24h', label: '24h %' },
                  { field: 'change7d', label: '7d %' },
                  { field: 'volume24h', label: 'Volume' },
                  { field: 'marketCap', label: 'Market Cap' },
                ].map((col) => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    className="text-left py-2.5 cursor-pointer hover:text-text-primary transition-colors"
                  >
                    <span className="flex items-center gap-1 font-medium">
                      {col.label}
                      <ArrowUpDown size={10} className="text-text-muted" />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((coin) => (
                <tr
                  key={coin.id}
                  onClick={() => { setSelectedCoinId(coin.id); setActivePage('trade'); }}
                  className="table-row cursor-pointer"
                >
                  <td className="py-3 text-text-secondary font-medium">#{coin.rank}</td>
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
