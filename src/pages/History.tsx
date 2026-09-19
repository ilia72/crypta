import { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import { formatPrice, formatCurrency, formatDate } from '../utils/formatters';
import { Search, ArrowUpDown } from 'lucide-react';

type SortField = 'date' | 'asset' | 'side' | 'pnl' | 'fees';
type SortDir = 'asc' | 'desc';

export function History() {
  const { coins, trades } = useStore();
  const [filterSide, setFilterSide] = useState<'all' | 'buy' | 'sell'>('all');
  const [filterAsset, setFilterAsset] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = useMemo(() => {
    let data = [...trades];
    if (filterSide !== 'all') data = data.filter((t) => t.side === filterSide);
    if (filterAsset) {
      data = data.filter((t) => {
        const coin = coins.find((c) => c.id === t.coinId);
        return coin?.symbol.toLowerCase().includes(filterAsset.toLowerCase());
      });
    }
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'date': cmp = a.timestamp - b.timestamp; break;
        case 'asset': cmp = a.coinSymbol.localeCompare(b.coinSymbol); break;
        case 'side': cmp = a.side.localeCompare(b.side); break;
        case 'pnl': cmp = a.pnl - b.pnl; break;
        case 'fees': cmp = a.fees - b.fees; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [trades, filterSide, filterAsset, sortField, sortDir, coins]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Trade History</h1>
          <p className="text-text-secondary text-sm mt-1">Review all your past trades.</p>
        </div>
        <SimulatedLabel />
      </div>

      {/* Filters */}
      <Card className="!p-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-1.5">
            {(['all', 'buy', 'sell'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterSide(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  filterSide === s
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'text-text-secondary bg-bg-hover hover:bg-border-light hover:text-text-primary border border-border-light'
                }`}
              >
                {s === 'all' ? 'All' : s.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Filter by asset..."
              value={filterAsset}
              onChange={(e) => setFilterAsset(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary text-xs border-b border-border-light">
                  {[
                    { field: 'date' as SortField, label: 'Date' },
                    { field: 'asset' as SortField, label: 'Asset' },
                    { field: 'side' as SortField, label: 'Side' },
                    { field: 'pnl' as SortField, label: 'PnL' },
                    { field: 'fees' as SortField, label: 'Fees' },
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
                  <th className="text-left py-2.5 font-medium">Entry</th>
                  <th className="text-left py-2.5 font-medium">Exit</th>
                  <th className="text-left py-2.5 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const coin = coins.find((c) => c.id === t.coinId);
                  return (
                    <tr key={t.id} className="table-row">
                      <td className="py-2.5 text-text-secondary">{formatDate(t.timestamp)}</td>
                      <td className="py-2.5 font-medium text-text-primary">{coin?.symbol || t.coinSymbol}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${t.side === 'buy' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'}`}>
                          {t.side.toUpperCase()}
                        </span>
                      </td>
                      <td className={`py-2.5 font-semibold ${t.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {formatCurrency(t.pnl)}
                      </td>
                      <td className="py-2.5 text-text-secondary">{formatCurrency(t.fees)}</td>
                      <td className="py-2.5 text-text-secondary">{formatPrice(t.entryPrice)}</td>
                      <td className="py-2.5 text-text-secondary">{formatPrice(t.exitPrice)}</td>
                      <td className="py-2.5 text-text-secondary capitalize">{t.type.replace('_', ' ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-text-secondary py-16">
            <p>No trades found.</p>
          </div>
        )}
      </Card>

      <Disclaimer />
    </div>
  );
}
