import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import { formatPrice, formatPercent, formatCurrency } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

export function Portfolio() {
  const { coins, positions, trades, balance, realizedPnl, totalTrades, winningTrades, totalProfit, totalLoss } = useStore();

  const totalInvested = positions.reduce((sum, p) => sum + p.entryPrice * p.quantity * p.leverage, 0);
  const totalPositionValue = positions.reduce((sum, p) => sum + p.currentPrice * p.quantity * p.leverage, 0);
  const unrealizedPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
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

  const performanceData = trades.slice(0, 20).map((t, i) => ({
    name: `#${i + 1}`,
    pnl: t.pnl,
  }));

  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const avgProfit = totalProfit > 0 && winningTrades > 0 ? totalProfit / winningTrades : 0;
  const avgLoss = totalLoss > 0 && (totalTrades - winningTrades) > 0 ? totalLoss / (totalTrades - winningTrades) : 0;
  const rrRatio = avgLoss > 0 ? avgProfit / avgLoss : 0;

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Portfolio</h1>
          <p className="text-text-secondary text-sm mt-1">Detailed view of your trading performance.</p>
        </div>
        <SimulatedLabel />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glow>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <Wallet size={14} /> Total Balance
          </div>
          <div className="text-xl font-bold text-text-primary tracking-tight">{formatCurrency(totalValue)}</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <TrendingUp size={14} className="text-profit" /> Unrealized PnL
          </div>
          <div className={`text-xl font-bold tracking-tight ${unrealizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(unrealizedPnl)}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <Target size={14} /> Win Rate
          </div>
          <div className="text-xl font-bold text-text-primary tracking-tight">{winRate.toFixed(1)}%</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
            <Award size={14} /> Risk/Reward
          </div>
          <div className="text-xl font-bold text-accent tracking-tight">1:{rrRatio.toFixed(2)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Allocation */}
        <Card>
          <h3 className="section-title">Asset Allocation</h3>
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
              No positions yet.
            </div>
          )}
        </Card>

        {/* Performance */}
        <Card className="lg:col-span-2">
          <h3 className="section-title">Trade Performance</h3>
          {performanceData.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                  <XAxis dataKey="name" stroke="#484f58" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#484f58" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c2128', border: '1px solid #30363d', borderRadius: '8px' }}
                    formatter={(value: number) => [formatCurrency(value), 'PnL']}
                  />
                  <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                    {performanceData.map((entry, index) => (
                      <Cell key={index} fill={entry.pnl >= 0 ? '#3fb950' : '#f85149'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-text-secondary text-sm">
              No trade data yet.
            </div>
          )}
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs text-text-secondary mb-1">Total Trades</div>
          <div className="text-lg font-bold text-text-primary">{totalTrades}</div>
        </Card>
        <Card>
          <div className="text-xs text-text-secondary mb-1">Realized PnL</div>
          <div className={`text-lg font-bold ${realizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(realizedPnl)}
          </div>
        </Card>
        <Card>
          <div className="text-xs text-text-secondary mb-1">Avg Profit</div>
          <div className="text-lg font-bold text-profit">{formatCurrency(avgProfit)}</div>
        </Card>
        <Card>
          <div className="text-xs text-text-secondary mb-1">Avg Loss</div>
          <div className="text-lg font-bold text-loss">{formatCurrency(avgLoss)}</div>
        </Card>
      </div>

      {/* Holdings */}
      <Card>
        <h3 className="section-title">Holdings</h3>
        {positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary text-xs border-b border-border-light">
                  <th className="text-left py-2.5 font-medium">Asset</th>
                  <th className="text-right py-2.5 font-medium">Entry Price</th>
                  <th className="text-right py-2.5 font-medium">Current</th>
                  <th className="text-right py-2.5 font-medium">Quantity</th>
                  <th className="text-right py-2.5 font-medium">Value</th>
                  <th className="text-right py-2.5 font-medium">PnL</th>
                  <th className="text-right py-2.5 font-medium">PnL %</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => {
                  const coin = coins.find((c) => c.id === p.coinId);
                  return (
                    <tr key={p.id} className="table-row">
                      <td className="py-3 font-medium">{coin?.symbol || p.coinId}</td>
                      <td className="py-3 text-right text-text-primary">{formatPrice(p.entryPrice)}</td>
                      <td className="py-3 text-right text-text-primary">{formatPrice(p.currentPrice)}</td>
                      <td className="py-3 text-right">{p.quantity}</td>
                      <td className="py-3 text-right text-text-primary">{formatCurrency(p.currentPrice * p.quantity * p.leverage)}</td>
                      <td className={`py-3 text-right font-semibold ${p.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {formatCurrency(p.pnl)}
                      </td>
                      <td className={`py-3 text-right font-semibold ${p.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {formatPercent(p.pnlPct)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-text-secondary text-sm py-6">No holdings yet.</div>
        )}
      </Card>

      <Disclaimer />
    </div>
  );
}
