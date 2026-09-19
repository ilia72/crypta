import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import { Check, Trophy, Play } from 'lucide-react';

export function Challenges() {
  const { challenges, completeChallenge, completedChallengeCount, positions, trades } = useStore();

  const checkChallenge = (challengeId: string): boolean => {
    switch (challengeId) {
      case 'c1': return trades.some((t) => t.side === 'buy' && t.coinSymbol === 'BTC');
      case 'c2': return trades.some((t) => t.type === 'limit');
      case 'c3': return trades.some((t) => t.type === 'stop_loss');
      case 'c4': return positions.length > 0;
      case 'c5': return trades.length > 0;
      case 'c6': {
        const uniqueCoins = new Set(trades.map((t) => t.coinId));
        return uniqueCoins.size >= 4;
      }
      default: return false;
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Challenges</h1>
          <p className="text-text-secondary text-sm mt-1">
            {completedChallengeCount()}/{challenges.length} challenges completed
          </p>
        </div>
        <SimulatedLabel />
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-bg-hover rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-profit rounded-full transition-all duration-500"
              style={{ width: `${(completedChallengeCount() / challenges.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-text-primary">
            {Math.round((completedChallengeCount() / challenges.length) * 100)}%
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => {
          const completed = checkChallenge(challenge.id) || challenge.completed;
          return (
            <Card key={challenge.id} className={`transition-all duration-200 ${completed ? 'glow-profit border-profit/30' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    completed ? 'bg-profit/10 text-profit' : 'bg-bg-hover text-accent'
                  }`}>
                    {completed ? <Check size={20} /> : <Trophy size={20} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{challenge.title}</h3>
                    <span className="text-xs text-accent font-semibold">+{challenge.xp} XP</span>
                  </div>
                </div>
                {completed && <Check size={16} className="text-profit" />}
              </div>
              <p className="text-xs text-text-secondary mb-3">{challenge.description}</p>
              <div className="space-y-1.5 mb-3">
                {challenge.instructions.map((inst, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                    <span className="w-4 h-4 rounded-full bg-bg-hover flex items-center justify-center text-[10px] text-text-muted">
                      {i + 1}
                    </span>
                    {inst}
                  </div>
                ))}
              </div>
              {completed ? (
                <div className="flex items-center gap-1 text-xs text-profit font-semibold">
                  <Check size={12} /> Completed
                </div>
              ) : (
                <button
                  onClick={() => completeChallenge(challenge.id)}
                  className="w-full py-2 rounded-lg text-xs font-semibold btn-primary flex items-center justify-center gap-1"
                >
                  <Play size={12} /> Start Challenge
                </button>
              )}
            </Card>
          );
        })}
      </div>

      <Disclaimer />
    </div>
  );
}
