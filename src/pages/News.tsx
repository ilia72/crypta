import { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import { generateNewsEvents } from '../utils/marketEngine';
import { formatDate } from '../utils/formatters';
import { Activity, TrendingUp, TrendingDown, Minus, Radio } from 'lucide-react';

export function News() {
  const { coins } = useStore();
  const [events] = useState(() => generateNewsEvents(coins));
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter((e) => e.type === filter);
  }, [events, filter]);

  const typeIcons = {
    bullish: TrendingUp,
    bearish: TrendingDown,
    neutral: Minus,
  };

  const typeColors = {
    bullish: 'text-profit',
    bearish: 'text-loss',
    neutral: 'text-text-muted',
  };

  const typeBgColors = {
    bullish: 'bg-profit/10',
    bearish: 'bg-loss/10',
    neutral: 'bg-bg-hover',
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Market News</h1>
          <p className="text-text-secondary text-sm mt-1">Simulated market events and educational insights.</p>
        </div>
        <SimulatedLabel />
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {(['all', 'bullish', 'bearish', 'neutral'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${
              filter === f
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'text-text-secondary bg-bg-hover hover:bg-border-light hover:text-text-primary border border-border-light'
            }`}
          >
            {f === 'all' ? 'All Events' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((event) => {
          const Icon = typeIcons[event.type];
          return (
            <Card key={event.id} className={`border-l-4 transition-all duration-200 ${
              event.type === 'bullish' ? 'border-l-profit' :
              event.type === 'bearish' ? 'border-l-loss' :
              'border-l-accent'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${typeBgColors[event.type]} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={16} className={typeColors[event.type]} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${typeColors[event.type]}`}>{event.type.toUpperCase()}</span>
                    <span className="text-xs text-text-secondary">{formatDate(event.time)}</span>
                    <span className="text-[10px] bg-bg-hover text-text-secondary px-1.5 py-0.5 rounded font-medium">SIMULATED</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">{event.title}</h3>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border-accent/30 glow-accent">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={16} className="text-accent" />
          <h3 className="text-sm font-semibold text-accent">Important Notice</h3>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          All news events on this platform are simulated and generated for educational purposes only.
          They do not reflect real-world financial news, market events, or any actual cryptocurrency developments.
          This is a demo trading simulator — no real money is involved.
        </p>
      </Card>

      <Disclaimer />
    </div>
  );
}
